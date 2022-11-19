// Load one mp3 file for one note.
// url = the base url for the soundfont
// instrument = the instrument name (e.g. "acoustic_grand_piano")
// name = the pitch name (e.g. "A3")
import soundsCache from './sounds-cache';

var getNote = function (url: any, instrument: any, name: any, audioContext: any) {
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (!soundsCache[instrument]) soundsCache[instrument] = {};
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  var instrumentCache = soundsCache[instrument];

  if (!instrumentCache[name])
    instrumentCache[name] = new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      let noteUrl = url + instrument + "-mp3/" + name + ".mp3";
      xhr.open("GET", noteUrl, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (xhr.status !== 200) {
          reject(Error("Can't load sound at " + noteUrl));
          return;
        }
        var noteDecoded = function (audioBuffer: any) {
          resolve({
            instrument: instrument,
            name: name,
            status: "loaded",
            audioBuffer: audioBuffer
          });
        };
        var maybePromise = audioContext.decodeAudioData(
          xhr.response,
          noteDecoded,
          function () {
            reject(Error("Can't decode sound at " + noteUrl));
          }
        );
        // In older browsers `BaseAudioContext.decodeAudio()` did not return a promise
        if (maybePromise && typeof maybePromise.catch === "function")
          maybePromise.catch(reject);
      };
      xhr.onerror = function () {
        reject(Error("Can't load sound at " + noteUrl));
      };
      xhr.send();
    }).catch((err) => {
      console.error("Didn't load note", instrument, name, ":", err.message);
      throw err;
    });

  return instrumentCache[name];
};

export default getNote;
