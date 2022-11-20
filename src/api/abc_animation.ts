//    abc_animation.js: handles animating the music in real time.

import TimingCallbacks from './abc_timing_callbacks';

var animation = {};

(function () {
  "use strict";

  var timer: any;
  var cursor: any;
  // @ts-expect-error TS(2339): Property 'startAnimation' does not exist on type '... Remove this comment to see the full error message
  animation.startAnimation = function (paper: any, tune: any, options: any) {
    //options.bpm
    //options.showCursor
    //options.hideCurrentMeasure
    //options.hideFinishedMeasures
    if (timer) {
      timer.stop();
      timer = undefined;
    }

    if (options.showCursor) {
      cursor = paper.querySelector(".abcjs-cursor");
      if (!cursor) {
        cursor = document.createElement("DIV");
        cursor.className = "abcjs-cursor cursor";
        cursor.style.position = "absolute";

        paper.appendChild(cursor);
        paper.style.position = "relative";
      }
    }

    function hideMeasures(elements: any) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (!element.classList.contains("abcjs-bar"))
          element.style.display = "none";
      }
    }

    var lastMeasure: any;
    function disappearMeasuresAfter(selector: any) {
      if (lastMeasure) {
        var elements = paper.querySelectorAll(lastMeasure);
        hideMeasures(elements);
      }
      lastMeasure = selector;
    }

    function disappearMeasuresBefore(selector: any) {
      var elements = paper.querySelectorAll(selector);
      hideMeasures(elements);
    }

    function measureCallback(selector: any) {
      if (options.hideCurrentMeasure) {
        disappearMeasuresBefore(selector);
      } else if (options.hideFinishedMeasures) {
        disappearMeasuresAfter(selector);
      }
    }

    function getLineAndMeasure(element: any) {
      return ".abcjs-l" + element.line + ".abcjs-m" + element.measureNumber;
    }

    function setCursor(range: any) {
      if (range) {
        if (range.measureStart) {
          var selector = getLineAndMeasure(range);
          if (selector) measureCallback(selector);
        }
        if (cursor) {
          cursor.style.left = range.left + "px";
          cursor.style.top = range.top + "px";
          cursor.style.width = range.width + "px";
          cursor.style.height = range.height + "px";
        }
      } else {
        timer.stop();
        timer = undefined;
      }
    }

    // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    timer = new TimingCallbacks(tune, {
      qpm: options.bpm,
      eventCallback: setCursor
    });
    timer.start();
  };

  // @ts-expect-error TS(2339): Property 'pauseAnimation' does not exist on type '... Remove this comment to see the full error message
  animation.pauseAnimation = function (pause: any) {
    if (timer) {
      if (pause) timer.pause();
      else timer.start();
    }
  };

  // @ts-expect-error TS(2339): Property 'stopAnimation' does not exist on type '{... Remove this comment to see the full error message
  animation.stopAnimation = function () {
    if (timer) {
      timer.stop();
      timer = undefined;
    }
  };
})();

export default animation;
