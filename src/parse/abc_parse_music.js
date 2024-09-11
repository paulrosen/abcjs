var parseKeyVoice = require('./abc_parse_key_voice');
var transpose = require('./abc_transpose');

var tokenizer;
var warn;
var multilineVars;
var tune;
var tuneBuilder;
var header;

var {
  legalAccents,
  volumeDecorations,
  dynamicDecorations,
  accentPseudonyms,
  accentDynamicPseudonyms,
  nonDecorations,
  durations,
  pitches,
  rests,
  accMap,
  tripletQ
} = require('./abc_parse_settings')

var MusicParser = function(_tokenizer, _warn, _multilineVars, _tune, _tuneBuilder, _header) {
	tokenizer = _tokenizer;
	warn = _warn;
	multilineVars = _multilineVars;
	tune = _tune;
	tuneBuilder = _tuneBuilder;
	header = _header;
	this.lineContinuation = false;
}

//
// Parse line of music
//
// This is a stream of <(bar-marking|header|note-group)...> in any order, with optional spaces between each element
// core-note is <open-slur, accidental, pitch:required, octave, duration, close-slur&|tie> with no spaces within that
// chord is <open-bracket:required, core-note:required... close-bracket:required duration> with no spaces within that
// grace-notes is <open-brace:required, (open-slur|core-note:required|close-slur)..., close-brace:required> spaces are allowed
// note-group is <grace-notes, chord symbols&|decorations..., grace-notes, slur&|triplet, chord|core-note, end-slur|tie> spaces are allowed between items
// bar-marking is <ampersand> or <chord symbols&|decorations..., bar:required> spaces allowed
// header is <open-bracket:required, K|M|L|V:required, colon:required, field:required, close-bracket:required> spaces can occur between the colon, in the field, and before the close bracket
// header can also be the only thing on a line. This is true even if it is a continuation line. In this case the brackets are not required.
// a space is a back-tick, a space, or a tab. If it is a back-tick, then there is no end-beam.

// Line preprocessing: anything after a % is ignored (the double %% should have been taken care of before this)
// Then, all leading and trailing spaces are ignored.
// If there was a line continuation, the \n was replaced by a \r and the \ was replaced by a space. This allows the construct
// of having a header mid-line conceptually, but actually be at the start of the line. This is equivolent to putting the header in [ ].

// TODO-PER: How to handle ! for line break?
// TODO-PER: dots before bar, dots before slur
// TODO-PER: U: redefinable symbols.

// Ambiguous symbols:
// "[" can be the start of a chord, the start of a header element or part of a bar line.
// --- if it is immediately followed by "|", it is a bar line
// --- if it is immediately followed by K: L: M: V: it is a header (note: there are other headers mentioned in the standard, but I'm not sure how they would be used.)
// --- otherwise it is the beginning of a chord
// "(" can be the start of a slur or a triplet
// --- if it is followed by a number from 2-9, then it is a triplet
// --- otherwise it is a slur
// "]"
// --- if there is a chord open, then this is the close
// --- if it is after a [|, then it is an invisible bar line
// --- otherwise, it is par of a bar
// "." can be a bar modifier or a slur modifier, or a decoration
// --- if it comes immediately before a bar, it is a bar modifier
// --- if it comes immediately before a slur, it is a slur modifier
// --- otherwise it is a decoration for the next note.
// number:
// --- if it is after a bar, with no space, it is an ending marker
// --- if it is after a ( with no space, it is a triplet count
// --- if it is after a pitch or octave or slash, then it is a duration

// Unambiguous symbols (except inside quoted strings):
// vertical-bar, colon: part of a bar
// ABCDEFGabcdefg: pitch
// xyzZ: rest
// comma, prime: octave
// close-paren: end-slur
// hyphen: tie
// tilde, v, u, bang, plus, THLMPSO: decoration
// carat, underscore, equal: accidental
// ampersand: time reset
// open-curly, close-curly: grace notes
// double-quote: chord symbol
// less-than, greater-than, slash: duration
// back-tick, space, tab: space

var isInTie = function(multilineVars, overlayLevel, el) {
	if (multilineVars.inTie[overlayLevel] === undefined)
		return false;
	// If this is single voice music then the voice index isn't set, so we use the first voice.
	var voiceIndex = multilineVars.currentVoice ? multilineVars.currentVoice.staffNum * 100 + multilineVars.currentVoice.index : 0;
	if (multilineVars.inTie[overlayLevel][voiceIndex]) {
		if (el.pitches !== undefined || el.rest.type !== 'spacer')
			return true;
	}
	return false;
};

