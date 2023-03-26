/**!
Copyright (c) 2009-2023 Paul Rosen and Gregory Dyke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 **This text is from: http://opensource.org/licenses/MIT**
!**/
//    abc_plugin.js: Find everything which looks like abc and convert it

/*global abcjs_is_user_script, abcjs_plugin_autostart */
"use strict";

var TuneBook = require('./src/api/abc_tunebook').TuneBook;
var Parse = require('./src/parse/abc_parse');
var EngraverController = require('./src/write/engraver-controller');

var Plugin = function() {
	"use strict";
	var is_user_script = false;
	try {
		is_user_script = abcjs_is_user_script;
	} catch (ex) {
	}
  this.show_midi = !is_user_script; // TODO-PER: jQuery isn't yet available, so this part of the test will crash. || $.browser.mozilla;	// midi currently only works in Firefox, so in the userscript, don't complicate it.
  this.hide_abc = false;
  this.render_before = false;
  this.midi_options = {};
  //this.parse_options = {};
  this.render_options = {};
  this.render_classname = "abcrendered";
  this.text_classname = "abctext";
  this.auto_render_threshold = 20;
  this.show_text = "show score for: ";
  //this.hide_text = "hide score for: ";
	this.debug = false;
};
var plugin = new Plugin();

plugin.start = function() {
  var body = window.document.body;
  this.errors="";
  var elems = this.getABCContainingElements(body);
  if (elems.length === 0) return;
	if (this.debug) {
		for (var i = 0; i < elems.length; i++) {
			var str = "Possible ABC found (" + (i+1) + " of " + elems.length + "):\n\n" + elems[i].innerText;
			alert(str);
		}
	}
  var divs = elems.map(this.convertToDivs, this)
    .reduce(function (a, b) {
      return a.concat(b);
    });
  this.auto_render = (divs.length <= this.auto_render_threshold);
  divs.forEach(function (elem) {
    this.render(elem, elem.abctext_);
  }, this);
};

// returns an array of the descendants (including self) of elem which have a text node which matches "X:"
plugin.getABCContainingElements = function(elem) {
  var results = [];
  var includeself = false; // whether self is already included (no need to include it again)
  // TODO maybe look to see whether it's even worth it by using textContent ?

  var child;
  for (var i = 0, ii = elem.childNodes.length; i < ii; ++i) {
    child = elem.childNodes[i];
    if (child.nodeType === 3 && !includeself) {
      if (child.nodeValue.match(/^\s*X:/m)) {
        if (child.parentNode.tagName !== 'TEXTAREA') {
          results.push(elem);
          includeself = true;
        }
      }
    } else if (child.nodeType === 1 && child.tagName !== 'TEXTAREA') {
      results = results.concat(this.getABCContainingElements(child));
    }
  }

  return results;
};

// in this element there are one or more pieces of abc
// (and it is not in a subelem)
// for each abc piece, we surround it with a div, store the abctext in the
// div's data("abctext") and return an array
plugin.convertToDivs = function (elem) {
  var abctext = "";
  var abcdiv = null;
  var inabc = false;
  var brcount = 0;
  var results = [];
  var node;
  var childNodes = Array.prototype.slice.call(elem.childNodes);
  for (var i = 0, ii = childNodes.length; i < ii; ++i) {
    node = childNodes[i];
    if (node.nodeType===3 && !node.nodeValue.match(/^\s*$/)) {
      brcount=0;
      var text = node.nodeValue;
      if (text.match(/^\s*X:/m)) {
        inabc=true;
        abctext="";
        abcdiv = document.createElement("DIV");
        abcdiv.className = this.text_classname;

        node.parentElement.insertBefore(abcdiv, node);

        if (this.hide_abc) {
          abcdiv.style.display = 'none';
        }
      }
      if (inabc) {
        abctext += text.replace(/^\n+/,"");
        abcdiv.appendChild(node)
      }
    } else if (inabc && node.tagName === 'BR') {
      abctext += "\n";
      abcdiv.appendChild(node)
      brcount++;
    } else if (inabc && node.nodeType === 1) {
      abctext += "\n";
      abcdiv.appendChild(node)
      // just swallow this.
    } else if (inabc) { // second br or whitespace textnode
      inabc = false;
      brcount=0;
      abctext = abctext.replace(/\n+/,"\n"); // get rid of extra blank lines
      abcdiv.abctext_ = abctext;

      results.push(abcdiv);
    }
  }
  if (inabc) {
    abctext = abctext.replace(/\n+$/,"\n").replace(/^\n+/,"\n"); // get rid of extra blank lines
    abcdiv.abctext_ = abctext;
    results.push(abcdiv);
  }
  return results;
};

plugin.render = function (contextnode, abcstring) {
  var abcdiv = document.createElement('DIV');
  abcdiv.className = this.render_classname;
  if (this.render_before) {
    contextnode.parentElement.insertBefore(abcdiv, contextnode);
  } else {
    if (contextnode.nextSibling) {
      contextnode.parentElement.insertBefore(abcdiv, contextnode.nextSibling);
    } else {
      contextnode.parentElement.appendChild(abcdiv);
    }
  }
  var self = this;
  try {
    if (this.debug) {
      alert("About to render:\n\n" + abcstring);
    }
    var tunebook = new TuneBook(abcstring);
    var abcParser = new Parse();
    abcParser.parse(tunebook.tunes[0].abc);
    var tune = abcParser.getTune();

    var doPrint = function() {
      try {
        var engraver_controller = new EngraverController(abcdiv, self.render_options);
        engraver_controller.engraveABC(tune);
      } catch (ex) { // f*** internet explorer doesn't like innerHTML in weird situations
        // can't remember why we don't do this in the general case, but there was a good reason
        abcdiv.remove();
        abcdiv = document.createElement('DIV');
        abcdiv.className = self.render_classname;
        engraver_controller = new EngraverController(abcdiv);
        engraver_controller.engraveABC(tune);
        if (self.render_before) {
          contextnode.parentElement.insertBefore(abcdiv, contextnode);
        } else {
          if (contextnode.nextSibling) {
            contextnode.parentElement.insertBefore(abcdiv, contextnode.nextSibling);
          } else {
            contextnode.parentElement.appendChild(abcdiv);
          }
        }
      }
      // if (ABCJS.MidiWriter && self.show_midi) {
      //   var midiwriter = new ABCJS.midi.MidiWriter(abcdiv.get(0),self.midi_options);
      //   midiwriter.writeABC(tune);
      // }
    };

    var showtext = document.createElement('A');
    showtext.className = 'abcshow';
    showtext.href = '#';
    showtext.innerHTML = this.show_text + (tune.metaText.title || 'untitled');

    if (this.auto_render) {
      doPrint();
    } else {
      showtext.onclick = function () {
        doPrint();
        showtext.remove();
        return false;
      };

      abcdiv.parentElement.insertBefore(showtext, abcdiv);
    }

  } catch (e) {
    this.errors += e;
  }
};


// There may be a variable defined which controls whether to automatically run the script. If it isn't
// there then it will throw an exception, so we'll catch it here.
var autostart = true;
if (typeof abcjs_plugin_autostart !== 'undefined') {
  autostart = abcjs_plugin_autostart;
}

if (autostart &&
    typeof window !== 'undefined' &&
    typeof (window.document) !== 'undefined') {

  if (window.document.readyState !== 'loading') {
    plugin.start();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      plugin.start();
    });
  }
}

var abcjs = {
	plugin: Plugin
};

module.exports = abcjs;
