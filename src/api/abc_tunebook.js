//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.
//    Copyright (C) 2010-2018 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global document */
/*global window, ABCJS, console */

var parseCommon = require('../parse/abc_common');
var Parse = require('../parse/abc_parse');

var tunebook = {};

(function() {
	"use strict";

	tunebook.numberOfTunes = function(abc) {
		var tunes = abc.split("\nX:");
		var num = tunes.length;
		if (num === 0) num = 1;
		return num;
	};

	var TuneBook = tunebook.TuneBook = function(book) {
		var This = this;
		var directives = "";
		book = parseCommon.strip(book);
		var tunes = book.split("\nX:");
		for (var i = 1; i < tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
			tunes[i] = "X:" + tunes[i];
		// Keep track of the character position each tune starts with.
		var pos = 0;
		This.tunes = [];
		parseCommon.each(tunes, function(tune) {
			This.tunes.push({ abc: tune, startPos: pos});
			pos += tune.length + 1; // We also lost a newline when splitting, so count that.
		});
		if (This.tunes.length > 1 && !parseCommon.startsWith(This.tunes[0].abc, 'X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
			// There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
			// just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
			// the tune is parsed all at once. The directives will be seen before the engraver begins processing.
			var dir = This.tunes.shift();
			var arrDir = dir.abc.split('\n');
			parseCommon.each(arrDir, function(line) {
				if (parseCommon.startsWith(line, '%%'))
					directives += line + '\n';
			});
		}
		This.header = directives;

		// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
		parseCommon.each(This.tunes, function(tune) {
			var end = tune.abc.indexOf('\n\n');
			if (end > 0)
				tune.abc = tune.abc.substring(0, end);
			tune.pure = tune.abc;
			tune.abc = directives + tune.abc;

			// for the user's convenience, parse and store the title separately. The title is between the first T: and the next \n
			var title = tune.pure.split("T:");
			if (title.length > 1) {
				title = title[1].split("\n");
				tune.title = title[0].replace(/^\s+|\s+$/g, '');
			} else
				tune.title = "";

			// for the user's convenience, parse and store the id separately. The id is between the first X: and the next \n
			var id = tune.pure.substring(2, tune.pure.indexOf("\n"));
			tune.id = id.replace(/^\s+|\s+$/g, '');
		});
	};

	TuneBook.prototype.getTuneById = function(id) {
		for (var i = 0; i < this.tunes.length; i++) {
			if (this.tunes[i].id === id)
				return this.tunes[i];
		}
		return null;
	};

	TuneBook.prototype.getTuneByTitle = function(title) {
		for (var i = 0; i < this.tunes.length; i++) {
			if (this.tunes[i].title === title)
				return this.tunes[i];
		}
		return null;
	};

	tunebook.parseOnly = function(abc, params) {
		var tunes = [];
		var numTunes = tunebook.numberOfTunes(abc);

		// this just needs to be passed in because this tells the engine how many tunes to process.
		var output = [];
		for (var i = 0; i < numTunes; i++) {
			output.push(1);
		}
		function callback() {
			// Don't need to do anything with the parsed tunes.
		}
		return tunebook.renderEngine(callback, output, abc, params);
	};

	tunebook.renderEngine = function (callback, output, abc, params) {
		var ret = [];
		var isArray = function(testObject) {
			return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
		};

		// check and normalize input parameters
		if (output === undefined || abc === undefined)
			return;
		if (!isArray(output))
			output = [ output ];
		if (params === undefined)
			params = {};
		var currentTune = params.startingTune ? parseInt(params.startingTune, 10) : 0;

		// parse the abc string
		var book = new TuneBook(abc);
		var abcParser = new Parse();

		// output each tune, if it exists. Otherwise clear the div.
		for (var i = 0; i < output.length; i++) {
			var div = output[i];
			if (typeof(div) === "string")
				div = document.getElementById(div);
			if (div) {
				if (currentTune >= 0 && currentTune < book.tunes.length) {
					abcParser.parse(book.tunes[currentTune].abc, params);
					var tune = abcParser.getTune();
					var override = callback(div, tune, i, book.tunes[currentTune].abc);
					ret.push(override ? override : tune);
				} else {
					if (div.hasOwnProperty('innerHTML'))
						div.innerHTML = "";
				}
			}
			currentTune++;
		}
		return ret;
	};

	function flattenTune(tuneObj) {
		// This removes the line breaks and removes the non-music lines.
		var staves = [];
		for (var j = 0; j < tuneObj.lines.length; j++) {
			var line = tuneObj.lines[j];
			if (line.staff) {
				for (var k = 0; k < line.staff.length; k++) {
					var staff = line.staff[k];
					if (!staves[k])
						staves[k] = staff;
					else {
						for (var i = 0; i < staff.voices.length; i++) {
							if (staves[k].voices[i])
								staves[k].voices[i] = staves[k].voices[i].concat(staff.voices[i]);
							// TODO-PER: If staves[k].voices[i] doesn't exist, that means a voice appeared in the middle of the tune. That isn't handled yet.
						}
					}
				}
			}
		}
		return staves;
	}

	function measuresParser(staff, tune) {
		var voices = [];
		var lastChord = null;
		var measureStartChord = null;
		var fragStart = null;
		var hasNotes = false;

		for (var i = 0; i < staff.voices.length; i++) {
			var voice = staff.voices[i];
			voices.push([]);
			for (var j = 0; j < voice.length; j++) {
				var elem = voice[j];
				if (fragStart === null && elem.startChar >= 0) {
					fragStart = elem.startChar;
					if (elem.chord === undefined)
						measureStartChord = lastChord;
					else
						measureStartChord = null;
				}
				if (elem.chord)
					lastChord = elem;
				if (elem.el_type === 'bar') {
					if (hasNotes) {
						var frag = tune.abc.substring(fragStart, elem.endChar);
						var measure = {abc: frag};
						lastChord = measureStartChord && measureStartChord.chord && measureStartChord.chord.length > 0 ? measureStartChord.chord[0].name : null;
						if (lastChord)
							measure.lastChord = lastChord;
						if (elem.startEnding)
							measure.startEnding = elem.startEnding;
						if (elem.endEnding)
							measure.endEnding = elem.endEnding;
						voices[i].push(measure);
						fragStart = null;
						hasNotes = false;
					}
				} else if (elem.el_type === 'note') {
					hasNotes = true;
				}
			}
		}
		return voices;
	}

	tunebook.extractMeasures = function(abc) {
		var tunes = [];
		var book = new TuneBook(abc);
		for (var i = 0; i < book.tunes.length; i++) {
			var tune = book.tunes[i];
			var arr = tune.abc.split("K:");
			var arr2 = arr[1].split("\n");
			var header = arr[0] + "K:" + arr2[0] + "\n";
			var lastChord = null;
			var measureStartChord = null;
			var fragStart = null;
			var measures = [];
			var hasNotes = false;
			var tuneObj = tunebook.parseOnly(tune.abc)[0];
			var hasPickup = tuneObj.getPickupLength() > 0;
			// var staves = flattenTune(tuneObj);
			// for (var s = 0; s < staves.length; s++) {
			// 	var voices = measuresParser(staves[s], tune);
			// 	if (s === 0)
			// 		measures = voices;
			// 	else {
			// 		for (var ss = 0; ss < voices.length; ss++) {
			// 			var voice = voices[ss];
			// 			if (measures.length <= ss)
			// 				measures.push([]);
			// 			var measureVoice = measures[ss];
			// 			for (var sss = 0; sss < voice.length; sss++) {
			// 				if (measureVoice.length > sss)
			// 					measureVoice[sss].abc += "\n" + voice[sss].abc;
			// 				else
			// 					measures.push(voice[sss]);
			// 			}
			// 		}
			// 	}
			// 	console.log(voices);
			// }
			// measures = measures[0];

			for (var j = 0; j < tuneObj.lines.length; j++) {
				var line = tuneObj.lines[j];
				if (line.staff) {
					for (var k = 0; k < 1 /*line.staff.length*/; k++) {
						var staff = line.staff[k];
						for (var kk = 0; kk < 1 /*staff.voices.length*/; kk++) {
							var voice = staff.voices[kk];
							for (var kkk = 0; kkk < voice.length; kkk++) {
								var elem = voice[kkk];
								if (fragStart === null && elem.startChar >= 0) {
									fragStart = elem.startChar;
									if (elem.chord === undefined)
										measureStartChord = lastChord;
									else
										measureStartChord = null;
								}
								if (elem.chord)
									lastChord = elem;
								if (elem.el_type === 'bar') {
									if (hasNotes) {
										var frag = tune.abc.substring(fragStart, elem.endChar);
										var measure = {abc: frag};
										lastChord = measureStartChord && measureStartChord.chord && measureStartChord.chord.length > 0 ? measureStartChord.chord[0].name : null;
										if (lastChord)
											measure.lastChord = lastChord;
										if (elem.startEnding)
											measure.startEnding = elem.startEnding;
										if (elem.endEnding)
											measure.endEnding = elem.endEnding;
										measures.push(measure);
										fragStart = null;
										hasNotes = false;
									}
								} else if (elem.el_type === 'note') {
									hasNotes = true;
								}
							}
						}
					}
				}
			}
			tunes.push({
				header: header,
				measures: measures,
				hasPickup: hasPickup
			});
		}
		return tunes;
	};
})();

module.exports = tunebook;
