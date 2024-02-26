// Load one mp3 file for one note.
// url = the base url for the soundfont
// instrument = the instrument name (e.g. "acoustic_grand_piano")
// name = the pitch name (e.g. "A3")
var soundsCache = require("./sounds-cache");

var getNote = function (url, instrument, name, audioContext) {
  if (!soundsCache[instrument]) soundsCache[instrument] = {};
  var instrumentCache = soundsCache[instrument];

  if (!instrumentCache[name])
    instrumentCache[name] = new Promise(function (resolve, reject) {
      let noteUrl = url + instrument + "-mp3/" + name + ".mp3";

      // Use the fetch API instead of XMLHttpRequest
      fetch(noteUrl)
      .then(response => {
          if (!response.ok){
            throw new Error(`HTTP error, status = ${response.status}`);
          }
          response.arrayBuffer().then(theBuffer => {
            var noteDecoded = function noteDecoded(audioBuffer) {
              resolve({
                instrument: instrument,
                name: name,
                status: "loaded",
                audioBuffer: audioBuffer
              });
            };
            var maybePromise = audioContext.decodeAudioData(theBuffer, noteDecoded, function () {
               reject(Error("Can't decode sound at " + noteUrl));
            });
          });
      })
      .catch(error => {
          reject(Error("Can't load sound at " + noteUrl + ' status=' + error));
          throw error;
      });

    });

    return instrumentCache[name];
};

module.exports = getNote;
