describe("Selection", function() {
	var abcMultiple = 'X:1\n' +
'M:4/4\n' +
'L:1/16\n' +
'%%titlefont Times New Roman 22.0\n' +
'%%vocalfont Helvetica 10.0\n' +
'%%voicefont Helvetica-Bold 10.0\n' +
'%%measurefont Times-Italic 11\n' +
'%%partsfont box\n' +
'%%stretchlast .7\n' +
'%%musicspace 0\n' +
'%%barnumbers 1\n' +
'T: Selection Test\n' +
'T: Everything should be selectable\n' +
'C: public domain\n' +
'R: Hit it\n' +
'A: Yours Truly\n' +
'S: My own testing\n' +
'W: Now is the time for all good men\n' +
'W:\n' +
'W: To come to the aid of their party.\n' +
'H: This shows every type of thing that can possibly be drawn.\n' +
'H:\n' +
'H: And two lines of history!\n' +
'Q: "Easy Swing" 1/4=140\n' +
'P: AABB\n' +
'%%staves {(PianoRightHand extra) (PianoLeftHand)}\n' +
'V:PianoRightHand clef=treble name=RH\n' +
'V:PianoLeftHand clef=bass name=LH\n' +
'K:Bb\n' +
'P:A\n' +
'%%text there is some random text\n' +
'[V: PianoRightHand] !mp![b8B8d8] f3g f4|!<(![d12b12] !<)![b4g4]|z4 !<(! (bfdf) (3B2d2c2 !<)!B4|[Q:"left" 1/4=170"right"]!f![c4f4] z4 [b8d8]| !p![G8e8] Tu[c8f8]|!<(![d12f12] !<)!g4|\n' +
'!f!a4 [g4b4] z4 =e4|[A8c8f8] d8|1 [c8F8] [B4G4] z4|[d12B12] A4|!>(![D8A8] Bcde fAB!>)!c|!mp!d16|]\n' +
'w:Strang- ers in the night\n' +
'[V: extra] B,4- B,4- B,4 B,4 | "Bb"{C}B,4 {CD}B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 |\n' +
'B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |"^annotation"B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |\n' +
'[V: PianoLeftHand] B,6 D2 [F,8F8A,8]|B,2B,,2 C,4 D,4 E,F,G,2|F,2A,2 D4 D4 G,2E,2|[C4F,4A,4] z4 [F8B,8]|G,8 A,8|A,12 B,G,D,E,|\n' +
'F,G,A,F, (G,A,B,G,) C4 C4|[C,8A,8] [F8F,8B,8]|A,3C B,3D G,F,E,D, F,2A,2|D,2C,2 B,,2A,,2 G,,4 F,,A,,C,F,|F,,6 D,,2 [D,4G,,4] z4|B,,16|]\n';

	var expectedMultiple = [
		{
			"draggable": false,
			"svgEl": {
				"x": "385",
				"y": "51.56",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "0"
			},
			"abcEl": {
				"el_type": "title",
				"name":"title",
				"startChar":202,
				"endChar":219,
				"text": "Selection Test"
			},
			"size": {
				"x": 304,
				"y": 26,
				"width": 163,
				"height": 32
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "385",
				"y": "82.34",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "1"
			},
			"abcEl": {
				"el_type": "subtitle",
				"name":"subtitle",
				"startChar":220,
				"endChar":254,
				"text": "Everything should be selectable"
			},
			"size": {
				"x": 251,
				"y": 63,
				"width": 268,
				"height": 24
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "113.9",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "2"
			},
			"abcEl": {
				"el_type": "rhythm",
				"name":"rhythm",
				"startChar":272,
				"endChar":281,
				"text": "Hit it"
			},
			"size": {
				"x": 14,
				"y": 97,
				"width": 40,
				"height": 22
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "755",
				"y": "113.9",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "3"
			},
			"abcEl": {
				"el_type": "composer",
				"name":"composer",
				"startChar":255,
				"endChar":271,
				"text": "public domain"
			},
			"size": {
				"x": 644,
				"y": 97,
				"width": 111,
				"height": 22
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "755",
				"y": "137.9",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "4"
			},
			"abcEl": {
				"el_type": "author",
				"name":"author",
				"startChar":282,
				"endChar":296,
				"text": "Yours Truly"
			},
			"size": {
				"x": 668,
				"y": 121,
				"width": 87,
				"height": 22
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "5"
			},
			"abcEl": {
				"el_type": "partOrder",
				"name":"part-order",
				"startChar":510,
				"endChar":517,
				"text": "AABB"
			},
			"size": {
				"x": 15,
				"y": 143,
				"width": 61,
				"height": 28
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "208.4",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "6"
			},
			"abcEl": {
				"el_type": "freeText",
				"name":"free-text",
				"startChar":648,
				"endChar":680,
				"text": "there is some random text"
			},
			"size": {
				"x": 15,
				"y": 189,
				"width": 217,
				"height": 24
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "7"
			},
			"abcEl": {
				"el_type": "brace",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 43,
				"y": 369,
				"width": 8,
				"height": 155
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "376.74",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "8"
			},
			"abcEl": {
				"el_type": "voiceName",
				"startChar": -1,
				"endChar": -1,
				"text": "RH"
			},
			"size": {
				"x": 15,
				"y": 365,
				"width": 19,
				"height": 15
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "9"
			},
			"abcEl": {
				"type": "treble",
				"verticalPos": 0,
				"clefPos": 4,
				"el_type": "clef"
			},
			"size": {
				"x": 58,
				"y": 354,
				"width": 19,
				"height": 57
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "10"
			},
			"abcEl": {
				"accidentals": [
					{
						"acc": "flat",
						"note": "B",
						"verticalPos": 6
					},
					{
						"acc": "flat",
						"note": "e",
						"verticalPos": 9
					}
				],
				"root": "B",
				"acc": "b",
				"mode": "",
				"el_type":"keySignature",
			},
			"size": {
				"x": 88,
				"y": 358,
				"width": 16,
				"height": 30
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "11"
			},
			"abcEl": {
				"type": "specified",
				"value": [
					{
						"num": "4",
						"den": "4"
					}
				],
				"el_type": "timeSignature"
			},
			"size": {
				"x": 114,
				"y": 369,
				"width": 12,
				"height": 30
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "12"
			},
			"abcEl": {
				"startChar":486,
				"endChar":509,
				"preString": "Easy Swing",
				"duration": [
					0.25
				],
				"bpm": 140,
				"type": "tempo",
				"el_type": "tempo"
			},
			"size": {
				"x": 136,
				"y": 215,
				"width": 167,
				"height": 23
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "13"
			},
			"abcEl": {
				"title": "A",
				"el_type": "part",
				"startChar": 644,
				"endChar": 647
			},
			"size": {
				"x": 136,
				"y": 238,
				"width": 19,
				"height": 28
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "14"
			},
			"abcEl": {
				"decoration": [
					"mp"
				],
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 6
					},
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": 13,
						"name": "b",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"el_type": "note",
				"startChar": 700,
				"endChar": 714,
				"averagepitch": 9,
				"minpitch": 6,
				"maxpitch": 13
			},
			"size": {
				"x": 134,
				"y": 330,
				"width": 14,
				"height": 58
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "15"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 16
					}
				],
				"duration": 0.1875,
				"el_type": "note",
				"startChar": 714,
				"endChar": 716,
				"startBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 176,
				"y": 337,
				"width": 16,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "16"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 11,
						"name": "g",
						"verticalPos": 11,
						"highestVert": 17
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 716,
				"endChar": 718,
				"endBeam": true,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 193,
				"y": 329,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "17"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 16
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 718,
				"endChar": 720,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 204,
				"y": 337,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "18"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 2,
				"el_type": "bar",
				"startChar": 720,
				"endChar": 721
			},
			"size": {
				"x": 216,
				"y": 346,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "19"
			},
			"abcEl": {
				"decoration": [
					"crescendo("
				],
				"duration": 0.75,
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": 13,
						"name": "b",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"el_type": "note",
				"startChar": 721,
				"endChar": 734,
				"averagepitch": 10.5,
				"minpitch": 8,
				"maxpitch": 13
			},
			"size": {
				"x": 242,
				"y": 325,
				"width": 19,
				"height": 51
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "20"
			},
			"abcEl": {
				"decoration": [
					"crescendo)"
				],
				"duration": 0.25,
				"pitches": [
					{
						"pitch": 11,
						"name": "g",
						"verticalPos": 11,
						"highestVert": 11
					},
					{
						"pitch": 13,
						"name": "b",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"el_type": "note",
				"startChar": 734,
				"endChar": 744,
				"averagepitch": 12,
				"minpitch": 11,
				"maxpitch": 13
			},
			"size": {
				"x": 315,
				"y": 325,
				"width": 14,
				"height": 39
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "21"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 3,
				"el_type": "bar",
				"startChar": 744,
				"endChar": 745
			},
			"size": {
				"x": 350,
				"y": 346,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "22"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 745,
				"endChar": 748,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 365,
				"y": 352,
				"width": 8,
				"height": 22
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "23"
			},
			"abcEl": {
				"decoration": [
					"crescendo("
				],
				"pitches": [
					{
						"pitch": 13,
						"name": "b",
						"startSlur": [
							{
								"label": 101
							}
						],
						"verticalPos": 13,
						"highestVert": 19
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 748,
				"endChar": 755,
				"startBeam": true,
				"averagepitch": 13,
				"minpitch": 13,
				"maxpitch": 13
			},
			"size": {
				"x": 387,
				"y": 318,
				"width": 14,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "24"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 16
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 755,
				"endChar": 756,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 399,
				"y": 320,
				"width": 10,
				"height": 48
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "25"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 14
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 756,
				"endChar": 757,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 410,
				"y": 323,
				"width": 10,
				"height": 53
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "26"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 10,
						"name": "f",
						"endSlur": [
							101
						],
						"verticalPos": 10,
						"highestVert": 16
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 757,
				"endChar": 760,
				"endBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 421,
				"y": 325,
				"width": 10,
				"height": 43
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "27"
			},
			"abcEl": {
				"startTriplet": 3,
				"tripletMultiplier": 0.6666666666666666,
				"tripletR":3,
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 12
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 760,
				"endChar": 764,
				"startBeam": true,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 432,
				"y": 345,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "28"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 14
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 764,
				"endChar": 766,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 443,
				"y": 343,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "29"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 13
					}
				],
				"duration": 0.125,
				"endTriplet": true,
				"el_type": "note",
				"startChar": 766,
				"endChar": 769,
				"endBeam": true,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 453,
				"y": 341,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "30"
			},
			"abcEl": {
				"decoration": [
					"crescendo)"
				],
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 12
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 769,
				"endChar": 775,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 464,
				"y": 352,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "31"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 4,
				"el_type": "bar",
				"startChar": 775,
				"endChar": 776
			},
			"size": {
				"x": 488,
				"y": 346,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "32"
			},
			"abcEl": {
				"startChar": 776,
				"endChar": 801,
				"preString": "left",
				"duration": [
					0.25
				],
				"bpm": 170,
				"postString": "right",
				"el_type": "tempo",
				"type": "tempo"
			},
			"size": {
				"x": 503,
				"y": 212,
				"width": 145,
				"height": 22
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "33"
			},
			"abcEl": {
				"decoration": [
					"f"
				],
				"duration": 0.25,
				"pitches": [
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 7
					},
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"el_type": "note",
				"startChar": 801,
				"endChar": 811,
				"averagepitch": 8.5,
				"minpitch": 7,
				"maxpitch": 10
			},
			"size": {
				"x": 503,
				"y": 337,
				"width": 10,
				"height": 43
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "34"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 811,
				"endChar": 814,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 519,
				"y": 352,
				"width": 8,
				"height": 22
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "35"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": 13,
						"name": "b",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"el_type": "note",
				"startChar": 814,
				"endChar": 820,
				"averagepitch": 10.5,
				"minpitch": 8,
				"maxpitch": 13
			},
			"size": {
				"x": 534,
				"y": 325,
				"width": 14,
				"height": 51
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "36"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 5,
				"el_type": "bar",
				"startChar": 820,
				"endChar": 821
			},
			"size": {
				"x": 565,
				"y": 346,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "37"
			},
			"abcEl": {
				"decoration": [
					"p"
				],
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 4,
						"name": "G",
						"verticalPos": 4,
						"highestVert": 4
					},
					{
						"pitch": 9,
						"name": "e",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"el_type": "note",
				"startChar": 821,
				"endChar": 832,
				"averagepitch": 6.5,
				"minpitch": 4,
				"maxpitch": 9
			},
			"size": {
				"x": 580,
				"y": 341,
				"width": 10,
				"height": 51
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "38"
			},
			"abcEl": {
				"decoration": [
					"trill",
					"upbow"
				],
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 7
					},
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"el_type": "note",
				"startChar": 832,
				"endChar": 840,
				"averagepitch": 8.5,
				"minpitch": 7,
				"maxpitch": 10
			},
			"size": {
				"x": 608,
				"y": 299,
				"width": 18,
				"height": 81
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "39"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 6,
				"el_type": "bar",
				"startChar": 840,
				"endChar": 841
			},
			"size": {
				"x": 642,
				"y": 346,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "40"
			},
			"abcEl": {
				"decoration": [
					"crescendo("
				],
				"duration": 0.75,
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"el_type": "note",
				"startChar": 841,
				"endChar": 854,
				"averagepitch": 9,
				"minpitch": 8,
				"maxpitch": 10
			},
			"size": {
				"x": 657,
				"y": 337,
				"width": 17,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "41"
			},
			"abcEl": {
				"decoration": [
					"crescendo)"
				],
				"pitches": [
					{
						"pitch": 11,
						"name": "g",
						"verticalPos": 11,
						"highestVert": 17
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 854,
				"endChar": 860,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 707,
				"y": 333,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "42"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 860,
				"endChar": 861
			},
			"size": {
				"x": 755,
				"y": 364,
				"width": 1,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "43"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1,
				"decoration": "mp"
			},
			"size": {
				"x": 134,
				"y": 444,
				"width": 27,
				"height": 13
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "44"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 244,
				"y": 442,
				"width": 72,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "45"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": 747,
				"endChar": 761
			},
			"size": {
				"x": 399,
				"y": 330,
				"width": 26,
				"height": 5
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "46"
			},
			"abcEl": {
				"el_type": "triplet",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 444,
				"y": 323,
				"width": 8,
				"height": 17
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "47"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 389,
				"y": 442,
				"width": 76,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "48"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1,
				"decoration": "f"
			},
			"size": {
				"x": 500,
				"y": 439,
				"width": 16,
				"height": 19
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "49"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1,
				"decoration": "p"
			},
			"size": {
				"x": 576,
				"y": 444,
				"width": 15,
				"height": 13
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "50"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 657,
				"y": 442,
				"width": 50,
				"height": 8
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "51"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"startTie": {},
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 997,
				"endChar": 1003,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 134,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "52"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"startTie": {},
						"endTie": true,
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1003,
				"endChar": 1008,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 150,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "53"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"endTie": true,
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1008,
				"endChar": 1012,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 174,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "54"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1012,
				"endChar": 1016,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 202,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "55"
			},
			"abcEl": {
				"chord": [
					{
						"name": "B♭",
						"position": "default"
					}
				],
				"gracenotes": [
					{
						"pitch": 0,
						"name": "C",
						"duration": 0.125,
						"verticalPos": 0
					}
				],
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1017,
				"endChar": 1029,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 233,
				"y": 279,
				"width": 29,
				"height": 155
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "56"
			},
			"abcEl": {
				"gracenotes": [
					{
						"pitch": 0,
						"name": "C",
						"duration": 0.125,
						"verticalPos": 0
					},
					{
						"pitch": 1,
						"name": "D",
						"duration": 0.125,
						"verticalPos": 1
					}
				],
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1029,
				"endChar": 1037,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 263,
				"y": 380,
				"width": 33,
				"height": 54
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "57"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1037,
				"endChar": 1041,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 298,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "58"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1041,
				"endChar": 1045,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 315,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "59"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1046,
				"endChar": 1051,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 363,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "60"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1051,
				"endChar": 1055,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 387,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "61"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1055,
				"endChar": 1059,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 430,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "62"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1059,
				"endChar": 1063,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 462,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "63"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1064,
				"endChar": 1069,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 501,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "64"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1069,
				"endChar": 1073,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 517,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "65"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1073,
				"endChar": 1077,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 534,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "66"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1077,
				"endChar": 1081,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 550,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "67"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1082,
				"endChar": 1087,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 578,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "68"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1087,
				"endChar": 1091,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 594,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "69"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1091,
				"endChar": 1095,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 611,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "70"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1095,
				"endChar": 1099,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 627,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "71"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1100,
				"endChar": 1105,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 655,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "72"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1105,
				"endChar": 1109,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 671,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "73"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1109,
				"endChar": 1113,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 688,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "74"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1113,
				"endChar": 1117,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 705,
				"y": 402,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "75"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 142,
				"y": 411,
				"width": 15,
				"height": 5
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "76"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 158,
				"y": 411,
				"width": 21,
				"height": 6
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "77"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": 1016,
				"endChar": 1030
			},
			"size": {
				"x": 237,
				"y": 409,
				"width": 11,
				"height": 6
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "78"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": 1028,
				"endChar": 1038
			},
			"size": {
				"x": 267,
				"y": 409,
				"width": 21,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "509.25",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "79"
			},
			"abcEl": {
				"el_type": "voiceName",
				"startChar": -1,
				"endChar": -1,
				"text": "LH"
			},
			"size": {
				"x": 15,
				"y": 497,
				"width": 17,
				"height": 15
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "80"
			},
			"abcEl": {
				"type": "bass",
				"verticalPos": -12,
				"clefPos": 8,
				"el_type": "clef"
			},
			"size": {
				"x": 58,
				"y": 488,
				"width": 20,
				"height": 23
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "81"
			},
			"abcEl": {
				"accidentals": [
					{
						"acc": "flat",
						"note": "B",
						"verticalPos": 4
					},
					{
						"acc": "flat",
						"note": "e",
						"verticalPos": 7
					}
				],
				"root": "B",
				"acc": "b",
				"mode": "",
				"el_type": "keySignature"
			},
			"size": {
				"x": 88,
				"y": 486,
				"width": 16,
				"height": 30
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "82"
			},
			"abcEl": {
				"type": "specified",
				"value": [
					{
						"num": "4",
						"den": "4"
					}
				],
				"el_type": "timeSignature"
			},
			"size": {
				"x": 114,
				"y": 489,
				"width": 12,
				"height": 30
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "83"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					}
				],
				"duration": 0.375,
				"el_type": "note",
				"startChar": 1254,
				"endChar": 1259,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 136,
				"y": 480,
				"width": 16,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "84"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 1,
						"name": "D",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1259,
				"endChar": 1262,
				"averagepitch": 13,
				"minpitch": 13,
				"maxpitch": 13
			},
			"size": {
				"x": 162,
				"y": 473,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "85"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					},
					{
						"pitch": 3,
						"name": "F",
						"verticalPos": 15,
						"highestVert": 15
					}
				],
				"el_type": "note",
				"startChar": 1262,
				"endChar": 1272,
				"averagepitch": 11,
				"minpitch": 8,
				"maxpitch": 15
			},
			"size": {
				"x": 174,
				"y": 465,
				"width": 14,
				"height": 58
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "86"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1272,
				"endChar": 1273
			},
			"size": {
				"x": 220,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "87"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1273,
				"endChar": 1276,
				"startBeam": true,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 244,
				"y": 480,
				"width": 10,
				"height": 56
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "88"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -8,
						"name": "B,,",
						"verticalPos": 4,
						"highestVert": 4
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1276,
				"endChar": 1281,
				"endBeam": true,
				"averagepitch": 4,
				"minpitch": 4,
				"maxpitch": 4
			},
			"size": {
				"x": 256,
				"y": 507,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "89"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -7,
						"name": "C,",
						"verticalPos": 5,
						"highestVert": 11
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1281,
				"endChar": 1285,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {
				"x": 284,
				"y": 481,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "90"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -6,
						"name": "D,",
						"verticalPos": 6,
						"highestVert": 6
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1285,
				"endChar": 1289,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 300,
				"y": 500,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "91"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -5,
						"name": "E,",
						"verticalPos": 7,
						"highestVert": 7
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1289,
				"endChar": 1291,
				"startBeam": true,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 317,
				"y": 496,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "92"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1291,
				"endChar": 1293,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 328,
				"y": 492,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "93"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1293,
				"endChar": 1296,
				"endBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 338,
				"y": 488,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "94"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1296,
				"endChar": 1297
			},
			"size": {
				"x": 354,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "95"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1297,
				"endChar": 1300,
				"startBeam": true,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 365,
				"y": 492,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "96"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1300,
				"endChar": 1304,
				"endBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 377,
				"y": 484,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "97"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 1,
						"name": "D",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1304,
				"endChar": 1307,
				"averagepitch": 13,
				"minpitch": 13,
				"maxpitch": 13
			},
			"size": {
				"x": 387,
				"y": 473,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "98"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 1,
						"name": "D",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1307,
				"endChar": 1310,
				"averagepitch": 13,
				"minpitch": 13,
				"maxpitch": 13
			},
			"size": {
				"x": 430,
				"y": 473,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "99"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1310,
				"endChar": 1313,
				"startBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 464,
				"y": 488,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "100"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -5,
						"name": "E,",
						"verticalPos": 7,
						"highestVert": 7
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1313,
				"endChar": 1316,
				"endBeam": true,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 476,
				"y": 496,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "101"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1316,
				"endChar": 1317
			},
			"size": {
				"x": 492,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "102"
			},
			"abcEl": {
				"duration": 0.25,
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					},
					{
						"pitch": 0,
						"name": "C",
						"verticalPos": 12,
						"highestVert": 12
					}
				],
				"el_type": "note",
				"startChar": 1317,
				"endChar": 1328,
				"averagepitch": 10,
				"minpitch": 8,
				"maxpitch": 12
			},
			"size": {
				"x": 501,
				"y": 476,
				"width": 14,
				"height": 47
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "103"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1328,
				"endChar": 1331,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 519,
				"y": 492,
				"width": 8,
				"height": 21
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "104"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					},
					{
						"pitch": 3,
						"name": "F",
						"verticalPos": 15,
						"highestVert": 15
					}
				],
				"el_type": "note",
				"startChar": 1331,
				"endChar": 1338,
				"averagepitch": 13,
				"minpitch": 11,
				"maxpitch": 15
			},
			"size": {
				"x": 534,
				"y": 465,
				"width": 14,
				"height": 47
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "105"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1338,
				"endChar": 1339
			},
			"size": {
				"x": 569,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "106"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.5,
				"el_type": "note",
				"startChar": 1339,
				"endChar": 1343,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 580,
				"y": 488,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "107"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.5,
				"el_type": "note",
				"startChar": 1343,
				"endChar": 1346,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 613,
				"y": 484,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "108"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1346,
				"endChar": 1347
			},
			"size": {
				"x": 646,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "109"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.75,
				"el_type": "note",
				"startChar": 1347,
				"endChar": 1352,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 657,
				"y": 483,
				"width": 17,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "110"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1352,
				"endChar": 1354,
				"startBeam": true,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 707,
				"y": 480,
				"width": 10,
				"height": 45
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "111"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1354,
				"endChar": 1356,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 717,
				"y": 488,
				"width": 10,
				"height": 40
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "112"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -6,
						"name": "D,",
						"verticalPos": 6,
						"highestVert": 6
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1356,
				"endChar": 1358,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 728,
				"y": 500,
				"width": 10,
				"height": 30
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "113"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -5,
						"name": "E,",
						"verticalPos": 7,
						"highestVert": 7
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1358,
				"endChar": 1360,
				"endBeam": true,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 739,
				"y": 496,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "114"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1360,
				"endChar": 1361
			},
			"size": {
				"x": 755,
				"y": 395,
				"width": 1,
				"height": 124
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "115"
			},
			"abcEl": {
				"el_type": "brace",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 15,
				"y": 636,
				"width": 8,
				"height": 151
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "116"
			},
			"abcEl": {
				"type": "treble",
				"verticalPos": 0,
				"clefPos": 4,
				"el_type": "clef"
			},
			"size": {
				"x": 25,
				"y": 618,
				"width": 24,
				"height": 61
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "117"
			},
			"abcEl": {
				"accidentals": [
					{
						"acc": "flat",
						"note": "B",
						"verticalPos": 6
					},
					{
						"acc": "flat",
						"note": "e",
						"verticalPos": 9
					}
				],
				"root": "B",
				"acc": "b",
				"mode": "",
				"el_type": "keySignature"
			},
			"size": {
				"x": 59,
				"y": 626,
				"width": 16,
				"height": 30
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "118"
			},
			"abcEl": {
				"decoration": [
					"f"
				],
				"pitches": [
					{
						"pitch": 12,
						"name": "a",
						"verticalPos": 12,
						"highestVert": 18
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 862,
				"endChar": 868,
				"lyric": [
					{
						"syllable": "Strang",
						"divider": "-"
					}
				],
				"averagepitch": 12,
				"minpitch": 12,
				"maxpitch": 12
			},
			"size": {
				"x": 86,
				"y": 601,
				"width": 43,
				"height": 125
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "119"
			},
			"abcEl": {
				"duration": 0.25,
				"pitches": [
					{
						"pitch": 11,
						"name": "g",
						"verticalPos": 11,
						"highestVert": 11
					},
					{
						"pitch": 13,
						"name": "b",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"el_type": "note",
				"startChar": 868,
				"endChar": 875,
				"lyric": [
					{
						"syllable": "ers",
						"divider": " "
					}
				],
				"averagepitch": 12,
				"minpitch": 11,
				"maxpitch": 13
			},
			"size": {
				"x": 141,
				"y": 597,
				"width": 21,
				"height": 128
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "120"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 875,
				"endChar": 878,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 193,
				"y": 624,
				"width": 8,
				"height": 21
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "121"
			},
			"abcEl": {
				"pitches": [
					{
						"accidental": "natural",
						"pitch": 9,
						"name": "=e",
						"verticalPos": 9,
						"highestVert": 15
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 878,
				"endChar": 881,
				"lyric": [
					{
						"syllable": "in",
						"divider": " "
					}
				],
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 205,
				"y": 613,
				"width": 17,
				"height": 113
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "122"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 8,
				"el_type": "bar",
				"startChar": 881,
				"endChar": 882
			},
			"size": {
				"x": 225,
				"y": 618,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "123"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 5,
						"name": "A",
						"verticalPos": 5,
						"highestVert": 5
					},
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 7
					},
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"el_type": "note",
				"startChar": 882,
				"endChar": 891,
				"lyric": [
					{
						"syllable": "the",
						"divider": " "
					}
				],
				"averagepitch": 7.333333333333333,
				"minpitch": 5,
				"maxpitch": 10
			},
			"size": {
				"x": 239,
				"y": 609,
				"width": 19,
				"height": 117
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "124"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 14
					}
				],
				"duration": 0.5,
				"el_type": "note",
				"startChar": 891,
				"endChar": 893,
				"lyric": [
					{
						"syllable": "night",
						"divider": " "
					}
				],
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 260,
				"y": 617,
				"width": 28,
				"height": 109
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "125"
			},
			"abcEl": {
				"type": "bar_thin",
				"startEnding": "1",
				"barNumber": 9,
				"el_type": "bar",
				"startChar": 893,
				"endChar": 895
			},
			"size": {
				"x": 297,
				"y": 618,
				"width": 8,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "126"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 3,
						"name": "F",
						"verticalPos": 3,
						"highestVert": 3
					},
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 7
					}
				],
				"el_type": "note",
				"startChar": 895,
				"endChar": 903,
				"averagepitch": 5,
				"minpitch": 3,
				"maxpitch": 7
			},
			"size": {
				"x": 330,
				"y": 620,
				"width": 10,
				"height": 47
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "127"
			},
			"abcEl": {
				"duration": 0.25,
				"pitches": [
					{
						"pitch": 4,
						"name": "G",
						"verticalPos": 4,
						"highestVert": 4
					},
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 6
					}
				],
				"el_type": "note",
				"startChar": 903,
				"endChar": 910,
				"averagepitch": 5,
				"minpitch": 4,
				"maxpitch": 6
			},
			"size": {
				"x": 386,
				"y": 624,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "128"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 910,
				"endChar": 912,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 429,
				"y": 624,
				"width": 8,
				"height": 21
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "129"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 10,
				"el_type": "bar",
				"startChar": 912,
				"endChar": 913
			},
			"size": {
				"x": 448,
				"y": 618,
				"width": 15,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "130"
			},
			"abcEl": {
				"duration": 0.75,
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 6
					},
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"el_type": "note",
				"startChar": 913,
				"endChar": 922,
				"averagepitch": 7,
				"minpitch": 6,
				"maxpitch": 8
			},
			"size": {
				"x": 467,
				"y": 617,
				"width": 17,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "131"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 5,
						"name": "A",
						"verticalPos": 5,
						"highestVert": 11
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 922,
				"endChar": 924,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {
				"x": 521,
				"y": 628,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "132"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 11,
				"el_type": "bar",
				"startChar": 924,
				"endChar": 925
			},
			"size": {
				"x": 562,
				"y": 618,
				"width": 14,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "133"
			},
			"abcEl": {
				"decoration": [
					"diminuendo("
				],
				"duration": 0.5,
				"pitches": [
					{
						"pitch": 1,
						"name": "D",
						"verticalPos": 1,
						"highestVert": 1
					},
					{
						"pitch": 5,
						"name": "A",
						"verticalPos": 5,
						"highestVert": 5
					}
				],
				"el_type": "note",
				"startChar": 925,
				"endChar": 936,
				"averagepitch": 3,
				"minpitch": 1,
				"maxpitch": 5
			},
			"size": {
				"x": 580,
				"y": 628,
				"width": 10,
				"height": 47
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "134"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 12
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 936,
				"endChar": 937,
				"startBeam": true,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 615,
				"y": 612,
				"width": 10,
				"height": 43
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "135"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 13
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 937,
				"endChar": 938,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 626,
				"y": 610,
				"width": 10,
				"height": 42
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "136"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 14
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 938,
				"endChar": 939,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 637,
				"y": 607,
				"width": 10,
				"height": 40
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "137"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 9,
						"name": "e",
						"verticalPos": 9,
						"highestVert": 15
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 939,
				"endChar": 941,
				"endBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 647,
				"y": 605,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "138"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 10,
						"name": "f",
						"verticalPos": 10,
						"highestVert": 16
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 941,
				"endChar": 942,
				"startBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 658,
				"y": 601,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "139"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 5,
						"name": "A",
						"verticalPos": 5,
						"highestVert": 11
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 942,
				"endChar": 943,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {
				"x": 669,
				"y": 604,
				"width": 10,
				"height": 56
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "140"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 6,
						"name": "B",
						"verticalPos": 6,
						"highestVert": 12
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 943,
				"endChar": 944,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 680,
				"y": 606,
				"width": 10,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "141"
			},
			"abcEl": {
				"decoration": [
					"diminuendo)"
				],
				"pitches": [
					{
						"pitch": 7,
						"name": "c",
						"verticalPos": 7,
						"highestVert": 13
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 944,
				"endChar": 949,
				"endBeam": true,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 691,
				"y": 609,
				"width": 10,
				"height": 43
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "142"
			},
			"abcEl": {
				"type": "bar_thin",
				"barNumber": 12,
				"el_type": "bar",
				"startChar": 949,
				"endChar": 950
			},
			"size": {
				"x": 699,
				"y": 618,
				"width": 15,
				"height": 49
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "143"
			},
			"abcEl": {
				"decoration": [
					"mp"
				],
				"pitches": [
					{
						"pitch": 8,
						"name": "d",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 1,
				"el_type": "note",
				"startChar": 950,
				"endChar": 957,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 717,
				"y": 640,
				"width": 15,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "144"
			},
			"abcEl": {
				"type": "bar_thin_thick",
				"endEnding": true,
				"el_type": "bar",
				"startChar": 957,
				"endChar": 959
			},
			"size": {
				"x": 766,
				"y": 636,
				"width": 8,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "145"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1,
				"decoration": "f"
			},
			"size": {
				"x": 104,
				"y": 542,
				"width": 16,
				"height": 19
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "146"
			},
			"abcEl": {
				"el_type": "ending",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 301,
				"y": 575,
				"width": 468,
				"height": 23
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "147"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1
			},
			"size": {
				"x": 580,
				"y": 544,
				"width": 110,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "148"
			},
			"abcEl": {
				"el_type": "dynamicDecoration",
				"startChar": -1,
				"endChar": -1,
				"decoration": "mp"
			},
			"size": {
				"x": 716,
				"y": 547,
				"width": 27,
				"height": 13
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "149"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1119,
				"endChar": 1123,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 105,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "150"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1123,
				"endChar": 1127,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 148,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "151"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1127,
				"endChar": 1131,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 191,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "152"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1131,
				"endChar": 1135,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 210,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "153"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1136,
				"endChar": 1141,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 246,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "154"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1141,
				"endChar": 1145,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 257,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "155"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1145,
				"endChar": 1149,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 272,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "156"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1149,
				"endChar": 1153,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 283,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "157"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1154,
				"endChar": 1158,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 328,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "158"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1158,
				"endChar": 1162,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 356,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "159"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1162,
				"endChar": 1166,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 384,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "160"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1166,
				"endChar": 1170,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 427,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "161"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1171,
				"endChar": 1175,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 465,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "162"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1175,
				"endChar": 1179,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 487,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "163"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1179,
				"endChar": 1183,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 508,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "164"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1183,
				"endChar": 1187,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 519,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "165"
			},
			"abcEl": {
				"chord": [
					{
						"name": "annotation",
						"position": "above"
					}
				],
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1188,
				"endChar": 1205,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 578,
				"y": 577,
				"width": 77,
				"height": 128
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "166"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1205,
				"endChar": 1209,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 589,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "167"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1209,
				"endChar": 1213,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 613,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "168"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1213,
				"endChar": 1217,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 656,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "169"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1218,
				"endChar": 1222,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 715,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "170"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1222,
				"endChar": 1226,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 726,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "171"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1226,
				"endChar": 1230,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 737,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "172"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": -1,
						"highestVert": -1
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1230,
				"endChar": 1234,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 748,
				"y": 674,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "173"
			},
			"abcEl": {
				"type": "bass",
				"verticalPos": -12,
				"clefPos": 8,
				"el_type": "clef"
			},
			"size": {
				"x": 30,
				"y": 755,
				"width": 20,
				"height": 23
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "174"
			},
			"abcEl": {
				"accidentals": [
					{
						"acc": "flat",
						"note": "B",
						"verticalPos": 4
					},
					{
						"acc": "flat",
						"note": "e",
						"verticalPos": 7
					}
				],
				"root": "B",
				"acc": "b",
				"mode": "",
				"el_type": "keySignature"
			},
			"size": {
				"x": 59,
				"y": 753,
				"width": 16,
				"height": 30
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "175"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1362,
				"endChar": 1364,
				"startBeam": true,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 107,
				"y": 759,
				"width": 10,
				"height": 29
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "176"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1364,
				"endChar": 1366,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 118,
				"y": 755,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "177"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1366,
				"endChar": 1368,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 129,
				"y": 751,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "178"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1368,
				"endChar": 1371,
				"endBeam": true,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 139,
				"y": 759,
				"width": 10,
				"height": 29
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "179"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"startSlur": [
							{
								"label": 101
							}
						],
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1371,
				"endChar": 1374,
				"startBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 150,
				"y": 755,
				"width": 10,
				"height": 29
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "180"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1374,
				"endChar": 1376,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 161,
				"y": 751,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "181"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1376,
				"endChar": 1378,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 172,
				"y": 748,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "182"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"endSlur": [
							101
						],
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1378,
				"endChar": 1382,
				"endBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 183,
				"y": 755,
				"width": 10,
				"height": 29
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "183"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 0,
						"name": "C",
						"verticalPos": 12,
						"highestVert": 12
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1382,
				"endChar": 1385,
				"averagepitch": 12,
				"minpitch": 12,
				"maxpitch": 12
			},
			"size": {
				"x": 191,
				"y": 744,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "184"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 0,
						"name": "C",
						"verticalPos": 12,
						"highestVert": 12
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1385,
				"endChar": 1387,
				"averagepitch": 12,
				"minpitch": 12,
				"maxpitch": 12
			},
			"size": {
				"x": 210,
				"y": 744,
				"width": 14,
				"height": 31
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "185"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1387,
				"endChar": 1388
			},
			"size": {
				"x": 228,
				"y": 667,
				"width": 1,
				"height": 120
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "186"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": -7,
						"name": "C,",
						"verticalPos": 5,
						"highestVert": 5
					},
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"el_type": "note",
				"startChar": 1388,
				"endChar": 1397,
				"averagepitch": 7.5,
				"minpitch": 5,
				"maxpitch": 10
			},
			"size": {
				"x": 248,
				"y": 751,
				"width": 10,
				"height": 51
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "187"
			},
			"abcEl": {
				"duration": 0.5,
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					},
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					},
					{
						"pitch": 3,
						"name": "F",
						"verticalPos": 15,
						"highestVert": 15
					}
				],
				"el_type": "note",
				"startChar": 1397,
				"endChar": 1407,
				"averagepitch": 11.333333333333334,
				"minpitch": 8,
				"maxpitch": 15
			},
			"size": {
				"x": 272,
				"y": 732,
				"width": 14,
				"height": 58
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "188"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1407,
				"endChar": 1408
			},
			"size": {
				"x": 300,
				"y": 667,
				"width": 1,
				"height": 120
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "189"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.1875,
				"el_type": "note",
				"startChar": 1408,
				"endChar": 1411,
				"startBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 330,
				"y": 750,
				"width": 16,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "190"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 0,
						"name": "C",
						"verticalPos": 12,
						"highestVert": 12
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1411,
				"endChar": 1413,
				"endBeam": true,
				"averagepitch": 12,
				"minpitch": 12,
				"maxpitch": 12
			},
			"size": {
				"x": 345,
				"y": 744,
				"width": 14,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "191"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -1,
						"name": "B,",
						"verticalPos": 11,
						"highestVert": 11
					}
				],
				"duration": 0.1875,
				"el_type": "note",
				"startChar": 1413,
				"endChar": 1416,
				"startBeam": true,
				"averagepitch": 11,
				"minpitch": 11,
				"maxpitch": 11
			},
			"size": {
				"x": 358,
				"y": 748,
				"width": 16,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "192"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": 1,
						"name": "D",
						"verticalPos": 13,
						"highestVert": 13
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1416,
				"endChar": 1418,
				"endBeam": true,
				"averagepitch": 13,
				"minpitch": 13,
				"maxpitch": 13
			},
			"size": {
				"x": 373,
				"y": 740,
				"width": 14,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "193"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -3,
						"name": "G,",
						"verticalPos": 9,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1418,
				"endChar": 1420,
				"startBeam": true,
				"averagepitch": 9,
				"minpitch": 9,
				"maxpitch": 9
			},
			"size": {
				"x": 386,
				"y": 755,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "194"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1420,
				"endChar": 1422,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 397,
				"y": 759,
				"width": 10,
				"height": 36
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "195"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -5,
						"name": "E,",
						"verticalPos": 7,
						"highestVert": 7
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1422,
				"endChar": 1424,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 408,
				"y": 763,
				"width": 10,
				"height": 34
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "196"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -6,
						"name": "D,",
						"verticalPos": 6,
						"highestVert": 6
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1424,
				"endChar": 1427,
				"endBeam": true,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 418,
				"y": 767,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "197"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 8
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1427,
				"endChar": 1430,
				"startBeam": true,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 429,
				"y": 759,
				"width": 10,
				"height": 33
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "198"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -2,
						"name": "A,",
						"verticalPos": 10,
						"highestVert": 10
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1430,
				"endChar": 1433,
				"endBeam": true,
				"averagepitch": 10,
				"minpitch": 10,
				"maxpitch": 10
			},
			"size": {
				"x": 440,
				"y": 751,
				"width": 10,
				"height": 37
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "199"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1433,
				"endChar": 1434
			},
			"size": {
				"x": 456,
				"y": 667,
				"width": 1,
				"height": 120
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "200"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -6,
						"name": "D,",
						"verticalPos": 6,
						"highestVert": 12
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1434,
				"endChar": 1437,
				"startBeam": true,
				"averagepitch": 6,
				"minpitch": 6,
				"maxpitch": 6
			},
			"size": {
				"x": 467,
				"y": 740,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "201"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -7,
						"name": "C,",
						"verticalPos": 5,
						"highestVert": 11
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1437,
				"endChar": 1441,
				"endBeam": true,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {
				"x": 478,
				"y": 744,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "202"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -8,
						"name": "B,,",
						"verticalPos": 4,
						"highestVert": 10
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1441,
				"endChar": 1445,
				"startBeam": true,
				"averagepitch": 4,
				"minpitch": 4,
				"maxpitch": 4
			},
			"size": {
				"x": 489,
				"y": 748,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "203"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -9,
						"name": "A,,",
						"verticalPos": 3,
						"highestVert": 9
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1445,
				"endChar": 1450,
				"endBeam": true,
				"averagepitch": 3,
				"minpitch": 3,
				"maxpitch": 3
			},
			"size": {
				"x": 499,
				"y": 752,
				"width": 10,
				"height": 35
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "204"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -10,
						"name": "G,,",
						"verticalPos": 2,
						"highestVert": 8
					}
				],
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1450,
				"endChar": 1455,
				"averagepitch": 2,
				"minpitch": 2,
				"maxpitch": 2
			},
			"size": {
				"x": 510,
				"y": 759,
				"width": 10,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "205"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -11,
						"name": "F,,",
						"verticalPos": 1,
						"highestVert": 7
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1455,
				"endChar": 1458,
				"startBeam": true,
				"averagepitch": 1,
				"minpitch": 1,
				"maxpitch": 1
			},
			"size": {
				"x": 521,
				"y": 736,
				"width": 10,
				"height": 58
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "206"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -9,
						"name": "A,,",
						"verticalPos": 3,
						"highestVert": 9
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1458,
				"endChar": 1461,
				"averagepitch": 3,
				"minpitch": 3,
				"maxpitch": 3
			},
			"size": {
				"x": 532,
				"y": 733,
				"width": 10,
				"height": 53
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "207"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -7,
						"name": "C,",
						"verticalPos": 5,
						"highestVert": 11
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1461,
				"endChar": 1463,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {
				"x": 543,
				"y": 731,
				"width": 10,
				"height": 48
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "208"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -4,
						"name": "F,",
						"verticalPos": 8,
						"highestVert": 14
					}
				],
				"duration": 0.0625,
				"el_type": "note",
				"startChar": 1463,
				"endChar": 1465,
				"endBeam": true,
				"averagepitch": 8,
				"minpitch": 8,
				"maxpitch": 8
			},
			"size": {
				"x": 553,
				"y": 728,
				"width": 10,
				"height": 39
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "209"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1465,
				"endChar": 1466
			},
			"size": {
				"x": 569,
				"y": 667,
				"width": 1,
				"height": 120
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "210"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -11,
						"name": "F,,",
						"verticalPos": 1,
						"highestVert": 7
					}
				],
				"duration": 0.375,
				"el_type": "note",
				"startChar": 1466,
				"endChar": 1471,
				"averagepitch": 1,
				"minpitch": 1,
				"maxpitch": 1
			},
			"size": {
				"x": 580,
				"y": 763,
				"width": 16,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "211"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -13,
						"name": "D,,",
						"verticalPos": -1,
						"highestVert": 5
					}
				],
				"duration": 0.125,
				"el_type": "note",
				"startChar": 1471,
				"endChar": 1476,
				"averagepitch": -1,
				"minpitch": -1,
				"maxpitch": -1
			},
			"size": {
				"x": 596,
				"y": 771,
				"width": 17,
				"height": 31
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "212"
			},
			"abcEl": {
				"duration": 0.25,
				"pitches": [
					{
						"pitch": -10,
						"name": "G,,",
						"verticalPos": 2,
						"highestVert": 2
					},
					{
						"pitch": -6,
						"name": "D,",
						"verticalPos": 6,
						"highestVert": 6
					}
				],
				"el_type": "note",
				"startChar": 1476,
				"endChar": 1486,
				"averagepitch": 4,
				"minpitch": 2,
				"maxpitch": 6
			},
			"size": {
				"x": 615,
				"y": 744,
				"width": 10,
				"height": 47
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "213"
			},
			"abcEl": {
				"rest": {
					"type": "rest"
				},
				"duration": 0.25,
				"el_type": "note",
				"startChar": 1486,
				"endChar": 1488,
				"averagepitch": 7,
				"minpitch": 7,
				"maxpitch": 7
			},
			"size": {
				"x": 657,
				"y": 759,
				"width": 8,
				"height": 21
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "214"
			},
			"abcEl": {
				"type": "bar_thin",
				"el_type": "bar",
				"startChar": 1488,
				"endChar": 1489
			},
			"size": {
				"x": 706,
				"y": 667,
				"width": 1,
				"height": 120
			}
		},
		{
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "215"
			},
			"abcEl": {
				"pitches": [
					{
						"pitch": -8,
						"name": "B,,",
						"verticalPos": 4,
						"highestVert": 4
					}
				],
				"duration": 1,
				"el_type": "note",
				"startChar": 1489,
				"endChar": 1494,
				"averagepitch": 4,
				"minpitch": 4,
				"maxpitch": 4
			},
			"size": {
				"x": 717,
				"y": 775,
				"width": 15,
				"height": 8
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "216"
			},
			"abcEl": {
				"type": "bar_thin_thick",
				"el_type": "bar",
				"startChar": 1494,
				"endChar": 1496
			},
			"size": {
				"x": 766,
				"y": 667,
				"width": 8,
				"height": 120
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "217"
			},
			"abcEl": {
				"el_type": "slur",
				"startChar": 1370,
				"endChar": 1383
			},
			"size": {
				"x": 156,
				"y": 743,
				"width": 30,
				"height": 7
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "218"
			},
			"abcEl": {
				"el_type": "unalignedWords",
				"name": "unalignedWords",
				"startChar": -1,
				"endChar": -1,
				"text": ""
			},
			"size": {
				"x": 15,
				"y": 832,
				"width": 278,
				"height": 74
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "974.87",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "219"
			},
			"abcEl": {
				"el_type": "extraText",
				"name": "description",
				"startChar": -2,
				"endChar": -2,
				"text": "Source: My own testing"
			},
			"size": {
				"x": 15,
				"y": 956,
				"width": 201,
				"height": 24
			}
		},
		{
			"draggable": false,
			"svgEl": {
				"x": "15",
				"y": "1000.87",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "220"
			},
			"abcEl": {
				"el_type": "extraText",
				"name": "description",
				"startChar": -2,
				"endChar": -2,
				"text": "History:\nThis shows every type of thing that can possibly be drawn.\n\nAnd two lines of history!"
			},
			"size": {
				"x": 15,
				"y": 987,
				"width": 494,
				"height": 100
			}
		},
	]

	var expectedNone = [{
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "0"},
		"abcEl": {
			"decoration": ["mp"],
			"duration": 0.5,
			"pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 6}, {"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}, {"pitch": 13, "name": "b", "verticalPos": 13, "highestVert": 13}],
			"el_type": "note",
			"startChar": 700,
			"endChar": 714,
			"averagepitch": 9,
			"minpitch": 6,
			"maxpitch": 13
		},
		"size": {"x": 134, "y": 325, "width": 14, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "1"},
		"abcEl": {"pitches": [{"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 16}], "duration": 0.1875, "el_type": "note", "startChar": 714, "endChar": 716, "startBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 176, "y": 333, "width": 16, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "2"},
		"abcEl": {"pitches": [{"pitch": 11, "name": "g", "verticalPos": 11, "highestVert": 17}], "duration": 0.0625, "el_type": "note", "startChar": 716, "endChar": 718, "endBeam": true, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 193, "y": 329, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "3"},
		"abcEl": {"pitches": [{"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 16}], "duration": 0.25, "el_type": "note", "startChar": 718, "endChar": 720, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 204, "y": 337, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "4"},
		"abcEl": {
			"decoration": ["crescendo("],
			"duration": 0.75,
			"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}, {"pitch": 13, "name": "b", "verticalPos": 13, "highestVert": 13}],
			"el_type": "note",
			"startChar": 721,
			"endChar": 734,
			"averagepitch": 10.5,
			"minpitch": 8,
			"maxpitch": 13
		},
		"size": {"x": 242, "y": 325, "width": 19, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "5"},
		"abcEl": {
			"decoration": ["crescendo)"],
			"duration": 0.25,
			"pitches": [{"pitch": 11, "name": "g", "verticalPos": 11, "highestVert": 11}, {"pitch": 13, "name": "b", "verticalPos": 13, "highestVert": 13}],
			"el_type": "note",
			"startChar": 734,
			"endChar": 744,
			"averagepitch": 12,
			"minpitch": 11,
			"maxpitch": 13
		},
		"size": {"x": 315, "y": 325, "width": 14, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "6"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 745, "endChar": 748, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 365, "y": 352, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "7"},
		"abcEl": {
			"decoration": ["crescendo("],
			"pitches": [{"pitch": 13, "name": "b", "startSlur": [{"label": 101}], "verticalPos": 13, "highestVert": 19}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 748,
			"endChar": 755,
			"startBeam": true,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 387, "y": 318, "width": 14, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "8"},
		"abcEl": {"pitches": [{"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 16}], "duration": 0.0625, "el_type": "note", "startChar": 755, "endChar": 756, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 399, "y": 320, "width": 10, "height": 48}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "9"},
		"abcEl": {"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 14}], "duration": 0.0625, "el_type": "note", "startChar": 756, "endChar": 757, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 410, "y": 323, "width": 10, "height": 53}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "10"},
		"abcEl": {"pitches": [{"pitch": 10, "name": "f", "endSlur": [101], "verticalPos": 10, "highestVert": 16}], "duration": 0.0625, "el_type": "note", "startChar": 757, "endChar": 760, "endBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 421, "y": 325, "width": 10, "height": 43}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "11"},
		"abcEl": {
			"startTriplet": 3,
			"tripletMultiplier": 0.6666666666666666,
			"tripletR": 3,
			"pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 12}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 760,
			"endChar": 764,
			"startBeam": true,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 432, "y": 345, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "12"},
		"abcEl": {"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 14}], "duration": 0.125, "el_type": "note", "startChar": 764, "endChar": 766, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 443, "y": 343, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "13"},
		"abcEl": {"pitches": [{"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 13}], "duration": 0.125, "endTriplet": true, "el_type": "note", "startChar": 766, "endChar": 769, "endBeam": true, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 453, "y": 341, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "14"},
		"abcEl": {"decoration": ["crescendo)"], "pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 12}], "duration": 0.25, "el_type": "note", "startChar": 769, "endChar": 775, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 464, "y": 352, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "15"},
		"abcEl": {
			"decoration": ["f"],
			"duration": 0.25,
			"pitches": [{"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 7}, {"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 10}],
			"el_type": "note",
			"startChar": 801,
			"endChar": 811,
			"averagepitch": 8.5,
			"minpitch": 7,
			"maxpitch": 10
		},
		"size": {"x": 503, "y": 337, "width": 10, "height": 43}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "16"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 811, "endChar": 814, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 519, "y": 352, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "17"},
		"abcEl": {"duration": 0.5, "pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}, {"pitch": 13, "name": "b", "verticalPos": 13, "highestVert": 13}], "el_type": "note", "startChar": 814, "endChar": 820, "averagepitch": 10.5, "minpitch": 8, "maxpitch": 13},
		"size": {"x": 534, "y": 325, "width": 14, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "18"},
		"abcEl": {"decoration": ["p"], "duration": 0.5, "pitches": [{"pitch": 4, "name": "G", "verticalPos": 4, "highestVert": 4}, {"pitch": 9, "name": "e", "verticalPos": 9, "highestVert": 9}], "el_type": "note", "startChar": 821, "endChar": 832, "averagepitch": 6.5, "minpitch": 4, "maxpitch": 9},
		"size": {"x": 580, "y": 341, "width": 10, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "19"},
		"abcEl": {
			"decoration": ["trill", "upbow"],
			"duration": 0.5,
			"pitches": [{"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 7}, {"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 10}],
			"el_type": "note",
			"startChar": 832,
			"endChar": 840,
			"averagepitch": 8.5,
			"minpitch": 7,
			"maxpitch": 10
		},
		"size": {"x": 608, "y": 299, "width": 18, "height": 81}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "20"},
		"abcEl": {
			"decoration": ["crescendo("],
			"duration": 0.75,
			"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}, {"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 10}],
			"el_type": "note",
			"startChar": 841,
			"endChar": 854,
			"averagepitch": 9,
			"minpitch": 8,
			"maxpitch": 10
		},
		"size": {"x": 657, "y": 337, "width": 17, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "21"},
		"abcEl": {"decoration": ["crescendo)"], "pitches": [{"pitch": 11, "name": "g", "verticalPos": 11, "highestVert": 17}], "duration": 0.25, "el_type": "note", "startChar": 854, "endChar": 860, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 707, "y": 333, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "22"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "startTie": {}, "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 997, "endChar": 1003, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 134, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "23"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "startTie": {}, "endTie": true, "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1003, "endChar": 1008, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 150, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "24"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "endTie": true, "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1008, "endChar": 1012, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 174, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "25"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1012, "endChar": 1016, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 202, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "26"},
		"abcEl": {
			"chord": [{"name": "B♭", "position": "default"}],
			"gracenotes": [{"pitch": 0, "name": "C", "duration": 0.125, "verticalPos": 0}],
			"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1017,
			"endChar": 1029,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 233, "y": 279, "width": 29, "height": 155}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "27"},
		"abcEl": {
			"gracenotes": [{"pitch": 0, "name": "C", "duration": 0.125, "verticalPos": 0}, {"pitch": 1, "name": "D", "duration": 0.125, "verticalPos": 1}],
			"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1029,
			"endChar": 1037,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 263, "y": 380, "width": 33, "height": 54}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "28"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1037, "endChar": 1041, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 298, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "29"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1041, "endChar": 1045, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 315, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "30"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1046, "endChar": 1051, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 363, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "31"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1051, "endChar": 1055, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 387, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "32"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1055, "endChar": 1059, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 430, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "33"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1059, "endChar": 1063, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 462, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "34"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1064, "endChar": 1069, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 501, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "35"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1069, "endChar": 1073, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 517, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "36"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1073, "endChar": 1077, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 534, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "37"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1077, "endChar": 1081, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 550, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "38"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1082, "endChar": 1087, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 578, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "39"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1087, "endChar": 1091, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 594, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "40"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1091, "endChar": 1095, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 611, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "41"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1095, "endChar": 1099, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 627, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "42"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1100, "endChar": 1105, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 655, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "43"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1105, "endChar": 1109, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 671, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "44"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1109, "endChar": 1113, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 688, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "45"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1113, "endChar": 1117, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 705, "y": 402, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "46"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}], "duration": 0.375, "el_type": "note", "startChar": 1254, "endChar": 1259, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 136, "y": 480, "width": 16, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "47"},
		"abcEl": {"pitches": [{"pitch": 1, "name": "D", "verticalPos": 13, "highestVert": 13}], "duration": 0.125, "el_type": "note", "startChar": 1259, "endChar": 1262, "averagepitch": 13, "minpitch": 13, "maxpitch": 13},
		"size": {"x": 162, "y": 473, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "48"},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}, {"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}, {"pitch": 3, "name": "F", "verticalPos": 15, "highestVert": 15}],
			"el_type": "note",
			"startChar": 1262,
			"endChar": 1272,
			"averagepitch": 11,
			"minpitch": 8,
			"maxpitch": 15
		},
		"size": {"x": 174, "y": 465, "width": 14, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "49"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}], "duration": 0.125, "el_type": "note", "startChar": 1273, "endChar": 1276, "startBeam": true, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 244, "y": 480, "width": 10, "height": 56}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "50"},
		"abcEl": {"pitches": [{"pitch": -8, "name": "B,,", "verticalPos": 4, "highestVert": 4}], "duration": 0.125, "el_type": "note", "startChar": 1276, "endChar": 1281, "endBeam": true, "averagepitch": 4, "minpitch": 4, "maxpitch": 4},
		"size": {"x": 256, "y": 507, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "51"},
		"abcEl": {"pitches": [{"pitch": -7, "name": "C,", "verticalPos": 5, "highestVert": 11}], "duration": 0.25, "el_type": "note", "startChar": 1281, "endChar": 1285, "averagepitch": 5, "minpitch": 5, "maxpitch": 5},
		"size": {"x": 284, "y": 481, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "52"},
		"abcEl": {"pitches": [{"pitch": -6, "name": "D,", "verticalPos": 6, "highestVert": 6}], "duration": 0.25, "el_type": "note", "startChar": 1285, "endChar": 1289, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 300, "y": 500, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "53"},
		"abcEl": {"pitches": [{"pitch": -5, "name": "E,", "verticalPos": 7, "highestVert": 7}], "duration": 0.0625, "el_type": "note", "startChar": 1289, "endChar": 1291, "startBeam": true, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 317, "y": 496, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "54"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.0625, "el_type": "note", "startChar": 1291, "endChar": 1293, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 328, "y": 492, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "55"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.125, "el_type": "note", "startChar": 1293, "endChar": 1296, "endBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 338, "y": 488, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "56"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.125, "el_type": "note", "startChar": 1297, "endChar": 1300, "startBeam": true, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 365, "y": 492, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "57"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.125, "el_type": "note", "startChar": 1300, "endChar": 1304, "endBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 377, "y": 484, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "58"},
		"abcEl": {"pitches": [{"pitch": 1, "name": "D", "verticalPos": 13, "highestVert": 13}], "duration": 0.25, "el_type": "note", "startChar": 1304, "endChar": 1307, "averagepitch": 13, "minpitch": 13, "maxpitch": 13},
		"size": {"x": 387, "y": 473, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "59"},
		"abcEl": {"pitches": [{"pitch": 1, "name": "D", "verticalPos": 13, "highestVert": 13}], "duration": 0.25, "el_type": "note", "startChar": 1307, "endChar": 1310, "averagepitch": 13, "minpitch": 13, "maxpitch": 13},
		"size": {"x": 430, "y": 473, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "60"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.125, "el_type": "note", "startChar": 1310, "endChar": 1313, "startBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 464, "y": 488, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "61"},
		"abcEl": {"pitches": [{"pitch": -5, "name": "E,", "verticalPos": 7, "highestVert": 7}], "duration": 0.125, "el_type": "note", "startChar": 1313, "endChar": 1316, "endBeam": true, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 476, "y": 496, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "62"},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}, {"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}, {"pitch": 0, "name": "C", "verticalPos": 12, "highestVert": 12}],
			"el_type": "note",
			"startChar": 1317,
			"endChar": 1328,
			"averagepitch": 10,
			"minpitch": 8,
			"maxpitch": 12
		},
		"size": {"x": 501, "y": 476, "width": 14, "height": 47}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "63"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 1328, "endChar": 1331, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 519, "y": 492, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "64"},
		"abcEl": {"duration": 0.5, "pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}, {"pitch": 3, "name": "F", "verticalPos": 15, "highestVert": 15}], "el_type": "note", "startChar": 1331, "endChar": 1338, "averagepitch": 13, "minpitch": 11, "maxpitch": 15},
		"size": {"x": 534, "y": 465, "width": 14, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "65"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.5, "el_type": "note", "startChar": 1339, "endChar": 1343, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 580, "y": 488, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "66"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.5, "el_type": "note", "startChar": 1343, "endChar": 1346, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 613, "y": 484, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "67"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.75, "el_type": "note", "startChar": 1347, "endChar": 1352, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 657, "y": 483, "width": 17, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "68"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}], "duration": 0.0625, "el_type": "note", "startChar": 1352, "endChar": 1354, "startBeam": true, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 707, "y": 480, "width": 10, "height": 45}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "69"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1354, "endChar": 1356, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 717, "y": 488, "width": 10, "height": 40}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "70"},
		"abcEl": {"pitches": [{"pitch": -6, "name": "D,", "verticalPos": 6, "highestVert": 6}], "duration": 0.0625, "el_type": "note", "startChar": 1356, "endChar": 1358, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 728, "y": 500, "width": 10, "height": 30}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "71"},
		"abcEl": {"pitches": [{"pitch": -5, "name": "E,", "verticalPos": 7, "highestVert": 7}], "duration": 0.0625, "el_type": "note", "startChar": 1358, "endChar": 1360, "endBeam": true, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 739, "y": 496, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "72"},
		"abcEl": {"decoration": ["f"], "pitches": [{"pitch": 12, "name": "a", "verticalPos": 12, "highestVert": 18}], "duration": 0.25, "el_type": "note", "startChar": 862, "endChar": 868, "lyric": [{"syllable": "Strang", "divider": "-"}], "averagepitch": 12, "minpitch": 12, "maxpitch": 12},
		"size": {"x": 86, "y": 601, "width": 43, "height": 125}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "73"},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": 11, "name": "g", "verticalPos": 11, "highestVert": 11}, {"pitch": 13, "name": "b", "verticalPos": 13, "highestVert": 13}],
			"el_type": "note",
			"startChar": 868,
			"endChar": 875,
			"lyric": [{"syllable": "ers", "divider": " "}],
			"averagepitch": 12,
			"minpitch": 11,
			"maxpitch": 13
		},
		"size": {"x": 141, "y": 597, "width": 21, "height": 128}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "74"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 875, "endChar": 878, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 193, "y": 624, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "75"},
		"abcEl": {"pitches": [{"accidental": "natural", "pitch": 9, "name": "=e", "verticalPos": 9, "highestVert": 15}], "duration": 0.25, "el_type": "note", "startChar": 878, "endChar": 881, "lyric": [{"syllable": "in", "divider": " "}], "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 205, "y": 613, "width": 17, "height": 113}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "76"},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": 5, "name": "A", "verticalPos": 5, "highestVert": 5}, {"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 7}, {"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 10}],
			"el_type": "note",
			"startChar": 882,
			"endChar": 891,
			"lyric": [{"syllable": "the", "divider": " "}],
			"averagepitch": 7.333333333333333,
			"minpitch": 5,
			"maxpitch": 10
		},
		"size": {"x": 239, "y": 609, "width": 19, "height": 117}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "77"},
		"abcEl": {"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 14}], "duration": 0.5, "el_type": "note", "startChar": 891, "endChar": 893, "lyric": [{"syllable": "night", "divider": " "}], "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 260, "y": 617, "width": 28, "height": 109}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "78"},
		"abcEl": {"duration": 0.5, "pitches": [{"pitch": 3, "name": "F", "verticalPos": 3, "highestVert": 3}, {"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 7}], "el_type": "note", "startChar": 895, "endChar": 903, "averagepitch": 5, "minpitch": 3, "maxpitch": 7},
		"size": {"x": 330, "y": 620, "width": 10, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "79"},
		"abcEl": {"duration": 0.25, "pitches": [{"pitch": 4, "name": "G", "verticalPos": 4, "highestVert": 4}, {"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 6}], "el_type": "note", "startChar": 903, "endChar": 910, "averagepitch": 5, "minpitch": 4, "maxpitch": 6},
		"size": {"x": 386, "y": 624, "width": 10, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "80"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 910, "endChar": 912, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 429, "y": 624, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "81"},
		"abcEl": {"duration": 0.75, "pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 6}, {"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}], "el_type": "note", "startChar": 913, "endChar": 922, "averagepitch": 7, "minpitch": 6, "maxpitch": 8},
		"size": {"x": 467, "y": 617, "width": 17, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "82"},
		"abcEl": {"pitches": [{"pitch": 5, "name": "A", "verticalPos": 5, "highestVert": 11}], "duration": 0.25, "el_type": "note", "startChar": 922, "endChar": 924, "averagepitch": 5, "minpitch": 5, "maxpitch": 5},
		"size": {"x": 521, "y": 628, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "83"},
		"abcEl": {
			"decoration": ["diminuendo("],
			"duration": 0.5,
			"pitches": [{"pitch": 1, "name": "D", "verticalPos": 1, "highestVert": 1}, {"pitch": 5, "name": "A", "verticalPos": 5, "highestVert": 5}],
			"el_type": "note",
			"startChar": 925,
			"endChar": 936,
			"averagepitch": 3,
			"minpitch": 1,
			"maxpitch": 5
		},
		"size": {"x": 580, "y": 628, "width": 10, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "84"},
		"abcEl": {"pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 12}], "duration": 0.0625, "el_type": "note", "startChar": 936, "endChar": 937, "startBeam": true, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 615, "y": 612, "width": 10, "height": 43}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "85"},
		"abcEl": {"pitches": [{"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 13}], "duration": 0.0625, "el_type": "note", "startChar": 937, "endChar": 938, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 626, "y": 610, "width": 10, "height": 42}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "86"},
		"abcEl": {"pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 14}], "duration": 0.0625, "el_type": "note", "startChar": 938, "endChar": 939, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 637, "y": 607, "width": 10, "height": 40}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "87"},
		"abcEl": {"pitches": [{"pitch": 9, "name": "e", "verticalPos": 9, "highestVert": 15}], "duration": 0.0625, "el_type": "note", "startChar": 939, "endChar": 941, "endBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 647, "y": 605, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "88"},
		"abcEl": {"pitches": [{"pitch": 10, "name": "f", "verticalPos": 10, "highestVert": 16}], "duration": 0.0625, "el_type": "note", "startChar": 941, "endChar": 942, "startBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 658, "y": 601, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "89"},
		"abcEl": {"pitches": [{"pitch": 5, "name": "A", "verticalPos": 5, "highestVert": 11}], "duration": 0.0625, "el_type": "note", "startChar": 942, "endChar": 943, "averagepitch": 5, "minpitch": 5, "maxpitch": 5},
		"size": {"x": 669, "y": 604, "width": 10, "height": 56}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "90"},
		"abcEl": {"pitches": [{"pitch": 6, "name": "B", "verticalPos": 6, "highestVert": 12}], "duration": 0.0625, "el_type": "note", "startChar": 943, "endChar": 944, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 680, "y": 606, "width": 10, "height": 49}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "91"},
		"abcEl": {"decoration": ["diminuendo)"], "pitches": [{"pitch": 7, "name": "c", "verticalPos": 7, "highestVert": 13}], "duration": 0.0625, "el_type": "note", "startChar": 944, "endChar": 949, "endBeam": true, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 691, "y": 609, "width": 10, "height": 43}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "92"},
		"abcEl": {"decoration": ["mp"], "pitches": [{"pitch": 8, "name": "d", "verticalPos": 8, "highestVert": 8}], "duration": 1, "el_type": "note", "startChar": 950, "endChar": 957, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 717, "y": 640, "width": 15, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "93"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1119, "endChar": 1123, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 105, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "94"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1123, "endChar": 1127, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 148, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "95"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1127, "endChar": 1131, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 191, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "96"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1131, "endChar": 1135, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 210, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "97"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1136, "endChar": 1141, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 246, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "98"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1141, "endChar": 1145, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 257, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "99"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1145, "endChar": 1149, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 272, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "100"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1149, "endChar": 1153, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 283, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "101"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1154, "endChar": 1158, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 328, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "102"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1158, "endChar": 1162, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 356, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "103"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1162, "endChar": 1166, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 384, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "104"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1166, "endChar": 1170, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 427, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "105"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1171, "endChar": 1175, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 465, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "106"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1175, "endChar": 1179, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 487, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "107"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1179, "endChar": 1183, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 508, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "108"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1183, "endChar": 1187, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 519, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "109"},
		"abcEl": {"chord": [{"name": "annotation", "position": "above"}], "pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1188, "endChar": 1205, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 578, "y": 577, "width": 77, "height": 128}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "110"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1205, "endChar": 1209, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 589, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "111"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1209, "endChar": 1213, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 613, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "112"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1213, "endChar": 1217, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 656, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "113"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1218, "endChar": 1222, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 715, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "114"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1222, "endChar": 1226, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 726, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "115"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1226, "endChar": 1230, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 737, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "116"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": -1, "highestVert": -1}], "duration": 0.25, "el_type": "note", "startChar": 1230, "endChar": 1234, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 748, "y": 674, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "117"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.0625, "el_type": "note", "startChar": 1362, "endChar": 1364, "startBeam": true, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 107, "y": 759, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "118"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1364, "endChar": 1366, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 118, "y": 755, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "119"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.0625, "el_type": "note", "startChar": 1366, "endChar": 1368, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 129, "y": 751, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "120"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.0625, "el_type": "note", "startChar": 1368, "endChar": 1371, "endBeam": true, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 139, "y": 759, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "121"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "startSlur": [{"label": 101}], "verticalPos": 9, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1371, "endChar": 1374, "startBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 150, "y": 755, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "122"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.0625, "el_type": "note", "startChar": 1374, "endChar": 1376, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 161, "y": 751, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "123"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}], "duration": 0.0625, "el_type": "note", "startChar": 1376, "endChar": 1378, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 172, "y": 748, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "124"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "endSlur": [101], "verticalPos": 9, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1378, "endChar": 1382, "endBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 183, "y": 755, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "125"},
		"abcEl": {"pitches": [{"pitch": 0, "name": "C", "verticalPos": 12, "highestVert": 12}], "duration": 0.25, "el_type": "note", "startChar": 1382, "endChar": 1385, "averagepitch": 12, "minpitch": 12, "maxpitch": 12},
		"size": {"x": 191, "y": 744, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "126"},
		"abcEl": {"pitches": [{"pitch": 0, "name": "C", "verticalPos": 12, "highestVert": 12}], "duration": 0.25, "el_type": "note", "startChar": 1385, "endChar": 1387, "averagepitch": 12, "minpitch": 12, "maxpitch": 12},
		"size": {"x": 210, "y": 744, "width": 14, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "127"},
		"abcEl": {"duration": 0.5, "pitches": [{"pitch": -7, "name": "C,", "verticalPos": 5, "highestVert": 5}, {"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "el_type": "note", "startChar": 1388, "endChar": 1397, "averagepitch": 7.5, "minpitch": 5, "maxpitch": 10},
		"size": {"x": 248, "y": 751, "width": 10, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "128"},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}, {"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}, {"pitch": 3, "name": "F", "verticalPos": 15, "highestVert": 15}],
			"el_type": "note",
			"startChar": 1397,
			"endChar": 1407,
			"averagepitch": 11.333333333333334,
			"minpitch": 8,
			"maxpitch": 15
		},
		"size": {"x": 272, "y": 732, "width": 14, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "129"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.1875, "el_type": "note", "startChar": 1408, "endChar": 1411, "startBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 330, "y": 750, "width": 16, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "130"},
		"abcEl": {"pitches": [{"pitch": 0, "name": "C", "verticalPos": 12, "highestVert": 12}], "duration": 0.0625, "el_type": "note", "startChar": 1411, "endChar": 1413, "endBeam": true, "averagepitch": 12, "minpitch": 12, "maxpitch": 12},
		"size": {"x": 345, "y": 744, "width": 14, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "131"},
		"abcEl": {"pitches": [{"pitch": -1, "name": "B,", "verticalPos": 11, "highestVert": 11}], "duration": 0.1875, "el_type": "note", "startChar": 1413, "endChar": 1416, "startBeam": true, "averagepitch": 11, "minpitch": 11, "maxpitch": 11},
		"size": {"x": 358, "y": 748, "width": 16, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "132"},
		"abcEl": {"pitches": [{"pitch": 1, "name": "D", "verticalPos": 13, "highestVert": 13}], "duration": 0.0625, "el_type": "note", "startChar": 1416, "endChar": 1418, "endBeam": true, "averagepitch": 13, "minpitch": 13, "maxpitch": 13},
		"size": {"x": 373, "y": 740, "width": 14, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "133"},
		"abcEl": {"pitches": [{"pitch": -3, "name": "G,", "verticalPos": 9, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1418, "endChar": 1420, "startBeam": true, "averagepitch": 9, "minpitch": 9, "maxpitch": 9},
		"size": {"x": 386, "y": 755, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "134"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.0625, "el_type": "note", "startChar": 1420, "endChar": 1422, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 397, "y": 759, "width": 10, "height": 36}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "135"},
		"abcEl": {"pitches": [{"pitch": -5, "name": "E,", "verticalPos": 7, "highestVert": 7}], "duration": 0.0625, "el_type": "note", "startChar": 1422, "endChar": 1424, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 408, "y": 763, "width": 10, "height": 34}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "136"},
		"abcEl": {"pitches": [{"pitch": -6, "name": "D,", "verticalPos": 6, "highestVert": 6}], "duration": 0.0625, "el_type": "note", "startChar": 1424, "endChar": 1427, "endBeam": true, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 418, "y": 767, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "137"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 8}], "duration": 0.125, "el_type": "note", "startChar": 1427, "endChar": 1430, "startBeam": true, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 429, "y": 759, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "138"},
		"abcEl": {"pitches": [{"pitch": -2, "name": "A,", "verticalPos": 10, "highestVert": 10}], "duration": 0.125, "el_type": "note", "startChar": 1430, "endChar": 1433, "endBeam": true, "averagepitch": 10, "minpitch": 10, "maxpitch": 10},
		"size": {"x": 440, "y": 751, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "139"},
		"abcEl": {"pitches": [{"pitch": -6, "name": "D,", "verticalPos": 6, "highestVert": 12}], "duration": 0.125, "el_type": "note", "startChar": 1434, "endChar": 1437, "startBeam": true, "averagepitch": 6, "minpitch": 6, "maxpitch": 6},
		"size": {"x": 467, "y": 740, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "140"},
		"abcEl": {"pitches": [{"pitch": -7, "name": "C,", "verticalPos": 5, "highestVert": 11}], "duration": 0.125, "el_type": "note", "startChar": 1437, "endChar": 1441, "endBeam": true, "averagepitch": 5, "minpitch": 5, "maxpitch": 5},
		"size": {"x": 478, "y": 744, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "141"},
		"abcEl": {"pitches": [{"pitch": -8, "name": "B,,", "verticalPos": 4, "highestVert": 10}], "duration": 0.125, "el_type": "note", "startChar": 1441, "endChar": 1445, "startBeam": true, "averagepitch": 4, "minpitch": 4, "maxpitch": 4},
		"size": {"x": 489, "y": 748, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "142"},
		"abcEl": {"pitches": [{"pitch": -9, "name": "A,,", "verticalPos": 3, "highestVert": 9}], "duration": 0.125, "el_type": "note", "startChar": 1445, "endChar": 1450, "endBeam": true, "averagepitch": 3, "minpitch": 3, "maxpitch": 3},
		"size": {"x": 499, "y": 752, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "143"},
		"abcEl": {"pitches": [{"pitch": -10, "name": "G,,", "verticalPos": 2, "highestVert": 8}], "duration": 0.25, "el_type": "note", "startChar": 1450, "endChar": 1455, "averagepitch": 2, "minpitch": 2, "maxpitch": 2},
		"size": {"x": 510, "y": 759, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "144"},
		"abcEl": {"pitches": [{"pitch": -11, "name": "F,,", "verticalPos": 1, "highestVert": 7}], "duration": 0.0625, "el_type": "note", "startChar": 1455, "endChar": 1458, "startBeam": true, "averagepitch": 1, "minpitch": 1, "maxpitch": 1},
		"size": {"x": 521, "y": 736, "width": 10, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "145"},
		"abcEl": {"pitches": [{"pitch": -9, "name": "A,,", "verticalPos": 3, "highestVert": 9}], "duration": 0.0625, "el_type": "note", "startChar": 1458, "endChar": 1461, "averagepitch": 3, "minpitch": 3, "maxpitch": 3},
		"size": {"x": 532, "y": 733, "width": 10, "height": 53}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "146"},
		"abcEl": {"pitches": [{"pitch": -7, "name": "C,", "verticalPos": 5, "highestVert": 11}], "duration": 0.0625, "el_type": "note", "startChar": 1461, "endChar": 1463, "averagepitch": 5, "minpitch": 5, "maxpitch": 5},
		"size": {"x": 543, "y": 731, "width": 10, "height": 48}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "147"},
		"abcEl": {"pitches": [{"pitch": -4, "name": "F,", "verticalPos": 8, "highestVert": 14}], "duration": 0.0625, "el_type": "note", "startChar": 1463, "endChar": 1465, "endBeam": true, "averagepitch": 8, "minpitch": 8, "maxpitch": 8},
		"size": {"x": 553, "y": 728, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "148"},
		"abcEl": {"pitches": [{"pitch": -11, "name": "F,,", "verticalPos": 1, "highestVert": 7}], "duration": 0.375, "el_type": "note", "startChar": 1466, "endChar": 1471, "averagepitch": 1, "minpitch": 1, "maxpitch": 1},
		"size": {"x": 580, "y": 763, "width": 16, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "149"},
		"abcEl": {"pitches": [{"pitch": -13, "name": "D,,", "verticalPos": -1, "highestVert": 5}], "duration": 0.125, "el_type": "note", "startChar": 1471, "endChar": 1476, "averagepitch": -1, "minpitch": -1, "maxpitch": -1},
		"size": {"x": 596, "y": 771, "width": 17, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "150"},
		"abcEl": {"duration": 0.25, "pitches": [{"pitch": -10, "name": "G,,", "verticalPos": 2, "highestVert": 2}, {"pitch": -6, "name": "D,", "verticalPos": 6, "highestVert": 6}], "el_type": "note", "startChar": 1476, "endChar": 1486, "averagepitch": 4, "minpitch": 2, "maxpitch": 6},
		"size": {"x": 615, "y": 744, "width": 10, "height": 47}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "false", "data-index": "151"},
		"abcEl": {"rest": {"type": "rest"}, "duration": 0.25, "el_type": "note", "startChar": 1486, "endChar": 1488, "averagepitch": 7, "minpitch": 7, "maxpitch": 7},
		"size": {"x": 657, "y": 759, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "false", "data-index": "152"},
		"abcEl": {"pitches": [{"pitch": -8, "name": "B,,", "verticalPos": 4, "highestVert": 4}], "duration": 1, "el_type": "note", "startChar": 1489, "endChar": 1494, "averagepitch": 4, "minpitch": 4, "maxpitch": 4},
		"size": {"x": 717, "y": 775, "width": 15, "height": 8}
	}]
//////////////////////////////////////////////////////////
	var abcTempo = 'X:1\n' +
'M:4/4\n' +
'L:1/4\n' +
'Q: "Easy Swing" 1/4=140\n' +
'K:C\n' +
'G4| [Q:"left" 1/4=170"right"] A4 |\n';

	var expectedTempo = [
		{
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "0"
			},
			"abcEl": {"type": "treble", "verticalPos": 0, "clefPos": 4, "el_type": "clef"},
			"size": {"x": 20, "y": 50, "width": 19, "height": 57}
		}, {
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "1"
			},
			"abcEl": {"type": "specified", "value": [{"num": "4", "den": "4"}], "el_type": "timeSignature"},
			"size": {"x": 49, "y": 65, "width": 12, "height": 30}
		}, {
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "2"
			},
			"abcEl": {"startChar": 16, "endChar": 39, "preString": "Easy Swing", "duration": [0.25], "bpm": 140, "type": "tempo", "el_type": "tempo"},
			"size": {"x": 71, "y": 27, "width": 167, "height": 22}
		}, {
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "3"
			},
			"abcEl": {
				"pitches": [{"pitch": 4, "name": "G", "verticalPos": 4, "highestVert": 4}],
				"duration": 1,
				"el_type": "note",
				"startChar": 44,
				"endChar": 46,
				"averagepitch": 4,
				"minpitch": 4,
				"maxpitch": 4
			},
			"size": {"x": 71, "y": 83, "width": 15, "height": 8}
		}, {
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "4"
			},
			"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 46, "endChar": 47},
			"size": {"x": 156, "y": 64, "width": 1, "height": 31}
		}, {
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "5"
			},
			"abcEl": {
				"preString": "left",
				"duration": [0.25],
				"bpm": 170,
				"postString": "right",
				"el_type": "tempo",
				"startChar": 48,
				"endChar": 73,
				"type": "tempo"
			},
			"size": {"x": 167, "y": 27, "width": 145, "height": 22}
		}, {
			"draggable": true,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "6"
			},
			"abcEl": {
				"pitches": [{"pitch": 5, "name": "A", "verticalPos": 5, "highestVert": 5}],
				"duration": 1,
				"el_type": "note",
				"startChar": 73,
				"endChar": 77,
				"averagepitch": 5,
				"minpitch": 5,
				"maxpitch": 5
			},
			"size": {"x": 167, "y": 79, "width": 15, "height": 8}
		}, {
			"draggable": false,
			"svgEl": {
				"selectable": "true",
				"tabindex": "0",
				"data-index": "7"
			},
			"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 77, "endChar": 78},
			"size": {"x": 252, "y": 64, "width": 1, "height": 31}
		}]
