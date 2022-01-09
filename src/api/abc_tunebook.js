//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.

var Parse = require('../parse/abc_parse');
var bookParser = require('../parse/abc_parse_book');
var tablatures = require('./abc_tablatures');


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
		var parsed = bookParser(book);
		this.header = parsed.header;
		this.tunes = parsed.tunes;
	};

	TuneBook.prototype.getTuneById = function(id) {
		for (var i = 0; i < this.tunes.length; i++) {
			if (this.tunes[i].id === ''+id)
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
			if (div === "*") {
				// This is for "headless" rendering: doing the work but not showing the svg.
			} else if (typeof(div) === "string")
				div = document.getElementById(div);
			if (div) {
				if (currentTune >= 0 && currentTune < book.tunes.length) {
					abcParser.parse(book.tunes[currentTune].abc, params, book.tunes[currentTune].startPos - book.header.length);
					var tune = abcParser.getTune();
					//
					// Init tablatures plugins
					//
					if (params.tablature) {
						tablatures.init();
						tune.tablatures = tablatures.preparePlugins(tune, currentTune, params);
					}
					var warnings = abcParser.getWarnings();
					if (warnings)
						tune.warnings = warnings;
					var override = callback(div, tune, i, book.tunes[currentTune].abc);
					ret.push(override ? override : tune);
				} else {
					if (div['innerHTML'])
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
