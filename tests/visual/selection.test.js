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
			"font-size": "29",
			"font-style": "normal",
			"font-family": "Times New Roman",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "middle",
			"x": "385",
			"y": "51.56",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "0"
		},
		"abcEl": {"el_type": "title", "startChar": -1, "endChar": -1, "text": "Selection Test"},
		"size": {"x": 303, "y": 26, "width": 163, "height": 32}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "21",
			"font-style": "normal",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "middle",
			"x": "385",
			"y": "79.34",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "1"
		},
		"abcEl": {"el_type": "subtitle", "startChar": -1, "endChar": -1, "text": "Everything should be selectable"},
		"size": {"x": 251, "y": 60, "width": 268, "height": 24}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "19",
			"font-style": "italic",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "start",
			"x": "15",
			"y": "108.9",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "2"
		},
		"abcEl": {"el_type": "rhythm", "startChar": -1, "endChar": -1, "text": "Hit it"},
		"size": {"x": 14, "y": 92, "width": 41, "height": 21}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "19",
			"font-style": "italic",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "end",
			"x": "755",
			"y": "108.9",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "3"
		},
		"abcEl": {"el_type": "composer", "startChar": -1, "endChar": -1, "text": "public domain"},
		"size": {"x": 644, "y": 92, "width": 111, "height": 21}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "19",
			"font-style": "italic",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "end",
			"x": "755",
			"y": "129.978125",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "4"
		},
		"abcEl": {"el_type": "author", "startChar": -1, "endChar": -1, "text": "Yours Truly"},
		"size": {"x": 668, "y": 113, "width": 88, "height": 21}
	}, {
		"draggable": false,
		"svgEl": {"fill": "#000000", "selectable": "true", "tabindex": "0", "data-index": "5"},
		"abcEl": {"el_type": "partOrder", "startChar": -1, "endChar": -1, "text": "AABB"},
		"size": {"x": 15, "y": 132, "width": 61, "height": 27}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "21",
			"font-style": "normal",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "start",
			"x": "15",
			"y": "193.5875",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "6"
		},
		"abcEl": {"el_type": "freeText", "startChar": -1, "endChar": -1, "text": "there is some random text"},
		"size": {"x": 15, "y": 175, "width": 217, "height": 24}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "#000000",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "7"
		},
		"abcEl": {"el_type": "brace", "startChar": -1, "endChar": -1},
		"size": {"x": 43, "y": 352, "width": 8, "height": 151}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "13",
			"font-style": "normal",
			"font-family": "Helvetica",
			"font-weight": "bold",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "start",
			"x": "15",
			"y": "360.248",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "8"
		},
		"abcEl": {"el_type": "voiceName", "startChar": -1, "endChar": -1, "text": "RH"},
		"size": {"x": 15, "y": 348, "width": 19, "height": 15}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "9"
		},
		"abcEl": {"type": "treble", "verticalPos": 0, "clefPos": 4, "el_type": "clef"},
		"size": {"x": 58, "y": 338, "width": 19, "height": 57}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "10"
		},
		"abcEl": {
			"accidentals": [{"acc": "flat", "note": "B", "verticalPos": 6}, {
				"acc": "flat",
				"note": "e",
				"verticalPos": 9
			}], "root": "B", "acc": "b", "mode": "", "el_type": "keySignature"
		},
		"size": {"x": 88, "y": 342, "width": 16, "height": 30}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "11"
		},
		"abcEl": {"type": "specified", "value": [{"num": "4", "den": "4"}], "el_type": "timeSignature"},
		"size": {"x": 114, "y": 353, "width": 12, "height": 30}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "12"},
		"abcEl": {"preString": "Easy Swing", "duration": [0.25], "bpm": 140, "type": "tempo", "el_type": "tempo"},
		"size": {"x": 136, "y": 201, "width": 167, "height": 22}
	}, {
		"draggable": false,
		"svgEl": {"fill": "#000000", "selectable": "true", "tabindex": "0", "data-index": "13"},
		"abcEl": {"title": "A", "el_type": "part", "startChar": 644, "endChar": 647},
		"size": {"x": 136, "y": 224, "width": 19, "height": 27}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "14"
		},
		"abcEl": {
			"decoration": ["mp"],
			"duration": 0.5,
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 6}, {
				"pitch": 8,
				"verticalPos": 8,
				"highestVert": 8
			}, {"pitch": 13, "verticalPos": 13, "highestVert": 13}],
			"el_type": "note",
			"startChar": 705,
			"endChar": 714,
			"averagepitch": 9,
			"minpitch": 6,
			"maxpitch": 13
		},
		"size": {"x": 136, "y": 313, "width": 10, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "15"
		},
		"abcEl": {
			"pitches": [{"pitch": 10, "verticalPos": 10, "highestVert": 16}],
			"duration": 0.1875,
			"el_type": "note",
			"startChar": 714,
			"endChar": 716,
			"startBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 176, "y": 321, "width": 16, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "16"
		},
		"abcEl": {
			"pitches": [{"pitch": 11, "verticalPos": 11, "highestVert": 17}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 716,
			"endChar": 718,
			"endBeam": true,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 194, "y": 317, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "17"
		},
		"abcEl": {
			"pitches": [{"pitch": 10, "verticalPos": 10, "highestVert": 16}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 718,
			"endChar": 720,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 204, "y": 325, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "18"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 2, "el_type": "bar", "startChar": 720, "endChar": 721},
		"size": {"x": 221, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "19"
		},
		"abcEl": {
			"decoration": ["crescendo("],
			"duration": 0.75,
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 8}, {
				"pitch": 13,
				"verticalPos": 13,
				"highestVert": 13
			}],
			"el_type": "note",
			"startChar": 725,
			"endChar": 734,
			"averagepitch": 10.5,
			"minpitch": 8,
			"maxpitch": 13
		},
		"size": {"x": 246, "y": 313, "width": 17, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "20"
		},
		"abcEl": {
			"decoration": ["crescendo)"],
			"duration": 0.25,
			"pitches": [{"pitch": 11, "verticalPos": 11, "highestVert": 11}, {
				"pitch": 13,
				"verticalPos": 13,
				"highestVert": 13
			}],
			"el_type": "note",
			"startChar": 738,
			"endChar": 744,
			"averagepitch": 12,
			"minpitch": 11,
			"maxpitch": 13
		},
		"size": {"x": 314, "y": 313, "width": 10, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "21"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 3, "el_type": "bar", "startChar": 744, "endChar": 745},
		"size": {"x": 351, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "22"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 745,
			"endChar": 748,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 361, "y": 340, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "23"
		},
		"abcEl": {
			"decoration": ["crescendo("],
			"pitches": [{"pitch": 13, "startSlur": [{"label": 101}], "verticalPos": 13, "highestVert": 19}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 748,
			"endChar": 755,
			"startBeam": true,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 386, "y": 306, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "24"
		},
		"abcEl": {
			"pitches": [{"pitch": 10, "verticalPos": 10, "highestVert": 16}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 755,
			"endChar": 756,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 397, "y": 308, "width": 10, "height": 48}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "25"
		},
		"abcEl": {
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 14}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 756,
			"endChar": 757,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 407, "y": 311, "width": 10, "height": 53}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "26"
		},
		"abcEl": {
			"pitches": [{"pitch": 10, "endSlur": [101], "verticalPos": 10, "highestVert": 16}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 757,
			"endChar": 760,
			"endBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 418, "y": 313, "width": 10, "height": 43}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "27"
		},
		"abcEl": {
			"startTriplet": 3,
			"tripletMultiplier": 0.6666666666666666,
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 12}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 760,
			"endChar": 764,
			"startBeam": true,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 429, "y": 333, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "28"
		},
		"abcEl": {
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 14}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 764,
			"endChar": 766,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 440, "y": 331, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "29"
		},
		"abcEl": {
			"pitches": [{"pitch": 7, "verticalPos": 7, "highestVert": 13}],
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
		"size": {"x": 451, "y": 329, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "30"
		},
		"abcEl": {
			"decoration": ["crescendo)"],
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 12}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 769,
			"endChar": 775,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 462, "y": 341, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "31"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 4, "el_type": "bar", "startChar": 775, "endChar": 776},
		"size": {"x": 489, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "32"},
		"abcEl": {
			"preString": "left",
			"duration": [0.25],
			"bpm": 170,
			"postString": "right",
			"el_type": "tempo",
			"startChar": 776,
			"endChar": 801,
			"type": "tempo"
		},
		"size": {"x": 500, "y": 201, "width": 145, "height": 22}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "33"
		},
		"abcEl": {
			"decoration": ["f"],
			"duration": 0.25,
			"pitches": [{"pitch": 7, "verticalPos": 7, "highestVert": 7}, {
				"pitch": 10,
				"verticalPos": 10,
				"highestVert": 10
			}],
			"el_type": "note",
			"startChar": 804,
			"endChar": 811,
			"averagepitch": 8.5,
			"minpitch": 7,
			"maxpitch": 10
		},
		"size": {"x": 500, "y": 325, "width": 10, "height": 43}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "34"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 811,
			"endChar": 814,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 516, "y": 340, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "35"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 8}, {
				"pitch": 13,
				"verticalPos": 13,
				"highestVert": 13
			}],
			"el_type": "note",
			"startChar": 814,
			"endChar": 820,
			"averagepitch": 10.5,
			"minpitch": 8,
			"maxpitch": 13
		},
		"size": {"x": 534, "y": 313, "width": 10, "height": 51}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "36"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 5, "el_type": "bar", "startChar": 820, "endChar": 821},
		"size": {"x": 568, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "37"
		},
		"abcEl": {
			"decoration": ["p"],
			"duration": 0.5,
			"pitches": [{"pitch": 4, "verticalPos": 4, "highestVert": 4}, {
				"pitch": 9,
				"verticalPos": 9,
				"highestVert": 9
			}],
			"el_type": "note",
			"startChar": 825,
			"endChar": 832,
			"averagepitch": 6.5,
			"minpitch": 4,
			"maxpitch": 9
		},
		"size": {"x": 579, "y": 329, "width": 10, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "38"
		},
		"abcEl": {
			"decoration": ["trill", "upbow"],
			"duration": 0.5,
			"pitches": [{"pitch": 7, "verticalPos": 7, "highestVert": 7}, {
				"pitch": 10,
				"verticalPos": 10,
				"highestVert": 10
			}],
			"el_type": "note",
			"startChar": 834,
			"endChar": 840,
			"averagepitch": 8.5,
			"minpitch": 7,
			"maxpitch": 10
		},
		"size": {"x": 608, "y": 287, "width": 18, "height": 81}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "39"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 6, "el_type": "bar", "startChar": 840, "endChar": 841},
		"size": {"x": 646, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "40"
		},
		"abcEl": {
			"decoration": ["crescendo("],
			"duration": 0.75,
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 8}, {
				"pitch": 10,
				"verticalPos": 10,
				"highestVert": 10
			}],
			"el_type": "note",
			"startChar": 845,
			"endChar": 854,
			"averagepitch": 9,
			"minpitch": 8,
			"maxpitch": 10
		},
		"size": {"x": 657, "y": 325, "width": 17, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "41"
		},
		"abcEl": {
			"decoration": ["crescendo)"],
			"pitches": [{"pitch": 11, "verticalPos": 11, "highestVert": 17}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 854,
			"endChar": 860,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 708, "y": 321, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "42"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 860, "endChar": 861},
		"size": {"x": 756, "y": 352, "width": 1, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "43"},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1, "decoration": "mp"},
		"size": {"x": 134, "y": 429, "width": 27, "height": 13}
	}, {
		"draggable": false,
		"svgEl": {
			"highlight": "stroke",
			"stroke": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "44"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1},
		"size": {"x": 246, "y": 426, "width": 68, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "45"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 397, "y": 318, "width": 26, "height": 5}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "46"},
		"abcEl": {"el_type": "triplet", "startChar": -1, "endChar": -1},
		"size": {"x": 441, "y": 307, "width": 8, "height": 17}
	}, {
		"draggable": false,
		"svgEl": {
			"highlight": "stroke",
			"stroke": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "47"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1},
		"size": {"x": 386, "y": 426, "width": 76, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "48"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1, "decoration": "f"},
		"size": {"x": 497, "y": 423, "width": 16, "height": 19}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "49"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1, "decoration": "p"},
		"size": {"x": 575, "y": 429, "width": 15, "height": 13}
	}, {
		"draggable": false,
		"svgEl": {
			"highlight": "stroke",
			"stroke": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "50"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1},
		"size": {"x": 657, "y": 426, "width": 51, "height": 8}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "51"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "startTie": {}, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 997,
			"endChar": 1003,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 136, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "52"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "startTie": {}, "endTie": true, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1003,
			"endChar": 1008,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 152, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "53"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "endTie": true, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1008,
			"endChar": 1012,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 176, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "54"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1012,
			"endChar": 1016,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 204, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "55"
		},
		"abcEl": {
			"chord": [{"name": "B♭", "position": "default"}],
			"gracenotes": [{"pitch": 0, "duration": 0.125, "verticalPos": 0}],
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1017,
			"endChar": 1029,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 236, "y": 375, "width": 20, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "56"
		},
		"abcEl": {
			"gracenotes": [{"pitch": 0, "duration": 0.125, "verticalPos": 0}, {
				"pitch": 1,
				"duration": 0.125,
				"verticalPos": 1
			}],
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1029,
			"endChar": 1037,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 260, "y": 368, "width": 30, "height": 54}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "57"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1037,
			"endChar": 1041,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 297, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "58"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1041,
			"endChar": 1045,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 314, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "59"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1046,
			"endChar": 1051,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 362, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "60"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1051,
			"endChar": 1055,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 386, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "61"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1055,
			"endChar": 1059,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 429, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "62"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1059,
			"endChar": 1063,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 462, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "63"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1064,
			"endChar": 1069,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 500, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "64"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1069,
			"endChar": 1073,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 517, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "65"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1073,
			"endChar": 1077,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 534, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "66"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1077,
			"endChar": 1081,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 551, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "67"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1082,
			"endChar": 1087,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 579, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "68"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1087,
			"endChar": 1091,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 595, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "69"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1091,
			"endChar": 1095,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 612, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "70"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1095,
			"endChar": 1099,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 629, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "71"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1100,
			"endChar": 1105,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 657, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "72"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1105,
			"endChar": 1109,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 674, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "73"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1109,
			"endChar": 1113,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 691, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "74"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1113,
			"endChar": 1117,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 708, "y": 391, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "75"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 142, "y": 400, "width": 15, "height": 5}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "76"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 158, "y": 400, "width": 22, "height": 6}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "77"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 239, "y": 397, "width": 11, "height": 6}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "78"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 263, "y": 397, "width": 21, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "13",
			"font-style": "normal",
			"font-family": "Helvetica",
			"font-weight": "bold",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "start",
			"x": "15",
			"y": "493.56399999999996",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "79"
		},
		"abcEl": {"el_type": "voiceName", "startChar": -1, "endChar": -1, "text": "LH"},
		"size": {"x": 15, "y": 482, "width": 17, "height": 15}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "80"
		},
		"abcEl": {"type": "bass", "verticalPos": -12, "clefPos": 8, "el_type": "clef"},
		"size": {"x": 58, "y": 473, "width": 20, "height": 23}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "81"
		},
		"abcEl": {
			"accidentals": [{"acc": "flat", "note": "B", "verticalPos": 4}, {
				"acc": "flat",
				"note": "e",
				"verticalPos": 7
			}], "root": "B", "acc": "b", "mode": "", "el_type": "keySignature"
		},
		"size": {"x": 88, "y": 470, "width": 16, "height": 30}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "82"
		},
		"abcEl": {"type": "specified", "value": [{"num": "4", "den": "4"}], "el_type": "timeSignature"},
		"size": {"x": 114, "y": 473, "width": 12, "height": 30}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "83"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}],
			"duration": 0.375,
			"el_type": "note",
			"startChar": 1254,
			"endChar": 1259,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 136, "y": 465, "width": 16, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "84"
		},
		"abcEl": {
			"pitches": [{"pitch": 1, "verticalPos": 13, "highestVert": 13}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1259,
			"endChar": 1262,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 164, "y": 457, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "85"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}, {
				"pitch": -2,
				"verticalPos": 10,
				"highestVert": 10
			}, {"pitch": 3, "verticalPos": 15, "highestVert": 15}],
			"el_type": "note",
			"startChar": 1262,
			"endChar": 1272,
			"averagepitch": 11,
			"minpitch": 8,
			"maxpitch": 15
		},
		"size": {"x": 176, "y": 449, "width": 10, "height": 58}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "86"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1272, "endChar": 1273},
		"size": {"x": 221, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "87"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1273,
			"endChar": 1276,
			"startBeam": true,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 246, "y": 465, "width": 10, "height": 56}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "88"
		},
		"abcEl": {
			"pitches": [{"pitch": -8, "verticalPos": 4, "highestVert": 10}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1276,
			"endChar": 1281,
			"endBeam": true,
			"averagepitch": 4,
			"minpitch": 4,
			"maxpitch": 4
		},
		"size": {"x": 257, "y": 492, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "89"
		},
		"abcEl": {
			"pitches": [{"pitch": -7, "verticalPos": 5, "highestVert": 11}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1281,
			"endChar": 1285,
			"averagepitch": 5,
			"minpitch": 5,
			"maxpitch": 5
		},
		"size": {"x": 280, "y": 465, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "90"
		},
		"abcEl": {
			"pitches": [{"pitch": -6, "verticalPos": 6, "highestVert": 6}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1285,
			"endChar": 1289,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 297, "y": 484, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "91"
		},
		"abcEl": {
			"pitches": [{"pitch": -5, "verticalPos": 7, "highestVert": 7}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1289,
			"endChar": 1291,
			"startBeam": true,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 314, "y": 480, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "92"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1291,
			"endChar": 1293,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 324, "y": 476, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "93"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1293,
			"endChar": 1296,
			"endBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 335, "y": 472, "width": 10, "height": 37}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "94"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1296, "endChar": 1297},
		"size": {"x": 351, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "95"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1297,
			"endChar": 1300,
			"startBeam": true,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 362, "y": 476, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "96"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1300,
			"endChar": 1304,
			"endBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 374, "y": 469, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "97"
		},
		"abcEl": {
			"pitches": [{"pitch": 1, "verticalPos": 13, "highestVert": 13}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1304,
			"endChar": 1307,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 386, "y": 457, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "98"
		},
		"abcEl": {
			"pitches": [{"pitch": 1, "verticalPos": 13, "highestVert": 13}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1307,
			"endChar": 1310,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 429, "y": 457, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "99"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1310,
			"endChar": 1313,
			"startBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 462, "y": 472, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "100"
		},
		"abcEl": {
			"pitches": [{"pitch": -5, "verticalPos": 7, "highestVert": 7}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1313,
			"endChar": 1316,
			"endBeam": true,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 473, "y": 480, "width": 10, "height": 33}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "101"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1316, "endChar": 1317},
		"size": {"x": 489, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "102"
		},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}, {
				"pitch": -2,
				"verticalPos": 10,
				"highestVert": 10
			}, {"pitch": 0, "verticalPos": 12, "highestVert": 12}],
			"el_type": "note",
			"startChar": 1317,
			"endChar": 1328,
			"averagepitch": 10,
			"minpitch": 8,
			"maxpitch": 12
		},
		"size": {"x": 500, "y": 461, "width": 10, "height": 47}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "103"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1328,
			"endChar": 1331,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 516, "y": 476, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "104"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}, {
				"pitch": 3,
				"verticalPos": 15,
				"highestVert": 15
			}],
			"el_type": "note",
			"startChar": 1331,
			"endChar": 1338,
			"averagepitch": 13,
			"minpitch": 11,
			"maxpitch": 15
		},
		"size": {"x": 534, "y": 449, "width": 10, "height": 47}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "105"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1338, "endChar": 1339},
		"size": {"x": 568, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "106"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.5,
			"el_type": "note",
			"startChar": 1339,
			"endChar": 1343,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 579, "y": 472, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "107"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.5,
			"el_type": "note",
			"startChar": 1343,
			"endChar": 1346,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 612, "y": 468, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "108"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1346, "endChar": 1347},
		"size": {"x": 646, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "109"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.75,
			"el_type": "note",
			"startChar": 1347,
			"endChar": 1352,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 657, "y": 467, "width": 17, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "110"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1352,
			"endChar": 1354,
			"startBeam": true,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 708, "y": 465, "width": 10, "height": 45}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "111"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1354,
			"endChar": 1356,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 718, "y": 472, "width": 10, "height": 40}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "112"
		},
		"abcEl": {
			"pitches": [{"pitch": -6, "verticalPos": 6, "highestVert": 6}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1356,
			"endChar": 1358,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 729, "y": 484, "width": 10, "height": 30}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "113"
		},
		"abcEl": {
			"pitches": [{"pitch": -5, "verticalPos": 7, "highestVert": 7}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1358,
			"endChar": 1360,
			"endBeam": true,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 740, "y": 480, "width": 10, "height": 37}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "114"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1360, "endChar": 1361},
		"size": {"x": 756, "y": 383, "width": 1, "height": 120}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "#000000",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "115"
		},
		"abcEl": {"el_type": "brace", "startChar": -1, "endChar": -1},
		"size": {"x": 15, "y": 620, "width": 8, "height": 147}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "116"
		},
		"abcEl": {"type": "treble", "verticalPos": 0, "clefPos": 4, "el_type": "clef"},
		"size": {"x": 30, "y": 606, "width": 19, "height": 57}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "117"
		},
		"abcEl": {
			"accidentals": [{"acc": "flat", "note": "B", "verticalPos": 6}, {
				"acc": "flat",
				"note": "e",
				"verticalPos": 9
			}], "root": "B", "acc": "b", "mode": "", "el_type": "keySignature"
		},
		"size": {"x": 59, "y": 610, "width": 16, "height": 30}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "118"
		},
		"abcEl": {
			"decoration": ["f"],
			"pitches": [{"pitch": 12, "verticalPos": 12, "highestVert": 18}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 862,
			"endChar": 868,
			"lyric": [{"syllable": "Strang", "divider": "-"}],
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12
		},
		"size": {"x": 107, "y": 585, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "119"
		},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": 11, "verticalPos": 11, "highestVert": 11}, {
				"pitch": 13,
				"verticalPos": 13,
				"highestVert": 13
			}],
			"el_type": "note",
			"startChar": 868,
			"endChar": 875,
			"lyric": [{"syllable": "ers", "divider": " "}],
			"averagepitch": 12,
			"minpitch": 11,
			"maxpitch": 13
		},
		"size": {"x": 150, "y": 581, "width": 10, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "120"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 875,
			"endChar": 878,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 193, "y": 608, "width": 8, "height": 21}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "121"
		},
		"abcEl": {
			"pitches": [{"accidental": "natural", "pitch": 9, "verticalPos": 9, "highestVert": 15}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 878,
			"endChar": 881,
			"lyric": [{"syllable": "in", "divider": " "}],
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 205, "y": 597, "width": 17, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "122"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 8, "el_type": "bar", "startChar": 881, "endChar": 882},
		"size": {"x": 228, "y": 620, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "123"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": 5, "verticalPos": 5, "highestVert": 5}, {
				"pitch": 7,
				"verticalPos": 7,
				"highestVert": 7
			}, {"pitch": 10, "verticalPos": 10, "highestVert": 10}],
			"el_type": "note",
			"startChar": 882,
			"endChar": 891,
			"lyric": [{"syllable": "the", "divider": " "}],
			"averagepitch": 7.333333333333333,
			"minpitch": 5,
			"maxpitch": 10
		},
		"size": {"x": 248, "y": 593, "width": 10, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "124"
		},
		"abcEl": {
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 14}],
			"duration": 0.5,
			"el_type": "note",
			"startChar": 891,
			"endChar": 893,
			"lyric": [{"syllable": "night", "divider": " "}],
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 274, "y": 601, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
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
		"size": {"x": 300, "y": 620, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "126"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": 3, "verticalPos": 3, "highestVert": 3}, {
				"pitch": 7,
				"verticalPos": 7,
				"highestVert": 7
			}],
			"el_type": "note",
			"startChar": 896,
			"endChar": 903,
			"averagepitch": 5,
			"minpitch": 3,
			"maxpitch": 7
		},
		"size": {"x": 330, "y": 605, "width": 10, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "127"
		},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": 4, "verticalPos": 4, "highestVert": 4}, {
				"pitch": 6,
				"verticalPos": 6,
				"highestVert": 6
			}],
			"el_type": "note",
			"startChar": 903,
			"endChar": 910,
			"averagepitch": 5,
			"minpitch": 4,
			"maxpitch": 6
		},
		"size": {"x": 386, "y": 609, "width": 10, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "128"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 910,
			"endChar": 912,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 429, "y": 608, "width": 8, "height": 21}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "129"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 10, "el_type": "bar", "startChar": 912, "endChar": 913},
		"size": {"x": 456, "y": 620, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "130"
		},
		"abcEl": {
			"duration": 0.75,
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 6}, {
				"pitch": 8,
				"verticalPos": 8,
				"highestVert": 8
			}],
			"el_type": "note",
			"startChar": 913,
			"endChar": 922,
			"averagepitch": 7,
			"minpitch": 6,
			"maxpitch": 8
		},
		"size": {"x": 467, "y": 601, "width": 17, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "131"
		},
		"abcEl": {
			"pitches": [{"pitch": 5, "verticalPos": 5, "highestVert": 11}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 922,
			"endChar": 924,
			"averagepitch": 5,
			"minpitch": 5,
			"maxpitch": 5
		},
		"size": {"x": 521, "y": 612, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "132"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 11, "el_type": "bar", "startChar": 924, "endChar": 925},
		"size": {"x": 569, "y": 620, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "133"
		},
		"abcEl": {
			"decoration": ["diminuendo("],
			"duration": 0.5,
			"pitches": [{"pitch": 1, "verticalPos": 1, "highestVert": 1}, {
				"pitch": 5,
				"verticalPos": 5,
				"highestVert": 5
			}],
			"el_type": "note",
			"startChar": 929,
			"endChar": 936,
			"averagepitch": 3,
			"minpitch": 1,
			"maxpitch": 5
		},
		"size": {"x": 580, "y": 612, "width": 10, "height": 47}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "134"
		},
		"abcEl": {
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 12}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 936,
			"endChar": 937,
			"startBeam": true,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 615, "y": 597, "width": 10, "height": 43}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "135"
		},
		"abcEl": {
			"pitches": [{"pitch": 7, "verticalPos": 7, "highestVert": 13}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 937,
			"endChar": 938,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 626, "y": 594, "width": 10, "height": 42}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "136"
		},
		"abcEl": {
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 14}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 938,
			"endChar": 939,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 637, "y": 592, "width": 10, "height": 40}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "137"
		},
		"abcEl": {
			"pitches": [{"pitch": 9, "verticalPos": 9, "highestVert": 15}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 939,
			"endChar": 941,
			"endBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 647, "y": 589, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "138"
		},
		"abcEl": {
			"pitches": [{"pitch": 10, "verticalPos": 10, "highestVert": 16}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 941,
			"endChar": 942,
			"startBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 658, "y": 585, "width": 10, "height": 39}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "139"
		},
		"abcEl": {
			"pitches": [{"pitch": 5, "verticalPos": 5, "highestVert": 11}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 942,
			"endChar": 943,
			"averagepitch": 5,
			"minpitch": 5,
			"maxpitch": 5
		},
		"size": {"x": 669, "y": 588, "width": 10, "height": 56}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "140"
		},
		"abcEl": {
			"pitches": [{"pitch": 6, "verticalPos": 6, "highestVert": 12}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 943,
			"endChar": 944,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 680, "y": 591, "width": 10, "height": 49}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "141"
		},
		"abcEl": {
			"decoration": ["diminuendo)"],
			"pitches": [{"pitch": 7, "verticalPos": 7, "highestVert": 13}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 944,
			"endChar": 949,
			"endBeam": true,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 691, "y": 593, "width": 10, "height": 43}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "142"
		},
		"abcEl": {"type": "bar_thin", "barNumber": 12, "el_type": "bar", "startChar": 949, "endChar": 950},
		"size": {"x": 706, "y": 620, "width": 1, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "143"
		},
		"abcEl": {
			"decoration": ["mp"],
			"pitches": [{"pitch": 8, "verticalPos": 8, "highestVert": 8}],
			"duration": 1,
			"el_type": "note",
			"startChar": 950,
			"endChar": 957,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 717, "y": 624, "width": 15, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "144"
		},
		"abcEl": {"type": "bar_thin_thick", "endEnding": true, "el_type": "bar", "startChar": 957, "endChar": 959},
		"size": {"x": 766, "y": 620, "width": 8, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "145"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1, "decoration": "f"},
		"size": {"x": 104, "y": 526, "width": 16, "height": 19}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "146"},
		"abcEl": {"el_type": "ending", "startChar": -1, "endChar": -1},
		"size": {"x": 301, "y": 560, "width": 468, "height": 23}
	}, {
		"draggable": false,
		"svgEl": {
			"highlight": "stroke",
			"stroke": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "147"
		},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1},
		"size": {"x": 580, "y": 529, "width": 110, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {"selectable": "true", "tabindex": "0", "data-index": "148"},
		"abcEl": {"el_type": "dynamicDecoration", "startChar": -1, "endChar": -1, "decoration": "mp"},
		"size": {"x": 716, "y": 531, "width": 27, "height": 13}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "149"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1119,
			"endChar": 1123,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 107, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "150"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1123,
			"endChar": 1127,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 150, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "151"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1127,
			"endChar": 1131,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 193, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "152"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1131,
			"endChar": 1135,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 212, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "153"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1136,
			"endChar": 1141,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 248, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "154"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1141,
			"endChar": 1145,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 259, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "155"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1145,
			"endChar": 1149,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 274, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "156"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1149,
			"endChar": 1153,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 285, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "157"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1154,
			"endChar": 1158,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 330, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "158"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1158,
			"endChar": 1162,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 358, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "159"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1162,
			"endChar": 1166,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 386, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "160"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1166,
			"endChar": 1170,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 429, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "161"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1171,
			"endChar": 1175,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 467, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "162"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1175,
			"endChar": 1179,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 489, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "163"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1179,
			"endChar": 1183,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 510, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "164"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1183,
			"endChar": 1187,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 521, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "165"
		},
		"abcEl": {
			"chord": [{"name": "annotation", "position": "above"}],
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1188,
			"endChar": 1205,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 580, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "166"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1205,
			"endChar": 1209,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 591, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "167"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1209,
			"endChar": 1213,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 615, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "168"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1213,
			"endChar": 1217,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 658, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "169"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1218,
			"endChar": 1222,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 717, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "170"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1222,
			"endChar": 1226,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 728, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "171"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1226,
			"endChar": 1230,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 739, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "172"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": -1, "highestVert": -1}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1230,
			"endChar": 1234,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 750, "y": 659, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "173"
		},
		"abcEl": {"type": "bass", "verticalPos": -12, "clefPos": 8, "el_type": "clef"},
		"size": {"x": 30, "y": 736, "width": 20, "height": 23}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "174"
		},
		"abcEl": {
			"accidentals": [{"acc": "flat", "note": "B", "verticalPos": 4}, {
				"acc": "flat",
				"note": "e",
				"verticalPos": 7
			}], "root": "B", "acc": "b", "mode": "", "el_type": "keySignature"
		},
		"size": {"x": 59, "y": 733, "width": 16, "height": 30}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "175"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1362,
			"endChar": 1364,
			"startBeam": true,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 107, "y": 740, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "176"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1364,
			"endChar": 1366,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 118, "y": 736, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "177"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1366,
			"endChar": 1368,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 129, "y": 732, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "178"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1368,
			"endChar": 1371,
			"endBeam": true,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 139, "y": 740, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "179"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "startSlur": [{"label": 101}], "verticalPos": 9, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1371,
			"endChar": 1374,
			"startBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 150, "y": 736, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "180"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1374,
			"endChar": 1376,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 161, "y": 732, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "181"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1376,
			"endChar": 1378,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 172, "y": 728, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "182"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "endSlur": [101], "verticalPos": 9, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1378,
			"endChar": 1382,
			"endBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 183, "y": 736, "width": 10, "height": 29}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "183"
		},
		"abcEl": {
			"pitches": [{"pitch": 0, "verticalPos": 12, "highestVert": 12}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1382,
			"endChar": 1385,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12
		},
		"size": {"x": 193, "y": 724, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "184"
		},
		"abcEl": {
			"pitches": [{"pitch": 0, "verticalPos": 12, "highestVert": 12}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1385,
			"endChar": 1387,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12
		},
		"size": {"x": 212, "y": 724, "width": 10, "height": 31}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "185"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1387, "endChar": 1388},
		"size": {"x": 228, "y": 651, "width": 1, "height": 116}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "186"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -7, "verticalPos": 5, "highestVert": 5}, {
				"pitch": -2,
				"verticalPos": 10,
				"highestVert": 10
			}],
			"el_type": "note",
			"startChar": 1388,
			"endChar": 1397,
			"averagepitch": 7.5,
			"minpitch": 5,
			"maxpitch": 10
		},
		"size": {"x": 248, "y": 732, "width": 10, "height": 51}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "187"
		},
		"abcEl": {
			"duration": 0.5,
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}, {
				"pitch": -1,
				"verticalPos": 11,
				"highestVert": 11
			}, {"pitch": 3, "verticalPos": 15, "highestVert": 15}],
			"el_type": "note",
			"startChar": 1397,
			"endChar": 1407,
			"averagepitch": 11.333333333333334,
			"minpitch": 8,
			"maxpitch": 15
		},
		"size": {"x": 274, "y": 712, "width": 10, "height": 58}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "188"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1407, "endChar": 1408},
		"size": {"x": 300, "y": 651, "width": 1, "height": 116}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "189"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.1875,
			"el_type": "note",
			"startChar": 1408,
			"endChar": 1411,
			"startBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 330, "y": 730, "width": 16, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "190"
		},
		"abcEl": {
			"pitches": [{"pitch": 0, "verticalPos": 12, "highestVert": 12}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1411,
			"endChar": 1413,
			"endBeam": true,
			"averagepitch": 12,
			"minpitch": 12,
			"maxpitch": 12
		},
		"size": {"x": 347, "y": 724, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "191"
		},
		"abcEl": {
			"pitches": [{"pitch": -1, "verticalPos": 11, "highestVert": 11}],
			"duration": 0.1875,
			"el_type": "note",
			"startChar": 1413,
			"endChar": 1416,
			"startBeam": true,
			"averagepitch": 11,
			"minpitch": 11,
			"maxpitch": 11
		},
		"size": {"x": 358, "y": 728, "width": 16, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "192"
		},
		"abcEl": {
			"pitches": [{"pitch": 1, "verticalPos": 13, "highestVert": 13}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1416,
			"endChar": 1418,
			"endBeam": true,
			"averagepitch": 13,
			"minpitch": 13,
			"maxpitch": 13
		},
		"size": {"x": 375, "y": 720, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "193"
		},
		"abcEl": {
			"pitches": [{"pitch": -3, "verticalPos": 9, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1418,
			"endChar": 1420,
			"startBeam": true,
			"averagepitch": 9,
			"minpitch": 9,
			"maxpitch": 9
		},
		"size": {"x": 386, "y": 736, "width": 10, "height": 37}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "194"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1420,
			"endChar": 1422,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 397, "y": 740, "width": 10, "height": 36}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "195"
		},
		"abcEl": {
			"pitches": [{"pitch": -5, "verticalPos": 7, "highestVert": 7}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1422,
			"endChar": 1424,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 408, "y": 744, "width": 10, "height": 34}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "196"
		},
		"abcEl": {
			"pitches": [{"pitch": -6, "verticalPos": 6, "highestVert": 6}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1424,
			"endChar": 1427,
			"endBeam": true,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 418, "y": 747, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "197"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1427,
			"endChar": 1430,
			"startBeam": true,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 429, "y": 740, "width": 10, "height": 33}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "198"
		},
		"abcEl": {
			"pitches": [{"pitch": -2, "verticalPos": 10, "highestVert": 10}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1430,
			"endChar": 1433,
			"endBeam": true,
			"averagepitch": 10,
			"minpitch": 10,
			"maxpitch": 10
		},
		"size": {"x": 440, "y": 732, "width": 10, "height": 37}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "199"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1433, "endChar": 1434},
		"size": {"x": 456, "y": 651, "width": 1, "height": 116}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "200"
		},
		"abcEl": {
			"pitches": [{"pitch": -6, "verticalPos": 6, "highestVert": 6}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1434,
			"endChar": 1437,
			"startBeam": true,
			"averagepitch": 6,
			"minpitch": 6,
			"maxpitch": 6
		},
		"size": {"x": 467, "y": 721, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "201"
		},
		"abcEl": {
			"pitches": [{"pitch": -7, "verticalPos": 5, "highestVert": 11}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1437,
			"endChar": 1441,
			"endBeam": true,
			"averagepitch": 5,
			"minpitch": 5,
			"maxpitch": 5
		},
		"size": {"x": 478, "y": 724, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "202"
		},
		"abcEl": {
			"pitches": [{"pitch": -8, "verticalPos": 4, "highestVert": 10}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1441,
			"endChar": 1445,
			"startBeam": true,
			"averagepitch": 4,
			"minpitch": 4,
			"maxpitch": 4
		},
		"size": {"x": 489, "y": 728, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "203"
		},
		"abcEl": {
			"pitches": [{"pitch": -9, "verticalPos": 3, "highestVert": 9}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1445,
			"endChar": 1450,
			"endBeam": true,
			"averagepitch": 3,
			"minpitch": 3,
			"maxpitch": 3
		},
		"size": {"x": 499, "y": 732, "width": 10, "height": 35}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "204"
		},
		"abcEl": {
			"pitches": [{"pitch": -10, "verticalPos": 2, "highestVert": 8}],
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1450,
			"endChar": 1455,
			"averagepitch": 2,
			"minpitch": 2,
			"maxpitch": 2
		},
		"size": {"x": 510, "y": 740, "width": 10, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "205"
		},
		"abcEl": {
			"pitches": [{"pitch": -11, "verticalPos": 1, "highestVert": 7}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1455,
			"endChar": 1458,
			"startBeam": true,
			"averagepitch": 1,
			"minpitch": 1,
			"maxpitch": 1
		},
		"size": {"x": 521, "y": 716, "width": 10, "height": 58}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "206"
		},
		"abcEl": {
			"pitches": [{"pitch": -9, "verticalPos": 3, "highestVert": 9}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1458,
			"endChar": 1461,
			"averagepitch": 3,
			"minpitch": 3,
			"maxpitch": 3
		},
		"size": {"x": 532, "y": 714, "width": 10, "height": 53}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "207"
		},
		"abcEl": {
			"pitches": [{"pitch": -7, "verticalPos": 5, "highestVert": 11}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1461,
			"endChar": 1463,
			"averagepitch": 5,
			"minpitch": 5,
			"maxpitch": 5
		},
		"size": {"x": 543, "y": 711, "width": 10, "height": 48}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "208"
		},
		"abcEl": {
			"pitches": [{"pitch": -4, "verticalPos": 8, "highestVert": 8}],
			"duration": 0.0625,
			"el_type": "note",
			"startChar": 1463,
			"endChar": 1465,
			"endBeam": true,
			"averagepitch": 8,
			"minpitch": 8,
			"maxpitch": 8
		},
		"size": {"x": 553, "y": 709, "width": 10, "height": 39}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "209"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1465, "endChar": 1466},
		"size": {"x": 569, "y": 651, "width": 1, "height": 116}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "210"
		},
		"abcEl": {
			"pitches": [{"pitch": -11, "verticalPos": 1, "highestVert": 7}],
			"duration": 0.375,
			"el_type": "note",
			"startChar": 1466,
			"endChar": 1471,
			"averagepitch": 1,
			"minpitch": 1,
			"maxpitch": 1
		},
		"size": {"x": 580, "y": 744, "width": 16, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "211"
		},
		"abcEl": {
			"pitches": [{"pitch": -13, "verticalPos": -1, "highestVert": 5}],
			"duration": 0.125,
			"el_type": "note",
			"startChar": 1471,
			"endChar": 1476,
			"averagepitch": -1,
			"minpitch": -1,
			"maxpitch": -1
		},
		"size": {"x": 598, "y": 751, "width": 15, "height": 31}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "212"
		},
		"abcEl": {
			"duration": 0.25,
			"pitches": [{"pitch": -10, "verticalPos": 2, "highestVert": 2}, {
				"pitch": -6,
				"verticalPos": 6,
				"highestVert": 6
			}],
			"el_type": "note",
			"startChar": 1476,
			"endChar": 1486,
			"averagepitch": 4,
			"minpitch": 2,
			"maxpitch": 6
		},
		"size": {"x": 615, "y": 724, "width": 10, "height": 47}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "213"
		},
		"abcEl": {
			"rest": {"type": "rest"},
			"duration": 0.25,
			"el_type": "note",
			"startChar": 1486,
			"endChar": 1488,
			"averagepitch": 7,
			"minpitch": 7,
			"maxpitch": 7
		},
		"size": {"x": 657, "y": 740, "width": 8, "height": 21}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "214"
		},
		"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 1488, "endChar": 1489},
		"size": {"x": 706, "y": 651, "width": 1, "height": 116}
	}, {
		"draggable": true,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "215"
		},
		"abcEl": {
			"pitches": [{"pitch": -8, "verticalPos": 4, "highestVert": 4}],
			"duration": 1,
			"el_type": "note",
			"startChar": 1489,
			"endChar": 1494,
			"averagepitch": 4,
			"minpitch": 4,
			"maxpitch": 4
		},
		"size": {"x": 717, "y": 755, "width": 15, "height": 8}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "216"
		},
		"abcEl": {"type": "bar_thin_thick", "el_type": "bar", "startChar": 1494, "endChar": 1496},
		"size": {"x": 766, "y": 651, "width": 8, "height": 116}
	}, {
		"draggable": false,
		"svgEl": {
			"stroke": "none",
			"fill": "#000000",
			"class": "",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "217"
		},
		"abcEl": {"el_type": "slur", "startChar": -1, "endChar": -1},
		"size": {"x": 156, "y": 724, "width": 30, "height": 7}
	}, {
		"draggable": false,
		"svgEl": {
			"class": "abcjs-meta-bottom abcjs-unaligned-words",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "218"
		},
		"abcEl": {"el_type": "unalignedWords", "startChar": -1, "endChar": -1, "text": ""},
		"size": {"x": 65, "y": 809, "width": 278, "height": 72}
	}, {
		"draggable": false,
		"svgEl": {
			"font-size": "21",
			"font-style": "normal",
			"font-family": "\"Times New Roman\"",
			"font-weight": "normal",
			"text-decoration": "none",
			"class": "",
			"text-anchor": "start",
			"x": "15",
			"y": "947.6127070627692",
			"selectable": "true",
			"tabindex": "0",
			"data-index": "219"
		},
		"abcEl": {
			"el_type": "extraText",
			"startChar": -1,
			"endChar": -1,
			"text": "Source: My own testing\nHistory: This shows every type of thing that can possibly be drawn.\n\nAnd two lines of history!\n"
		},
		"size": {"x": 15, "y": 929, "width": 568, "height": 100}
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
				"stroke": "none",
				"fill": "#000000",
				"class": "",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "0"
			},
			"abcEl": {"type": "treble", "verticalPos": 0, "clefPos": 4, "el_type": "clef"},
			"size": {"x": 20, "y": 50, "width": 19, "height": 57}
		}, {
			"draggable": false,
			"svgEl": {
				"stroke": "none",
				"fill": "#000000",
				"class": "",
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
			"abcEl": {"preString": "Easy Swing", "duration": [0.25], "bpm": 140, "type": "tempo", "el_type": "tempo"},
			"size": {"x": 71, "y": 27, "width": 167, "height": 22}
		}, {
			"draggable": true,
			"svgEl": {
				"stroke": "none",
				"fill": "#000000",
				"class": "",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "3"
			},
			"abcEl": {
				"pitches": [{"pitch": 4, "verticalPos": 4, "highestVert": 4}],
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
				"stroke": "none",
				"fill": "#000000",
				"class": "",
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
				"stroke": "none",
				"fill": "#000000",
				"class": "",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "6"
			},
			"abcEl": {
				"pitches": [{"pitch": 5, "verticalPos": 5, "highestVert": 5}],
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
				"stroke": "none",
				"fill": "#000000",
				"class": "",
				"selectable": "true",
				"tabindex": "0",
				"data-index": "7"
			},
			"abcEl": {"type": "bar_thin", "el_type": "bar", "startChar": 77, "endChar": 78},
			"size": {"x": 252, "y": 64, "width": 1, "height": 31}
		}]

//////////////////////////////////////////////////////////
	it("selection-multiple", function() {
		doSelectionTest(abcMultiple, expectedMultiple, {selectTypes: true});
	})

	it("selection-tempo", function() {
		doSelectionTest(abcTempo, expectedTempo, {selectTypes: true});
	})
	it("selection-none", function() {
		doSelectionTest(abcMultiple, expectedMultiple, {});
	})

})

//////////////////////////////////////////////////////////

function doSelectionTest(abc, expected, options) {
	var visualObj = abcjs.renderAbc("paper", abc, options);
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
	console.log(JSON.stringify(results))
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

function copySvgEl(svgEl) {
	var el = {};
	var attr = svgEl.attributes;
	for (var i = 0; i < attr.length; i++) {
		if (attr[i].nodeName !== 'd')
			el[attr[i].nodeName] = attr[i].nodeValue;
	}
	return el;
}