//////////////////////////////////////////////////////////
	var abcClefs = 'X:1\n' +
		'M:4/4\n' +
		'L:1/4\n' +
		'K:C clef=treble\n' +
		'C4 |\n' +
		'K:C clef=treble+8\n' +
		'C4 |\n' +
		'K:C clef=treble-8\n' +
		'C4 |\n' +
		'K:C clef=tenor\n' +
		'C4 |\n' +
		'K:C clef=bass-8\n' +
		'C4 |\n' +
		'K:C clef=bass+8\n' +
		'C4 |\n' +
		'K:C clef=bass\n' +
		'C4 |\n' +
		'\n';

	var expectedClefs = [
		{
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "0"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 0, "highestVert": 0}],
			"duration": 1,
			"el_type": "note",
			"startChar": 32,
			"endChar": 35,
			"averagepitch": 0,
			"minpitch": 0,
			"maxpitch": 0,
			"currentTrackMilliseconds": 0,
			"currentTrackWholeNotes": 0,
			"midiPitches": [{"cmd": "note", "pitch": 60, "volume": 105, "start": 0, "duration": 1, "instrument": 0,"startChar":32,"endChar":35, "gap": 0}]
		},
		"size": {"x": 69, "y": 83, "width": 19, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "1"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 0, "highestVert": 0}],
			"duration": 1,
			"el_type": "note",
			"startChar": 55,
			"endChar": 58,
			"averagepitch": 0,
			"minpitch": 0,
			"maxpitch": 0,
			"currentTrackMilliseconds": 1333.3333333333335,
			"currentTrackWholeNotes": 1,
			"midiPitches": [{"cmd": "note", "pitch": 72, "volume": 105, "start": 1, "duration": 1, "instrument": 0,"startChar":55,"endChar":58, "gap": 0}]
		},
		"size": {"x": 47, "y": 176, "width": 19, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "2"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 0, "highestVert": 0}],
			"duration": 1,
			"el_type": "note",
			"startChar": 78,
			"endChar": 81,
			"averagepitch": 0,
			"minpitch": 0,
			"maxpitch": 0,
			"currentTrackMilliseconds": 2666.666666666667,
			"currentTrackWholeNotes": 2,
			"midiPitches": [{"cmd": "note", "pitch": 48, "volume": 105, "start": 2, "duration": 1, "instrument": 0,"startChar":78,"endChar":81, "gap": 0}]
		},
		"size": {"x": 47, "y": 268, "width": 19, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "3"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 8, "highestVert": 8}],
			"duration": 1,
			"el_type": "note",
			"startChar": 98,
			"endChar": 101,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8,
			"currentTrackMilliseconds": 4000,
			"currentTrackWholeNotes": 3,
			"midiPitches": [{"cmd": "note", "pitch": 48, "volume": 105, "start": 3, "duration": 1, "instrument": 0,"startChar":98,"endChar":101, "gap": 0}]
		},
		"size": {"x": 50, "y": 329, "width": 15, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "4"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 12, "highestVert": 12}],
			"duration": 1,
			"el_type": "note",
			"startChar": 119,
			"endChar": 122,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12,
			"currentTrackMilliseconds": 5333.333333333334,
			"currentTrackWholeNotes": 4,
			"midiPitches": [{"cmd": "note", "pitch": 48, "volume": 105, "start": 4, "duration": 1, "instrument": 0,"startChar":119,"endChar":122, "gap": 0}]
		},
		"size": {"x": 48, "y": 406, "width": 19, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "5"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 12, "highestVert": 12}],
			"duration": 1,
			"el_type": "note",
			"startChar": 140,
			"endChar": 143,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12,
			"currentTrackMilliseconds": 6666.666666666666,
			"currentTrackWholeNotes": 5,
			"midiPitches": [{"cmd": "note", "pitch": 72, "volume": 105, "start": 5, "duration": 1, "instrument": 0,"startChar":140,"endChar":143, "gap": 0}]
		},
		"size": {"x": 48, "y": 498, "width": 19, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "6"},
		"abcEl": {
			"pitches": [{"pitch": 0, "name":"C","verticalPos": 12, "highestVert": 12}],
			"duration": 1,
			"el_type": "note",
			"startChar": 159,
			"endChar": 162,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12,
			"currentTrackMilliseconds": 8000,
			"currentTrackWholeNotes": 6,
			"midiPitches": [{"cmd": "note", "pitch": 72, "volume": 105, "start": 6, "duration": 1, "instrument": 0,"startChar":159,"endChar":162, "gap": 0}]
		},
		"size": {"x": 48, "y": 591, "width": 19, "height": 8}
	}];

