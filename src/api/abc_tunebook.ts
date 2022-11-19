//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.

import Parse from '../parse/abc_parse';

import bookParser from '../parse/abc_parse_book';
import tablatures from './abc_tablatures';

var tunebook = {};

(function () {
  "use strict";

  // @ts-expect-error TS(2339): Property 'numberOfTunes' does not exist on type '{... Remove this comment to see the full error message
  tunebook.numberOfTunes = function (abc: any) {
    var tunes = abc.split("\nX:");
    var num = tunes.length;
    if (num === 0) num = 1;
    return num;
  };

  // @ts-expect-error TS(2339): Property 'TuneBook' does not exist on type '{}'.
  var TuneBook = (tunebook.TuneBook = function (book: any) {
    var parsed = bookParser(book);
    // @ts-expect-error TS(2339): Property 'header' does not exist on type '{}'.
    this.header = parsed.header;
    // @ts-expect-error TS(2339): Property 'tunes' does not exist on type '{}'.
    this.tunes = parsed.tunes;
  });

  TuneBook.prototype.getTuneById = function (id: any) {
    for (var i = 0; i < this.tunes.length; i++) {
      if (this.tunes[i].id === "" + id) return this.tunes[i];
    }
    return null;
  };

  TuneBook.prototype.getTuneByTitle = function (title: any) {
    for (var i = 0; i < this.tunes.length; i++) {
      if (this.tunes[i].title === title) return this.tunes[i];
    }
    return null;
  };

  // @ts-expect-error TS(2339): Property 'parseOnly' does not exist on type '{}'.
  tunebook.parseOnly = function (abc: any, params: any) {
    // @ts-expect-error TS(2339): Property 'numberOfTunes' does not exist on type '{... Remove this comment to see the full error message
    var numTunes = tunebook.numberOfTunes(abc);

    // this just needs to be passed in because this tells the engine how many tunes to process.
    var output = [];
    for (var i = 0; i < numTunes; i++) {
      output.push(1);
    }
    function callback() {
      // Don't need to do anything with the parsed tunes.
    }
    // @ts-expect-error TS(2339): Property 'renderEngine' does not exist on type '{}... Remove this comment to see the full error message
    return tunebook.renderEngine(callback, output, abc, params);
  };

  // @ts-expect-error TS(2339): Property 'renderEngine' does not exist on type '{}... Remove this comment to see the full error message
  tunebook.renderEngine = function (callback: any, output: any, abc: any, params: any) {
    var ret = [];
    var isArray = function (testObject: any) {
      return (
        testObject &&
        !testObject.propertyIsEnumerable("length") &&
        typeof testObject === "object" &&
        typeof testObject.length === "number"
      );
    };

    // check and normalize input parameters
    if (output === undefined || abc === undefined) return;
    if (!isArray(output)) output = [output];
    if (params === undefined) params = {};
    var currentTune = params.startingTune
      ? parseInt(params.startingTune, 10)
      : 0;

    // parse the abc string
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    var book = new TuneBook(abc);
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    var abcParser = new Parse();

    // output each tune, if it exists. Otherwise clear the div.
    for (var i = 0; i < output.length; i++) {
      var div = output[i];
      if (div === "*") {
        // This is for "headless" rendering: doing the work but not showing the svg.
      } else if (typeof div === "string") div = document.getElementById(div);
      if (div) {
        if (currentTune >= 0 && currentTune < book.tunes.length) {
          abcParser.parse(
            book.tunes[currentTune].abc,
            params,
            book.tunes[currentTune].startPos - book.header.length
          );
          var tune = abcParser.getTune();
          //
          // Init tablatures plugins
          //
          if (params.tablature) {
            tablatures.init();
            tune.tablatures = tablatures.preparePlugins(
              tune,
              currentTune,
              params
            );
          }
          var warnings = abcParser.getWarnings();
          if (warnings) tune.warnings = warnings;
          var override = callback(div, tune, i, book.tunes[currentTune].abc);
          ret.push(override ? override : tune);
        } else {
          if (div["innerHTML"]) div.innerHTML = "";
        }
      }
      currentTune++;
    }
    return ret;
  };

  function flattenTune(tuneObj: any) {
    // This removes the line breaks and removes the non-music lines.
    var staves = [];
    for (var j = 0; j < tuneObj.lines.length; j++) {
      var line = tuneObj.lines[j];
      if (line.staff) {
        for (var k = 0; k < line.staff.length; k++) {
          var staff = line.staff[k];
          if (!staves[k]) staves[k] = staff;
          else {
            for (var i = 0; i < staff.voices.length; i++) {
              if (staves[k].voices[i])
                staves[k].voices[i] = staves[k].voices[i].concat(
                  staff.voices[i]
                );
              // TODO-PER: If staves[k].voices[i] doesn't exist, that means a voice appeared in the middle of the tune. That isn't handled yet.
            }
          }
        }
      }
    }
    return staves;
  }

  function measuresParser(staff: any, tune: any) {
    var voices = [];
    var lastChord = null;
    var measureStartChord = null;
    var fragStart = null;
    var hasNotes = false;

    for (var i = 0; i < staff.voices.length; i++) {
      var voice = staff.voices[i];
      voices.push([]);
      for (var j = 0; j < voice.length; j++) {
        var elem = voice[j];
        if (fragStart === null && elem.startChar >= 0) {
          fragStart = elem.startChar;
          if (elem.chord === undefined) measureStartChord = lastChord;
          else measureStartChord = null;
        }
        if (elem.chord) lastChord = elem;
        if (elem.el_type === "bar") {
          if (hasNotes) {
            var frag = tune.abc.substring(fragStart, elem.endChar);
            var measure = { abc: frag };
            lastChord =
              measureStartChord &&
              // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
              measureStartChord.chord &&
              // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
              measureStartChord.chord.length > 0
                // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
                ? measureStartChord.chord[0].name
                : null;
            // @ts-expect-error TS(2339): Property 'lastChord' does not exist on type '{ abc... Remove this comment to see the full error message
            if (lastChord) measure.lastChord = lastChord;
            // @ts-expect-error TS(2339): Property 'startEnding' does not exist on type '{ a... Remove this comment to see the full error message
            if (elem.startEnding) measure.startEnding = elem.startEnding;
            // @ts-expect-error TS(2339): Property 'endEnding' does not exist on type '{ abc... Remove this comment to see the full error message
            if (elem.endEnding) measure.endEnding = elem.endEnding;
            // @ts-expect-error TS(2345): Argument of type '{ abc: any; }' is not assignable... Remove this comment to see the full error message
            voices[i].push(measure);
            fragStart = null;
            hasNotes = false;
          }
        } else if (elem.el_type === "note") {
          hasNotes = true;
        }
      }
    }
    return voices;
  }

  // @ts-expect-error TS(2339): Property 'extractMeasures' does not exist on type ... Remove this comment to see the full error message
  tunebook.extractMeasures = function (abc: any) {
    var tunes = [];
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    var book = new TuneBook(abc);
    for (var i = 0; i < book.tunes.length; i++) {
      var tune = book.tunes[i];
      var arr = tune.abc.split("K:");
      var arr2 = arr[1].split("\n");
      var header = arr[0] + "K:" + arr2[0] + "\n";
      var lastChord = null;
      var measureStartChord = null;
      var fragStart = null;
      var measures = [];
      var hasNotes = false;
      // @ts-expect-error TS(2339): Property 'parseOnly' does not exist on type '{}'.
      var tuneObj = tunebook.parseOnly(tune.abc)[0];
      var hasPickup = tuneObj.getPickupLength() > 0;
      // var staves = flattenTune(tuneObj);
      // for (var s = 0; s < staves.length; s++) {
      // 	var voices = measuresParser(staves[s], tune);
      // 	if (s === 0)
      // 		measures = voices;
      // 	else {
      // 		for (var ss = 0; ss < voices.length; ss++) {
      // 			var voice = voices[ss];
      // 			if (measures.length <= ss)
      // 				measures.push([]);
      // 			var measureVoice = measures[ss];
      // 			for (var sss = 0; sss < voice.length; sss++) {
      // 				if (measureVoice.length > sss)
      // 					measureVoice[sss].abc += "\n" + voice[sss].abc;
      // 				else
      // 					measures.push(voice[sss]);
      // 			}
      // 		}
      // 	}
      // 	console.log(voices);
      // }
      // measures = measures[0];

      for (var j = 0; j < tuneObj.lines.length; j++) {
        var line = tuneObj.lines[j];
        if (line.staff) {
          for (var k = 0; k < 1 /*line.staff.length*/; k++) {
            var staff = line.staff[k];
            for (var kk = 0; kk < 1 /*staff.voices.length*/; kk++) {
              var voice = staff.voices[kk];
              for (var kkk = 0; kkk < voice.length; kkk++) {
                var elem = voice[kkk];
                if (fragStart === null && elem.startChar >= 0) {
                  fragStart = elem.startChar;
                  if (elem.chord === undefined) measureStartChord = lastChord;
                  else measureStartChord = null;
                }
                if (elem.chord) lastChord = elem;
                if (elem.el_type === "bar") {
                  if (hasNotes) {
                    var frag = tune.abc.substring(fragStart, elem.endChar);
                    var measure = { abc: frag };
                    lastChord =
                      measureStartChord &&
                      // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
                      measureStartChord.chord &&
                      // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
                      measureStartChord.chord.length > 0
                        // @ts-expect-error TS(2339): Property 'chord' does not exist on type 'never'.
                        ? measureStartChord.chord[0].name
                        : null;
                    // @ts-expect-error TS(2339): Property 'lastChord' does not exist on type '{ abc... Remove this comment to see the full error message
                    if (lastChord) measure.lastChord = lastChord;
                    if (elem.startEnding)
                      // @ts-expect-error TS(2339): Property 'startEnding' does not exist on type '{ a... Remove this comment to see the full error message
                      measure.startEnding = elem.startEnding;
                    // @ts-expect-error TS(2339): Property 'endEnding' does not exist on type '{ abc... Remove this comment to see the full error message
                    if (elem.endEnding) measure.endEnding = elem.endEnding;
                    measures.push(measure);
                    fragStart = null;
                    hasNotes = false;
                  }
                } else if (elem.el_type === "note") {
                  hasNotes = true;
                }
              }
            }
          }
        }
      }
      tunes.push({
        header: header,
        measures: measures,
        hasPickup: hasPickup
      });
    }
    return tunes;
  };
})();

export default tunebook;
