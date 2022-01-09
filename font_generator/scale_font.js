/*global Raphael */

var glyphnames = {
  "\ue100":"rests.whole", // whole
  "\ue101":"rests.half", // half
  "\ue107":"rests.quarter", // quarter
  "\ue109":"rests.8th", // eigth
  "\ue10a":"rests.16th", // 16th
  "\ue10b":"rests.32nd", // 32nd
  "\ue10c":"rests.64th", // 64th
  "\ue10d":"rests.128th", // 128th
  "\ue10e":"accidentals.sharp",
  "\ue10f":"accidentals.halfsharp",
  "\ue111":"accidentals.nat",
  "\ue112":"accidentals.flat",
  "\ue113":"accidentals.halfflat",
  "\ue114":"accidentals.dblflat",
  "\ue116":"accidentals.dblsharp",
  "\ue121":"dots.dot",
  "\ue124":"noteheads.dbl",
  "\ue125":"noteheads.whole",
  "\ue126":"noteheads.half",
  "\ue127":"noteheads.quarter",
  "\ue135":"noteheads.indeterminate",
  "\ue152":"scripts.ufermata",
  "\ue153":"scripts.dfermata",
  "\ue15b":"scripts.sforzato",
  "\ue15d":"scripts.staccato",
  "\ue160":"scripts.tenuto",
  "\ue163":"scripts.umarcato",
  "\ue164":"scripts.dmarcato",
  "\ue166":"scripts.stopped",
  "\ue167":"scripts.upbow",
  "\ue168":"scripts.downbow",
  "\ue16a":"scripts.turn",
  "\ue16b":"scripts.trill",
  "\ue171":"scripts.segno",
  "\ue172":"scripts.coda",
  "\ue174":"scripts.comma",
  "\ue179":"scripts.roll",
  "\ue17d":"scripts.prall",
  "\ue17e":"scripts.mordent",
  "\ue189":"flags.u8th",  
  "\ue18a":"flags.u16th",
  "\ue18b":"flags.u32nd",
  "\ue18c":"flags.u64th",
  //"\ue18d":"flags.u128th",
  "\ue18d":"flags.d8th",
  "\ue18e":"flags.ugrace",
  "\ue18f":"flags.dgrace",
  "\ue190":"flags.d16th",
  "\ue191":"flags.d32nd",
  "\ue192":"flags.d64th",
  //"\ue193":"flags.d128th",
  "\ue193":"clefs.C",
  "\ue195":"clefs.F",
  "\ue197":"clefs.G",
  "\ue199":"clefs.perc",
  "\ue19b": "tab.big",
  "\ue19c": "tab.tiny",
  "\ue19d": "timesig.common",
  "\ue19e":"timesig.cut",
  "0":"0",
  "1":"1",
  "2":"2",
  "3":"3",
  "4":"4",
  "5":"5",
  "6":"6",
  "7":"7",
  "8":"8",
  "9":"9",
  "f":"f",
  "m":"m",
  "p":"p",
  "r":"r",
  "s":"s",
  "z":"z",
  "+":"+",
  ",":",",
  "-":"-",
  ".":".",
	"\ue120": "scripts.wedge",
	"\ue15a": "scripts.thumb",
	"\ue165": "scripts.open",
	"\ue1b6": "scripts.longphrase",
	"\ue1b7": "scripts.mediumphrase",
	"\ue1b8": "scripts.shortphrase",
	"\ue14e": "scripts.snap",

	// The custom characters from the abcjs font.
	"\ue300":"noteheads.slash.whole",
	"\ue301":"noteheads.slash.half",
	"\ue302":"noteheads.slash.quarter",
	"\ue303":"noteheads.harmonic.whole",
	"\ue304":"noteheads.harmonic.quarter"
};

Raphael.fn.toRelative = function(pathArray) {
	"use strict";
  var R = this.raphael;
  var push = "push";
  var length = "length";
  var proto = "prototype";
  var lowerCase = String[ proto].toLowerCase;
  var toString = "toString";
  if (!R.is(pathArray, "array") || !R.is(pathArray && pathArray[0], "array")) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] === "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[push](["M", x, y]);
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] !== lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
							for (var z = 1, zz = pa[length]; z < zz; z++) {
								r[z] = +(pa[z] - ((z % 2) ? x : y)).toFixed(3);
							}
							break;
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] === "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][length];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
};

window.scale_font = function(font, size, raphael, output) {
	"use strict";
	var scale = size / font.face["units-per-em"];
	var res = [];
	for (var glyph in glyphnames) {
		if (glyphnames.hasOwnProperty(glyph)) {
			var symb;
			try {
				symb = raphael.path(font.glyphs[glyph].d).attr({fill: "#000", stroke: "none"});
				//symb.scale(scale,scale,0,0);
			} catch (e) {continue;}
			var path = symb.attrs.path;
			if (path === null) {
				continue;
			}
			path = raphael.toRelative(path);
			// Do the scaling
			for (var i = 0; i < path.length; i++) {
				path[i][0] = "'" + path[i][0] + "'";
				for (var j = 1; j < path[i].length; j++) {
					path[i][j] = (path[i][j] * scale).toFixed(2);
				}
			}
//			path[0][1] = +path[0][1].toFixed(3); // round out the M part
//			path[0][2] = +path[0][2].toFixed(3);
			var w = Math.round(symb.getBBox().width * scale * 1000) / 1000;
			var h = Math.round(symb.getBBox().height * scale * 1000) / 1000;
			var gstr = "'";
			gstr += glyphnames[glyph];
			gstr += "':{d:";
			var arr = [];
			for (i = 0; i < path.length; i++) {
				arr.push('[' + path[i].join(',') + ']');
			}
			gstr += '[' + arr.join(',') + ']';
			gstr += ",w:" + w + ",h:" + h + "}";
			res[res.length] = gstr;
		}
	}
	var div = document.getElementById(output);
	div.innerHTML = "{" + res.join(",<br>") + "};";
};

window.doScale = function(canvas, output, fontFace) {
	"use strict";
	var el = document.getElementById(canvas);
	el.style = "display:block;";
	var paper = Raphael(el, 1000, 600);
	var font = paper.getFont(fontFace, 500);
	window.scale_font(font, 30, paper, output);
	el.style = "display:none;";
};

window.showFont = function(outputId, fontFace) {
	"use strict";
	var paper = Raphael(document.getElementById(outputId), 1000, 10000);
	var font = paper.getFont(fontFace, 500);
	var scale = 30 / 1000;
	var x = 0;
	var y = 50;
	for (var glyph in font.glyphs) {
		if (font.glyphs.hasOwnProperty(glyph)) {
			try {
				var symb = paper.path(font.glyphs[glyph].d).attr({fill: "#000", stroke: "none"});
				symb.scale(scale, scale, x + 50, y);
				paper.text(x + 20, y, glyph.charCodeAt(0).toString(16)).attr("text-anchor", "left");
			} catch (e) {

			}
			x = (x + 100) % 900;
			if (x === 0) y += 50;
		}
	}
	y += 40;
	paper.canvas.parentNode.style.height=""+y+"px";
	paper.setSize(1000,y);
};