//////////////////////////////////////////////////////////
	it("selection-multiple", function() {
		doSelectionTest(abcMultiple, expectedMultiple, {selectTypes: true});
	})

	it("selection-tempo", function() {
		doSelectionTest(abcTempo, expectedTempo, {selectTypes: true});
	})
	it("selection-none", function() {
		doSelectionTest(abcMultiple, expectedNone, {});
	})
	it("selection-clefs", function() {
		doSelectionTest(abcClefs, expectedClefs, {selectTypes: [ 'note' ]}, true);
	})
})

//////////////////////////////////////////////////////////

function doSelectionTest(abc, expected, options, audio) {
	var visualObj = abcjs.renderAbc("paper", abc, options);
	if (audio)
		visualObj[0].setUpAudio();
	var selection = visualObj[0].engraver.selectables;
	var results = []
	for (var i = 0; i < selection.length; i++) {
		var sel = selection[i];
		var abcEl = copyAbcEl(sel.absEl.abcelem);
		var svgEl = copySvgEl(sel.svgEl);
		var size = sel.svgEl.getBBox();
		results.push({
			draggable: sel.isDraggable, svgEl: svgEl, abcEl: abcEl,
			size: {
				x: Math.round(size.x),
				y: Math.round(size.y),
				width: Math.round(size.width),
				height: Math.round(size.height)
			}
		});
	}
	//console.log(JSON.stringify(results))
	for (i = 0; i < results.length; i++) {
		var msg = "index: " + i + "\nrcv: " + JSON.stringify(results[i]) + "\n" +
			"exp: " + JSON.stringify(expected[i]) + "\n";
		chai.assert.deepStrictEqual(results[i], expected[i], msg);
	}
}

function copyAbcEl(abcEl) {
	var el = {};
	var keys = Object.keys(abcEl);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i] !== "abselem")
			el[keys[i]] = abcEl[keys[i]];
	}
	return el;
}

var interestingAttributes = ['x', 'y', 'selectable', 'tabindex', 'data-index'];

function copySvgEl(svgEl) {
	var el = {};
	var attr = svgEl.attributes;
	for (var i = 0; i < attr.length; i++) {
		if (interestingAttributes.indexOf(attr[i].nodeName) >= 0)
			el[attr[i].nodeName] = attr[i].nodeValue;
	}
	return el;
}
