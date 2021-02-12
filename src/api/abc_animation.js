//    abc_animation.js: handles animating the music in real time.

var TimingCallbacks = require('./abc_timing_callbacks');

var animation = {};

(function() {
	"use strict";

	var timer;
	var cursor;
	animation.startAnimation = function(paper, tune, options) {
		//options.bpm
		//options.showCursor
		//options.hideCurrentMeasure
		//options.hideFinishedMeasures
		if (timer) {
			timer.stop();
			timer = undefined;
		}

		if (options.showCursor) {
			cursor = paper.querySelector('.abcjs-cursor');
			if (!cursor) {
				cursor = document.createElement('DIV');
				cursor.className = 'abcjs-cursor cursor';
				cursor.style.position = 'absolute';

				paper.appendChild(cursor);
				paper.style.position = 'relative';
			}
		}

		function hideMeasures(elements) {
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				if (!element.classList.contains('abcjs-bar'))
					element.style.display = "none";
			}
		}

		var lastMeasure;
		function disappearMeasuresAfter(selector) {
			if (lastMeasure) {
				var elements = paper.querySelectorAll(lastMeasure);
				hideMeasures(elements);
			}
			lastMeasure = selector;
		}

		function disappearMeasuresBefore(selector) {
			var elements = paper.querySelectorAll(selector);
			hideMeasures(elements);
		}

		function measureCallback(selector) {
			if (options.hideCurrentMeasure) {
				disappearMeasuresBefore(selector);
			} else if (options.hideFinishedMeasures) {
				disappearMeasuresAfter(selector);
			}
		}

		function getLineAndMeasure(element) {
			return '.abcjs-l' + element.line + '.abcjs-m' + element.measureNumber;
		}

		function setCursor(range) {
			if (range) {
				if (range.measureStart) {
					var selector = getLineAndMeasure(range);
					if (selector)
						measureCallback(selector);
				}
				if (cursor) {
					cursor.style.left = range.left + "px";
					cursor.style.top = range.top + "px";
					cursor.style.width = range.width + "px";
					cursor.style.height = range.height + "px";
				}
			} else {
				timer.stop();
				timer = undefined;
			}
		}

		timer = new TimingCallbacks(tune, {
			qpm: options.bpm,
			eventCallback: setCursor
		});
		timer.start();
	};

	animation.pauseAnimation = function(pause) {
		if (timer) {
			if (pause)
				timer.pause();
			else
				timer.start();
		}
	};

	animation.stopAnimation = function() {
		if (timer) {
			timer.stop();
			timer = undefined;
		}
	};

})();

module.exports = animation;
