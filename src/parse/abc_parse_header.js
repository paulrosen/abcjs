//    abc_parse_header.js: parses a the header fields from a string representing ABC Music Notation into a usable internal structure.

var parseCommon = require('./abc_common');
var parseDirective = require('./abc_parse_directive');
var parseKeyVoice = require('./abc_parse_key_voice');

var ParseHeader = function(tokenizer, warn, multilineVars, tune, tuneBuilder) {
	this.reset = function(tokenizer, warn, multilineVars, tune) {
		parseKeyVoice.initialize(tokenizer, warn, multilineVars, tune, tuneBuilder);
		parseDirective.initialize(tokenizer, warn, multilineVars, tune, tuneBuilder);
	};
	this.reset(tokenizer, warn, multilineVars, tune);

	this.setTitle = function(title, origSize) {
		if (multilineVars.hasMainTitle)
			tuneBuilder.addSubtitle(title, { startChar: multilineVars.iChar, endChar: multilineVars.iChar+origSize+2});	// display secondary title
		else
		{
			tuneBuilder.addMetaText("title", title, { startChar: multilineVars.iChar, endChar: multilineVars.iChar+origSize+2});
			multilineVars.hasMainTitle = true;
		}
	};

	this.setMeter = function(line) {
		line = tokenizer.stripComment(line);
		if (line === 'C') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'common_time'};
		} else if (line === 'C|') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'cut_time'};
		} else if (line === 'o') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'tempus_perfectum'};
		} else if (line === 'c') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'tempus_imperfectum'};
		} else if (line === 'o.') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'tempus_perfectum_prolatio'};
		} else if (line === 'c.') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
			return {type: 'tempus_imperfectum_prolatio'};
		} else if (line.length === 0 || line.toLowerCase() === 'none') {
			if (multilineVars.havent_set_length === true) {
				multilineVars.default_length = 0.125;
				multilineVars.havent_set_length = false;
			}
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
					if (tokens.length === 0) return ret;
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
					var mv = { num: ret.num };
					if (ret.den !== undefined)
						mv.den = ret.den;
					meter.value.push(mv);
					if (tokens.length === 0) break;
					//var tok = tokens.shift();
					//if (tok.token !== '+') throw "Extra characters in M: line";
				}

				if (multilineVars.havent_set_length === true) {
					multilineVars.default_length = totalLength < 0.75 ? 0.0625 : 0.125;
					multilineVars.havent_set_length = false;
				}
				return meter;
			} catch (e) {
				warn(e, line, 0);
			}
		}
		return null;
	};

	this.calcTempo = function(relTempo) {
		var dur = 1/4;
		if (multilineVars.meter && multilineVars.meter.type === 'specified') {
			dur = 1 / parseInt(multilineVars.meter.value[0].den);
		} else if (multilineVars.origMeter && multilineVars.origMeter.type === 'specified') {
			dur = 1 / parseInt(multilineVars.origMeter.value[0].den);
		}
		//var dur = multilineVars.default_length ? multilineVars.default_length : 1;
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

		var before = parseCommon.strip(line.substring(start, equals));
		var after = parseCommon.strip(line.substring(equals+1));

		if (before.length !== 1) {
			warn("Macro definitions can only be one character", line, start);
			return;
		}
		var legalChars = "HIJKLMNOPQRSTUVWXYhijklmnopqrstuvw~";
		if (legalChars.indexOf(before) === -1) {
			warn("Macro definitions must be H-Y, h-w, or tilde", line, start);
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
		var len = line.substring(start, end).replace(/ /g, "");
		var len_arr = len.split('/');
		if (len_arr.length === 2) {
			var n = parseInt(len_arr[0]);
			var d = parseInt(len_arr[1]);
			if (d > 0) {
				multilineVars.default_length = n / d;	// a whole note is 1
				multilineVars.havent_set_length = false;
			}
		} else if (len_arr.length === 1 && len_arr[0] === '1') {
			multilineVars.default_length = 1;
			multilineVars.havent_set_length = false;
		}
	};


	var tempoString = {

		larghissimo: 20,
		adagissimo: 24,
		sostenuto: 28,
		grave: 32,
		largo: 40,
		lento: 50,
		larghetto: 60,
		adagio: 68,
		adagietto: 74,
		andante: 80,
		andantino: 88,
		"marcia moderato": 84,
		"andante moderato": 100,
		moderato: 112,
		allegretto: 116,
		"allegro moderato": 120,
		allegro: 126,
		animato: 132,
		agitato: 140,
		veloce: 148,
		"mosso vivo": 156,
		vivace: 164,
		vivacissimo: 172,
		allegrissimo: 176,
		presto: 184,
		prestissimo: 210,
	};

	this.setTempo = function(line, start, end, iChar) {
		//Q - tempo; can be used to specify the notes per minute, e.g. If
		//the meter denominator is a 4 note then Q:120 or Q:C=120
		//is 120 quarter notes per minute. Similarly  Q:C3=40 would be 40
		//dotted half notes per minute. An absolute tempo may also be
		//set, e.g. Q:1/8=120 is 120 eighth notes per minute,
		//irrespective of the meter's denominator.
		//
		// This is either a number, "C=number", "Cnumber=number", or fraction [fraction...]=number
		// It depends on the M: field, which may either not be present, or may appear after this.
		// If M: is not present, an eighth note is used.
		// That means that this field can't be calculated until the end, if it is the first three types, since we don't know if we'll see an M: field.
		// So, if it is the fourth type, set it here, otherwise, save the info in the multilineVars.
		// The temporary variables we keep are the duration and the bpm. In the first two forms, the duration is 1.
		// In addition, a quoted string may both precede and follow. If a quoted string is present, then the duration part is optional.
		try {
			var tokens = tokenizer.tokenize(line, start, end);

			if (tokens.length === 0) throw "Missing parameter in Q: field";

			var tempo = { startChar: iChar+start-2, endChar: iChar+end };
			var delaySet = true;
			var token = tokens.shift();
			if (token.type === 'quote') {
				tempo.preString = token.token;
				token = tokens.shift();
				if (tokens.length === 0) {	// It's ok to just get a string for the tempo
					// If the string is a well-known tempo, put in the bpm
					if (tempoString[tempo.preString.toLowerCase()]) {
						tempo.bpm = tempoString[tempo.preString.toLowerCase()];
						tempo.suppressBpm = true;
					}
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
			if (multilineVars.printTempo === false)
				tempo.suppress = true;
			return {type: delaySet?'delaySet':'immediate', tempo: tempo};
		} catch (msg) {
			warn(msg, line, start);
			return {type: 'none'};
		}
	};

	this.letter_to_inline_header = function(line, i, startLine)
	{
		var needsNewLine = false
		var ws = tokenizer.eatWhiteSpace(line, i);
		i +=ws;
		if (line.length >= i+5 && line[i] === '[' && line[i+2] === ':') {
			var e = line.indexOf(']', i);
			var startChar = multilineVars.iChar + i;
			var endChar = multilineVars.iChar + e + 1;
			switch(line.substring(i, i+3))
			{
				case "[I:":
					var err = parseDirective.addDirective(line.substring(i+3, e));
					if (err) warn(err, line, i);
					return [ e-i+1+ws ];
				case "[M:":
					var meter = this.setMeter(line.substring(i+3, e));
					if (tuneBuilder.hasBeginMusic() && meter)
						tuneBuilder.appendStartingElement('meter', startChar, endChar, meter);
					else
						multilineVars.meter = meter;
					return [ e-i+1+ws ];
				case "[K:":
					var result = parseKeyVoice.parseKey(line.substring(i+3, e), true);
					if (result.foundClef && tuneBuilder.hasBeginMusic())
						tuneBuilder.appendStartingElement('clef', startChar, endChar, multilineVars.clef);
					if (result.foundKey && tuneBuilder.hasBeginMusic())
						tuneBuilder.appendStartingElement('key', startChar, endChar, parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
					return [ e-i+1+ws ];
				case "[P:":
					var part = parseDirective.parseFontChangeLine(line.substring(i+3, e))
					if (startLine || tune.lines.length <= tune.lineNum)
						multilineVars.partForNextLine = { title: part, startChar: startChar, endChar: endChar };
					else
						tuneBuilder.appendElement('part', startChar, endChar, {title: part});
					return [ e-i+1+ws ];
				case "[L:":
					this.setDefaultLength(line, i+3, e);
					return [ e-i+1+ws ];
				case "[Q:":
					if (e > 0) {
						var tempo = this.setTempo(line, i+3, e, multilineVars.iChar);
						if (tempo.type === 'delaySet') {
							if (tuneBuilder.hasBeginMusic())
								tuneBuilder.appendElement('tempo', startChar, endChar, this.calcTempo(tempo.tempo));
							else
								multilineVars.tempoForNextLine = ['tempo', startChar, endChar, this.calcTempo(tempo.tempo)]
						} else if (tempo.type === 'immediate') {
							if (!startLine && tuneBuilder.hasBeginMusic())
								tuneBuilder.appendElement('tempo', startChar, endChar, tempo.tempo);
							else
								multilineVars.tempoForNextLine = ['tempo', startChar, endChar, tempo.tempo]
						}
						return [ e-i+1+ws, line[i+1], line.substring(i+3, e)];
					}
					break;
				case "[V:":
					if (e > 0) {
						needsNewLine = parseKeyVoice.parseVoice(line, i+3, e);
						//startNewLine();
						return [ e-i+1+ws, line[i+1], line.substring(i+3, e), needsNewLine];
					}
					break;
				case "[r:":
					return [ e-i+1+ws ];

				default:
					// TODO: complain about unhandled header
			}
		}
		return [ 0 ];
	};

	this.letter_to_body_header = function(line, i)
	{
		var needsNewLine = false
		if (line.length >= i+3) {
			switch(line.substring(i, i+2))
			{
				case "I:":
					var err = parseDirective.addDirective(line.substring(i+2));
					if (err) warn(err, line, i);
					return [ line.length ];
				case "M:":
					var meter = this.setMeter(line.substring(i+2));
					if (tuneBuilder.hasBeginMusic() && meter)
						tuneBuilder.appendStartingElement('meter', multilineVars.iChar + i, multilineVars.iChar + line.length, meter);
					return [ line.length ];
				case "K:":
					var result = parseKeyVoice.parseKey(line.substring(i+2), tuneBuilder.hasBeginMusic());
					if (result.foundClef && tuneBuilder.hasBeginMusic())
						tuneBuilder.appendStartingElement('clef', multilineVars.iChar + i, multilineVars.iChar + line.length, multilineVars.clef);
					if (result.foundKey && tuneBuilder.hasBeginMusic())
						tuneBuilder.appendStartingElement('key', multilineVars.iChar + i, multilineVars.iChar + line.length, parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
					return [ line.length ];
				case "P:":
					if (tuneBuilder.hasBeginMusic())
						tuneBuilder.appendElement('part', multilineVars.iChar + i, multilineVars.iChar + line.length, {title: line.substring(i+2)});
					return [ line.length ];
				case "L:":
					this.setDefaultLength(line, i+2, line.length);
					return [ line.length ];
				case "Q:":
					var e = line.indexOf('\x12', i+2);
					if (e === -1) e = line.length;
					var tempo = this.setTempo(line, i+2, e, multilineVars.iChar);
					if (tempo.type === 'delaySet') tuneBuilder.appendElement('tempo', multilineVars.iChar + i, multilineVars.iChar + line.length, this.calcTempo(tempo.tempo));
					else if (tempo.type === 'immediate') tuneBuilder.appendElement('tempo', multilineVars.iChar + i, multilineVars.iChar + line.length, tempo.tempo);
				return [ e, line[i], parseCommon.strip(line.substring(i+2))];
				case "V:":
					needsNewLine = parseKeyVoice.parseVoice(line, i+2, line.length);
//						startNewLine();
					return [ line.length, line[i], parseCommon.strip(line.substring(i+2)), needsNewLine];
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
		var field = metaTextHeaders[line[0]];
		var origSize = line.length-2
		var restOfLine = tokenizer.translateString(tokenizer.stripComment(line.substring(2)))
		if (field === 'unalignedWords' || field === 'notes') {
			// These fields can be multi-line
			tuneBuilder.addMetaTextArray(field, parseDirective.parseFontChangeLine(restOfLine), { startChar: multilineVars.iChar, endChar: multilineVars.iChar+line.length});
		} else if (field !== undefined) {
			// these fields are single line
			tuneBuilder.addMetaText(field, parseDirective.parseFontChangeLine(restOfLine), { startChar: multilineVars.iChar, endChar: multilineVars.iChar+line.length});
		} else {
			var startChar = multilineVars.iChar;
			var endChar = startChar + line.length;
			switch(line[0])
			{
				case  'H':
					// History is a little different because once it starts it continues until another header field is encountered
					tuneBuilder.addMetaTextArray("history", parseDirective.parseFontChangeLine(restOfLine), { startChar: multilineVars.iChar, endChar: multilineVars.iChar+line.length});
					line = tokenizer.peekLine()
					while (line && line[1] !== ':') {
						tokenizer.nextLine()
						tuneBuilder.addMetaTextArray("history", parseDirective.parseFontChangeLine(tokenizer.translateString(tokenizer.stripComment(line))), { startChar: multilineVars.iChar, endChar: multilineVars.iChar+line.length});
						line = tokenizer.peekLine()
					}
					break;
				case  'K':
					// since the key is the last thing that can happen in the header, we can resolve the tempo now
					this.resolveTempo();
					var result = parseKeyVoice.parseKey(line.substring(2), false);
					if (!multilineVars.is_in_header && tuneBuilder.hasBeginMusic()) {
						if (result.foundClef)
							tuneBuilder.appendStartingElement('clef', startChar, endChar, multilineVars.clef);
						if (result.foundKey)
							tuneBuilder.appendStartingElement('key', startChar, endChar, parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
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
						tuneBuilder.addMetaText("partOrder", parseDirective.parseFontChangeLine(restOfLine), { startChar: multilineVars.iChar, endChar: multilineVars.iChar+line.length});
					else
						multilineVars.partForNextLine = { title: restOfLine, startChar: startChar, endChar: endChar};
					break;
				case  'Q':
					var tempo = this.setTempo(line, 2, line.length, multilineVars.iChar);
					if (tempo.type === 'delaySet') multilineVars.tempo = tempo.tempo;
					else if (tempo.type === 'immediate') {
						if (!tune.metaText.tempo)
							tune.metaText.tempo = tempo.tempo;
						else
							multilineVars.tempoForNextLine = ['tempo', startChar, endChar, tempo.tempo]
					}
					break;
				case  'T':
					if (multilineVars.titlecaps)
						restOfLine = restOfLine.toUpperCase();		
					this.setTitle(parseDirective.parseFontChangeLine(tokenizer.theReverser(restOfLine)), origSize);
					break;
				case 'U':
					this.addUserDefinition(line, 2, line.length);
					break;
				case  'V':
					parseKeyVoice.parseVoice(line, 2, line.length);
					if (!multilineVars.is_in_header)
						return {newline: true};
					break;
				case  's':
					return {symbols: true};
				case  'w':
					return {words: true};
				case 'X':
					break;
				case 'E':
				case 'm':
					warn("Ignored header", line, 0);
					break;
				default:
					return {regular: true};
			}
		}
		return {};
	};
};

module.exports = ParseHeader;
