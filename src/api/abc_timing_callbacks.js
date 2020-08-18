//    Copyright (C) 2015-2020 Paul Rosen (paul at paulrosen dot net)
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

var TimingCallbacks = function(target, params) {
	var self = this;
	if (!params) params = {};
	self.qpm = params.qpm ? parseInt(params.qpm, 10) : null;
	if (!self.qpm) {
		var tempo = target.metaText ? target.metaText.tempo : null;
		self.qpm = target.getBpm(tempo);
	}
	self.extraMeasuresAtBeginning = params.extraMeasuresAtBeginning ? parseInt(params.extraMeasuresAtBeginning, 10) : 0;
	self.beatCallback = params.beatCallback; // This is called for each beat.
	self.eventCallback = params.eventCallback;   // This is called for each note or rest encountered.
	self.lineEndCallback = params.lineEndCallback;   // This is called when the end of a line is approaching.
	self.lineEndAnticipation = params.lineEndAnticipation ? parseInt(params.lineEndAnticipation, 10) : 0;   // How many milliseconds before the end should the call happen.
	self.beatSubdivisions = params.beatSubdivisions ? parseInt(params.beatSubdivisions, 10) : 1; // how many callbacks per beat is desired.
	self.joggerTimer = null;

	self.replaceTarget = function(newTarget) {
		newTarget.setTiming(self.qpm, self.extraMeasuresAtBeginning);
		if (newTarget.noteTimings.length === 0)
			newTarget.setTiming(0,0);
		if (self.lineEndCallback) {
			self.lineEndTimings = getLineEndTimings(newTarget.noteTimings, self.lineEndAnticipation);
		}
		self.noteTimings = newTarget.noteTimings;
	};

	self.replaceTarget(target);
	if (self.noteTimings.length === 0)
		return;

	// noteTimings contains an array of events sorted by time. Events that happen at the same time are in the same element of the array.
	self.noteTimings = target.noteTimings;
	self.millisecondsPerBeat = 1000 / (self.qpm / 60) / self.beatSubdivisions;
	self.lastMoment = self.noteTimings[self.noteTimings.length-1].milliseconds;
	self.totalBeats = Math.round(self.lastMoment / self.millisecondsPerBeat);

	self.startTime = null;
	self.currentBeat = 0;
	self.currentEvent = 0;
	self.isPaused = false;
	self.isRunning = false;
	self.pausedTime = null;
	self.justUnpaused = false;

	self.newSeekPercent = 0;
	self.justSeeked = false;

	function setCurrentLocation(timestamp) {
		// First find the relative amount to move: that is, the difference between the current percentage and the passed in percent.
		var currentPercent = (timestamp - self.startTime) / self.lastMoment;
		var percentDifference = currentPercent - self.newSeekPercent;
		var timeDifference = self.lastMoment * percentDifference;
		self.startTime = self.startTime + timeDifference;

		var currentTime = timestamp - self.startTime;
		currentTime += 16; // Add a little slop because this function isn't called exactly.

		var oldBeat = self.currentBeat;
		self.currentBeat = Math.floor(currentTime / self.millisecondsPerBeat);
		if (self.beatCallback && oldBeat !== self.currentBeat) // If the movement caused the beat to change, then immediately report it to the client.
			self.beatCallback(self.currentBeat / self.beatSubdivisions, self.totalBeats / self.beatSubdivisions, self.lastMoment);

		var lineStart = 0;
		self.currentEvent = 0;
		while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < currentTime) {
			self.currentEvent++;
			if (self.lineEndCallback && self.lineEndTimings['e'+self.currentEvent])
				lineStart = self.currentEvent;
		}
		if (self.eventCallback && self.currentEvent > 0 && self.noteTimings[self.currentEvent - 1].type === 'event')
			self.eventCallback(self.noteTimings[self.currentEvent - 1]);
		if (self.lineEndCallback)
			self.lineEndCallback(self.lineEndTimings['e'+lineStart])

		// console.log("currentPercent="+currentPercent+
		// 	" newSeekPercent="+self.newSeekPercent+
		// 	" percentDifference="+percentDifference+
		// 	" timeDifference=",timeDifference+
		// 	" currentBeat="+self.currentBeat+
		// 	" currentEvent="+self.currentEvent);
	}

	self.lastTimestamp = 0;
	self.doTiming = function (timestamp) {
		// This is called 60 times a second, that is, every 16 msecs.
		//console.log("doTiming", timestamp, timestamp-self.lastTimestamp);
		if (self.lastTimestamp === timestamp)
			return; // If there are multiple seeks or other calls, then we can easily get multiple callbacks for the same instance.
		self.lastTimestamp = timestamp;
		if (!self.startTime) {
			self.startTime = timestamp;
		} else if (self.justUnpaused) {
			// Add the amount we paused to the start time to get the right place.
			var timePaused = (timestamp - self.pausedTime);
			self.startTime += timePaused;
		}
		self.justUnpaused = false;

		if (self.justSeeked) {
			setCurrentLocation(timestamp);
			self.justSeeked = false;
		}
		if (self.isPaused) {
			self.pausedTime = timestamp;
		} else if (self.isRunning) {
			var currentTime = timestamp - self.startTime;
			currentTime += 16; // Add a little slop because this function isn't called exactly.
			while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < currentTime) {
				if (self.eventCallback && self.noteTimings[self.currentEvent].type === 'event')
					self.eventCallback(self.noteTimings[self.currentEvent]);
				self.currentEvent++;
				if (self.lineEndCallback && self.lineEndTimings['e'+self.currentEvent])
					self.lineEndCallback(self.lineEndTimings['e'+self.currentEvent]);
			}
			if (currentTime < self.lastMoment) {
				requestAnimationFrame(self.doTiming);
				if (self.currentBeat * self.millisecondsPerBeat < currentTime) {
					if (self.beatCallback)
						self.beatCallback(self.currentBeat / self.beatSubdivisions, self.totalBeats / self.beatSubdivisions, self.lastMoment);
					self.currentBeat++;
				}
			} else if (self.currentBeat <= self.totalBeats) {
				// Because of timing issues (for instance, if the browser tab isn't active), the beat callbacks might not have happened when they are supposed to. To keep the client programs from having to deal with that, this will keep calling the loop until all of them have been sent.
				if (self.beatCallback) {
					self.beatCallback(self.currentBeat / self.beatSubdivisions, self.totalBeats / self.beatSubdivisions, self.lastMoment);
					self.currentBeat++;
					requestAnimationFrame(self.doTiming);
				}
			}

			if (currentTime >= self.lastMoment && self.eventCallback)
				self.eventCallback(null);
		}
	};

	// In general music doesn't need a timer at 60 fps because notes don't happen that fast.
	// For instance, at 120 beats per minute, a sixteenth note takes 125ms. So just as a
	// compromise value between performance and jank this is set about half that.
	var JOGGING_INTERVAL = 60;

	self.animationJogger = function() {
		// There are some cases where the animation timer doesn't work: for instance when
		// this isn't running in a visible tab and sometimes on mobile devices. We compensate
		// by having a backup timer using setTimeout. This won't be accurate so the performance
		// will be jerky, but without it the requestAnimationFrame might be skipped and so
		// not called again.
		if (self.isRunning) {
			self.doTiming(performance.now());
			self.joggerTimer = setTimeout(self.animationJogger, JOGGING_INTERVAL);
		}
	};

	self.start = function(offsetPercent) {
		self.isRunning = true;
		if (self.isPaused) {
			self.isPaused = false;
			self.justUnpaused = true;
		}
		if (offsetPercent) {
			self.setProgress(offsetPercent);
		} else {
			requestAnimationFrame(self.doTiming);
			self.joggerTimer = setTimeout(self.animationJogger, JOGGING_INTERVAL);
		}
	};
	self.pause = function() {
		self.isPaused = true;
		self.isRunning = false;
		if (self.joggerTimer) {
			clearTimeout(self.joggerTimer);
			self.joggerTimer = null;
		}
	};
	self.reset = function() {
		self.currentBeat = 0;
		self.currentEvent = 0;
		self.startTime = null;
		self.pausedTime = null;
	};
	self.stop = function() {
		self.pause();
		self.reset();
	};
	self.setProgress = function(percent) {
		// this is passed a value between 0 and 1.
		// the effect of this function is to move startTime so that the callbacks happen correctly for the new seek.
		if (percent < 0) percent = 0;
		if (percent > 1) percent = 1;

		self.newSeekPercent = percent;
		self.justSeeked = true;
		self.doTiming(performance.now());
		self.joggerTimer = setTimeout(self.animationJogger, JOGGING_INTERVAL);
	};
};

function getLineEndTimings(timings, anticipation) {
	// Returns an array of milliseconds to call the lineEndCallback.
	// This figures out the timing of the beginning of each line and subtracts the anticipation from it.
	var callbackTimes = {};
	var lastTop = null;
	for (var i = 0; i < timings.length; i++) {
		var timing = timings[i];
		if (timing.top !== lastTop) {
			callbackTimes['e'+i] = { measureNumber: Math.floor(timing.milliseconds/timing.millisecondsPerMeasure), milliseconds: timing.milliseconds - anticipation, top: timing.top, bottom: timing.top+timing.height };
			lastTop = timing.top;
		}
	}
	return callbackTimes;
}

export default TimingCallbacks;

