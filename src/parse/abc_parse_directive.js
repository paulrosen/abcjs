/*global window */

var parseCommon = require('./abc_common');

var parseDirective = {};

(function() {
	"use strict";
	var tokenizer;
	var warn;
	var multilineVars;
	var tune;
	parseDirective.initialize = function(tokenizer_, warn_, multilineVars_, tune_) {
		tokenizer = tokenizer_;
		warn = warn_;
		multilineVars = multilineVars_;
		tune = tune_;
		initializeFonts();
	};

	function initializeFonts() {
		multilineVars.annotationfont  = { face: "Helvetica", size: 12, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.gchordfont  = { face: "Helvetica", size: 12, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.historyfont  = { face: "\"Times New Roman\"", size: 16, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.infofont  = { face: "\"Times New Roman\"", size: 14, weight: "normal", style: "italic", decoration: "none" };
		multilineVars.measurefont  = { face: "\"Times New Roman\"", size: 14, weight: "normal", style: "italic", decoration: "none" };
		multilineVars.partsfont  = { face: "\"Times New Roman\"", size: 15, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.repeatfont  = { face: "\"Times New Roman\"", size: 13, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.textfont  = { face: "\"Times New Roman\"", size: 16, weight: "normal", style: "normal", decoration: "none" };
		multilineVars.tripletfont = {face: "Times", size: 11, weight: "normal", style: "italic", decoration: "none"};
		multilineVars.vocalfont  = { face: "\"Times New Roman\"", size: 13, weight: "bold", style: "normal", decoration: "none" };
		multilineVars.wordsfont  = { face: "\"Times New Roman\"", size: 16, weight: "normal", style: "normal", decoration: "none" };

		// These fonts are global for the entire tune.
		tune.formatting.composerfont  = { face: "\"Times New Roman\"", size: 14, weight: "normal", style: "italic", decoration: "none" };
		tune.formatting.subtitlefont  = { face: "\"Times New Roman\"", size: 16, weight: "normal", style: "normal", decoration: "none" };
		tune.formatting.tempofont  = { face: "\"Times New Roman\"", size: 15, weight: "bold", style: "normal", decoration: "none" };
		tune.formatting.titlefont  = { face: "\"Times New Roman\"", size: 20, weight: "normal", style: "normal", decoration: "none" };
		tune.formatting.footerfont  = { face: "\"Times New Roman\"", size: 12, weight: "normal", style: "normal", decoration: "none" };
		tune.formatting.headerfont  = { face: "\"Times New Roman\"", size: 12, weight: "normal", style: "normal", decoration: "none" };
		tune.formatting.voicefont  = { face: "\"Times New Roman\"", size: 13, weight: "bold", style: "normal", decoration: "none" };

		// these are the default fonts for these element types. In the printer, these fonts might change as the tune progresses.
		tune.formatting.annotationfont  = multilineVars.annotationfont;
		tune.formatting.gchordfont  = multilineVars.gchordfont;
		tune.formatting.historyfont  = multilineVars.historyfont;
		tune.formatting.infofont  = multilineVars.infofont;
		tune.formatting.measurefont  = multilineVars.measurefont;
		tune.formatting.partsfont  = multilineVars.partsfont;
		tune.formatting.repeatfont  = multilineVars.repeatfont;
		tune.formatting.textfont  = multilineVars.textfont;
		tune.formatting.tripletfont  = multilineVars.tripletfont;
		tune.formatting.vocalfont  = multilineVars.vocalfont;
		tune.formatting.wordsfont  = multilineVars.wordsfont;
	}

	var fontTypeCanHaveBox = { gchordfont: true, measurefont: true, partsfont: true };

	var fontTranslation = function(fontFace) {
		// This translates Postscript fonts for a web alternative.
		// Note that the postscript fonts contain italic and bold info in them, so what is returned is a hash.

		switch (fontFace) {
			case "Arial-Italic":
				return { face: "Arial", weight: "normal", style: "italic", decoration: "none" };
			case "Arial-Bold":
				return { face: "Arial", weight: "bold", style: "normal", decoration: "none" };
			case "Bookman-Demi":
				return { face: "Bookman,serif", weight: "bold", style: "normal", decoration: "none" };
			case "Bookman-DemiItalic":
				return { face: "Bookman,serif", weight: "bold", style: "italic", decoration: "none" };
			case "Bookman-Light":
				return { face: "Bookman,serif", weight: "normal", style: "normal", decoration: "none" };
			case "Bookman-LightItalic":
				return { face: "Bookman,serif", weight: "normal", style: "italic", decoration: "none" };
			case "Courier":
				return { face: "\"Courier New\"", weight: "normal", style: "normal", decoration: "none" };
			case "Courier-Oblique":
				return { face: "\"Courier New\"", weight: "normal", style: "italic", decoration: "none" };
			case "Courier-Bold":
				return { face: "\"Courier New\"", weight: "bold", style: "normal", decoration: "none" };
			case "Courier-BoldOblique":
				return { face: "\"Courier New\"", weight: "bold", style: "italic", decoration: "none" };
			case "AvantGarde-Book":
				return { face: "AvantGarde,Arial", weight: "normal", style: "normal", decoration: "none" };
			case "AvantGarde-BookOblique":
				return { face: "AvantGarde,Arial", weight: "normal", style: "italic", decoration: "none" };
			case "AvantGarde-Demi":
			case "Avant-Garde-Demi":
				return { face: "AvantGarde,Arial", weight: "bold", style: "normal", decoration: "none" };
			case "AvantGarde-DemiOblique":
				return { face: "AvantGarde,Arial", weight: "bold", style: "italic", decoration: "none" };
			case "Helvetica-Oblique":
				return { face: "Helvetica", weight: "normal", style: "italic", decoration: "none" };
			case "Helvetica-Bold":
				return { face: "Helvetica", weight: "bold", style: "normal", decoration: "none" };
			case "Helvetica-BoldOblique":
				return { face: "Helvetica", weight: "bold", style: "italic", decoration: "none" };
			case "Helvetica-Narrow":
				return { face: "\"Helvetica Narrow\",Helvetica", weight: "normal", style: "normal", decoration: "none" };
			case "Helvetica-Narrow-Oblique":
				return { face: "\"Helvetica Narrow\",Helvetica", weight: "normal", style: "italic", decoration: "none" };
			case "Helvetica-Narrow-Bold":
				return { face: "\"Helvetica Narrow\",Helvetica", weight: "bold", style: "normal", decoration: "none" };
			case "Helvetica-Narrow-BoldOblique":
				return { face: "\"Helvetica Narrow\",Helvetica", weight: "bold", style: "italic", decoration: "none" };
			case "Palatino-Roman":
				return { face: "Palatino", weight: "normal", style: "normal", decoration: "none" };
			case "Palatino-Italic":
				return { face: "Palatino", weight: "normal", style: "italic", decoration: "none" };
			case "Palatino-Bold":
				return { face: "Palatino", weight: "bold", style: "normal", decoration: "none" };
			case "Palatino-BoldItalic":
				return { face: "Palatino", weight: "bold", style: "italic", decoration: "none" };
			case "NewCenturySchlbk-Roman":
				return { face: "\"New Century\",serif", weight: "normal", style: "normal", decoration: "none" };
			case "NewCenturySchlbk-Italic":
				return { face: "\"New Century\",serif", weight: "normal", style: "italic", decoration: "none" };
			case "NewCenturySchlbk-Bold":
				return { face: "\"New Century\",serif", weight: "bold", style: "normal", decoration: "none" };
			case "NewCenturySchlbk-BoldItalic":
				return { face: "\"New Century\",serif", weight: "bold", style: "italic", decoration: "none" };
			case "Times":
			case "Times-Roman":
			case "Times-Narrow":
			case "Times-Courier":
			case "Times-New-Roman":
				return { face: "\"Times New Roman\"", weight: "normal", style: "normal", decoration: "none" };
			case "Times-Italic":
			case "Times-Italics":
				return { face: "\"Times New Roman\"", weight: "normal", style: "italic", decoration: "none" };
			case "Times-Bold":
				return { face: "\"Times New Roman\"", weight: "bold", style: "normal", decoration: "none" };
			case "Times-BoldItalic":
				return { face: "\"Times New Roman\"", weight: "bold", style: "italic", decoration: "none" };
			case "ZapfChancery-MediumItalic":
				return { face: "\"Zapf Chancery\",cursive,serif", weight: "normal", style: "normal", decoration: "none" };
			default:
				return null;
		}
	};

	var getFontParameter = function(tokens, currentSetting, str, position, cmd) {
		// Every font parameter has the following format:
		// <face> <utf8> <size> <modifiers> <box>
		// Where:
		// face: either a standard web font name, or a postscript font, enumerated in fontTranslation. This could also be an * or be missing if the face shouldn't change.
		// utf8: This is optional, and specifies utf8. That's all that is supported so the field is just silently ignored.
		// size: The size, in pixels. This may be omitted if the size is not changing.
		// modifiers: zero or more of "bold", "italic", "underline"
		// box: Only applies to the measure numbers, gchords, and the parts. If present, then a box is drawn around the characters.
		// If face is present, then all the modifiers are cleared. If face is absent, then the modifiers are illegal.
		// The face can be a single word, a set of words separated by hyphens, or a quoted string.
		//
		// So, in practicality, there are three types of font definitions: a number only, an asterisk and a number only, or the full definition (with an optional size).
		function processNumberOnly() {
			var size = parseInt(tokens[0].token);
			tokens.shift();
			if (!currentSetting) {
				warn("Can't set just the size of the font since there is no default value.", str, position);
				return { face: "\"Times New Roman\"", weight: "normal", style: "normal", decoration: "none", size: size};
			}
			if (tokens.length === 0) {
				return { face: currentSetting.face, weight: currentSetting.weight, style: currentSetting.style, decoration: currentSetting.decoration, size: size};
			}
			if (tokens.length === 1 && tokens[0].token === "box" && fontTypeCanHaveBox[cmd])
				return { face: currentSetting.face, weight: currentSetting.weight, style: currentSetting.style, decoration: currentSetting.decoration, size: size, box: true};
			warn("Extra parameters in font definition.", str, position);
			return { face: currentSetting.face, weight: currentSetting.weight, style: currentSetting.style, decoration: currentSetting.decoration, size: size};
		}

		// format 1: asterisk and number only
		if (tokens[0].token === '*') {
			tokens.shift();
			if (tokens[0].type === 'number')
				return processNumberOnly();
			else {
				warn("Expected font size number after *.", str, position);
			}
		}

		// format 2: number only
		if (tokens[0].type === 'number') {
			return processNumberOnly();
		}

		// format 3: whole definition
		var face = [];
		var size;
		var weight = "normal";
		var style = "normal";
		var decoration = "none";
		var box = false;
		var state = 'face';
		var hyphenLast = false;
		while (tokens.length) {
			var currToken = tokens.shift();
			var word = currToken.token.toLowerCase();
			switch (state) {
				case 'face':
					if (hyphenLast || (word !== 'utf' && currToken.type !== 'number' && word !== "bold" && word !== "italic" && word !== "underline" && word !== "box")) {
						if (face.length > 0 && currToken.token === '-') {
							hyphenLast = true;
							face[face.length-1] = face[face.length-1] + currToken.token;
						}
						else {
							if (hyphenLast) {
								hyphenLast = false;
								face[face.length-1] = face[face.length-1] + currToken.token;
							} else
								face.push(currToken.token);
						}
					} else {
						if (currToken.type === 'number') {
							if (size) {
								warn("Font size specified twice in font definition.", str, position);
							} else {
								size = currToken.token;
							}
							state = 'modifier';
						} else if (word === "bold")
							weight = "bold";
						else if (word === "italic")
							style = "italic";
						else if (word === "underline")
							decoration = "underline";
						else if (word === "box") {
							if (fontTypeCanHaveBox[cmd])
								box = true;
							else
								warn("This font style doesn't support \"box\"", str, position);
							state = "finished";
						} else if (word === "utf") {
							currToken = tokens.shift(); // this gets rid of the "8" after "utf"
							state = "size";
						} else
							warn("Unknown parameter " + currToken.token + " in font definition.", str, position);
					}
					break;
				case "size":
					if (currToken.type === 'number') {
						if (size) {
							warn("Font size specified twice in font definition.", str, position);
						} else {
							size = currToken.token;
						}
					} else {
						warn("Expected font size in font definition.", str, position);
					}
					state = 'modifier';
					break;
				case "modifier":
					if (word === "bold")
						weight = "bold";
					else if (word === "italic")
						style = "italic";
					else if (word === "underline")
						decoration = "underline";
					else if (word === "box") {
						if (fontTypeCanHaveBox[cmd])
							box = true;
						else
							warn("This font style doesn't support \"box\"", str, position);
						state = "finished";
					} else
						warn("Unknown parameter " + currToken.token + " in font definition.", str, position);
					break;
				case "finished":
					warn("Extra characters found after \"box\" in font definition.", str, position);
					break;
			}
		}

		if (size === undefined) {
			if (!currentSetting) {
				warn("Must specify the size of the font since there is no default value.", str, position);
				size = 12;
			} else
				size = currentSetting.size;
		} else
			size = parseFloat(size);

		face = face.join(' ');
		var psFont = fontTranslation(face);
		var font = {};
		if (psFont) {
			font.face = psFont.face;
			font.weight = psFont.weight;
			font.style = psFont.style;
			font.decoration = psFont.decoration;
			font.size = size;
			if (box)
				font.box = true;
			return font;
		}
		font.face = face;
		font.weight = weight;
		font.style = style;
		font.decoration = decoration;
		font.size = size;
		if (box)
			font.box = true;
		return font;
	};

	var getChangingFont = function(cmd, tokens, str) {
		if (tokens.length === 0)
			return "Directive \"" + cmd + "\" requires a font as a parameter.";
		multilineVars[cmd] = getFontParameter(tokens, multilineVars[cmd], str, 0, cmd);
		if (multilineVars.is_in_header) // If the font appears in the header, then it becomes the default font.
			tune.formatting[cmd] = multilineVars[cmd];
		return null;
	};
	var getGlobalFont = function(cmd, tokens, str) {
		if (tokens.length === 0)
			return "Directive \"" + cmd + "\" requires a font as a parameter.";
		tune.formatting[cmd] = getFontParameter(tokens, tune.formatting[cmd], str, 0, cmd);
		return null;
	};

	var setScale = function(cmd, tokens) {
		var scratch = "";
		parseCommon.each(tokens, function(tok) {
			scratch += tok.token;
		});
		var num = parseFloat(scratch);
		if (isNaN(num) || num === 0)
			return "Directive \"" + cmd + "\" requires a number as a parameter.";
		tune.formatting.scale = num;

	};

	var getRequiredMeasurement = function(cmd, tokens) {
		var points = tokenizer.getMeasurement(tokens);
		if (points.used === 0 || tokens.length !== 0)
			return { error: "Directive \"" + cmd + "\" requires a measurement as a parameter."};
		return points.value;
	};
	var oneParameterMeasurement = function(cmd, tokens) {
		var points = tokenizer.getMeasurement(tokens);
		if (points.used === 0 || tokens.length !== 0)
			return "Directive \"" + cmd + "\" requires a measurement as a parameter.";
		tune.formatting[cmd] = points.value;
		return null;
	};

	var addMultilineVar = function(key, cmd, tokens, min, max) {
		if (tokens.length !== 1 || tokens[0].type !== 'number')
			return "Directive \"" + cmd + "\" requires a number as a parameter.";
		var i = tokens[0].intt;
		if (min !== undefined && i < min)
			return "Directive \"" + cmd + "\" requires a number greater than or equal to " + min + " as a parameter.";
		if (max !== undefined && i > max)
			return "Directive \"" + cmd + "\" requires a number less than or equal to " + max + " as a parameter.";
		multilineVars[key] = i;
		return null;
	};

	var addMultilineVarBool = function(key, cmd, tokens) {
		var str = addMultilineVar(key, cmd, tokens, 0, 1);
		if (str !== null) return str;
		multilineVars[key] = (multilineVars[key] === 1);
		return null;
	};

	var addMultilineVarOneParamChoice = function(key, cmd, tokens, choices) {
		if (tokens.length !== 1)
			return "Directive \"" + cmd + "\" requires one of [ " + choices.join(", ") + " ] as a parameter.";
		var choice = tokens[0].token;
		var found = false;
		for (var i = 0; !found && i < choices.length; i++) {
			if (choices[i] === choice)
				found = true;
		}
		if (!found)
			return "Directive \"" + cmd + "\" requires one of [ " + choices.join(", ") + " ] as a parameter.";
		multilineVars[key] = choice;
		return null;
	};

	var midiCmdParam0 = [
		"nobarlines",
		"barlines",
		"beataccents",
		"nobeataccents",
		"droneon",
		"droneoff",
		"drumon",
		"drumoff",
		"fermatafixed",
		"fermataproportional",
		"gchordon",
		"gchordoff",
		"controlcombo",
		"temperamentnormal",
		"noportamento"
	];
	var midiCmdParam1String = [
		"gchord",
		"ptstress",
		"beatstring"
	];
	var midiCmdParam1Integer = [
		"bassvol",
		"chordvol",
		"c",
		"channel",
		"beatmod",
		"deltaloudness",
		"drumbars",
		"gracedivider",
		"makechordchannels",
		"randomchordattack",
		"chordattack",
		"stressmodel",
		"transpose",
		"rtranspose",
		"volinc"
	];
	var midiCmdParam1Integer1OptionalInteger = [
		"program"
	];
	var midiCmdParam2Integer = [
		"ratio",
		"snt",
		"bendvelocity",
		"pitchbend",
		"control",
		"temperamentlinear"
	];
	var midiCmdParam4Integer = [
		"beat"
	];
	var midiCmdParam5Integer = [
		"drone"
	];
	var midiCmdParam1IntegerOptionalOctave = [
		"bassprog",
		"chordprog"
	];
	var midiCmdParam1String1Integer = [
		"portamento"
	];
	var midiCmdParamFraction = [
		"expand",
		"grace",
		"trim"
	];
	var midiCmdParam1StringVariableIntegers = [
		"drum",
		"chordname"
	];

	var parseMidiCommand = function(midi, tune, restOfString) {
		var midi_cmd = midi.shift().token;
		var midi_params = [];
		if (midiCmdParam0.indexOf(midi_cmd) >= 0) {
			// NO PARAMETERS
			if (midi.length !== 0)
				warn("Unexpected parameter in MIDI " + midi_cmd, restOfString, 0);
		} else if (midiCmdParam1String.indexOf(midi_cmd) >= 0) {
			// ONE STRING PARAMETER
			if (midi.length !== 1)
				warn("Expected one parameter in MIDI " + midi_cmd, restOfString, 0);
			else
				midi_params.push(midi[0].token);
		} else if (midiCmdParam1Integer.indexOf(midi_cmd) >= 0) {
			// ONE INT PARAMETER
			if (midi.length !== 1)
				warn("Expected one parameter in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number")
				warn("Expected one integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else
				midi_params.push(midi[0].intt);
		} else if (midiCmdParam1Integer1OptionalInteger.indexOf(midi_cmd) >= 0) {
			// ONE INT PARAMETER, ONE OPTIONAL PARAMETER
			if (midi.length !== 1 && midi.length !== 2)
				warn("Expected one or two parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number")
				warn("Expected integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else if (midi.length === 2 && midi[1].type !== "number")
				warn("Expected integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].intt);
				if (midi.length === 2)
					midi_params.push(midi[1].intt);
			}
		} else if (midiCmdParam2Integer.indexOf(midi_cmd) >= 0) {
			// TWO INT PARAMETERS
			if (midi.length !== 2)
				warn("Expected two parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number" || midi[1].type !== "number")
				warn("Expected two integer parameters in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].intt);
				midi_params.push(midi[1].intt);
			}
		} else if (midiCmdParam1String1Integer.indexOf(midi_cmd) >= 0) {
			// ONE STRING PARAMETER, ONE INT PARAMETER
			if (midi.length !== 2)
				warn("Expected two parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "alpha" || midi[1].type !== "number")
				warn("Expected one string and one integer parameters in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].token);
				midi_params.push(midi[1].intt);
			}
		} else if (midi_cmd === 'drummap') {
			// BUILD AN OBJECT OF ABC NOTE => MIDI NOTE
			if (midi.length === 2 && midi[0].type === 'alpha' && midi[1].type === 'number') {
				if (!tune.formatting) tune.formatting = {};
				if (!tune.formatting.midi) tune.formatting.midi = {};
				if (!tune.formatting.midi.drummap) tune.formatting.midi.drummap = {};
				tune.formatting.midi.drummap[midi[0].token] = midi[1].intt;
				midi_params = tune.formatting.midi.drummap;
			} else if (midi.length === 3 && midi[0].type === 'punct' && midi[1].type === 'alpha' && midi[2].type === 'number') {
				if (!tune.formatting) tune.formatting = {};
				if (!tune.formatting.midi) tune.formatting.midi = {};
				if (!tune.formatting.midi.drummap) tune.formatting.midi.drummap = {};
				tune.formatting.midi.drummap[midi[0].token+midi[1].token] = midi[2].intt;
				midi_params = tune.formatting.midi.drummap;
			} else {
				warn("Expected one note name and one integer parameter in MIDI " + midi_cmd, restOfString, 0);
			}
		} else if (midiCmdParamFraction.indexOf(midi_cmd) >= 0) {
			// ONE FRACTION PARAMETER
			if (midi.length !== 3)
				warn("Expected fraction parameter in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number" || midi[1].token !== "/" || midi[2].type !== "number")
				warn("Expected fraction parameter in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].intt);
				midi_params.push(midi[2].intt);
			}
		} else if (midiCmdParam4Integer.indexOf(midi_cmd) >= 0) {
			// FOUR INT PARAMETERS
			if (midi.length !== 4)
				warn("Expected four parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number" || midi[1].type !== "number" || midi[2].type !== "number" || midi[3].type !== "number")
				warn("Expected four integer parameters in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].intt);
				midi_params.push(midi[1].intt);
				midi_params.push(midi[2].intt);
				midi_params.push(midi[3].intt);
			}
		} else if (midiCmdParam5Integer.indexOf(midi_cmd) >= 0) {
			// FIVE INT PARAMETERS
			if (midi.length !== 5)
				warn("Expected five parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number" || midi[1].type !== "number" || midi[2].type !== "number" || midi[3].type !== "number" || midi[4].type !== "number")
				warn("Expected five integer parameters in MIDI " + midi_cmd, restOfString, 0);
			else {
				midi_params.push(midi[0].intt);
				midi_params.push(midi[1].intt);
				midi_params.push(midi[2].intt);
				midi_params.push(midi[3].intt);
				midi_params.push(midi[4].intt);
			}
		} else if (midiCmdParam1Integer1OptionalInteger.indexOf(midi_cmd) >= 0) {
			// ONE INT PARAMETER, ONE OPTIONAL OCTAVE PARAMETER
			if (midi.length !== 1 || midi.length !== 4)
				warn("Expected one or two parameters in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "number")
				warn("Expected integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else if (midi.length === 4) {
				if (midi[1].token !== "octave")
					warn("Expected octave parameter in MIDI " + midi_cmd, restOfString, 0);
				if (midi[2].token !== "=")
					warn("Expected octave parameter in MIDI " + midi_cmd, restOfString, 0);
				if (midi[3].type !== "number")
					warn("Expected integer parameter for octave in MIDI " + midi_cmd, restOfString, 0);
			} else {
				midi_params.push(midi[0].intt);
				if (midi.length === 4)
					midi_params.push(midi[3].intt);
			}
		} else if (midiCmdParam1StringVariableIntegers.indexOf(midi_cmd) >= 0) {
			// ONE STRING, VARIABLE INT PARAMETERS
			if (midi.length < 2)
				warn("Expected string parameter and at least one integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else if (midi[0].type !== "alpha")
				warn("Expected string parameter and at least one integer parameter in MIDI " + midi_cmd, restOfString, 0);
			else {
				var p = midi.shift();
				midi_params.push(p.token);
				while (midi.length > 0) {
					p = midi.shift();
					if (p.type !== "number")
						warn("Expected integer parameter in MIDI " + midi_cmd, restOfString, 0);
					midi_params.push(p.intt);
				}
			}
		}

		if (tune.hasBeginMusic())
			tune.appendElement('midi', -1, -1, { cmd: midi_cmd, params: midi_params });
		else {
			if (tune.formatting['midi'] === undefined)
				tune.formatting['midi'] = {};
			tune.formatting['midi'][midi_cmd] = midi_params;
		}
	};

	parseDirective.parseFontChangeLine = function(textstr) {
		var textParts = textstr.split('$');
		if (textParts.length > 1 && multilineVars.setfont) {
			var textarr = [ { text: textParts[0] }];
			for (var i = 1; i < textParts.length; i++) {
				if (textParts[i].charAt(0) === '0')
					textarr.push({ text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '1' && multilineVars.setfont[1])
					textarr.push({font: multilineVars.setfont[1], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '2' && multilineVars.setfont[2])
					textarr.push({font: multilineVars.setfont[2], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '3' && multilineVars.setfont[3])
					textarr.push({font: multilineVars.setfont[3], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '4' && multilineVars.setfont[4])
					textarr.push({font: multilineVars.setfont[4], text: textParts[i].substring(1) });
				else
					textarr[textarr.length-1].text += '$' + textParts[i];
			}
			if (textarr.length > 1)
				return textarr;
		}
		return textstr;
	};

	var positionChoices = [ 'auto', 'above', 'below', 'hidden' ];
	parseDirective.addDirective = function(str) {
		var tokens = tokenizer.tokenize(str, 0, str.length);	// 3 or more % in a row, or just spaces after %% is just a comment
		if (tokens.length === 0 || tokens[0].type !== 'alpha') return null;
		var restOfString = str.substring(str.indexOf(tokens[0].token)+tokens[0].token.length);
		restOfString = tokenizer.stripComment(restOfString);
		var cmd = tokens.shift().token.toLowerCase();
		var scratch = "";
		switch (cmd)
		{
			// The following directives were added to abc_parser_lint, but haven't been implemented here.
			// Most of them are direct translations from the directives that will be parsed in. See abcm2ps's format.txt for info on each of these.
			//					alignbars: { type: "number", optional: true },
			//					aligncomposer: { type: "string", Enum: [ 'left', 'center','right' ], optional: true },
			//					bstemdown: { type: "boolean", optional: true },
			//					continueall: { type: "boolean", optional: true },
			//					dynalign: { type: "boolean", optional: true },
			//					exprabove: { type: "boolean", optional: true },
			//					exprbelow: { type: "boolean", optional: true },
			//					gchordbox: { type: "boolean", optional: true },
			//					graceslurs: { type: "boolean", optional: true },
			//					gracespacebefore: { type: "number", optional: true },
			//					gracespaceinside: { type: "number", optional: true },
			//					gracespaceafter: { type: "number", optional: true },
			//					infospace: { type: "number", optional: true },
			//					lineskipfac: { type: "number", optional: true },
			//					maxshrink: { type: "number", optional: true },
			//					maxstaffsep: { type: "number", optional: true },
			//					maxsysstaffsep: { type: "number", optional: true },
			//					notespacingfactor: { type: "number", optional: true },
			//					parskipfac: { type: "number", optional: true },
			//					slurheight: { type: "number", optional: true },
			//					splittune: { type: "boolean", optional: true },
			//					squarebreve: { type: "boolean", optional: true },
			//					stemheight: { type: "number", optional: true },
			//					straightflags: { type: "boolean", optional: true },
			//					stretchstaff: { type: "boolean", optional: true },
			//					titleformat: { type: "string", optional: true },
			case "bagpipes":tune.formatting.bagpipes = true;break;
			case "flatbeams":tune.formatting.flatbeams = true;break;
			case "landscape":multilineVars.landscape = true;break;
			case "papersize":multilineVars.papersize = restOfString;break;
			case "slurgraces":tune.formatting.slurgraces = true;break;
			case "stretchlast":tune.formatting.stretchlast = true;break;
			case "titlecaps":multilineVars.titlecaps = true;break;
			case "titleleft":tune.formatting.titleleft = true;break;
			case "measurebox":tune.formatting.measurebox = true;break;

			case "vocal": return addMultilineVarOneParamChoice("vocalPosition", cmd, tokens, positionChoices);
			case "dynamic": return addMultilineVarOneParamChoice("dynamicPosition", cmd, tokens, positionChoices);
			case "gchord": return addMultilineVarOneParamChoice("chordPosition", cmd, tokens, positionChoices);
			case "ornament": return addMultilineVarOneParamChoice("ornamentPosition", cmd, tokens, positionChoices);
			case "volume": return addMultilineVarOneParamChoice("volumePosition", cmd, tokens, positionChoices);

			case "botmargin":
			case "botspace":
			case "composerspace":
			case "indent":
			case "leftmargin":
			case "linesep":
			case "musicspace":
			case "partsspace":
			case "pageheight":
			case "pagewidth":
			case "rightmargin":
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
			case "voicescale":
				if (tokens.length !== 1 || tokens[0].type !== 'number')
					return "voicescale requires one float as a parameter";
				var voiceScale = tokens.shift();
				if (multilineVars.currentVoice) {
					multilineVars.currentVoice.scale = voiceScale.floatt;
					tune.changeVoiceScale(multilineVars.currentVoice.scale);
				}
				return null;
			case "vskip":
				var vskip = getRequiredMeasurement(cmd, tokens);
				if (vskip.error)
					return vskip.error;
				tune.addSpacing(vskip);
				return null;
			case "scale":
				setScale(cmd, tokens);
				break;
			case "sep":
				if (tokens.length === 0)
					tune.addSeparator();
				else {
					var points = tokenizer.getMeasurement(tokens);
					if (points.used === 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var spaceAbove = points.value;

					points = tokenizer.getMeasurement(tokens);
					if (points.used === 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var spaceBelow = points.value;

					points = tokenizer.getMeasurement(tokens);
					if (points.used === 0 || tokens.length !== 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var lenLine = points.value;
					tune.addSeparator(spaceAbove, spaceBelow, lenLine);
				}
				break;
			case "barsperstaff":
				scratch = addMultilineVar('barsperstaff', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "staffnonote":
				// The sense of the boolean is opposite here. "0" means true.
				if (tokens.length !== 1)
					return "Directive staffnonote requires one parameter: 0 or 1";
				if (tokens[0].token === '0')
					multilineVars.staffnonote = true;
				else if (tokens[0].token === '1')
					multilineVars.staffnonote = false;
				else
					return "Directive staffnonote requires one parameter: 0 or 1 (received " + tokens[0].token + ')';
				break;
			case "printtempo":
				scratch = addMultilineVarBool('printTempo', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "partsbox":
				scratch = addMultilineVarBool('partsBox', cmd, tokens);
				if (scratch !== null) return scratch;
				multilineVars.partsfont.box = multilineVars.partsBox;
				break;
			case "measurenb":
			case "barnumbers":
				scratch = addMultilineVar('barNumbers', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "begintext":
				multilineVars.inTextBlock = true;
				break;
			case "continueall":
				multilineVars.continueall = true;
				break;
			case "beginps":
				multilineVars.inPsBlock = true;
				warn("Postscript ignored", str, 0);
				break;
			case "deco":
				if (restOfString.length > 0)
					multilineVars.ignoredDecorations.push(restOfString.substring(0, restOfString.indexOf(' ')));
				warn("Decoration redefinition ignored", str, 0);
				break;
			case "text":
				var textstr = tokenizer.translateString(restOfString);
				tune.addText(parseDirective.parseFontChangeLine(textstr));
				break;
			case "center":
				var centerstr = tokenizer.translateString(restOfString);
				tune.addCentered(parseDirective.parseFontChangeLine(centerstr));
				break;
			case "font":
				// don't need to do anything for this; it is a useless directive
				break;
			case "setfont":
				var sfTokens = tokenizer.tokenize(restOfString, 0, restOfString.length);
//				var sfDone = false;
				if (sfTokens.length >= 4) {
					if (sfTokens[0].token === '-' && sfTokens[1].type === 'number') {
						var sfNum = parseInt(sfTokens[1].token);
						if (sfNum >= 1 && sfNum <= 4) {
							if (!multilineVars.setfont)
								multilineVars.setfont = [];
							sfTokens.shift();
							sfTokens.shift();
							multilineVars.setfont[sfNum] = getFontParameter(sfTokens, multilineVars.setfont[sfNum], str, 0, 'setfont');
//							var sfSize = sfTokens.pop();
//							if (sfSize.type === 'number') {
//								sfSize = parseInt(sfSize.token);
//								var sfFontName = '';
//								for (var sfi = 2; sfi < sfTokens.length; sfi++)
//									sfFontName += sfTokens[sfi].token;
//								multilineVars.setfont[sfNum] = { face: sfFontName, size: sfSize };
//								sfDone = true;
//							}
						}
					}
				}
//				if (!sfDone)
//					return "Bad parameters: " + cmd;
				break;
			case "gchordfont":
			case "partsfont":
			case "tripletfont":
			case "vocalfont":
			case "textfont":
			case "annotationfont":
			case "historyfont":
			case "infofont":
			case "measurefont":
			case "repeatfont":
			case "wordsfont":
				return getChangingFont(cmd, tokens, str);
			case "composerfont":
			case "subtitlefont":
			case "tempofont":
			case "titlefont":
			case "voicefont":
			case "footerfont":
			case "headerfont":
				return getGlobalFont(cmd, tokens, str);
			case "barlabelfont":
			case "barnumberfont":
			case "barnumfont":
				return getChangingFont("measurefont", tokens, str);
			case "staves":
			case "score":
				multilineVars.score_is_present = true;
				var addVoice = function(id, newStaff, bracket, brace, continueBar) {
					if (newStaff || multilineVars.staves.length === 0) {
						multilineVars.staves.push({index: multilineVars.staves.length, numVoices: 0});
					}
					var staff = parseCommon.last(multilineVars.staves);
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
				var lastVoice;
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

			case "newpage":
				var pgNum = tokenizer.getInt(restOfString);
				tune.addNewPage(pgNum.digits === 0 ? -1 : pgNum.value);
				break;

			case "abc":
				var arr = restOfString.split(' ');
				switch (arr[0]) {
					case "-copyright":
					case "-creator":
					case "-edited-by":
					case "-version":
					case "-charset":
						var subCmd = arr.shift();
						tune.addMetaText(cmd+subCmd, arr.join(' '));
						break;
					default:
						return "Unknown directive: " + cmd+arr[0];
				}
				break;
			case "header":
			case "footer":
				var footerStr = tokenizer.getMeat(restOfString, 0, restOfString.length);
				footerStr = restOfString.substring(footerStr.start, footerStr.end);
				if (footerStr.charAt(0) === '"' && footerStr.charAt(footerStr.length-1) === '"' )
					footerStr = footerStr.substring(1, footerStr.length-1);
				var footerArr = footerStr.split('\t');
				var footer = {};
				if (footerArr.length === 1)
					footer = { left: "", center: footerArr[0], right: "" };
				else if (footerArr.length === 2)
					footer = { left: footerArr[0], center: footerArr[1], right: "" };
				else
					footer = { left: footerArr[0], center: footerArr[1], right: footerArr[2] };
				if (footerArr.length > 3)
					warn("Too many tabs in " + cmd + ": " + footerArr.length + " found.", restOfString, 0);

				tune.addMetaTextObj(cmd, footer);
				break;

			case "midi":
				var midi = tokenizer.tokenize(restOfString, 0, restOfString.length, true);
				if (midi.length > 0 && midi[0].token === '=')
					midi.shift();
				if (midi.length === 0)
					warn("Expected midi command", restOfString, 0);
				else
					parseMidiCommand(midi, tune, restOfString);
				break;

			case "map":
			case "percmap":
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
	parseDirective.globalFormatting = function(formatHash) {
		for (var cmd in formatHash) {
			if (formatHash.hasOwnProperty(cmd)) {
				var value = ''+formatHash[cmd];
				var tokens = tokenizer.tokenize(value, 0, value.length);
				var scratch;
				switch (cmd) {
					case "titlefont":
					case "gchordfont":
					case "composerfont":
					case "footerfont":
					case "headerfont":
					case "historyfont":
					case "infofont":
					case "measurefont":
					case "partsfont":
					case "repeatfont":
					case "subtitlefont":
					case "tempofont":
					case "textfont":
					case "voicefont":
					case "tripletfont":
					case "vocalfont":
					case "wordsfont":
					case "annotationfont":
						getChangingFont(cmd, tokens, value);
						break;
					case "scale":
						setScale(cmd, tokens);
						break;
					case "partsbox":
						scratch = addMultilineVarBool('partsBox', cmd, tokens);
						if (scratch !== null) warn(scratch);
						multilineVars.partsfont.box = multilineVars.partsBox;
						break;
					default:
						warn("Formatting directive unrecognized: ", cmd, 0);
				}
			}
		}
	};
})();

module.exports = parseDirective;