var el = { };
MusicParser.prototype.parseMusic = function(line) {
	header.resolveTempo();
	//multilineVars.havent_set_length = false;	// To late to set this now.
	multilineVars.is_in_header = false;	// We should have gotten a key header by now, but just in case, this is definitely out of the header.
	var i = 0;
	var startOfLine = multilineVars.iChar;
	// see if there is nothing but a comment on this line. If so, just ignore it. A full line comment is optional white space followed by %
	while (tokenizer.isWhiteSpace(line[i]) && i < line.length)
		i++;
	if (i === line.length || line[i] === '%')
		return;

	// Start with the standard staff, clef and key symbols on each line
	var delayStartNewLine = multilineVars.start_new_line;
	if (multilineVars.continueall === undefined)
		multilineVars.start_new_line = true;
	else
		multilineVars.start_new_line = false;
	var tripletNotesLeft = 0;

	// See if the line starts with a header field
	var retHeader = header.letter_to_body_header(line, i);
	if (retHeader[0] > 0) {
		i += retHeader[0];
		// fixes bug on this: c[V:2]d
		if (retHeader[1] === 'V')
			this.startNewLine();
			// delayStartNewLine = true;
		// TODO-PER: Handle inline headers
	}

	var overlayLevel = 0;
	while (i < line.length)
	{
		var startI = i;
		if (line[i] === '%')
			break;

		var retInlineHeader = header.letter_to_inline_header(line, i, delayStartNewLine);
		if (retInlineHeader[0] > 0) {
			i += retInlineHeader[0];
			//console.log("inline header", retInlineHeader)
			if (retInlineHeader[1] === 'V')
				delayStartNewLine = true; // fixes bug on this: c[V:2]d
			// TODO-PER: Handle inline headers
			//multilineVars.start_new_line = false;
		} else {
			// Wait until here to actually start the line because we know we're past the inline statements.
			if (!tuneBuilder.hasBeginMusic() || (delayStartNewLine && !this.lineContinuation)) {
				this.startNewLine();
				delayStartNewLine = false;
			}

			// We need to decide if the following characters are a bar-marking or a note-group.
			// Unfortunately, that is ambiguous. Both can contain chord symbols and decorations.
			// If there is a grace note either before or after the chord symbols and decorations, then it is definitely a note-group.
			// If there is a bar marker, it is definitely a bar-marking.
			// If there is either a core-note or chord, it is definitely a note-group.
			// So, loop while we find grace-notes, chords-symbols, or decorations. [It is an error to have more than one grace-note group in a row; the others can be multiple]
			// Then, if there is a grace-note, we know where to go.
			// Else see if we have a chord, core-note, slur, triplet, or bar.

			var ret;
			while (1) {
				ret = tokenizer.eatWhiteSpace(line, i);
				if (ret > 0) {
					i += ret;
				}
				if (i > 0 && line[i-1] === '\x12') {
					// there is one case where a line continuation isn't the same as being on the same line, and that is if the next character after it is a header.
					ret = header.letter_to_body_header(line, i);
					if (ret[0] > 0) {
						if (ret[1] === 'V')
							this.startNewLine(); // fixes bug on this: c\\nV:2]\\nd
						// TODO: insert header here
						i = ret[0];
						multilineVars.start_new_line = false;
					}
				}
				// gather all the grace notes, chord symbols and decorations
				ret = letter_to_spacer(line, i);
				if (ret[0] > 0) {
					i += ret[0];
				}

				ret = letter_to_chord(line, i);
				if (ret[0] > 0) {
					// There could be more than one chord here if they have different positions.
					// If two chords have the same position, then connect them with newline.
					if (!el.chord)
						el.chord = [];
					var chordName = tokenizer.translateString(ret[1]);
					chordName = chordName.replace(/;/g, "\n");
					var addedChord = false;
					for (var ci = 0; ci < el.chord.length; ci++) {
						if (el.chord[ci].position === ret[2]) {
							addedChord = true;
							el.chord[ci].name += "\n" + chordName;
						}
					}
					if (addedChord === false) {
						if (ret[2] === null && ret[3])
							el.chord.push({name: chordName, rel_position: ret[3]});
						else
							el.chord.push({name: chordName, position: ret[2]});
					}

					i += ret[0];
					var ii = tokenizer.skipWhiteSpace(line.substring(i));
					if (ii > 0)
						el.force_end_beam_last = true;
					i += ii;
				} else {
					if (nonDecorations.indexOf(line[i]) === -1)
						ret = letter_to_accent(line, i);
					else ret = [ 0 ];
					if (ret[0] > 0) {
						if (ret[1] === null) {
							if (i + 1 < line.length)
								this.startNewLine();	// There was a ! in the middle of the line. Start a new line if there is anything after it.
						} else if (ret[1].length > 0) {
							if (ret[1].indexOf("style=") === 0) {
								el.style = ret[1].substr(6);
							} else {
								if (el.decoration === undefined)
									el.decoration = [];
								if (ret[1] === 'beambr1')
									el.beambr = 1;
								else if (ret[1] === "beambr2")
									el.beambr = 2;
								else el.decoration.push(ret[1]);
							}
						}
						i += ret[0];
					} else {
						ret = letter_to_grace(line, i);
						// TODO-PER: Be sure there aren't already grace notes defined. That is an error.
						if (ret[0] > 0) {
							el.gracenotes = ret[1];
							i += ret[0];
						} else
							break;
					}
				}
			}

			ret = letter_to_bar(line, i);
			if (ret[0] > 0) {
				// This is definitely a bar
				overlayLevel = 0;
				if (el.gracenotes !== undefined) {
					// Attach the grace note to an invisible note
					el.rest = { type: 'spacer' };
					el.duration = 0.125; // TODO-PER: I don't think the duration of this matters much, but figure out if it does.
					multilineVars.addFormattingOptions(el, tune.formatting, 'note');
					tuneBuilder.appendElement('note', startOfLine+i, startOfLine+i+ret[0], el);
					multilineVars.measureNotEmpty = true;
					el = {};
				}
				var bar = {type: ret[1]};
				if (bar.type.length === 0)
					warn("Unknown bar type", line, i);
				else {
					if (multilineVars.inEnding && bar.type !== 'bar_thin') {
						bar.endEnding = true;
						multilineVars.inEnding = false;
					}
					if (ret[2]) {
						bar.startEnding = ret[2];
						if (multilineVars.inEnding)
							bar.endEnding = true;
						multilineVars.inEnding = true;
						if (ret[1] === "bar_right_repeat") {
							// restore the tie and slur state from the start repeat
							multilineVars.restoreStartEndingHoldOvers();
						} else {
							// save inTie, inTieChord
							multilineVars.duplicateStartEndingHoldOvers();
						}
					}
					if (el.decoration !== undefined)
						bar.decoration = el.decoration;
					if (el.chord !== undefined)
						bar.chord = el.chord;
					if (bar.startEnding && multilineVars.barFirstEndingNum === undefined)
						multilineVars.barFirstEndingNum = multilineVars.currBarNumber;
					else if (bar.startEnding && bar.endEnding && multilineVars.barFirstEndingNum)
						multilineVars.currBarNumber = multilineVars.barFirstEndingNum;
					else if (bar.endEnding)
						multilineVars.barFirstEndingNum = undefined;
					if (bar.type !== 'bar_invisible' && multilineVars.measureNotEmpty) {
						var isFirstVoice = multilineVars.currentVoice === undefined || (multilineVars.currentVoice.staffNum ===  0 && multilineVars.currentVoice.index ===  0);
						if (isFirstVoice) {
							multilineVars.currBarNumber++;
							if (multilineVars.barNumbers && multilineVars.currBarNumber % multilineVars.barNumbers === 0)
								bar.barNumber = multilineVars.currBarNumber;
						}
					}
					multilineVars.addFormattingOptions(el, tune.formatting, 'bar');
					tuneBuilder.appendElement('bar', startOfLine+startI, startOfLine+i+ret[0], bar);
					multilineVars.measureNotEmpty = false;
					el = {};
				}
				i += ret[0];
			} else if (line[i] === '&') {	// backtrack to beginning of measure
				ret = letter_to_overlay(line, i);
				if (ret[0] > 0) {
					tuneBuilder.appendElement('overlay', startOfLine, startOfLine+1, {});
					i += 1;
					overlayLevel++;
				}

			} else {
				// This is definitely a note group
				//
				// Look for as many open slurs and triplets as there are. (Note: only the first triplet is valid.)
				ret = letter_to_open_slurs_and_triplets(line, i);
				if (ret.consumed > 0) {
					if (ret.startSlur !== undefined)
						el.startSlur = ret.startSlur;
					if (ret.dottedSlur)
						el.dottedSlur = true;
					if (ret.triplet !== undefined) {
						if (tripletNotesLeft > 0)
							warn("Can't nest triplets", line, i);
						else {
							el.startTriplet = ret.triplet;
							el.tripletMultiplier = ret.tripletQ / ret.triplet;
							el.tripletR = ret.num_notes;
							tripletNotesLeft = ret.num_notes === undefined ? ret.triplet : ret.num_notes;
						}
					}
					i += ret.consumed;
				}

				// handle chords.
				if (line[i] === '[') {
					var chordStartChar = i;
					i++;
					var chordDuration = null;
					var rememberEndBeam = false;

					var done = false;
					while (!done) {
						var accent = letter_to_accent(line, i);
						if (accent[0] > 0) {
							i += accent[0];
						}

						var chordNote = getCoreNote(line, i, {}, false);
						if (chordNote !== null && chordNote.pitch !== undefined) {
							if (accent[0] > 0) { // If we found a decoration above, it modifies the entire chord. "style" is handled below.
								if (accent[1].indexOf("style=") !== 0) {
									if (el.decoration === undefined)
										el.decoration = [];
									el.decoration.push(accent[1]);
								}
							}
							if (chordNote.end_beam) {
								el.end_beam = true;
								delete chordNote.end_beam;
							}
							if (el.pitches === undefined) {
								el.duration = chordNote.duration;
								el.pitches = [ chordNote ];
							} else	// Just ignore the note lengths of all but the first note. The standard isn't clear here, but this seems less confusing.
								el.pitches.push(chordNote);
							delete chordNote.duration;
							if (accent[0] > 0) { // If we found a style above, it modifies the individual pitch, not the entire chord.
								if (accent[1].indexOf("style=") === 0) {
									el.pitches[el.pitches.length-1].style = accent[1].substr(6);
								}
							}

							if (multilineVars.inTieChord[el.pitches.length]) {
								chordNote.endTie = true;
								multilineVars.inTieChord[el.pitches.length] = undefined;
							}
							if (chordNote.startTie)
								multilineVars.inTieChord[el.pitches.length] = true;

							i  = chordNote.endChar;
							delete chordNote.endChar;
						} else if (line[i] === ' ') {
							// Spaces are not allowed in chords, but we can recover from it by ignoring it.
							warn("Spaces are not allowed in chords", line, i);
							i++;
						} else {
							if (i < line.length && line[i] === ']') {
								// consume the close bracket
								i++;

								if (multilineVars.next_note_duration !== 0) {
									el.duration = el.duration * multilineVars.next_note_duration;
									multilineVars.next_note_duration = 0;
								}

								if (isInTie(multilineVars,  overlayLevel, el)) {
									el.pitches.forEach(function(pitch) { pitch.endTie = true; });
									setIsInTie(multilineVars,  overlayLevel, false);
								}

								if (tripletNotesLeft > 0 && !(el.rest && el.rest.type === "spacer")) {
									tripletNotesLeft--;
									if (tripletNotesLeft === 0) {
										el.endTriplet = true;
									}
								}

								var postChordDone = false;
								while (i < line.length && !postChordDone) {
									switch (line[i]) {
										case ' ':
										case '\t':
											addEndBeam(el);
											break;
										case ')':
											if (el.endSlur === undefined) el.endSlur = 1; else el.endSlur++;
											break;
										case '-':
											el.pitches.forEach(function(pitch) { pitch.startTie = {}; });
											setIsInTie(multilineVars,  overlayLevel, true);
											break;
										case '>':
										case '<':
											var br2 = getBrokenRhythm(line, i);
											i += br2[0] - 1;	// index gets incremented below, so we'll let that happen
											multilineVars.next_note_duration = br2[2];
											if (chordDuration)
												chordDuration = chordDuration * br2[1];
											else
												chordDuration = br2[1];
											break;
										case '1':
										case '2':
										case '3':
										case '4':
										case '5':
										case '6':
										case '7':
										case '8':
										case '9':
										case '/':
											var fraction = tokenizer.getFraction(line, i);
											chordDuration = fraction.value;
											i = fraction.index;
											var ch = line[i]
											if (ch === ' ')
												rememberEndBeam = true;
											if (ch === '-' || ch === ')' || ch === ' ' || ch === '<' || ch === '>')
												i--; // Subtracting one because one is automatically added below
											else
												postChordDone = true;
											break;
										case '0':
											chordDuration = 0;
											break;
										default:
											postChordDone = true;
											break;
									}
									if (!postChordDone) {
										i++;
									}
								}
							} else
								warn("Expected ']' to end the chords", line, i);

							if (el.pitches !== undefined) {
								if (chordDuration !== null) {
									el.duration = el.duration * chordDuration;
									if (rememberEndBeam)
										addEndBeam(el);
								}

								multilineVars.addFormattingOptions(el, tune.formatting, 'note');
								tuneBuilder.appendElement('note', startOfLine+startI, startOfLine+i, el);
								multilineVars.measureNotEmpty = true;
								el = {};
							}
							done = true;
						}
					}

				} else {
					// Single pitch
					var el2 = {};
					var core = getCoreNote(line, i, el2, true);
					if (el2.endTie !== undefined) setIsInTie(multilineVars,  overlayLevel, true);
					if (core !== null) {
						if (core.pitch !== undefined) {
							el.pitches = [ { } ];
							// TODO-PER: straighten this out so there is not so much copying: getCoreNote shouldn't change e'
							if (core.accidental !== undefined) el.pitches[0].accidental = core.accidental;
							el.pitches[0].pitch = core.pitch;
							el.pitches[0].name = core.name;
							if (core.midipitch || core.midipitch === 0)
								el.pitches[0].midipitch = core.midipitch;
							if (core.endSlur !== undefined) el.pitches[0].endSlur = core.endSlur;
							if (core.endTie !== undefined) el.pitches[0].endTie = core.endTie;
							if (core.startSlur !== undefined) el.pitches[0].startSlur = core.startSlur;
							if (el.startSlur !== undefined) el.pitches[0].startSlur = el.startSlur;
							if (el.dottedSlur !== undefined) el.pitches[0].dottedSlur = true;
							if (core.startTie !== undefined) el.pitches[0].startTie = core.startTie;
							if (el.startTie !== undefined) el.pitches[0].startTie = el.startTie;
						} else {
							el.rest = core.rest;
							if (core.endSlur !== undefined) el.endSlur = core.endSlur;
							if (core.endTie !== undefined) el.rest.endTie = core.endTie;
							if (core.startSlur !== undefined) el.startSlur = core.startSlur;
							if (core.startTie !== undefined) el.rest.startTie = core.startTie;
							if (el.startTie !== undefined) el.rest.startTie = el.startTie;
						}

						if (core.chord !== undefined) el.chord = core.chord;
						if (core.duration !== undefined) el.duration = core.duration;
						if (core.decoration !== undefined) el.decoration = core.decoration;
						if (core.graceNotes !== undefined) el.graceNotes = core.graceNotes;
						delete el.startSlur;
						delete el.dottedSlur;
						if (isInTie(multilineVars,  overlayLevel, el)) {
							if (el.pitches !== undefined) {
								el.pitches[0].endTie = true;
							} else if (el.rest.type !== 'spacer') {
								el.rest.endTie = true;
							}
							setIsInTie(multilineVars,  overlayLevel, false);
						}
						if (core.startTie || el.startTie)
							setIsInTie(multilineVars,  overlayLevel, true);
						i  = core.endChar;

						if (tripletNotesLeft > 0 && !(core.rest && core.rest.type === "spacer")) {
							tripletNotesLeft--;
							if (tripletNotesLeft === 0) {
								el.endTriplet = true;
							}
						}

						if (core.end_beam)
							addEndBeam(el);

						// If there is a whole rest, then it should be the duration of the measure, not it's own duration. We need to special case it.
						// If the time signature length is greater than 4/4, though, then a whole rest has no special treatment.
						if (el.rest && el.rest.type === 'rest' && el.duration === 1 && durationOfMeasure(multilineVars) <= 1) {
							el.rest.type = 'whole';

							el.duration = durationOfMeasure(multilineVars);
						}

						// Create a warning if this is not a displayable duration.
						// The first item on a line is a regular note value, each item after that represents a dot placed after the previous note.
						// Only durations less than a whole note are tested because whole note durations have some tricky rules.

						if (el.duration < 1 && durations.indexOf(el.duration) === -1 && el.duration !== 0) {
							if (!el.rest || el.rest.type !== 'spacer')
								warn("Duration not representable: " + line.substring(startI, i), line, i);
						}

						multilineVars.addFormattingOptions(el, tune.formatting, 'note');
						var succeeded = tuneBuilder.appendElement('note', startOfLine+startI, startOfLine+i, el);
						if (!succeeded) {
							this.startNewLine()
							tuneBuilder.appendElement('note', startOfLine+startI, startOfLine+i, el);
						}
						multilineVars.measureNotEmpty = true;
						el = {};
					}
				}

				if (i === startI) {	// don't know what this is, so ignore it.
					if (line[i] !== ' ' && line[i] !== '`')
						warn("Unknown character ignored", line, i);
					i++;
				}
			}
		}
	}
	this.lineContinuation = line.indexOf('\x12') >= 0 || (retHeader[0] > 0)
	if (!this.lineContinuation) { el = { } }
};

