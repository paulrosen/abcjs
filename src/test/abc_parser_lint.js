//    abc_parser_lint.js: Analyzes the output of abc_parse.

//This file takes as input the output of AbcParser and analyzes it to make sure there are no
//unexpected elements in it. It also returns a person-readable version of it that is suitable
//for regression tests.

// Changes for V1.0.1:
//
// Added:
// media: screen | print
// infoline: boolean
//"abc-copyright": string
//"abc-creator": string
//"abc-version": string
//"abc-charset": string
//"abc-edited-by": string
//format.measurebox: true
//format.decorationPlacement: above, below
//format.header, format.footer are fleshed out
//image: string
//multicol: string
//newpage: string
//staffbreak: number
//staff.spacingAbove: length
// chord: { root, type }
// added { tonic, acc, mode } to keyProperties
// transpose to clef
// stafflines and scaling
// style: note head shape
// decorations: tremolos: / // ///
// decorations: xstem - extend the stem to the staff above
// rel_position for chord
// slur: direction and style
// note.noStem
// voice.gap
// voice.overlay
// voice.stem can also be auto and none
// columns
// note.vocalFont
// more meter properties
// note.beambr: number of beams to break
// note.stemConnectsToAbove: connect the stem to the note on the higher staff.
// line.vskip
//
// Changed from optional to manditory:
// pagewidth and pageheight
//
// Expanded:
// MIDI is now { cmd, param }

var parseCommon = require('../parse/abc_common');
var JSONSchema = require('./jsonschema-b4');

