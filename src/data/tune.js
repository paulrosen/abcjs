//    abc_tune.js: a computer usable internal structure representing one tune.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

var parseCommon = require('../parse/common');
var parseKeyVoice = require('../parse/key_voice');
var spacing = require('../write/spacing');

/**
 * This is the data for a single ABC tune. It is created and populated by the window.ABCJS.parse.Parse class.
 * Also known as the ABCJS Abstract Syntax Tree
 * @alternateClassName ABCJS.Tune
 */
var Tune = function() {
	// The structure consists of a hash with the following two items:
	// metaText: a hash of {key, value}, where key is one of: title, author, rhythm, source, transcription, unalignedWords, etc...
	// tempo: { noteLength: number (e.g. .125), bpm: number }
	// lines: an array of elements, or one of the following:
	//
	// STAFF: array of elements
	// SUBTITLE: string
	//
	// TODO: actually, the start and end char should modify each part of the note type
	// The elements all have a type field and a start and end char
	// field. The rest of the fields depend on the type and are listed below:
	// REST: duration=1,2,4,8; chord: string
	// NOTE: accidental=none,dbl_flat,flat,natural,sharp,dbl_sharp
	//		pitch: "C" is 0. The numbers refer to the pitch letter.
	//		duration: .5 (sixteenth), .75 (dotted sixteenth), 1 (eighth), 1.5 (dotted eighth)
	//			2 (quarter), 3 (dotted quarter), 4 (half), 6 (dotted half) 8 (whole)
	//		chord: { name:chord, position: one of 'default', 'above', 'below' }
	//		end_beam = true or undefined if this is the last note in a beam.
	//		lyric: array of { syllable: xxx, divider: one of " -_" }
	//		startTie = true|undefined
	//		endTie = true|undefined
	//		startTriplet = num <- that is the number to print
	//		endTriplet = true|undefined (the last note of the triplet)
	// TODO: actually, decoration should be an array.
	//		decoration: upbow, downbow, accent
	// BAR: type=bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat
	//	number: 1 or 2: if it is the start of a first or second ending
	// CLEF: type=treble,bass
	// KEY-SIG:
	//		accidentals[]: { acc:sharp|dblsharp|natural|flat|dblflat,  note:a|b|c|d|e|f|g }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }

	this.getBeatLength = function() {
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				for (var j = 0; j < this.lines[i].staff.length; j++) {
					if (this.lines[i].staff[j].meter) {
						var meter = this.lines[i].staff[j].meter;
						if (meter.type === "specified") {
							if (meter.value.length > 0) {
								var num = parseInt(meter.value[0].num, 10);
								var den = parseInt(meter.value[0].den, 10);
								if (num === 6 && den === 8) return 3/8;
								if (num === 9 && den === 8) return 3/8;
								if (num === 12 && den === 8) return 3/8;
								return 1/den;
							}
							else
								return null;
						} else if (meter.type === 'cut_time') {
							return 1/2;
						} else {
							return 1/4; // TODO-PER: this works for common time, but not for the ancient meters.
						}
					}
				}
			}
		}
		return null;
	};

	this.reset = function () {
		this.version = "1.0.1";
		this.media = "screen";
		this.metaText = {};
		this.formatting = {};
		this.lines = [];
		this.staffNum = 0;
		this.voiceNum = 0;
		this.lineNum = 0;
	};

	this.cleanUp = function(defWidth, defLength, barsperstaff, staffnonote, currSlur) {
		this.closeLine();	// Close the last line.

		// Remove any blank lines
		var anyDeleted = false;
		var i, s, v;
		for (i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff !== undefined) {
				var hasAny = false;
				for (s = 0; s < this.lines[i].staff.length; s++) {
					if (this.lines[i].staff[s] === undefined) {
						anyDeleted = true;
						this.lines[i].staff[s] = null;
						//this.lines[i].staff[s] = { voices: []};	// TODO-PER: There was a part missing in the abc music. How should we recover?
					} else {
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							if (this.lines[i].staff[s].voices[v] === undefined)
								this.lines[i].staff[s].voices[v] = [];	// TODO-PER: There was a part missing in the abc music. How should we recover?
							else
								if (this.containsNotes(this.lines[i].staff[s].voices[v])) hasAny = true;
						}
					}
				}
				if (!hasAny) {
					this.lines[i] = null;
					anyDeleted = true;
				}
			}
		}
		if (anyDeleted) {
			this.lines = parseCommon.compact(this.lines);
			parseCommon.each(this.lines, function(line) {
				if (line.staff)
					line.staff = parseCommon.compact(line.staff);
			});
		}

		// if we exceeded the number of bars allowed on a line, then force a new line
		if (barsperstaff) {
			for (i = 0; i < this.lines.length; i++) {
				if (this.lines[i].staff !== undefined) {
					for (s = 0; s < this.lines[i].staff.length; s++) {
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							var barNumThisLine = 0;
							for (var n = 0; n < this.lines[i].staff[s].voices[v].length; n++) {
								if (this.lines[i].staff[s].voices[v][n].el_type === 'bar') {
									barNumThisLine++;
									if (barNumThisLine >= barsperstaff) {
										// push everything else to the next line, if there is anything else,
										// and there is a next line. If there isn't a next line, create one.
										if (n < this.lines[i].staff[s].voices[v].length - 1) {
											if (i === this.lines.length - 1) {
												var cp = JSON.parse(JSON.stringify(this.lines[i]));
												this.lines.push(parseCommon.clone(cp));
												for (var ss = 0; ss < this.lines[i+1].staff.length; ss++) {
													for (var vv = 0; vv < this.lines[i+1].staff[ss].voices.length; vv++)
														this.lines[i+1].staff[ss].voices[vv] = [];
												}
											}
											var startElement = n + 1;
											var section = this.lines[i].staff[s].voices[v].slice(startElement);
											this.lines[i].staff[s].voices[v] = this.lines[i].staff[s].voices[v].slice(0, startElement);
											this.lines[i+1].staff[s].voices[v] = section.concat(this.lines[i+1].staff[s].voices[v]);
										}
									}
								}
							}

						}
					}
				}
			}
		}

		// If we were passed staffnonote, then we want to get rid of all staffs that contain only rests.
		if (barsperstaff) {
			anyDeleted = false;
			for (i = 0; i < this.lines.length; i++) {
				if (this.lines[i].staff !== undefined) {
					for (s = 0; s < this.lines[i].staff.length; s++) {
						var keepThis = false;
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							if (this.containsNotesStrict(this.lines[i].staff[s].voices[v])) {
								keepThis = true;
							}
						}
						if (!keepThis) {
							anyDeleted = true;
							this.lines[i].staff[s] = null;
						}
					}
				}
			}
			if (anyDeleted) {
				parseCommon.each(this.lines, function(line) {
					if (line.staff)
						line.staff = parseCommon.compact(line.staff);
				});
			}
		}

		// Remove the temporary working variables
		for (i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				for (s = 0; s < this.lines[i].staff.length; s++)
						delete this.lines[i].staff[s].workingClef;
			}
		}

		function cleanUpSlursInLine(line) {
			var x;
//			var lyr = null;	// TODO-PER: debugging.

			var addEndSlur = function(obj, num, chordPos) {
				if (currSlur[chordPos] === undefined) {
					// There isn't an exact match for note position, but we'll take any other open slur.
					for (x = 0; x < currSlur.length; x++) {
						if (currSlur[x] !== undefined) {
							chordPos = x;
							break;
						}
					}
					if (currSlur[chordPos] === undefined) {
						var offNum = chordPos*100+1;
						parseCommon.each(obj.endSlur, function(x) { if (offNum === x) --offNum; });
						currSlur[chordPos] = [offNum];
					}
				}
				var slurNum;
				for (var i = 0; i < num; i++) {
					slurNum = currSlur[chordPos].pop();
					obj.endSlur.push(slurNum);
//					lyr.syllable += '<' + slurNum;	// TODO-PER: debugging
				}
				if (currSlur[chordPos].length === 0)
					delete currSlur[chordPos];
				return slurNum;
			};

			var addStartSlur = function(obj, num, chordPos, usedNums) {
				obj.startSlur = [];
				if (currSlur[chordPos] === undefined) {
					currSlur[chordPos] = [];
				}
				var nextNum = chordPos*100+1;
				for (var i = 0; i < num; i++) {
					if (usedNums) {
						parseCommon.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
						parseCommon.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
						parseCommon.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
					}
					parseCommon.each(currSlur[chordPos], function(x) { if (nextNum === x) ++nextNum; });
					parseCommon.each(currSlur[chordPos], function(x) { if (nextNum === x) ++nextNum; });

					currSlur[chordPos].push(nextNum);
					obj.startSlur.push({ label: nextNum });
//					lyr.syllable += ' ' + nextNum + '>';	// TODO-PER:debugging
					nextNum++;
				}
			};

			for (var i = 0; i < line.length; i++) {
				var el = line[i];
//				if (el.lyric === undefined)	// TODO-PER: debugging
//					el.lyric = [{ divider: '-' }];	// TODO-PER: debugging
//				lyr = el.lyric[0];	// TODO-PER: debugging
//				lyr.syllable = '';	// TODO-PER: debugging
				if (el.el_type === 'note') {
					if (el.gracenotes) {
						for (var g = 0; g < el.gracenotes.length; g++) {
							if (el.gracenotes[g].endSlur) {
								var gg = el.gracenotes[g].endSlur;
								el.gracenotes[g].endSlur = [];
								for (var ggg = 0; ggg < gg; ggg++)
									addEndSlur(el.gracenotes[g], 1, 20);
							}
							if (el.gracenotes[g].startSlur) {
								x = el.gracenotes[g].startSlur;
								addStartSlur(el.gracenotes[g], x, 20);
							}
						}
					}
					if (el.endSlur) {
						x = el.endSlur;
						el.endSlur = [];
						addEndSlur(el, x, 0);
					}
					if (el.startSlur) {
						x = el.startSlur;
						addStartSlur(el, x, 0);
					}
					if (el.pitches) {
						var usedNums = [];
						for (var p = 0; p < el.pitches.length; p++) {
							if (el.pitches[p].endSlur) {
								var k = el.pitches[p].endSlur;
								el.pitches[p].endSlur = [];
								for (var j = 0; j < k; j++) {
									var slurNum = addEndSlur(el.pitches[p], 1, p+1);
									usedNums.push(slurNum);
								}
							}
						}
						for (p = 0; p < el.pitches.length; p++) {
							if (el.pitches[p].startSlur) {
								x = el.pitches[p].startSlur;
								addStartSlur(el.pitches[p], x, p+1, usedNums);
							}
						}
						// Correct for the weird gracenote case where ({g}a) should match.
						// The end slur was already assigned to the note, and needs to be moved to the first note of the graces.
						if (el.gracenotes && el.pitches[0].endSlur && el.pitches[0].endSlur[0] === 100 && el.pitches[0].startSlur) {
							if (el.gracenotes[0].endSlur)
								el.gracenotes[0].endSlur.push(el.pitches[0].startSlur[0].label);
							else
								el.gracenotes[0].endSlur = [el.pitches[0].startSlur[0].label];
							if (el.pitches[0].endSlur.length === 1)
								delete el.pitches[0].endSlur;
							else if (el.pitches[0].endSlur[0] === 100)
								el.pitches[0].endSlur.shift();
							else if (el.pitches[0].endSlur[el.pitches[0].endSlur.length-1] === 100)
								el.pitches[0].endSlur.pop();
							if (currSlur[1].length === 1)
								delete currSlur[1];
							else
								currSlur[1].pop();
						}
					}
				}
			}
		}

		// TODO-PER: This could be done faster as we go instead of as the last step.
		function fixClefPlacement(el) {
			parseKeyVoice.fixClef(el);
			//if (el.el_type === 'clef') {
//				var min = -2;
//				var max = 5;
//				switch(el.type) {
//					case 'treble+8':
//					case 'treble-8':
//						break;
//					case 'bass':
//					case 'bass+8':
//					case 'bass-8':
//						el.verticalPos = 20 + el.verticalPos; min += 6; max += 6;
//						break;
//					case 'tenor':
//					case 'tenor+8':
//					case 'tenor-8':
//						el.verticalPos = - el.verticalPos; min = -40; max = 40;
////						el.verticalPos+=2; min += 6; max += 6;
//						break;
//					case 'alto':
//					case 'alto+8':
//					case 'alto-8':
//						el.verticalPos = - el.verticalPos; min = -40; max = 40;
////						el.verticalPos-=2; min += 4; max += 4;
//						break;
//				}
//				if (el.verticalPos < min) {
//					while (el.verticalPos < min)
//						el.verticalPos += 7;
//				} else if (el.verticalPos > max) {
//					while (el.verticalPos > max)
//						el.verticalPos -= 7;
//				}
			//}
		}

		function getNextMusicLine(lines, currentLine) {
			currentLine++;
			while (lines.length > currentLine) {
				if (lines[currentLine].staff)
					return lines[currentLine];
				currentLine++;
			}
			return null;
		}

		for (this.lineNum = 0; this.lineNum < this.lines.length; this.lineNum++) {
			var staff = this.lines[this.lineNum].staff;
			if (staff) {
				for (this.staffNum = 0; this.staffNum < staff.length; this.staffNum++) {
					if (staff[this.staffNum].clef)
						fixClefPlacement(staff[this.staffNum].clef);
					for (this.voiceNum = 0; this.voiceNum < staff[this.staffNum].voices.length; this.voiceNum++) {
						var voice = staff[this.staffNum].voices[this.voiceNum];
						cleanUpSlursInLine(voice);
						for (var j = 0; j < voice.length; j++) {
							if (voice[j].el_type === 'clef')
								fixClefPlacement(voice[j]);
						}
						if (voice.length > 0 && voice[voice.length-1].barNumber) {
							// Don't hang a bar number on the last bar line: it should go on the next line.
							var nextLine = getNextMusicLine(this.lines, this.lineNum);
							if (nextLine)
								nextLine.staff[0].barNumber = voice[voice.length-1].barNumber;
							delete voice[voice.length-1].barNumber;
						}
					}
				}
			}
		}

		if (!this.formatting.pagewidth)
			this.formatting.pagewidth = defWidth;
		if (!this.formatting.pageheight)
			this.formatting.pageheight = defLength;

		// Remove temporary variables that the outside doesn't need to know about
		delete this.staffNum;
		delete this.voiceNum;
		delete this.lineNum;
		delete this.potentialStartBeam;
		delete this.potentialEndBeam;
		delete this.vskipPending;

		return currSlur;
	};

	this.reset();

	this.getLastNote = function() {
		if (this.lines[this.lineNum] && this.lines[this.lineNum].staff && this.lines[this.lineNum].staff[this.staffNum] &&
			this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum]) {
			for (var i = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum].length-1; i >= 0; i--) {
				var el = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum][i];
				if (el.el_type === 'note') {
					return el;
				}
			}
		}
		return null;
	};

	this.addTieToLastNote = function() {
		// TODO-PER: if this is a chord, which note?
		var el = this.getLastNote();
		if (el && el.pitches && el.pitches.length > 0) {
			el.pitches[0].startTie = {};
			return true;
		}
		return false;
	};

	this.getDuration = function(el) {
		if (el.duration) return el.duration;
		//if (el.pitches && el.pitches.length > 0) return el.pitches[0].duration;
		return 0;
	};

	this.closeLine = function() {
		if (this.potentialStartBeam && this.potentialEndBeam) {
			this.potentialStartBeam.startBeam = true;
			this.potentialEndBeam.endBeam = true;
		}
		delete this.potentialStartBeam;
		delete this.potentialEndBeam;
	};

	this.appendElement = function(type, startChar, endChar, hashParams)
	{
		var This = this;
		var pushNote = function(hp) {
			if (hp.pitches !== undefined) {
				var mid = This.lines[This.lineNum].staff[This.staffNum].workingClef.verticalPos;
				parseCommon.each(hp.pitches, function(p) { p.verticalPos = p.pitch - mid; });
			}
			if (hp.gracenotes !== undefined) {
				var mid2 = This.lines[This.lineNum].staff[This.staffNum].workingClef.verticalPos;
				parseCommon.each(hp.gracenotes, function(p) { p.verticalPos = p.pitch - mid2; });
			}
			This.lines[This.lineNum].staff[This.staffNum].voices[This.voiceNum].push(hp);
		};
		hashParams.el_type = type;
		if (startChar !== null)
			hashParams.startChar = startChar;
		if (endChar !== null)
			hashParams.endChar = endChar;
		var endBeamHere = function() {
			This.potentialStartBeam.startBeam = true;
			hashParams.endBeam = true;
			delete This.potentialStartBeam;
			delete This.potentialEndBeam;
		};
		var endBeamLast = function() {
			if (This.potentialStartBeam !== undefined && This.potentialEndBeam !== undefined) {	// Do we have a set of notes to beam?
				This.potentialStartBeam.startBeam = true;
				This.potentialEndBeam.endBeam = true;
			}
			delete This.potentialStartBeam;
			delete This.potentialEndBeam;
		};
		if (type === 'note') { // && (hashParams.rest !== undefined || hashParams.end_beam === undefined)) {
			// Now, add the startBeam and endBeam where it is needed.
			// end_beam is already set on the places where there is a forced end_beam. We'll remove that here after using that info.
			// this.potentialStartBeam either points to null or the start beam.
			// this.potentialEndBeam either points to null or the start beam.
			// If we have a beam break (note is longer than a quarter, or an end_beam is on this element), then set the beam if we have one.
			// reset the variables for the next notes.
			var dur = This.getDuration(hashParams);
			if (dur >= 0.25) {	// The beam ends on the note before this.
				endBeamLast();
			} else if (hashParams.force_end_beam_last && This.potentialStartBeam !== undefined) {
				endBeamLast();
			} else if (hashParams.end_beam && This.potentialStartBeam !== undefined) {	// the beam is forced to end on this note, probably because of a space in the ABC
				if (hashParams.rest === undefined)
					endBeamHere();
				else
					endBeamLast();
			} else if (hashParams.rest === undefined) {	// this a short note and we aren't about to end the beam
				if (This.potentialStartBeam === undefined) {	// We aren't collecting notes for a beam, so start here.
					if (!hashParams.end_beam) {
						This.potentialStartBeam = hashParams;
						delete This.potentialEndBeam;
					}
				} else {
					This.potentialEndBeam = hashParams;	// Continue the beaming, look for the end next note.
				}
			}

			//  end_beam goes on rests and notes which precede rests _except_ when a rest (or set of adjacent rests) has normal notes on both sides (no spaces)
//			if (hashParams.rest !== undefined)
//			{
//				hashParams.end_beam = true;
//				var el2 = this.getLastNote();
//				if (el2) el2.end_beam = true;
//				// TODO-PER: implement exception mentioned in the comment.
//			}
		} else {	// It's not a note, so there definitely isn't beaming after it.
			endBeamLast();
		}
		delete hashParams.end_beam;	// We don't want this temporary variable hanging around.
		delete hashParams.force_end_beam_last;	// We don't want this temporary variable hanging around.
		pushNote(hashParams);
	};

	this.appendStartingElement = function(type, startChar, endChar, hashParams2)
	{
		// If we're in the middle of beaming, then end the beam.
		this.closeLine();

		// We only ever want implied naturals the first time.
		var impliedNaturals;
		if (type === 'key') {
			impliedNaturals = hashParams2.impliedNaturals;
			delete hashParams2.impliedNaturals;
		}

		// Clone the object because it will be sticking around for the next line and we don't want the extra fields in it.
		var hashParams = parseCommon.clone(hashParams2);

		if (this.lines[this.lineNum].staff) { // be sure that we are on a music type line before doing the following.
			// If this is a clef type, then we replace the working clef on the line. This is kept separate from
			// the clef in case there is an inline clef field. We need to know what the current position for
			// the note is.
			if (type === 'clef')
				this.lines[this.lineNum].staff[this.staffNum].workingClef = hashParams;

			// If this is the first item in this staff, then we might have to initialize the staff, first.
			if (this.lines[this.lineNum].staff.length <= this.staffNum) {
				this.lines[this.lineNum].staff[this.staffNum] = {};
				this.lines[this.lineNum].staff[this.staffNum].clef = parseCommon.clone(this.lines[this.lineNum].staff[0].clef);
				this.lines[this.lineNum].staff[this.staffNum].key = parseCommon.clone(this.lines[this.lineNum].staff[0].key);
				if (this.lines[this.lineNum].staff[0].meter)
					this.lines[this.lineNum].staff[this.staffNum].meter = parseCommon.clone(this.lines[this.lineNum].staff[0].meter);
				this.lines[this.lineNum].staff[this.staffNum].workingClef = parseCommon.clone(this.lines[this.lineNum].staff[0].workingClef);
				this.lines[this.lineNum].staff[this.staffNum].voices = [[]];
			}

			// These elements should not be added twice, so if the element exists on this line without a note or bar before it, just replace the staff version.
			var voice = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
			for (var i = 0; i < voice.length; i++) {
				if (voice[i].el_type === 'note' || voice[i].el_type === 'bar') {
					hashParams.el_type = type;
					hashParams.startChar = startChar;
					hashParams.endChar = endChar;
					if (impliedNaturals)
						hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
					voice.push(hashParams);
					return;
				}
				if (voice[i].el_type === type) {
					hashParams.el_type = type;
					hashParams.startChar = startChar;
					hashParams.endChar = endChar;
					if (impliedNaturals)
						hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
					voice[i] = hashParams;
					return;
				}
			}
			// We didn't see either that type or a note, so replace the element to the staff.
			this.lines[this.lineNum].staff[this.staffNum][type] = hashParams2;
		}
	};

	this.getNumLines = function() {
		return this.lines.length;
	};

	this.pushLine = function(hash) {
		if (this.vskipPending) {
			hash.vskip = this.vskipPending;
			delete this.vskipPending;
		}
		this.lines.push(hash);
	};

	this.addSubtitle = function(str) {
		this.pushLine({subtitle: str});
	};

	this.addSpacing = function(num) {
		this.vskipPending = num;
	};

	this.addNewPage = function(num) {
		this.pushLine({newpage: num});
	};

	this.addSeparator = function(spaceAbove, spaceBelow, lineLength) {
		this.pushLine({separator: {spaceAbove: spaceAbove, spaceBelow: spaceBelow, lineLength: lineLength}});
	};

	this.addText = function(str) {
		this.pushLine({text: str});
	};

	this.addCentered = function(str) {
		this.pushLine({text: [{text: str, center: true }]});
	};

	this.containsNotes = function(voice) {
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar')
				return true;
		}
		return false;
	};

	this.containsNotesStrict = function(voice) {
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' && voice[i].rest === undefined)
				return true;
		}
		return false;
	};

