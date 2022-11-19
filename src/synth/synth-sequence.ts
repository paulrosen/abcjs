var SynthSequence = function(this: any) {
  var self = this;
  self.tracks = [];
  self.totalDuration = 0;
  self.currentInstrument = [];
  self.starts = [];

  self.addTrack = function () {
    self.tracks.push([]);
    self.currentInstrument.push(0);
    self.starts.push(0);
    return self.tracks.length - 1;
  };

  self.setInstrument = function (trackNumber: any, instrumentNumber: any) {
    self.tracks[trackNumber].push({
      channel: 0,
      cmd: "program",
      instrument: instrumentNumber
    });
    self.currentInstrument[trackNumber] = instrumentNumber;
  };

  self.appendNote = function (
    trackNumber: any,
    pitch: any,
    durationInMeasures: any,
    volume: any,
    cents: any
  ) {
    var note = {
      cmd: "note",
      duration: durationInMeasures,
      gap: 0,
      instrument: self.currentInstrument[trackNumber],
      pitch: pitch,
      start: self.starts[trackNumber],
      volume: volume
    };
    // @ts-expect-error TS(2339): Property 'cents' does not exist on type '{ cmd: st... Remove this comment to see the full error message
    if (cents) note.cents = cents;
    self.tracks[trackNumber].push(note);
    self.starts[trackNumber] += durationInMeasures;

    self.totalDuration = Math.max(self.totalDuration, self.starts[trackNumber]);
  };
};

export default SynthSequence;
