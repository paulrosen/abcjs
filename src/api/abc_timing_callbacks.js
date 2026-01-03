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
	if (!self.beatSubdivisions) self.beatSubdivisions = 1
	self.joggerTimer = null;

	self.replaceTarget = function(newTarget) {
		self.noteTimings = newTarget.setTiming(self.qpm, self.extraMeasuresAtBeginning);
		if (newTarget.noteTimings.length === 0)
			self.noteTimings = newTarget.setTiming(0,0);
		if (self.lineEndCallback) {
			self.lineEndTimings = getLineEndTimings(newTarget.noteTimings, self.lineEndAnticipation);
		}
		self.startTime = null;
		self.currentBeat = 0;
		self.currentEvent = 0;
		self.currentLine = 0;
		self.currentTime = 0;
		self.isPaused = false;
		self.isRunning = false;
		self.pausedPercent = null;
		self.justUnpaused = false;
		self.newSeekPercent = 0;
		self.lastTimestamp = 0;

		if (self.noteTimings.length === 0)
			return;
		// noteTimings contains an array of events sorted by time. Events that happen at the same time are in the same element of the array.
		self.millisecondsPerBeat = 1000 / (self.qpm / 60) / self.beatSubdivisions;
		self.lastMoment = self.noteTimings[self.noteTimings.length-1].milliseconds;

		// For irregular time sigs that specify the beat divisions (that is, something like `M: 2+3/8`)
		// Then the beat is not a regular pulse. To keep most of this logic easy, the beat will be specified
		// as half as long, but the callback will happen according to the pattern. That is,
		// for bpm=60 at the above time signature, internally the beat callback will happen at 120 bpm, but
		// the callback function will be called at 2 sub beats, then 3 sub beats, etc.
		// The beat number will be an integer for all of them and count up by one each time.
		var meter = newTarget.getMeter()
		var irregularMeter = ''
		if (meter && meter.type === "specified" && meter.value && meter.value.length > 0 && meter.value[0].num.indexOf('+') > 0)
			irregularMeter = meter.value[0].num
		// for subdivisions = 1, then this should contain only whole numbers and the callbacks are irregular
		// for subdivisions = 2, then this should be 1/8 notes. The beats should be something like: 0, 0.5, 1, 1.33, 1.66 2 (For M:2+3/8)
		// etc for more subdivisions - they are just multiplied
		self.beatStarts = []
		if (irregularMeter) {
			var measureLength = self.noteTimings[self.noteTimings.length-1].millisecondsPerMeasure
			var numMeasures = self.lastMoment / measureLength
			var parts = irregularMeter.split("+")
			for (var i = 0; i < parts.length; i++)
				parts[i] = parseInt(parts[i],10) / 2 // since we count a beat as a quarter note, but these numbers refer to 1/8 notes, we convert the beat length
			var currentTs = 0
			var beatNumber = 0
			// For the input: parts = [ 1, 1.5 ] and beatSubdivisions = 2
			// beatNumbers = 0 0.5 1 1.33 1.67 2 2.5 3 3.33 3.67 ...
			// when part=1 then there is 1 extra sub beat and it is 0.5
			// when part=1.5 then there are 2 extra sub beats at 0.33 and 0.67
			//
			// beatSubdivision | numFor1 | numFor1.5
			//        2        |    2    |     3
			//        3        |    3    |     4.5
			//        4        |    4    |     6
			for (var measureNumber = 0; measureNumber < numMeasures; measureNumber++) {
				var measureStartTs = measureNumber * measureLength
				var subBeatCounter = 0
				for (var kk = 0; kk < parts.length; kk++) {
					var beatLength = parts[kk] // This is either 1 or 1.5 (how many quarter notes in this beat)
					if (self.beatSubdivisions === 1) {
						if (self.beatSubdivisions === 1)
							if (currentTs < self.lastMoment) {
								self.beatStarts.push({b: beatNumber, ts: currentTs})
							}
							currentTs += beatLength * self.millisecondsPerBeat
					} else {
						var numDivisions = beatLength * self.beatSubdivisions
						for (var k = 0; k < Math.floor(numDivisions); k++) {
							var subBeat = k / numDivisions
							var ts = Math.round(measureStartTs + subBeatCounter * self.millisecondsPerBeat)
							if (ts < self.lastMoment) {
								self.beatStarts.push({b: beatNumber + subBeat, ts: ts})
							}
							subBeatCounter++
						}
					}
					beatNumber++
				}
			}
			self.beatStarts.push({b: numMeasures * parts.length, ts: self.lastMoment})
			self.totalBeats = self.beatStarts.length
		} else {
			self.totalBeats = Math.round(self.lastMoment / self.millisecondsPerBeat);
			// Add one so the last beat is the last moment
			for (var j = 0; j < self.totalBeats+1; j++) {
				self.beatStarts.push({b: j/self.beatSubdivisions, ts: Math.round(j * self.millisecondsPerBeat)})
			}
		}
		//console.log({lastMoment: self.lastMoment, beatStarts: self.beatStarts})
	};

	self.replaceTarget(target);

	self.doTiming = function (timestamp) {
		// This is called 60 times a second, that is, every 16 msecs.
		//console.log("doTiming", timestamp, timestamp-self.lastTimestamp);
		if (self.lastTimestamp === timestamp)
			return; // If there are multiple seeks or other calls, then we can easily get multiple callbacks for the same instant.
		self.lastTimestamp = timestamp;

		if (!self.isPaused && self.isRunning) {
			if (!self.startTime) {
				self.startTime = timestamp;
			}
			self.currentTime = timestamp - self.startTime;
			self.currentTime += 16; // Add a little slop because this function isn't called exactly.
			while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < self.currentTime) {
				if (self.eventCallback && self.noteTimings[self.currentEvent].type === 'event') {
					var thisStartTime = self.startTime; // the event callback can call seek and change the position from beneath us.
					self.eventCallback(self.noteTimings[self.currentEvent]);
					if (thisStartTime !== self.startTime) {
						self.currentTime = timestamp - self.startTime;
					}
				}
				self.currentEvent++;
			}
			if (self.lineEndCallback && self.lineEndTimings.length > self.currentLine && self.lineEndTimings[self.currentLine].milliseconds < self.currentTime && self.currentEvent < self.noteTimings.length) {
				var leftEvent = self.noteTimings[self.currentEvent].milliseconds === self.currentTime ? self.noteTimings[self.currentEvent] : self.noteTimings[self.currentEvent-1]
				self.lineEndCallback(self.lineEndTimings[self.currentLine], leftEvent, { line: self.currentLine, endTimings: self.lineEndTimings, currentTime: self.currentTime });
				self.currentLine++;
			}
			if (self.currentTime < self.lastMoment) {
				requestAnimationFrame(self.doTiming);
				if (self.currentBeat < self.beatStarts.length && self.beatStarts[self.currentBeat].ts <= self.currentTime) {
					var ret = self.doBeatCallback(timestamp);
					self.currentBeat++
					if (ret !== null)
						self.currentTime = ret;
				}
			} else if (self.currentBeat <= self.totalBeats) {
				// Because of timing issues (for instance, if the browser tab isn't active), the beat callbacks might not have happened when they are supposed to. To keep the client programs from having to deal with that, this will keep calling the loop until all of them have been sent.
				if (self.beatCallback) {
					var ret2 = self.doBeatCallback(timestamp);
					self.currentBeat++
					if (ret2 !== null)
						self.currentTime = ret2;
					requestAnimationFrame(self.doTiming);
				}
			}

			if (self.currentTime >= self.lastMoment) {
				if (self.eventCallback) {
					// At the end, the event callback can return "continue" to keep from stopping.
					// The event callback can either be a promise or not.
					var promise = self.eventCallback(null);
					self.shouldStop(promise).then(function(shouldStop) {
						if (shouldStop)
							self.stop();
					})
				} else
					self.stop();
			}
		}
	};

	self.shouldStop = function(promise) {
		// The return of the last event callback can be "continue" or a promise that returns "continue".
		// If it is then don't call stop. Any other value calls stop.
		return new Promise(function (resolve) {
			if (!promise)
				return resolve(true);
			if (promise === "continue")
				return resolve(false);
			if (promise.then) {
				promise.then(function (result) {
					resolve(result !== "continue");
				});
			}
		});
	};

	self.doBeatCallback = function(timestamp) {
		if (self.beatCallback) {
			var next = self.currentEvent;
			while (next < self.noteTimings.length && self.noteTimings[next].left === null)
				next++;
			var endMs;
			var ev;
			if (next < self.noteTimings.length) {
				endMs = self.noteTimings[next].milliseconds;
				next = Math.max(0, self.currentEvent - 1);
				while (next >= 0 && self.noteTimings[next].left === null)
					next--;

				ev = self.noteTimings[next];
			}

			var position = {};
			var debugInfo = {};
			if (ev) {
				position.top = ev.top;
				position.height = ev.height;

				// timestamp = the time passed in from the animation timer
				// self.startTime = the time that the tune was started (if there was seeking or pausing, it is adjusted to keep the math the same)
				// ev = the event that is either happening now or has most recently passed.
				// ev.milliseconds = the time that the current event starts (relative to self.startTime)
				// endMs = the time that the next event starts
				// ev.endX = the x coordinate that the next event happens (or the end of the line or repeat measure)
				// ev.left = the x coordinate of the current event
				//
				// The output is the X coordinate of the current cursor location. It is calculated with the ratio of the length of the event and the width of it.
				var offMs = Math.max(0, timestamp-self.startTime-ev.milliseconds); // Offset in time from the last beat
				var gapMs = endMs - ev.milliseconds; // Length of this event in time
				var gapPx = ev.endX - ev.left; // The length in pixels
				var offPx = gapMs ? offMs * gapPx / gapMs : 0;
				position.left = ev.left + offPx;
				// See if this is before the first event - that is the case where there are "prep beats"
				if (self.currentEvent === 0 && ev.milliseconds > timestamp-self.startTime)
					position.left = undefined
				
				debugInfo = {
					timestamp: timestamp,
					startTime: self.startTime,
					ev: ev,
					endMs: endMs,
					offMs: offMs,
					offPx: offPx,
					gapMs: gapMs,
					gapPx: gapPx
				};
			} else {
				debugInfo = {
					timestamp: timestamp,
					startTime: self.startTime,
				};
			}

			var thisStartTime = self.startTime; // the beat callback can call seek and change the position from beneath us.
			self.beatCallback(
				self.beatStarts[self.currentBeat].b,
				self.totalBeats / self.beatSubdivisions,
				self.lastMoment,
				position,
				debugInfo);
			if (thisStartTime !== self.startTime) {
				return timestamp - self.startTime;
			} // else
			// 	self.currentBeat++;
		}
		return null;
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

	self.start = function(offsetPercent, units) {
		self.isRunning = true;
		if (self.isPaused) {
			self.isPaused = false;
			if (offsetPercent === undefined)
				self.justUnpaused = true;
		}
		if (offsetPercent) {
			self.setProgress(offsetPercent, units);
		} else if (offsetPercent === 0) {
			self.reset();
		} else if (self.pausedPercent !== null) {
			var now = performance.now();
			self.currentTime = self.lastMoment * self.pausedPercent;
			self.startTime = now - self.currentTime;
			self.pausedPercent = null;
			self.reportNext = true;
		}
		requestAnimationFrame(self.doTiming);
		self.joggerTimer = setTimeout(self.animationJogger, JOGGING_INTERVAL);
	};
	self.pause = function() {
		self.isPaused = true;
		var now = performance.now();
		self.pausedPercent = (now - self.startTime) / self.lastMoment;
		self.isRunning = false;
		if (self.joggerTimer) {
			clearTimeout(self.joggerTimer);
			self.joggerTimer = null;
		}
	};
	self.currentMillisecond = function() {
		return self.currentTime;
	};
	self.reset = function() {
		self.currentBeat = 0;
		self.currentEvent = 0;
		self.currentLine = 0;
		self.startTime = null;
		self.pausedPercent = null;
	};
	self.stop = function() {
		self.pause();
		self.reset();
	};
	self.setProgress = function(position, units) {
		// the effect of this function is to move startTime so that the callbacks happen correctly for the new seek.
		var percent;
		switch (units) {
			case "seconds":
				self.currentTime = position * 1000;
				if (self.currentTime < 0) self.currentTime = 0;
				if (self.currentTime > self.lastMoment) self.currentTime = self.lastMoment;
				percent = self.currentTime / self.lastMoment;
				break;
			case "beats":
				self.currentTime = position * self.millisecondsPerBeat * self.beatSubdivisions;
				if (self.currentTime < 0) self.currentTime = 0;
				if (self.currentTime > self.lastMoment) self.currentTime = self.lastMoment;
				percent = self.currentTime / self.lastMoment;
				break;
			default:
				// this is "percent" or any illegal value
				// this is passed a value between 0 and 1.
				percent = position;
				if (percent < 0) percent = 0;
				if (percent > 1) percent = 1;
				self.currentTime = self.lastMoment * percent;
				break;
		}

		if (!self.isRunning)
			self.pausedPercent = percent;

		var now = performance.now();
		self.startTime = now - self.currentTime;

		self.currentEvent = 0;
		while (self.noteTimings.length > self.currentEvent && self.noteTimings[self.currentEvent].milliseconds < self.currentTime) {
			self.currentEvent++;
		}

		if (self.lineEndCallback) {
			self.currentLine = 0;
			while (self.lineEndTimings.length > self.currentLine && self.lineEndTimings[self.currentLine].milliseconds + self.lineEndAnticipation < self.currentTime) {
				self.currentLine++;
			}
		}

		//console.log({jump:self.currentTime})
		var oldBeat = self.currentBeat;
		for (self.currentBeat = 0; self.currentBeat < self.beatStarts.length; self.currentBeat++) {
			if (self.beatStarts[self.currentBeat].ts > self.currentTime)
				break
		}
		self.currentBeat--
		if (self.beatCallback && oldBeat !== self.currentBeat) {
			// If the movement caused the beat to change, then immediately report it to the client.
			self.doBeatCallback(self.startTime + self.currentTime);
			self.currentBeat++
		}

		if (self.eventCallback && self.currentEvent >= 0 && self.noteTimings[self.currentEvent].type === 'event')
			self.eventCallback(self.noteTimings[self.currentEvent]);
		if (self.lineEndCallback)
			self.lineEndCallback(self.lineEndTimings[self.currentLine], self.noteTimings[self.currentEvent], { line: self.currentLine, endTimings: self.lineEndTimings });

		self.joggerTimer = setTimeout(self.animationJogger, JOGGING_INTERVAL);
	};
};

function getLineEndTimings(timings, anticipation) {
	// Returns an array of milliseconds to call the lineEndCallback.
	// This figures out the timing of the beginning of each line and subtracts the anticipation from it.
	var callbackTimes = [];
	var lastTop = null;
	for (var i = 0; i < timings.length; i++) {
		var timing = timings[i];
		if (timing.type !== 'end' && timing.top !== lastTop) {
			callbackTimes.push({ measureNumber: timing.measureNumber, milliseconds: timing.milliseconds-anticipation, top: timing.top, bottom: timing.top+timing.height });
			lastTop = timing.top;
		}
	}
	return callbackTimes;
}

module.exports = TimingCallbacks;
