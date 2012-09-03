//    abc_parser_lint.js: Analyzes the output of abc_parse.
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

//This file takes as input the output of AbcParser and analyzes it to make sure there are no
//unexpected elements in it. It also returns a person-readable version of it that is suitable
//for regression tests.

/*global window */

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

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.test)
	window.ABCJS.test = {};

window.ABCJS.test.ParserLint = function() {
	var decorationList = { type: 'array', optional: true, items: { type: 'string', Enum: [
		"trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
		"fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
		"open", "thumb", "snap", "turn", "roll", "irishroll", "breath", "shortphrase", "mediumphrase", "longphrase",
		"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
		"p", "pp", "f", "ff", "mf", "mp", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2", "slide",
		"upbow", "downbow", "staccato", "trem1", "trem2", "trem3", "trem4",
		"/", "//", "//", "///", "turnx", "invertedturn", "invertedturnx", "arpeggio", "trill(", "trill)", "xstem",
		"mark",
		"style=normal", "style=harmonic", "style=rhythm", "style=x"
	] } };

	var tempoProperties =  {
		duration: { type: "array", optional: true, output: "join", requires: [ 'bpm'], items: { type: "number"} },
		bpm: { type: "number", optional: true, requires: [ 'duration'] },
		preString: { type: 'string', optional: true},
		postString: { type: 'string', optional: true},
		suppress: { type: 'boolean', Enum: [ true ], optional: true}
	};

	var appendPositioning = function(properties) {
		var ret = window.ABCJS.parse.clone(properties);
		ret.startChar = { type: 'number' }; //, output: 'hidden' };
		ret.endChar = { type: 'number' }; //, output: 'hidden' };
		return ret;
	};

	var prependPositioning = function(properties) {
		var ret = {};
		ret.startChar = { type: 'number' }; //, output: 'hidden' };
		ret.endChar = { type: 'number' }; //, output: 'hidden' };
		return Object.extend(ret, properties);
	};

	var fontType = {
		type: 'object', optional: true, properties: {
			font: { type: 'string', optional: true },
			size: { type: 'number', optional: true }
		}
	};

	var clefProperties = {
		stafflines: { type: 'number', minimum: 0, maximum: 10, optional: true },
		transpose: { type: 'number', minimum: -11, maximum: 11, optional: true },
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
		chord: { type: 'array', optional: true, output: "noindex", items: chordProperties },
		decoration: decorationList,
		endEnding: { type: 'boolean', Enum: [ true ], optional: true },
		startEnding: { type: 'string', optional: true },
		type: { type: 'string', Enum: [ 'bar_dbl_repeat', 'bar_right_repeat', 'bar_left_repeat', 'bar_invisible', 'bar_thick_thin', 'bar_thin_thin', 'bar_thin', 'bar_thin_thick' ] }
	};

	var noteProperties = {
		barNumber: { type: 'number', optional: true },
		beambr: { type: 'number', minimum: 1, maximum: 5, optional: true },
		chord: { type: 'array', optional: true, output: "noindex", items: chordProperties },
		decoration: decorationList,
		duration: { type: 'number' },
		endBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'startBeam', 'beambr' ], optional: true },
		endSlur: { type: 'array', optional: true, output: "join", items: { type: 'number', minimum: 0 } },
		endTriplet: { type: 'boolean', Enum: [ true ], optional: true },
		vocalfont: fontType,
		gracenotes: { type: 'array', optional: true, output: "noindex", items: {
			type: "object", properties: {
				acciaccatura: { type: 'boolean', Enum: [ true ], optional: true},
				accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural', 'dblsharp', 'dblflat', 'quarterflat', 'quartersharp' ], optional: true },
				duration: { type: 'number' },
				endBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'startBeam', 'beambr' ], optional: true },
				endSlur: { type: 'array', optional: true, output: "join", items: { type: 'number', minimum: 0 } },
				endTie: { type: 'boolean', Enum: [ true ], optional: true },
				pitch: { type: 'number' },
				verticalPos: { type: 'number' },
				startBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'endBeam', 'beambr' ], optional: true },
				startSlur: slurProperties,
				startTie: tieProperties
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
					pitch: { type: 'number' },
					verticalPos: { type: 'number' },
					startSlur: slurProperties,
					startTie: tieProperties
				}
		}},
		rest: { type: 'object',  optional: true, prohibits: [ 'pitches', 'lyric' ], properties: {
			type: { type: 'string', Enum: [ 'invisible', 'spacer', 'rest', 'multimeasure' ] },	// multimeasure requires duration to be the number of measures.
			endTie: { type: 'boolean', Enum: [ true ], optional: true },
			startTie: tieProperties
		}},
		startBeam: { type: 'boolean', Enum: [ true ], prohibits: [ 'endBeam', 'beambr' ], optional: true },
		startSlur: slurProperties,
		startTriplet: { type: 'number', minimum: 2, maximum: 9, optional: true },
		stemConnectsToAbove: { type: 'boolean', Enum: [ true ], optional: true }
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

	var voiceItem = { type: "union",
		field: "el_type",
		types: [
			{ value: "clef", properties: appendPositioning(clefProperties) },
			{ value: "bar", properties: prependPositioning(barProperties) },
			{ value: "gap", properties: { type: "number", optional: true } },	// staffbreak
			{ value: "key", properties: appendPositioning(keyProperties) },
			{ value: "meter", properties: appendPositioning(meterProperties) },
			{ value: "overlay", properties: { type: 'array', items: {	// This goes back to the last measure to start the notes in this note array.
				type: prependPositioning(noteProperties)} } },
			{ value: "part", properties: prependPositioning({ title: { type: 'string' } }) },
			{ value: "scale", properties: { size: {type: "number", optional: true, minimum: 0.5, maximum: 2 } } },
			{ value: 'stem', properties: {
				direction: { type: 'string', Enum: [ 'up', 'down', 'auto', 'none' ] }
			}},
			{ value: 'style', properties: {
				head: { type: 'string', Enum: [ 'normal', 'harmonic', 'rhythm', 'x' ] }
			}},
			{ value: 'tempo', properties: appendPositioning(tempoProperties) },
			{ value: 'transpose', properties: { steps: { type: "number" } } },
			{ value: "note", properties: prependPositioning(noteProperties) }
		]
	};

	var textFieldProperties = { type: "stringorarray", optional: true, output: 'noindex',
		items: {
			type: 'object', properties: {
				font: fontType,
				text: { type: 'string' },
				center: { type: 'boolean', Enum: [ true ], optional: true }
			}
		}
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
			gchordbox: { type: "boolean", optional: true },
			gchordfont: fontType,
			graceslurs: { type: "boolean", optional: true },
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
			leftmargin: { type: "number", optional: true },
			linesep: { type: "number", optional: true },
			lineskipfac: { type: "number", optional: true },
			maxshrink: { type: "number", optional: true },
			maxstaffsep: { type: "number", optional: true },
			maxsysstaffsep: { type: "number", optional: true },
			measurebox: { type: "boolean", optional: true },
			measurefont: fontType,
			midi: { type: "object", optional: true, properties: {
				barlines: { type: "number", optional: true },
				bassprog: { type: "number", optional: true },
				bassvol: { type: "number", optional: true },
				beat: { type: "number", optional: true },
				beataccents: { type: "number", optional: true },
				beatmod: { type: "number", optional: true },
				beatstring: { type: "number", optional: true },
				c: { type: "number", optional: true },
				channel: { type: "number", optional: true },
				chordattack: { type: "number", optional: true },
				chordname: { type: "number", optional: true },
				chordprog: { type: "number", optional: true },
				chordvol: { type: "number", optional: true },
				control: { type: "number", optional: true },
				deltaloudness: { type: "number", optional: true },
				drone: { type: "number", optional: true },
				droneoff: { type: "number", optional: true },
				droneon: { type: "number", optional: true },
				drum: { type: "number", optional: true },
				drumbars: { type: "number", optional: true },
				drummap: { type: "number", optional: true },
				drumoff: { type: "number", optional: true },
				drumon: { type: "number", optional: true },
				fermatafixed: { type: "number", optional: true },
				fermataproportional: { type: "number", optional: true },
				gchord: { type: "string", optional: true },
				gchordon: { type: "number", optional: true },
				gchordoff: { type: "number", optional: true },
				grace: { type: "number", optional: true },
				gracedivider: { type: "number", optional: true },
				makechordchannels: { type: "number", optional: true },
				nobarlines: { type: "number", optional: true },
				nobeataccents: { type: "number", optional: true },
				noportamento: { type: "number", optional: true },
				pitchbend: { type: "number", optional: true },
				program: { type: 'object', optional: true,
						properties: {
							channel: { type: "number", optional: true, minimum: 1, maximum: 16},
							program: { type: "number", minimum: 0, maximum: 127 }
						}
					 },
				portamento: { type: "number", optional: true }, 
				randomchordattack: { type: "number", optional: true },
				ratio: { type: "number", optional: true },
				rtranspose: { type: "number", optional: true },
				temperament: { type: "number", optional: true },
				temperamentlinear: { type: "number", optional: true },
				temperamentnormal: { type: "number", optional: true },
				transpose: { type: "number", optional: true },
				voice: { type: "number", optional: true }
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
			playtempo: { type: "string", optional: true },
			repeatfont: fontType,
			rightmargin: { type: "number", optional: true },
			scale: { type: "number", optional: true },
			score: { type: "string", optional: true },
			slurgraces: { type: "boolean", optional: true },
			slurheight: { type: "number", optional: true },
			splittune: { type: "boolean", optional: true },
			squarebreve: { type: "boolean", optional: true },
			staffsep: { type: "number", optional: true },
			staffwidth: { type: "number", optional: true },
			stemheight: { type: "number", optional: true },
			straightflags: { type: "boolean", optional: true },
			stretchlast: { type: "boolean", optional: true },
			stretchstaff: { type: "boolean", optional: true },
			subtitlefont: fontType,
			subtitlespace: { type: "number", optional: true },
			sysstaffsep: { type: "number", optional: true },
			systemsep: { type: "number", optional: true },
			tempofont: fontType,
			textfont: fontType,
			textspace: { type: "number", optional: true },
			titlefont: fontType,
			titleformat: { type: "string", optional: true },
			titleleft: { type: "boolean", optional: true },
			titlespace: { type: "number", optional: true },
			topmargin: { type: "number", optional: true },
			topspace: { type: "number", optional: true },
			vocalabove: { type: "boolean", optional: true },
			vocalfont: fontType,
			vocalspace: { type: "number", optional: true },
			voicefont: fontType,
			wordsfont: fontType,
			wordsspace: { type: "number", optional: true }
		}
	};

	var addProhibits = function(obj, arr) {
		var ret = window.ABCJS.parse.clone(obj);
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
						lineLength: { type: 'number', optional: true },
						spaceAbove: { type: 'number', optional: true },
						spaceBelow: { type: 'number', optional: true }
					}
				},
				subtitle: { type: "string", optional: true, prohibits: [ 'staff', 'text', 'separator' ]  },
				text: addProhibits(textFieldProperties, [ 'staff', 'subtitle', 'separator' ]),
				staff: { type: 'array', optional: true, prohibits: [ 'subtitle', 'text', 'separator' ],
					items: { type: 'object',
						properties: {
							brace: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
							bracket: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
							clef: { type: 'object', optional: true, properties: clefProperties },
							connectBarLines: { type: 'string', optional: true, Enum: [ "start", "continue", "end" ] },
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
			version: { type: "string", Enum: [ "1.0.1" ] },
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
			}
		}
	};

	this.lint = function(tune, warnings) {
		var ret = window.ABCJS.test.JSONSchema.validate(tune, musicSchema);
		var err = "";
		window.ABCJS.parse.each(ret.errors, function(e) {
			err += e.property + ": " + e.message + "\n";
		});
		var out = ret.output.join("\n");

		var warn = warnings === undefined ? "No errors" : warnings.join('\n');
		warn = window.ABCJS.parse.gsub(warn, '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">', '$$$$');
		warn = window.ABCJS.parse.gsub(warn, '</span>', '$$$$');
		return "Error:------\n" + err + "\nObj:-------\n" + out + "\nWarn:------\n" + warn;
	};
}
