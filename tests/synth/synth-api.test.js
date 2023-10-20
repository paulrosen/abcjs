
describe("CreateSynth() / midiBuffer Consumer API", () => {
  it("has expected functions", () => {
    const midiBuffer = new abcjs.synth.CreateSynth();

    // only declaring types from index.d.ts::MidiBuffer
    chai.assert.isFunction(midiBuffer.init, "init()");
    chai.assert.isFunction(midiBuffer.prime, "prime()");
    chai.assert.isFunction(midiBuffer.start, "start()");
    chai.assert.isFunction(midiBuffer.pause, "pause()");
    chai.assert.isFunction(midiBuffer.resume, "resume()");
    chai.assert.isFunction(midiBuffer.seek, "seek()");
    chai.assert.isFunction(midiBuffer.stop, "stop()");
    chai.assert.isFunction(midiBuffer.download, "download()");
    chai.assert.isFunction(midiBuffer.getIsRunning, "getIsRunning()");
  });
});