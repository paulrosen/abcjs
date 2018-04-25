//    abc_animation.js: handles animating the music in real time.
//    Copyright (C) 2014-2018 Paul Rosen (paul at paulrosen dot net)
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

/*global console */

var spacing = require('../write/abc_spacing');
var parseCommon = require('../parse/abc_common');

var animation = {};

(function() {
	"use strict";

	function hasClass(element, cls) {
		var elClass = element.getAttribute("class");
		var rclass = /[\t\r\n\f]/g;
		var className = " " + cls + " ";
		return (element.nodeType === 1 && (" " + elClass + " ").replace(rclass, " ").indexOf(className) >= 0);
	}

	function getAllElementsByClasses(startingEl, class1, class2) {
		var els = startingEl.getElementsByClassName(class1);
		var ret = [];
		for (var i = 0; i < els.length; i++) {
			if (hasClass(els[i], class2))
				ret.push(els[i]);
		}
		return ret;
	}

	// This finds the place in the stylesheets that contain the rule that matches the selector.
	// If that selector is not found, then it creates the rule.
	// We are doing this so that we can use a transition for animating the scrolling.
	function getCssRule(selector) {
		var rule;
		for (var i = 0; i < document.styleSheets.length && rule === undefined; i++) {
			var css = document.styleSheets[i];
			var rules = css.rules;
			if (rules) {
				for (var j = 0; j < rules.length && rule === undefined; j++) {
					if (rules[j].selectorText && rules[j].selectorText === selector)
						rule = rules[j];
				}
			}
		}
		if (!rule) {
			document.styleSheets[0].insertRule(selector + " { }", 1);
			return getCssRule(selector);
		}
		return rule;
	}

	function getBeatsPerMinute(tune, options) {
		// We either want to run the timer once per measure or once per beat. If we run it once per beat we need a multiplier for the measures.
		// So, first we figure out the beats per minute and the beats per measure, then depending on the type of animation, we can
		// calculate the desired interval (ret.tick) and the number of ticks before we want to run the measure
		var bpm;
		if (options.bpm)
			bpm = options.bpm;
		else {
			if (tune && tune.metaText && tune.metaText.tempo && tune.metaText.tempo.bpm)
				bpm = tune.metaText.tempo.bpm;
			else
				bpm = 120; // Just set it to something. The user should have set this.
		}
		return bpm;
	}

	var scrollTimer;
	var animateTimer;
	var cssRule;
	var currentMargin;
	var animationTarget;
	var shouldResetOverflow;

	// This is a way to manipulate the written music on a timer. Their are two ways to manipulate the music: turn off each measure as it goes by,
	// and put a vertical cursor before the next note to play. The timer works at the speed of the original tempo of the music unless it is overwritten
	// in the options parameter.
	//
	// parameters:
	// paper: the output div that the music is in.
	// tune: the tune object returned by renderAbc.
	// options: a hash containing the following:
	//    hideFinishedMeasures: true or false [ false is the default ]
	//    hideCurrentMeasure: true or false [ false is the default ]
	//    showCursor: true or false [ false is the default ]
	//    bpm: number of beats per minute [ the default is whatever is in the Q: field ]
	//    scrollHorizontal: true or false [ false is the default ]
	//    scrollVertical: true or false [ false is the default ]
	//    scrollHint: true or false [ false is the default ]
	//
	// If scrollHorizontal is present, then we expect that the music was rendered with the viewportHorizontal parameter so there is a viewport wrapping the music div. (Note that this only works when there is a single line of music and there are no repeats, signo, or codas.)
	// If scrollVertical or scrollHint is present, then we expect that the music was rendered with the viewportVertical parameter so there is a viewport wrapping the music div.
	// If the music is larger than the viewport, then it scrolls as the music is being played.
	var stopNextTime = false;
	var cursor;

	var startTime;
	var isPaused;
	var pausedTime;
	var pausedDifference;
	var processNext;

	function setMargin(margin) {
		cssRule.style.marginTop = -margin + "px";
		currentMargin = margin;
	}
	animation.startAnimation = function(paper, tune, options) {
		if (paper.getElementsByClassName === undefined) {
			console.error("ABCJS.startAnimation: The first parameter must be a regular DOM element. (Did you pass a jQuery object or an ID?)");
			return;
		}
		if (tune.getBeatLength === undefined) {
			console.error("ABCJS.startAnimation: The second parameter must be a single tune. (Did you pass the entire array of tunes?)");
			return;
		}
		if (options.scrollHorizontal || options.scrollVertical || options.scrollHint) {
			// We assume that there is an extra div in this case, so adjust the paper if needed.
			// This can be called either with the outer div or the inner div.
			if (!hasClass(paper, 'abcjs-inner')) {
				// Must be the outer div; hide the scrollbar and move in.
				paper.scrollTop = 0; // In case the user has repositioned the scrollbar.
				paper.style.overflow = "hidden";
				paper = paper.children[0];
			}
			if (!hasClass(paper, 'abcjs-inner')) {
				console.error("ABCJS.startAnimation: When using scrollHorizontal/scrollVertical/scrollHint, the music must have been rendered using viewportHorizontal/viewportVertical.");
				return;
			}
		}
		// Can only have one animation at a time, so make sure that it has been stopped.
		animation.stopAnimation();
		animationTarget = paper;
		shouldResetOverflow = options.scrollVertical || options.scrollHint;

		if (options.showCursor) {
			cursor = document.createElement('DIV');
			cursor.className = 'abcjs-cursor cursor';
			cursor.style.position = 'absolute';

			paper.appendChild(cursor);
			paper.style.position = 'relative';
		}

		stopNextTime = false;
		var beatsPerMinute = getBeatsPerMinute(tune, options);
		var beatsPerMillisecond = beatsPerMinute / 60000;
		var beatLength = tune.getBeatLength(); // This is the same units as the duration is stored in.
		var totalBeats = 0;

		var millisecondsPerHalfMeasure;
		if (options.scrollVertical) {
			var millisecondsPerBeat = 1/beatsPerMillisecond;
			var beatsPerMeasure = 1/beatLength;
			var millisecondsPerMeasure = millisecondsPerBeat * beatsPerMeasure;
			millisecondsPerHalfMeasure = millisecondsPerMeasure / 2;
			cssRule = getCssRule(".abcjs-inner");
		}

		isPaused = false;
		var initialWait = 2700;
		var interval = 11;
		var distance = 1;
		var outer = paper.parentNode;
		function scrolling() {
			var currentPosition = paper.style.marginLeft;
			if (currentPosition === "")
				currentPosition = 0;
			else
				currentPosition = parseInt(currentPosition);
			currentPosition -= distance;
			paper.style.marginLeft = currentPosition + "px";
			if (currentPosition > outer.offsetWidth -  paper.scrollWidth)
				scrollTimer = setTimeout(scrolling, interval);
		}

		if (options.scrollHorizontal) {
			paper.style.marginLeft = "0px";
			scrollTimer = setTimeout(scrolling, initialWait);
		}

		function nextMeasure(lineNum, measureNum) {
			lineNum = parseInt(lineNum, 10);
			measureNum = parseInt(measureNum, 10);
			measureNum++;
			var els = getAllElementsByClasses(paper, "abcjs-l"+lineNum, "abcjs-m"+measureNum);
			if (els.length > 0)
				return [lineNum, measureNum];
			lineNum++;
			measureNum = 0;
			els = getAllElementsByClasses(paper, "abcjs-l"+lineNum, "abcjs-m"+measureNum);
			if (els.length > 0)
				return [lineNum, measureNum];
			return null;
		}

		function processMeasureHider(lineNum, measureNum) {
			var els = getAllElementsByClasses(paper, "abcjs-l"+lineNum, "abcjs-m"+measureNum);

			if (els.length > 0) {
				for (var i = 0; i < els.length; i++) {
					var el = els[i];
					if (!hasClass(el, "abcjs-bar"))
						el.style.display = "none";
				}
			}
		}

		function addVerticalInfo(timingEvents) {
			// Add vertical info to the bar events: put the next event's top, and the event after the next measure's top.
			var lastBarTop;
			var lastBarBottom;
			var lastEventTop;
			var lastEventBottom;
			for (var e = timingEvents.length-1; e >= 0; e--) {
				var ev = timingEvents[e];
				if (ev.type === 'bar') {
					ev.top = lastEventTop;
					ev.nextTop = lastBarTop;
					lastBarTop = lastEventTop;

					ev.bottom = lastEventBottom;
					ev.nextBottom = lastBarBottom;
					lastBarBottom = lastEventBottom;
				} else if (ev.type === 'event') {
					lastEventTop = ev.top;
					lastEventBottom = ev.top +ev.height;
				}
			}
		}

		function makeSortedArray(hash) {
			var arr = [];
			for (var k in hash) {
				if (hash.hasOwnProperty(k))
					arr.push(hash[k]);
			}
			arr = arr.sort(function(a,b) {
				var diff = a.time - b.time;
				// if the events have the same time, make sure a bar comes before a note
				if (diff !== 0) {
					return diff;
				}
				else {
					return a.type === "bar" ? -1 : 1;
				}
			});
			return arr;
		}

		// Gets the line and measure number from the element's classes
		function getLineAndMeasure(element) {
			var klass = element.elemset[0].getAttribute("class");
			var arr = klass.split(' ');
			var lineNum;
			var measureNum;
			for (var i = 0; i < arr.length; i++) {
				var match = /m(\d+)/.exec(arr[i]);
				if (match)
					measureNum = match[1];
				match = /l(\d+)/.exec(arr[i]);
				if (match)
					lineNum = match[1];
			}
			return { lineNum: lineNum, measureNum: measureNum };
		}

		// Switches the music from line-based to voice-based.
		function convertToVoices(staffGroups) {
			var voices = [];
			for (var line=0;line<staffGroups.length; line++) {
				var group = staffGroups[line];
				var firstStaff = group.staffs[0];
				var middleC = firstStaff.absoluteY;
				var top = middleC - firstStaff.top * spacing.STEP;
				var lastStaff = group.staffs[group.staffs.length - 1];
				middleC = lastStaff.absoluteY;
				var bottom = middleC - lastStaff.bottom * spacing.STEP;
				// Put in the notes for all voices, then sort them, then remove duplicates
				for (var v = 0; v < group.voices.length; v++) {
					if (v >= voices.length)
						voices.push([]);
					var elements = group.voices[v].children;
					for (var elem = 0; elem < elements.length; elem++) {
						var element = elements[elem];
						if (element.hint)
							break;
						if (element.duration > 0) {
							voices[v].push({ type: "event",
								top: top,
								height: bottom - top,
								left: element.x,
								width: element.w,
								duration: element.durationClass ? element.durationClass : element.duration,
								isTiedToNext: element.startTie !== undefined,
							});
						}
						// Only add a bar if it is not repeated; that is, we don't want two bars in a row.
						if (element.type === 'bar') {
							if (voices[v].length === 0 || voices[v][voices[v].length-1].type !== 'bar') {
								if (element.elemset && element.elemset.length > 0) {
									var obj = getLineAndMeasure(element);
									voices[v].push({ type: "bar",
										barType: element.abcelem.type,
										startEnding: element.abcelem.startEnding === "1",
										lineNum: obj.lineNum,
										measureNum: obj.measureNum
									});
								}
							}
						}
					}
				}
			}
			return voices;
		}

		// Duplicates the elements that are repeated.
		function spreadVoices(voices) {
			var ret = [];
			for (var i = 0; i < voices.length; i++) {
				var voice = voices[i];
				ret.push([]);
				var startRepeatIndex = 0; // If there is no explicit start repeat, then it starts at the beginning.
				var endRepeatIndex = -1;
				for (var j = 0; j < voice.length; j++) {
					var elem = voice[j];
					ret[i].push(voice[j]);
					var endRepeat = (elem.barType === "bar_right_repeat" || elem.barType === "bar_dbl_repeat");
					var startEnding = elem.startEnding;
					var startRepeat = (elem.barType === "bar_left_repeat" || elem.barType === "bar_dbl_repeat" || elem.barType === "bar_thick_thin" || elem.barType === "bar_thin_thick" || elem.barType === "bar_thin_thin" || elem.barType === "bar_right_repeat");
					if (endRepeat) {
						if (endRepeatIndex === -1)
							endRepeatIndex = j;
						for (var k = startRepeatIndex; k <= endRepeatIndex; k++) {
							ret[i].push(parseCommon.clone(voice[k]));
						}
					}
					if (startEnding)
						endRepeatIndex = j;
					if (startRepeat)
						startRepeatIndex = j+1;
				}
			}
			return ret;
		}

		function combineVoices(voiceList) {
			var eventHash = {};
			for (var v = 0; v < voiceList.length; v++) {
				var time = 0;
				var isTiedState = false;
				for (var i = 0; i < voiceList[v].length; i++) {
					var item = voiceList[v][i];
					item.time = time;
					if (item.type === "event") {
						var isTiedToNext = item.isTiedToNext;
						if (isTiedState) {
							if (!isTiedToNext)
								isTiedState = false;
							// If the note is tied on both sides it can just be ignored.
						} else {
							// the last note wasn't tied.
							if (!eventHash["event"+time])
								eventHash["event"+time] = item;
							else {
								// If there is more than one voice then two notes can fall at the same time. Usually they would be lined up in the same place, but if it is a whole rest, then it is placed funny. In any case, the left most element wins.
								eventHash["event"+time].left = Math.min(eventHash["event"+time].left, item.left);
							}
							if (isTiedToNext)
								isTiedState = true;
						}
						time += item.duration;
					} else {
						eventHash["bar"+time] = item;
					}
				}
			}
			return eventHash;
		}

		var timingEvents = [];
		function setupEvents(engraver) {
			// First, rearrange the elements to be in voice order (that is, remove the lines.)
			// Then, for each voice, duplicate the events needed for the repeats.
			// Then go through each event array and fill in the timingEvents.
			var voiceList = convertToVoices(engraver.staffgroups);
			voiceList = spreadVoices(voiceList);

			var eventHash = combineVoices(voiceList);

			// now we have all the events, but if there are multiple voices then there may be events out of order or duplicated, so normalize it.
			timingEvents = makeSortedArray(eventHash);
			totalBeats = timingEvents[timingEvents.length-1].time / beatLength;
			if (options.scrollVertical) {
				addVerticalInfo(timingEvents);
			}
		}
		setupEvents(tune.engraver);

		function isEndOfLine(currentNote) {
			return currentNote.top !== currentNote.nextTop && currentNote.nextTop !== undefined;
		}

		function shouldScroll(outer, scrollPos, currentNote) {
			var height = parseInt(outer.clientHeight, 10);
			var isVisible = currentNote.nextBottom - scrollPos < height;
			//console.log("SCROLL: ", height, scrollPos, currentNote.nextTop, currentNote.nextBottom, isVisible);
			return !isVisible;
		}

		var lastTop = -1;
		// var inner = outer.querySelectorAll('.abcjs-inner');
		currentMargin = 0;

		if (options.scrollVertical) {
			setMargin(0); // In case we are calling this a second time.
		}

		function processShowCursor() {
			var currentNote = timingEvents.shift();
			if (!currentNote) {
				stopNextTime = true;
				return 0;
			}
			if (currentNote.type === "bar") {
				if (options.scrollVertical) {
					if (isEndOfLine(currentNote) && shouldScroll(outer, currentMargin, currentNote)) {
						setTimeout(function() {
							setMargin(currentNote.nextTop);
						}, millisecondsPerHalfMeasure);
					}
				}
				if (options.hideCurrentMeasure) {
					var next = nextMeasure(currentNote.lineNum, currentNote.measureNum);
					if (next)
						processMeasureHider(next[0], next[1]);
				} else if (options.hideFinishedMeasures)
					processMeasureHider(currentNote.lineNum, currentNote.measureNum);
				if (timingEvents.length > 0)
					return timingEvents[0].time / beatLength;
				return 0;
			}
			if (options.scrollHint && lastTop !== currentNote.top) {
				lastTop = currentNote.top;
				setMargin(lastTop);
			}
			if (options.showCursor && cursor && cursor.style) {
				cursor.style.left = currentNote.left + "px";
				cursor.style.top = currentNote.top + "px";
				cursor.style.width = currentNote.width + "px";
				cursor.style.height = currentNote.height + "px";
			}
			if (timingEvents.length > 0)
				return timingEvents[0].time / beatLength;
			stopNextTime = true;
			return 0;
		}

		processNext = function() {
			if (stopNextTime) {
				animation.stopAnimation();
				return;
			}
			var currentTime = new Date().getTime();
			if (isPaused) {
				// The isPaused flag must have just turned on. If it had been encountered before, we wouldn't be calling processNext.
				// pausedTime contains the moment that pause was called. There is a delay until here, so the timing will be off by the distance.
				pausedDifference = currentTime - pausedTime;
				return;
			}
			var nextTimeInBeats = processShowCursor();
			var nextTimeInMilliseconds = nextTimeInBeats / beatsPerMillisecond;
			var interval = startTime + nextTimeInMilliseconds - currentTime;
			if (interval <= 0)
				processNext();
			else
				animateTimer = setTimeout(processNext, interval);
		}
		startTime = new Date();
		startTime = startTime.getTime();
		isPaused = false;
		if (options.hideCurrentMeasure) {
			var next = nextMeasure(0, -1);
			if (next)
				processMeasureHider(next[0], next[1]);
		}
		processNext();

	};

	animation.pauseAnimation = function(pause) {
		if (!processNext) {
			console.warn("Cannot call pauseAnimation before calling startAnimation");
			return;
		}

		if (pause && !isPaused) {
			isPaused = true;
			pausedTime = new Date().getTime();
		} else if (!pause && isPaused) {
			var nowTime = new Date().getTime();
			var elapsedTimeWhenPaused = nowTime - pausedTime;
			startTime += elapsedTimeWhenPaused;
			pausedTime = undefined;
			isPaused = false;
			animateTimer = setTimeout(processNext, pausedDifference);
			pausedDifference = undefined;
		}
	};

	animation.stopAnimation = function() {
		clearTimeout(animateTimer);
		clearTimeout(scrollTimer);
		if (cursor) {
			cursor.remove();
			cursor = null;
		}
		if (shouldResetOverflow) {
			if (animationTarget && animationTarget.parentNode) // If the music was redrawn or otherwise disappeared before the animation was finished, this might be null.
				animationTarget.parentNode.style.overflowY = "auto";
			setMargin(0);
		}
	};
})();

module.exports = animation;
