//    abc_midi_create.js: Turn a linear series of events into a midi file.

// @ts-expect-error TS(7034): Variable 'rendererFactory' implicitly has type 'an... Remove this comment to see the full error message
import rendererFactory from '../synth/abc_midi_renderer';

var create;

(function () {
  "use strict";

  var baseDuration = 480 * 4; // nice and divisible, equals 1 whole note

  create = function (abcTune: any, options: any) {
    if (options === undefined) options = {};
    var commands = abcTune.setUpAudio(options);
    // @ts-expect-error TS(7005): Variable 'rendererFactory' implicitly has an 'any'... Remove this comment to see the full error message
    var midi = rendererFactory();

    var title = abcTune.metaText ? abcTune.metaText.title : undefined;
    if (title && title.length > 128) title = title.substring(0, 124) + "...";
    var key = abcTune.getKeySignature();
    var time = abcTune.getMeterFraction();
    var beatsPerSecond = commands.tempo / 60;
    //var beatLength = abcTune.getBeatLength();
    midi.setGlobalInfo(commands.tempo, title, key, time);

    for (var i = 0; i < commands.tracks.length; i++) {
      midi.startTrack();
      var notePlacement = {};
      for (var j = 0; j < commands.tracks[i].length; j++) {
        var event = commands.tracks[i][j];
        switch (event.cmd) {
          case "text":
            midi.setText(event.type, event.text);
            break;
          case "program":
            var pan = 0;
            if (options.pan && options.pan.length > i) pan = options.pan[i];
            midi.setChannel(event.channel, pan);
            midi.setInstrument(event.instrument);
            break;
          case "note":
            var gapLengthInBeats = event.gap * beatsPerSecond;
            var start = event.start;
            // The staccato and legato are indicated by event.gap.
            // event.gap is in seconds but the durations are in whole notes.
            var end = start + event.duration - gapLengthInBeats;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!notePlacement[start]) notePlacement[start] = [];
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            notePlacement[start].push({
              pitch: event.pitch,
              volume: event.volume,
              cents: event.cents
            });
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!notePlacement[end]) notePlacement[end] = [];
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            notePlacement[end].push({ pitch: event.pitch, volume: 0 });
            break;
          default:
            console.log("MIDI create Unknown: " + event.cmd);
        }
      }
      addNotes(midi, notePlacement, baseDuration);
      midi.endTrack();
    }

    return midi.getData();
  };

  function addNotes(midi: any, notePlacement: any, baseDuration: any) {
    var times = Object.keys(notePlacement);
    // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'string'.
    for (var h = 0; h < times.length; h++) times[h] = parseFloat(times[h]);
    times.sort(function (a, b) {
      // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      return a - b;
    });
    var lastTime = 0;
    for (var i = 0; i < times.length; i++) {
      var events = notePlacement[times[i]];
      // @ts-expect-error TS(2365): Operator '>' cannot be applied to types 'string' a... Remove this comment to see the full error message
      if (times[i] > lastTime) {
        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
        var distance = (times[i] - lastTime) * baseDuration;
        midi.addRest(distance);
        // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
        lastTime = times[i];
      }
      for (var j = 0; j < events.length; j++) {
        var event = events[j];
        if (event.volume) {
          midi.startNote(event.pitch, event.volume, event.cents);
        } else {
          midi.endNote(event.pitch);
        }
      }
    }
  }
})();

export default create;