var ParserLint = function() {
	"use strict";
	var decorationList = { type: 'array', optional: true, items: { type: 'string', Enum: [
		"trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
		"fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
		"open", "thumb", "snap", "turn", "roll", "irishroll", "breath", "shortphrase", "mediumphrase", "longphrase",
		"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)", "glissando(", "glissando)",
		"p", "pp", "f", "ff", "mf", "mp", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2", "slide",
		"upbow", "downbow", "staccato", "trem1", "trem2", "trem3", "trem4",
		"/", "//", "///", "////", "turnx", "invertedturn", "invertedturnx", "arpeggio", "trill(", "trill)", "xstem",
		"mark", "marcato", "umarcato", "D.C.alcoda", "D.C.alfine", "D.S.alcoda", "D.S.alfine", "editorial", "courtesy"
	] } };

	var tempoProperties =  {
		duration: { type: "array", optional: true, output: "join", requires: [ 'bpm'], items: { type: "number"} },
		bpm: { type: "number", optional: true, requires: [ 'duration'] },
		endChar: { type: 'number'},
		preString: { type: 'string', optional: true},
		postString: { type: 'string', optional: true},
		startChar: { type: 'number'},
		suppress: { type: 'boolean', Enum: [ true ], optional: true},
		suppressBpm: { type: 'boolean', Enum: [ true ], optional: true}
	};

	var appendPositioning = function(properties) {
		var ret = parseCommon.clone(properties);
		ret.startChar = { type: 'number' }; //, output: 'hidden' };
		ret.endChar = { type: 'number' }; //, output: 'hidden' };
		return ret;
	};

	var prependPositioning = function(properties) {
		var ret = {};
		ret.startChar = { type: 'number' }; //, output: 'hidden' };
		ret.endChar = { type: 'number' }; //, output: 'hidden' };
		return Object.assign(ret, properties);
	};

	var fontType = {
		type: 'object', optional: true, properties: {
			box: { type: 'boolean', Enum: [ true ], optional: true },
			face: { type: 'string', optional: true },
			weight: { type: 'string', Enum: [ 'bold', 'normal' ], optional: true },
			style: { type: 'string',Enum: [ 'italic', 'normal' ],  optional: true },
			decoration: { type: 'string', Enum: [ 'underline', 'none' ], optional: true },
			size: { type: 'number', optional: true }
		}
	};

	var percMapElement = {
		type: 'object', optional: true, properties: {
			sound: { type: 'number', minimum: 35, maximum: 81  },
			noteHead: { type: 'string', Enum: ['normal', 'harmonic', 'rhythm', 'x', 'triangle'], optional: true },
		}
	};
	var percMapProps = {
		"C": percMapElement,
		"_C": percMapElement,
		"^C": percMapElement,
		"=C": percMapElement,
		"D": percMapElement,
		"_D": percMapElement,
		"^D": percMapElement,
		"=D": percMapElement,
		"E": percMapElement,
		"_E": percMapElement,
		"^E": percMapElement,
		"=E": percMapElement,
		"F": percMapElement,
		"_F": percMapElement,
		"^F": percMapElement,
		"=F": percMapElement,
		"G": percMapElement,
		"_G": percMapElement,
		"^G": percMapElement,
		"=G": percMapElement,
		"A": percMapElement,
		"_A": percMapElement,
		"^A": percMapElement,
		"=A": percMapElement,
		"B": percMapElement,
		"_B": percMapElement,
		"^B": percMapElement,
		"=B": percMapElement,
		"c": percMapElement,
		"_c": percMapElement,
		"^c": percMapElement,
		"=c": percMapElement,
		"d": percMapElement,
		"_d": percMapElement,
		"^d": percMapElement,
		"=d": percMapElement,
		"e": percMapElement,
		"_e": percMapElement,
		"^e": percMapElement,
		"=e": percMapElement,
		"f": percMapElement,
		"_f": percMapElement,
		"^f": percMapElement,
		"=f": percMapElement,
		"g": percMapElement,
		"_g": percMapElement,
		"^g": percMapElement,
		"=g": percMapElement,
		"a": percMapElement,
		"_a": percMapElement,
		"^a": percMapElement,
		"=a": percMapElement,
	};

	var clefProperties = {
		stafflines: { type: 'number', minimum: 0, maximum: 10, optional: true },
		staffscale: { type: 'number', minimum: 0.1, maximum: 10, optional: true },
		transpose: { type: 'number', minimum: -24, maximum: 24, optional: true },
		type: { type: 'string', Enum: [ 'treble', 'tenor', 'bass', 'alto', 'treble+8', 'tenor+8', 'bass+8', 'alto+8', 'treble-8', 'tenor-8', 'bass-8', 'alto-8', 'none', 'perc' ] },
		verticalPos: { type: 'number', minimum: -20, maximum: 10 },	// the pitch that goes in the middle of the staff C=0
		clefPos: { type: 'number', minimum: 2, maximum: 10, optional: true }	// this is needed if there is a clef, but should not be present if the clef is 'none'
	};

	var chordProperties = {
		type: "object", properties: {
			name: { type: 'string'},
			chord: { type: 'object', optional: true, properties: {
				root: { type: 'string', Enum: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]},
				type: { type: 'string', Enum: [ 'm', '7', 'm7', 'maj7', 'M7', '6', 'm6', 'aug', '+', 'aug7', 'dim', 'dim7', '9', 'm9', 'maj9', 'M9', '11', 'dim9', 'sus', 'sus9', '7sus4', '7sus9', '5' ]}
				}
			},
			position: { type: 'string', Enum: [ 'above', 'below', 'left', 'right', 'default' ], optional: true, prohibits: [ 'rel_position' ] },
			rel_position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, optional: true, prohibits: [ 'position' ] }
		}
	};

	var slurProperties = { type: 'array', optional: true, output: "noindex", items: {
			type: 'object', optional: true, properties: {
				label: { type: 'number', minimum: 0 },
				direction: { type: 'string', optional: true, Enum: [ 'up', 'down' ] },
				style: { type: 'string', optional: true, Enum: [ 'dotted' ] }
			}
		}
	};

	var tieProperties = { type: 'object', optional: true, properties: {
		direction: { type: 'string', optional: true, Enum: [ 'up', 'down' ] },
		style: { type: 'string', optional: true, Enum: [ 'dotted' ] }
	} };

	var barProperties = {
		barNumber: { type: 'number', optional: true },
		chord: { type: 'array', optional: true, output: "noindex", items: chordProperties },
		decoration: decorationList,
		endEnding: { type: 'boolean', Enum: [ true ], optional: true },
		startEnding: { type: 'string', optional: true },
		type: { type: 'string', Enum: [ 'bar_dbl_repeat', 'bar_right_repeat', 'bar_left_repeat', 'bar_invisible', 'bar_thick_thin', 'bar_thin_thin', 'bar_thin', 'bar_thin_thick' ] }
	};

	var noteProperties = {
		beambr: { type: 'number', minimum: 1, maximum: 5, optional: true },
		chord: { type: 'array', optional: true, output: "noindex", items: chordProperties },
		decoration: decorationList,
		duration: { type: 'number' },
		endBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'startBeam', 'beambr' ], optional: true },
		endSlur: { type: 'array', optional: true, output: "join", items: { type: 'number', minimum: 0 } },
		endTriplet: { type: 'boolean', Enum: [ true ], optional: true },
		fonts: { type: 'object', optional: true, properties: {
			annotationfont: fontType,
			gchordfont: fontType,
			measurefont: fontType,
			repeatfont: fontType,
			tripletfont: fontType,
			vocalfont: fontType
		}},
		gracenotes: { type: 'array', optional: true, output: "noindex", items: {
			type: "object", properties: {
				acciaccatura: { type: 'boolean', Enum: [ true ], optional: true},
				accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural', 'dblsharp', 'dblflat', 'quarterflat', 'quartersharp' ], optional: true },
				duration: { type: 'number' },
				endBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'startBeam', 'beambr' ], optional: true },
				endSlur: { type: 'array', optional: true, output: "join", items: { type: 'number', minimum: 0 } },
				endTie: { type: 'boolean', Enum: [ true ], optional: true },
				midipitch: { type: 'number', optional: true },
				name: { type: 'string' },
				pitch: { type: 'number' },
				verticalPos: { type: 'number' },
				startBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'endBeam', 'beambr' ], optional: true },
				startSlur: slurProperties,
				startTie: tieProperties,
				}
		}},
		lyric: { type: 'array', optional: true, output: "noindex", items: {
			type: 'object', properties: {
			syllable: { type :'string' },
			divider: { type: 'string', Enum: [ '-', ' ', '_' ]}
		}}},
		noStem: { type: 'boolean', Enum: [ true ], optional: true },
		pitches: { type: 'array',  optional: true, output: "noindex", prohibits: [ 'rest' ], items: {
				type: 'object', properties: {
					accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural', 'dblsharp', 'dblflat', 'quarterflat', 'quartersharp' ], optional: true },
					endSlur: { type: 'array', optional: true, output: "join", items: { type: 'number', minimum: 0 } },
					endTie: { type: 'boolean', Enum: [ true ], optional: true },
					midipitch: { type: 'number', optional: true },
					name: { type: 'string' },
					pitch: { type: 'number' },
					verticalPos: { type: 'number' },
					startSlur: slurProperties,
					startTie: tieProperties,
					style: {	type: 'string', Enum: ['normal', 'harmonic', 'rhythm', 'x', 'triangle'], optional: true },
				}
		}},
		positioning: { type: 'object', optional: true, properties: {
			chordPosition: { type: 'string', Enum: [ 'above', 'below', 'hidden' ], optional: true},
			dynamicPosition: { type: 'string', Enum: [ 'above', 'below', 'hidden' ], optional: true},
			ornamentPosition: { type: 'string', Enum: [ 'above', 'below', 'hidden' ], optional: true},
			vocalPosition: { type: 'string', Enum: [ 'above', 'below', 'hidden' ], optional: true},
			volumePosition: { type: 'string', Enum: [ 'above', 'below', 'hidden' ], optional: true}
		}},
		rest: { type: 'object',  optional: true, prohibits: [ 'pitches', 'lyric' ], properties: {
			type: { type: 'string', Enum: [ 'invisible', 'spacer', 'rest', 'multimeasure', 'invisible-multimeasure', 'whole' ] },	// multimeasure requires duration to be the number of measures.
			text: { type: 'number', minimum: 1, maximum: 100, optional: true },
			endTie: { type: 'boolean', Enum: [ true ], optional: true },
			startTie: tieProperties
		}},
		startBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'endBeam', 'beambr' ], optional: true },
		startSlur: slurProperties,
		startTriplet: { type: 'number', minimum: 2, maximum: 9, optional: true },
		tripletMultiplier: { type: 'number', minimum: .1, maximum: 9, optional: true },
		tripletR: { type: 'number', minimum: .1, maximum: 9, optional: true },
		stemConnectsToAbove: { type: 'boolean', Enum: [ true ], optional: true },
		style: {	type: 'string', Enum: ['normal', 'harmonic', 'rhythm', 'x', 'triangle'], optional: true }
};

	var keyProperties = { // change deepCopyKey (in parse_header) if there are changes around here
		accidentals: { type: 'array', optional: true, output: "noindex", items: {
				type: 'object', properties: {
					acc: { type: 'string', Enum: [ 'flat', 'natural', 'sharp', 'dblsharp', 'dblflat', 'quarterflat', 'quartersharp' ] },
					note: { type: 'string', Enum: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g' ] },
					verticalPos: { type: 'number', minimum: 0, maximum: 13 }
				}
		} },
		root: { type: 'string', Enum: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'HP', 'Hp', 'none']},
		acc: { type: 'string', Enum: ['', '#', 'b']},
		mode: { type: 'string', Enum: ['', 'm', 'Dor', 'Mix', 'Loc', 'Phr', 'Lyd']}
	};

	var meterProperties = {
		type: { type: 'string', Enum: [ 'common_time', 'cut_time', 'specified', 'tempus_perfectum', 'tempus_imperfectum', 'tempus_perfectum_prolatio', 'tempus_imperfectum_prolatio' ] },
		// 'tempus perfectum'=o, 'tempus imperfectum'=c, 'tempus perfectum prolatio'=o., 'tempus imperfectum prolatio'=c.
		value: { type: 'array', optional: true, output: 'noindex',	// TODO-PER: Check for type=specified and require these in that case.
			items: {
				type: 'object', properties: {
					num: { type: 'string' },
					den: { type: 'string', optional: true }
				}
			}
		},
		beat_division: { type: 'array', optional: true, output: 'noindex',	// This is displayed inside parens, but is just an elaboration of the "value" field, not more info.
			items: {
				type: 'object', properties: {
					num: { type: 'string' },
					den: { type: 'string', optional: true }
				}
			}
		}
	};

	var midiProperties = {
		cmd: { type: 'string', Enum: [
			"nobarlines", "barlines", "beataccents", "nobeataccents", "droneon", "droneoff", "noportamento", "channel", "c",
			"drumon", "drumoff", "fermatafixed", "fermataproportional", "gchordon", "gchordoff", "bassvol", "chordvol", "bassprog", "chordprog",
			"controlcombo", "temperamentnormal", "gchord", "ptstress", "beatmod", "deltaloudness", "drumbars", "pitchbend",
			"gracedivider", "makechordchannels", "randomchordattack", "chordattack", "stressmodel", "transpose",
			"rtranspose", "volinc", "program", "ratio", "snt", "bendvelocity", "control", "temperamentlinear", "beat", "beatstring",
			"drone", "bassprog", "chordprog", "drummap", "portamento", "expand", "grace", "trim", "drum", "chordname"
		]},
		params: { type: 'array', output: 'join',
			items: {
				type: 'stringorinteger'
			}
		}
	};

	var voiceItem = { type: "union",
		field: "el_type",
		types: [
			{ value: "clef", properties: appendPositioning(clefProperties) },
			{ value: "color", properties: { color: {type: "string", optional: true } } },
			{ value: "bar", properties: prependPositioning(barProperties) },
			{ value: "gap", properties: { type: "number", optional: true } },	// staffbreak
			{ value: "key", properties: appendPositioning(keyProperties) },
			{ value: "meter", properties: appendPositioning(meterProperties) },
			{ value: "midi", properties: appendPositioning(midiProperties) },
			{ value: "overlay", properties: { type: 'array', items: {	// This goes back to the last measure to start the notes in this note array.
				type: prependPositioning(noteProperties)} } },
			{ value: "part", properties: prependPositioning({ title: { type: 'string' } }) },
			{ value: "scale", properties: { size: {type: "number", optional: true, minimum: 0.5, maximum: 2 } } },
			{ value: 'stem', properties: {
				direction: { type: 'string', Enum: [ 'up', 'down', 'auto', 'none' ] }
			}},
			{ value: 'style', properties: {
				head: { type: 'string', Enum: [ 'normal', 'harmonic', 'rhythm', 'x', 'triangle' ] }
			}},
			{ value: 'tempo', properties: appendPositioning(tempoProperties) },
			{ value: 'transpose', properties: { steps: { type: "number" } } },
			{ value: "note", properties: prependPositioning(noteProperties) }
		]
	};

	var textFieldProperties = { type: "stringorarray", optional: true, output: 'noindex',
		items: {
			type: 'object', properties: {
				endChar: { type: 'number', optional: true},
				font: fontType,
				text: { type: 'string' },
				center: { type: 'boolean', Enum: [ true ], optional: true },
				startChar: { type: 'number', optional: true}
			}
		}
	};

	var drummapProps = {
		"C": { type: "number", optional: true },
		"_C": { type: "number", optional: true },
		"^C": { type: "number", optional: true },
		"=C": { type: "number", optional: true },
		"D": {type: "number", optional: true},
		"_D": {type: "number", optional: true},
		"^D": {type: "number", optional: true},
		"=D": {type: "number", optional: true},
		"E": {type: "number", optional: true},
		"_E": {type: "number", optional: true},
		"^E": {type: "number", optional: true},
		"=E": {type: "number", optional: true},
		"F": {type: "number", optional: true},
		"_F": {type: "number", optional: true},
		"^F": {type: "number", optional: true},
		"=F": {type: "number", optional: true},
		"G": {type: "number", optional: true},
		"_G": {type: "number", optional: true},
		"^G": {type: "number", optional: true},
		"=G": {type: "number", optional: true},
		"A": {type: "number", optional: true},
		"_A": {type: "number", optional: true},
		"^A": {type: "number", optional: true},
		"=A": {type: "number", optional: true},
		"B": {type: "number", optional: true},
		"_B": {type: "number", optional: true},
		"^B": {type: "number", optional: true},
		"=B": {type: "number", optional: true},
		"c": {type: "number", optional: true},
		"_c": {type: "number", optional: true},
		"^c": {type: "number", optional: true},
		"=c": {type: "number", optional: true},
		"d": {type: "number", optional: true},
		"_d": {type: "number", optional: true},
		"^d": {type: "number", optional: true},
		"=d": {type: "number", optional: true},
		"e": {type: "number", optional: true},
		"_e": {type: "number", optional: true},
		"^e": {type: "number", optional: true},
		"=e": {type: "number", optional: true},
		"f": {type: "number", optional: true},
		"_f": {type: "number", optional: true},
		"^f": {type: "number", optional: true},
		"=f": {type: "number", optional: true},
		"g": {type: "number", optional: true},
		"_g": {type: "number", optional: true},
		"^g": {type: "number", optional: true},
		"=g": {type: "number", optional: true},
		"a": {type: "number", optional: true},
		"_a": {type: "number", optional: true},
		"^a": {type: "number", optional: true},
		"=a": {type: "number", optional: true},
	};

	var formattingProperties = {
		type:"object",
		properties: {
			alignbars: { type: "number", optional: true },
			aligncomposer: { type: "string", Enum: [ 'left', 'center','right' ], optional: true },
			annotationfont: fontType,
			auquality: { type: "string", optional: true },
			bagpipes: { type: "boolean", optional: true },
			barlabelfont: fontType,
			barnumberfont: fontType,
			botmargin: { type: "number", optional: true },
			botspace: { type: "number", optional: true },
			bstemdown: { type: "boolean", optional: true },
			composerfont: fontType,
			composerspace: { type: "number", optional: true },
			continueall: { type: "boolean", optional: true },
			continuous: { type: "string", optional: true },
			dynalign: { type: "boolean", optional: true },
			exprabove: { type: "boolean", optional: true },
			exprbelow: { type: "boolean", optional: true },
			flatbeams: { type: "boolean", optional: true },
			footer: { type: "string", optional: true },
			footerfont: fontType,
			freegchord: { type: "boolean", optional: true },
			gchordbox: { type: "boolean", optional: true },
			gchordfont: fontType,
			graceSlurs: { type: "boolean", optional: true },
			gracespacebefore: { type: "number", optional: true },
			gracespaceinside: { type: "number", optional: true },
			gracespaceafter: { type: "number", optional: true },
			header: { type: "string", optional: true },
			headerfont: fontType,
			historyfont: fontType,
			indent: { type: "number", optional: true },
			infofont: fontType,
			infoline: { type: "boolean", optional: true },
			infospace: { type: "number", optional: true },
//					landscape: { type: "boolean", optional: true },
			jazzchords: { type: "boolean", optional: true },
			germanAlphabet: { type: "boolean", optional: true },
			leftmargin: { type: "number", optional: true },
			linesep: { type: "number", optional: true },
			lineskipfac: { type: "number", optional: true },
			lineThickness: { type: "number", optional: true },
			map: { type: "string", optional: true },
			maxshrink: { type: "number", optional: true },
			maxstaffsep: { type: "number", optional: true },
			maxsysstaffsep: { type: "number", optional: true },
			measurebox: { type: "boolean", optional: true },
			measurefont: fontType,
			midi: { type: "object", optional: true, properties: {
				barlines: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				bassprog: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				bassvol: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				beat: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				beataccents: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				beatmod: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				beatstring: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				bendvelocity: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				c: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				channel: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				chordattack: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				chordname: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				chordprog: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				chordvol: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				control: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				controlcombo: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				deltaloudness: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				drone: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				droneoff: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				droneon: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				drum: { type: 'array', optional: true, output: 'join', items: { type: "stringorinteger" } },
				drumbars: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				drummap: { type: 'object', optional: true, properties: drummapProps },
				drumoff: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				drumon: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				expand: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				fermatafixed: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				fermataproportional: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				gchord: { type: 'array', optional: true, output: 'join', items: { type: "stringorinteger" } },
				gchordon: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				gchordoff: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				grace: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				gracedivider: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				makechordchannels: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				nobarlines: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				nobeataccents: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				noportamento: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				pitchbend: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				program: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				portamento: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				ptstress: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				randomchordattack: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				ratio: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				rtranspose: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				snt: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				stressmodel: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				temperamentlinear: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				temperamentnormal: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				transpose: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				trim: { type: 'array', optional: true, output: 'join', items: { type: "number" } },
				volinc: { type: 'array', optional: true, output: 'join', items: { type: "number" } }
			}},
			musicspace: { type: "number", optional: true },
			nobarcheck: { type: "string", optional: true },
			notespacingfactor: { type: "number", optional: true },
			pageheight: { type: "number" },
			pagewidth: { type: "number" },
			parskipfac: { type: "number", optional: true },
			partsbox: { type: "boolean", optional: true },
			partsfont: fontType,
			partsspace: { type: "number", optional: true },
			percmap: {type: 'object', optional: true, properties: percMapProps},
			playtempo: { type: "string", optional: true },
			repeatfont: fontType,
			rightmargin: { type: "number", optional: true },
			scale: { type: "number", optional: true },
			score: { type: "string", optional: true },
			slurheight: { type: "number", optional: true },
			splittune: { type: "boolean", optional: true },
			squarebreve: { type: "boolean", optional: true },
			staffsep: { type: "number", optional: true },
			staffwidth: { type: "number", optional: true },
			stemheight: { type: "number", optional: true },
			straightflags: { type: "boolean", optional: true },
			stretchlast: {type: "number", optional: true, minimum: 0, maximum: 1 },
			stretchstaff: { type: "boolean", optional: true },
			subtitlefont: fontType,
			subtitlespace: { type: "number", optional: true },
			sysstaffsep: { type: "number", optional: true },
			systemsep: { type: "number", optional: true },
			tabgracefont: fontType,
			tablabelfont: fontType,
			tabnumberfont: fontType,
			tempofont: fontType,
			textfont: fontType,
			textspace: { type: "number", optional: true },
			titlefont: fontType,
			titleformat: { type: "string", optional: true },
			titleleft: { type: "boolean", optional: true },
			titlespace: { type: "number", optional: true },
			topmargin: { type: "number", optional: true },
			topspace: { type: "number", optional: true },
			tripletfont: fontType,
			vocalabove: { type: "boolean", optional: true },
			vocalfont: fontType,
			vocalspace: { type: "number", optional: true },
			voicefont: fontType,
			wordsfont: fontType,
			wordsspace: { type: "number", optional: true }
		}
	};

	var addProhibits = function(obj, arr) {
		var ret = parseCommon.clone(obj);
		ret.prohibits = arr;
		return ret;
	};

	var lineProperties = {
		type:"array",
		description: "This is an array of horizontal elements. It is usually a staff of music. For multi-stave music, each staff is an element, just like single-staff. The difference is the connector properties.",
		items: { type: "object",
			properties: {
				columns: { type: 'array', optional: true,	// The width of the columns is fixed and even for all columns. That is known by the number of columns in the array.
					items: { type: 'object',
						properties: {
							formatting: formattingProperties,
							lines: lineProperties
						}
					}
				},
				image: { type: 'string', optional: true },	// Corresponds to %%EPS directive.
				newpage: { type: 'number', optional: true },	// page number if positive, or -1 for auto
				staffbreak: { type: 'number', optional: true },
				separator: { type: 'object', optional: true, prohibits: [ 'staff', 'text', 'subtitle' ],
					properties: {
						endChar: { type: 'number'},
						lineLength: { type: 'number', optional: true },
						spaceAbove: { type: 'number', optional: true },
						spaceBelow: { type: 'number', optional: true },
						startChar: { type: 'number'}
					}
				},
				subtitle: { type: "object", optional: true, prohibits: [ 'staff', 'text', 'separator' ],
					properties: {
						endChar: { type: 'number'},
						startChar: { type: 'number'},
						text: { type: 'string'}
					}
				},
				text: { type: "object", optional: true, prohibits: [ 'staff', 'subtitle', 'separator' ],
					properties: {
						endChar: { type: 'number'},
						startChar: { type: 'number'},
						text: textFieldProperties
					}
				},
				staff: { type: 'array', optional: true, prohibits: [ 'subtitle', 'text', 'separator' ],
					items: { type: 'object',
						properties: {
							barNumber: { type: 'number', optional: true },
							brace: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
							bracket: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
							clef: { type: 'object', optional: true, properties: clefProperties },
							connectBarLines: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
							gchordfont: fontType,
							tripletfont: fontType,
							vocalfont: fontType,
							key: { type: 'object', optional: true, properties: keyProperties },
							meter: { type: 'object', optional: true, properties: meterProperties },
							spacingAbove: { type: 'number', optional: true },	// the vskip directive
							spacingBelow: { type: 'number', optional: true },
							stafflines: { type: 'number', optional: true, minimum: 0, maximum: 10 },
							staffscale: { type: 'number', minimum: 0.5, maximum: 3, optional: true },
							title: { type: 'array', optional: true, items: { type: 'string' } },
							voices: { type: 'array', output: 'hidden',
								items: {
									type: "array", optional: true, output: "noindex",
									items: voiceItem
								}
							}
						}
					}
				},
				vskip: { type: 'number', optional: true }	// how much extra space to leave before this line (can be negative)
			}
		}
	};

	var musicSchema = {
		description:"ABC Internal Music Representation",
		type:"object",
		properties: {
			version: { type: "string", Enum: [ "1.1.0" ] },
			media: { type: "string", Enum: [ "screen", "print" ] },

			formatting: formattingProperties,
			lines: lineProperties,

			metaText: {type:"object",
				description: "There can only be one of these per tune",
				properties: {
					"abc-copyright": { type: "string", optional: true },
					"abc-creator": { type: "string", optional: true },
					"abc-version": { type: "string", optional: true },
					"abc-charset": { type: "string", optional: true },
					"abc-edited-by": { type: "string", optional: true },
					author: { type: "string", optional: true },
					book: { type: "string", optional: true },
					composer: { type: "string", optional: true },
					decorationPlacement: { type: '', Enum: [ 'above', 'below' ], optional: true },
					discography: { type: "string", optional: true },
					footer: { type: 'object', optional: true,	// The strings %P, %P0, and %P1 should be replaced with the page number
						properties: {
							left: { type: 'string' },
							center: { type: 'string' },
							right: { type: 'string' }
						}
					},
					group: { type: "string", optional: true },
					header: { type: 'object', optional: true,
						properties: {
							left: { type: 'string' },
							center: { type: 'string' },
							right: { type: 'string' }
						}
					},
					history: { type: "string", optional: true },
					instruction: { type: "string", optional: true },
					measurebox: { type: 'boolean', Enum: [ true ], optional: true },
					notes: { type: "string", optional: true },
					origin: { type: "string", optional: true },
					partOrder: { type: "string", optional: true },
					rhythm: { type: "string", optional: true },
					source: { type: "string", optional: true },
					tempo: { type: "object", optional: true, properties: tempoProperties },
					textBlock: { type: "string", optional: true },
					title: { type: "string", optional: true },
					transcription: { type: "string", optional: true },
					unalignedWords: { type: 'array', optional: true, items: textFieldProperties },
					url: { type: "string", optional: true }
				}
			},
			metaTextInfo: {type:"object",
				description: "There can only be one of these per tune",
				properties: {
					"abc-copyright": { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					"abc-creator": { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					"abc-version": { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					"abc-charset": { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					"abc-edited-by": { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					author: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					book: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					composer: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					discography: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					footer: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					group: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					header: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					history: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					instruction: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					notes: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					origin: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					partOrder: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					rhythm: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					source: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					tempo: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					textBlock: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					title: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					transcription: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					unalignedWords: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
					url: { type: "object", optional: true, properties: { startChar: { type: "number"}, endChar: { type: "number"}, } },
				}
			},
		}
	};

	this.lint = function(tune, warnings) {
		var ret = JSONSchema.validate(tune, musicSchema);
		var err = "";
		ret.errors.forEach(function(e) {
			err += e.property + ": " + e.message + "\n";
		});
		var out = ret.output.join("\n");

		var warn = warnings === undefined ? "No errors" : warnings.join('\n');
		warn = warn.replace(/<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">/g, '$$$$$$$$');
		warn = warn.replace(/<\/span>/g, '$$$$$$$$');
		return "Error:------\n" + err + "\nObj:-------\n" + out + "\nWarn:------\n" + warn;
	};
};

module.exports = ParserLint;
