describe("Visual Options", function() {
	var abcFontBox = 'X:1\n' +
	'%%gchordfont Arial 25 box\n' +
	'%%annotationfont Times-Roman 15 box\n' +
	'%%composerfont Arial 8 box\n' +
	'%%footerfont Tahoma 8 box\n' +
	'%%headerfont Geneva 15 box\n' +
	'%%historyfont Palatino 9 box\n' +
	'%%infofont Monaco 11 box\n' +
	'%%measurefont Helvetica 7 box\n' +
	'%%partsfont sans-serif 29 box\n' +
	'%%repeatfont Helvetica 13 box\n' +
	'%%subtitlefont Arial 17 box\n' +
	'%%tempofont serif 19 box\n' +
	'%%textfont Verdana 21 box\n' +
	'%%titlefont cursive 23 box\n' +
	'%%tripletfont cursive 39 box\n' +
	'%%voicefont Verdana 17 box\n' +
	'%%vocalfont sans-serif 11 box\n' +
	'%%wordsfont Georgia 13 box\n' +
	'%%header The header\n' +
	'%%footer The footer\n' +
	'%%measurenb 1\n' +
	'T:fonts\n' +
	'T:changing all fonts\n' +
	'C:composer\n' +
	'A:author\n' +
	'R:hopping\n' +
	'H:History\n' +
	'N:The notes\n' +
	'O:Origin\n' +
	'S:source\n' +
	'P:Part Order\n' +
	'L:1/4\n' +
	'Q:"This is" 1/4=190 "Fast"\n' +
	'W:The extra verses\n' +
	'W:The extra verses - line 2\n' +
	'K:C\n' +
	'P:Part\n' +
	'V:1 name=voice\n' +
	'|1"C"CE"^No Chord"Gc:|(3aaaa|\n' +
	'w:words to this tune, words to this tune,\n' +
	'%%text extra text\n' +
	'T:Another Subtitle\n' +
	'|GGGG|AAAA|]\n' +
	'%%text more extra text\n';

	var expected10 = [
		[{"tag":"text","text":"fonts","x":348,"y":22,"w":67,"h":49},{"tag":"path","text":"","x":348,"y":23,"w":74,"h":56}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":92,"w":179,"h":26},{"tag":"path","text":"","x":293,"y":88,"w":185,"h":32}],
		[{"tag":"text","text":"hopping","x":17,"y":132,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":131,"w":67,"h":23}],
		[{"tag":"text","text":"composer (Origin)","x":666,"y":133,"w":88,"h":12},{"tag":"path","text":"","x":665,"y":131,"w":91,"h":16}],
		[{"tag":"text","text":"author","x":723,"y":149,"w":31,"h":12},{"tag":"path","text":"","x":721,"y":147,"w":35,"h":15}],
		[{"tag":"text","text":"Part Order","x":19,"y":171,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":164,"w":191,"h":54}],
		[{"tag":"text","text":"voice","x":17,"y":400,"w":60,"h":28},{"tag":"path","text":"","x":15,"y":395,"w":65,"h":34}],
		[{"tag":"text","text":"This is","x":143,"y":234,"w":67,"h":29},{"tag":"text","text":"= 190","x":232,"y":234,"w":58,"h":29},{"tag":"text","text":"Fast","x":302,"y":234,"w":42,"h":29},{"tag":"path","text":"","x":220,"y":227,"w":7,"h":23}],
		[],
		[{"tag":"text","text":"Part","x":147,"y":258,"w":72,"h":45},{"tag":"path","text":"","x":143,"y":251,"w":80,"h":54}],
		[{"tag":"text","text":"C","x":181,"y":326,"w":24,"h":37},{"tag":"path","text":"","x":178,"y":320,"w":31,"h":45}],
		[{"tag":"text","text":"No Chord","x":334,"y":324,"w":80,"h":22},{"tag":"path","text":"","x":332,"y":320,"w":85,"h":27}],
		[{"tag":"text","text":"2","x":468,"y":385,"w":5,"h":10},{"tag":"path","text":"","x":467,"y":383,"w":8,"h":13}],
		[{"tag":"path","text":"","x":515,"y":374,"w":123,"h":5},{"tag":"text","text":"3","x":565,"y":316,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":18,"y":477,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":475,"w":145,"h":41}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":528,"w":164,"h":26},{"tag":"path","text":"","x":301,"y":524,"w":169,"h":32}],
		[{"tag":"text","text":"3","x":12,"y":576,"w":5,"h":10},{"tag":"path","text":"","x":12,"y":574,"w":8,"h":13}],
		[{"tag":"text","text":"4","x":398,"y":576,"w":5,"h":10},{"tag":"path","text":"","x":397,"y":574,"w":8,"h":13}],
		[{"tag":"text","text":"more extra text","x":18,"y":651,"w":221,"h":34},{"tag":"path","text":"","x":15,"y":648,"w":228,"h":41}],
		[{"tag":"text","text":"The extra verses","x":65,"y":718,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":65,"y":738,"w":178,"h":20}],
		[{"tag":"text","text":"Source: sourceNotes: The notesHistory: History","x":16,"y":800,"w":89,"h":42},{"tag":"path","text":"","x":15,"y":797,"w":92,"h":46}]
	];

	var expected50 = [
		[{"tag":"text","text":"fonts","x":348,"y":34,"w":67,"h":49},{"tag":"path","text":"","x":336,"y":23,"w":99,"h":81}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":151,"w":179,"h":26},{"tag":"path","text":"","x":284,"y":137,"w":203,"h":50}],
		[{"tag":"text","text":"hopping","x":23,"y":224,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":217,"w":79,"h":35}],
		[{"tag":"text","text":"composer (Origin)","x":661,"y":223,"w":88,"h":12},{"tag":"path","text":"","x":656,"y":217,"w":100,"h":24}],
		[{"tag":"text","text":"author","x":718,"y":258,"w":31,"h":12},{"tag":"path","text":"","x":713,"y":251,"w":43,"h":24}],
		[{"tag":"text","text":"Part Order","x":35,"y":308,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":285,"w":222,"h":85}],
		[{"tag":"text","text":"voice","x":27,"y":691,"w":60,"h":28},{"tag":"path","text":"","x":15,"y":686,"w":84,"h":52}],
		[{"tag":"text","text":"This is","x":216,"y":418,"w":67,"h":29},{"tag":"text","text":"= 190","x":306,"y":418,"w":58,"h":29},{"tag":"text","text":"Fast","x":375,"y":418,"w":42,"h":29},{"tag":"path","text":"","x":293,"y":411,"w":7,"h":23}],
		[],
		[{"tag":"text","text":"Part","x":236,"y":458,"w":72,"h":45},{"tag":"path","text":"","x":216,"y":435,"w":112,"h":85}],
		[{"tag":"text","text":"C","x":280,"y":585,"w":24,"h":37},{"tag":"path","text":"","x":263,"y":566,"w":58,"h":71}],
		[{"tag":"text","text":"No Chord","x":414,"y":578,"w":80,"h":22},{"tag":"path","text":"","x":404,"y":566,"w":101,"h":43}],
		[{"tag":"text","text":"2","x":514,"y":674,"w":5,"h":10},{"tag":"path","text":"","x":509,"y":669,"w":15,"h":20}],
		[{"tag":"path","text":"","x":560,"y":673,"w":101,"h":5},{"tag":"text","text":"3","x":599,"y":615,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":29,"y":789,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":775,"w":167,"h":63}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":882,"w":164,"h":26},{"tag":"path","text":"","x":292,"y":868,"w":188,"h":50}],
		[{"tag":"text","text":"3","x":5,"y":947,"w":5,"h":10},{"tag":"path","text":"","x":1,"y":941,"w":15,"h":20}],
		[{"tag":"text","text":"4","x":398,"y":947,"w":5,"h":10},{"tag":"path","text":"","x":394,"y":941,"w":15,"h":20}],
		[{"tag":"text","text":"more extra text","x":29,"y":1044,"w":221,"h":34},{"tag":"path","text":"","x":15,"y":1030,"w":250,"h":63}],
		[{"tag":"text","text":"The extra verses","x":65,"y":1145,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":65,"y":1165,"w":178,"h":20}],
		[{"tag":"text","text":"Source: sourceNotes: The notesHistory: History","x":21,"y":1232,"w":89,"h":42},{"tag":"path","text":"","x":15,"y":1224,"w":102,"h":55}]
	];

	var expected100 = [
		[{"tag":"text","text":"fonts","x":348,"y":50,"w":67,"h":49},{"tag":"path","text":"","x":321,"y":23,"w":130,"h":112}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":224,"w":179,"h":26},{"tag":"path","text":"","x":272,"y":199,"w":226,"h":73}],
		[{"tag":"text","text":"hopping","x":30,"y":340,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":325,"w":94,"h":50}],
		[{"tag":"text","text":"composer (Origin)","x":656,"y":337,"w":88,"h":12},{"tag":"path","text":"","x":645,"y":325,"w":111,"h":35}],
		[{"tag":"text","text":"author","x":713,"y":393,"w":31,"h":12},{"tag":"path","text":"","x":702,"y":381,"w":54,"h":35}],
		[{"tag":"text","text":"Part Order","x":54,"y":479,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":437,"w":261,"h":124}],
		[{"tag":"text","text":"voice","x":38,"y":1071,"w":60,"h":28},{"tag":"path","text":"","x":15,"y":1066,"w":107,"h":75}],
		[{"tag":"text","text":"This is","x":308,"y":648,"w":67,"h":29},{"tag":"text","text":"= 190","x":398,"y":648,"w":58,"h":29},{"tag":"text","text":"Fast","x":467,"y":648,"w":42,"h":29},{"tag":"path","text":"","x":385,"y":641,"w":7,"h":23}],
		[],
		[{"tag":"text","text":"Part","x":347,"y":707,"w":72,"h":45},{"tag":"path","text":"","x":308,"y":665,"w":151,"h":124}],
		[{"tag":"text","text":"C","x":405,"y":910,"w":24,"h":37},{"tag":"path","text":"","x":372,"y":874,"w":91,"h":104}],
		[{"tag":"text","text":"No Chord","x":553,"y":896,"w":80,"h":22},{"tag":"path","text":"","x":534,"y":874,"w":121,"h":63}],
		[{"tag":"text","text":"2","x":595,"y":1053,"w":5,"h":10},{"tag":"path","text":"","x":586,"y":1043,"w":24,"h":29}],
		[{"tag":"path","text":"","x":641,"y":1065,"w":63,"h":5},{"tag":"text","text":"3","x":661,"y":1007,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":43,"y":1195,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":1167,"w":195,"h":91}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":1341,"w":164,"h":26},{"tag":"path","text":"","x":280,"y":1316,"w":211,"h":73}],
		[{"tag":"text","text":"3","x":5,"y":1444,"w":5,"h":10},{"tag":"path","text":"","x":-4,"y":1434,"w":24,"h":29}],
		[{"tag":"text","text":"4","x":398,"y":1444,"w":5,"h":10},{"tag":"path","text":"","x":389,"y":1434,"w":24,"h":29}],
		[{"tag":"text","text":"more extra text","x":43,"y":1569,"w":221,"h":34},{"tag":"path","text":"","x":15,"y":1541,"w":278,"h":91}],
		[{"tag":"text","text":"The extra verses","x":65,"y":1712,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":65,"y":1732,"w":178,"h":20}],
		[{"tag":"text","text":"Source: sourceNotes: The notesHistory: History","x":27,"y":1805,"w":89,"h":42},{"tag":"path","text":"","x":15,"y":1791,"w":114,"h":67}]
	];


	it("font-box", function() {
		doFontTest(abcFontBox, {  }, expected10);
		doFontTest(abcFontBox, { format: { fontboxpadding: 0.5 }}, expected50);
		doFontTest(abcFontBox, { format: { fontboxpadding: 1 }}, expected100);
	})
})

var allTextSelectors = ".abcjs-title,.abcjs-subtitle,.abcjs-rhythm,.abcjs-composer,.abcjs-author,.abcjs-part-order,.abcjs-tempo,.abcjs-part,.abcjs-chord,.abcjs-annotation,.abcjs-voice-name,.abcjs-triplet,.abcjs-defined-text,.abcjs-bar-number,.abcjs-unaligned-words,.abcjs-extra-text";

function doFontTest(abc, params, expected) {
	params.add_classes = true;
	var visualObj = abcjs.renderAbc("paper", abc, params);
	var textElements = document.getElementById("paper").querySelectorAll(allTextSelectors);
	for (var i = 0; i < textElements.length; i++) {
		var el = textElements[i];
		var children = [];
		for (var j = 0; j < el.children.length; j++) {
			var child = el.children[j];
			var sz = child.getBBox();
			children.push({tag: child.tagName, text: child.textContent,
				x: Math.round(sz.x), y: Math.round(sz.y), w: Math.round(sz.width), h: Math.round(sz.height)});
		}
		var msg = "Index: " + i;
		chai.assert.deepStrictEqual(children, expected[i], msg);
		//console.log(JSON.stringify(children))
	}
}
