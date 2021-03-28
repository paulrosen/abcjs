var SynthSequence = function() {
	var self = this;
	self.tracks = [];
	self.totalDuration = 0;
	self.currentInstrument = [];
	self.starts = [];

	self.addTrack = function() {
		self.tracks.push([]);
		self.currentInstrument.push(0);
		self.starts.push(0);
		return self.tracks.length - 1;
	};

	self.setInstrument = function(trackNumber, instrumentNumber) {
		self.tracks[trackNumber].push({
			channel: 0,
			cmd: "program",
			instrument: instrumentNumber
		});
		self.currentInstrument[trackNumber] = instrumentNumber;
	};

	self.appendNote = function(trackNumber, pitch, durationInMeasures, volume, cents) {
		var note = {
			cmd: "note",
			duration: durationInMeasures,
			gap: 0,
			instrument: self.currentInstrument[trackNumber],
			pitch: pitch,
			start: self.starts[trackNumber],
			volume: volume
		};
		if (cents)
			note.cents = cents;
		self.tracks[trackNumber].push(note);
		self.starts[trackNumber] += durationInMeasures;

		self.totalDuration = Math.max(self.totalDuration, self.starts[trackNumber]);
	};
};

module.exports = SynthSequence;
