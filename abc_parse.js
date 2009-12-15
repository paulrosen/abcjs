/**
 * @author paulrosen
 */

/*global Class */
/*extern AbcTune, ParseAbc */

// This is the data for a single ABC tune. It is created and populated by the ParseAbc class.
var AbcTune = Class.create({
	// lines is an array of elements, or one of the following:
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
	//		chord: string
	//		end_beam = true or undefined if this is the last note in a beam.
	//		lyric: { syllable: xxx, divider: one of " -_" }
	// TODO: actually, decoration should be an array.
	//		decoration: upbow, downbow, accent
	// BAR: type=bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat
	//	
	// CLEF: type=treble,bass
	// KEY-SIG: num:0-7 dir:sharp,flat
	//		extra[]: { pitch: as above, type: sharp,flat,natural }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }
	reset: function () {
		this.title = "";
		this.author = "";
		this.extraText = "";
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

var ParseAbc = Class.create({
	initialize: function () {
		var tune = new AbcTune();

		this.getTune = function() {
			return tune;
		};

		///////////////// private functions ////////////////////
		var parseKey = function(str)
		{
			// First get the key letter: turn that into a index into the key array (0-11)
			// Then see if there is a sharp or flat. Increment or decrement.
			// Then see if there is a mode modifier. Add or subtract to the index.
			// Then do a mod 12 on the index and return the key.
			var keys = [
				{ num: 3, acc: 'sharp' },	// A
				{ num: 2, acc: 'flat' },		// Bb
				{ num: 5, acc: 'sharp' },	// B
				{ num: 0 },	// C
				{ num: 5, acc: 'flat' },	// Db
				{ num: 2, acc: 'sharp' },	// D
				{ num: 3, acc: 'flat' },	// Eb
				{ num: 4, acc: 'sharp' },	// E
				{ num: 1, acc: 'flat' },	// F
				{ num: 6, acc: 'flat' },	// Gb
				{ num: 1, acc: 'sharp' },	//G
				{ num: 4, acc: 'flat' }		// Ab
			];

			str = str.gsub(" ", "");
			str = str.toUpperCase();

			var key;
			switch(str[0])
			{
				case 'A': key = 0; break;
				case 'B': key = 2; break;
				case 'C': key = 3; break;
				case 'D': key = 5; break;
				case 'E': key = 7; break;
				case 'F': key = 8; break;
				case 'G': key = 10; break;
				default: key = 3; break;
			}
			var i = 1;
			if (i < str.length)
			{
				switch(str[i])
				{
					case '#': key += 1; i += 1; break;
					case 'B': key -= 1; i += 1; break;
				}
			}
			if (i < str.length)
			{
				var j = i + 3;
				if (j >= str.length) j = str.length-1;
				str = str.substring(i, j+1);
				switch(str)
				{
					case 'LYD': key -= 5; break;
					case 'MIX': key -= 7; break;
					case 'DOR': key -= 2; break;
					case 'MIN': key -= 9; break;
					case 'M': key -= 9; break;
					case 'AEO': key -= 9; break;
					case 'PHR': key -= 4; break;
					case 'LOC': key -= 11; break;
				}
			}
			if (key < 0) key += 12;
			return keys[key];
		};

		var substInChord = function(str)
		{
			while ( str.indexOf("\\n") !== -1)
			{
				str = str.replace("\\n", "\n");
			}
			return str;
		};

		var getBrackettedSubstring = function(line, i, maxErrorChars)
		{
			// This extracts the sub string by looking at the first character and searching for that
			// character later in the line. For instance, if the first character is a quote it will look for
			// the end quote. If the end of the line is reached, then only up to the default number
			// of characters are returned, so that a missing end quote won't eat up the entire line.
			// It returns the substring and the number of characters consumed.
			// The number of characters consumed is normally two more than the size of the substring,
			// but in the error case it might not be.
			var matchChar = line[i];
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
				return getBrackettedSubstring(line, i, 5);
			}
			return [0, ""];
		};

		var letter_to_accent = function(line, i)
		{
			switch (line[i])
			{
				case '.': return [1, 'staccato'];
				case 'u': return [1, 'up_bow'];
				case 'v': return [1, 'down_bow'];
				case '~': return [1, 'trill'];
				case '!':
					var ret = getBrackettedSubstring(line, i, 5);
					// Be sure that the accent is recognizable.
					var legalAccents = [ "trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
						"emphasis", "fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
						"open", "thumb", "snap", "turn", "roll", "breath", "shortphrase", "mediumphrase", "longphrase",
						"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
						"p", "pp", "f", "ff", "mf", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2",
						"upbow", "downbow" ];
					if (legalAccents.detect(function(acc) {
						return (ret[1] === acc);
					}))
						return ret;
					// We didn't find the accent in the list, so consume the space, but don't return an accent.
					ret[1] = "";
					return ret;
				case 'H': return [1, 'fermata'];
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
				case '>': return [1, 1.5, 0.5];
				case '<': return [1, 0.5, 1.5];
				case '2':
					if ((i < line.length-1) && (line[i+1] === '>'))
						return [2, 3, 1];
					else if ((i < line.length-1) && (line[i+1] === '<'))
						return [2, 1, 3];
					else
						return [1, 2];
					break;
				case '3':
					if ((i < line.length-2) && (line[i+1] === '/') && (line[i+2] === '2'))
						return [3, 1.5];
					else
						return [1, 3];
					break;
				case '4': return [1, 4];
				case '6': return [1, 6];
				case '8': return [1, 8];
				case '/':
					if (i < line.length-1)
					{
						switch (line[i+1])
						{
							case '2': return [2, 0.5];
							case '4': return [4, 0.25];
						}
					}
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
		  else if (str2 === "[2" || str2 === "[1") return [ 2, "bar_thin", 2]; // should it guess a repeat?
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
				case 'z' : ret = [ 1, null ]; break; // missing x, y
			}
			if ((ret[0] !== 0) && (curr_pos < line.length-1))
			{
				if (line[curr_pos+1] === ',')
				{
					ret[0]++;
					ret[1] -= 7;
				}
				else if (line[curr_pos+1] === "'")
				{
					ret[0]++;
					ret[1] += 7;
				}
			}
			return ret;
		};

		var multilineVars = {
			reset: function() {
				this.iChar = 0;
				this.key = { num: 0 };
				this.meter = { type: 'specified', num: '4', den: '4'};	// if no meter is specified, there is an implied one.
				this.hasMainTitle = false;
				this.copyright = "";
				this.transcription = "";
				this.notes = "";
				this.book = "";
				this.rhythm = "";
				this.default_length = 1;
			}
		};
		
		var setTitle = function(title) {
			if (multilineVars.hasMainTitle)
				tune.lines[tune.lines.length] = { subtitle: title };	// display secondary title
			else
			{
				tune.title = title;
				multilineVars.hasMainTitle = true;
			}
		};
		
		var setMeter = function(meter) {
			meter = meter.strip();
			if (meter === 'C')
				multilineVars.meter = { type: 'common_time' };
			else if (meter === 'C|')
				multilineVars.meter = { type: 'cut_time' };
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
			tune.appendElement('clef', -1, -1, { type: 'treble' });
			tune.appendElement('key', -1, -1, multilineVars.key);
			if (multilineVars.meter !== "")
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
					// note :=  [chord] [accents] [accidental] pitch [duration]
					// TODO: straighen out all the start and end chars
					var el = { };
					ret = letter_to_chord(line, i);
					if (ret[0] > 0) {
						el.chord = ret[1];
						i += ret[0];
						multilineVars.iChar += ret[0];
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
						if (ret[1]!==null)	// not rest
							tune.appendElement('note', multilineVars.iChar, multilineVars.iChar, el);
						else
							tune.appendElement('rest', multilineVars.iChar, multilineVars.iChar, el);
					}
					else {	// don't know what this is, so ignore it.
						i++;
						multilineVars.iChar++;
					}
				}
			}
			multilineVars.iChar++;	// for the newline
		};

		var parseLine = function(line) {
			var str = "";
			if (line.length >= 2)
				str = line.substring(0, 2);

			switch(str)
			{
				case  'X:':
					multilineVars.iChar += line.length + 1;
					break;
				case  'T:':
					setTitle(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'M:':
					setMeter(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'L:':
					var len = line.substring(2).gsub(" ", "");
					switch (len) {
					case "1/4": multilineVars.default_length = 2; break;
					case "1/8": multilineVars.default_length = 1; break;
					}
					multilineVars.iChar += line.length + 1;
					break;
				case  'Q:':
					multilineVars.iChar += line.length + 1;
					break;
				case  'C:':
					tune.author = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'O:':
					tune.origin = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'B:':
					multilineVars.book = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'S:':
					multilineVars.copyright = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'Z:':
					multilineVars.transcription = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'N:':
					multilineVars.notes += line.substring(2) + "\n";
					multilineVars.iChar += line.length + 1;
					break;
				case  'R:':
					multilineVars.rhythm = line.substring(2);
					multilineVars.iChar += line.length + 1;
					break;
				case  'K:':
					multilineVars.key = parseKey(line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'w:':
					addWords(tune.lines[tune.lines.length-1].staff, line.substring(2));
					multilineVars.iChar += line.length + 1;
					break;
				case  'P:':
					// TODO: handle parts.
					multilineVars.iChar += line.length + 1;
					break;
				case  '%%':
					// TODO: handle meta commands.
					multilineVars.iChar += line.length + 1;
					break;
				default:
					if (line.length > 0)
						parseRegularMusicLine(line);
			}
		};
		
		var parseTune = function(strTune) {
			strTune = strTune.replace(/\\\n/g, "  ");	// take care of line continuations right away, but keep the same number of characters
			var lines = strTune.split('\n');
			lines.each( function(line)
			{
				parseLine(line);
			});

			if (multilineVars.rhythm !== "")
				multilineVars.rhythm = "Rhythm: " + multilineVars.rhythm + "\n";
			if (multilineVars.copyright !== "")
				multilineVars.copyright = "Source: " + multilineVars.copyright + "\n";
			if (multilineVars.notes !== "")
				multilineVars.notes = "Notes: " + multilineVars.notes + "\n";
			if (multilineVars.transcription !== "")
				multilineVars.transcription = "Transcription: " + multilineVars.transcription + "\n";
			if (multilineVars.book !== "")
				multilineVars.book = "Book: " + multilineVars.book + "\n";
			tune.extraText = multilineVars.rhythm+multilineVars.copyright+multilineVars.transcription+multilineVars.notes+multilineVars.book;
		};
		
		this.parse = function(strTune) {
			tune.reset();
			multilineVars.reset();
			parseTune(strTune);
		}
	}
});

