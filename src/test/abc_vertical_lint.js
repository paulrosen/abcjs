//    abc_vertical_lint.js: Analyzes the vertical position of the output object.

//This file takes as input the output structure of the writing routine and lists the vertical position of all the elements.

/*globals toString */

var verticalLint = function(tunes) {
	"use strict";

	function fixed(digits, zero, num) {
		if (num === undefined)
			return "undefined";
		if (typeof num !== "number")
			return num;
		var str = num.toFixed(digits);
		if (str.indexOf(zero) > 0)
			return str.split('.')[0];
		while (str.length && str[str.length-1] === '0')
			str = str.substr(0,str.length-1);
		return str;
	}
	function fixed1(num) {
		return fixed(1, ".0", num);
	}
	function fixed2(num) {
		return fixed(2, ".00", num);
	}
	function fixed4(num) {
		return fixed(4, ".0000", num);
	}
	function formatY(obj) {
		return "y= ( " + fixed1(obj.bottom) + ' , ' + fixed1(obj.top) + " )";
	}
	function formatX(obj) {
		return " x=" + fixed1(obj.x) + ' w=' + fixed1(obj.width);
	}
	function formatArrayStart(tabs, i) {
		return tabs + i + ": ";
	}
	function collectBrace(brace) {
		var ret;
		if (brace) {
			ret = [];
			for (var b1 = 0; b1 < brace.length; b1++) {
				var bracket = {
					x: brace[b1].x,
					top: fixed1(brace[b1].startY),
					bottom: fixed1(brace[b1].endY)
				};
				if (brace[b1].header)
					bracket.header = brace[b1].header;
				ret.push(bracket);
			}
		}
		return ret;
	}
	function getType(obj) {
		if (obj.$type.indexOf('staff-extra') >= 0) {
			if (obj.elem.length === 1) {
				switch(obj.elem[0]) {
					case "symbol clefs.G":
						return "Treble Clef";
					case "symbol clefs.F":
						return "Bass Clef";
					case "symbol clefs.C":
						return "C Clef";
					case "symbol timesig.common":
						return "Time Common";
					case "symbol timesig.cut":
						return "Time Cut";
					case "symbol timesig.imperfectum":
						return "Time Imperfectum";
					case "symbol timesig.imperfectum2":
						return "Time Imperfectum 2";
					case "symbol timesig.perfectum":
						return "Time Perfectum";
					case "symbol timesig.perfectum2":
						return "Time Perfectum 2";
					case "symbol clefs.perc":
						return "Percussion Clef";
				}
			} else if (obj.elem.length === 2) {
				switch(obj.elem[0]) {
					case "symbol clefs.G":
						if (obj.elem[1] === 'symbol 8')
							return "Treble Clef 8";
						else if (obj.elem[1].indexOf("barNumber") === 0)
							return "Treble Clef [bar=" + obj.elem[1].substring(10) + "]";
						break;
					case "symbol clefs.F":
						if (obj.elem[1] === 'symbol 8')
							return "Bass Clef 8";
						break;
					case "symbol clefs.C":
						if (obj.elem[1] === 'symbol 8')
							return "C Clef 8";
						break;
				}
				var left = obj.elem[0].replace("symbol ", "");
				var right = obj.elem[1].replace("symbol ", "");
				left = parseInt(left,10);
				right = parseInt(right,10);
				if (!isNaN(left) && !isNaN(right))
					return "Time Sig " + left + "/" + right;
			}
			if (obj.elem[0] === "symbol accidentals.sharp" || obj.elem[0] === "symbol accidentals.flat" || obj.elem[0] === "symbol accidentals.nat" || obj.elem[0] === "symbol accidentals.halfsharp" || obj.elem[0] === "symbol accidentals.halfflat")
				return "Key Sig " + obj.elem.join(" ").replace(/symbol/g,"");
			if (obj.elem.length > 0) {
				if (obj.elem[0] === 'symbol 1' || obj.elem[0] === 'symbol 2' || obj.elem[0] === 'symbol 3' || obj.elem[0] === 'symbol 4' || obj.elem[0] === 'symbol 5' || obj.elem[0] === 'symbol 6' || obj.elem[0] === 'symbol 7' || obj.elem[0] === 'symbol 8' || obj.elem[0] === 'symbol 9')
				return "Time Sig (odd): " + obj.elem.join('').replace(/symbol /g,"");
			}
		} else if (obj.$type.indexOf("note") === 0 || obj.$type.indexOf("rest") === 0) {
			return obj.$type + " " + fixed4(obj.duration) + ' ' + obj.elem.join(" ").replace(/symbol /g,"").replace(/\n/g, "\\n");
		} else if (obj.$type === 'bar')
			return "Bar";
		else if (obj.$type === 'part')
			return obj.elem[0];
		else if (obj.$type === 'tempo')
			return "Tempo " + obj.elem[0];
		return "unknown";
	}

	function formatStaffs(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = "\n";
		for (i = 0; i < arr.length; i++) {
			var obj = arr[i];
			str += formatArrayStart(tabs, i) + formatY(obj) + "\n";
		}
		return tabs + str;
	}

	function formatVoices(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = "\n";
		for (i = 0; i < arr.length; i++) {
			var obj = arr[i];
			str += formatArrayStart(tabs, i) + formatY(obj);
			str += formatElements(obj.voiceChildren, indent+1);
			if (obj.otherChildren.length > 0)
				str += formatOtherChildren(obj.otherChildren, indent+1);
			if (obj.beams.length > 0)
				str += formatBeams(obj.beams, indent+1);
		}
		return tabs + str;
	}

	function formatClasses(obj) {
		if (obj.classes)
			return " " + obj.classes;
		return '';
	}

	function formatElements(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = "\n";
		for (i = 0; i < arr.length; i++) {
			var obj = arr[i];
			var type = getType(obj);
			if (type === "unknown")
				str += formatArrayStart(tabs, i) + "\n" + formatObject(obj, indent) + formatClasses(obj) + "\n";
			else
				str += formatArrayStart(tabs, i) + type + ' ' + formatY(obj) + formatX(obj) + formatClasses(obj) + "\n";
		}
		return tabs + str;
	}

	function formatOtherChildren(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = tabs + "Other Children:\n";
		for (i = 0; i < arr.length; i++) {
			str += formatArrayStart(tabs, i);
			var keys = Object.keys(arr[i].params);
			keys = keys.sort();
			var params = "";
			for (var j = 0; j < keys.length; j++)
				params += keys[j] + ": " + arr[i].params[keys[j]] + " ";
			str += arr[i].type + " (" + params + ")" + formatClasses(arr[i].params) + "\n";
		}
		return str + "\n";
	}

	function formatBeams(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = tabs + "Beams:\n";
		for (i = 0; i < arr.length; i++) {
			str += formatArrayStart(tabs, i);
			var keys = Object.keys(arr[i].params);
			keys = keys.sort();
			var params = "";
			for (var j = 0; j < keys.length; j++)
				params += keys[j] + ": " + arr[i].params[keys[j]] + " ";
			str += arr[i].type + " (" + params + ")\n";
		}
		return str + "\n";
	}

	function formatArray(arr, indent) {
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";
		var str = " [\n";
		for (i = 0; i < arr.length; i++) {
			var obj = arr[i];
			if (typeof obj === "string" || typeof obj === "number")
				str += tabs + i + ": " + obj + "\n";
			else
				str += tabs + i + ":\n" + formatObject(obj, indent+1) +"\n";
		}
		return tabs + str + tabs + "]";
	}

	function formatObject(obj, indent) {
		var str = [];
		var tabs = "";
		for (var i = 0; i < indent; i++) tabs += "\t";

		if (typeof obj === "string" || typeof obj === "number")
			return tabs + obj;

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var value = obj[key];
				var prefix = tabs + key + ": ";
				if (key === 'staffs')
					str.push(prefix + formatStaffs(value, indent+1));
				else if (key === 'voiceChildren')
					str.push(prefix + formatElements(value, indent+1));
				else if (toString.call(value) === "[object Array]")
					str.push(prefix + formatArray(value, indent+1));
				else if (typeof value === "object")
					str.push(prefix + formatObject(value, indent+1));
				else if (typeof value === "number")
					str.push(prefix + fixed1(value));
				else
					str.push(prefix + value);
			}
		}
		str = str.sort();
		return str.join("\n");
	}

	function addHeader(obj) {
		if (obj.header)
			return " " + obj.header;
		return "";
	}

	function formatLine(line, lineNum) {
		var str = "";
		str += "Line: " + lineNum + ": (" + fixed1(line.height) + ")\n";
		if (line.brace) {
			for (var i = 0; i < line.brace.length; i++)
				str += "brace: " + fixed1(line.brace[i].x) + " " + formatY(line.brace[i]) + addHeader(line.brace[i]) + "\n";
		}
		if (line.bracket) {
			for (var i2 = 0; i2 < line.bracket.length; i2++)
			str += "bracket: " + fixed1(line.bracket[i2].x) + " " + formatY(line.bracket[i2]) + addHeader(line.bracket[i2]) + "\n";
		}
		str += "staffs: " + formatStaffs(line.staffs, 1);
		str += "voices: " + formatVoices(line.voices, 1);
		return str;
	}

	function setSpecialY(obj) {
		var ret = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[ret])
					ret[key] = obj[ret];
			}
		}
		return ret;
	}

	function extractPositioningInfo(staffGroup, lineNum) {
		var ret = { height: staffGroup.height, minSpace: staffGroup.minspace, spacingUnits: staffGroup.spacingunits, width: staffGroup.w, startX: staffGroup.startX, staffs: [], voices: [] };
		ret.brace = collectBrace(staffGroup.brace);
		ret.bracket = collectBrace(staffGroup.bracket);
		for (var i = 0; i < staffGroup.staffs.length; i++) {
			var staff = staffGroup.staffs[i];
			ret.staffs.push({bottom: fixed1(staff.bottom), top: fixed1(staff.top), specialY: setSpecialY(staff) });
		}
		for (i = 0; i < staffGroup.voices.length; i++) {
			var voice = staffGroup.voices[i];
			var obj = { bottom: fixed1(voice.bottom), top: fixed1(voice.top), specialY: setSpecialY(voice), width: fixed1(voice.w), startX: voice.startX, voiceChildren: [], otherChildren: [], beams: [] };
			for (var j = 0; j < voice.children.length; j++) {
				var child = voice.children[j];
				var type = child.type;
				var classes = [];
				if (child.elemset) {
					for (var jj = 0; jj < child.elemset.length; jj++) {
						var cl = child.elemset[jj].classList;
						if (cl && cl.length > 0) {
							for (var jjj = 0; jjj < cl.length; jjj++)
								classes.push(cl[jjj]);
						}
					}
				}
				if (type === 'note' || type === 'rest') {
					if (child.abcelem.pitches) {
						var pitches = [];
						for (var ii = 0; ii < child.abcelem.pitches.length; ii++) pitches.push(child.abcelem.pitches[ii].verticalPos);
						type += "(" + pitches.join(',') + ")";
					} else {
						var r = "rest";
						switch (child.abcelem.rest.type) {
							case "invisible": r += "/inv"; break;
							case "spacer": r += "/sp"; break;
						}
						type = "note(" + r + ")";
					}
					if (child.abcelem.lyric && child.abcelem.lyric.length > 0) type += " " + child.abcelem.lyric[0].syllable;
				}
				var obj2 = { $type: type, bottom: fixed1(child.bottom), top: fixed1(child.top), specialY: setSpecialY(child), minSpacing: child.minspacing, duration: child.duration, width: child.w, x: child.x };
				if (classes.length > 0)
					obj2.classes = classes.join(" ");
				obj2.elem = [];
				if (type === 'tempo') {
					var tempo = child.children[0].tempo;
					var tempoNote = child.children[0].note;
					var arr = [];
					if (tempo.preString)
						arr.push(tempo.preString);
					else
						arr.push('*');
					arr.push(tempo.duration);
					if (tempo.postString)
						arr.push(tempo.postString);
					else
						arr.push('*');
					if (tempoNote) {
						arr.push(' note(' + fixed1(tempoNote.top) + ',' + fixed1(tempoNote.bottom) + ',' + fixed1(tempoNote.x) + ',' + fixed1(tempoNote.w) + ')');
					}
					obj2.elem.push(arr.join(' '));
				}
				else if (child.children.length) {
					for (var k = 0; k < child.children.length; k++) {
						var str = child.children[k].type;
						if (child.children[k].c)
							str += " " + child.children[k].c;
						obj2.elem.push(str);
					}
				}
				obj.voiceChildren.push(obj2);
			}
			for (j = 0; j < voice.otherchildren.length; j++) {
				var otherChild = voice.otherchildren[j];
				var className = otherChild.constructor.name;
				var ch = { type: className, params: {} };
				if (className === "String")
					ch.params.value = otherChild;
				else {
					for (var key in otherChild) {
						if (otherChild.hasOwnProperty(key)) {
							var value = otherChild[key];
							if (value === null)
								ch.params[key] = "null";
							else if (value === className && key === 'type')
								;
							else if (key === "elemset") {
								var cls = [];
								for (var j2 = 0; j2 < otherChild.elemset.length; j2++) {
									var c2 = otherChild.elemset[j2].classList;
									if (c2 && c2.length > 0) {
										for (var j3 = 0; j3 < c2.length; j3++)
											cls.push(c2[j3]);
									}
								}
								ch.params.classes = cls.join(" ");
							}
							else if (typeof value === "object") {
								var obj3 = value.constructor.name + '[';
								switch (value.constructor.name) {
									case "AbsoluteElement":
										obj3 += value.type;
										break;
									case "RelativeElement":
										obj3 += value.pitch;
										break;
									case "Array":
										obj3 += value.length;
										break;
									default:
										console.log(value.constructor.name);
										ch.params[key] = value.constructor.name;
										break;
								}
								ch.params[key] = obj3 +']';
							} else if (typeof value === "number")
								ch.params[key] = fixed1(value);
							else
								ch.params[key] = value;
						}
					}
				}
				obj.otherChildren.push(ch);
			}
			for (j = 0; j < voice.beams.length; j++) {
				var beam = voice.beams[j];
				var className2 = beam.constructor.name;
				var ch2 = { type: className2, params: {} };
				if (className2 === "String")
					ch2.params.value = beam;
				else {
					for (var key2 in beam) {
						if (beam.hasOwnProperty(key2)) {
							var value2 = beam[key2];
							if (typeof value2 === "object")
								ch2.params[key2] = "object";
							else
								ch2.params[key2] = value2;
						}
					}
				}
				obj.beams.push(ch2);
			}
			// TODO: there is also extra[], heads[], elemset[], and right[] to parse.
			ret.voices.push(obj);
		}
		return formatLine(ret, lineNum);
	}

	function extractText(label, arr) {
		var items = [];
		items.push(label);
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			items.push("\t" + JSON.stringify(item));
		}
		items.push("");
		return items.join("\n");
	}

	var positioning = [];
	for (var i = 0; i < tunes.length; i++) {
		var tune = tunes[i];
		if (tune.topText && tune.topText.rows.length > 0)
			positioning.push(extractText("Top Text", tune.topText.rows));
		for (var j = 0; j < tune.lines.length; j++) {
			var line = tune.lines[j];
			if (line.staffGroup)
				positioning.push(extractPositioningInfo(tune.lines[j].staffGroup, j));
			else
				positioning.push(JSON.stringify(line));
		}
	}
	if (tune.bottomText && tune.bottomText.rows.length > 0)
		positioning.push(extractText("Bottom Text", tune.bottomText.rows));
	return positioning;
};

module.exports = verticalLint;
