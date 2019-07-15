var SynthSequence = function() {
	var self = this;
	self.tracks = [];
	self.totalDuration = 0;

	self.addTrack = function() {
		self.tracks.push([]);
		return self.tracks.length - 1;
	};

	self.setInstrument = function(trackNumber, instrumentNumber) {
		self.tracks[trackNumber].push({
			channel: 0,
			cmd: "program",
			instrument: instrumentNumber
		});
	};

	self.appendNote = function(trackNumber, pitch, durationInMeasures, volume) {
		self.tracks[trackNumber].push({
			cmd: "start",
			pitch: pitch - 60,
			volume: volume
		});
		self.tracks[trackNumber].push({
			cmd: "move",
			duration: durationInMeasures
		});
		self.tracks[trackNumber].push({
			cmd: "stop",
			pitch: pitch - 60
		});
		var duration = 0;
		self.tracks[trackNumber].forEach(function(event) {
			if (event.duration)
				duration += event.duration;
		});
		self.totalDuration = Math.max(self.totalDuration, duration);
	};
};

module.exports = SynthSequence;