var setIsInTie =function(multilineVars, overlayLevel, value) {
	// If this is single voice music then the voice index isn't set, so we use the first voice.
	var voiceIndex = multilineVars.currentVoice ? multilineVars.currentVoice.staffNum * 100 + multilineVars.currentVoice.index : 0;
	if (multilineVars.inTie[overlayLevel] === undefined)
		multilineVars.inTie[overlayLevel] = [];
	multilineVars.inTie[overlayLevel][voiceIndex] = value;
};

var letter_to_chord = function(line, i) {
	if (line[i] === '"')
	{
		var chord = tokenizer.getBrackettedSubstring(line, i, 5);
		if (!chord[2])
			warn("Missing the closing quote while parsing the chord symbol", line , i);
		// If it starts with ^, then the chord appears above.
		// If it starts with _ then the chord appears below.
		// (note that the 2.0 draft standard defines them as not chords, but annotations and also defines @.)
		if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '^') {
			chord[1] = chord[1].substring(1);
			chord[2] = 'above';
		} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '_') {
			chord[1] = chord[1].substring(1);
			chord[2] = 'below';
		} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '<') {
			chord[1] = chord[1].substring(1);
			chord[2] = 'left';
		} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '>') {
			chord[1] = chord[1].substring(1);
			chord[2] = 'right';
		} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '@') {
		      // @-15,5.7		
		      chord[1] = chord[1].substring(1);
		      var x = tokenizer.getFloat(chord[1]);
		      if (x.digits === 0){
			warn("Missing first position in absolutely positioned annotation.", line, i);
			chord[1] = chord[1].replace("@","");
			chord[2] = 'above';
			return chord;
		      }
		      chord[1] = chord[1].substring(x.digits);
		      if (chord[1][0] !== ','){
			warn("Missing comma absolutely positioned annotation.", line, i);
			chord[1] = chord[1].replace("@","");
			chord[2] = 'above';
			return chord;
		      }
		      chord[1] = chord[1].substring(1);
		      var y = tokenizer.getFloat(chord[1]);
		      if (y.digits === 0){
			warn("Missing second position in absolutely positioned annotation.", line, i);
			chord[1] = chord[1].replace("@","");
			chord[2] = 'above';
			return chord;
		      }
		      chord[1] = chord[1].substring(y.digits);
		      var ws = tokenizer.skipWhiteSpace(chord[1]);
		      chord[1] = chord[1].substring(ws);
		      chord[2] = null;
		      chord[3] = {
			x: x.value,
			y: y.value
		      };	
		} else {
			if (multilineVars.freegchord !== true) {
				chord[1] = chord[1].replace(/([ABCDEFG0-9])b/g, "$1♭");
				chord[1] = chord[1].replace(/([ABCDEFG0-9])#/g, "$1♯");
				chord[1] = chord[1].replace(/^([ABCDEFG])([♯♭]?)o([^A-Za-z])/g, "$1$2°$3");
				chord[1] = chord[1].replace(/^([ABCDEFG])([♯♭]?)o$/g, "$1$2°");
				chord[1] = chord[1].replace(/^([ABCDEFG])([♯♭]?)0([^A-Za-z])/g, "$1$2ø$3");
				chord[1] = chord[1].replace(/^([ABCDEFG])([♯♭]?)\^([^A-Za-z])/g, "$1$2∆$3");
			}
			chord[2] = 'default';
			chord[1] = transpose.chordName(multilineVars, chord[1]);
		}
		return chord;
	}
	return [0, ""];
};

