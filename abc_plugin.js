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

var abc_plugin = {
 show_midi : true,
 hide_abc : false
};

$(document).ready(start_abc);

function start_abc() {
  // var userlogout = $("a.mainmenu:last").text();
//   if (userlogout == "Connexion") {
//     //GM_log("User not logged in");
//     return;
//   }
//   var username = /\[\s(.*)\s\]/.exec(userlogout)[1];
  
//   if (username != "Tirno") {
//     return;
//   }
  abc_plugin_errors="";
  getABCContainingElements($("body")).each(function(i,elem){
	ABCConversion(elem);
    });
  
}

function getABCText(elem) {
  return elem.textContent || elem.innerText || elem.nodeValue || "";
}

// returns a jquery set of the descendants (including self) of elem which have a text node which matches "X:"
function getABCContainingElements(elem) {
  var results = $();
  var includeself = false;
  $(elem).contents().each(function() { 
      if (this.nodeType == 3 && !includeself) {
	if (this.nodeValue.match(/^\s*X:/m)) {
	  results = results.add($(elem));
	  includeself = true;
	}
      } else if (this.nodeType==1) {
	results = results.add(getABCContainingElements(this));
      }
    });
  return results;
}

function findABC(currentset) {
  var cont = false;
  var newcurrentset = currentset.map(function(i,elem){
      var children = $(elem).children().filter(function() {
          var str = getABCText(this);
	  return getABCText(this).match(/^\s*X:/m);
	});
      if (children.length===0) {
	return elem;
      } else {
	cont = true;
	return children.get();
      }
    });
  return (cont) ? findABC(newcurrentset) : currentset;
}

// in this element there are one or more pieces of abc 
// (and it is not in a subelem)
function ABCConversion(elem) {
  var contents = $(elem).contents();
  var abctext = "";
  var abcspan = null;
  var inabc = false;
  var brcount = 0;
  contents.each(function(i,node){
      if (node.nodeType==3 && !node.nodeValue.match(/^\s*$/)) {
	brcount=0;
	var text = node.nodeValue;
	if (text.match(/^\s*X:/m)) {
	  inabc=true;
	  abctext="";
	  abcspan=$("<span></span>");
	  $(node).before(abcspan);
	  if (abc_plugin.hide_abc) {
	    abcspan.hide();
	  } 
	}
	if (inabc) {
	  abctext += text.replace(/\n$/,"").replace(/^\n/,"");
	  abcspan.append($(node));
	} 
      } else if (inabc && $(node).is("br") && brcount==0) {
	abctext += "\n";
	abcspan.append($(node));
	brcount++;
      } else if (inabc) { // second br or whitespace textnode
	inabc = false;
	brcount=0;
	insertScoreBefore(node,abctext);
      }
    });
  if (inabc) {
    appendScoreTo(elem,abctext);
  }
}

function appendScoreTo(node,abcstring) {
  var abcdiv = $("<div></div>");
  $(node).append(abcdiv);
  addScore(abcdiv,abcstring);
}

function insertScoreBefore(node, abcstring) {
  var abcdiv = $("<div></div>");
  $(node).before(abcdiv);
  addScore(abcdiv,abcstring);
}

function addScore(abcdiv, abcstring) {
  try {
    var tunebook = new AbcTuneBook(abcstring);
    var abcParser = new AbcParse();
    abcParser.parse(tunebook.tunes[0].abc);
    var tune = abcParser.getTune();

    try {
      var paper = Raphael(abcdiv.get(0), 800, 400);
      var printer = new ABCPrinter(paper);
      printer.printABC(tune);
    } catch (ex) { // f*** internet explorer doesn't like innerHTML in weird situations
      // can't remember why we don't do this in the general case, but there was a good reason
      var node = abcdiv.parent();
      abcdiv.remove();
      abcdiv = $("<div></div>");
      var paper = Raphael(abcdiv.get(0), 800, 400);
      var printer = new ABCPrinter(paper);
      printer.printABC(tune);
      $(node).before(abcdiv);
    }
    if (ABCMidiWriter && abc_plugin.show_midi) {
      midiwriter = new ABCMidiWriter(abcdiv.get(0));
      midiwriter.writeABC(tune);
    }
  } catch (e) {
    abc_plugin_errors+=e;
  }
}