//	anyVoiceContainsNotes: function(line) {
//		for (var i = 0; i < line.staff.voices.length; i++) {
//			if (this.containsNotes(line.staff.voices[i]))
//				return true;
//		}
//		return false;
//	},

	this.startNewLine = function(params) {
		// If the pointed to line doesn't exist, just create that. If the line does exist, but doesn't have any music on it, just use it.
		// If it does exist and has music, then increment the line number. If the new element doesn't exist, create it.
		var This = this;
		this.closeLine();	// Close the previous line.
		var createVoice = function(params) {
			This.lines[This.lineNum].staff[This.staffNum].voices[This.voiceNum] = [];
			if (This.isFirstLine(This.lineNum)) {
				if (params.name) {if (!This.lines[This.lineNum].staff[This.staffNum].title) This.lines[This.lineNum].staff[This.staffNum].title = [];This.lines[This.lineNum].staff[This.staffNum].title[This.voiceNum] = params.name;}
			} else {
				if (params.subname) {if (!This.lines[This.lineNum].staff[This.staffNum].title) This.lines[This.lineNum].staff[This.staffNum].title = [];This.lines[This.lineNum].staff[This.staffNum].title[This.voiceNum] = params.subname;}
			}
			if (params.style)
				This.appendElement('style', null, null, {head: params.style});
			if (params.stem)
				This.appendElement('stem', null, null, {direction: params.stem});
			else if (This.voiceNum > 0) {
				if (This.lines[This.lineNum].staff[This.staffNum].voices[0]!== undefined) {
					var found = false;
					for (var i = 0; i < This.lines[This.lineNum].staff[This.staffNum].voices[0].length; i++) {
						if (This.lines[This.lineNum].staff[This.staffNum].voices[0].el_type === 'stem')
							found = true;
					}
					if (!found) {
						var stem = { el_type: 'stem', direction: 'up' };
						This.lines[This.lineNum].staff[This.staffNum].voices[0].splice(0,0,stem);
					}
				}
				This.appendElement('stem', null, null, {direction: 'down'});
			}
			if (params.scale)
				This.appendElement('scale', null, null, { size: params.scale} );
		};
		var createStaff = function(params) {
			This.lines[This.lineNum].staff[This.staffNum] = {voices: [ ], clef: params.clef, key: params.key, workingClef: params.clef };
			if (params.vocalfont) This.lines[This.lineNum].staff[This.staffNum].vocalfont = params.vocalfont;
			if (params.bracket) This.lines[This.lineNum].staff[This.staffNum].bracket = params.bracket;
			if (params.brace) This.lines[This.lineNum].staff[This.staffNum].brace = params.brace;
			if (params.connectBarLines) This.lines[This.lineNum].staff[This.staffNum].connectBarLines = params.connectBarLines;
			if (params.barNumber) This.lines[This.lineNum].staff[This.staffNum].barNumber = params.barNumber;
			createVoice(params);
			// Some stuff just happens for the first voice
			if (params.part)
				This.appendElement('part', params.startChar, params.endChar, {title: params.part});
			if (params.meter !== undefined) This.lines[This.lineNum].staff[This.staffNum].meter = params.meter;
		};
		var createLine = function(params) {
			This.lines[This.lineNum] = {staff: []};
			createStaff(params);
		};
		if (this.lines[this.lineNum] === undefined) createLine(params);
		else if (this.lines[this.lineNum].staff === undefined) {
			this.lineNum++;
			this.startNewLine(params);
		} else if (this.lines[this.lineNum].staff[this.staffNum] === undefined) createStaff(params);
		else if (this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] === undefined) createVoice(params);
		else if (!this.containsNotes(this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum])) return;
		else {
			this.lineNum++;
			this.startNewLine(params);
		}
	};

	this.hasBeginMusic = function() {
		// return true if there exists at least one line that contains "staff"
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff)
				return true;
		}
		return false;
	};

	this.isFirstLine = function(index) {
		for (var i = index-1; i >= 0; i--) {
			if (this.lines[i].staff !== undefined) return false;
		}
		return true;
	};

	this.getMeter = function() {
		for (var i = 0; i < this.lines.length; i++) {
			var line = this.lines[i];
			if (line.staff) {
				for (var j = 0; j < line.staff.length; j++) {
					var meter = line.staff[j].meter;
					if (meter) {
						return meter;
					}
				}
			}
		}
		return { type: "common_time", }
	};

	this.getCurrentVoice = function() {
		if (this.lines[this.lineNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] !== undefined)
			return this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
		else return null;
	};

	this.setCurrentVoice = function(staffNum, voiceNum) {
		this.staffNum = staffNum;
		this.voiceNum = voiceNum;
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				if (this.lines[i].staff[staffNum] === undefined || this.lines[i].staff[staffNum].voices[voiceNum] === undefined ||
					!this.containsNotes(this.lines[i].staff[staffNum].voices[voiceNum] )) {
					this.lineNum =  i;
					return;
				}
			}
		}
		this.lineNum =  i;
	};

	this.addMetaText = function(key, value) {
		if (this.metaText[key] === undefined)
			this.metaText[key] = value;
		else
			this.metaText[key] += "\n" + value;
	};

	this.addMetaTextArray = function(key, value) {
		if (this.metaText[key] === undefined)
			this.metaText[key] = [value];
		else
			this.metaText[key].push(value);
	};
	this.addMetaTextObj = function(key, value) {
		this.metaText[key] = value;
	};

	function addVerticalInfo(timingEvents) {
		// Add vertical info to the bar events: put the next event's top, and the event after the next measure's top.
		var lastBarTop;
		var lastBarBottom;
		var lastEventTop;
		var lastEventBottom;
		for (var e = timingEvents.length - 1; e >= 0; e--) {
			var ev = timingEvents[e];
			if (ev.type === 'bar') {
				ev.top = lastEventTop;
				ev.nextTop = lastBarTop;
				lastBarTop = lastEventTop;

				ev.bottom = lastEventBottom;
				ev.nextBottom = lastBarBottom;
				lastBarBottom = lastEventBottom;
			} else if (ev.type === 'event') {
				lastEventTop = ev.top;
				lastEventBottom = ev.top + ev.height;
			}
		}
	}

	function makeSortedArray(hash) {
		var arr = [];
		for (var k in hash) {
			if (hash.hasOwnProperty(k))
				arr.push(hash[k]);
		}
		arr = arr.sort(function (a, b) {
			var diff = a.seconds - b.seconds;
			// if the events have the same time, make sure a bar comes before a note
			if (diff !== 0) {
				return diff;
			}
			else {
				return a.type === "bar" ? -1 : 1;
			}
		});
		return arr;
	}

	this.setupEvents = function(startingDelay, timeDivider) {
		var timingEvents = [];

		var eventHash = {};
		// The time is the number of seconds from the beginning of the piece.
		// The units we are scanning are in notation units (i.e. 0.25 is a quarter note)
		var time = startingDelay;
		var isTiedState = false;
		for (var line = 0; line < this.engraver.staffgroups.length; line++) {
			var group = this.engraver.staffgroups[line];
			var voices = group.voices;
			var firstStaff = group.staffs[0];
			var middleC = firstStaff.absoluteY;
			var top = middleC - firstStaff.top * spacing.STEP;
			var lastStaff = group.staffs[group.staffs.length - 1];
			middleC = lastStaff.absoluteY;
			var bottom = middleC - lastStaff.bottom * spacing.STEP;
			var height = bottom - top;
			var maxVoiceTime = 0;
			// Put in the notes for all voices, then sort them, then remove duplicates
			for (var v = 0; v < voices.length; v++) {
				var voiceTime = time;
				var elements = voices[v].children;
				for (var elem = 0; elem < elements.length; elem++) {
					var element = elements[elem];
					if (element.hint)
						break;
					if (element.duration > 0) {
						// There are 3 possibilities here: the note could stand on its own, the note could be tied to the next,
						// the note could be tied to the previous, and the note could be tied on both sides.
						var isTiedToNext = element.startTie;
						if (isTiedState) {
							if (!isTiedToNext)
								isTiedState = false;
							// If the note is tied on both sides it can just be ignored.
						} else {
							// the last note wasn't tied.
							if (!eventHash["event" + voiceTime])
								eventHash["event" + voiceTime] = {type: "event", seconds: voiceTime, top: top, height: height, left: element.x, width: element.w, elements: [element.elemset] };
							else {
								// If there is more than one voice then two notes can fall at the same time. Usually they would be lined up in the same place, but if it is a whole rest, then it is placed funny. In any case, the left most element wins.
								eventHash["event" + voiceTime].left = Math.min(eventHash["event" + voiceTime].left, element.x);
								eventHash["event" + voiceTime].elements.push(element.elemset);
							}
							if (isTiedToNext)
								isTiedState = true;
						}
						voiceTime += element.duration / timeDivider;
					}
					// if (element.type === 'bar') {
					// 	if (timingEvents.length === 0 || timingEvents[timingEvents.length - 1] !== 'bar') {
					// 		if (element.elemset && element.elemset.length > 0 && element.elemset[0].attrs) {
					// 			var klass = element.elemset[0].attrs['class'];
					// 			var arr = klass.split(' ');
					// 			var lineNum;
					// 			var measureNum;
					// 			for (var i = 0; i < arr.length; i++) {
					// 				var match = /m(\d+)/.exec(arr[i]);
					// 				if (match)
					// 					measureNum = match[1];
					// 				match = /l(\d+)/.exec(arr[i]);
					// 				if (match)
					// 					lineNum = match[1];
					// 			}
					// 			eventHash["bar" + voiceTime] = {type: "bar", seconds: voiceTime, lineNum: lineNum, measureNum: measureNum};
					// 		}
					// 	}
					// }
				}
				maxVoiceTime = Math.max(maxVoiceTime, voiceTime);
			}
			time = maxVoiceTime;
		}
		// now we have all the events, but if there are multiple voices then there may be events out of order or duplicated, so normalize it.
		timingEvents = makeSortedArray(eventHash);
		addVerticalInfo(timingEvents);
		return timingEvents;
	};

	function getVertical(group) {
		var voices = group.voices;
		var firstStaff = group.staffs[0];
		var middleC = firstStaff.absoluteY;
		var top = middleC - firstStaff.top*spacing.STEP;
		var lastStaff = group.staffs[group.staffs.length-1];
		middleC = lastStaff.absoluteY;
		var bottom = middleC - lastStaff.bottom*spacing.STEP;
		var height = bottom - top;
		return { top: top, height: height };
	}

	this.setTiming = function (bpm, measuresOfDelay) {
		var meter = this.getMeter();
		this.barTimings = [];
		var beatLength = this.getBeatLength();
		var beatsPerSecond = bpm / 60;
		var currentTime = []; // per voice

		var measureLength;
		switch(meter.type) {
			case "common_time": measureLength = 1; this.meter = { num: 4, den: 4}; break;
			case "cut_time": measureLength = 1; this.meter = { num: 2, den: 2}; break;
			default: measureLength = meter.value[0].num/meter.value[0].den; this.meter = { num: meter.value[0].num, den: meter.value[0].den};
		}

		var startingDelay = measureLength / beatLength * measuresOfDelay / beatsPerSecond;
		var timeDivider = beatLength * beatsPerSecond;

		this.noteTimings = this.setupEvents(startingDelay, timeDivider);
	};
};

module.exports = Tune;