var letter_to_grace =  function(line, i) {
	// Grace notes are an array of: startslur, note, endslur, space; where note is accidental, pitch, duration
	if (line[i] === '{') {
		// fetch the gracenotes string and consume that into the array
		var gra = tokenizer.getBrackettedSubstring(line, i, 1, '}');
		if (!gra[2])
			warn("Missing the closing '}' while parsing grace note", line, i);
		// If there is a slur after the grace construction, then move it to the last note inside the grace construction
		if (line[i+gra[0]] === ')') {
			gra[0]++;
			gra[1] += ')';
		}

		var gracenotes = [];
		var ii = 0;
		var inTie = false;
		while (ii < gra[1].length) {
			var acciaccatura = false;
			if (gra[1][ii] === '/') {
				acciaccatura = true;
				ii++;
			}
			var note = getCoreNote(gra[1], ii, {}, false);
			if (note !== null) {
				// The grace note durations should not be affected by the default length: they should be based on 1/16, so if that isn't the default, then multiply here.
				note.duration = note.duration / (multilineVars.default_length * 8);
				if (acciaccatura)
					note.acciaccatura = true;
				if (note.rest) {
					// don't allow rests inside gracenotes
					warn("Rests not allowed as grace notes '" + gra[1][ii] + "' while parsing grace note", line, i);
				} else
					gracenotes.push(note);

				if (inTie) {
					note.endTie = true;
					inTie = false;
				}
				if (note.startTie)
					inTie = true;

				ii  = note.endChar;
				delete note.endChar;

				if (note.end_beam) {
					note.endBeam = true;
					delete note.end_beam;
				}
			}
			else {
				// We shouldn't get anything but notes or a space here, so report an error
				if (gra[1][ii] === ' ') {
					if (gracenotes.length > 0)
						gracenotes[gracenotes.length-1].endBeam = true;
				} else
					warn("Unknown character '" + gra[1][ii] + "' while parsing grace note", line, i);
				ii++;
			}
		}
		if (gracenotes.length)
			return [gra[0], gracenotes];
	}
	return [ 0 ];
};

