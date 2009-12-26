/**
 * @author paulrosen
 *
 * This file takes as input the output of AbcParser and analyzes it to make sure there are no
 * unexpected elements in it. It also returns a person-readable version of it that is suitable
 * for regression tests.
 *
 */

/*global Class */
/*extern AbcParserLint */

var AbcParserLint = Class.create({

	initialize: function () {
		var err = "";
		var out = "";

		var addError = function(str, indent) {
			err += str + "\n";
		};

		var addOutput = function(str, indent) {
			var spacing = "";
			for (var i = 0; i < indent; i++)
				spacing += "\t";
			out += spacing + str + "\n";
			if (str.indexOf("[object Object]") >= 0)
				addError("Object not expanded: " + str);
			if (str.indexOf("undefined") >= 0)
				addError("property undefined: " + str);
		};

		var needs = function(obj, attr, name) {
			if (obj[attr] === undefined)
				addError(name + " must contain: " + attr);
		};
		var lacks = function(obj, attr, name) {
			if (obj[attr] !== undefined)
				addError(name + " cannot contain: " + attr);
		};
		var onlyArray = function(obj, name) {
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					var index = parseInt(property);
					if (index === 0 && property !== '0')
						addError(name + " should not contain: " + property);
				}
			});
		};
		var onlyContains = function(name, obj, arr) {
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					if (arr.indexOf(property) < 0)
						addError(name + " cannot contain: " + property);
				}
			});
		};

		var parseMetaText = function(obj) {
			addOutput("MetaText:", 0);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'title':
						case 'notes':
						case 'origin':
						case 'rhythm':
						case 'author':
						case 'history':
						case 'discography':
						case 'source':
						case 'book':
						case 'partOrder':
						case 'transcription':
						case 'unalignedWords':
							addOutput(property + ": " + obj[property], 1); break;
						case 'tempo':
							addOutput(property + ": duration=" + obj[property].duration + " bpm=" + obj[property].bpm);
							onlyContains("tempo", obj[property], [ "duration", "bpm" ]);
							break;
						default:
							addError("MetaText should not contain: " + property);
					}
				}
			});
		};

		var parseFormatting = function(obj) {
			addOutput("Formatting:", 0);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'stretchlast':
						case 'staffwidth':
						case 'scale':
							addOutput(property + ": " + obj[property], 1); break;
						default:
							addError("Formatting should not contain: " + property);
					}
				}
			});
		};

		var parseClef = function(obj) {
			var name = "Clef";
			addOutput(name + ": (" + obj.startChar + "," + obj.endChar + ")", 3);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'type':
							addOutput(property + ": " + obj[property], 4); break;
						case 'startChar':
						case 'endChar':
						case 'el_type': break;
						default:
							addError(name + " should not contain: " + property);
					}
				}
			});
		};

		var parseRegularKey = function(obj) {
			var name = "Regular Key";
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'num': break;
						case 'acc': break;
						default:
							addError(name + " should not contain: " + property);
					}
				}
			});

			needs(obj, "num", name);
			needs(obj, "acc", name);
			addOutput("(" + obj.num + ", " + obj.acc + ")", 4);
		};

		var parseGrace = function(obj) {
			var name = "Gracenotes";
			onlyArray(obj, name);
			obj.each(function(el) {
				addOutput(el.el_type + " " + el.pitch, 5);
			});
		};

		var parseKey = function(obj) {
			var name = "Key";
			addOutput(name + ": (" + obj.startChar + "," + obj.endChar + ")", 3);
			var processExtraAccidentals = function(obj, property) {
				var strAcc = "";
				obj[property].each(function(o) {
					onlyContains(property, o, ["acc", 'note']);
					strAcc += o.acc + " " + o.note + " ";
				});
				return strAcc;
			};

			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'regularKey':
							parseRegularKey(obj[property]); break;
						case 'extraAccidentals':
							onlyArray(property, obj[property]);
							var strAcc = processExtraAccidentals(obj, property);
							addOutput(property + ": " + strAcc, 4);
							break;
						case 'startChar':
						case 'endChar':
						case 'el_type': break;
						default:
							addError(name + " should not contain: " + property);
					}
				}
			});
		};

		var parseMeter = function(obj) {
			var name = "Meter";
			addOutput(name + ": (" + obj.startChar + "," + obj.endChar + ")", 3);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'type':
							if (obj[property] === 'specified')
								addOutput(property + ": " + obj[property] + ': ' + obj.num + '/' + obj.den, 4);
							else {
								addOutput(property + ": " + obj[property], 5);
								lacks(obj, "num", name);
								lacks(obj, "den", name);
							}
							break;
						case 'num':
						case 'den':
						case 'startChar':
						case 'endChar':
						case 'el_type': break;
						default:
							addError(name + " should not contain: " + property);
					}
				}
			});
		};

		var parseBar = function(obj) {
			var name = "Bar";
			//addOutput(name + ": (" + obj.startChar + "," + obj.endChar + ")", 3);
			addOutput(name + ":", 3);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				switch (property) {
					case 'type':
					case 'decoration':
					case 'number':
						addOutput(property + ": " + obj[property], 4); break;
					case 'chord':
						onlyContains(property, obj[property], [ 'name', 'position' ]);
						addOutput(property + ": " + obj[property].name + " " + obj[property].position, 4);
						break;
					case 'startChar':
					case 'endChar':
					case 'el_type': break;
					default:
						addError(name + " should not contain: " + property);
				}
			});
		};

		var parseNote = function(obj) {
			var name = "Note";
			//addOutput(name + ": (" + obj.startChar + "," + obj.endChar + ")", 3);
			addOutput(name + ":", 3);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'pitch':
						case 'duration':
						case 'end_beam':
						case 'startSlur':
						case 'endSlur':
						case 'startTriplet':
						case 'endTriplet':
						case 'startTie':
						case 'endTie':
						case 'decoration':
						case 'accidental':
						case 'rest_type':
							addOutput(property + ": " + obj[property], 4);
							break;
						case 'lyric':
							onlyContains(property, obj[property], [ 'divider', 'syllable' ]);
							addOutput(property + ": " + obj[property].syllable + " div=" + obj[property].divider, 4);
							break;
						case 'gracenotes':
							parseGrace(obj[property]); break;
						case 'chord':
							onlyContains(property, obj[property], [ 'name', 'position' ]);
							addOutput(property + ": " + obj[property].name + " " + obj[property].position, 4);
							break;
						case 'startChar':
						case 'endChar':
						case 'el_type': break;
						default:
							addError(name + " should not contain: " + property);
					}
				}
			});
		};

		var parseStaff = function(obj) {
			addOutput("Staff:", 2);
			onlyArray(obj, "Staff");
			obj.each(function(el) {
				var ty = el.el_type;
				switch (ty) {
					case "clef": parseClef(el); break;
					case "key": parseKey(el); break;
					case "meter": parseMeter(el); break;
					case "note": parseNote(el); break;
					case "bar": parseBar(el); break;
					default:
						addError("No staff element type of: " + ty);
				}
				if (el.startChar === undefined)
					addError("All elements need a startChar: " + el.el_type);
				if (el.endChar === undefined)
					addError("All elements need an endChar:" + el.el_type);
			});
		};

		var parseLine = function(obj, index) {
			addOutput("Line " + (index+1) + ":", 1);
			var keys = $H(obj).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					switch (property) {
						case 'staff':
							parseStaff(obj[property]);
							break;
						case 'subtitle':
							addOutput("Subtitle: " + obj[property]);
							break;
						default:
							addError("Line should not contain: " + property);
					}
				}
			});
		};

		var parseLines = function(obj) {
			addOutput("Lines:", 0);
			var keys = $H(obj).keys();
//			keys.sort();
			keys.each(function(property) {
				var t = typeof obj[property];
				if (t !== 'function') {
					var index = parseInt(property);
					if (index === 0 && property !== '0')
						addError("Lines should not contain: " + property);
					else {
						parseLine(obj[index], index);
					}
				}
			});
		};

		this.lint = function(tune, warnings) {
			//var str = Object.toJSON(tune);
			//str = str.gsub('},', '},\n');
			//str = str.gsub('", "', '",\n"');
			out = "";
			err = "";
			var keys = $H(tune).keys();
			keys.sort();
			keys.each(function(property) {
				var t = typeof tune[property];
				if (t !== 'function') {
					switch (property) {
						case 'metaText': parseMetaText(tune[property]); break;
						case 'formatting': parseFormatting(tune[property]); break;
						case 'lines': parseLines(tune[property]); break;
						default:
							addError("tune should not contain: " + property);
					}
				}
			});
			var warn = warnings === null ? "No errors" : warnings.join('\n');
			warn = warn.gsub('<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">', '$$$$');
			warn = warn.gsub('</span>', '$$$$');
			return "Error:------\n" + err + "\nObj:-------\n" + out + "\nWarn:------\n" + warn;
		};
	}
});


