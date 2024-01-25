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
		[{"tag":"text","text":"fonts","x":348,"y":22,"w":67,"h":49},{"tag":"path","text":"","x":349,"y":23,"w":74,"h":56}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":99,"w":179,"h":26},{"tag":"path","text":"","x":293,"y":94,"w":185,"h":32}],
		[{"tag":"text","text":"hopping","x":17,"y":142,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":141,"w":67,"h":23}],
		[{"tag":"text","text":"composer (Origin)","x":666,"y":143,"w":88,"h":12},{"tag":"path","text":"","x":665,"y":141,"w":91,"h":16}],
		[{"tag":"text","text":"author","x":723,"y":161,"w":31,"h":12},{"tag":"path","text":"","x":721,"y":159,"w":35,"h":15}],
		[{"tag":"text","text":"Part Order","x":19,"y":184,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":177,"w":191,"h":54}],
		[{"tag":"text","text":"This is","x":143,"y":255,"w":67,"h":29},{"tag":"path","text":"","x":220,"y":267,"w":10,"h":8},{"tag":"path","text":"","x":226,"y":256,"w":1,"h":14},{"tag":"text","text":"= 190","x":232,"y":255,"w":58,"h":29},{"tag":"text","text":"Fast","x":301,"y":255,"w":42,"h":29}],
		[{"tag":"text","text":"Part","x":146,"y":285,"w":72,"h":45},{"tag":"path","text":"","x":143,"y":279,"w":80,"h":54}],
		[{"tag":"text","text":"C","x":186,"y":357,"w":24,"h":37},{"tag":"path","text":"","x":183,"y":351,"w":31,"h":45}],
		[{"tag":"text","text":"No Chord","x":334,"y":355,"w":80,"h":22},{"tag":"path","text":"","x":332,"y":351,"w":85,"h":27}],
		[{"tag":"path","text":"","x":515,"y":409,"w":123,"h":5},{"tag":"text","text":"3","x":564,"y":355,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":18,"y":517,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":514,"w":144,"h":41}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":567,"w":164,"h":26},{"tag":"path","text":"","x":301,"y":563,"w":169,"h":32}],
		[{"tag":"text","text":"more extra text","x":18,"y":686,"w":220,"h":34},{"tag":"path","text":"","x":15,"y":683,"w":227,"h":41}],
		[{"tag":"text","text":"The extra verses","x":15,"y":753,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":15,"y":775,"w":178,"h":20}],
		[{"tag":"text","text":"Source: source","x":16,"y":840,"w":76,"h":13},{"tag":"path","text":"","x":15,"y":836,"w":80,"h":16}],
		[{"tag":"text","text":"Notes:The notes","x":16,"y":862,"w":51,"h":27},{"tag":"path","text":"","x":15,"y":856,"w":55,"h":31}],
		[{"tag":"text","text":"History:History","x":16,"y":901,"w":43,"h":28},{"tag":"path","text":"","x":15,"y":895,"w":47,"h":31}],
		[{"tag":"text","text":"2","x":468,"y":401,"w":5,"h":10},{"tag":"path","text":"","x":467,"y":399,"w":8,"h":13}],
		[{"tag":"path","text":"","x":515,"y":389,"w":123,"h":5},{"tag":"text","text":"3","x":565,"y":335,"w":23,"h":82}],
		[{"tag":"text","text":"3","x":12,"y":591,"w":5,"h":10},{"tag":"path","text":"","x":12,"y":589,"w":8,"h":13}],
		[{"tag":"text","text":"4","x":398,"y":591,"w":5,"h":10},{"tag":"path","text":"","x":397,"y":589,"w":8,"h":13}],
	];

	var expected50 = [
		[{"tag":"text","text":"fonts","x":348,"y":34,"w":67,"h":49},{"tag":"path","text":"","x":336,"y":23,"w":99,"h":81}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":162,"w":179,"h":26},{"tag":"path","text":"","x":284,"y":148,"w":203,"h":50}],
		[{"tag":"text","text":"hopping","x":23,"y":242,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":235,"w":79,"h":35}],
		[{"tag":"text","text":"composer (Origin)","x":661,"y":241,"w":88,"h":12},{"tag":"path","text":"","x":656,"y":235,"w":100,"h":24}],
		[{"tag":"text","text":"author","x":718,"y":278,"w":31,"h":12},{"tag":"path","text":"","x":713,"y":272,"w":43,"h":24}],
		[{"tag":"text","text":"Part Order","x":35,"y":331,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":309,"w":222,"h":85}],
		[{"tag":"text","text":"This is","x":216,"y":455,"w":67,"h":29},{"tag":"path","text":"","x":293,"y":467,"w":10,"h":8},{"tag":"path","text":"","x":300,"y":456,"w":1,"h":14},{"tag":"text","text":"= 190","x":306,"y":455,"w":58,"h":29},{"tag":"text","text":"Fast","x":375,"y":455,"w":42,"h":29}],
		[{"tag":"text","text":"Part","x":236,"y":501,"w":72,"h":45},{"tag":"path","text":"","x":216,"y":479,"w":112,"h":85}],
		[{"tag":"text","text":"C","x":285,"y":633,"w":24,"h":37},{"tag":"path","text":"","x":268,"y":613,"w":58,"h":71}],
		[{"tag":"text","text":"No Chord","x":414,"y":625,"w":80,"h":22},{"tag":"path","text":"","x":404,"y":613,"w":101,"h":43}],
		[{"tag":"path","text":"","x":560,"y":725,"w":101,"h":5},{"tag":"text","text":"3","x":599,"y":671,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":29,"y":844,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":830,"w":167,"h":63}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":937,"w":164,"h":26},{"tag":"path","text":"","x":292,"y":923,"w":188,"h":50}],
		[{"tag":"text","text":"more extra text","x":29,"y":1106,"w":220,"h":34},{"tag":"path","text":"","x":15,"y":1092,"w":249,"h":63}],
		[{"tag":"text","text":"The extra verses","x":15,"y":1207,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":15,"y":1229,"w":178,"h":20}],
		[{"tag":"text","text":"Source: source","x":21,"y":1298,"w":76,"h":13},{"tag":"path","text":"","x":15,"y":1290,"w":89,"h":26}],
		[{"tag":"text","text":"Notes:The notes","x":21,"y":1341,"w":51,"h":27},{"tag":"path","text":"","x":15,"y":1331,"w":64,"h":40}],
		[{"tag":"text","text":"History:History","x":21,"y":1422,"w":43,"h":28},{"tag":"path","text":"","x":15,"y":1412,"w":56,"h":41}],
		[{"tag":"text","text":"voice","x":27,"y":706,"w":60,"h":28},{"tag":"path","text":"","x":15,"y":701,"w":84,"h":52}],
		[{"tag":"text","text":"2","x":514,"y":690,"w":5,"h":10},{"tag":"path","text":"","x":509,"y":684,"w":15,"h":20}],
		[{"tag":"text","text":"3","x":5,"y":965,"w":5,"h":10},{"tag":"path","text":"","x":1,"y":960,"w":15,"h":20}],
		[{"tag":"text","text":"4","x":398,"y":965,"w":5,"h":10},{"tag":"path","text":"","x":394,"y":960,"w":15,"h":20}],
	];

	var expected100 = [
		[{"tag":"text","text":"fonts","x":348,"y":50,"w":67,"h":49},{"tag":"path","text":"","x":321,"y":23,"w":130,"h":112}],
		[{"tag":"text","text":"changing all fonts","x":295,"y":241,"w":179,"h":26},{"tag":"path","text":"","x":272,"y":216,"w":226,"h":73}],
		[{"tag":"text","text":"hopping","x":30,"y":369,"w":63,"h":19},{"tag":"path","text":"","x":15,"y":354,"w":94,"h":50}],
		[{"tag":"text","text":"composer (Origin)","x":656,"y":366,"w":88,"h":12},{"tag":"path","text":"","x":645,"y":354,"w":111,"h":35}],
		[{"tag":"text","text":"author","x":713,"y":428,"w":31,"h":12},{"tag":"path","text":"","x":702,"y":416,"w":54,"h":35}],
		[{"tag":"text","text":"Part Order","x":54,"y":520,"w":182,"h":45},{"tag":"path","text":"","x":15,"y":478,"w":261,"h":124}],
		[{"tag":"text","text":"This is","x":308,"y":710,"w":67,"h":29},{"tag":"path","text":"","x":385,"y":722,"w":10,"h":8},{"tag":"path","text":"","x":392,"y":711,"w":1,"h":14},{"tag":"text","text":"= 190","x":398,"y":710,"w":58,"h":29},{"tag":"text","text":"Fast","x":467,"y":710,"w":42,"h":29}],
		[{"tag":"text","text":"Part","x":347,"y":776,"w":72,"h":45},{"tag":"path","text":"","x":308,"y":734,"w":151,"h":124}],
		[{"tag":"text","text":"C","x":410,"y":982,"w":24,"h":37},{"tag":"path","text":"","x":377,"y":946,"w":91,"h":104}],
		[{"tag":"text","text":"No Chord","x":557,"y":968,"w":80,"h":22},{"tag":"path","text":"","x":537,"y":946,"w":121,"h":63}],
		[{"tag":"path","text":"","x":643,"y":1142,"w":62,"h":5},{"tag":"text","text":"3","x":662,"y":1088,"w":23,"h":82}],
		[{"tag":"text","text":"extra text","x":43,"y":1275,"w":138,"h":34},{"tag":"path","text":"","x":15,"y":1247,"w":195,"h":91}],
		[{"tag":"text","text":"Another Subtitle","x":303,"y":1421,"w":164,"h":26},{"tag":"path","text":"","x":280,"y":1396,"w":211,"h":73}],
		[{"tag":"text","text":"more extra text","x":43,"y":1657,"w":220,"h":34},{"tag":"path","text":"","x":15,"y":1629,"w":277,"h":91}],
		[{"tag":"text","text":"The extra verses","x":15,"y":1800,"w":122,"h":20},{"tag":"text","text":"The extra verses - line 2","x":15,"y":1822,"w":178,"h":20}],
		[{"tag":"text","text":"Source: source","x":27,"y":1897,"w":76,"h":13},{"tag":"path","text":"","x":15,"y":1883,"w":101,"h":38}],
		[{"tag":"text","text":"Notes:The notes","x":27,"y":1966,"w":51,"h":27},{"tag":"path","text":"","x":15,"y":1950,"w":76,"h":52}],
		[{"tag":"text","text":"History:History","x":27,"y":2100,"w":43,"h":28},{"tag":"path","text":"","x":15,"y":2084,"w":68,"h":53}],
		[{"tag":"text","text":"voice","x":38,"y":1087,"w":60,"h":28},{"tag":"path","text":"","x":15,"y":1082,"w":107,"h":75}],
		[{"tag":"text","text":"2","x":597,"y":1068,"w":5,"h":10},{"tag":"path","text":"","x":588,"y":1058,"w":24,"h":29}],
		[{"tag":"text","text":"3","x":5,"y":1464,"w":5,"h":10},{"tag":"path","text":"","x":-4,"y":1454,"w":24,"h":29}],
		[{"tag":"text","text":"4","x":398,"y":1464,"w":5,"h":10},{"tag":"path","text":"","x":389,"y":1454,"w":24,"h":29}],
	];


	it("font-box", function() {
		doFontTest(abcFontBox, {  }, expected10, "10");
		doFontTest(abcFontBox, { format: { fontboxpadding: 0.5 }}, expected50, "50");
		doFontTest(abcFontBox, { format: { fontboxpadding: 1 }}, expected100, "100");
	})
})

var allTextSelectors = ".abcjs-title,.abcjs-subtitle,.abcjs-rhythm,.abcjs-composer,.abcjs-author,.abcjs-part-order,.abcjs-tempo,.abcjs-part,.abcjs-chord,.abcjs-annotation,.abcjs-voice-name,.abcjs-triplet,.abcjs-defined-text,.abcjs-bar-number,.abcjs-unaligned-words,.abcjs-extra-text";

function doFontTest(abc, params, expected, comment) {
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
		// if (comment === "100")
		 	console.log(JSON.stringify(children)+',')
		var msg = "Index: " + i + ' ' + comment + "\nrcv: " + JSON.stringify(children) + "\n" +
			"exp: " + JSON.stringify(expected[i]) + "\n";
		chai.assert.deepStrictEqual(children, expected[i], msg);
	}
}
