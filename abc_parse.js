/**
 * @author paulrosen
 */

/*global Class */
/*extern AbcTune, ParseAbc */

// This is the data for a single ABC tune. It is created and populated by the ParseAbc class.
var AbcTune = Class.create({
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
	//		lyric: { syllable: xxx, divider: one of " -_" }
	// TODO: actually, decoration should be an array.
	//		decoration: upbow, downbow, accent
	// BAR: type=bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat
	//	number: 1 or 2: if it is the start of a first or second ending
	// CLEF: type=treble,bass
	// KEY-SIG:
	//		regularKey: { num:0-7 dir:sharp,flat }
	//		extraAccidentals[]: { acc:sharp|dblsharp|natural|flat|dblflat,  note:a|b|c|d|e|f|g }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }
	reset: function () {
		this.metaText = {};
		this.formatting = {};
		this.lines = [];
	},

	initialize: function () {
		this.reset();
	},

	appendElement: function(type, startChar, endChar, hashParams)
	{
		hashParams.el_type = type;
		hashParams.startChar = startChar;
		hashParams.endChar = endChar;
		this.lines[this.lines.length-1].staff.push(hashParams);
	}
});

// this is a series of functions that get a particular element out of the passed stream.
// the return is the number of characters consumed, so 0 means that the element wasn't found.
// also returned is the element found. This may be a different length because spaces may be consumed that aren't part of the string.
// The return structure for most calls is { len: num_chars_consumed, token: str }
var AbcTokenizer = Class.create({
	initialize: function () {
		var skipWhiteSpace = function(str) {
			for (var i = 0; i < str.length; i++) {
				if (str[i] !== ' ' && str[i] !== '\t')
					return i;
			}
			return str.length;	// It must have been all white space
		};
		var finished = function(str, i) {
			return i >= str.length;
		};

		// This just gets the basic pitch letter, ignoring leading spaces, and normalizing it to a capital
		this.getKeyPitch = function(str) {
			var i = skipWhiteSpace(str);
			if (finished(str, i))
				return { len: 0 };
			switch (str[i]) {
				case 'A': return { len: i+1, token: 'A' };
				case 'B': return { len: i+1, token: 'B' };
				case 'C': return { len: i+1, token: 'C' };
				case 'D': return { len: i+1, token: 'D' };
				case 'E': return { len: i+1, token: 'E' };
				case 'F': return { len: i+1, token: 'F' };
				case 'G': return { len: i+1, token: 'G' };
				case 'a': return { len: i+1, token: 'A' };
				case 'b': return { len: i+1, token: 'B' };
				case 'c': return { len: i+1, token: 'C' };
				case 'd': return { len: i+1, token: 'D' };
				case 'e': return { len: i+1, token: 'E' };
				case 'f': return { len: i+1, token: 'F' };
				case 'g': return { len: i+1, token: 'G' };
			}
			return { len: 0 };
		};

		// This just gets the basic accidental, ignoring leading spaces, and only the ones that appear in a key
		this.getSharpFlat = function(str) {
			switch (str[0]) {
				case '#': return { len: 1, token: '#' };
				case 'b': return { len: 1, token: 'b' };
			}
			return { len: 0 };
		};

		this.getMode = function(str) {
			var skipAlpha = function(str, start) {
				// This returns the index of the next non-alphabetic char, or the entire length of the string if not found.
				while (start < str.length && ((str[start] >= 'a' && str[start] <= 'z') || (str[start] >= 'A' && str[start] <= 'Z')))
					start++;
				return start;
			};

			var i = skipWhiteSpace(str);
			if (finished(str, i))
				return { len: 0 };
			var firstThree = str.substring(i,i+3).toLowerCase();
			if (firstThree.length > 1 && firstThree[1] === ' ') firstThree = firstThree[0];	// This will handle the case of 'm'
			switch (firstThree) {
				case 'mix': return { len: skipAlpha(str, i), token: 'Mix' };
				case 'dor': return { len: skipAlpha(str, i), token: 'Dor' };
				case 'phr': return { len: skipAlpha(str, i), token: 'Phr' };
				case 'lyd': return { len: skipAlpha(str, i), token: 'Lyd' };
				case 'loc': return { len: skipAlpha(str, i), token: 'Loc' };
				case 'aeo': return { len: skipAlpha(str, i), token: 'm' };
				case 'maj': return { len: skipAlpha(str, i), token: '' };
				case 'ion': return { len: skipAlpha(str, i), token: '' };
				case 'min': return { len: skipAlpha(str, i), token: 'm' };
				case 'm': return { len: skipAlpha(str, i), token: 'm' };
			}
			return { len: 0 };
		};

		this.getClef = function(str) {
			var strOrig = str;
			var i = skipWhiteSpace(str);
			if (finished(str, i))
				return { len: 0 };
			// The word 'clef' is optional, but if it appears, a clef MUST appear
			var needsClef = false;
			var strClef = str.substring(i);
			if (strClef.startsWith('clef=')) {
				needsClef = true;
				strClef = strClef.substring(5);
				i += 5;
			}
			if (strClef.length === 0 && needsClef)
				return { len: i+5, warn: "No clef specified: " + strOrig };

			var j = skipWhiteSpace(strClef);
			if (finished(strClef, j))
				return { len: 0 };
			if (j > 0) {
				i += j;
				strClef = strClef.substring(j);
			}
			var name = null;
			if (strClef.startsWith('treble'))
				name = 'treble';
			else if (strClef.startsWith('bass3'))
				name = 'bass3';
			else if (strClef.startsWith('bass'))
				name = 'bass';
			else if (strClef.startsWith('tenor'))
				name = 'tenor';
			else if (strClef.startsWith('alto2'))
				name = 'alto2';
			else if (strClef.startsWith('alto1'))
				name = 'alto1';
			else if (strClef.startsWith('alto'))
				name = 'alto';
			else if (strClef.startsWith('none'))
				name = 'none';
			else
				return { len: i+5, warn: "Unknown clef specified: " + strOrig };

			strClef = strClef.substring(name.length);
			j = this.isMatch(strClef, '+8');
			if (j > 0)
				name += "+8";
			j = this.isMatch(strClef, '-8');
			if (j > 0)
				name += "-8";

			return { len: i+name.length, token: name };
		};

		// This just sees if the next token is the word passed in, with possible leading spaces
		this.isMatch = function(str, match) {
			var i = skipWhiteSpace(str);
			if (finished(str, i))
				return 0;
			if (str.substring(i).startsWith(match))
				return match.length;
			return 0;
		};

		// This gets an accidental marking for the key signature. It has the accidental then the pitch letter.
		this.getKeyAccidental = function(str) {
			var accTranslation = {
				'^': 'sharp',
				'^^': 'dblsharp',
				'=': 'natural',
				'_': 'flat',
				'__': 'dblflat'
			};
			var i = skipWhiteSpace(str);
			if (finished(str, i))
				return { len: 0 };
			var acc = null;
			switch (str[i])
			{
				case '^':
				case '_':
				case '=':
					acc = str[i];
					break;
				default: return { len: 0 };
			}
			i++;
			if (finished(str, i))
				return { len: 1, warn: 'Expected note name after accidental' };
			switch (str[i])
			{
				case 'a':
				case 'b':
				case 'c':
				case 'd':
				case 'e':
				case 'f':
				case 'g':
				case 'A':
				case 'B':
				case 'C':
				case 'D':
				case 'E':
				case 'F':
				case 'G':
					return { len: i+1, token: { acc: accTranslation[acc], note: str[i]} };
				case '^':
				case '_':
					acc += str[i];
					i++;
					if (finished(str, i))
						return { len: 2, warn: 'Expected note name after accidental' };
					switch (str[i])
					{
						case 'a':
						case 'b':
						case 'c':
						case 'd':
						case 'e':
						case 'f':
						case 'g':
						case 'A':
						case 'B':
						case 'C':
						case 'D':
						case 'E':
						case 'F':
						case 'G':
							return { len: i+1, token: { acc: accTranslation[acc], note: str[i]} };
						default:
							return { len: 2, warn: 'Expected note name after accidental' };
					}
				default:
					return { len: 1, warn: 'Expected note name after accidental' };
			}
		}
	}
});

