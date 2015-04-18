//    abc_animation.js: handles animating the music in real time.
//    Copyright (C) 2014 Paul Rosen (paul at paulrosen dot net)
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

/*global ABCJS, console */

if (!window.ABCJS)
	window.ABCJS = {};

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

	// This is a way to manipulate the written music on a timer. Their are two ways to manipulate the music: turn off each measure as it goes by,
	// and put a vertical cursor before the next note to play. The timer works at the speed of the original tempo of the music unless it is overwritten
	// in the options parameter.
	//
	// parameters:
	// paper: the output div that the music is in.
	// tune: the tune object returned by renderAbc.
	// options: a hash containing the following:
	//    hideFinishedMeasures: true or false [ false is the default ]
	//    showCursor: true or false [ false is the default ]
	//    bpm: number of beats per minute [ the default is whatever is in the Q: field ]
	var stopNextTime = false;
	var cursor;
	ABCJS.startAnimation = function(paper, tune, options) {
		if (paper.getElementsByClassName === undefined) {
			console.error("ABCJS.startAnimation: The first parameter must be a regular DOM element. (Did you pass a jQuery object or an ID?)");
			return;
		}
		if (tune.getBeatLength === undefined) {
			console.error("ABCJS.startAnimation: The second parameter must be a single tune. (Did you pass the entire array of tunes?)");
			return;
		}
		if (options.showCursor) {
			cursor = $('<div class="cursor" style="position: absolute;"></div>');
			$(paper).append(cursor);
			$(paper).css({ position: "relative" });
		}

		stopNextTime = false;
		var beatsPerMinute = getBeatsPerMinute(tune, options);
		var beatsPerMillisecond = beatsPerMinute / 60000;
		var beatLength = tune.getBeatLength(); // This is the same units as the duration is stored in.

		var startTime;

		function processMeasureHider(lineNum, measureNum) {
			var els = getAllElementsByClasses(paper, "l"+lineNum, "m"+measureNum);

			if (els.length > 0) {
				for (var i = 0; i < els.length; i++) {
					var el = els[i];
					if (!hasClass(el, "bar"))
						el.style.display = "none";
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

		var timingEvents = [];
		function setupEvents(engraver) {
			var eventHash = {};
			// The time is the number of measures from the beginning of the piece.
			var time = 0;
			var isTiedState = false;
			for (var line=0;line<engraver.staffgroups.length; line++) {
				var group = engraver.staffgroups[line];
				var voices = group.voices;
				var firstStaff = group.staffs[0];
				var middleC = firstStaff.absoluteY;
				var top = middleC - firstStaff.top*ABCJS.write.spacing.STEP;
				var lastStaff = group.staffs[group.staffs.length-1];
				middleC = lastStaff.absoluteY;
				var bottom = middleC - lastStaff.bottom*ABCJS.write.spacing.STEP;
				var height = bottom - top;
				var maxVoiceTime = 0;
				// Put in the notes for all voices, then sort them, then remove duplicates
				for (var v = 0; v < voices.length; v++) {
					var voiceTime = time;
					var elements = voices[v].children;
					for (var elem=0; elem<elements.length; elem++) {
						var element = elements[elem];
						if (element.duration > 0) {
							// There are 3 possibilities here: the note could stand on its own, the note could be tied to the next,
							// the note could be tied to the previous, and the note could be tied on both sides.
							var isTiedToNext = element.startTie;
							if (isTiedState) {
								if (!isTiedToNext)
									isTiedState = false;
								// If the note is tied on both sides it can just be ignored.
							} else {
								// the last note wasn't tied.
								if (!eventHash["event"+voiceTime])
									eventHash["event"+voiceTime] = { type: "event", time: voiceTime, top: top, height: height, left: element.x, width: element.w };
								else {
									// If there is more than one voice then two notes can fall at the same time. Usually they would be lined up in the same place, but if it is a whole rest, then it is placed funny. In any case, the left most element wins.
									eventHash["event"+voiceTime].left = Math.min(eventHash["event"+voiceTime].left, element.x);
								}
								if (isTiedToNext)
									isTiedState = true;
							}
							voiceTime += element.duration;
						}
						if (element.type === 'bar') {
							if (timingEvents.length === 0 || timingEvents[timingEvents.length-1] !== 'bar') {
								if (element.elemset && element.elemset.length > 0 && element.elemset[0].attrs) {
									var klass = element.elemset[0].attrs['class'];
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
									eventHash["bar"+voiceTime] = { type: "bar", time: voiceTime, lineNum: lineNum, measureNum: measureNum };
								}
							}
						}
					}
					maxVoiceTime = Math.max(maxVoiceTime, voiceTime);
				}
				time = maxVoiceTime;
			}
			// now we have all the events, but if there are multiple voices then there may be events out of order or duplicated, so normalize it.
			timingEvents = makeSortedArray(eventHash);
		}
		setupEvents(tune.engraver);

		function processShowCursor() {
			var currentNote = timingEvents.shift();
			if (!currentNote) {
				stopNextTime = true;
				return 0;
			}
			if (currentNote.type === "bar") {
				if (options.hideFinishedMeasures)
					processMeasureHider(currentNote.lineNum, currentNote.measureNum);
				if (timingEvents.length > 0)
					return timingEvents[0].time / beatLength;
				return 0;
			}
			if (options.showCursor)
				cursor.css({ left: currentNote.left + "px", top: currentNote.top + "px", width: currentNote.width + "px", height: currentNote.height + "px" });
			if (timingEvents.length > 0)
				return timingEvents[0].time / beatLength;
			stopNextTime = true;
			return 0;
		}

		function processNext() {
			if (stopNextTime) {
				ABCJS.stopAnimation();
				return;
			}
			var nextTimeInBeats = processShowCursor();
			var nextTimeInMilliseconds = nextTimeInBeats / beatsPerMillisecond;
			var currentTime = new Date();
			currentTime = currentTime.getTime();
			var interval = startTime + nextTimeInMilliseconds - currentTime;
			if (interval <= 0)
				processNext();
			else
				setTimeout(processNext, interval);
		}
		startTime = new Date();
		startTime = startTime.getTime();
		processNext();
	};

	ABCJS.stopAnimation = function() {
		stopNextTime = true;
		if (cursor) {
			cursor.remove();
			cursor = null;
		}
	};
})();
