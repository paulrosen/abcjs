import soundsCache from './sounds-cache';
import pitchToNoteName from './pitch-to-note-name';
import centsToFactor from './cents-to-factor';

function placeNote(
  outputAudioBuffer: any,
  sampleRate: any,
  sound: any,
  startArray: any,
  volumeMultiplier: any,
  ofsMs: any,
  fadeTimeSec: any,
  noteEndSec: any
) {
  // sound contains { instrument, pitch, volume, len, pan, tempoMultiplier
  // len is in whole notes. Multiply by tempoMultiplier to get seconds.
  // ofsMs is an offset to subtract from the note to line up programs that have different length onsets.
  var OfflineAC =
    // @ts-expect-error TS(2339): Property 'webkitOfflineAudioContext' does not exis... Remove this comment to see the full error message
    window.OfflineAudioContext || window.webkitOfflineAudioContext;

  var len = sound.len * sound.tempoMultiplier;
  if (ofsMs) len += ofsMs / 1000;
  len -= noteEndSec;
  if (len < 0) len = 0.005; // Have some small audible length no matter how short the note is.
  var offlineCtx = new OfflineAC(
    2,
    Math.floor((len + fadeTimeSec) * sampleRate),
    sampleRate
  );
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var noteName = pitchToNoteName[sound.pitch];
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var noteBufferPromise = soundsCache[sound.instrument][noteName];

  if (!noteBufferPromise) {
    // if the note isn't present then just skip it - it will leave a blank spot in the audio.
    return Promise.resolve();
  }

  return noteBufferPromise
    .then(function (response: any) {
      // create audio buffer
      var source = offlineCtx.createBufferSource();
      source.buffer = response.audioBuffer;

      // add gain
      // volume can be between 1 to 127. This translation to gain is just trial and error.
      // The smaller the first number, the more dynamic range between the quietest to loudest.
      // The larger the second number, the louder it will be in general.
      var volume = (sound.volume / 96) * volumeMultiplier;
      // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
      source.gainNode = offlineCtx.createGain();

      // add pan if supported and present
      if (sound.pan && offlineCtx.createStereoPanner) {
        // @ts-expect-error TS(2339): Property 'panNode' does not exist on type 'AudioBu... Remove this comment to see the full error message
        source.panNode = offlineCtx.createStereoPanner();
        // @ts-expect-error TS(2339): Property 'panNode' does not exist on type 'AudioBu... Remove this comment to see the full error message
        source.panNode.pan.setValueAtTime(sound.pan, 0);
      }
      // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
      source.gainNode.gain.value = volume; // Math.min(2, Math.max(0, volume));
      // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
      source.gainNode.gain.linearRampToValueAtTime(
        // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
        source.gainNode.gain.value,
        len
      );
      // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
      source.gainNode.gain.linearRampToValueAtTime(0.0, len + fadeTimeSec);

      if (sound.cents) {
        source.playbackRate.value = centsToFactor(sound.cents);
      }

      // connect all the nodes
      // @ts-expect-error TS(2339): Property 'panNode' does not exist on type 'AudioBu... Remove this comment to see the full error message
      if (source.panNode) {
        // @ts-expect-error TS(2339): Property 'panNode' does not exist on type 'AudioBu... Remove this comment to see the full error message
        source.panNode.connect(offlineCtx.destination);
        // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
        source.gainNode.connect(source.panNode);
      } else {
        // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
        source.gainNode.connect(offlineCtx.destination);
      }
      // @ts-expect-error TS(2339): Property 'gainNode' does not exist on type 'AudioB... Remove this comment to see the full error message
      source.connect(source.gainNode);

      // Do the process of creating the sound and placing it in the buffer
      source.start(0);

      // @ts-expect-error TS(2339): Property 'noteOff' does not exist on type 'AudioBu... Remove this comment to see the full error message
      if (source.noteOff) {
        // @ts-expect-error TS(2339): Property 'noteOff' does not exist on type 'AudioBu... Remove this comment to see the full error message
        source.noteOff(len + fadeTimeSec);
      } else {
        source.stop(len + fadeTimeSec);
      }
      var fnResolve: any;
      offlineCtx.oncomplete = function (e) {
        // @ts-expect-error TS(2774): This condition will always return true since this ... Remove this comment to see the full error message
        if (e.renderedBuffer && e.renderedBuffer.getChannelData) {
          // If the system gets overloaded or there are network problems then this can start failing. Just drop the note if so.
          for (var i = 0; i < startArray.length; i++) {
            //Math.floor(startArray[i] * sound.tempoMultiplier * sampleRate)
            var start = startArray[i] * sound.tempoMultiplier;
            if (ofsMs) start -= ofsMs / 1000;
            if (start < 0) start = 0; // If the item that is moved back is at the very beginning of the buffer then don't move it back. To do that would be to push everything else forward. TODO-PER: this should probably be done at some point but then it would change timing in existing apps.
            start = Math.floor(start * sampleRate);
            copyToChannel(outputAudioBuffer, e.renderedBuffer, start);
          }
        }
        fnResolve();
      };
      offlineCtx.startRendering();
      return new Promise(function (resolve) {
        fnResolve = resolve;
      });
    })
    .catch(function () {});
}

var copyToChannel = function (toBuffer: any, fromBuffer: any, start: any) {
  for (var ch = 0; ch < 2; ch++) {
    var fromData = fromBuffer.getChannelData(ch);
    var toData = toBuffer.getChannelData(ch);

    // Mix the current note into the existing track
    for (var n = 0; n < fromData.length; n++) {
      toData[n + start] += fromData[n];
    }
  }
};

export default placeNote;
