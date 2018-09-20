
var TimingCallbacks = function(target, params) {
	var self = this;
	if (!params) params = {};
	var qpm = params.qpm;
	var extraMeasuresAtBeginning = params.extraMeasuresAtBeginning ? params.extraMeasuresAtBeginning : 0;
	self.beatCallback = params.beatCallback; // This is called for each beat.
	self.eventCallback = params.eventCallback;   // This is called for each note or rest encountered.

	target.setTiming(qpm, extraMeasuresAtBeginning);
	if (target.noteTimings.length === 0)
		return;

	// noteTimings contains an array of events sorted by time. Events that happen at the same time are in the same element of the array.
	self.noteTimings = target.noteTimings;
	self.millisecondsPerBeat = 1000 / (qpm / 60);
	self.lastMoment = self.noteTimings[self.noteTimings.length-1].milliseconds;

	self.startTime = null;
	self.currentBeat = 0;
	self.currentEvent = 0;
	self.isPaused = false;
	self.pausedTime = null;
	self.justUnpaused = false;

	self.doTiming = function(timestamp) {
		if (!self.startTime) {
			self.startTime = timestamp;
		} else if (self.justUnpaused) {
			// Add the amount we paused to the start time to get the right place.
			var timePaused = (timestamp - self.pausedTime);
			self.startTime += timePaused;
		}
		self.justUnpaused = false;

		if (self.isPaused) {
			self.pausedTime = timestamp;
		} else {
			var currentTime = timestamp - self.startTime;
			currentTime += 50; // Add a little slop because this function isn't called exactly.

			if (self.currentBeat * self.millisecondsPerBeat < currentTime) {
				if (self.beatCallback)
					self.beatCallback(self.currentBeat);
				self.currentBeat++;
			}

			while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < currentTime) {
				if (self.eventCallback)
					self.eventCallback(target.noteTimings[self.currentEvent]);
				self.currentEvent++;
			}

			if (currentTime < self.lastMoment)
				requestAnimationFrame(self.doTiming);
		}
	};

	self.start = function() {
		if (self.isPaused) {
			self.isPaused = false;
			self.justUnpaused = true;
		}
		requestAnimationFrame(self.doTiming);
	};
	self.pause = function() {
		self.isPaused = true;
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

};

module.exports = TimingCallbacks;

