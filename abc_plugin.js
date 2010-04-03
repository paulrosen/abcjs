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
 show_midi : true
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
  findABC($("body")).each(function(i,elem){
	ABCConversion(elem);
    });
  
}

function findABC(currentset) {
  var cont = false;
  var newcurrentset = currentset.map(function(i,elem){
      var children = $(elem).children().filter(function() {
	  return $(this).text().match(/^\s*X:/m);
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
  var inabc = false;
  contents.each(function(i,node){
      var text = $(node).text();
      if (inabc) {
	if (node.nodeType==3 && !text.match(/^\s*$/)) {
	  abctext += text.replace(/\n$/,"").replace(/^\n/,"");
	} else if($(node).is("br")) {
	  abctext += "\n";
	} else {
	  inabc = false;
	  insertScoreBefore(node,abctext);
	}
      } else {
	if (text.match(/^X:/m)) {
	  inabc=true;
	  abctext=text.replace(/\n$/,"").replace(/^\n/,"");
	}
      }
    });
  if (inabc) {
    insertScoreBefore(contents.last(),abctext);
  }
}

function insertScoreBefore(node, abcstring) {
  try {
    var abcdiv = $("<div></div>");
    $(node).before(abcdiv);
    var tunebook = new AbcTuneBook(abcstring);
    var abcParser = new AbcParse();
    abcParser.parse(tunebook.tunes[0].abc);
    var tune = abcParser.getTune();
    var paper = Raphael(abcdiv.get(0), 800, 400);
    var printer = new ABCPrinter(paper);
    printer.printABC(tune);
    if (ABCMidiWriter && abc_plugin.show_midi) {
      midiwriter = new ABCMidiWriter(abcdiv.get(0));
      midiwriter.writeABC(tune);
    }
  } catch (e) {
    abc_plugin_errors+=e;
  }
}
