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

if (!window.ABCJS)
	window.ABCJS = {};

window.ABCJS.Plugin = function() {
	var is_user_script = false;
	try {
		is_user_script = abcjs_is_user_script;
	} catch (ex) {
	}
  this.show_midi = !is_user_script || this.$.browser.mozilla;	// midi currently only works in Firefox, so in the userscript, don't complicate it.
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
};

window.ABCJS.Plugin.prototype.start = function(jq) {
	this.$ = jq;
	var body = jq("body");
  this.errors="";
  var elems = this.getABCContainingElements(this.$("body"));
  var self = this;
  var divs = elems.map(function(i,elem){
      return self.convertToDivs(elem);
    });
  this.auto_render = (divs.size()<=this.auto_render_threshold);
  divs.each(function(i,elem){
      self.render(elem,self.$(elem).data("abctext"));
    });
};

// returns a jquery set of the descendants (including self) of elem which have a text node which matches "X:"
window.ABCJS.Plugin.prototype.getABCContainingElements = function(elem) {
  var results = this.$();
  var includeself = false; // whether self is already included (no need to include it again)
  var self = this;
  // TODO maybe look to see whether it's even worth it by using textContent ?
  this.$(elem).contents().each(function() { 
      if (this.nodeType == 3 && !includeself) {
	if (this.nodeValue.match(/^\s*X:/m)) {
		if (this.parentNode.tagName.toLowerCase() !== 'textarea') {
		  results = results.add(self.$(elem));
		  includeself = true;
		}
	}
      } else if (this.nodeType==1 && !self.$(this).is("textarea")) {
	results = results.add(self.getABCContainingElements(this));
      }
    });
  return results;
};

// in this element there are one or more pieces of abc 
// (and it is not in a subelem)
// for each abc piece, we surround it with a div, store the abctext in the 
// div's data("abctext") and return an array 
window.ABCJS.Plugin.prototype.convertToDivs = function (elem) {
  var self = this;
  var contents = this.$(elem).contents();
  var abctext = "";
  var abcdiv = null;
  var inabc = false;
  var brcount = 0;
  var results = this.$();
  contents.each(function(i,node){
      if (node.nodeType==3 && !node.nodeValue.match(/^\s*$/)) {
	brcount=0;
	var text = node.nodeValue;
	if (text.match(/^\s*X:/m)) {
	  inabc=true;
	  abctext="";
	  abcdiv=self.$("<div class='"+self.text_classname+"'></div>");
	  self.$(node).before(abcdiv);
	  if (self.hide_abc) {
	    abcdiv.hide();
	  } 
	}
	if (inabc) {
	  abctext += text.replace(/\n+/,"");
	  abcdiv.append(self.$(node));
	} 
      } else if (inabc && self.$(node).is("br")) {
	abctext += "\n";
	abcdiv.append(self.$(node));
	brcount++;
	  } else if (inabc && node.nodeType === 1) {
		  abctext += "\n";
		 	abcdiv.append(self.$(node));
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

window.ABCJS.Plugin.prototype.render = function (contextnode, abcstring) {
  var abcdiv = this.$("<div class='"+this.render_classname+"'></div>");
  if (this.render_before) {
    this.$(contextnode).before(abcdiv);
  } else {
    this.$(contextnode).after(abcdiv);
  }
  var self = this;
  try {
    var tunebook = new ABCJS.TuneBook(abcstring);
    var abcParser = new ABCJS.parse.Parse();
    abcParser.parse(tunebook.tunes[0].abc);
    var tune = abcParser.getTune();

    var doPrint = function() {
	try {
	  var paper = Raphael(abcdiv.get(0), 800, 400);
	  var printer = new ABCJS.write.Printer(paper,self.render_options);
	  printer.printABC(tune);
	} catch (ex) { // f*** internet explorer doesn't like innerHTML in weird situations
	  // can't remember why we don't do this in the general case, but there was a good reason
	  abcdiv.remove();
	  abcdiv = this.$("<div class='"+self.render_classname+"'></div>");
	  paper = Raphael(abcdiv.get(0), 800, 400);
	  printer = new ABCJS.write.Printer(paper);
	  printer.printABC(tune);
	  if (self.render_before) {
	    this.$(contextnode).before(abcdiv);
	  } else {
	    this.$(contextnode).after(abcdiv);
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
      var showspan = this.$(showtext);
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

window.ABCJS.plugin = new window.ABCJS.Plugin();

// There may be a variable defined which controls whether to automatically run the script. If it isn't
// there then it will throw an exception, so we'll catch it here.
$(document).ready(function() {
	var autostart = true;
	try {
		autostart = abcjs_plugin_autostart;
	} catch (ex) {
		// It's ok to fail, and we don't have to do anything.
	}
	if (autostart)
		jQuery(document).ready(ABCJS.plugin.start(jQuery));
})();
