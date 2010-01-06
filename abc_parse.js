/**
 * @author paulrosen
 */

/*global Class */
/*extern AbcParse */

var AbcParse = Class.create({
	initialize: function () {
		var tune = new AbcTune();
		var tokenizer = new AbcTokenizer();

		this.getTune = function() {
			return tune;
		};

		var multilineVars = {
			reset: function() {
				this.iChar = 0;
				this.key = {regularKey: {num: 0, acc: 'sharp'}};
				this.meter = {type: 'specified', num: '4', den: '4'};	// if no meter is specified, there is an implied one.
				this.hasMainTitle = false;
				this.default_length = 1;
				this.clef = 'treble';
				this.warnings = null;
				this.next_note_duration = 0;
				this.start_new_line = true;
				this.is_in_header = true;
				this.is_in_history = false;
				this.partForNextLine = "";
				this.havent_set_length = true;
				this.tempo = null;
				this.voices = {};
				this.currentVoice = null;
				this.staves = [];
			}
		};

		var addWarning = function(str) {
			if (!multilineVars.warnings)
				multilineVars.warnings = [];
			multilineVars.warnings.push(str);
		};
		
		var warn = function(str, line, col_num) {
			var bad_char = line[col_num];
			if (bad_char === ' ')
				bad_char = "SPACE";
			var clean_line = line.substring(0, col_num).gsub('\x12', ' ') + '\n' + bad_char + '\n' + line.substring(col_num+1).gsub('\x12', ' ');
			clean_line = clean_line.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;').replace('\n', '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">').replace('\n', '</span>');
			addWarning("Music Line:" + tune.getNumLines() + ":" + (col_num+1) + ': ' + str + ":  " + clean_line);
		};
		
		this.getWarnings = function() {
			return multilineVars.warnings;
		};

		var keys = {
			'C#': {num: 7, acc: 'sharp'},
			'A#m': {num: 7, acc: 'sharp'},
			'G#Mix': {num: 7, acc: 'sharp'},
			'D#Dor': {num: 7, acc: 'sharp'},
			'E#Phr': {num: 7, acc: 'sharp'},
			'F#Lyd': {num: 7, acc: 'sharp'},
			'B#Loc': {num: 7, acc: 'sharp'},

			'F#': {num: 6, acc: 'sharp'},
			'D#m': {num: 6, acc: 'sharp'},
			'C#Mix': {num: 6, acc: 'sharp'},
			'G#Dor': {num: 6, acc: 'sharp'},
			'A#Phr': {num: 6, acc: 'sharp'},
			'BLyd': {num: 6, acc: 'sharp'},
			'E#Loc': {num: 6, acc: 'sharp'},

			'B': {num: 5, acc: 'sharp'},
			'G#m': {num: 5, acc: 'sharp'},
			'F#Mix': {num: 5, acc: 'sharp'},
			'C#Dor': {num: 5, acc: 'sharp'},
			'D#Phr': {num: 5, acc: 'sharp'},
			'ELyd': {num: 5, acc: 'sharp'},
			'A#Loc': {num: 5, acc: 'sharp'},

			'E': {num: 4, acc: 'sharp'},
			'C#m': {num: 4, acc: 'sharp'},
			'BMix': {num: 4, acc: 'sharp'},
			'F#Dor': {num: 4, acc: 'sharp'},
			'G#Phr': {num: 4, acc: 'sharp'},
			'ALyd': {num: 4, acc: 'sharp'},
			'D#Loc': {num: 4, acc: 'sharp'},

			'A': {num: 3, acc: 'sharp'},
			'F#m': {num: 3, acc: 'sharp'},
			'EMix': {num: 3, acc: 'sharp'},
			'BDor': {num: 3, acc: 'sharp'},
			'C#Phr': {num: 3, acc: 'sharp'},
			'DLyd': {num: 3, acc: 'sharp'},
			'G#Loc': {num: 3, acc: 'sharp'},

			'D': {num: 2, acc: 'sharp'},
			'Bm': {num: 2, acc: 'sharp'},
			'AMix': {num: 2, acc: 'sharp'},
			'EDor': {num: 2, acc: 'sharp'},
			'F#Phr': {num: 2, acc: 'sharp'},
			'GLyd': {num: 2, acc: 'sharp'},
			'C#Loc': {num: 2, acc: 'sharp'},

			'G': {num: 1, acc: 'sharp'},
			'Em': {num: 1, acc: 'sharp'},
			'DMix': {num: 1, acc: 'sharp'},
			'ADor': {num: 1, acc: 'sharp'},
			'BPhr': {num: 1, acc: 'sharp'},
			'CLyd': {num: 1, acc: 'sharp'},
			'F#Loc': {num: 1, acc: 'sharp'},

			'C': {num: 0, acc: 'sharp'},
			'Am': {num: 0, acc: 'sharp'},
			'GMix': {num: 0, acc: 'sharp'},
			'DDor': {num: 0, acc: 'sharp'},
			'EPhr': {num: 0, acc: 'sharp'},
			'FLyd': {num: 0, acc: 'sharp'},
			'BLoc': {num: 0, acc: 'sharp'},

			'F': {num: 1, acc: 'flat'},
			'Dm': {num: 1, acc: 'flat'},
			'CMix': {num: 1, acc: 'flat'},
			'GDor': {num: 1, acc: 'flat'},
			'APhr': {num: 1, acc: 'flat'},
			'BbLyd': {num: 1, acc: 'flat'},
			'ELoc': {num: 1, acc: 'flat'},

			'Bb': {num: 2, acc: 'flat'},
			'Gm': {num: 2, acc: 'flat'},
			'FMix': {num: 2, acc: 'flat'},
			'CDor': {num: 2, acc: 'flat'},
			'DPhr': {num: 2, acc: 'flat'},
			'EbLyd': {num: 2, acc: 'flat'},
			'ALoc': {num: 2, acc: 'flat'},

			'Eb': {num: 3, acc: 'flat'},
			'Cm': {num: 3, acc: 'flat'},
			'BbMix': {num: 3, acc: 'flat'},
			'FDor': {num: 3, acc: 'flat'},
			'GPhr': {num: 3, acc: 'flat'},
			'AbLyd': {num: 3, acc: 'flat'},
			'DLoc': {num: 3, acc: 'flat'},

			'Ab': {num: 4, acc: 'flat'},
			'Fm': {num: 4, acc: 'flat'},
			'EbMix': {num: 4, acc: 'flat'},
			'BbDor': {num: 4, acc: 'flat'},
			'CPhr': {num: 4, acc: 'flat'},
			'DbLyd': {num: 4, acc: 'flat'},
			'GLoc': {num: 4, acc: 'flat'},

			'Db': {num: 5, acc: 'flat'},
			'Bbm': {num: 5, acc: 'flat'},
			'AbMix': {num: 5, acc: 'flat'},
			'EbDor': {num: 5, acc: 'flat'},
			'FPhr': {num: 5, acc: 'flat'},
			'GgLyd': {num: 5, acc: 'flat'},
			'CLoc': {num: 5, acc: 'flat'},

			'Gb': {num: 6, acc: 'flat'},
			'Ebm': {num: 6, acc: 'flat'},
			'DbMix': {num: 6, acc: 'flat'},
			'AbDor': {num: 6, acc: 'flat'},
			'BbPhr': {num: 6, acc: 'flat'},
			'CbLyd': {num: 6, acc: 'flat'},
			'FLoc': {num: 6, acc: 'flat'},

			'Cb': {num: 7, acc: 'flat'},
			'Abm': {num: 7, acc: 'flat'},
			'GbMix': {num: 7, acc: 'flat'},
			'DbDor': {num: 7, acc: 'flat'},
			'EbPhr': {num: 7, acc: 'flat'},
			'FbLyd': {num: 7, acc: 'flat'},
			'BbLoc': {num: 7, acc: 'flat'},

			// The following are not in the 2.0 spec, but seem normal enough.
			// TODO-PER: These SOUND the same as what's written, but they aren't right
			'A#': {num: 2, acc: 'flat'},
			'B#': {num: 0, acc: 'sharp'},
			'D#': {num: 3, acc: 'flat'},
			'E#': {num: 1, acc: 'flat'},
			'G#': {num: 4, acc: 'flat'}
		};
		///////////////// private functions ////////////////////
		var parseKey = function(str)	// (and clef)
		{
			var origStr = str;
			// The format is:
			// [space][tonic[#|b][ ][3-letter-mode][ignored-chars][space]][ accidentals...][ clef=treble|bass|bass3|tenor|alto|alto2|alto1|none [+8|-8]]
			// -- or -- the key can be "none"
			// First get the key letter: turn that into a index into the key array (0-11)
			// Then see if there is a sharp or flat. Increment or decrement.
			// Then see if there is a mode modifier. Add or subtract to the index.
			// Then do a mod 12 on the index and return the key.
			// TODO: This may leave unparsed characters at the end after something reasonable was found.

			// check first to see if there is only a clef. If so, just take that, but ignore an error after that.
			var retClef = tokenizer.getClef(str);
			if (retClef.token !== undefined && (retClef.explicit === true || retClef.token !== 'none')) {	// none is the only ambiguous marking. We need to assume that's a key
				multilineVars.clef = retClef.token;
				return {foundClef: true};
			}

			var ret = {};

			var retPitch = tokenizer.getKeyPitch(str);
			if (retPitch.len > 0) {
				var key = retPitch.token;
				str = str.substring(retPitch.len);
				// We got a pitch to start with, so we might also have an accidental and a mode
				var retAcc = tokenizer.getSharpFlat(str);
				if (retAcc.len > 0) {
					key += retAcc.token;
					str = str.substring(retAcc.len);
				}
				var retMode = tokenizer.getMode(str);
				if (retMode.len > 0) {
					key += retMode.token;
					str = str.substring(retMode.len);
				}
				ret.regularKey = keys[key];
			} else if (str.startsWith('HP')) {
				addDirective("bagpipes");
				ret.regularKey = keys.C;
				multilineVars.key = ret;
				return {foundKey: true};
			} else if (str.startsWith('Hp')) {
				ret.extraAccidentals = [ {acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'} ];
				addDirective("bagpipes");
				multilineVars.key = ret;
				return {foundKey: true};
			} else {
				var retNone = tokenizer.isMatch(str, 'none');
				if (retNone > 0) {
					// we got the none key - that's the same as C to us
					ret.regularKey = keys.C;
					str = str.substring(retNone);
				}
			}
			// now see if there are extra accidentals
			var done = false;
			while (!done) {
				var retExtra = tokenizer.getKeyAccidental(str);
				if (retExtra.len === 0)
					done = true;
				else {
					str = str.substring(retExtra.len);
					if (retExtra.warn)
						addWarning("error parsing extra accidentals:" + origStr);
					else {
						if (!ret.extraAccidentals)
							ret.extraAccidentals = [];
						ret.extraAccidentals.push(retExtra.token);
					}
				}
			}

			// now see if there is a clef
			retClef = tokenizer.getClef(str);
			if (retClef.len > 0) {
				if (retClef.warn)
					addWarning("error parsing clef:" + retClef.warn);
				else {
					//ret.clef = retClef.token;
					multilineVars.clef = retClef.token;
				}
			}

			if (ret.regularKey === undefined && ret.extraAccidentals === undefined && retClef.token === undefined) {
				addWarning("error parsing key: " + origStr);
				//ret.regularKey = keys.C;
				return {};
			}
			var result = {};
			if (retClef.token !== undefined)
				result.foundClef = true;
			if (ret.regularKey !== undefined || ret.extraAccidentals !== undefined) {
				multilineVars.key = ret;
				result.foundKey = true;
			}
			return result;
		};

		var substInChord = function(str)
		{
			while ( str.indexOf("\\n") !== -1)
			{
				str = str.replace("\\n", "\n");
			}
			return str;
		};

		var getBrackettedSubstring = function(line, i, maxErrorChars, _matchChar)
		{
			// This extracts the sub string by looking at the first character and searching for that
			// character later in the line (or search for the optional _matchChar). 
			// For instance, if the first character is a quote it will look for
			// the end quote. If the end of the line is reached, then only up to the default number
			// of characters are returned, so that a missing end quote won't eat up the entire line.
			// It returns the substring and the number of characters consumed.
			// The number of characters consumed is normally two more than the size of the substring,
			// but in the error case it might not be.
			var matchChar = _matchChar || line[i];
			var pos = i+1;
			while ((pos < line.length) && (line[pos] !== matchChar))
				++pos;
			if (line[pos] === matchChar)
				return [pos-i+1,substInChord(line.substring(i+1, pos)), true];
			else	// we hit the end of line, so we'll just pick an arbitrary num of chars so the line doesn't disappear.
			{
				pos = i+maxErrorChars;
				if (pos > line.length-1)
					pos = line.length-1;
				return [pos-i+1, substInChord(line.substring(i+1, pos)), false];
			}
		};

		var letter_to_chord = function(line, i)
		{
			if (line[i] === '"')
			{
				var chord = getBrackettedSubstring(line, i, 5);
				if (!chord[2])
					warn("Missing the closing quote while parsing the chord symbol", line , i);
				// If it starts with ^, then the chord appears above.
				// If it starts with _ then the chord appears below.
				// (note that the 2.0 draft standard defines them as not chords, but annotations and also defines < > and @.)
				if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '^') {
					chord[1] = chord[1].substring(1);
					chord[2] = 'above';
				} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '_') {
					chord[1] = chord[1].substring(1);
					chord[2] = 'below';
				} else
					chord[2] = 'default';
				return chord;
			}
			return [0, ""];
		};

		var letter_to_accent = function(line, i)
		{
			switch (line[i])
			{
				case '.':return [1, 'staccato'];
				case 'u':return [1, 'upbow'];
				case 'v':return [1, 'downbow'];
				case '~':return [1, 'roll'];
				case '!':
				case '+':
					var ret = getBrackettedSubstring(line, i, 5);
					// Be sure that the accent is recognizable.
					var legalAccents = [ "trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
						"emphasis", "fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
						"open", "thumb", "snap", "turn", "roll", "breath", "shortphrase", "mediumphrase", "longphrase",
						"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
						"p", "pp", "f", "ff", "mf", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2", "slide",
						"upbow", "downbow" ];
					if (ret[1].length > 0 && (ret[1][0] === '^' || ret[1][0] ==='_'))
						ret[1] = ret[1].substring(1);	// TODO-PER: The test files have indicators forcing the orniment to the top or bottom, but that isn't in the standard. We'll just ignore them.
					if (legalAccents.detect(function(acc) {
						return (ret[1] === acc);
					}))
						return ret;
					// We didn't find the accent in the list, so consume the space, but don't return an accent.
					// Although it is possible that ! was used as a line break, so accept that.
					if (line[i] === '!' && (ret[0] === 1 || line[i+ret[0]-1] !== '!'))
						return [1, null ];
					warn("Unknown decoration: " + ret[1], line, i);
					ret[1] = "";
					return ret;
				case 'H':return [1, 'fermata'];
				case 'J':return [1, 'slide'];
				case 'M':return [1, 'mordent'];
				case 'R':return [1, 'roll'];
				case 'T':return [1, 'trill'];
			}
			return [0, 0];
		};

		var letter_to_spacer = function(line, i)
		{
			var start = i;
			while (tokenizer.isWhiteSpace(line[i]))
				i++;
			return [ i-start ];
		};

		var letter_to_inline_header = function(line, i)
		{
			var ws = tokenizer.eatWhiteSpace(line, i);
			i +=ws;
			if (line.length >= i+5) {
				var e = line.indexOf(']', i);
				switch(line.substring(i, i+3))
				{
					case "[I:":
						var err = addDirective(line.substring(i+3, e));
						if (err) warn(err, line, i);
						return [ e-i+1+ws ];
					case "[M:":
						setMeter(line.substring(i+3, e));
						tune.appendStartingElement('meter', -1, -1, multilineVars.meter);
						return [ e-i+1+ws ];
					case "[K:":
						var result = parseKey(line.substring(i+3, e));
						if (result.foundClef)
							tune.appendStartingElement('clef', -1, -1, {type: multilineVars.clef});
						if (result.foundKey)
							tune.appendStartingElement('key', -1, -1, multilineVars.key);
						return [ e-i+1+ws ];
					case "[P:":
						tune.appendElement('part', -1, -1, {title: line.substring(i+3, e)});
						return [ e-i+1+ws ];
					case "[L:":
					case "[Q:":
						if (e > 0)
							return [ e-i+1+ws, line[i+1], line.substring(i+3, e)];
						break;
					case "[V:":
						if (e > 0) {
							parseVoice(line, i+3, e);
							startNewLine();
							return [ e-i+1+ws, line[i+1], line.substring(i+3, e)];
						}
						break;

					default:
						// TODO: complain about unhandled header
				}
			}
			return [ 0 ];
		};

		var letter_to_body_header = function(line, i)
		{
			if (line.length >= i+3) {
				switch(line.substring(i, i+2))
				{
					case "I:":
						var err = addDirective(line.substring(i+2));
						if (err) warn(err, line, i);
						return [ line.length ];
					case "M:":
						setMeter(line.substring(i+2));
						tune.appendStartingElement('meter', -1, -1, multilineVars.meter);
						return [ line.length ];
					case "K:":
						var result = parseKey(line.substring(i+2));
						if (result.foundClef)
							tune.appendStartingElement('clef', -1, -1, {type: multilineVars.clef});
						if (result.foundKey)
							tune.appendStartingElement('key', -1, -1, multilineVars.key);
						return [ line.length ];
					case "P:":
						tune.appendStartingElement('part', -1, -1, {title: line.substring(i+2)});
						return [ line.length ];
					case "L:":
					case "Q:":
						// TODO-PER: handle these
						return [ line.length, line[i], line.substring(2).strip()];
						break;
					case "V:":
						parseVoice(line, 2, line.length);
//						setCurrentVoice(line.substring(2).strip());
						startNewLine();
						return [ line.length, line[i], line.substring(2).strip()];
					default:
						// TODO: complain about unhandled header
				}
			}
			return [ 0 ];
		};

		// returns the class of the bar line
		// the number of the repeat
		// and the number of characters used up
		// if 0 is returned, then the next element was not a bar line
		var letter_to_bar = function(line, curr_pos)
		{
			var ret = tokenizer.getBarLine(line.substring(curr_pos));
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
				if (line[curr_pos+ret.len+ws] !== ' ')
					break;
			var orig_bar_len = ret.len;
			if (line[curr_pos+ret.len+ws] === '[') {
				ret.len += ws + 1;
				// It can also be a quoted string. It is unclear whether that construct requires '[', but it seems like it would. otherwise it would be confused with a regular chord.
				if (line[curr_pos+ret.len] === '"') {
					var ending = getBrackettedSubstring(line, curr_pos+ret.len, 5);
					return [ret.len+ending[0], ret.token, ending[1]];
				}
			}
			var retRep = tokenizer.getTokenOf(line.substring(curr_pos+ret.len), "1234567890-,");
			if (retRep.len === 0)
				return [orig_bar_len, ret.token];

			return [ret.len+retRep.len, ret.token, retRep.token];
		};

		var letter_to_open_slurs_and_triplets =  function(line, i) {
			// consume spaces, and look for all the open parens. If there is a number after the open paren,
			// that is a triplet. Otherwise that is a slur. Collect all the slurs and the first triplet.
			var ret = {};
			var start = i;
			while (line[i] === '(' || tokenizer.isWhiteSpace(line[i])) {
				if (line[i] === '(') {
					if (i+1 < line.length && (line[i+1] >= '2' && line[i+1] <= '9')) {
						if (ret.triplet !== undefined)
							warn("Can't nest triplets", line, i);
						else {
							ret.triplet = line[i+1] - '0';
							if (i+2 < line.length && line[i+2] === ':') {
								// We are expecting "(p:q:r" or "(p:q" or "(p::r" we are only interested in the first number (p) and the number of notes (r)
								// if r is missing, then it is equal to p.
								if (i+3 < line.length && line[i+3] === ':') {
									if (i+4 < line.length && (line[i+4] >= '1' && line[i+4] <= '9')) {
										ret.num_notes = line[i+4] - '0';
										i += 3;
									} else
										warn("expected number after the two colons after the triplet to mark the duration", line, i);
								} else if (i+3 < line.length && (line[i+3] >= '1' && line[i+3] <= '9')) {
									// ignore this middle number
									if (i+4 < line.length && line[i+4] === ':') {
										if (i+5 < line.length && (line[i+5] >= '1' && line[i+5] <= '9')) {
											ret.num_notes = line[i+5] - '0';
											i += 4;
										}
									} else {
										ret.num_notes = ret.triplet;
										i += 3;
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

		var letter_to_grace =  function(line, i) {
			// Grace notes are an array of: startslur, note, endslur, space; where note is accidental, pitch, duration
			if (line[i] === '{') {
				// fetch the gracenotes string and consume that into the array
				var gra = getBrackettedSubstring(line, i, 1, '}');
				if (!gra[2])
					warn("Missing the closing '}' while parsing grace note", line, i);

				var gracenotes = [];
				var ii = 0;
				var inTie = false;
				while (ii < gra[1].length) {
					var note = getCoreNote(gra[1], ii, {}, false);
					if (note !== null) {
						gracenotes.push(note);

						if (inTie) {
							note.endTie = true;
							inTie = false;
						}
						if (note.startTie)
							inTie = true;

						ii  = note.endChar;
						delete note.endChar;
					}
					else {
						// We shouldn't get anything but notes or a space here, so report an error
						if (gra[1][ii] === ' ') {
							if (gracenotes.length > 0)
								gracenotes[gracenotes.length-1].end_beam = true;
						} else
							warn("Unknown character '" + gra[1][ii] + "' while parsing grace note", line, i);
						ii++;
					}
				}
				if (gracenotes.length)
					return [gra[0], gracenotes];
//				for (var ret = letter_to_pitch(gra[1], ii); ret[0]>0 && ii<gra[1].length;
//					ret = letter_to_pitch(gra[1], ii)) {
//					//todo get other stuff that could be in a grace note
//					ii += ret[0];
//					gracenotes.push({el_type:"gracenote",pitch:ret[1]});
//				}
//				return [ gra[0], gracenotes ];
			}
			return [ 0 ];
		};

		var addDirective = function(str) {
			var s = tokenizer.stripComment(str).strip();
			if (s.length === 0)	// 3 or more % in a row, or just spaces after %% is just a comment
				return null;
			var i = s.indexOf(' ');
			var cmd = (i > 0) ? s.substring(0, i) : s;
			var num;
			cmd = cmd.toLowerCase();
			switch (cmd)
			{
				case "bagpipes":tune.formatting.bagpipes = true;break;
				case "stretchlast":tune.formatting.stretchlast = true;break;
				case "staffwidth":
					num = tokenizer.getInt(s.substring(i));
					if (num.digits === 0)
						return "Directive \"" + cmd + "\" requires a number as a parameter.";
					tune.formatting.staffwidth = num.value;
					break;
				case "scale":
					num = tokenizer.getFloat(s.substring(i));
					if (num.digits === 0)
						return "Directive \"" + cmd + "\" requires a number as a parameter.";
					tune.formatting.scale = num.value;
					break;
				case "sep":
					// TODO-PER: This actually goes into the stream, it is not global
					tune.formatting.sep = s.substring(i);
					break;
				case "score":
				case "indent":
				case "voicefont":
				case "titlefont":
				case "barlabelfont":
				case "barnumfont":
				case "barnumberfont":
				case "barnumbers":
				case "topmargin":
				case "botmargin":
				case "topspace":
				case "titlespace":
				case "subtitlespace":
				case "composerspace":
				case "musicspace":
				case "partsspace":
				case "wordsspace":
				case "textspace":
				case "vocalspace":
				case "staffsep":
				case "linesep":
				case "midi":
				case "titlecaps":
				case "titlefont":
				case "composerfont":
				case "indent":
				case "playtempo":
				case "auquality":
				case "text":
				case "begintext":
				case "endtext":
				case "vocalfont":
				case "systemsep":
				case "sysstaffsep":
				case "landscape":
				case "gchordfont":
				case "leftmargin":
				case "partsfont":
				case "staves":
				case "slurgraces":
				case "titleleft":
				case "subtitlefont":
				case "tempofont":
				case "continuous":
				case "botspace":
				case "nobarcheck":
					// TODO-PER: Actually handle the parameters of these
					tune.formatting[cmd] = s.substring(i);
					break;
				default:
					return "Unknown directive: " + cmd;
					break;
			}
			return null;
		};

		function setCurrentVoice(id) {
			multilineVars.currentVoice = multilineVars.voices[id];
			tune.setCurrentVoice(multilineVars.currentVoice.staffNum, multilineVars.currentVoice.index);
		}

		function parseVoice(line, i, e) {
			//First truncate the string to the first non-space character after V: through either the
			//end of the line or a % character. Then remove trailing spaces, too.
			var ret = tokenizer.getMeat(line, i, e);
			var start = ret.start;
			var end = ret.end;
			//The first thing on the line is the ID. It can be any non-space string and terminates at the
			//first space.
			var id = tokenizer.getToken(line, start, end);
			if (id.length === 0) {
				warn("Expected a voice id", line, start);
				return;
			}
			var isNew = false;
			if (multilineVars.voices[id] === undefined) {
				multilineVars.voices[id] = {};
				isNew = true;
			}
			start += id.length;
			start += tokenizer.eatWhiteSpace(line, start);

			var staffInfo = {startStaff: isNew};
			var addNextTokenToStaffInfo = function(name) {
				var attr = tokenizer.getVoiceToken(line, start, end);
				if (attr.warn !== undefined)
					warn("Expected value for " + name + " in voice: " + attr.warn, line, start);
				else if (attr.token.length === 0)
					warn("Expected value for " + name + " in voice", line, start);
				else
					staffInfo[name] = attr.token;
				start += attr.len;
			};

			//Then the following items can occur in any order:
			while (start < end) {
				var token = tokenizer.getVoiceToken(line, start, end);
				start += token.len;

				if (token.warn) {
					warn("Error parsing voice: " + token.warn, line, start);
				} else {
					var attr = null;
					switch (token.token) {
						case 'clef':
						case 'cl':
							addNextTokenToStaffInfo('clef');
							break;
						case 'treble':
						case 'bass':
						case 'tenor':
						case 'alto':
						case 'none':
						case 'treble\'':
						case 'bass\'':
						case 'tenor\'':
						case 'alto\'':
						case 'none\'':
						case 'treble\'\'':
						case 'bass\'\'':
						case 'tenor\'\'':
						case 'alto\'\'':
						case 'none\'\'':
						case 'treble,':
						case 'bass,':
						case 'tenor,':
						case 'alto,':
						case 'none,':
						case 'treble,,':
						case 'bass,,':
						case 'tenor,,':
						case 'alto,,':
						case 'none,,':
							staffInfo.clef = token.token;
							break;
						case 'staves':
						case 'stave':
						case 'stv':
							addNextTokenToStaffInfo('staves');
							break;
						case 'brace':
						case 'brc':
							addNextTokenToStaffInfo('brace');
							break;
						case 'bracket':
						case 'brk':
							addNextTokenToStaffInfo('bracket');
							break;
						case 'name':
						case 'nm':
							addNextTokenToStaffInfo('name');
							break;
						case 'subname':
						case 'sname':
						case 'snm':
							addNextTokenToStaffInfo('subname');
							break;
						case 'merge':
							staffInfo.startStaff = false;
							break;
						case 'stems':
							attr = tokenizer.getVoiceToken(line, start, end);
							if (attr.warn !== undefined)
								warn("Expected value for stems in voice: " + attr.warn, line, start);
							else if (attr.token === 'up' || attr.token === 'down')
								multilineVars.voices[id].stem = attr.token;
							else
								warn("Expected up or down for voice stem", line, start);
							start += attr.len;
							break;
						case 'up':
						case 'down':
							multilineVars.voices[id].stem = token.token;
							break;
						case 'middle':
						case 'm':
							addNextTokenToStaffInfo('middle');
							break;
						case 'gchords':
						case 'gch':
							multilineVars.voices[id].suppressChords = true;
							break;
						case 'space':
						case 'spc':
							addNextTokenToStaffInfo('spacing');
							break;
					}
				}
				start += tokenizer.eatWhiteSpace(line, start);
			}

			// now we've filled up staffInfo, figure out what to do with this voice
			// TODO-PER: It is unclear from the standard and the examples what to do with brace, bracket, and staves, so they are ignored for now.
			if (staffInfo.startStaff || multilineVars.staves.length === 0) {
				multilineVars.staves.push({ index: multilineVars.staves.length });
				// TODO-PER: For now, the entire collection is bracketted. Refine this later.
				if (multilineVars.staves.length > 1) {
					multilineVars.staves[0].bracket = 'start';
					for (var b = 1; b < multilineVars.staves.length-1; b++)
						multilineVars.staves[b].bracket = "continue";
					multilineVars.staves[multilineVars.staves.length-1].bracket = 'end';
				}
				multilineVars.staves[multilineVars.staves.length-1].numVoices = 0;
			}
			if (multilineVars.voices[id].staffNum === undefined) {
				// store where to write this for quick access later.
				multilineVars.voices[id].staffNum = multilineVars.staves.length-1;
				var vi = 0;
				for(var v in multilineVars.voices) {
					if(multilineVars.voices.hasOwnProperty(v)) {
						if (multilineVars.voices[v].staffNum === multilineVars.voices[id].staffNum)
							vi++;
					}
				}
				multilineVars.voices[id].index = vi-1;
			}
			var s = multilineVars.staves[multilineVars.staves.length-1];
			s.numVoices++;
			if (staffInfo.clef) s.clef = staffInfo.clef;
			if (staffInfo.spacing) s.spacing_below_offset = staffInfo.spacing;
			if (staffInfo.middle) s.middle = staffInfo.middle;

			if (staffInfo.name) {if (s.name) s.name.push(staffInfo.name); else s.name = [ staffInfo.name ];}
			if (staffInfo.subname) {if (s.subname) s.name.push(staffInfo.subname); else s.subname = [ staffInfo.subname ];}

			setCurrentVoice(id);
		}

		var setTitle = function(title) {
			if (multilineVars.hasMainTitle)
				tune.addSubtitle(tokenizer.translateString(tokenizer.stripComment(title)));	// display secondary title
			else
			{
				tune.addMetaText("title", tokenizer.translateString(tokenizer.theReverser(tokenizer.stripComment(title))));
				multilineVars.hasMainTitle = true;
			}
		};
		
		var setMeter = function(meter) {
			meter = tokenizer.stripComment(meter);
			if (meter === 'C') {
				multilineVars.meter = {type: 'common_time'};
				multilineVars.havent_set_length = false;
			} else if (meter === 'C|') {
				multilineVars.meter = {type: 'cut_time'};
				multilineVars.havent_set_length = false;
			} else if (meter.length === 0 || meter.toLowerCase() === 'none')
				multilineVars.meter = null;
			else
			{
				var a = meter.split('/');
				if (a.length === 2)
					multilineVars.meter = {type: 'specified', num: a[0].strip(), den: a[1].strip()};
					if (multilineVars.havent_set_length === true) {
						multilineVars.default_length = multilineVars.meter.num/multilineVars.meter.den < 0.75 ? 0.5 : 1;
						multilineVars.havent_set_length = false;
					}
			}
		};

		var addWords = function(line, words) {
			if (!line) { warn("Can't add words before the first line of mulsic", line, 0); return; }
			words = words.strip();
			if (words[words.length-1] !== '-')
				words = words + ' ';	// Just makes it easier to parse below, since every word has a divider after it.
			var word_list = [];
			// first make a list of words from the string we are passed. A word is divided on either a space or dash.
			var last_divider = 0;
			var replace = false;
			var addWord = function(i) {
				var word = words.substring(last_divider, i).strip();
				last_divider = i+1;
				if (word.length > 0) {
					if (replace)
						word = word.gsub('~', ' ');
					var div = words[i];
					if (div !== '_' && div !== '-')
						div = ' ';
					word_list.push({syllable: tokenizer.translateString(word), divider: div});
					replace = false;
					return true;
				}
				return false;
			};
			for (var i = 0; i < words.length; i++) {
				switch (words[i]) {
					case ' ':
						addWord(i);
						break;
					case '-':
						if (!addWord(i) && word_list.length > 0) {
							word_list.last().divider = '-';
							word_list.push({skip: true, to: 'next'});
						}
						break;
					case '_':
						addWord(i);
						word_list.push({skip: true, to: 'slur'});
						break;
					case '*':
						addWord(i);
						word_list.push({skip: true, to: 'next'});
						break;
					case '|':
						addWord(i);
						word_list.push({skip: true, to: 'bar'});
						break;
					case '~':
						replace = true;
						break;
				}
			}

			var inSlur = false;
			line.each(function(el) {
				if (word_list.length !== 0) {
					if (word_list[0].skip) {
						switch (word_list[0].to) {
							case 'next': if (el.el_type === 'note' && el.pitch !== null && !inSlur) word_list.shift(); break;
							case 'slur': if (el.el_type === 'note' && el.pitch !== null) word_list.shift(); break;
							case 'bar': if (el.el_type === 'bar') word_list.shift(); break;
						}
					} else {
						if (el.el_type === 'note' && el.pitch !== null && !inSlur) {
							var lyric = word_list.shift();
							if (el.lyric === undefined)
								el.lyric = [ lyric ];
							else
								el.lyric.push(lyric);
						}
					}
//					if (el.endSlur === true || el.endTie === true)
//						inSlur = false;
//					if (el.startSlur === true || el.startTie === true)
//						inSlur = true;
				}
			});
		};

		var getBrokenRhythm = function(line, index) {
			switch (line[index]) {
				case '>':
					if (index < line.length - 1 && line[index+1] === '>')	// double >>
						return [2, 1.75, 0.25];
					else
						return [1, 1.5, 0.5];
					break;
				case '<':
					if (index < line.length - 1 && line[index+1] === '<')	// double <<
						return [2, 0.25, 1.75];
					else
						return [1, 0.5, 1.5];
					break;
			}
			return null;
		};

		// TODO-PER: make this a method in el.
		var addEndBeam = function(el) {
			if (el.pitch !== null && el.duration < 2)
				el.end_beam = true;
			if (el.pitches !== undefined && el.pitches[0].duration < 2)
				el.end_beam = true;
			return el;
		};

		var pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};
		var rests = {x: 'invisible', y: 'spacer', z: 'rest'};
		var getCoreNote = function(line, index, el, canHaveBrokenRhythm) {
			//var el = { startChar: index };
			var isComplete = function(state) {
				return (state === 'octave' || state == 'duration' || state == 'broken_rhythm' || state === 'end_slur');
			};
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
							state = 'octave';
							// At this point we have a valid note. The rest is optional. Set the duration in case we don't get one below
							if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
								el.duration = multilineVars.next_note_duration;
								multilineVars.next_note_duration = 0;
								durationSetByPreviousNote = true;
							} else
								el.duration = multilineVars.default_length;
						} else if (isComplete(state)) {el.endChar = index;return el;}
						else return null;
						break;
					case ',':
						if (state === 'octave') {el.pitch -= 7;}
						else if (isComplete(state)) {el.endChar = index;return el;}
						else return null;
						break;
					case '\'':
						if (state === 'octave') {el.pitch += 7;}
						else if (isComplete(state)) {el.endChar = index;return el;}
						else return null;
						break;
					case 'x':
					case 'y':
					case 'z':
						if (state === 'startSlur') {
							el.pitch = null;
							el.rest_type = rests[line[index]];
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
							if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
								el.duration = multilineVars.next_note_duration;
								multilineVars.next_note_duration = 0;
								durationSetByPreviousNote = true;
							} else
								el.duration = multilineVars.default_length;
							state = 'duration';
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
							if (!durationSetByPreviousNote)
								el.duration = el.duration * fraction.value;
							// TODO-PER: We can test the returned duration here and give a warning if it isn't the one expected.
							el.endChar = fraction.index;
							while (fraction.index < line.length && (tokenizer.isWhiteSpace(line[fraction.index]) || line[fraction.index] === '-')) {
								if (line[fraction.index] === '-')
									el.startTie = true;
								else
									el = addEndBeam(el);
								fraction.index++;
							}
							index = fraction.index-1;
							state = 'broken_rhythm';
						} else return null;
						break;
					case '-':
						if (state === 'octave' || state === 'duration' || state === 'end_slur') {
							el.startTie = true;
							if (!durationSetByPreviousNote && canHaveBrokenRhythm)
								state = 'broken_rhythm';
							else {
								// Peek ahead to the next character. If it is a space, then we have an end beam.
								if (tokenizer.isWhiteSpace(line[index+1]))
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
							el = addEndBeam(el);
							el.endChar = index;
							// look ahead to see if there is a tie
							do {
								if (line[index] === '-')
									el.startTie = true;
								index++;
							} while (index < line.length && (tokenizer.isWhiteSpace(line[index]) || line[index] === '-'));
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
								multilineVars.next_note_duration = br2[2]*el.duration;
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

		function startNewLine() {
			var params = { startChar: -1, endChar: -1};
			if (multilineVars.partForNextLine.length)
				params.part =multilineVars.partForNextLine;
			params.clef = multilineVars.currentVoice && multilineVars.currentVoice.clef !== undefined ? multilineVars.currentVoice.clef : multilineVars.clef ;
			params.key = multilineVars.key;
			if (multilineVars.meter !== null)
				params.meter = multilineVars.meter;
			if (multilineVars.currentVoice && multilineVars.currentVoice.name)
				params.name = multilineVars.currentVoice.name;
			tune.startNewLine(params);

			multilineVars.partForNextLine = "";
			multilineVars.meter = null;
		}

		function resolveTempo() {
			if (multilineVars.tempo) {	// If there's a tempo waiting to be resolved
				var dur = multilineVars.default_length ? multilineVars.default_length / 8 : 1/8;
				for (var i = 0; i < multilineVars.tempo.duration; i++)
					multilineVars.tempo.duration[i] = dur * multilineVars.tempo.duration[i];
				tune.metaText.tempo = multilineVars.tempo;
				delete multilineVars.tempo;
			}
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

		var parseRegularMusicLine = function(line) {
			resolveTempo();
			multilineVars.havent_set_length = false;	// To late to set this now.
			multilineVars.is_in_header = false;	// We should have gotten a key header by now, but just in case, this is definitely out of the header.
			var i = 0;
			var startOfLine = multilineVars.iChar;
			// see if there is nothing but a comment on this line. If so, just ignore it. A full line comment is optional white space followed by %
			while (tokenizer.isWhiteSpace(line[i]) && i < line.length)
				i++;
			if (i === line.length || line[i] === '%')
				return;

			// Start with the standard staff, clef and key symbols on each line
			if (multilineVars.start_new_line) {
				startNewLine();
			}
			multilineVars.start_new_line = true;
			var tripletNotesLeft = 0;
			//var tripletMultiplier = 0;
			var inTie = false;
			var inTieChord = {};

			// See if the line starts with a header field
			var retHeader = letter_to_body_header(line, i);
			if (retHeader[0] > 0) {
				i += retHeader[0];
				// TODO-PER: Handle inline headers
			}
			var el = { };

			while (i < line.length)
			{
				var startI = i;
				if (line[i] === '%')
					break;

				var retInlineHeader = letter_to_inline_header(line, i);
				if (retInlineHeader[0] > 0) {
						i += retInlineHeader[0];
						// TODO-PER: Handle inline headers
						//multilineVars.start_new_line = false;
				} else {
//					var el = { };

					// We need to decide if the following characters are a bar-marking or a note-group.
					// Unfortunately, that is ambiguous. Both can contain chord symbols and decorations.
					// If there is a grace note either before or after the chord symbols and decorations, then it is definitely a note-group.
					// If there is a bar marker, it is definitely a bar-marking.
					// If there is either a core-note or chord, it is definitely a note-group.
					// So, loop while we find grace-notes, chords-symbols, or decorations. [It is an error to have more than one grace-note group in a row; the others can be multiple]
					// Then, if there is a grace-note, we know where to go.
					// Else see if we have a chord, core-note, slur, triplet, or bar.

					while (1) {
						var ret = tokenizer.eatWhiteSpace(line, i);
						if (ret > 0) {
							i += ret;
						}
						if (i > 0 && line[i-1] === '\x12') {
							// there is one case where a line continuation isn't the same as being on the same line, and that is if the next character after it is a header.
							ret = letter_to_body_header(line, i);
							if (ret[0] > 0) {
								// TODO: insert header here
								i += ret[0];
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
							// TODO-PER: There could be more than one chord here if they have different positions.
							el.chord = {name: tokenizer.translateString(ret[1]), position: ret[2]};
							i += ret[0];
							i += tokenizer.skipWhiteSpace(line.substring(i));
						} else {
							ret = letter_to_accent(line, i);
							if (ret[0] > 0) {
								if (ret[1] === null) {
									 if (i+1 < line.length)
										startNewLine();	// There was a ! in the middle of the line. Start a new line if there is anything after it.
								} else if (ret[1].length > 0) {
									if (el.decoration === undefined)
										el.decoration = [];
									el.decoration.push(ret[1]);
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
						if (el.gracenote !== undefined)
							warn("Can't have a grace note before a barline", line, i);
						var bar = {type: ret[1]};
						if (bar.type.length === 0)
							warn("Unknown bar type", line, i);
						else {
							if (ret[2])
								bar.number = ret[2];
							if (el.decoration !== undefined)
								bar.decoration = el.decoration;
							if (el.chord !== undefined)
								bar.chord = el.chord;
							tune.appendElement('bar', startOfLine+i, startOfLine+i+ret[0], bar);
							el = {};
						}
						i += ret[0];
					} else {
						// This is definitely a note group
						// 
						// Look for as many open slurs and triplets as there are. (Note: only the first triplet is valid.)
						ret = letter_to_open_slurs_and_triplets(line, i);
						if (ret.consumed > 0) {
							if (ret.startSlur !== undefined)
								el.startSlur = ret.startSlur;
							if (ret.triplet !== undefined) {
								if (tripletNotesLeft > 0)
									warn("Can't nest triplets", line, i);
								else {
									el.startTriplet = ret.triplet;
									tripletNotesLeft = ret.num_notes === undefined ? ret.triplet : ret.num_notes;
								}
							}
							i += ret.consumed;
						}

						// handle chords.
						if (line[i] === '[') {
							i++;
							var chordDuration = null;

							var done = false;
							while (!done) {
								var chordNote = getCoreNote(line, i, {}, false);
								if (chordNote !== null) {
									if (el.pitches === undefined)
										el.pitches = [ chordNote ];
									else
										el.pitches.push(chordNote);

									if (inTieChord[el.pitches.length]) {
										chordNote.endTie = true;
										inTieChord[el.pitches.length] = undefined;
									}
									if (chordNote.startTie)
										inTieChord[el.pitches.length] = true;

									i  = chordNote.endChar;
								} else if (line[i] === ' ') {
									// Spaces are not allowed in chords, but we can recover from it by ignoring it.
									warn("Spaces are not allowed in chords", line, i);
									i++;
								} else {
									if (i < line.length && line[i] === ']') {
										// consume the close bracket
										i++;

										if (multilineVars.next_note_duration !== 0) {
											el.pitches.each(function(p) {
												p.duration = p.duration * multilineVars.next_note_duration;
											});
											multilineVars.next_note_duration = 0;
										}

										if (inTie) {
											el.endTie = true;
											inTie = false;
										}

										if (tripletNotesLeft > 0) {
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
													if (el.startTie === true)	// can only have one of these
														postChordDone = true;
													else {
														el.startTie = true;
														inTie = true;
													}
													break;
												case '>':
												case '<':
													var br2 = getBrokenRhythm(line, i);
													i += br2[0] - 1;	// index gets incremented below, so we'll let that happen
													multilineVars.next_note_duration = br2[2];
													chordDuration = br2[1];
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
											el.pitches.each(function(p) {
												p.duration = p.duration * chordDuration;
											});
										}
										tune.appendElement('note', startOfLine+i, startOfLine+i, el);
										el = {};
									}
									done = true;
								}
							}
							
						} else {
							// Single pitch
							var core = getCoreNote(line, i, el, true);
							if (core !== null) {
								el = core;
								if (inTie) {
									el.endTie = true;
									inTie = false;
								}
								if (el.startTie)
									inTie = true;
								i  = el.endChar;

								if (tripletNotesLeft > 0) {
									tripletNotesLeft--;
									if (tripletNotesLeft === 0) {
										el.endTriplet = true;
									}
								}

								if (ret.end_beam)
									addEndBeam(el);

								tune.appendElement('note', startOfLine+i, startOfLine+1, el);
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
		};

		function setTempo(line, start, end) {
			//Q - tempo; can be used to specify the notes per minute, e.g.   if
			//the  default  note length is an eighth note then Q:120 or Q:C=120
			//is 120 eighth notes per minute. Similarly  Q:C3=40  would  be  40
			//dotted  quarter  notes per minute.  An absolute tempo may also be
			//set,  e.g.  Q:1/8=120  is  also  120  eighth  notes  per  minute,
			//irrespective of the default note length.
			//
			// This is either a number, "C=number", "Cnumber=number", or fraction [fraction...]=number
			// It depends on the L: field, which may either not be present, or may appear after this.
			// If L: is not present, an eighth note is used.
			// That means that this field can't be calculated until the end, if it is the first three types, since we don't know if we'll see an L: field.
			// So, if it is the fourth type, set it here, otherwise, save the info in the multilineVars.
			// The temporary variables we keep are the duration and the bpm. In the first two forms, the duration is 1.
			// In addition, a quoted string may both precede and follow. If a quoted string is present, then the duration part is optional.
			try {
				var tokens = tokenizer.tokenize(line, start, end);

				if (tokens.length === 0) throw "Missing parameter in Q: field";

				multilineVars.tempo = {};
				var delaySet = true;
				var token = tokens.shift();
				if (token.type === 'quote') {
					multilineVars.tempo.preString = token.token;
					token = tokens.shift();
					if (tokens.length === 0) {	// It's ok to just get a string for the tempo
						tune.metaText.tempo = multilineVars.tempo;
						delete multilineVars.tempo;
						return;
					}
				}
				if (token.type === 'alpha' && token.token === 'C')	 { // either type 2 or type 3
					if (tokens.length === 0) throw "Missing tempo after C in Q: field";
					token = tokens.shift();
					if (token.type === 'punct' && token.token === '=') {
						// This is a type 2 format. The duration is an implied 1
						if (tokens.length === 0) throw "Missing tempo after = in Q: field";
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected number after = in Q: field";
						multilineVars.tempo.duration = [1];
						multilineVars.tempo.bpm = parseInt(token.token);
					} else if (token.type === 'number') {
						// This is a type 3 format.
						multilineVars.tempo.duration = [parseInt(token.token)];
						if (tokens.length === 0) throw "Missing = after duration in Q: field";
						token = tokens.shift();
						if (token.type !== 'punct' || token.token !== '=') throw "Expected = after duration in Q: field";
						if (tokens.length === 0) throw "Missing tempo after = in Q: field";
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected number after = in Q: field";
						multilineVars.tempo.bpm = parseInt(token.token);
					} else throw "Expected number or equal after C in Q: field";

				} else if (token.type === 'number') {	// either type 1 or type 4
					var num = parseInt(token.token);
					if (tokens.length === 0 || tokens[0].type === 'quote') {
						// This is type 1
						multilineVars.tempo.duration = [1];
						multilineVars.tempo.bpm = num;
					} else {	// This is type 4
						delaySet = false;
						token = tokens.shift();
						if (token.type !== 'punct' && token.token !== '/') throw "Expected fraction in Q: field";
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected fraction in Q: field";
						var den = parseInt(token.token);
						multilineVars.tempo.duration = [num/den];
						// We got the first fraction, keep getting more as long as we find them.
						while (tokens.length > 0  && tokens[0].token !== '=' && tokens[0].type !== 'quote') {
							token = tokens.shift();
							if (token.type !== 'number') throw "Expected fraction in Q: field";
							num = parseInt(token.token);
							token = tokens.shift();
							if (token.type !== 'punct' && token.token !== '/') throw "Expected fraction in Q: field";
							token = tokens.shift();
							if (token.type !== 'number') throw "Expected fraction in Q: field";
							den = parseInt(token.token);
							multilineVars.tempo.duration.push(num/den);
						}
						token = tokens.shift();
						if (token.type !== 'punct' && token.token !== '=') throw "Expected = in Q: field";
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected tempo in Q: field";
						multilineVars.tempo.bpm = parseInt(token.token);
					}
				} else throw "Unknown value in Q: field";
				if (tokens.length !== 0) {
					token = tokens.shift();
					if (token.type === 'quote') {
						multilineVars.tempo.postString = token.token;
						token = tokens.shift();
					}
					if (tokens.length !== 0) throw "Unexpected string at end of Q: field";
				}
				if (!delaySet) {
					tune.metaText.tempo = multilineVars.tempo;
					delete multilineVars.tempo;
				}
			} catch (msg) {
				warn(msg, line, start);
			}
		}

		var metaTextHeaders = {
			A: 'author',
			B: 'book',
			C: 'composer',
			D: 'discography',
			F: 'url',
			I: 'instruction',
			N: 'notes',
			O: 'origin',
			R: 'rhythm',
			S: 'source',
			W: 'unalignedWords',
			Z: 'transcription'
		};

		var parseLine = function(line) {
			if (line.startsWith('%%')) {
				var err = addDirective(line.substring(2));
				if (err) warn(err, line, 2);
				return;
			}
			line = tokenizer.stripComment(line);
			if (line.length === 0)
				return;

			if (line.length >= 2) {
				if (line[1] === ':') {
					var field = metaTextHeaders[line[0]];
					if (field !== undefined) {
						tune.addMetaText(field, tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
						return;
					} else {
						switch(line[0])
						{
							case  'H':
								tune.addMetaText("history", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
								multilineVars.is_in_history = true;
								break;
							case  'K':
								// since the key is the last thing that can happen in the header, we can resolve the tempo now
								resolveTempo();
								var result = parseKey(line.substring(2));
								if (!multilineVars.is_in_header && tune.hasBeginMusic()) {
									if (result.foundClef)
										tune.appendStartingElement('clef', -1, -1, {type: multilineVars.clef});
									if (result.foundKey)
										tune.appendStartingElement('key', -1, -1, multilineVars.key);
								}
								multilineVars.is_in_header = false;	// The first key signifies the end of the header.
								break;
							case  'L':
								var len = line.substring(2).gsub(" ", "");
								var len_arr = len.split('/');
								if (len_arr.length === 2) {
									var n = parseInt(len_arr[0]);
									var d = parseInt(len_arr[1]);
									if (d > 0) {
										var q = n / d;
										multilineVars.default_length = q*8;	// an eighth note is 1
										multilineVars.havent_set_length = false;
									}
								}
								break;
							case  'M':
								setMeter(line.substring(2));
								break;
							case  'P':
								// TODO-PER: There is more to do with parts, but the writer doesn't care.
								if (multilineVars.is_in_header)
									tune.addMetaText("partOrder", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
								else
									multilineVars.partForNextLine = tokenizer.translateString(tokenizer.stripComment(line.substring(2)));
								break;
							case  'Q':
								setTempo(line, 2, line.length);
								break;
							case  'T':
								setTitle(line.substring(2));
								break;
							case  'V':
								parseVoice(line, 2, line.length);
								if (!multilineVars.is_in_header)
									startNewLine();
								break;
							case  'w':
								addWords(tune.getCurrentVoice(), line.substring(2));
								break;
							case 'X':
							case 'E':
								break;
							default:
								// It wasn't a recognized header value, so parse it as music.
								parseRegularMusicLine(line);
						}
					}
					return;
				}
			}

			// If we got this far, we have a regular line of mulsic
			parseRegularMusicLine(line);
		};
		
		this.parse = function(strTune) {
			tune.reset();
			multilineVars.reset();
			// Take care of whatever line endings come our way
			strTune = strTune.gsub('\x12\n', '\n');
			strTune = strTune.gsub('\x12', '\n');
			strTune = strTune.replace(/\\([ \t]*)\n/g, "$1 \x12");	// take care of line continuations right away, but keep the same number of characters
			var lines = strTune.split('\n');
			lines.each( function(line) {
				if (multilineVars.is_in_history) {
					if (line[1] === ':') {
						multilineVars.is_in_history = false;
						parseLine(line);
					} else
						tune.addMetaText("history", tokenizer.translateString(tokenizer.stripComment(line)));
				} else
					parseLine(line);
				multilineVars.iChar += line.length + 1;
			});
			tune.cleanUp();
		};
	}
});

