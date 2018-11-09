
var TimingCallbacks = function(target, params) {
	var self = this;
	if (!params) params = {};
	self.qpm = params.qpm;
	if (!self.qpm) {
		var tempo = target.metaText ? target.metaText.tempo : null;
		self.qpm = target.getBpm(tempo);
	}
	self.extraMeasuresAtBeginning = params.extraMeasuresAtBeginning ? params.extraMeasuresAtBeginning : 0;
	self.beatCallback = params.beatCallback; // This is called for each beat.
	self.eventCallback = params.eventCallback;   // This is called for each note or rest encountered.
	self.lineEndCallback = params.lineEndCallback;   // This is called when the end of a line is approaching.
	self.lineEndAnticipation = params.lineEndAnticipation ? params.lineEndAnticipation : 0;   // How many milliseconds before the end should the call happen.

	self.replaceTarget = function(newTarget) {
		newTarget.setTiming(self.qpm, self.extraMeasuresAtBeginning);
		if (newTarget.noteTimings.length === 0)
			return;
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
	self.millisecondsPerBeat = 1000 / (self.qpm / 60);
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
			if (currentTime < self.lastMoment)
				requestAnimationFrame(self.doTiming);

			if (self.currentBeat * self.millisecondsPerBeat < currentTime) {
				if (self.beatCallback)
					self.beatCallback(self.currentBeat);
				self.currentBeat++;
			}

			while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < currentTime) {
				if (self.eventCallback && self.noteTimings[self.currentEvent].type === 'event')
					self.eventCallback(self.noteTimings[self.currentEvent]);
				self.currentEvent++;
			}

			if (self.lineEndCallback && self.lineEndTimings.length && self.lineEndTimings[0].milliseconds <= currentTime) {
				self.lineEndCallback(self.lineEndTimings[0]);
				self.lineEndTimings.shift();
			}

			if (currentTime >= self.lastMoment && self.eventCallback)
				self.eventCallback(null);
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
		if (self.lineEndCallback) {
			self.lineEndTimings = getLineEndTimings(self.noteTimings, self.lineEndAnticipation);
		}
	};
	self.stop = function() {
		self.pause();
		self.reset();
	};
};

function getLineEndTimings(timings, anticipation) {
	// Returns an array of milliseconds to call the lineEndCallback.
	// This figures out the timing of the beginning of each line and subtracts the anticipation from it.
	var callbackTimes = [];
	var lastTop = null;
	for (var i = 0; i < timings.length; i++) {
		var timing = timings[i];
		if (timing.top !== lastTop) {
			callbackTimes.push({ milliseconds: timing.milliseconds - anticipation, top: timing.top, bottom: timing.top+timing.height });
			lastTop = timing.top;
		}
	}
	return callbackTimes;
}

module.exports = TimingCallbacks;