function letter_to_overlay(line, i) {
	if (line[i] === '&') {
		var start = i;
		while (line[i] && line[i] !== ':' && line[i] !== '|')
			i++;
		return [ i-start, line.substring(start+1, i) ];
	}
	return [ 0 ];
}

function durationOfMeasure(multilineVars) {
	// TODO-PER: This could be more complicated if one of the unusual measures is used.
	var meter = multilineVars.origMeter;
	if (!meter || meter.type !== 'specified')
		return 1;
	if (!meter.value || meter.value.length === 0)
		return 1;
	return parseInt(meter.value[0].num, 10) / parseInt(meter.value[0].den, 10);
}




var letter_to_accent = function(line, i) {
	var macro = multilineVars.macros[line[i]];

	if (macro !== undefined) {
		if (macro[0] === '!' || macro[0] === '+')
			macro = macro.substring(1);
		if (macro[macro.length-1] === '!' || macro[macro.length-1] === '+')
			macro = macro.substring(0, macro.length-1);
		if (legalAccents.includes(macro))
			return [ 1, macro ];
		else if (volumeDecorations.includes(macro)) {
			if (multilineVars.volumePosition === 'hidden')
				macro = "";
			return [1, macro];
		} else if (dynamicDecorations.includes(macro)) {
			if (multilineVars.dynamicPosition === 'hidden')
				macro = "";
			return [1, macro];
		} else {
			if (!multilineVars.ignoredDecorations.includes(macro))
				warn("Unknown macro: " + macro, line, i);
			return [1, '' ];
		}
	}
	switch (line[i])
	{
		case '.':
			if (line[i+1] === '(' || line[i+1] === '-') // a dot then open paren is a dotted slur; likewise dot dash is dotted tie.
				break;
			return [1, 'staccato'];
		case 'u':return [1, 'upbow'];
		case 'v':return [1, 'downbow'];
		case '~':return [1, 'irishroll'];
		case '!':
		case '+':
			var ret = tokenizer.getBrackettedSubstring(line, i, 5);
			// Be sure that the accent is recognizable.
			if (ret[1].length > 1 && (ret[1][0] === '^' || ret[1][0] ==='_'))
				ret[1] = ret[1].substring(1);	// TODO-PER: The test files have indicators forcing the ornament to the top or bottom, but that isn't in the standard. We'll just ignore them.
			if (legalAccents.includes(ret[1]))
				return ret;
			if (volumeDecorations.includes(ret[1])) {
				if (multilineVars.volumePosition === 'hidden' )
					ret[1] = '';
				return ret;
			}
			if (dynamicDecorations.includes(ret[1])) {
				if (multilineVars.dynamicPosition === 'hidden' )
					ret[1] = '';
				return ret;
			}

			var ind = accentPseudonyms.findIndex(function (acc) { return ret[1] === acc[0]})
			if (ind >= 0) {
				ret[1] = accentPseudonyms[ind][1];
				return ret;
			}

			ind = accentDynamicPseudonyms.findIndex(function (acc) { return ret[1] === acc[0]})
			if (ind >= 0) {
				ret[1] = accentDynamicPseudonyms[ind][1];
				if (multilineVars.dynamicPosition === 'hidden' )
					ret[1] = '';
				return ret;
			}

			// We didn't find the accent in the list, so consume the space, but don't return an accent.
			// Although it is possible that ! was used as a line break, so accept that.
			if (line[i] === '!' && (ret[0] === 1 || line[i+ret[0]-1] !== '!'))
				return [1, null ];
			warn("Unknown decoration: " + ret[1], line, i);
			ret[1] = "";
			return ret;
		case 'H':return [1, 'fermata'];
		case 'J':return [1, 'slide'];
		case 'L':return [1, 'accent'];
		case 'M':return [1, 'mordent'];
		case 'O':return[1, 'coda'];
		case 'P':return[1, 'pralltriller'];
		case 'R':return [1, 'roll'];
		case 'S':return [1, 'segno'];
		case 'T':return [1, 'trill'];
	}
	return [0, 0];
};

