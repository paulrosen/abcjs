//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global document, Raphael */
/*global window, ABCJS, console */

if (!window.ABCJS)
	window.ABCJS = {};

(function() {
	"use strict";

	ABCJS.numberOfTunes = function(abc) {
		var tunes = abc.split("\nX:");
		var num = tunes.length;
		if (num === 0) num = 1;
		return num;
	};

	ABCJS.TuneBook = function(book) {
		var This = this;
		var directives = "";
		book = window.ABCJS.parse.strip(book);
		var tunes = book.split("\nX:");
		for (var i = 1; i < tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
			tunes[i] = "X:" + tunes[i];
		// Keep track of the character position each tune starts with.
		var pos = 0;
		This.tunes = [];
		window.ABCJS.parse.each(tunes, function(tune) {
			This.tunes.push({ abc: tune, startPos: pos});
			pos += tune.length;
		});
		if (This.tunes.length > 1 && !window.ABCJS.parse.startsWith(This.tunes[0].abc, 'X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
			// There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
			// just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
			// the tune is parsed all at once. The directives will be seen before the engraver begins processing.
			var dir = This.tunes.shift();
			var arrDir = dir.abc.split('\n');
			window.ABCJS.parse.each(arrDir, function(line) {
				if (window.ABCJS.parse.startsWith(line, '%%'))
					directives += line + '\n';
			});
		}
		This.header = directives;

		// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
		window.ABCJS.parse.each(This.tunes, function(tune) {
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

	ABCJS.TuneBook.prototype.getTuneById = function(id) {
		for (var i = 0; i < this.tunes.length; i++) {
			if (this.tunes[i].id === id)
				return this.tunes[i];
		}
		return null;
	};

	ABCJS.TuneBook.prototype.getTuneByTitle = function(title) {
		for (var i = 0; i < this.tunes.length; i++) {
			if (this.tunes[i].title === title)
				return this.tunes[i];
		}
		return null;
	};

	function renderEngine(callback, output, abc, parserParams, renderParams) {
		var ret = [];
		var isArray = function(testObject) {
			return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
		};

		// check and normalize input parameters
		if (output === undefined || abc === undefined)
			return;
		if (!isArray(output))
			output = [ output ];
		if (parserParams === undefined)
			parserParams = {};
		if (renderParams === undefined)
			renderParams = {};
		var currentTune = renderParams.startingTune ? renderParams.startingTune : 0;

		// parse the abc string
		var book = new ABCJS.TuneBook(abc);
		var abcParser = new window.ABCJS.parse.Parse();

		// output each tune, if it exists. Otherwise clear the div.
		for (var i = 0; i < output.length; i++) {
			var div = output[i];
			if (typeof(div) === "string")
				div = document.getElementById(div);
			if (div) {
				div.innerHTML = "";
				if (currentTune < book.tunes.length) {
					abcParser.parse(book.tunes[currentTune].abc, parserParams);
					var tune = abcParser.getTune();
					ret.push(tune);
					callback(div, tune, i);
				}
			}
			currentTune++;
		}
		return ret;
	}

	var resizeDivs = {};
	function resizeOuter() {
		var width = window.innerWidth;
		for (var id in resizeDivs) {
			if (resizeDivs.hasOwnProperty(id)) {
				var outer = resizeDivs[id];
				var ofs = outer.offsetLeft;
				width -= ofs * 2;
				outer.style.width = width + "px";
			}
		}
	}

	window.addEventListener("resize", resizeOuter);
	window.addEventListener("orientationChange", resizeOuter);

	function renderOne(div, tune, renderParams, engraverParams) {
		var width = renderParams.width ? renderParams.width : 800;
		if (renderParams.viewportHorizontal) {
			// Create an inner div that holds the music, so that the passed in div will be the viewport.
			div.innerHTML = '<div class="abcjs-inner"></div>';
			if (renderParams.scrollHorizontal) {
				div.style.overflowX = "auto";
				div.style.overflowY = "hidden";
			} else
				div.style.overflow = "hidden";
			resizeDivs[div.id] = div; // We use a hash on the element's id so that multiple calls won't keep adding to the list.
			div = div.children[0]; // The music should be rendered in the inner div.
		}
		else if (renderParams.viewportVertical) {
			// Create an inner div that holds the music, so that the passed in div will be the viewport.
			div.innerHTML = '<div class="abcjs-inner scroll-amount"></div>';
			div.style.overflowX = "hidden";
			div.style.overflowY = "auto";
			div = div.children[0]; // The music should be rendered in the inner div.
		}
		/* jshint -W064 */ var paper = Raphael(div, width, 400); /* jshint +W064 */
		if (engraverParams === undefined)
			engraverParams = {};
		var engraver_controller = new ABCJS.write.EngraverController(paper, engraverParams);
		engraver_controller.engraveABC(tune);
		tune.engraver = engraver_controller;
		if (renderParams.viewportVertical || renderParams.viewportHorizontal) {
			// If we added a wrapper around the div, then we need to size the wrapper, too.
			var parent = div.parentNode;
			parent.style.width = div.style.width;
		}
	}

	function renderEachLineSeparately(div, tune, renderParams, engraverParams) {
		function initializeTuneLine(tune) {
			return {
				formatting: tune.formatting,
				media: tune.media,
				version: tune.version,
				metaText: {},
				lines: []
			};
		}

		// Before rendering, chop up the returned tune into an array where each element is a line.
		// The first element of the array gets the title and other items that go on top, the last element
		// of the array gets the extra text that goes on bottom. Each element gets any non-music info that comes before it.
		var tunes = [];
		var tuneLine;
		for (var i = 0; i < tune.lines.length; i++) {
			var line = tune.lines[i];
			if (!tuneLine)
				tuneLine = initializeTuneLine(tune);

			if (i === 0) {
				// These items go on top of the music
				tuneLine.metaText.tempo = tune.metaText.tempo;
				tuneLine.metaText.title = tune.metaText.title;
				tuneLine.metaText.header = tune.metaText.header;
				tuneLine.metaText.rhythm = tune.metaText.rhythm;
				tuneLine.metaText.origin = tune.metaText.origin;
				tuneLine.metaText.composer = tune.metaText.composer;
				tuneLine.metaText.author = tune.metaText.author;
				tuneLine.metaText.partOrder = tune.metaText.partOrder;
			}

			// push the lines until we get to a music line
			tuneLine.lines.push(line);
			if (line.staff) {
				tunes.push(tuneLine);
				tuneLine = undefined;
			}
		}
		// Add any extra stuff to the last line.
		if (tuneLine) {
			var lastLine = tunes[tunes.length-1];
			for (var j = 0; j < tuneLine.lines.length; j++)
				lastLine.lines.push(tuneLine.lines[j]);
		}

		// These items go below the music
		tuneLine = tunes[tunes.length-1];
		tuneLine.metaText.unalignedWords = tune.metaText.unalignedWords;
		tuneLine.metaText.book = tune.metaText.book;
		tuneLine.metaText.source = tune.metaText.source;
		tuneLine.metaText.discography = tune.metaText.discography;
		tuneLine.metaText.notes = tune.metaText.notes;
		tuneLine.metaText.transcription = tune.metaText.transcription;
		tuneLine.metaText.history = tune.metaText.history;
		tuneLine.metaText['abc-copyright'] = tune.metaText['abc-copyright'];
		tuneLine.metaText['abc-creator'] = tune.metaText['abc-creator'];
		tuneLine.metaText['abc-edited-by'] = tune.metaText['abc-edited-by'];
		tuneLine.metaText.footer = tune.metaText.footer;

		// Now create sub-divs and render each line
		var eParamsFirst = JSON.parse(JSON.stringify(engraverParams));
		var eParamsMid = JSON.parse(JSON.stringify(engraverParams));
		var eParamsLast = JSON.parse(JSON.stringify(engraverParams));
		eParamsFirst.paddingbottom = -20;
		eParamsMid.paddingbottom = -20;
		eParamsMid.paddingtop = 10;
		eParamsLast.paddingtop = 10;
		for (var k = 0; k < tunes.length; k++) {
			var lineEl = document.createElement("div");
			div.appendChild(lineEl);
			var ep = (k === 0) ? eParamsFirst : (k === tunes.length-1) ? eParamsLast : eParamsMid;
			renderOne(lineEl, tunes[k], renderParams, ep);
		}
	}

	// A quick way to render a tune from javascript when interactivity is not required.
	// This is used when a javascript routine has some abc text that it wants to render
	// in a div or collection of divs. One tune or many can be rendered.
	//
	// parameters:
	//		output: an array of divs that the individual tunes are rendered to.
	//			If the number of tunes exceeds the number of divs in the array, then
	//			only the first tunes are rendered. If the number of divs exceeds the number
	//			of tunes, then the unused divs are cleared. The divs can be passed as either
	//			elements or strings of ids. If ids are passed, then the div MUST exist already.
	//			(if a single element is passed, then it is an implied array of length one.)
	//			(if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
	//		abc: text representing a tune or an entire tune book in ABC notation.
	//		renderParams: hash of:
	//			startingTune: an index, starting at zero, representing which tune to start rendering at.
	//				(If this element is not present, then rendering starts at zero.)
	//			width: 800 by default. The width in pixels of the output paper
	ABCJS.renderAbc = function(output, abc, parserParams, engraverParams, renderParams) {
		if (renderParams === undefined)
			renderParams = {};
		function callback(div, tune) {
			if (!renderParams.oneSvgPerLine || tune.lines.length < 2)
				renderOne(div, tune, renderParams, engraverParams);
			else
				renderEachLineSeparately(div, tune, renderParams, engraverParams);
		}

		return renderEngine(callback, output, abc, parserParams, renderParams);
	};

	// A quick way to render a tune from javascript when interactivity is not required.
	// This is used when a javascript routine has some abc text that it wants to render
	// in a div or collection of divs. One tune or many can be rendered.
	//
	// parameters:
	//		output: an array of divs that the individual tunes are rendered to.
	//			If the number of tunes exceeds the number of divs in the array, then
	//			only the first tunes are rendered. If the number of divs exceeds the number
	//			of tunes, then the unused divs are cleared. The divs can be passed as either
	//			elements or strings of ids. If ids are passed, then the div MUST exist already.
	//			(if a single element is passed, then it is an implied array of length one.)
	//			(if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
	//		abc: text representing a tune or an entire tune book in ABC notation.
	//		renderParams: hash of:
	//			startingTune: an index, starting at zero, representing which tune to start rendering at.
	//				(If this element is not present, then rendering starts at zero.)
	ABCJS.renderMidi = function(output, abc, parserParams, midiParams, renderParams) {
		if (midiParams === undefined)
			midiParams = {};
		if (midiParams.generateInline === undefined) // default is to generate inline controls.
			midiParams.generateInline = true;
		if (midiParams.inlineControls)
			midiParams.inlineControls.selectionToggle = false; // Override the selection option because there is no selection in the Basic call.

		function callback(div, tune, index) {
			var html = "";
			var midi = window.ABCJS.midi.create(tune, midiParams);
			if (midiParams.generateInline) {
				var inlineMidi = midi.inline ? midi.inline : midi;
				html += window.ABCJS.midi.generateMidiControls(tune, midiParams, inlineMidi, index);
			}
			if (midiParams.generateDownload) {
				var downloadMidi = midi.download ? midi.download : midi;
				html += window.ABCJS.midi.generateMidiDownloadLink(tune, midiParams, downloadMidi, index);
			}
			div.innerHTML = html;
			var find = function(element, cls) {
				var els = element.getElementsByClassName(cls);
				if (els.length === 0)
					return null;
				return els[0];
			};
			if (midiParams.generateInline && (midiParams.animate || midiParams.listener)) {
				var parent = find(div, "abcjs-inline-midi");
				parent.abcjsTune = tune;
				parent.abcjsListener = midiParams.listener;
				parent.abcjsAnimate = midiParams.animate;
			}
			if (midiParams.generateInline && midiParams.inlineControls && midiParams.inlineControls.startPlaying) {
				var startButton = find(div, "abcjs-midi-start");
				window.ABCJS.midi.startPlaying(startButton);
			}

		}

		return renderEngine(callback, output, abc, parserParams, renderParams);
	};
})();
