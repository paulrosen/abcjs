//    abc_plugin.js: Find everything which looks like abc and convert it

//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

//    requires: abcjs, raphael, jquery
/*global jQuery, ABCJS, Raphael, abcjs_is_user_script, abcjs_plugin_autostart */

if (!window.ABCJS)
	window.ABCJS = {};

window.ABCJS.Plugin = function() {
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
window.ABCJS.plugin = new window.ABCJS.Plugin();

jQuery(function($) {
	"use strict";
window.ABCJS.plugin.start = function() {
	var body = $("body");
  this.errors="";
  var elems = this.getABCContainingElements(body);
	if (this.debug) {
		for (var i = 0; i < elems.length; i++) {
			var str = "Possible ABC found (" + (i+1) + " of " + elems.length + "):\n\n" + elems[i].innerText;
			alert(str);
		}
	}
  var self = this;
  var divs = elems.map(function(i,elem){
      return self.convertToDivs(elem);
    });
  this.auto_render = (divs.size()<=this.auto_render_threshold);
  divs.each(function(i,elem){
      self.render(elem,$(elem).data("abctext"));
    });
};

// returns a jquery set of the descendants (including self) of elem which have a text node which matches "X:"
window.ABCJS.plugin.getABCContainingElements = function(elem) {
  var results = $();
  var includeself = false; // whether self is already included (no need to include it again)
  var self = this;
  // TODO maybe look to see whether it's even worth it by using textContent ?
  $(elem).contents().each(function() {
      if (this.nodeType === 3 && !includeself) {
	if (this.nodeValue.match(/^\s*X:/m)) {
		if (this.parentNode.tagName.toLowerCase() !== 'textarea') {
		  results = results.add($(elem));
		  includeself = true;
		}
	}
      } else if (this.nodeType===1 && !$(this).is("textarea")) {
	results = results.add(self.getABCContainingElements(this));
      }
    });
  return results;
};

// in this element there are one or more pieces of abc 
// (and it is not in a subelem)
// for each abc piece, we surround it with a div, store the abctext in the 
// div's data("abctext") and return an array 
window.ABCJS.plugin.convertToDivs = function (elem) {
  var self = this;
  var contents = $(elem).contents();
  var abctext = "";
  var abcdiv = null;
  var inabc = false;
  var brcount = 0;
  var results = $();
  contents.each(function(i,node){
      if (node.nodeType===3 && !node.nodeValue.match(/^\s*$/)) {
	brcount=0;
	var text = node.nodeValue;
	if (text.match(/^\s*X:/m)) {
	  inabc=true;
	  abctext="";
	  abcdiv=$("<div class='"+self.text_classname+"'></div>");
	  $(node).before(abcdiv);
	  if (self.hide_abc) {
	    abcdiv.hide();
	  } 
	}
	if (inabc) {
	  abctext += text.replace(/\n+/,"");
	  abcdiv.append($(node));
	} 
      } else if (inabc && $(node).is("br")) {
	abctext += "\n";
	abcdiv.append($(node));
	brcount++;
	  } else if (inabc && node.nodeType === 1) {
		  abctext += "\n";
		 	abcdiv.append($(node));
		  // just swallow this.
      } else if (inabc) { // second br or whitespace textnode
	inabc = false;
	brcount=0;
	abctext = abctext.replace(/\n+/,"\n"); // get rid of extra blank lines
	abcdiv.data("abctext",abctext);
	results = results.add(abcdiv);
      }
    });
  if (inabc) {
	  abctext = abctext.replace(/\n+$/,"\n").replace(/^\n+/,"\n"); // get rid of extra blank lines
    abcdiv.data("abctext",abctext);
    results = results.add(abcdiv);
  }
  return results.get();
};

window.ABCJS.plugin.render = function (contextnode, abcstring) {
  var abcdiv = $("<div class='"+this.render_classname+"'></div>");
  if (this.render_before) {
    $(contextnode).before(abcdiv);
  } else {
    $(contextnode).after(abcdiv);
  }
  var self = this;
  try {
	  if (this.debug) {
		  alert("About to render:\n\n" + abcstring);
	  }
    var tunebook = new ABCJS.TuneBook(abcstring);
    var abcParser = new ABCJS.parse.Parse();
    abcParser.parse(tunebook.tunes[0].abc);
    var tune = abcParser.getTune();

    var doPrint = function() {
	try {
	  var paper = Raphael(abcdiv.get(0), 800, 400);
	  var engraver_controller = new ABCJS.write.EngraverController(paper,self.render_options);
	  engraver_controller.engraveABC(tune);
	} catch (ex) { // f*** internet explorer doesn't like innerHTML in weird situations
	  // can't remember why we don't do this in the general case, but there was a good reason
	  abcdiv.remove();
	  abcdiv = $("<div class='"+self.render_classname+"'></div>");
	  paper = Raphael(abcdiv.get(0), 800, 400);
	  engraver_controller = new ABCJS.write.EngraverController(paper);
	  engraver_controller.engraveABC(tune);
	  if (self.render_before) {
	    $(contextnode).before(abcdiv);
	  } else {
	    $(contextnode).after(abcdiv);
	  }
	}
	if (ABCJS.MidiWriter && self.show_midi) {
	  var midiwriter = new ABCJS.midi.MidiWriter(abcdiv.get(0),self.midi_options);
	  midiwriter.writeABC(tune);
	}
      };

    var showtext = "<a class='abcshow' href='#'>"+this.show_text+(tune.metaText.title||"untitled")+"</a>";
    
    if (this.auto_render) {
      doPrint();
    } else {
      var showspan = $(showtext);
      showspan.click(function(){
	  doPrint();
	  showspan.hide();
	  return false;
	});
      abcdiv.before(showspan);
    }

    } catch (e) {
    this.errors+=e;
   }
};


// There may be a variable defined which controls whether to automatically run the script. If it isn't
// there then it will throw an exception, so we'll catch it here.
	var autostart = true;
	try {
		autostart = abcjs_plugin_autostart;
	} catch (ex) {
		// It's ok to fail, and we don't have to do anything.
	}
	if (autostart)
		ABCJS.plugin.start();
});