var ParseAbc = Class.create({
	initialize: function () {
		var tune = new AbcTune();
		var tokenizer = new AbcTokenizer();

		this.getTune = function() {
			return tune;
		};

		var multilineVars = {
			reset: function() {
				this.iChar = 0;
				this.key = { num: 0 };
				this.meter = { type: 'specified', num: '4', den: '4'};	// if no meter is specified, there is an implied one.
				this.hasMainTitle = false;
				this.default_length = 1;
				this.clef = 'treble';
				this.warnings = null;
			}
		};

		var addWarning = function(str) {
			if (!multilineVars.warnings)
				multilineVars.warnings = [];
			multilineVars.warnings.push(str);
		};
		this.getWarnings = function() {
			return multilineVars.warnings;
		};

		var keys = {
			'C#': { num: 7, acc: 'sharps' },
			'A#m': { num: 7, acc: 'sharps' },
			'G#Mix': { num: 7, acc: 'sharps' },
			'D#Dor': { num: 7, acc: 'sharps' },
			'E#Phr': { num: 7, acc: 'sharps' },
			'F#Lyd': { num: 7, acc: 'sharps' },
			'B#Loc': { num: 7, acc: 'sharps' },

			'F#': { num: 6, acc: 'sharp' },
			'D#m': { num: 6, acc: 'sharp' },
			'C#Mix': { num: 6, acc: 'sharp' },
			'G#Dor': { num: 6, acc: 'sharp' },
			'A#Phr': { num: 6, acc: 'sharp' },
			'BLyd': { num: 6, acc: 'sharp' },
			'E#Loc': { num: 6, acc: 'sharp' },

			'B': { num: 5, acc: 'sharp' },
			'G#m': { num: 5, acc: 'sharp' },
			'F#Mix': { num: 5, acc: 'sharp' },
			'C#Dor': { num: 5, acc: 'sharp' },
			'D#Phr': { num: 5, acc: 'sharp' },
			'ELyd': { num: 5, acc: 'sharp' },
			'A#Loc': { num: 5, acc: 'sharp' },

			'E': { num: 4, acc: 'sharp' },
			'C#m': { num: 4, acc: 'sharp' },
			'BMix': { num: 4, acc: 'sharp' },
			'F#Dor': { num: 4, acc: 'sharp' },
			'G#Phr': { num: 4, acc: 'sharp' },
			'ALyd': { num: 4, acc: 'sharp' },
			'D#Loc': { num: 4, acc: 'sharp' },

			'A': { num: 3, acc: 'sharp' },
			'F#m': { num: 3, acc: 'sharp' },
			'EMix': { num: 3, acc: 'sharp' },
			'BDor': { num: 3, acc: 'sharp' },
			'C#Phr': { num: 3, acc: 'sharp' },
			'DLyd': { num: 3, acc: 'sharp' },
			'G#Loc': { num: 3, acc: 'sharp' },

			'D': { num: 2, acc: 'sharp' },
			'Bm': { num: 2, acc: 'sharp' },
			'AMix': { num: 2, acc: 'sharp' },
			'EDor': { num: 2, acc: 'sharp' },
			'F#Phr': { num: 2, acc: 'sharp' },
			'GLyd': { num: 2, acc: 'sharp' },
			'C#Loc': { num: 2, acc: 'sharp' },

			'G': { num: 1, acc: 'sharp' },
			'Em': { num: 1, acc: 'sharp' },
			'DMix': { num: 1, acc: 'sharp' },
			'ADor': { num: 1, acc: 'sharp' },
			'BPhr': { num: 1, acc: 'sharp' },
			'CLyd': { num: 1, acc: 'sharp' },
			'F#Loc': { num: 1, acc: 'sharp' },

			'C': { num: 0, acc: 'sharp' },
			'Am': { num: 0, acc: 'sharp' },
			'GMix': { num: 0, acc: 'sharp' },
			'DDor': { num: 0, acc: 'sharp' },
			'EPhr': { num: 0, acc: 'sharp' },
			'FLyd': { num: 0, acc: 'sharp' },
			'BLoc': { num: 0, acc: 'sharp' },

			'F': { num: 1, acc: 'flat' },
			'Dm': { num: 1, acc: 'flat' },
			'CMix': { num: 1, acc: 'flat' },
			'GDor': { num: 1, acc: 'flat' },
			'APhr': { num: 1, acc: 'flat' },
			'BbLyd': { num: 1, acc: 'flat' },
			'ELoc': { num: 1, acc: 'flat' },

			'Bb': { num: 2, acc: 'flat' },
			'Gm': { num: 2, acc: 'flat' },
			'FMix': { num: 2, acc: 'flat' },
			'CDor': { num: 2, acc: 'flat' },
			'DPhr': { num: 2, acc: 'flat' },
			'EbLyd': { num: 2, acc: 'flat' },
			'ALoc': { num: 2, acc: 'flat' },

			'Eb': { num: 3, acc: 'flat' },
			'Cm': { num: 3, acc: 'flat' },
			'BbMix': { num: 3, acc: 'flat' },
			'FDor': { num: 3, acc: 'flat' },
			'GPhr': { num: 3, acc: 'flat' },
			'AbLyd': { num: 3, acc: 'flat' },
			'DLoc': { num: 3, acc: 'flat' },

			'Ab': { num: 4, acc: 'flat' },
			'Fm': { num: 4, acc: 'flat' },
			'EbMix': { num: 4, acc: 'flat' },
			'BbDor': { num: 4, acc: 'flat' },
			'CPhr': { num: 4, acc: 'flat' },
			'DbLyd': { num: 4, acc: 'flat' },
			'GLoc': { num: 4, acc: 'flat' },

			'Db': { num: 5, acc: 'flat' },
			'Bbm': { num: 5, acc: 'flat' },
			'AbMix': { num: 5, acc: 'flat' },
			'EbDor': { num: 5, acc: 'flat' },
			'FPhr': { num: 5, acc: 'flat' },
			'GgLyd': { num: 5, acc: 'flat' },
			'CLoc': { num: 5, acc: 'flat' },

			'Gb': { num: 6, acc: 'flat' },
			'Ebm': { num: 6, acc: 'flat' },
			'DbMix': { num: 6, acc: 'flat' },
			'AbDor': { num: 6, acc: 'flat' },
			'BbPhr': { num: 6, acc: 'flat' },
			'CbLyd': { num: 6, acc: 'flat' },
			'FLoc': { num: 6, acc: 'flat' },

			'Cb': { num: 7, acc: 'flat' },
			'Abm': { num: 7, acc: 'flat' },
			'GbMix': { num: 7, acc: 'flat' },
			'DbDor': { num: 7, acc: 'flat' },
			'EbPhr': { num: 7, acc: 'flat' },
			'FbLyd': { num: 7, acc: 'flat' },
			'BbLoc': { num: 7, acc: 'flat' },

			// The following are not in the 2.0 spec, but seem normal enough.
			// TODO-PER: These SOUND the same as what's written, but they aren't right
			'A#': { num: 2, acc: 'flat' },
			'B#': { num: 0, acc: 'sharp' },
			'D#': { num: 3, acc: 'flat' },
			'E#': { num: 1, acc: 'flat' },
			'G#': { num: 4, acc: 'flat' }
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
			} else {
				var retNone = tokenizer.isMatch(str, 'none');
				if (retNone > 0) {
					// we got the none key - that's the same as C to us
					ret.regularKey = keys['C'];
					str = str.substring(retNone.len);
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
			var retClef = tokenizer.getClef(str);
			if (retClef.len > 0) {
				if (retClef.warn)
					addWarning("error parsing clef:" + origStr);
				else
				ret.clef = retClef.token;
			}

			if (ret.regularKey === undefined && ret.extraAccidentals === undefined) {
				addWarning("error parsing key: " + origStr);
				ret.regularKey = keys['C'];
			}
			return ret;
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
				return [pos-i+1,substInChord(line.substring(i+1, pos))];
			else	// we hit the end of line, so we'll just pick an arbitrary num of chars so the line doesn't disappear.
			{
				pos = i+maxErrorChars;
				if (pos > line.length-1)
					pos = line.length-1;
				return [pos-i+1, substInChord(line.substring(i+1, pos))];
			}
		};

		var letter_to_chord = function(line, i)
		{
			if (line[i] === '"')
			{
				var chord = getBrackettedSubstring(line, i, 5);
				// If it starts with ^, then the chord appears above.
				// If it starts with _ then the chord appears below.
				// (note that the 2.0 draft standard defines them as not chords, but annotations and also defines < > and @.)
				if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '^') {
					chord[1] = chord[1].substring(1);
					chord.push('above');
				} else if (chord[0] > 0 && chord[1].length > 0 && chord[1][0] === '_') {
					chord[1] = chord[1].substring(1);
					chord.push('below');
				} else
					chord.push('default');
				return chord;
			}
			return [0, ""];
		};

		var letter_to_accent = function(line, i)
		{
			switch (line[i])
			{
				case '.': return [1, 'staccato'];
				case 'u': return [1, 'upbow'];
				case 'v': return [1, 'downbow'];
				case '~': return [1, 'roll'];
				case '!':
					var ret = getBrackettedSubstring(line, i, 5);
					// Be sure that the accent is recognizable.
					var legalAccents = [ "trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
						"emphasis", "fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
						"open", "thumb", "snap", "turn", "roll", "breath", "shortphrase", "mediumphrase", "longphrase",
						"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
						"p", "pp", "f", "ff", "mf", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2",
						"upbow", "downbow" ];
					if (ret[1].length > 0 && (ret[1][0] === '^' || ret[1][0] ==='_'))
						ret[1] = ret[1].substring(1);	// TODO-PER: The test files have indicators forcing the orniment to the top or bottom, but that isn't in the standard. We'll just ignore them.
					if (legalAccents.detect(function(acc) {
						return (ret[1] === acc);
					}))
						return ret;
					// We didn't find the accent in the list, so consume the space, but don't return an accent.
					ret[1] = "";
					return ret;
				case 'H': return [1, 'fermata'];
				case 'M': return [1, 'mordent'];
			}
			return [0, 0];
		};

		var letter_to_accidental = function(line, i)
		{
			switch (line[i])
			{
				case '^': return [1, 'sharp'];
				case '=': return [1, 'natural'];
				case '_': return [1, 'flat'];
			}
			return [0, 0];
		};

		// The legal durations for L:1/8 are:
		// <nothing>=eighth
		// 2= quarter
		// 3= dotted quarter
		// 4=half
		// 6=dotted half
		// 8=whole
		// /2=sixteenth
		// 3/2=dotted eigthth
		// > =dotted eighth; next note is sixteenth
		// < =sixteenth; next note is dotted eighth
		// 2> =dotted quarter; next note is eighth
		// 2< =eighth; next note is dotted quarter

		var next_note_duration = 0;
		var letter_to_duration2 = function(line, i)
		{
			switch (line[i])
			{
				case '>':
					if (i < line.length - 1 && line[i+1] === '>')	// double >>
						return [2, 1.75, .25];
					else
						return [1, 1.5, 0.5];
				case '<':
					if (i < line.length - 1 && line[i+1] === '<')	// double <<
						return [2, .25, 1.75];
					else
						return [1, 0.5, 1.5];
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					if (line[i] === '2' && (i < line.length-1) && (line[i+1] === '>'))
						return [2, 3, 1];
					else if (line[i] === '2' && (i < line.length-1) && (line[i+1] === '<'))
						return [2, 1, 3];
					else {
						// we are looking for: 999/999 where 999 is 0 to an arbitrary number of digits and the slash and second number are optional
						var start = i;
						var num = parseInt(line[i]);
						var den = 1;	// if it isn't set below, then it is 1 so that it doesn't change the division
						i++;
						while (i < line.length && line[i] >= '0' && line[i] <= '9') {
							num =  num*10 + parseInt(line[i]);
							i++;
						}
						// num now has the first number. Look for a slash.
						if (i < line.length && line[i] === '/') {
							i++;
							// now look for the denominator.
							var d = 0;
							while (i < line.length && line[i] >= '0' && line[i] <= '9') {
								d = d * 10 + parseInt(line[i]);
								i++;
							}
							if (d === 0)	// If there is no denominator  "c3/" then that is the same as 2 "c3/2"
								d = 2;
							den = d;
						}
						return [ i -  start, num / den ];
					}				
					break;
				case '/':
					// assume the numerator is 1; if the next character is not a number, then assume it is a 2
					var start2 = i;
					i++;
					var dd = 0;
					if (i < line.length && line[i] === '/')	{ // this is the construction where there are multiple slashes: c// for instance.
						var numSlashes = 1;
						var divisor = 2;
						while (i < line.length && line[i] === '/') {
							numSlashes++;
							divisor = divisor * 2;
							i++;
						}
						return [ numSlashes, 1 / divisor ];
					}
					while (i < line.length && line[i] >= '0' && line[i] <= '9') {
						dd = dd * 10 + parseInt(line[i]);
						i++;
					}
					if (dd === 0)
						return [1, .5];
					else
						return [ i - start2, 1 / dd];
					break;
			}
			return [0, 0];
		};

		var letter_to_duration = function(line, i)
		{
			if (next_note_duration !== 0)
			{
				var ret = [0, next_note_duration];
				next_note_duration = 0;
				return ret;
			}

			var ret2 = letter_to_duration2(line, i);
			if (ret2.length > 2)
				next_note_duration = ret2[2];
			return ret2;
		};

		var letter_to_spacer = function(line, i)
		{
			if (line[i] === ' ' || line[i] === '\t')
				return [1, 'spacer'];
			else
				return [0, 0];
		};

		// returns the class of the bar line
		// the number of the repeat
		// and the number of characters used up
		// if 0 is returned, then the next element was not a bar line
		var letter_to_bar = function(line, curr_pos)
		{
		  str1 = line.substring(curr_pos, curr_pos+1);
		  str2 = line.substring(curr_pos, curr_pos+2);
		  str3 = line.substring(curr_pos, curr_pos+3);
		  str4 = line.substring(curr_pos, curr_pos+4);

		  if (str4 === ":||:") return [ 4, "bar_dbl_repeat"];
		  else if (str3 === ":|2") return [ 3, "bar_right_repeat", 2];
		  else if (str3 === "[|:") return [ 3, "bar_left_repeat"];
		  else if (str3 === "||:") return [ 3, "bar_left_repeat"];
		  else if (str2 === ":|") return [ 2, "bar_right_repeat"];
		  else if (str2 === "|:") return [ 2, "bar_left_repeat"];
		  else if (str2 === "||") return [ 2, "bar_thin_thin"];
		  else if (str2 === "::") return [ 2, "bar_dbl_repeat"];
		  else if (str2 === "[2" || str2 === "|2") return [ 2, "bar_thin", 2]; // should it guess a repeat?
		  else if (str2 === "[1" || str2 === "|1") return [ 2, "bar_thin", 1];
		  else if (str2 === "|]") return [ 2, "bar_thin_thick"];
		  else if (str2 === "[|") return [ 2, "bar_thick_thin"]; 
		  else if (str1 === "|") return [1, "bar_thin"];
		  else return [0,""];
		};

		// returns the pitch (null for a rest) and the number of chars used up
		var letter_to_pitch = function(line, curr_pos)
		{
			var ret = [ 0, -1 ];
			switch (line[curr_pos])
			{
				case 'A' : ret = [ 1, 5 ]; break;
				case 'B' : ret = [ 1, 6 ]; break;
				case 'C' : ret = [ 1, 0 ]; break;
				case 'D' : ret = [ 1, 1 ]; break;
				case 'E' : ret = [ 1, 2 ]; break;
				case 'F' : ret = [ 1, 3 ]; break;
				case 'G' : ret = [ 1, 4 ]; break;
				case 'a' : ret = [ 1, 12 ]; break;
				case 'b' : ret = [ 1, 13 ]; break;
				case 'c' : ret = [ 1, 7 ]; break;
				case 'd' : ret = [ 1, 8 ]; break;
				case 'e' : ret = [ 1, 9 ]; break;
				case 'f' : ret = [ 1, 10 ]; break;
				case 'g' : ret = [ 1, 11 ]; break;
				case 'x' : ret = [ 1, null, 'spacer' ]; break; // will take up physical space
				case 'y' : ret = [ 1, null, 'invisible' ]; break; // used for timing integrity
				case 'z' : ret = [ 1, null, 'rest' ]; break;
			}
			if ((ret[0] !== 0) && (curr_pos < line.length-1))
			{
				if (line[curr_pos+1] === ',')
				{
					ret[0]++;
					ret[1] -= 7;
					if ((curr_pos+1 < line.length-1) && line[curr_pos+2] === ',')	// see if there is a double comma
					{
						ret[0]++;
						ret[1] -= 7;
					}
				}
				else if (line[curr_pos+1] === "'")
				{
					ret[0]++;
					ret[1] += 7;
					if ((curr_pos+1 < line.length-1) && line[curr_pos+2] === '\'')	// see if there is a double prime
					{
						ret[0]++;
						ret[1] += 7;
					}
				}
			}
			return ret;
		};

		var addDirective = function(str) {
			var s = stripComment(str);
			var i = s.indexOf(' ');
			var cmd = (i > 0) ? s.substring(0, i) : s;
			var num;
			switch (cmd)
			{
				case "stretchlast": tune.formatting.stretchlast = true; break;
				case "staffwidth":
					num = getInt(s.substring(i));
					if (num.digits === 0)
						return; // TODO-PER: flag an error
					tune.formatting.staffwidth = num.value;
					break;
				case "scale":
					num = getFloat(s.substring(i));
					if (num.digits === 0)
						return; // TODO-PER: flag an error
					tune.formatting.scale = num.value;
					break;
			}
		};

		var setTitle = function(title) {
			if (multilineVars.hasMainTitle)
				tune.lines[tune.lines.length] = { subtitle: stripComment(title) };	// display secondary title
			else
			{
				addMetaText("title", title);
				multilineVars.hasMainTitle = true;
			}
		};
		
		var setMeter = function(meter) {
			meter = stripComment(meter);
			if (meter === 'C')
				multilineVars.meter = { type: 'common_time' };
			else if (meter === 'C|')
				multilineVars.meter = { type: 'cut_time' };
			else if (meter.toLowerCase() === 'none')
				multilineVars.meter = null;
			else
			{
				var a = meter.split('/');
				if (a.length === 2)
					multilineVars.meter = { type: 'specified', num: a[0].strip(), den: a[1].strip()};
			}
		};

		var addWords = function(line, words) {
			words = words.strip();
			if (words[words.length-1] != '-')
				words = words + ' ';	// Just makes it easier to parse below, since every word has a divider after it.
			var word_list = [];
			// first make a list of words from the string we are passed. A word is divided on either a space or dash.
			var last_divider = -1;
			for (var i = 0; i < words.length; i++) {
				if ((words[i] === ' ') || (words[i] === '-')) {
					word_list.push({ syllable: words.substring(last_divider+1, i), divider: words[i] });
					last_divider = i;
				}
			}

			line.each(function(el) {
				if (el.el_type === 'note' && word_list.length > 0) {
					el.lyric = word_list.shift();
				}
			});
		};

		//
		// Parse line of music
		//
		var parseRegularMusicLine = function(line) {
			var i = 0;
			// see if there is nothing but a comment on this line. If so, just ignore it. A full line comment is optional white space followed by %
			while ((line[i] === ' ' || line[i] === '\t') && i < line.length)
				i++;
			if (i === line.length || line[i] === '%')
				return;

			// Start with the standard staff, clef and key symbols on each line
			tune.lines.push({ staff: [] });
			tune.appendElement('clef', -1, -1, { type: multilineVars.clef });
			tune.appendElement('key', -1, -1, multilineVars.key);
			if (multilineVars.meter !== null)
			{
				tune.appendElement('meter', -1, -1, multilineVars.meter);
				multilineVars.meter = "";
			}

			while (i < line.length)
			{
				if (line[i] === '%')
					break;

				var ret = letter_to_bar(line, i);
				if (ret[0] > 0) {
					i += ret[0];
					multilineVars.iChar += ret[0];
					var bar = { type: ret[1], number:ret[2] };
					tune.appendElement('bar', multilineVars.iChar, multilineVars.iChar+ret[0], bar);
				} else {
					// Looking for a note. The note syntax looks like this:
					// note :=  [chord] [grace-notes] [accents] [accidental] pitch [duration]
					// TODO: straighten out all the start and end chars
					var el = { };
					ret = letter_to_chord(line, i);
					if (ret[0] > 0) {
						el.chord = { name: ret[1], position: ret[2] };
						i += ret[0];
						multilineVars.iChar += ret[0];
					}
					el.gracenotes = [];
					if (line[i] === '{') {
					  // fetch the gracenotes string and consume that into the array
					  var gra = getBrackettedSubstring(line, i, 1, '}'); // what happens on line ends?
					  // TODO: alert errors when non-matching close 
					  var ii = 0;
					  for (ret = letter_to_pitch(gra[1], ii); ret[0]>0 && ii<gra[1].length;
					       ret = letter_to_pitch(gra[1], ii)) {
					    //todo get other stuff that could be in a grace note
					    ii += ret[0];
					    el.gracenotes.push({el_type:"gracenote",pitch:ret[1]});
					  }
					  i += gra[0];
					  multilineVars.iChar += gra[0];
					}
					var done = false;
					while (!done)
					{
						ret = letter_to_accent(line, i);
						if (ret[0] > 0) {
							if (ret[1].length > 0) {
								if (el.decoration === undefined)
									el.decoration = [];
								el.decoration.push(ret[1]);
							}
							i += ret[0];
							multilineVars.iChar += ret[0];
						}
						else
							done = true;
					}
					ret = letter_to_accidental(line, i);
					if (ret[0] > 0) {
						el.accidental = ret[1];
						i += ret[0];
						multilineVars.iChar += ret[0];
					}
					ret = letter_to_pitch(line, i);
					if (ret[0] > 0) {
						el.pitch = ret[1];
						i += ret[0];
						multilineVars.iChar += ret[0];

						var ret2 = letter_to_duration(line, i);
						el.duration = multilineVars.default_length;
						if (ret2[1] > 0)
						{
							el.duration = ret2[1]*multilineVars.default_length;
							i += ret2[0];
							multilineVars.iChar += ret2[0];
						}
						var ret3 = letter_to_spacer(line, i);
						if (ret3[1] == 'spacer')
							el.end_beam = true;

						if (ret[1]===null) {	// rest
							el.rest_type=ret[2];
						}
							tune.appendElement('note', multilineVars.iChar, multilineVars.iChar, el);

					} else if (el.decoration !== undefined) {	// decorations can also be attached to bars, so see if the next thing is a decoration
						var ret4 = letter_to_bar(line, i);
						if (ret4[0] > 0) {
							i += ret4[0];
							multilineVars.iChar += ret4[0];
							var bar2 = { type: ret4[1], number:ret4[2], decoration: el.decoration };
							tune.appendElement('bar', multilineVars.iChar, multilineVars.iChar+ret4[0], bar2);
						}
					}
					else {	// don't know what this is, so ignore it.
						i++;
						multilineVars.iChar++;
					}
				}
			}
			multilineVars.iChar++;	// for the newline
		};

		var stripComment = function(str) {
			var i = str.indexOf('%');
			if (i >= 0)
				return str.substring(0, i).strip();
			return str.strip();
		};

		var addMetaText = function(key, value) {
			if (tune.metaText[key] === undefined)
				tune.metaText[key] = stripComment(value);
			else
				tune.metaText[key] += "\n" + stripComment(value);
		}

		var getInt = function(str) {
			// This parses the beginning of the string for a number and returns { value: num, digits: num }
			// If digits is 0, then the string didn't point to a number.
			var x = parseInt(str);
			if (x === NaN)
				return { digits: 0 };
			var s = "" + x;
			var i = str.indexOf(s);	// This is to account for leading spaces
			return { value: x, digits: i+s.length };
		};

		var getFloat = function(str) {
			// This parses the beginning of the string for a number and returns { value: num, digits: num }
			// If digits is 0, then the string didn't point to a number.
			var x = parseFloat(str);
			if (x === NaN)
				return { digits: 0 };
			var s = "" + x;
			var i = str.indexOf(s);	// This is to account for leading spaces
			return { value: x, digits: i+s.length };
		};

		var setTempo = function(str) {
			//Q - tempo; can be used to specify the notes per minute, e.g.   if
			//the  default  note length is an eighth note then Q:120 or Q:C=120
			//is 120 eighth notes per minute. Similarly  Q:C3=40  would  be  40
			//dotted  quarter  notes per minute.  An absolute tempo may also be
			//set,  e.g.  Q:1/8=120  is  also  120  eighth  notes  per  minute,
			//irrespective of the default note length.
			//
			// This is either a number, "C=number", "Cnumber=number", or fraction=number
			// It depends on the L: field, which may either not be present, or may appear after this.
			// If L: is not present, an eighth note is used.
			// That means that this field can't be calculated until the end, if it is the first three types, since we don't know if we'll see an L: field.
			// So, if it is the fourth type, set it here, otherwise, save the info in the multilineVars.
			// The temporary variables we keep are the multiplier and the bpm. In the first two forms, the multiplier is 1.
			var commentStart = str.indexOf('%');	// get rid of any comment part
			if (commentStart >= 0)
				str = str.substring(0, commentStart);
			str = str.strip();
			if (str.length === 0)
				return;	// just ignore a blank field.

			if (str[0] === 'C') {	// either type 2 or type 3
				if (str.length >= 3 && str[1] === '=') {
					// This is a type 2 format. The multiplier is an implied 1
					var x = getInt(str.substring(2));
					if (x.digits === 0)
						return;	// TODO-PER: flag as an error.
					multilineVars.tempo = { multiplier: 1, bpm: x.value };
					return;
				} else if (str.length >= 2 && str[1] >= '0' && str[1] <= '9') {
					// This is a type 3 format.
					var mult = getInt(str.substring(1));
					str = str.substring(mult.digits+1);
					if (str.length < 2 || str[0] !== '=')
						return;	// TODO-PER: flag an error
					var speed = getInt(str.substring(1));
					if (speed.digits === 0)
						return;	// TODO-PER: flag as an error.
					multilineVars.tempo = { multiplier: mult.value, bpm: speed.value };
					return;
				}	// TODO-PER: if it isn't one of the above, flag as an error

			} else if (str[0] >= '0' && str[0] <= '9') {	// either type 1 or type 4
				var num = getInt(str);
				if (num.digits === 0)
					return;	// TODO-PER: flag as an error.
				str = str.substring(num.digits);
				if (str.length === 0 || str[0] !== '/') {
					// This is type 1
					multilineVars.tempo = { multiplier: 1, bpm: num.value };
					return;
				}
				str = str.substring(1);
				var num2 = getInt(str);
				if (num2.digits === 0)
					return;	// TODO-PER: flag as an error.

				str = str.substring(num2.digits);
				if (str.length === 0 || str[0] !== '=')
					return;	// TODO-PER: flag as an error.

				var num3 = getInt(str.substring(1));
				if (num3.digits === 0)
					return;	// TODO-PER: flag as an error.
				tune.metaText.tempo = { duration: num.value/num2.value, bpm: num3.value };
			}
			// TODO-PER: if it isn't one of the above, flag as an error
		};

		var parseLine = function(line) {
			var str = "";
			if (line.length >= 2)
				str = line.substring(0, 2);

			switch(str)
			{
				case  'B:':
					addMetaText("book", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'C:':
					addMetaText("author", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'D:':
					addMetaText("discography", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'H:':
					addMetaText("history", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case 'E:':
				case 'I:':
					// Not supported currently.
					multilineVars.iChar += line.length + 1;
					break;
				case  'K:':
					// since the key is the last thing that can happen in the header, we can resolve the tempo now
					if (multilineVars.tempo) {	// If there's a tempo waiting to be resolved
						var dur = multilineVars.default_length ? multilineVars.default_length / 8 : 1/8;
						tune.metaText.tempo = { duration: dur * multilineVars.tempo.multiplier, bpm: multilineVars.tempo.bpm };
						multilineVars.tempo = null;
					}
					var retKey = parseKey(line.substring(2));
					multilineVars.key = retKey;
					if (retKey.clef)
						multilineVars.clef = retKey.clef;
					multilineVars.iChar += line.length + 1;
					break;
				case  'L:':
					var len = line.substring(2).gsub(" ", "");
					var len_arr = len.split('/');
					if (len_arr.length === 2) {
						var n = parseInt(len_arr[0]);
						var d = parseInt(len_arr[1]);
						if (d > 0) {
							var q = n / d;
							multilineVars.default_length = q*8;	// an eighth note is 1
						}
					}
					multilineVars.iChar += line.length + 1;
					break;
				case  'M:':
					setMeter(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'N:':
					addMetaText("notes", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'O:':
					addMetaText("origin", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'P:':
					// TODO: handle parts.
					multilineVars.iChar += line.length + 1;
					break;
				case  'Q:':
					setTempo(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'R:':
					addMetaText("rhythm", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'S:':
					addMetaText("source", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'T:':
					setTitle(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'w:':
					addWords(tune.lines[tune.lines.length-1].staff, line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'W:':
					addMetaText("unalignedWords", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'X:':
					multilineVars.iChar += line.length + 1;
					break;
				case  'Z:':
					addMetaText("transcription", line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  '%%':
					addDirective(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				default:
					if (line.length > 0)
						parseRegularMusicLine(line);
			}
		};
		
		var parseTune = function(strTune) {
			strTune = strTune.replace(/\\\n/g, "  ");	// take care of line continuations right away, but keep the same number of characters
			strTune = strTune.replace(/\\ \n/g, "   ");	// take care of line continuations right away, but keep the same number of characters
			var lines = strTune.split('\n');
			lines.each( function(line)
			{
				parseLine(line);
			});
		};
		
		this.parse = function(strTune) {
			tune.reset();
			multilineVars.reset();
			parseTune(strTune);
		}
	}
});

