import tunebook from '../api/abc_tunebook';
// @ts-expect-error TS(7034): Variable 'midiCreate' implicitly has type 'any' in... Remove this comment to see the full error message
import midiCreate from '../midi/abc_midi_create';

var getMidiFile = function (source: any, options: any) {
  var params = {};
  if (options) {
    for (var key in options) {
      if (options.prototype.hasOwnProperty.call(key)) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        params[key] = options[key];
      }
    }
  }
  // @ts-expect-error TS(2339): Property 'generateInline' does not exist on type '... Remove this comment to see the full error message
  params.generateInline = false;

  function callback(div: any, tune: any, index: any) {
    // @ts-expect-error TS(7005): Variable 'midiCreate' implicitly has an 'any' type... Remove this comment to see the full error message
    var downloadMidi = midiCreate(tune, params);
    // @ts-expect-error TS(2339): Property 'midiOutputType' does not exist on type '... Remove this comment to see the full error message
    switch (params.midiOutputType) {
      case "encoded":
        return downloadMidi;
      case "binary":
        var decoded = downloadMidi.replace("data:audio/midi,", "");
        decoded = decoded.replace(/MThd/g, "%4d%54%68%64");
        decoded = decoded.replace(/MTrk/g, "%4d%54%72%6b");
        var buffer = new ArrayBuffer(decoded.length / 3);
        var output = new Uint8Array(buffer);
        for (var i = 0; i < decoded.length / 3; i++) {
          var p = i * 3 + 1;
          var d = parseInt(decoded.substring(p, p + 2), 16);
          output[i] = d;
        }
        return output;
      case "link":
      default:
        return generateMidiDownloadLink(tune, params, downloadMidi, index);
    }
  }

  if (typeof source === "string")
    // @ts-expect-error TS(2339): Property 'renderEngine' does not exist on type '{}... Remove this comment to see the full error message
    return tunebook.renderEngine(callback, "*", source, params);
  else return callback(null, source, 0);
};

function isFunction(functionToCheck: any) {
  var getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === "[object Function]"
  );
}

var generateMidiDownloadLink = function (tune: any, midiParams: any, midi: any, index: any) {
  var divClasses = ["abcjs-download-midi", "abcjs-midi-" + index];
  if (midiParams.downloadClass) divClasses.push(midiParams.downloadClass);
  var html = '<div class="' + divClasses.join(" ") + '">';
  if (midiParams.preTextDownload) html += midiParams.preTextDownload;
  var title =
    tune.metaText && tune.metaText.title ? tune.metaText.title : "Untitled";
  var label;
  if (midiParams.downloadLabel && isFunction(midiParams.downloadLabel))
    label = midiParams.downloadLabel(tune, index);
  else if (midiParams.downloadLabel)
    label = midiParams.downloadLabel.replace(/%T/, title);
  else label = 'Download MIDI for "' + title + '"';
  title = title
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\W/g, "_")
    .replace(/__/g, "_");
  var filename = midiParams.fileName ? midiParams.fileName : title + ".midi";
  html +=
    '<a download="' + filename + '" href="' + midi + '">' + label + "</a>";
  if (midiParams.postTextDownload) html += midiParams.postTextDownload;
  return html + "</div>";
};

export default getMidiFile;
