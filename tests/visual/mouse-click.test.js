describe("Mouse Click", function() {
	var abcMultiple = 'X:1\n' +
		'M:4/4\n' +
		'L:1/16\n' +
		'%%titlefont Times New Roman 22.0\n' +
		'%%partsfont box\n' +
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
		'V:PianoRightHand clef=treble+8 name=RH\n' +
		'V:PianoLeftHand clef=bass name=LH\n' +
		'K:Bb\n' +
		'P:A\n' +
		'%%text there is some random text\n' +
		'%%sep 0.4cm 0.4cm 6cm\n' +
		'[V: PianoRightHand] !mp![b8B8d8] f3g !//!f4|!<(![d12b12] !<)![b4g4]|z4  b^f_df (3B2d2c2 B4|1[Q:"left" 1/4=170"right"]!f![c4f4] z4 [b8d8]| (3[G8e8] Tu[c8f8] G8|]\n' +
		'w:Strang- ers\n' +
		'[V: extra] B,16 | "Bb"{C}B,4 ({^CD}B,4 =B,8) |\n' +
		'T:Inserted subtitle\n' +
		'[V: PianoLeftHand] B,6 .D2 !arpeggio![F,8F8A,8]|(B,2 B,,2 C,12)|"^annotation"F,16|[F,16D,16]|Z2|]\n';
	
	var expectedMultiple = [
		{"isParent":true,"type":"title","index":0,"originalText":"T: Selection Test","name":"title"},
		{"isParent":true,"type":"subtitle","index":1,"originalText":"T: Everything should be selectable","name":"subtitle"},
		{"isParent":true,"type":"rhythm","index":2,"originalText":"R: Hit it","name":"rhythm"},
		{"isParent":true,"type":"composer","index":3,"originalText":"C: public domain","name":"composer"},
		{"isParent":true,"type":"author","index":4,"originalText":"A: Yours Truly","name":"author"},
		{"isParent":true,"type":"partOrder","index":5,"originalText":"P: AABB","name":"part-order"},
		{"isParent":false,"type":"partOrder","index":5,"originalText":"P: AABB","name":"part-order"},
		{"isParent":false,"type":"partOrder","index":5,"originalText":"P: AABB","name":"box"},
		{"isParent":true,"type":"freeText","index":6,"originalText":"%%text there is some random text","name":"free-text"},
		{"isParent":true,"type":"brace","index":7,"originalText":"TODO","name":"brace"},
		{"isParent":true,"type":"voiceName","index":8,"originalText":"TODO","name":"voice-name"},
		{"isParent":true,"type":"clef","index":9,"originalText":"TODO","name":"staff-extra clef"},
		{"isParent":false,"type":"clef","index":9,"originalText":"TODO","name":"clefs.G"},
		{"isParent":false,"type":"clef","index":9,"originalText":"TODO","name":"8"},
		{"isParent":true,"type":"keySignature","index":10,"originalText":"TODO","name":"staff-extra key-signature"},
		{"isParent":false,"type":"keySignature","index":10,"originalText":"TODO","name":"accidentals.flat"},
		{"isParent":false,"type":"keySignature","index":10,"originalText":"TODO","name":"accidentals.flat"},
		{"isParent":true,"type":"timeSignature","index":11,"originalText":"TODO","name":"staff-extra time-signature"},
		{"isParent":false,"type":"timeSignature","index":11,"originalText":"TODO","name":"4"},
		{"isParent":false,"type":"timeSignature","index":11,"originalText":"TODO","name":"4"},
		{"isParent":true,"type":"tempo","index":12,"originalText":"Q: \"Easy Swing\" 1/4=140","name":"tempo"},
		{"isParent":false,"type":"tempo","index":12,"originalText":"Q: \"Easy Swing\" 1/4=140","name":"pre"},
		{"isParent":false,"type":"tempo","index":12,"originalText":"Q: \"Easy Swing\" 1/4=140","name":"noteheads.quarter"},
		{"isParent":false,"type":"tempo","index":12,"originalText":"Q: \"Easy Swing\" 1/4=140","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"tempo","index":12,"originalText":"Q: \"Easy Swing\" 1/4=140","name":"beats"},
		{"isParent":true,"type":"part","index":13,"originalText":"P:A","name":"part"},
		{"isParent":false,"type":"part","index":13,"originalText":"P:A","name":"A"},
		{"isParent":false,"type":"part","index":13,"originalText":"P:A","name":"box"},
		{"isParent":true,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"note"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"B","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"d","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"b","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"lyric","classes":"abcjs-lyric abcjs-l3 abcjs-m0 abcjs-mm0 abcjs-v0 abcjs-n0"},
		{"isParent":false,"type":"note","index":14,"originalText":" !mp![b8B8d8] ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"note","index":15,"originalText":"f3","name":"note"},
		{"isParent":false,"type":"note","index":15,"originalText":"f3","name":"dots.dot"},
		{"isParent":false,"type":"note","index":15,"originalText":"f3","name":"f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":15,"originalText":"f3","name":"lyric","classes":"abcjs-lyric abcjs-l3 abcjs-m0 abcjs-mm0 abcjs-v0 abcjs-n1"},
		{"isParent":false,"type":"note","index":15,"originalText":"f3","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":16,"originalText":"g ","name":"note"},
		{"isParent":false,"type":"note","index":16,"originalText":"g ","name":"g","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":16,"originalText":"g ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":17,"originalText":"!//!f4","name":"note"},
		{"isParent":false,"type":"note","index":17,"originalText":"!//!f4","name":"f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":17,"originalText":"!//!f4","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":17,"originalText":"!//!f4","name":"flags.ugrace"},
		{"isParent":false,"type":"note","index":17,"originalText":"!//!f4","name":"flags.ugrace"},
		{"isParent":true,"type":"bar","index":18,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":18,"originalText":"|","name":"bar-number","classes":"abcjs-bar-number abcjs-l3 abcjs-m0 abcjs-mm0 abcjs-v0"},
		{"isParent":false,"type":"bar","index":18,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"note"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"dots.dot"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"d","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"dots.dot"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"b","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":19,"originalText":"!<(![d12b12] ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"note","index":20,"originalText":"!<)![b4g4]","name":"note"},
		{"isParent":false,"type":"note","index":20,"originalText":"!<)![b4g4]","name":"g","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":20,"originalText":"!<)![b4g4]","name":"b","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":20,"originalText":"!<)![b4g4]","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":20,"originalText":"!<)![b4g4]","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"bar","index":21,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":21,"originalText":"|","name":"bar-number","classes":"abcjs-bar-number abcjs-l3 abcjs-m1 abcjs-mm1 abcjs-v0"},
		{"isParent":false,"type":"bar","index":21,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":22,"originalText":"z4  ","name":"rest"},
		{"isParent":false,"type":"note","index":22,"originalText":"z4  ","name":"rests.quarter"},
		{"isParent":true,"type":"note","index":23,"originalText":"b","name":"note"},
		{"isParent":false,"type":"note","index":23,"originalText":"b","name":"b","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":23,"originalText":"b","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":23,"originalText":"b","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":24,"originalText":"^f","name":"note"},
		{"isParent":false,"type":"note","index":24,"originalText":"^f","name":"accidentals.sharp"},
		{"isParent":false,"type":"note","index":24,"originalText":"^f","name":"^f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":24,"originalText":"^f","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":25,"originalText":"_d","name":"note"},
		{"isParent":false,"type":"note","index":25,"originalText":"_d","name":"accidentals.flat"},
		{"isParent":false,"type":"note","index":25,"originalText":"_d","name":"_d","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":25,"originalText":"_d","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":26,"originalText":"f ","name":"note"},
		{"isParent":false,"type":"note","index":26,"originalText":"f ","name":"f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":26,"originalText":"f ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":27,"originalText":"(3B2","name":"note"},
		{"isParent":false,"type":"note","index":27,"originalText":"(3B2","name":"B","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":27,"originalText":"(3B2","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":28,"originalText":"d2","name":"note"},
		{"isParent":false,"type":"note","index":28,"originalText":"d2","name":"d","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":28,"originalText":"d2","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":29,"originalText":"c2 ","name":"note"},
		{"isParent":false,"type":"note","index":29,"originalText":"c2 ","name":"c","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":29,"originalText":"c2 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":30,"originalText":"B4","name":"note"},
		{"isParent":false,"type":"note","index":30,"originalText":"B4","name":"B","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":30,"originalText":"B4","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"bar","index":31,"originalText":"|1","name":"bar"},
		{"isParent":false,"type":"bar","index":31,"originalText":"|1","name":"bar-number","classes":"abcjs-bar-number abcjs-l3 abcjs-m2 abcjs-mm2 abcjs-v0"},
		{"isParent":false,"type":"bar","index":31,"originalText":"|1","name":"bar"},
		{"isParent":true,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"tempo"},
		{"isParent":false,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"pre"},
		{"isParent":false,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"noteheads.quarter"},
		{"isParent":false,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"beats"},
		{"isParent":false,"type":"tempo","index":32,"originalText":"[Q:\"left\" 1/4=170\"right\"]","name":"post"},
		{"isParent":true,"type":"note","index":33,"originalText":"!f![c4f4] ","name":"note"},
		{"isParent":false,"type":"note","index":33,"originalText":"!f![c4f4] ","name":"c","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":33,"originalText":"!f![c4f4] ","name":"f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":33,"originalText":"!f![c4f4] ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":34,"originalText":"z4 ","name":"rest"},
		{"isParent":false,"type":"note","index":34,"originalText":"z4 ","name":"rests.quarter"},
		{"isParent":true,"type":"note","index":35,"originalText":"[b8d8]","name":"note"},
		{"isParent":false,"type":"note","index":35,"originalText":"[b8d8]","name":"d","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":35,"originalText":"[b8d8]","name":"b","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":35,"originalText":"[b8d8]","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":35,"originalText":"[b8d8]","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"bar","index":36,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":36,"originalText":"|","name":"bar-number","classes":"abcjs-bar-number abcjs-l3 abcjs-m3 abcjs-mm3 abcjs-v0"},
		{"isParent":false,"type":"bar","index":36,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":37,"originalText":" (3[G8e8] ","name":"note"},
		{"isParent":false,"type":"note","index":37,"originalText":" (3[G8e8] ","name":"G","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":37,"originalText":" (3[G8e8] ","name":"e","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":37,"originalText":" (3[G8e8] ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"note"},
		{"isParent":false,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"c","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"f","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"scripts.trill"},
		{"isParent":false,"type":"note","index":38,"originalText":"Tu[c8f8] ","name":"scripts.upbow"},
		{"isParent":true,"type":"note","index":39,"originalText":"G8","name":"note"},
		{"isParent":false,"type":"note","index":39,"originalText":"G8","name":"G","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":39,"originalText":"G8","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"bar","index":40,"originalText":"|]","name":"bar"},
		{"isParent":false,"type":"bar","index":40,"originalText":"|]","name":"bar"},
		{"isParent":false,"type":"bar","index":40,"originalText":"|]","name":"bar"},
		{"isParent":true,"type":"dynamicDecoration","index":41,"originalText":"TODO","name":"dynamics"},
		{"isParent":false,"type":"dynamicDecoration","index":41,"originalText":"TODO","name":"dynamics"},
		{"isParent":false,"type":"dynamicDecoration","index":41,"originalText":"TODO","name":"dynamics"},
		{"isParent":true,"type":"dynamicDecoration","index":42,"originalText":"TODO","name":"dynamics"},
		{"isParent":true,"type":"triplet","index":43,"originalText":"TODO","name":"triplet"},
		{"isParent":false,"type":"triplet","index":43,"originalText":"TODO","name":"3"},
		{"isParent":true,"type":"ending","index":44,"originalText":"TODO","name":"ending"},
		{"isParent":false,"type":"ending","index":44,"originalText":"TODO","name":"line"},
		{"isParent":false,"type":"ending","index":44,"originalText":"TODO","name":"1"},
		{"isParent":true,"type":"dynamicDecoration","index":45,"originalText":"TODO","name":"dynamics"},
		{"isParent":true,"type":"triplet","index":46,"originalText":"TODO","name":"triplet"},
		{"isParent":false,"type":"triplet","index":46,"originalText":"TODO","name":"triplet-bracket"},
		{"isParent":false,"type":"triplet","index":46,"originalText":"TODO","name":"3"},
		{"isParent":true,"type":"note","index":47,"originalText":" B,16 ","name":"note"},
		{"isParent":false,"type":"note","index":47,"originalText":" B,16 ","name":"B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":47,"originalText":" B,16 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"note"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"flags.u8th"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"C","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":48,"originalText":" \"Bb\"{C}B,4 ","name":"chord","classes":"abcjs-chord abcjs-l3 abcjs-m1 abcjs-mm1 abcjs-v1"},
		{"isParent":true,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"note"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"accidentals.sharp"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"^C","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"D","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":49,"originalText":"{^CD}B,4 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":50,"originalText":"=B,8) ","name":"note"},
		{"isParent":false,"type":"note","index":50,"originalText":"=B,8) ","name":"accidentals.nat"},
		{"isParent":false,"type":"note","index":50,"originalText":"=B,8) ","name":"=B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":50,"originalText":"=B,8) ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":50,"originalText":"=B,8) ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"slur","index":51,"originalText":"| \"Bb\"{C}B,4 (","name":"slur"},
		{"isParent":true,"type":"slur","index":52,"originalText":"TODO","name":"tie"},
		{"isParent":true,"type":"slur","index":53,"originalText":"({^CD}B,4 =","name":"slur"},
		{"isParent":true,"type":"voiceName","index":54,"originalText":"TODO","name":"voice-name"},
		{"isParent":true,"type":"clef","index":55,"originalText":"TODO","name":"staff-extra clef"},
		{"isParent":false,"type":"clef","index":55,"originalText":"TODO","name":"clefs.F"},
		{"isParent":true,"type": "keySignature", "index":56,"originalText":"TODO","name":"staff-extra key-signature"},
		{"isParent":false,"type": "keySignature", "index":56,"originalText":"TODO","name":"accidentals.flat"},
		{"isParent":false,"type": "keySignature", "index":56,"originalText":"TODO","name":"accidentals.flat"},
		{"isParent":true,"type":"timeSignature","index":57,"originalText":"TODO","name":"staff-extra time-signature"},
		{"isParent":false,"type":"timeSignature","index":57,"originalText":"TODO","name":"4"},
		{"isParent":false,"type":"timeSignature","index":57,"originalText":"TODO","name":"4"},
		{"isParent":true,"type":"note","index":58,"originalText":" B,6 ","name":"note"},
		{"isParent":false,"type":"note","index":58,"originalText":" B,6 ","name":"dots.dot"},
		{"isParent":false,"type":"note","index":58,"originalText":" B,6 ","name":"B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":58,"originalText":" B,6 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":59,"originalText":".D2 ","name":"note"},
		{"isParent":false,"type":"note","index":59,"originalText":".D2 ","name":"flags.d8th"},
		{"isParent":false,"type":"note","index":59,"originalText":".D2 ","name":"D","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":59,"originalText":".D2 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":59,"originalText":".D2 ","name":"scripts.staccato"},
		{"isParent":false,"type":"note","index":59,"originalText":".D2 ","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"note"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"F,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"A,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"F","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"stem","classes":"abcjs-stem"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"scripts.arpeggio"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"scripts.arpeggio"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"scripts.arpeggio"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"scripts.arpeggio"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"scripts.arpeggio"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":false,"type":"note","index":60,"originalText":"!arpeggio![F,8F8A,8]","name":"ledger","classes":"abcjs-ledger"},
		{"isParent":true,"type":"bar","index":61,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":61,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":62,"originalText":"(B,2 ","name":"note"},
		{"isParent":false,"type":"note","index":62,"originalText":"(B,2 ","name":"flags.d8th"},
		{"isParent":false,"type":"note","index":62,"originalText":"(B,2 ","name":"B,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":62,"originalText":"(B,2 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":63,"originalText":"B,,2 ","name":"note"},
		{"isParent":false,"type":"note","index":63,"originalText":"B,,2 ","name":"flags.u8th"},
		{"isParent":false,"type":"note","index":63,"originalText":"B,,2 ","name":"B,,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":63,"originalText":"B,,2 ","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"note","index":64,"originalText":"C,12)","name":"note"},
		{"isParent":false,"type":"note","index":64,"originalText":"C,12)","name":"dots.dot"},
		{"isParent":false,"type":"note","index":64,"originalText":"C,12)","name":"C,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":64,"originalText":"C,12)","name":"stem","classes":"abcjs-stem"},
		{"isParent":true,"type":"bar","index":65,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":65,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":66,"originalText":"\"^annotation\"F,16","name":"note"},
		{"isParent":false,"type":"note","index":66,"originalText":"\"^annotation\"F,16","name":"F,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":66,"originalText":"\"^annotation\"F,16","name":"annotation","classes":"abcjs-annotation abcjs-l3 abcjs-m2 abcjs-mm2 abcjs-v2"},
		{"isParent":true,"type":"bar","index":67,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":67,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":68,"originalText":"[F,16D,16]","name":"note"},
		{"isParent":false,"type":"note","index":68,"originalText":"[F,16D,16]","name":"D,","classes":"abcjs-notehead"},
		{"isParent":false,"type":"note","index":68,"originalText":"[F,16D,16]","name":"F,","classes":"abcjs-notehead"},
		{"isParent":true,"type":"bar","index":69,"originalText":"|","name":"bar"},
		{"isParent":false,"type":"bar","index":69,"originalText":"|","name":"bar"},
		{"isParent":true,"type":"note","index":70,"originalText":"Z2","name":"rest"},
		{"isParent":false,"type":"note","index":70,"originalText":"Z2","name":"rests.multimeasure"},
		{"isParent":false,"type":"note","index":70,"originalText":"Z2","name":"rest","classes":"abcjs-rest abcjs-l3 abcjs-m4 abcjs-mm4 abcjs-v2 abcjs-n0 abcjs-l3 abcjs-m4 abcjs-mm4 abcjs-v2 abcjs-n0"},
		{"isParent":true,"type":"bar","index":71,"originalText":"|]","name":"bar"},
		{"isParent":false,"type":"bar","index":71,"originalText":"|]","name":"bar"},
		{"isParent":false,"type":"bar","index":71,"originalText":"|]","name":"bar"},
		{"isParent":true,"type":"slur","index":72,"originalText":"|(B,2 B,,2 C,12)|","name":"slur"},
		{"isParent":true,"type":"subtitle","index":73,"originalText":"T:Inserted subtitle","name":"subtitle"},
		{"isParent":true,"type":"unalignedWords","index":74,"originalText":"TODO","name":"unalignedWords"},
		{"isParent":false,"type":"unalignedWords","index":74,"originalText":"TODO","name":"unalignedWords"},
		{"isParent":false,"type":"unalignedWords","index":74,"originalText":"TODO","name":"unalignedWords"},
		{"isParent":true,"type":"extraText","index":75,"originalText":"TODO","name":"description"},
		{"isParent":true,"type":"extraText","index":76,"originalText":"TODO","name":"description"},
	];

//////////////////////////////////////////////////////////
	it("click all types of elements", function() {
		doClickTest(abcMultiple, expectedMultiple);
	})
})

var results = [];
var testString;

function doClickTest(abcString, expected) {
	draw(abcString);
	results = [];
	testString = abcString;
	selectAll();
	//console.log(JSON.stringify(results))
	for (var i = 0; i < results.length; i++) {
		var msg = "index: " + i + "\nrcv: " + JSON.stringify(results[i]) + "\n" +
			"exp: " + JSON.stringify(expected[i]) + "\n";
		chai.assert.deepStrictEqual(results[i], expected[i], msg);
	}
}

function draw(abcString) {
	var options = {
		add_classes: true,
		clickListener: clickListener,
		selectTypes: true
	};
	abcjs.renderAbc("paper", abcString, options);

}

function processOneSvgEl(el) {
	if (el.getBBox) {
		var box = el.getBBox();
		var evDown = document.createEvent("SVGEvents");
		evDown.initEvent("mousedown", true, true);
		evDown.offsetX = box.x;
		evDown.offsetY = box.y;
		evDown.button = 0;
		var evUp = document.createEvent("SVGEvents");
		evUp.initEvent("mouseup", true, true);
		evUp.offsetX = box.x;
		evUp.offsetY = box.y;
		evUp.button = 0;
		el.dispatchEvent(evDown);
		el.dispatchEvent(evUp);
		if (el.tagName === 'g') {
			for (var i = 0; i < el.children.length; i++) {
				processOneSvgEl(el.children[i]);
			}
		}
	}
}

function selectAll() {
	var svg = document.querySelector("#paper svg")
	for (var i = 0; i < svg.children.length; i++) {
		processOneSvgEl(svg.children[i]);
	}
}

function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
	var target = mouseEvent.target;
	var isParent = target.dataset.index !== undefined;
	var result = {
		isParent: isParent,
		type: abcelem.el_type,
		index: drag.index
	};
	if (abcelem.startChar >= 0)
		result.originalText = testString.substring(abcelem.startChar, abcelem.endChar);
	else
		result.originalText = "TODO";
	result.name = target.dataset.name ? target.dataset.name : analysis.selectableElement.dataset.name;
	if (!isParent && target.classList.length > 0)
		result.classes = ''+target.classList;
	results.push(result)
}