var letter_to_spacer = function(line, i) {
	var start = i;
	while (tokenizer.isWhiteSpace(line[i]))
		i++;
	return [ i-start ];
};

// returns the class of the bar line
// the number of the repeat
// and the number of characters used up
// if 0 is returned, then the next element was not a bar line
var letter_to_bar = function(line, curr_pos) {
	var ret = tokenizer.getBarLine(line, curr_pos);
	if (ret.len === 0)
		return [0,""];
	if (ret.warn) {
		warn(ret.warn, line, curr_pos);
		return [ret.len,""];
	}

	// Now see if this is a repeated ending
	// A repeated ending is all of the characters 1,2,3,4,5,6,7,8,9,0,-, and comma
	// It can also optionally start with '[', which is ignored.
	// Also, it can have white space before the '['.
	for (var ws = 0; ws < line.length; ws++)
		if (line[curr_pos + ret.len + ws] !== ' ')
			break;
	var orig_bar_len = ret.len;
	if (line[curr_pos+ret.len+ws] === '[') {
		ret.len += ws + 1;
	}

	// It can also be a quoted string. It is unclear whether that construct requires '[', but it seems like it would. otherwise it would be confused with a regular chord.
	if (line[curr_pos+ret.len] === '"' && line[curr_pos+ret.len-1] === '[') {
		var ending = tokenizer.getBrackettedSubstring(line, curr_pos+ret.len, 5);
		return [ret.len+ending[0], ret.token, ending[1]];
	}
	var retRep = tokenizer.getTokenOf(line.substring(curr_pos+ret.len), "1234567890-,");
	if (retRep.len === 0 || retRep.token[0] === '-')
		return [orig_bar_len, ret.token];

	return [ret.len+retRep.len, ret.token, retRep.token];
};

var letter_to_open_slurs_and_triplets =  function(line, i) {
	// consume spaces, and look for all the open parens. If there is a number after the open paren,
	// that is a triplet. Otherwise that is a slur. Collect all the slurs and the first triplet.
	var ret = {};
	var start = i;
	if (line[i] === '.' && line[i+1] === '(') {
		ret.dottedSlur = true;
		i++;
	}
	while (line[i] === '(' || tokenizer.isWhiteSpace(line[i])) {
		if (line[i] === '(') {
			if (i+1 < line.length && (line[i+1] >= '2' && line[i+1] <= '9')) {
				if (ret.triplet !== undefined)
					warn("Can't nest triplets", line, i);
				else {
					ret.triplet = line[i+1] - '0';
					ret.tripletQ = tripletQ[ret.triplet];
					ret.num_notes = ret.triplet;
					if (i+2 < line.length && line[i+2] === ':') {
						// We are expecting "(p:q:r" or "(p:q" or "(p::r"
						// That is: "put p notes into the time of q for the next r notes"
						// if r is missing, then it is equal to p.
						// if q is missing, it is determined from this table:
						// (2 notes in the time of 3
						// (3 notes in the time of 2
						// (4 notes in the time of 3
						// (5 notes in the time of n | if time sig is (6/8, 9/8, 12/8), n=3, else n=2
						// (6 notes in the time of 2
						// (7 notes in the time of n
						// (8 notes in the time of 3
						// (9 notes in the time of n
						if (i+3 < line.length && line[i+3] === ':') {
							// The second number, 'q', is not present.
							if (i+4 < line.length && (line[i+4] >= '1' && line[i+4] <= '9')) {
								ret.num_notes = line[i+4] - '0';
								i += 3;
							} else
								warn("expected number after the two colons after the triplet to mark the duration", line, i);
						} else if (i+3 < line.length && (line[i+3] >= '1' && line[i+3] <= '9')) {
							ret.tripletQ = line[i+3] - '0';
							if (i+4 < line.length && line[i+4] === ':') {
								if (i+5 < line.length && (line[i+5] >= '1' && line[i+5] <= '9')) {
									ret.num_notes = line[i+5] - '0';
									i += 4;
								}
							} else {
								i += 2;
							}
						} else
							warn("expected number after the triplet to mark the duration", line, i);
					}
				}
				i++;
			}
			else {
				if (ret.startSlur === undefined)
					ret.startSlur = 1;
				else
					ret.startSlur++;
			}
		}
		i++;
	}
	ret.consumed = i-start;
	return ret;
};

