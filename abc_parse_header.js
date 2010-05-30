//    abc_parse_header.js: parses a the header fields from a string representing ABC Music Notation into a usable internal structure.
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

/*extern AbcParseHeader */

function AbcParseHeader(tokenizer, warn, multilineVars, tune) {
	var key1sharp = {acc: 'sharp', note: 'f'};
	var key2sharp = {acc: 'sharp', note: 'c'};
	var key3sharp = {acc: 'sharp', note: 'g'};
	var key4sharp = {acc: 'sharp', note: 'd'};
	var key5sharp = {acc: 'sharp', note: 'A'};
	var key6sharp = {acc: 'sharp', note: 'e'};
	var key7sharp = {acc: 'sharp', note: 'B'};
	var key1flat = {acc: 'flat', note: 'B'};
	var key2flat = {acc: 'flat', note: 'e'};
	var key3flat = {acc: 'flat', note: 'A'};
	var key4flat = {acc: 'flat', note: 'd'};
	var key5flat = {acc: 'flat', note: 'G'};
	var key6flat = {acc: 'flat', note: 'c'};
	var key7flat = {acc: 'flat', note: 'f'};

	var keys = {
		'C#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'A#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'G#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'D#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'E#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'F#Lyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'B#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],

		'F#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'D#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'C#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'G#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'A#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'BLyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'E#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],

		'B': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'G#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'F#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'C#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'D#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'ELyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'A#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],

		'E': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'C#m': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'BMix': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'F#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'G#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'ALyd': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'D#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp ],

		'A': [ key1sharp, key2sharp, key3sharp ],
		'F#m': [ key1sharp, key2sharp, key3sharp ],
		'EMix': [ key1sharp, key2sharp, key3sharp ],
		'BDor': [ key1sharp, key2sharp, key3sharp ],
		'C#Phr': [ key1sharp, key2sharp, key3sharp ],
		'DLyd': [ key1sharp, key2sharp, key3sharp ],
		'G#Loc': [ key1sharp, key2sharp, key3sharp ],

		'D': [ key1sharp, key2sharp ],
		'Bm': [ key1sharp, key2sharp ],
		'AMix': [ key1sharp, key2sharp ],
		'EDor': [ key1sharp, key2sharp ],
		'F#Phr': [ key1sharp, key2sharp ],
		'GLyd': [ key1sharp, key2sharp ],
		'C#Loc': [ key1sharp, key2sharp ],

		'G': [ key1sharp ],
		'Em': [ key1sharp ],
		'DMix': [ key1sharp ],
		'ADor': [ key1sharp ],
		'BPhr': [ key1sharp ],
		'CLyd': [ key1sharp ],
		'F#Loc': [ key1sharp ],

		'C': [],
		'Am': [],
		'GMix': [],
		'DDor': [],
		'EPhr': [],
		'FLyd': [],
		'BLoc': [],

		'F': [ key1flat ],
		'Dm': [ key1flat ],
		'CMix': [ key1flat ],
		'GDor': [ key1flat ],
		'APhr': [ key1flat ],
		'BbLyd': [ key1flat ],
		'ELoc': [ key1flat ],

		'Bb': [ key1flat, key2flat ],
		'Gm': [ key1flat, key2flat ],
		'FMix': [ key1flat, key2flat ],
		'CDor': [ key1flat, key2flat ],
		'DPhr': [ key1flat, key2flat ],
		'EbLyd': [ key1flat, key2flat ],
		'ALoc': [ key1flat, key2flat ],

		'Eb': [ key1flat, key2flat, key3flat ],
		'Cm': [ key1flat, key2flat, key3flat ],
		'BbMix': [ key1flat, key2flat, key3flat ],
		'FDor': [ key1flat, key2flat, key3flat ],
		'GPhr': [ key1flat, key2flat, key3flat ],
		'AbLyd': [ key1flat, key2flat, key3flat ],
		'DLoc': [ key1flat, key2flat, key3flat ],

		'Ab': [ key1flat, key2flat, key3flat, key4flat ],
		'Fm': [ key1flat, key2flat, key3flat, key4flat ],
		'EbMix': [ key1flat, key2flat, key3flat, key4flat ],
		'BbDor': [ key1flat, key2flat, key3flat, key4flat ],
		'CPhr': [ key1flat, key2flat, key3flat, key4flat ],
		'DbLyd': [ key1flat, key2flat, key3flat, key4flat ],
		'GLoc': [ key1flat, key2flat, key3flat, key4flat ],

		'Db': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'Bbm': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'AbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'EbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'FPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'GgLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'CLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat ],

		'Gb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'Ebm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'DbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'AbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'BbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'CbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'FLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],

		'Cb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'Abm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'GbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'DbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'EbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'FbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'BbLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],

		// The following are not in the 2.0 spec, but seem normal enough.
		// TODO-PER: These SOUND the same as what's written, but they aren't right
		'A#': [ key1flat, key2flat ],
		'B#': [],
		'D#': [ key1flat, key2flat, key3flat ],
		'E#': [ key1flat ],
		'G#': [ key1flat, key2flat, key3flat, key4flat ]
	};

	var calcMiddle = function(clef, oct) {
		var mid = 0;
		switch(clef) {
			case 'treble':
			case 'none':
			case 'treble+8':
			case 'treble-8':
				break;
			case 'bass3':
			case 'bass':
			case 'bass+8':
			case 'bass-8':
			case 'bass+16':
			case 'bass-16':
				mid = -12;
				break;
			case 'tenor':
				mid = -8;
				break;
			case 'alto2':
			case 'alto1':
			case 'alto':
			case 'alto+8':
			case 'alto-8':
				mid = -6;
				break;
		}
		return mid+oct;
	};

	this.deepCopyKey = function(key) {
		var ret = { accidentals: [] };
		key.each(function(k) {
			ret.accidentals.push(Object.clone(k));
		});
		return ret;
	};

	var pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};

	this.addPosToKey = function(clef, key) {
		// Shift the key signature from the treble positions to whatever position is needed for the clef.
		// This may put the key signature unnaturally high or low, so if it does, then shift it.
		var mid = clef.verticalPos;
		key.accidentals.each(function(acc) {
			var pitch = pitches[acc.note];
			pitch = pitch - mid;
			acc.verticalPos = pitch;
		});
		if (mid < -10) {
			key.accidentals.each(function(acc) {
				acc.verticalPos -= 14;
			});
		} else if (mid < -4) {
			key.accidentals.each(function(acc) {
				acc.verticalPos -= 7;
			});
		}
	};

	this.fixKey = function(clef, key) {
		var fixedKey = Object.clone(key);
		this.addPosToKey(clef, fixedKey);
		return fixedKey;
	};

	var parseMiddle = function(str) {
	  var mid = pitches[str.charAt(0)];
		for (var i = 1; i < str.length; i++) {
			if (str.charAt(i) === ',') mid -= 7;
			else if (str.charAt(i) === ',') mid += 7;
		}
		return mid - 6;	// We get the note in the middle of the staff. We want the note that appears as the first ledger line below the staff.
	};

	this.parseKey = function(str)	// (and clef)
	{
		str = tokenizer.stripComment(str);
		var origStr = str;
		if (str.length === 0) {
			// an empty K: field is the same as K:none
			str = 'none';
		}
		// The format is:
		// [space][tonic[#|b][ ][3-letter-mode][ignored-chars][space]][ accidentals...][ clef=treble|bass|bass3|tenor|alto|alto2|alto1|none [+8|-8]]
		// -- or -- the key can be "none"
		// First get the key letter: turn that into a index into the key array (0-11)
		// Then see if there is a sharp or flat. Increment or decrement.
		// Then see if there is a mode modifier. Add or subtract to the index.
		// Then do a mod 12 on the index and return the key.
		// TODO: This may leave unparsed characters at the end after something reasonable was found.

		var setMiddle = function(str) {
			var i = tokenizer.skipWhiteSpace(str);
			str = str.substring(i);
			if (str.startsWith('m=') || str.startsWith('middle=')) {
				str = str.substring(str.indexOf('=')+1);
				multilineVars.clef.verticalPos = parseMiddle(str);
			}
		};
		// check first to see if there is only a clef. If so, just take that, but ignore an error after that.
		var retClef = tokenizer.getClef(str);
		if (retClef.token !== undefined && (retClef.explicit === true || retClef.token !== 'none')) {	// none is the only ambiguous marking. We need to assume that's a key
			multilineVars.clef = {type: retClef.token, verticalPos: calcMiddle(retClef.token, 0)};
			str = str.substring(retClef.len);
			setMiddle(str);
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
			// We need to do a deep copy because we are going to modify it
			ret = this.deepCopyKey(keys[key]);
		} else if (str.startsWith('HP')) {
			this.addDirective("bagpipes");
			ret.accidentals = [];
			multilineVars.key = ret;
			return {foundKey: true};
		} else if (str.startsWith('Hp')) {
			ret.accidentals = [ {acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'} ];
			this.addDirective("bagpipes");
			multilineVars.key = ret;
			return {foundKey: true};
		} else {
			var retNone = tokenizer.isMatch(str, 'none');
			if (retNone > 0) {
				// we got the none key - that's the same as C to us
				ret.accidentals = [];
				str = str.substring(retNone);
			}
		}
		// There are two special cases of deprecated syntax. Ignore them if they occur
		var j = tokenizer.skipWhiteSpace(str);
		str = str.substring(j);
		if (str.startsWith('exp') || str.startsWith('oct'))
			str = str.substring(3);

		// now see if there are extra accidentals
		var done = false;
		while (!done) {
			var retExtra = tokenizer.getKeyAccidental(str);
			if (retExtra.len === 0)
				done = true;
			else {
				str = str.substring(retExtra.len);
				if (retExtra.warn)
					warn("error parsing extra accidentals:", origStr, 0);
				else {
					if (!ret.accidentals)
						ret.accidentals = [];
					ret.accidentals.push(retExtra.token);
				}
			}
		}

		// now see if there is a clef
		retClef = tokenizer.getClef(str);
		if (retClef.len > 0) {
			if (retClef.warn)
				warn("error parsing clef:" + retClef.warn, origStr, 0);
			else {
				//ret.clef = retClef.token;
				multilineVars.clef = {type: retClef.token, verticalPos: calcMiddle(retClef.token, 0)};
				str = str.substring(retClef.len);
				setMiddle(str);
			}
		}

		if (ret.accidentals === undefined && retClef.token === undefined) {
			warn("error parsing key: ", origStr, 0);
			return {};
		}
		var result = {};
		if (retClef.token !== undefined)
			result.foundClef = true;
		if (ret.accidentals !== undefined) {
			// Adjust the octave of the accidentals, if necessary
			ret.accidentals.each(function(acc) {
				if (retClef.token === 'bass') {
					//if (acc.note === 'A') acc.note = 'a';
					//if (acc.note === 'B') acc.note = 'b';
					if (acc.note === 'C') acc.note = 'c';
					if (acc.note === 'D' && acc.acc !== 'flat') acc.note = 'd';
					if (acc.note === 'E' && acc.acc !== 'flat') acc.note = 'e';
					if (acc.note === 'F' && acc.acc !== 'flat') acc.note = 'f';
					if (acc.note === 'G' && acc.acc !== 'flat') acc.note = 'g';
				} else {
					if (acc.note === 'a') acc.note = 'A';
					if (acc.note === 'b') acc.note = 'B';
					if (acc.note === 'C') acc.note = 'c';
				}
			});
			multilineVars.key = ret;
			result.foundKey = true;
		}
		return result;
	};

	this.addDirective = function(str) {
		var oneParameterMeasurement = function(cmd, tokens) {
			var points = tokenizer.getMeasurement(tokens);
			if (points.used === 0 || tokens.length !== 0)
				return "Directive \"" + cmd + "\" requires a measurement as a parameter.";
			tune.formatting[cmd] = points.value;
			return null;
		};
		var getFontParameter = function(tokens) {
			var font = {};
			var token = tokens.last();
			if (token.type === 'number') {
				font.size = parseInt(token.token);
				tokens.pop();
			}
			if (tokens.length > 0) {
				var scratch = "";
				tokens.each(function(tok) {
					if (tok.token !== '-') {
						if (scratch.length > 0) scratch += ' ';
						scratch += tok.token;
					}
				});
				font.font = scratch;
			}
			return font;
		};
		var getChangingFont = function(cmd, tokens) {
			if (tokens.length === 0)
				return "Directive \"" + cmd + "\" requires a font as a parameter.";
			multilineVars[cmd] = getFontParameter(tokens);
			return null;
		};
		var getGlobalFont = function(cmd, tokens) {
			if (tokens.length === 0)
				return "Directive \"" + cmd + "\" requires a font as a parameter.";
			tune.formatting[cmd] = getFontParameter(tokens);
			return null;
		};

		var tokens = tokenizer.tokenize(str, 0, str.length);	// 3 or more % in a row, or just spaces after %% is just a comment
		if (tokens.length === 0 || tokens[0].type !== 'alpha') return null;
		var restOfString = str.substring(str.indexOf(tokens[0].token)+tokens[0].token.length);
		restOfString = tokenizer.stripComment(restOfString);
		var cmd = tokens.shift().token.toLowerCase();
		var num;
		var scratch = "";
		switch (cmd)
		{
			// The following directives were added to abc_parser_lint, but haven't been implemented here.
			// Most of them are direct translations from the directives that will be parsed in. See abcm2ps's format.txt for info on each of these.
			//					alignbars: { type: "number", optional: true },
			//					aligncomposer: { type: "string", Enum: [ 'left', 'center','right' ], optional: true },
			//					annotationfont: fontType,
			//					barsperstaff: { type: "number", optional: true },
			//					bstemdown: { type: "boolean", optional: true },
			//					continueall: { type: "boolean", optional: true },
			//					dynalign: { type: "boolean", optional: true },
			//					exprabove: { type: "boolean", optional: true },
			//					exprbelow: { type: "boolean", optional: true },
			//					flatbeams: { type: "boolean", optional: true },
			//					footer: { type: "string", optional: true },
			//					footerfont: fontType,
			//					gchordbox: { type: "boolean", optional: true },
			//					graceslurs: { type: "boolean", optional: true },
			//					gracespacebefore: { type: "number", optional: true },
			//					gracespaceinside: { type: "number", optional: true },
			//					gracespaceafter: { type: "number", optional: true },
			//					header: { type: "string", optional: true },
			//					headerfont: fontType,
			//					historyfont: fontType,
			//					infofont: fontType,
			//					infospace: { type: "number", optional: true },
			//					lineskipfac: { type: "number", optional: true },
			//					maxshrink: { type: "number", optional: true },
			//					maxstaffsep: { type: "number", optional: true },
			//					maxsysstaffsep: { type: "number", optional: true },
			//					measurebox: { type: "boolean", optional: true },
			//					measurefont: fontType,
			//					notespacingfactor: { type: "number", optional: true },
			//					pageheight: { type: "number", optional: true },
			//					pagewidth: { type: "number", optional: true },
			//					parskipfac: { type: "number", optional: true },
			//					partsbox: { type: "boolean", optional: true },
			//					repeatfont: fontType,
			//					rightmargin: { type: "number", optional: true },
			//					slurheight: { type: "number", optional: true },
			//					splittune: { type: "boolean", optional: true },
			//					squarebreve: { type: "boolean", optional: true },
			//					stemheight: { type: "number", optional: true },
			//					straightflags: { type: "boolean", optional: true },
			//					stretchstaff: { type: "boolean", optional: true },
			//					textfont: fontType,
			//					titleformat: { type: "string", optional: true },
			//					vocalabove: { type: "boolean", optional: true },
			//					vocalfont: fontType,
			//					wordsfont: fontType,
			case "bagpipes":tune.formatting.bagpipes = true;break;
			case "landscape":tune.formatting.landscape = true;break;
			case "slurgraces":tune.formatting.slurgraces = true;break;
			case "stretchlast":tune.formatting.stretchlast = true;break;
			case "titlecaps":multilineVars.titlecaps = true;break;
			case "titleleft":tune.formatting.titleleft = true;break;

			case "botmargin":
			case "botspace":
			case "composerspace":
			case "indent":
			case "leftmargin":
			case "linesep":
			case "musicspace":
			case "partsspace":
			case "staffsep":
			case "staffwidth":
			case "subtitlespace":
			case "sysstaffsep":
			case "systemsep":
			case "textspace":
			case "titlespace":
			case "topmargin":
			case "topspace":
			case "vocalspace":
			case "wordsspace":
				return oneParameterMeasurement(cmd, tokens);
			case "scale":
				scratch = "";
				tokens.each(function(tok) {
					scratch += tok.token;
				});
				num = parseFloat(scratch);
				if (isNaN(num) || num === 0)
					return "Directive \"" + cmd + "\" requires a number as a parameter.";
				tune.formatting.scale = num;
				break;
			case "sep":
				if (tokens.length === 0)
					tune.addSeparator();
				else {
					if (tokens.length !== 3 || tokens[0].type !== 'number' || tokens[1].type !== 'number' || tokens[2].type !== 'number')
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					tune.addSeparator(parseInt(tokens[0].token), parseInt(tokens[1].token), parseInt(tokens[2].token));
				}
				break;
			case "barnumbers":
				if (tokens.length !== 1 || tokens[0].type !== 'number')
					return "Directive \"" + cmd + "\" requires a number as a parameter.";
				multilineVars.barNumbers = parseInt(tokens[0].token);
				break;
			case "begintext":
				multilineVars.inTextBlock = true;
				break;
			case "text":
				tune.addText(tokenizer.translateString(restOfString));	// display secondary title
				break;
			case "gchordfont":
			case "partsfont":
			case "vocalfont":
				return getChangingFont(cmd, tokens);
			case "barlabelfont":
			case "barnumberfont":
			case "composerfont":
			case "subtitlefont":
			case "tempofont":
			case "titlefont":
			case "voicefont":
				return getGlobalFont(cmd, tokens);
			case "barnumfont":
				return getGlobalFont("barnumberfont", tokens);
			case "staves":
			case "score":
				multilineVars.score_is_present = true;
				var addVoice = function(id, newStaff, bracket, brace, continueBar) {
					if (newStaff || multilineVars.staves.length === 0) {
						multilineVars.staves.push({index: multilineVars.staves.length, numVoices: 0});
					}
					var staff = multilineVars.staves.last();
					if (bracket !== undefined) staff.bracket = bracket;
					if (brace !== undefined) staff.brace = brace;
					if (continueBar) staff.connectBarLines = 'end';
					if (multilineVars.voices[id] === undefined) {
						multilineVars.voices[id] = {staffNum: staff.index, index: staff.numVoices};
						staff.numVoices++;
					}
				};

				var openParen = false;
				var openBracket = false;
				var openBrace = false;
				var justOpenParen = false;
				var justOpenBracket = false;
				var justOpenBrace = false;
				var continueBar = false;
				var lastVoice = undefined;
				var addContinueBar = function() {
					continueBar = true;
					if (lastVoice) {
						var ty = 'start';
						if (lastVoice.staffNum > 0) {
							if (multilineVars.staves[lastVoice.staffNum-1].connectBarLines === 'start' ||
								multilineVars.staves[lastVoice.staffNum-1].connectBarLines === 'continue')
								ty = 'continue';
						}
						multilineVars.staves[lastVoice.staffNum].connectBarLines = ty;
					}
				};
				while (tokens.length) {
					var t = tokens.shift();
					switch (t.token) {
						case '(':
							if (openParen) warn("Can't nest parenthesis in %%score", str, t.start);
							else {openParen = true;justOpenParen = true;}
							break;
						case ')':
							if (!openParen || justOpenParen) warn("Unexpected close parenthesis in %%score", str, t.start);
							else openParen = false;
							break;
						case '[':
							if (openBracket) warn("Can't nest brackets in %%score", str, t.start);
							else {openBracket = true;justOpenBracket = true;}
							break;
						case ']':
							if (!openBracket || justOpenBracket) warn("Unexpected close bracket in %%score", str, t.start);
							else {openBracket = false;multilineVars.staves[lastVoice.staffNum].bracket = 'end';}
							break;
						case '{':
							if (openBrace ) warn("Can't nest braces in %%score", str, t.start);
							else {openBrace = true;justOpenBrace = true;}
							break;
						case '}':
							if (!openBrace || justOpenBrace) warn("Unexpected close brace in %%score", str, t.start);
							else {openBrace = false;multilineVars.staves[lastVoice.staffNum].brace = 'end';}
							break;
						case '|':
							addContinueBar();
							break;
						default:
							var vc = "";
							while (t.type === 'alpha' || t.type === 'number') {
								vc += t.token;
								if (t.continueId)
									t = tokens.shift();
								else
									break;
							}
							var newStaff = !openParen || justOpenParen;
							var bracket = justOpenBracket ? 'start' : openBracket ? 'continue' : undefined;
							var brace = justOpenBrace ? 'start' : openBrace ? 'continue' : undefined;
							addVoice(vc, newStaff, bracket, brace, continueBar);
							justOpenParen = false;
							justOpenBracket = false;
							justOpenBrace = false;
							continueBar = false;
							lastVoice = multilineVars.voices[vc];
							if (cmd === 'staves')
								addContinueBar();
							break;
					}
				}
				break;

			case "midi":
			case "indent":
			case "playtempo":
			case "auquality":
			case "continuous":
			case "nobarcheck":
				// TODO-PER: Actually handle the parameters of these
				tune.formatting[cmd] = restOfString;
				break;
			default:
				return "Unknown directive: " + cmd;
		}
		return null;
	};

	this.setCurrentVoice = function(id) {
		multilineVars.currentVoice = multilineVars.voices[id];
		tune.setCurrentVoice(multilineVars.currentVoice.staffNum, multilineVars.currentVoice.index);
	};

	this.parseVoice = function(line, i, e) {
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
			if (multilineVars.score_is_present)
				warn("Can't have an unknown V: id when the %score directive is present", line, i);
		}
		start += id.length;
		start += tokenizer.eatWhiteSpace(line, start);

		var staffInfo = {startStaff: isNew};
		var addNextTokenToStaffInfo = function(name) {
			var attr = tokenizer.getVoiceToken(line, start, end);
			if (attr.warn !== undefined)
				warn("Expected value for " + name + " in voice: " + attr.warn, line, start);
			else if (attr.token.length === 0 && line.charAt(start) !== '"')
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
						// TODO-PER: check for a legal clef; do octavizing
						var oct = 0;
//							for (var ii = 0; ii < staffInfo.clef.length; ii++) {
//								if (staffInfo.clef[ii] === ',') oct -= 7;
//								else if (staffInfo.clef[ii] === "'") oct += 7;
//							}
						if (staffInfo.clef !== undefined) {
						  staffInfo.clef = staffInfo.clef.replace(/[',]/g, ""); //'//comment for emacs formatting of regexp
							if (staffInfo.clef.indexOf('+16') !== -1) {
								oct += 14;
								staffInfo.clef = staffInfo.clef.replace('+16', '');
							}
							staffInfo.verticalPos = calcMiddle(staffInfo.clef, oct);
						}
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
						// TODO-PER: handle the octave indicators on the clef by changing the middle property
						var oct2 = 0;
//							for (var iii = 0; iii < token.token.length; iii++) {
//								if (token.token[iii] === ',') oct2 -= 7;
//								else if (token.token[iii] === "'") oct2 += 7;
//							}
											  staffInfo.clef = token.token.replace(/[',]/g, ""); //'//comment for emacs formatting of regexp
						staffInfo.verticalPos = calcMiddle(staffInfo.clef, oct2);
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
						addNextTokenToStaffInfo('verticalPos');
						staffInfo.verticalPos = parseMiddle(staffInfo.verticalPos);
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
			multilineVars.staves.push({index: multilineVars.staves.length, meter: multilineVars.origMeter});
			if (!multilineVars.score_is_present)
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
		var s = multilineVars.staves[multilineVars.voices[id].staffNum];
		if (!multilineVars.score_is_present)
			s.numVoices++;
		if (staffInfo.clef) s.clef = {type: staffInfo.clef, verticalPos: staffInfo.verticalPos};
		if (staffInfo.spacing) s.spacing_below_offset = staffInfo.spacing;
		if (staffInfo.verticalPos) s.verticalPos = staffInfo.verticalPos;

		if (staffInfo.name) {if (s.name) s.name.push(staffInfo.name); else s.name = [ staffInfo.name ];}
		if (staffInfo.subname) {if (s.subname) s.subname.push(staffInfo.subname); else s.subname = [ staffInfo.subname ];}

		this.setCurrentVoice(id);
	};

	this.setTitle = function(title) {
		if (multilineVars.hasMainTitle)
			tune.addSubtitle(tokenizer.translateString(tokenizer.stripComment(title)));	// display secondary title
		else
		{
			tune.addMetaText("title", tokenizer.translateString(tokenizer.theReverser(tokenizer.stripComment(title))));
			multilineVars.hasMainTitle = true;
		}
	};

	this.setMeter = function(line) {
		line = tokenizer.stripComment(line);
		if (line === 'C') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'common_time'};
		} else if (line === 'C|') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'cut_time'};
		} else if (line.length === 0 || line.toLowerCase() === 'none') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return null;
		}
		else
		{
			var tokens = tokenizer.tokenize(line, 0, line.length);
			// the form is [open_paren] decimal [ plus|dot decimal ]... [close_paren] slash decimal [plus same_as_before]
			try {
				var parseNum = function() {
					// handles this much: [open_paren] decimal [ plus|dot decimal ]... [close_paren]
					var ret = {value: 0, num: ""};

					var tok = tokens.shift();
					if (tok.token === '(')
						tok = tokens.shift();
					while (1) {
						if (tok.type !== 'number') throw "Expected top number of meter";
						ret.value += parseInt(tok.token);
						ret.num += tok.token;
						if (tokens.length === 0 || tokens[0].token === '/') return ret;
						tok = tokens.shift();
						if (tok.token === ')') {
							if (tokens.length === 0 || tokens[0].token === '/') return ret;
							throw "Unexpected paren in meter";
						}
						if (tok.token !== '.' && tok.token !== '+') throw "Expected top number of meter";
						ret.num += tok.token;
						if (tokens.length === 0) throw "Expected top number of meter";
						tok = tokens.shift();
					}
					return ret;	// just to suppress warning
				};

				var parseFraction = function() {
					// handles this much: parseNum slash decimal
					var ret = parseNum();
					if (tokens.length === 0) throw "Expected slash in meter";
					var tok = tokens.shift();
					if (tok.token !== '/') throw "Expected slash in meter";
					tok = tokens.shift();
					if (tok.type !== 'number') throw "Expected bottom number of meter";
					ret.den = tok.token;
					ret.value = ret.value / parseInt(ret.den);
					return ret;
				};

				if (tokens.length === 0) throw "Expected meter definition in M: line";
				var meter = {type: 'specified', value: [ ]};
				var totalLength = 0;
				while (1) {
					var ret = parseFraction();
					totalLength += ret.value;
					meter.value.push({num: ret.num, den: ret.den});
					if (tokens.length === 0) break;
					var tok = tokens.shift();
					if (tok.token !== '+') throw "Extra characters in M: line";
				}

				if (multilineVars.havent_set_length === true) {
					multilineVars.default_length = totalLength < 0.75 ? 0.0625 : 0.125;
				}
				return meter;
			} catch (e) {
				warn(e, line, 0);
			}
		}
		return null;
	};

	this.calcTempo = function(relTempo) {
		var dur = multilineVars.default_length ? multilineVars.default_length : 1;
		for (var i = 0; i < relTempo.duration; i++)
			relTempo.duration[i] = dur * relTempo.duration[i];
		return relTempo;
	};

	this.resolveTempo = function() {
		if (multilineVars.tempo) {	// If there's a tempo waiting to be resolved
			this.calcTempo(multilineVars.tempo);
			tune.metaText.tempo = multilineVars.tempo;
			delete multilineVars.tempo;
		}
	};

	this.addUserDefinition = function(line, start, end) {
		var equals = line.indexOf('=', start);
		if (equals === -1) {
			warn("Need an = in a macro definition", line, start);
			return;
		}

		var before = line.substring(start, equals).strip();
		var after = line.substring(equals+1).strip();

		if (before.length !== 1) {
			warn("Macro definitions can only be one character", line, start);
			return;
		}
		var legalChars = "HIJKLMNOPQRSTUVWhijklmnopqrstuvw~";
		if (legalChars.indexOf(before) === -1) {
			warn("Macro definitions must be H-W, h-w, or tilde", line, start);
			return;
		}
		if (after.length === 0) {
			warn("Missing macro definition", line, start);
			return;
		}
		if (multilineVars.macros === undefined)
			multilineVars.macros = {};
		multilineVars.macros[before] = after;
	};

	this.setDefaultLength = function(line, start, end) {
		var len = line.substring(start, end).gsub(" ", "");
		var len_arr = len.split('/');
		if (len_arr.length === 2) {
			var n = parseInt(len_arr[0]);
			var d = parseInt(len_arr[1]);
			if (d > 0) {
				var q = n / d;
				multilineVars.default_length = q;	// a whole note is 1
				multilineVars.havent_set_length = false;
			}
		}
	};

	this.setTempo = function(line, start, end) {
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

			var tempo = {};
			var delaySet = true;
			var token = tokens.shift();
			if (token.type === 'quote') {
				tempo.preString = token.token;
				token = tokens.shift();
				if (tokens.length === 0) {	// It's ok to just get a string for the tempo
					return {type: 'immediate', tempo: tempo};
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
					tempo.duration = [1];
					tempo.bpm = parseInt(token.token);
				} else if (token.type === 'number') {
					// This is a type 3 format.
					tempo.duration = [parseInt(token.token)];
					if (tokens.length === 0) throw "Missing = after duration in Q: field";
					token = tokens.shift();
					if (token.type !== 'punct' || token.token !== '=') throw "Expected = after duration in Q: field";
					if (tokens.length === 0) throw "Missing tempo after = in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected number after = in Q: field";
					tempo.bpm = parseInt(token.token);
				} else throw "Expected number or equal after C in Q: field";

			} else if (token.type === 'number') {	// either type 1 or type 4
				var num = parseInt(token.token);
				if (tokens.length === 0 || tokens[0].type === 'quote') {
					// This is type 1
					tempo.duration = [1];
					tempo.bpm = num;
				} else {	// This is type 4
					delaySet = false;
					token = tokens.shift();
					if (token.type !== 'punct' && token.token !== '/') throw "Expected fraction in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected fraction in Q: field";
					var den = parseInt(token.token);
					tempo.duration = [num/den];
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
						tempo.duration.push(num/den);
					}
					token = tokens.shift();
					if (token.type !== 'punct' && token.token !== '=') throw "Expected = in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected tempo in Q: field";
					tempo.bpm = parseInt(token.token);
				}
			} else throw "Unknown value in Q: field";
			if (tokens.length !== 0) {
				token = tokens.shift();
				if (token.type === 'quote') {
					tempo.postString = token.token;
					token = tokens.shift();
				}
				if (tokens.length !== 0) throw "Unexpected string at end of Q: field";
			}
			return {type: delaySet?'delaySet':'immediate', tempo: tempo};
		} catch (msg) {
			warn(msg, line, start);
			return {type: 'none'};
		}
	};

	this.letter_to_inline_header = function(line, i)
	{
		var ws = tokenizer.eatWhiteSpace(line, i);
		i +=ws;
		if (line.length >= i+5 && line.charAt(i) === '[' && line.charAt(i+2) === ':') {
			var e = line.indexOf(']', i);
			switch(line.substring(i, i+3))
			{
				case "[I:":
					var err = this.addDirective(line.substring(i+3, e));
					if (err) warn(err, line, i);
					return [ e-i+1+ws ];
				case "[M:":
					var meter = this.setMeter(line.substring(i+3, e));
					if (tune.hasBeginMusic() && meter)
						tune.appendStartingElement('meter', -1, -1, meter);
					return [ e-i+1+ws ];
				case "[K:":
					var result = this.parseKey(line.substring(i+3, e));
					if (result.foundClef && tune.hasBeginMusic())
						tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
					if (result.foundKey && tune.hasBeginMusic())
						tune.appendStartingElement('key', -1, -1, this.fixKey(multilineVars.clef, multilineVars.key));
					return [ e-i+1+ws ];
				case "[P:":
					tune.appendElement('part', -1, -1, {title: line.substring(i+3, e)});
					return [ e-i+1+ws ];
				case "[L:":
					this.setDefaultLength(line, i+3, e);
					return [ e-i+1+ws ];
				case "[Q:":
					if (e > 0) {
						var tempo = this.setTempo(line, i+3, e);
						if (tempo.type === 'delaySet') tune.appendElement('tempo', -1, -1, this.calcTempo(tempo.tempo));
						else if (tempo.type === 'immediate') tune.appendElement('tempo', -1, -1, tempo.tempo);
						return [ e-i+1+ws, line.charAt(i+1), line.substring(i+3, e)];
					}
					break;
				case "[V:":
					if (e > 0) {
						this.parseVoice(line, i+3, e);
						//startNewLine();
						return [ e-i+1+ws, line.charAt(i+1), line.substring(i+3, e)];
					}
					break;

				default:
					// TODO: complain about unhandled header
			}
		}
		return [ 0 ];
	};

	this.letter_to_body_header = function(line, i)
	{
		if (line.length >= i+3) {
			switch(line.substring(i, i+2))
			{
				case "I:":
					var err = this.addDirective(line.substring(i+2));
					if (err) warn(err, line, i);
					return [ line.length ];
				case "M:":
					var meter = this.setMeter(line.substring(i+2));
					if (tune.hasBeginMusic() && meter)
						tune.appendStartingElement('meter', -1, -1, meter);
					return [ line.length ];
				case "K:":
					var result = this.parseKey(line.substring(i+2));
					if (result.foundClef && tune.hasBeginMusic())
						tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
					if (result.foundKey && tune.hasBeginMusic())
						tune.appendStartingElement('key', -1, -1, this.fixKey(multilineVars.clef, multilineVars.key));
					return [ line.length ];
				case "P:":
					if (tune.hasBeginMusic())
						tune.appendElement('part', -1, -1, {title: line.substring(i+2)});
					return [ line.length ];
				case "L:":
					this.setDefaultLength(line, i+2, line.length);
					return [ line.length ];
				case "Q:":
					var e = line.indexOf('\x12', i+2);
					if (e === -1) e = line.length;
					var tempo = this.setTempo(line, i+2, e);
					if (tempo.type === 'delaySet') tune.appendElement('tempo', -1, -1, this.calcTempo(tempo.tempo));
					else if (tempo.type === 'immediate') tune.appendElement('tempo', -1, -1, tempo.tempo);
				return [ e, line.charAt(i), line.substring(i+2).strip()];
				case "V:":
					this.parseVoice(line, 2, line.length);
//						startNewLine();
					return [ line.length, line.charAt(i), line.substring(i+2).strip()];
				default:
					// TODO: complain about unhandled header
			}
		}
		return [ 0 ];
	};

	var metaTextHeaders = {
		A: 'author',
		B: 'book',
		C: 'composer',
		D: 'discography',
		F: 'url',
		G: 'group',
		I: 'instruction',
		N: 'notes',
		O: 'origin',
		R: 'rhythm',
		S: 'source',
		W: 'unalignedWords',
		Z: 'transcription'
	};

	this.parseHeader = function(line) {
		if (line.startsWith('%%')) {
			var err = this.addDirective(line.substring(2));
			if (err) warn(err, line, 2);
			return {};
		}
		line = tokenizer.stripComment(line);
		if (line.length === 0)
			return {};

		if (line.length >= 2) {
			if (line.charAt(1) === ':') {
				var nextLine = "";
				if (line.indexOf('\x12') >= 0 && line.charAt(0) !== 'w') {	// w: is the only header field that can have a continuation.
					nextLine = line.substring(line.indexOf('\x12')+1);
					line = line.substring(0, line.indexOf('\x12'));	//This handles a continuation mark on a header field
				}
				var field = metaTextHeaders[line.charAt(0)];
				if (field !== undefined) {
					tune.addMetaText(field, tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
					return {};
				} else {
					switch(line.charAt(0))
					{
						case  'H':
							tune.addMetaText("history", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
							multilineVars.is_in_history = true;
							break;
						case  'K':
							// since the key is the last thing that can happen in the header, we can resolve the tempo now
							this.resolveTempo();
							var result = this.parseKey(line.substring(2));
							if (!multilineVars.is_in_header && tune.hasBeginMusic()) {
								if (result.foundClef)
									tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
								if (result.foundKey)
									tune.appendStartingElement('key', -1, -1, this.fixKey(multilineVars.clef, multilineVars.key));
							}
							multilineVars.is_in_header = false;	// The first key signifies the end of the header.
							break;
						case  'L':
							this.setDefaultLength(line, 2, line.length);
							break;
						case  'M':
							multilineVars.origMeter = multilineVars.meter = this.setMeter(line.substring(2));
							break;
						case  'P':
							// TODO-PER: There is more to do with parts, but the writer doesn't care.
							if (multilineVars.is_in_header)
								tune.addMetaText("partOrder", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
							else
								multilineVars.partForNextLine = tokenizer.translateString(tokenizer.stripComment(line.substring(2)));
							break;
						case  'Q':
							var tempo = this.setTempo(line, 2, line.length);
							if (tempo.type === 'delaySet') multilineVars.tempo = tempo.tempo;
							else if (tempo.type === 'immediate') tune.metaText.tempo = tempo.tempo;
							break;
						case  'T':
							this.setTitle(line.substring(2));
							break;
						case 'U':
							this.addUserDefinition(line, 2, line.length);
							break;
						case  'V':
							this.parseVoice(line, 2, line.length);
							if (!multilineVars.is_in_header)
								return {newline: true};
							break;
						case  'w':
							return {words: true};
						case 'X':
							break;
						case 'E':
						case 'm':
							warn("Ignored header", line, 0);
							break;
						default:
							// It wasn't a recognized header value, so parse it as music.
							if (nextLine.length)
								nextLine = "\x12" + nextLine;
							//parseRegularMusicLine(line+nextLine);
							//nextLine = "";
							return {regular: true, str: line+nextLine};
					}
				}
				if (nextLine.length > 0)
					return {recurse: true, str: nextLine};
				return {};
			}
		}

		// If we got this far, we have a regular line of mulsic
		return {regular: true, str: line};
	};
}
