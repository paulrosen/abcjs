/**
 * @author paulrosen
 *
 * This file takes as input the output of AbcParser and analyzes it to make sure there are no
 * unexpected elements in it. It also returns a person-readable version of it that is suitable
 * for regression tests.
 *
 */

/*global Class */
/*global JSONSchema */
/*extern AbcParserLint */

var AbcParserLint = Class.create({
	initialize: function () {

		var decorationList = { type: 'array', optional: true, items: { type: 'string', Enum: [
			"trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
			"emphasis", "fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
			"open", "thumb", "snap", "turn", "roll", "breath", "shortphrase", "mediumphrase", "longphrase",
			"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
			"p", "pp", "f", "ff", "mf", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2", "slide",
			"upbow", "downbow", "staccato"
		] } };

		var musicSchema = {
			description:"ABC Internal Music Representation",
			type:"object",
			properties: {
				formatting: {type:"object",
					properties: {
						auquality: { type: "string", optional: true },
						bagpipes: { type: "boolean", optional: true },
						barlabelfont: { type: "string", optional: true },
						barnumberfont: { type: "string", optional: true },
						barnumbers: { type: "string", optional: true },
						barnumfont: { type: "string", optional: true },
						begintext: { type: "string", optional: true },
						botmargin: { type: "string", optional: true },
						botspace: { type: "string", optional: true },
						composerfont: { type: "string", optional: true },
						composerspace: { type: "string", optional: true },
						continuous: { type: "string", optional: true },
						endtext: { type: "string", optional: true },
						gchordfont: { type: "string", optional: true },
						indent: { type: "string", optional: true },
						landscape: { type: "string", optional: true },
						leftmargin: { type: "string", optional: true },
						linesep: { type: "string", optional: true },
						midi: { type: "string", optional: true },
						musicspace: { type: "string", optional: true },
						nobarcheck: { type: "string", optional: true },
						partsfont: { type: "string", optional: true },
						partsspace: { type: "string", optional: true },
						playtempo: { type: "string", optional: true },
						scale: { type: "number", optional: true },
						score: { type: "string", optional: true },
						sep: { type: "string", optional: true },
						slurgraces: { type: "string", optional: true },
						staffsep: { type: "string", optional: true },
						staffwidth: { type: "number", optional: true },
						staves: { type: "string", optional: true },
						stretchlast: { type: "boolean", optional: true },
						subtitlefont: { type: "string", optional: true },
						subtitlespace: { type: "string", optional: true },
						sysstaffsep: { type: "string", optional: true },
						systemsep: { type: "string", optional: true },
						tempofont: { type: "string", optional: true },
						textspace: { type: "string", optional: true },
						text: { type: "string", optional: true },
						titlecaps: { type: "string", optional: true },
						titlefont: { type: "string", optional: true },
						titleleft: { type: "string", optional: true },
						titlespace: { type: "string", optional: true },
						topmargin: { type: "string", optional: true },
						topspace: { type: "string", optional: true },
						vocalfont: { type: "string", optional: true },
						vocalspace: { type: "string", optional: true },
						voicefont: { type: "string", optional: true },
						wordsspace: { type: "string", optional: true }
					}
				},
				lines: {type:"array",
					items: { type: "object",
						properties: {
							subtitle: { type: "string", optional: true },
							staff: { type: "array", optional: true, output: "noindex",
								items: { type: "union",
									field: "el_type",
									types: [
										{ value: "clef", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											type: { type: 'string', Enum: [ 'treble', 'tenor', 'bass', 'alto', 'treble+8', 'tenor+8', 'bass+8', 'alto+8', 'treble-8', 'tenor-8', 'bass-8', 'alto-8', 'none' ] }
										} },
										{ value: "bar", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											chord: { type: 'object', optional: true, properties: {
													name: { type: 'string'},
													position: { type: 'string'}
												}
											},
											decoration: decorationList,
											number: { type: 'string', optional: true },
											type: { type: 'string', Enum: [ 'bar_dbl_repeat', 'bar_right_repeat', 'bar_left_repeat', 'bar_invisible', 'bar_thick_thin', 'bar_thin_thin', 'bar_thin', 'bar_thin_thick' ] }
										} },
										{ value: "key", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											extraAccidentals: { type: 'array', optional: true, output: "noindex", items: {
													type: 'object', properties: {
														acc: { type: 'string', Enum: [ 'flat', 'natural', 'sharp'] },
														note: { type: 'string', Enum: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g' ] }
													}
											} },
											regularKey: { type: 'object', optional: true,
												properties: {
													num: { type: 'number'},
													acc: { type: 'string', Enum: [ 'sharp', 'flat' ]}
												}
											}
										} },
										{ value: "meter", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											type: { type: 'string' },
											num: { type: 'string', optional: true },	// TODO-PER: Check for type=specified and require these in that case.
											den: { type: 'string', optional: true }
										} },
										{ value: "part", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											title: { type: 'string' }
										} },

										{ value: "note", properties: {
											startChar: { type: 'number', output: 'hidden' },
											endChar: { type: 'number', output: 'hidden' },
											accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural' ], optional: true },
											chord: { type: 'object', optional: true, properties: {
													name: { type: 'string'},
													position: { type: 'string'}
												}
											},
											decoration: decorationList,
											duration: { type: 'number', optional: true },	// TODO-PER: Straighten this out.
											endSlur: { type: 'number', minimum: 1, optional: true },
											endTie: { type: 'boolean', Enum: [ true ], optional: true },
											endTriplet: { type: 'boolean', Enum: [ true ], optional: true },
											end_beam: { type: 'boolean', Enum: [ true ], optional: true },
											gracenotes: { type: 'array', optional: true, output: "noindex", items: {
												type: "object", properties: {
													accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural' ], optional: true },
													duration: { type: 'number' },
													end_beam: { type: 'boolean', Enum: [ true ], optional: true },
													endSlur: { type: 'number', minimum: 1, optional: true },
													endTie: { type: 'boolean', Enum: [ true ], optional: true },
													pitch: { type: 'number' },
													startSlur: { type: 'number', minimum: 1, optional: true },
													startTie: { type: 'boolean', Enum: [ true ], optional: true }
												}
											}},
											lyric: { type: 'array', optional: true, output: "noindex", items: {
												type: 'object', properties: {
												syllable: { type :'string' },
												divider: { type: 'string', Enum: [ '-', ' ', '_' ]}
											}}},
										// TODO-PER: either pitch or pitches must be present. Test for that.
											pitch: { optional: true, type: [ { type: 'number', prohibits: [ 'rest_type', 'pitches' ]}, { type: 'null', requires: ['rest_type'], prohibits: [ 'startSlur', 'startTie', 'startTriplet', 'endSlur', 'endTie', 'endTriplet', 'end_beam', 'grace_notes', 'lyric' ] } ] },
											pitches: { type: 'array',  optional: true, output: "noindex", prohibits: [ 'pitch', 'duration' ], items: {
													type: 'object', properties: {
														endChar: { type: 'number', output: 'hidden' },
														accidental: { type: 'string', Enum: [ 'sharp', 'flat', 'natural' ], optional: true },
														duration: { type: 'number' },
														endSlur: { type: 'number', minimum: 1, optional: true },
														endTie: { type: 'boolean', Enum: [ true ], optional: true },
														pitch: { type: 'number' },
														startSlur: { type: 'number', minimum: 1, optional: true },
														startTie: { type: 'boolean', Enum: [ true ], optional: true }
													}
											}},
											rest_type: { type: 'string', optional: true },
											startSlur: { type: 'number', minimum: 1, optional: true },
											startTie: { type: 'boolean', Enum: [ true ], optional: true },
											startTriplet: { type: 'number', minimum: 2, maximum: 9, optional: true }
										}}
									]
								}
							}
						}
					}
				},
				metaText: {type:"object",
					properties: {
						author: { type: "string", optional: true },
						book: { type: "string", optional: true },
						composer: { type: "string", optional: true },
						discography: { type: "string", optional: true },
						history: { type: "string", optional: true },
						notes: { type: "string", optional: true },
						origin: { type: "string", optional: true },
						partOrder: { type: "string", optional: true },
						rhythm: { type: "string", optional: true },
						source: { type: "string", optional: true },
						tempo: { type: "object", optional: true, properties: {
							duration: { type: "number"},
							bpm: { type: "number"}
						}},
						title: { type: "string", optional: true },
						transcription: { type: "string", optional: true },
						unalignedWords: { type: "string", optional: true },
						url: { type: "string", optional: true }
					}
				}
			}
		};

		this.lint = function(tune, warnings) {
			var ret = JSONSchema.validate(tune, musicSchema);
			var err = "";
			ret.errors.each(function(e) {
				err += e.property + ": " + e.message + "\n";
			});
			var out = ret.output.join("\n");
			
			var warn = warnings === null ? "No errors" : warnings.join('\n');
			warn = warn.gsub('<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">', '$$$$');
			warn = warn.gsub('</span>', '$$$$');
			return "Error:------\n" + err + "\nObj:-------\n" + out + "\nWarn:------\n" + warn;
		};
	}
});