MusicParser.prototype.startNewLine = function() {
	var params = { startChar: -1, endChar: -1};
	if (multilineVars.partForNextLine.title)
		params.part = multilineVars.partForNextLine;
	params.clef = multilineVars.currentVoice && multilineVars.staves[multilineVars.currentVoice.staffNum].clef !== undefined ? Object.assign({},multilineVars.staves[multilineVars.currentVoice.staffNum].clef) : Object.assign({},multilineVars.clef);
	var scoreTranspose = multilineVars.currentVoice ? multilineVars.currentVoice.scoreTranspose : 0;
	params.key = parseKeyVoice.standardKey(multilineVars.key.root+multilineVars.key.acc+multilineVars.key.mode, multilineVars.key.root, multilineVars.key.acc, scoreTranspose);
	params.key.mode = multilineVars.key.mode;
	if (multilineVars.key.impliedNaturals)
		params.key.impliedNaturals = multilineVars.key.impliedNaturals;
	if (multilineVars.key.explicitAccidentals) {
		for (var i = 0; i < multilineVars.key.explicitAccidentals.length; i++) {
			var found = false;
			for (var j = 0; j < params.key.accidentals.length; j++) {
				if (params.key.accidentals[j].note === multilineVars.key.explicitAccidentals[i].note) {
					// If the note is already in the list, override it with the new value
					params.key.accidentals[j].acc = multilineVars.key.explicitAccidentals[i].acc;
					found = true;
				}
			}
			if (!found)
				params.key.accidentals.push(multilineVars.key.explicitAccidentals[i]);
		}
	}
	multilineVars.targetKey = params.key;
	if (params.key.explicitAccidentals)
		delete params.key.explicitAccidentals;
	parseKeyVoice.addPosToKey(params.clef, params.key);
	if (multilineVars.meter !== null) {
		if (multilineVars.currentVoice) {
			multilineVars.staves.forEach(function(st) {
				st.meter = multilineVars.meter;
			});
			params.meter = multilineVars.staves[multilineVars.currentVoice.staffNum].meter;
			multilineVars.staves[multilineVars.currentVoice.staffNum].meter = null;
		} else
			params.meter = multilineVars.meter;
		multilineVars.meter = null;
	} else if (multilineVars.currentVoice && multilineVars.staves[multilineVars.currentVoice.staffNum].meter) {
		// Make sure that each voice gets the meter marking.
		params.meter = multilineVars.staves[multilineVars.currentVoice.staffNum].meter;
		multilineVars.staves[multilineVars.currentVoice.staffNum].meter = null;
	}
	if (multilineVars.currentVoice && multilineVars.currentVoice.name)
		params.name = multilineVars.currentVoice.name;
	if (multilineVars.vocalfont)
		params.vocalfont = multilineVars.vocalfont;
	if (multilineVars.tripletfont)
		params.tripletfont = multilineVars.tripletfont;
	if (multilineVars.gchordfont)
		params.gchordfont = multilineVars.gchordfont;
	if (multilineVars.style)
		params.style = multilineVars.style;
	if (multilineVars.currentVoice) {
		var staff = multilineVars.staves[multilineVars.currentVoice.staffNum];
		if (staff.brace) params.brace = staff.brace;
		if (staff.bracket) params.bracket = staff.bracket;
		if (staff.connectBarLines) params.connectBarLines = staff.connectBarLines;
		if (staff.name) params.name = staff.name[multilineVars.currentVoice.index];
		if (staff.subname) params.subname = staff.subname[multilineVars.currentVoice.index];
		if (multilineVars.currentVoice.stem)
			params.stem = multilineVars.currentVoice.stem;
		if (multilineVars.currentVoice.stafflines)
			params.stafflines = multilineVars.currentVoice.stafflines;
		if (multilineVars.currentVoice.staffscale)
			params.staffscale = multilineVars.currentVoice.staffscale;
		if (multilineVars.currentVoice.scale)
			params.scale = multilineVars.currentVoice.scale;
		if (multilineVars.currentVoice.color)
			params.color = multilineVars.currentVoice.color;
		if (multilineVars.currentVoice.style)
			params.style = multilineVars.currentVoice.style;
		if (multilineVars.currentVoice.transpose)
			params.clef.transpose = multilineVars.currentVoice.transpose;
		params.currentVoice = multilineVars.currentVoice
		var voices = Object.keys(multilineVars.voices)
		for (var mv = 0; mv < voices.length; mv++) {
			if (params.currentVoice.staffNum === multilineVars.voices[voices[mv]].staffNum && params.currentVoice.index === multilineVars.voices[voices[mv]].index)
				params.currentVoiceName = voices[mv]
		}
	}
	var isFirstVoice = multilineVars.currentVoice === undefined || (multilineVars.currentVoice.staffNum ===  0 && multilineVars.currentVoice.index ===  0);
	if (multilineVars.barNumbers === 0 && isFirstVoice && multilineVars.currBarNumber !== 1)
		params.barNumber = multilineVars.currBarNumber;
	tuneBuilder.startNewLine(params);
	if (multilineVars.key.impliedNaturals)
		delete multilineVars.key.impliedNaturals;

	multilineVars.partForNextLine = {};
	if (multilineVars.tempoForNextLine.length === 4)
		tuneBuilder.appendElement(multilineVars.tempoForNextLine[0],multilineVars.tempoForNextLine[1],multilineVars.tempoForNextLine[2],multilineVars.tempoForNextLine[3]);
	multilineVars.tempoForNextLine = [];
}

// TODO-PER: make this a method in el.
var addEndBeam = function(el) {
	if (el.duration !== undefined && el.duration < 0.25)
		el.end_beam = true;
	return el;
};

