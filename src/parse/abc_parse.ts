//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.

import parseCommon from './abc_common';

import parseDirective from './abc_parse_directive';
import ParseHeader from './abc_parse_header';
import ParseMusic from './abc_parse_music';
import Tokenizer from './abc_tokenizer';
import wrap from './wrap_lines';
import Tune from '../data/abc_tune';
import TuneBuilder from '../parse/tune-builder';

var Parse = function(this: any) {
  "use strict";
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var tune = new Tune();
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var tuneBuilder = new TuneBuilder(tune);
  var tokenizer: any;
  var wordsContinuation = "";
  var symbolContinuation = "";

  this.getTune = function () {
    var t = {
      formatting: tune.formatting,
      lines: tune.lines,
      media: tune.media,
      metaText: tune.metaText,
      metaTextInfo: tune.metaTextInfo,
      version: tune.version,

      addElementToEvents: tune.addElementToEvents,
      addUsefulCallbackInfo: tune.addUsefulCallbackInfo,
      getTotalTime: tune.getTotalTime,
      getTotalBeats: tune.getTotalBeats,
      getBarLength: tune.getBarLength,
      getBeatLength: tune.getBeatLength,
      getBeatsPerMeasure: tune.getBeatsPerMeasure,
      getBpm: tune.getBpm,
      getMeter: tune.getMeter,
      getMeterFraction: tune.getMeterFraction,
      getPickupLength: tune.getPickupLength,
      getKeySignature: tune.getKeySignature,
      getElementFromChar: tune.getElementFromChar,
      makeVoicesArray: tune.makeVoicesArray,
      millisecondsPerMeasure: tune.millisecondsPerMeasure,
      setupEvents: tune.setupEvents,
      setTiming: tune.setTiming,
      setUpAudio: tune.setUpAudio,
      deline: tune.deline
    };
    // @ts-expect-error TS(2339): Property 'lineBreaks' does not exist on type '{ fo... Remove this comment to see the full error message
    if (tune.lineBreaks) t.lineBreaks = tune.lineBreaks;
    // @ts-expect-error TS(2339): Property 'visualTranspose' does not exist on type ... Remove this comment to see the full error message
    if (tune.visualTranspose) t.visualTranspose = tune.visualTranspose;
    return t;
  };

  function addPositioning(el: any, type: any, value: any) {
    if (!el.positioning) el.positioning = {};
    el.positioning[type] = value;
  }

  function addFont(el: any, type: any, value: any) {
    if (!el.fonts) el.fonts = {};
    el.fonts[type] = value;
  }

  var multilineVars = {
    reset: function () {
      for (var property in this) {
        if (
          // @ts-expect-error TS(2339): Property 'prototype' does not exist on type '{ res... Remove this comment to see the full error message
          this.prototype.hasOwnProperty.call(property) &&
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          typeof this[property] !== "function"
        ) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          delete this[property];
        }
      }
      // @ts-expect-error TS(2339): Property 'iChar' does not exist on type '{ reset: ... Remove this comment to see the full error message
      this.iChar = 0;
      // @ts-expect-error TS(2339): Property 'key' does not exist on type '{ reset: ()... Remove this comment to see the full error message
      this.key = { accidentals: [], root: "none", acc: "", mode: "" };
      // @ts-expect-error TS(2339): Property 'meter' does not exist on type '{ reset: ... Remove this comment to see the full error message
      this.meter = null; // if no meter is specified, free meter is assumed
      // @ts-expect-error TS(2339): Property 'origMeter' does not exist on type '{ res... Remove this comment to see the full error message
      this.origMeter = null; // this is for new voices that are created after we set the meter.
      // @ts-expect-error TS(2339): Property 'hasMainTitle' does not exist on type '{ ... Remove this comment to see the full error message
      this.hasMainTitle = false;
      // @ts-expect-error TS(2339): Property 'default_length' does not exist on type '... Remove this comment to see the full error message
      this.default_length = 0.125;
      // @ts-expect-error TS(2339): Property 'clef' does not exist on type '{ reset: (... Remove this comment to see the full error message
      this.clef = { type: "treble", verticalPos: 0 };
      // @ts-expect-error TS(2339): Property 'next_note_duration' does not exist on ty... Remove this comment to see the full error message
      this.next_note_duration = 0;
      // @ts-expect-error TS(2339): Property 'start_new_line' does not exist on type '... Remove this comment to see the full error message
      this.start_new_line = true;
      // @ts-expect-error TS(2339): Property 'is_in_header' does not exist on type '{ ... Remove this comment to see the full error message
      this.is_in_header = true;
      // @ts-expect-error TS(2339): Property 'partForNextLine' does not exist on type ... Remove this comment to see the full error message
      this.partForNextLine = {};
      // @ts-expect-error TS(2339): Property 'tempoForNextLine' does not exist on type... Remove this comment to see the full error message
      this.tempoForNextLine = [];
      // @ts-expect-error TS(2339): Property 'havent_set_length' does not exist on typ... Remove this comment to see the full error message
      this.havent_set_length = true;
      // @ts-expect-error TS(2339): Property 'voices' does not exist on type '{ reset:... Remove this comment to see the full error message
      this.voices = {};
      // @ts-expect-error TS(2339): Property 'staves' does not exist on type '{ reset:... Remove this comment to see the full error message
      this.staves = [];
      // @ts-expect-error TS(2339): Property 'macros' does not exist on type '{ reset:... Remove this comment to see the full error message
      this.macros = {};
      // @ts-expect-error TS(2339): Property 'currBarNumber' does not exist on type '{... Remove this comment to see the full error message
      this.currBarNumber = 1;
      // @ts-expect-error TS(2339): Property 'barCounter' does not exist on type '{ re... Remove this comment to see the full error message
      this.barCounter = {};
      // @ts-expect-error TS(2339): Property 'ignoredDecorations' does not exist on ty... Remove this comment to see the full error message
      this.ignoredDecorations = [];
      // @ts-expect-error TS(2339): Property 'score_is_present' does not exist on type... Remove this comment to see the full error message
      this.score_is_present = false; // Can't have original V: lines when there is the score directive
      // @ts-expect-error TS(2339): Property 'inEnding' does not exist on type '{ rese... Remove this comment to see the full error message
      this.inEnding = false;
      // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
      this.inTie = [];
      // @ts-expect-error TS(2339): Property 'inTieChord' does not exist on type '{ re... Remove this comment to see the full error message
      this.inTieChord = {};
      // @ts-expect-error TS(2339): Property 'vocalPosition' does not exist on type '{... Remove this comment to see the full error message
      this.vocalPosition = "auto";
      // @ts-expect-error TS(2339): Property 'dynamicPosition' does not exist on type ... Remove this comment to see the full error message
      this.dynamicPosition = "auto";
      // @ts-expect-error TS(2339): Property 'chordPosition' does not exist on type '{... Remove this comment to see the full error message
      this.chordPosition = "auto";
      // @ts-expect-error TS(2339): Property 'ornamentPosition' does not exist on type... Remove this comment to see the full error message
      this.ornamentPosition = "auto";
      // @ts-expect-error TS(2339): Property 'volumePosition' does not exist on type '... Remove this comment to see the full error message
      this.volumePosition = "auto";
      // @ts-expect-error TS(2339): Property 'openSlurs' does not exist on type '{ res... Remove this comment to see the full error message
      this.openSlurs = [];
      // @ts-expect-error TS(2339): Property 'freegchord' does not exist on type '{ re... Remove this comment to see the full error message
      this.freegchord = false;
      // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
      this.endingHoldOver = {};
    },
    differentFont: function (type: any, defaultFonts: any) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (this[type].decoration !== defaultFonts[type].decoration) return true;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (this[type].face !== defaultFonts[type].face) return true;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (this[type].size !== defaultFonts[type].size) return true;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (this[type].style !== defaultFonts[type].style) return true;
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (this[type].weight !== defaultFonts[type].weight) return true;
      return false;
    },
    addFormattingOptions: function (el: any, defaultFonts: any, elType: any) {
      if (elType === "note") {
        // @ts-expect-error TS(2339): Property 'vocalPosition' does not exist on type '{... Remove this comment to see the full error message
        if (this.vocalPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'vocalPosition' does not exist on type '{... Remove this comment to see the full error message
          addPositioning(el, "vocalPosition", this.vocalPosition);
        // @ts-expect-error TS(2339): Property 'dynamicPosition' does not exist on type ... Remove this comment to see the full error message
        if (this.dynamicPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'dynamicPosition' does not exist on type ... Remove this comment to see the full error message
          addPositioning(el, "dynamicPosition", this.dynamicPosition);
        // @ts-expect-error TS(2339): Property 'chordPosition' does not exist on type '{... Remove this comment to see the full error message
        if (this.chordPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'chordPosition' does not exist on type '{... Remove this comment to see the full error message
          addPositioning(el, "chordPosition", this.chordPosition);
        // @ts-expect-error TS(2339): Property 'ornamentPosition' does not exist on type... Remove this comment to see the full error message
        if (this.ornamentPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'ornamentPosition' does not exist on type... Remove this comment to see the full error message
          addPositioning(el, "ornamentPosition", this.ornamentPosition);
        // @ts-expect-error TS(2339): Property 'volumePosition' does not exist on type '... Remove this comment to see the full error message
        if (this.volumePosition !== "auto")
          // @ts-expect-error TS(2339): Property 'volumePosition' does not exist on type '... Remove this comment to see the full error message
          addPositioning(el, "volumePosition", this.volumePosition);
        if (this.differentFont("annotationfont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'annotationfont' does not exist on type '... Remove this comment to see the full error message
          addFont(el, "annotationfont", this.annotationfont);
        if (this.differentFont("gchordfont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'gchordfont' does not exist on type '{ re... Remove this comment to see the full error message
          addFont(el, "gchordfont", this.gchordfont);
        if (this.differentFont("vocalfont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'vocalfont' does not exist on type '{ res... Remove this comment to see the full error message
          addFont(el, "vocalfont", this.vocalfont);
        if (this.differentFont("tripletfont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'tripletfont' does not exist on type '{ r... Remove this comment to see the full error message
          addFont(el, "tripletfont", this.tripletfont);
      } else if (elType === "bar") {
        // @ts-expect-error TS(2339): Property 'dynamicPosition' does not exist on type ... Remove this comment to see the full error message
        if (this.dynamicPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'dynamicPosition' does not exist on type ... Remove this comment to see the full error message
          addPositioning(el, "dynamicPosition", this.dynamicPosition);
        // @ts-expect-error TS(2339): Property 'chordPosition' does not exist on type '{... Remove this comment to see the full error message
        if (this.chordPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'chordPosition' does not exist on type '{... Remove this comment to see the full error message
          addPositioning(el, "chordPosition", this.chordPosition);
        // @ts-expect-error TS(2339): Property 'ornamentPosition' does not exist on type... Remove this comment to see the full error message
        if (this.ornamentPosition !== "auto")
          // @ts-expect-error TS(2339): Property 'ornamentPosition' does not exist on type... Remove this comment to see the full error message
          addPositioning(el, "ornamentPosition", this.ornamentPosition);
        // @ts-expect-error TS(2339): Property 'volumePosition' does not exist on type '... Remove this comment to see the full error message
        if (this.volumePosition !== "auto")
          // @ts-expect-error TS(2339): Property 'volumePosition' does not exist on type '... Remove this comment to see the full error message
          addPositioning(el, "volumePosition", this.volumePosition);
        if (this.differentFont("measurefont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'measurefont' does not exist on type '{ r... Remove this comment to see the full error message
          addFont(el, "measurefont", this.measurefont);
        if (this.differentFont("repeatfont", defaultFonts))
          // @ts-expect-error TS(2339): Property 'repeatfont' does not exist on type '{ re... Remove this comment to see the full error message
          addFont(el, "repeatfont", this.repeatfont);
      }
    },
    duplicateStartEndingHoldOvers: function () {
      // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
      this.endingHoldOver = {
        inTie: [],
        inTieChord: {}
      };
      // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
      for (var i = 0; i < this.inTie.length; i++) {
        // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
        this.endingHoldOver.inTie.push([]);
        // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
        if (this.inTie[i]) {
          // if a voice is suppressed there might be a gap in the array.
          // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
          for (var j = 0; j < this.inTie[i].length; j++) {
            // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
            this.endingHoldOver.inTie[i].push(this.inTie[i][j]);
          }
        }
      }
      // @ts-expect-error TS(2339): Property 'inTieChord' does not exist on type '{ re... Remove this comment to see the full error message
      for (var key in this.inTieChord) {
        // @ts-expect-error TS(2339): Property 'inTieChord' does not exist on type '{ re... Remove this comment to see the full error message
        if (this.inTieChord.prototype.hasOwnProperty.call(key))
          // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
          this.endingHoldOver.inTieChord[key] = this.inTieChord[key];
      }
    },
    restoreStartEndingHoldOvers: function () {
      // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
      if (!this.endingHoldOver.inTie) return;
      // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
      this.inTie = [];
      // @ts-expect-error TS(2339): Property 'inTieChord' does not exist on type '{ re... Remove this comment to see the full error message
      this.inTieChord = {};
      // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
      for (var i = 0; i < this.endingHoldOver.inTie.length; i++) {
        // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
        this.inTie.push([]);
        // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
        for (var j = 0; j < this.endingHoldOver.inTie[i].length; j++) {
          // @ts-expect-error TS(2339): Property 'inTie' does not exist on type '{ reset: ... Remove this comment to see the full error message
          this.inTie[i].push(this.endingHoldOver.inTie[i][j]);
        }
      }
      // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
      for (var key in this.endingHoldOver.inTieChord) {
        // @ts-expect-error TS(2339): Property 'endingHoldOver' does not exist on type '... Remove this comment to see the full error message
        if (this.endingHoldOver.inTieChord.prototype.hasOwnProperty.call(key))
          // @ts-expect-error TS(2339): Property 'inTieChord' does not exist on type '{ re... Remove this comment to see the full error message
          this.inTieChord[key] = this.endingHoldOver.inTieChord[key];
      }
    }
  };

  var addWarning = function (str: any) {
    // @ts-expect-error TS(2339): Property 'warnings' does not exist on type '{ rese... Remove this comment to see the full error message
    if (!multilineVars.warnings) multilineVars.warnings = [];
    // @ts-expect-error TS(2339): Property 'warnings' does not exist on type '{ rese... Remove this comment to see the full error message
    multilineVars.warnings.push(str);
  };

  var addWarningObject = function (warningObject: any) {
    // @ts-expect-error TS(2339): Property 'warningObjects' does not exist on type '... Remove this comment to see the full error message
    if (!multilineVars.warningObjects) multilineVars.warningObjects = [];
    // @ts-expect-error TS(2339): Property 'warningObjects' does not exist on type '... Remove this comment to see the full error message
    multilineVars.warningObjects.push(warningObject);
  };

  var encode = function (str: any) {
    // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
    var ret = parseCommon.gsub(str, "\x12", " ");
    // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
    ret = parseCommon.gsub(ret, "&", "&amp;");
    // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
    ret = parseCommon.gsub(ret, "<", "&lt;");
    // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
    return parseCommon.gsub(ret, ">", "&gt;");
  };

  var warn = function (str: any, line: any, col_num: any) {
    if (!line) line = " ";
    var bad_char = line.charAt(col_num);
    if (bad_char === " ") bad_char = "SPACE";
    var clean_line =
      encode(line.substring(col_num - 64, col_num)) +
      '<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">' +
      bad_char +
      "</span>" +
      encode(line.substring(col_num + 1).substring(0, 64));
    addWarning(
      "Music Line:" +
        tokenizer.lineIndex +
        ":" +
        (col_num + 1) +
        ": " +
        str +
        ":  " +
        clean_line
    );
    addWarningObject({
      message: str,
      line: line,
      // @ts-expect-error TS(2339): Property 'iChar' does not exist on type '{ reset: ... Remove this comment to see the full error message
      startChar: multilineVars.iChar + col_num,
      column: col_num
    });
  };

  var header: any;
  var music: any;

  this.getWarnings = function () {
    // @ts-expect-error TS(2339): Property 'warnings' does not exist on type '{ rese... Remove this comment to see the full error message
    return multilineVars.warnings;
  };
  this.getWarningObjects = function () {
    // @ts-expect-error TS(2339): Property 'warningObjects' does not exist on type '... Remove this comment to see the full error message
    return multilineVars.warningObjects;
  };

  var addWords = function (line: any, words: any) {
    if (words.indexOf("\x12") >= 0) {
      wordsContinuation += words;
      return;
    }
    words = wordsContinuation + words;
    wordsContinuation = "";

    if (!line) {
      warn("Can't add words before the first line of music", line, 0);
      return;
    }
    // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
    words = parseCommon.strip(words);
    if (words.charAt(words.length - 1) !== "-") words = words + " "; // Just makes it easier to parse below, since every word has a divider after it.
    var word_list: any = [];
    // first make a list of words from the string we are passed. A word is divided on either a space or dash.
    var last_divider = 0;
    var replace = false;
    var addWord = function (i: any) {
      // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
      var word = parseCommon.strip(words.substring(last_divider, i));
      word = word.replace(/\\([-_*|~])/g, "$1");
      last_divider = i + 1;
      if (word.length > 0) {
        // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
        if (replace) word = parseCommon.gsub(word, "~", " ");
        var div = words.charAt(i);
        if (div !== "_" && div !== "-") div = " ";
        word_list.push({
          syllable: tokenizer.translateString(word),
          divider: div
        });
        replace = false;
        return true;
      }
      return false;
    };
    var escNext = false;
    for (var i = 0; i < words.length; i++) {
      switch (words[i]) {
        case " ":
        case "\x12":
          addWord(i);
          break;
        case "-":
          if (!escNext && !addWord(i) && word_list.length > 0) {
            // @ts-expect-error TS(2339): Property 'last' does not exist on type '{}'.
            parseCommon.last(word_list).divider = "-";
            word_list.push({ skip: true, to: "next" });
          }
          break;
        case "_":
          if (!escNext) {
            addWord(i);
            word_list.push({ skip: true, to: "slur" });
          }
          break;
        case "*":
          if (!escNext) {
            addWord(i);
            word_list.push({ skip: true, to: "next" });
          }
          break;
        case "|":
          if (!escNext) {
            addWord(i);
            word_list.push({ skip: true, to: "bar" });
          }
          break;
        case "~":
          if (!escNext) {
            replace = true;
          }
          break;
      }
      escNext = words[i] === "\\";
    }

    var inSlur = false;
    // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
    parseCommon.each(line, function (el: any) {
      if (word_list.length !== 0) {
        if (word_list[0].skip) {
          switch (word_list[0].to) {
            case "next":
              if (el.el_type === "note" && el.pitches !== null && !inSlur)
                word_list.shift();
              break;
            case "slur":
              if (el.el_type === "note" && el.pitches !== null)
                word_list.shift();
              break;
            case "bar":
              if (el.el_type === "bar") word_list.shift();
              break;
          }
          if (el.el_type !== "bar") {
            if (el.lyric === undefined)
              el.lyric = [{ syllable: "", divider: " " }];
            else el.lyric.push({ syllable: "", divider: " " });
          }
        } else {
          if (el.el_type === "note" && el.rest === undefined && !inSlur) {
            var lyric = word_list.shift();
            if (lyric.syllable)
              lyric.syllable = lyric.syllable.replace(/ +/g, "\xA0");
            if (el.lyric === undefined) el.lyric = [lyric];
            else el.lyric.push(lyric);
          }
        }
      }
    });
  };

  var addSymbols = function (line: any, words: any) {
    if (words.indexOf("\x12") >= 0) {
      symbolContinuation += words;
      return;
    }
    words = symbolContinuation + words;
    symbolContinuation = "";

    // TODO-PER: Currently copied from w: line. This needs to be read as symbols instead.
    if (!line) {
      warn("Can't add symbols before the first line of music", line, 0);
      return;
    }
    // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
    words = parseCommon.strip(words);
    if (words.charAt(words.length - 1) !== "-") words = words + " "; // Just makes it easier to parse below, since every word has a divider after it.
    var word_list: any = [];
    // first make a list of words from the string we are passed. A word is divided on either a space or dash.
    var last_divider = 0;
    var replace = false;
    var addWord = function (i: any) {
      // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
      var word = parseCommon.strip(words.substring(last_divider, i));
      last_divider = i + 1;
      if (word.length > 0) {
        // @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
        if (replace) word = parseCommon.gsub(word, "~", " ");
        var div = words.charAt(i);
        if (div !== "_" && div !== "-") div = " ";
        word_list.push({
          syllable: tokenizer.translateString(word),
          divider: div
        });
        replace = false;
        return true;
      }
      return false;
    };
    for (var i = 0; i < words.length; i++) {
      switch (words.charAt(i)) {
        case " ":
        case "\x12":
          addWord(i);
          break;
        case "-":
          if (!addWord(i) && word_list.length > 0) {
            // @ts-expect-error TS(2339): Property 'last' does not exist on type '{}'.
            parseCommon.last(word_list).divider = "-";
            word_list.push({ skip: true, to: "next" });
          }
          break;
        case "_":
          addWord(i);
          word_list.push({ skip: true, to: "slur" });
          break;
        case "*":
          addWord(i);
          word_list.push({ skip: true, to: "next" });
          break;
        case "|":
          addWord(i);
          word_list.push({ skip: true, to: "bar" });
          break;
        case "~":
          replace = true;
          break;
      }
    }

    var inSlur = false;
    // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
    parseCommon.each(line, function (el: any) {
      if (word_list.length !== 0) {
        if (word_list[0].skip) {
          switch (word_list[0].to) {
            case "next":
              if (el.el_type === "note" && el.pitches !== null && !inSlur)
                word_list.shift();
              break;
            case "slur":
              if (el.el_type === "note" && el.pitches !== null)
                word_list.shift();
              break;
            case "bar":
              if (el.el_type === "bar") word_list.shift();
              break;
          }
        } else {
          if (el.el_type === "note" && el.rest === undefined && !inSlur) {
            var lyric = word_list.shift();
            if (el.lyric === undefined) el.lyric = [lyric];
            else el.lyric.push(lyric);
          }
        }
      }
    });
  };

  var parseLine = function (line: any) {
    // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type '{}'.
    if (parseCommon.startsWith(line, "%%")) {
      // @ts-expect-error TS(2339): Property 'addDirective' does not exist on type '{}... Remove this comment to see the full error message
      var err = parseDirective.addDirective(line.substring(2));
      if (err) warn(err, line, 2);
      return;
    }

    var i = line.indexOf("%");
    if (i >= 0) line = line.substring(0, i);
    line = line.replace(/\s+$/, "");

    if (line.length === 0) return;

    if (wordsContinuation) {
      addWords(tuneBuilder.getCurrentVoice(), line.substring(2));
      return;
    }
    if (symbolContinuation) {
      addSymbols(tuneBuilder.getCurrentVoice(), line.substring(2));
      return;
    }
    if (line.length < 2 || line.charAt(1) !== ":" || music.lineContinuation) {
      music.parseMusic(line);
      return;
    }

    var ret = header.parseHeader(line);
    if (ret.regular) music.parseMusic(line);
    if (ret.newline) music.startNewLine();
    if (ret.words) addWords(tuneBuilder.getCurrentVoice(), line.substring(2));
    if (ret.symbols)
      addSymbols(tuneBuilder.getCurrentVoice(), line.substring(2));
  };

  function appendLastMeasure(voice: any, nextVoice: any) {
    voice.push({
      el_type: "hint"
    });
    for (var i = 0; i < nextVoice.length; i++) {
      var element = nextVoice[i];
      // @ts-expect-error TS(2339): Property 'clone' does not exist on type '{}'.
      var hint = parseCommon.clone(element);
      voice.push(hint);
      if (element.el_type === "bar") return;
    }
  }

  function addHintMeasure(staff: any, nextStaff: any) {
    for (var i = 0; i < staff.length; i++) {
      var stave = staff[i];
      var nextStave = nextStaff[i];
      if (nextStave) {
        // Be sure there is the same number of staves on the next line.
        for (var j = 0; j < nextStave.voices.length; j++) {
          var nextVoice = nextStave.voices[j];
          var voice = stave.voices[j];
          if (voice) {
            // Be sure there are the same number of voices on the previous line.
            appendLastMeasure(voice, nextVoice);
          }
        }
      }
    }
  }

  function addHintMeasures() {
    for (var i = 0; i < tune.lines.length; i++) {
      var line = tune.lines[i].staff;
      if (line) {
        var j = i + 1;
        while (j < tune.lines.length && tune.lines[j].staff === undefined) j++;
        if (j < tune.lines.length) {
          var nextLine = tune.lines[j].staff;
          addHintMeasure(line, nextLine);
        }
      }
    }
  }

  this.parse = function (strTune: any, switches: any, startPos: any) {
    // the switches are optional and cause a difference in the way the tune is parsed.
    // switches.header_only : stop parsing when the header is finished
    // switches.stop_on_warning : stop at the first warning encountered.
    // switches.print: format for the page instead of the browser.
    // switches.format: a hash of the desired formatting commands.
    // switches.hint_measures: put the next measure at the end of the current line.
    // switches.transpose: change the key signature, chords, and notes by a number of half-steps.
    if (!switches) switches = {};
    if (!startPos) startPos = 0;
    tune.reset();

    // Take care of whatever line endings come our way
    // Tack on newline temporarily to make the last line continuation work
    strTune = strTune.replace(/\r\n?/g, "\n") + "\n";

    // get rid of latex commands. If a line starts with a backslash, then it is replaced by spaces to keep the character count the same.
    var arr = strTune.split("\n\\");
    if (arr.length > 1) {
      for (var i2 = 1; i2 < arr.length; i2++) {
        while (arr[i2].length > 0 && arr[i2][0] !== "\n") {
          arr[i2] = arr[i2].substr(1);
          arr[i2 - 1] += " ";
        }
      }
      strTune = arr.join("  "); //. the split removed two characters, so this puts them back
    }
    // take care of line continuations right away, but keep the same number of characters
    strTune = strTune.replace(
      /\\([ \t]*)(%.*)*\n/g,
      function (all: any, backslash: any, comment: any) {
        var padding = comment ? Array(comment.length + 1).join(" ") : "";
        return backslash + "\x12" + padding + "\n";
      }
    );
    var lines = strTune.split("\n");
    // @ts-expect-error TS(2339): Property 'last' does not exist on type '{}'.
    if (parseCommon.last(lines).length === 0)
      // remove the blank line we added above.
      lines.pop();
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    tokenizer = new Tokenizer(lines, multilineVars);
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    header = new ParseHeader(tokenizer, warn, multilineVars, tune, tuneBuilder);
    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    music = new ParseMusic(
      tokenizer,
      warn,
      multilineVars,
      tune,
      tuneBuilder,
      header
    );

    if (switches.print) tune.media = "print";
    multilineVars.reset();
    // @ts-expect-error TS(2339): Property 'iChar' does not exist on type '{ reset: ... Remove this comment to see the full error message
    multilineVars.iChar = startPos;
    if (switches.visualTranspose) {
      // @ts-expect-error TS(2339): Property 'globalTranspose' does not exist on type ... Remove this comment to see the full error message
      multilineVars.globalTranspose = parseInt(switches.visualTranspose);
      // @ts-expect-error TS(2339): Property 'globalTranspose' does not exist on type ... Remove this comment to see the full error message
      if (multilineVars.globalTranspose === 0)
        // @ts-expect-error TS(2339): Property 'globalTranspose' does not exist on type ... Remove this comment to see the full error message
        multilineVars.globalTranspose = undefined;
      else tuneBuilder.setVisualTranspose(switches.visualTranspose);
    // @ts-expect-error TS(2339): Property 'globalTranspose' does not exist on type ... Remove this comment to see the full error message
    } else multilineVars.globalTranspose = undefined;
    if (switches.lineBreaks) {
      // The line break numbers are 0-based and they reflect the last measure of the current line.
      // @ts-expect-error TS(2339): Property 'lineBreaks' does not exist on type '{ re... Remove this comment to see the full error message
      multilineVars.lineBreaks = switches.lineBreaks;
      //multilineVars.continueall = true;
    }
    header.reset(tokenizer, warn, multilineVars, tune);

    try {
      if (switches.format) {
        // @ts-expect-error TS(2339): Property 'globalFormatting' does not exist on type... Remove this comment to see the full error message
        parseDirective.globalFormatting(switches.format);
      }
      var line = tokenizer.nextLine();
      while (line) {
        // @ts-expect-error TS(2339): Property 'is_in_header' does not exist on type '{ ... Remove this comment to see the full error message
        if (switches.header_only && multilineVars.is_in_header === false)
          throw "normal_abort";
        // @ts-expect-error TS(2339): Property 'warnings' does not exist on type '{ rese... Remove this comment to see the full error message
        if (switches.stop_on_warning && multilineVars.warnings)
          throw "normal_abort";

        // @ts-expect-error TS(2339): Property 'is_in_header' does not exist on type '{ ... Remove this comment to see the full error message
        var wasInHeader = multilineVars.is_in_header;
        parseLine(line);
        // @ts-expect-error TS(2339): Property 'is_in_header' does not exist on type '{ ... Remove this comment to see the full error message
        if (wasInHeader && !multilineVars.is_in_header) {
          tuneBuilder.setRunningFont(
            "annotationfont",
            // @ts-expect-error TS(2339): Property 'annotationfont' does not exist on type '... Remove this comment to see the full error message
            multilineVars.annotationfont
          );
          // @ts-expect-error TS(2339): Property 'gchordfont' does not exist on type '{ re... Remove this comment to see the full error message
          tuneBuilder.setRunningFont("gchordfont", multilineVars.gchordfont);
          // @ts-expect-error TS(2339): Property 'tripletfont' does not exist on type '{ r... Remove this comment to see the full error message
          tuneBuilder.setRunningFont("tripletfont", multilineVars.tripletfont);
          // @ts-expect-error TS(2339): Property 'vocalfont' does not exist on type '{ res... Remove this comment to see the full error message
          tuneBuilder.setRunningFont("vocalfont", multilineVars.vocalfont);
        }
        line = tokenizer.nextLine();
      }

      if (wordsContinuation) {
        addWords(tuneBuilder.getCurrentVoice(), "");
      }
      if (symbolContinuation) {
        addSymbols(tuneBuilder.getCurrentVoice(), "");
      }
      // @ts-expect-error TS(2339): Property 'openSlurs' does not exist on type '{ res... Remove this comment to see the full error message
      multilineVars.openSlurs = tuneBuilder.cleanUp(
        // @ts-expect-error TS(2339): Property 'barsperstaff' does not exist on type '{ ... Remove this comment to see the full error message
        multilineVars.barsperstaff,
        // @ts-expect-error TS(2339): Property 'staffnonote' does not exist on type '{ r... Remove this comment to see the full error message
        multilineVars.staffnonote,
        // @ts-expect-error TS(2339): Property 'openSlurs' does not exist on type '{ res... Remove this comment to see the full error message
        multilineVars.openSlurs
      );
    } catch (err) {
      if (err !== "normal_abort") throw err;
    }

    var ph = 11 * 72;
    var pl = 8.5 * 72;
    // @ts-expect-error TS(2339): Property 'papersize' does not exist on type '{ res... Remove this comment to see the full error message
    switch (multilineVars.papersize) {
      //case "letter": ph = 11*72; pl = 8.5*72; break;
      case "legal":
        ph = 14 * 72;
        pl = 8.5 * 72;
        break;
      case "A4":
        ph = 11.7 * 72;
        pl = 8.3 * 72;
        break;
    }
    // @ts-expect-error TS(2339): Property 'landscape' does not exist on type '{ res... Remove this comment to see the full error message
    if (multilineVars.landscape) {
      var x = ph;
      ph = pl;
      pl = x;
    }
    if (!tune.formatting.pagewidth) tune.formatting.pagewidth = pl;
    if (!tune.formatting.pageheight) tune.formatting.pageheight = ph;

    if (switches.hint_measures) {
      addHintMeasures();
    }

    // @ts-expect-error TS(2339): Property 'lineBreaks' does not exist on type '{ re... Remove this comment to see the full error message
    wrap.wrapLines(tune, multilineVars.lineBreaks, multilineVars.barNumbers);
  };
};

export default Parse;