var getCoreNote = function(line, index, el, canHaveBrokenRhythm) {
	//var el = { startChar: index };
	var isComplete = function(state) {
		return (state === 'octave' || state === 'duration' || state === 'Zduration' || state === 'broken_rhythm' || state === 'end_slur');
	};
	var dottedTie;
	if (line[index] === '.' && line[index+1] === '-') {
		dottedTie = true;
		index++;
	}
	var state = 'startSlur';
	var durationSetByPreviousNote = false;
	while (1) {
		switch(line[index]) {
			case '(':
				if (state === 'startSlur') {
					if (el.startSlur === undefined) el.startSlur = 1; else el.startSlur++;
				} else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case ')':
				if (isComplete(state)) {
					if (el.endSlur === undefined) el.endSlur = 1; else el.endSlur++;
				} else return null;
				break;
			case '^':
				if (state === 'startSlur') {el.accidental = 'sharp';state = 'sharp2';}
				else if (state === 'sharp2') {el.accidental = 'dblsharp';state = 'pitch';}
				else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case '_':
				if (state === 'startSlur') {el.accidental = 'flat';state = 'flat2';}
				else if (state === 'flat2') {el.accidental = 'dblflat';state = 'pitch';}
				else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case '=':
				if (state === 'startSlur') {el.accidental = 'natural';state = 'pitch';}
				else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case 'A':
			case 'B':
			case 'C':
			case 'D':
			case 'E':
			case 'F':
			case 'G':
			case 'a':
			case 'b':
			case 'c':
			case 'd':
			case 'e':
			case 'f':
			case 'g':
				if (state === 'startSlur' || state === 'sharp2' || state === 'flat2' || state === 'pitch') {
					el.pitch = pitches[line[index]];
					el.pitch += 7 * (multilineVars.currentVoice && multilineVars.currentVoice.octave !== undefined ? multilineVars.currentVoice.octave : multilineVars.octave);
					el.name = line[index];
					if (el.accidental)
						el.name = accMap[el.accidental] + el.name;
					transpose.note(multilineVars, el);
					state = 'octave';
					// At this point we have a valid note. The rest is optional. Set the duration in case we don't get one below
					if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
						el.duration = multilineVars.default_length * multilineVars.next_note_duration;
						multilineVars.next_note_duration = 0;
						durationSetByPreviousNote = true;
					} else
						el.duration = multilineVars.default_length;
					// If the clef is percussion, there is probably some translation of the pitch to a particular drum kit item.
					if ((multilineVars.clef && multilineVars.clef.type === "perc") ||
						(multilineVars.currentVoice && multilineVars.currentVoice.clef === "perc")) {
						var key = line[index];
						if (el.accidental) {
							key = accMap[el.accidental] + key;
						}
						if (tune.formatting && tune.formatting.midi && tune.formatting.midi.drummap)
						el.midipitch = tune.formatting.midi.drummap[key];
					}
				} else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case ',':
				if (state === 'octave') {el.pitch -= 7; el.name += ','; }
				else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case '\'':
				if (state === 'octave') {el.pitch += 7; el.name += "'";  }
				else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case 'x':
			case 'X':
			case 'y':
			case 'z':
			case 'Z':
				if (state === 'startSlur') {
					el.rest = { type: rests[line[index]] };
					// There shouldn't be some of the properties that notes have. If some sneak in due to bad syntax in the abc file,
					// just nix them here.
					delete el.accidental;
					delete el.startSlur;
					delete el.startTie;
					delete el.endSlur;
					delete el.endTie;
					delete el.end_beam;
					delete el.grace_notes;
					// At this point we have a valid note. The rest is optional. Set the duration in case we don't get one below
					if (el.rest.type.indexOf('multimeasure') >= 0) {
						el.duration = tune.getBarLength();
						el.rest.text = 1;
						state = 'Zduration';
					} else {
						if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
							el.duration = multilineVars.default_length * multilineVars.next_note_duration;
							multilineVars.next_note_duration = 0;
							durationSetByPreviousNote = true;
						} else
							el.duration = multilineVars.default_length;
						state = 'duration';
					}
				} else if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
			case '/':
				if (state === 'octave' || state === 'duration') {
					var fraction = tokenizer.getFraction(line, index);
					//if (!durationSetByPreviousNote)
					el.duration = el.duration * fraction.value;
					// TODO-PER: We can test the returned duration here and give a warning if it isn't the one expected.
					el.endChar = fraction.index;
					while (fraction.index < line.length && (tokenizer.isWhiteSpace(line[fraction.index]) || line[fraction.index] === '-')) {
						if (line[fraction.index] === '-')
							el.startTie = {};
						else
							el = addEndBeam(el);
						fraction.index++;
					}
					index = fraction.index-1;
					state = 'broken_rhythm';
				} else if (state === 'sharp2') {
					el.accidental = 'quartersharp';state = 'pitch';
				} else if (state === 'flat2') {
					el.accidental = 'quarterflat';state = 'pitch';
				} else if (state === 'Zduration') {
					var num = tokenizer.getNumber(line, index);
					el.duration = num.num * tune.getBarLength();
					el.rest.text = num.num;
					el.endChar = num.index;
					return el;
				} else return null;
				break;
			case '-':
				if (state === 'startSlur') {
					// This is the first character, so it must have been meant for the previous note. Correct that here.
					tuneBuilder.addTieToLastNote(dottedTie);
					el.endTie = true;
				} else if (state === 'octave' || state === 'duration' || state === 'end_slur') {
					el.startTie = {};
					if (!durationSetByPreviousNote && canHaveBrokenRhythm)
						state = 'broken_rhythm';
					else {
						// Peek ahead to the next character. If it is a space, then we have an end beam.
						if (tokenizer.isWhiteSpace(line[index + 1]))
							addEndBeam(el);
						el.endChar = index+1;
						return el;
					}
				} else if (state === 'broken_rhythm') {el.endChar = index;return el;}
				else return null;
				break;
			case ' ':
			case '\t':
				if (isComplete(state)) {
					el.end_beam = true;
					// look ahead to see if there is a tie
					dottedTie = false;
					do {
						if (line[index] === '.' && line[index+1] === '-') {
							dottedTie = true;
							index++;
						}
						if (line[index] === '-') {
							el.startTie = {};
							if (dottedTie)
								el.startTie.style = "dotted";
						}
						index++;
					} while (index < line.length &&
						(tokenizer.isWhiteSpace(line[index]) || line[index] === '-') ||
						(line[index] === '.' && line[index+1] === '-'));
					el.endChar = index;
					if (!durationSetByPreviousNote && canHaveBrokenRhythm && (line[index] === '<' || line[index] === '>')) {	// TODO-PER: Don't need the test for < and >, but that makes the endChar work out for the regression test.
						index--;
						state = 'broken_rhythm';
					} else
						return el;
				}
				else return null;
				break;
			case '>':
			case '<':
				if (isComplete(state)) {
					if (canHaveBrokenRhythm) {
						var br2 = getBrokenRhythm(line, index);
						index += br2[0] - 1;	// index gets incremented below, so we'll let that happen
						multilineVars.next_note_duration = br2[2];
						el.duration = br2[1]*el.duration;
						state = 'end_slur';
					} else {
						el.endChar = index;
						return el;
					}
				} else
					return null;
				break;
			default:
				if (isComplete(state)) {
					el.endChar = index;
					return el;
				}
				return null;
		}
		index++;
		if (index === line.length) {
			if (isComplete(state)) {el.endChar = index;return el;}
			else return null;
		}
	}
	return null;
};

var getBrokenRhythm = function(line, index) {
	switch (line[index]) {
		case '>':
			if (index < line.length - 2 && line[index + 1] === '>' && line[index + 2] === '>')	// triple >>>
				return [3, 1.875, 0.125];
			else if (index < line.length - 1 && line[index + 1] === '>')	// double >>
				return [2, 1.75, 0.25];
			else
				return [1, 1.5, 0.5];
		case '<':
			if (index < line.length - 2 && line[index + 1] === '<' && line[index + 2] === '<')	// triple <<<
				return [3, 0.125, 1.875];
			else if (index < line.length - 1 && line[index + 1] === '<')	// double <<
				return [2, 0.25, 1.75];
			else
				return [1, 0.5, 1.5];
	}
	return null;
};

module.exports = MusicParser;
