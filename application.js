//    application.js: Interface between a web page and the abc javascript processor.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
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
 
/*global $, Ajax, Element */
/*global window, confirm */
/*global AbcParse, AbcTuneBook, AbcParserLint, PlayEmbedded, DrawNotation, ABCPrinter, Raphael */
/*extern abcParser, pickTunebook, selectTune */
/*global abc_contents_output */
 
/*function EditArea(id) {
	this._id = id;
 
	this.set = function(str)
	{
		//editAreaLoader.setValue(id, str);
		$(this._id).value =str;
	};
	
	this.get = function()
	{
		return $(this._id).value;
	};
	
	this.getSelection = function()
	{
		//selection = editAreaLoader.getSelectionRange('abc');
		return {start: $(this._id).selectionStart, end: $(this._id).selectionEnd};
	};
	
	this.setSelection = function(start, end)
	{
		//editAreaLoader.setSelectionRange('abc', pos, parseInt(pos)+1);
		$(this._id).setSelectionRange(start,end);
		$(this._id).focus();
	};
 
	this.highlight = function (abcelem)
	{
	  this.setSelection(abcelem.startChar, abcelem.endChar);
	};
}
 
editArea = new EditArea('abc');*/
 
/////////////////////////////////////////////////////////////////////////////////
 
var abcParser = null;
//var printer = null;
//var paper = null;
 
/////////////////////////////////////////////////////////////////////////////////
 
// This function takes a string representing an ABC tune book, and a callback routine, and it parses the string
// and calls the callback routine for each tune it finds. If a tune is parsed in error, then the callback is called with null.
function processAbc(params) {
	var strAbc = params.tunebook;
	var fnCallback = params.fnCallback;
	var ret = [];
	try {
		var tunebook = new AbcTuneBook(strAbc);
		if (abcParser === null)
			abcParser = new AbcParse();
 
		for (var i = 0; i < tunebook.tunes.length; i++) {
			abcParser.parse(tunebook.tunes[i].abc);
			var tune = abcParser.getTune();
			var warnings = abcParser.getWarnings();
			ret.push(fnCallback(tune, warnings, i));
		}
	} catch (e) {
		ret.push(fnCallback(null, e, null));
	}
	return ret;
}
 
/////////////////////////////////////////////////////////////////////////////////
 
//function abc_mousemove() {
//  var selection = editArea.getSelection();
//  try {
//  printer.rangeHighlight(selection.start, selection.end);
//  } catch (e) {}
//}
 
//function writeOneTune(tune, warnings, count) {
//	if (warnings) {
//	  if (warnings.join) {
//		warnings = warnings.join("<br />");
//		$('warnings').innerHTML = warnings;
//	  } else {
//	    throw warnings;
//	  }
//	}
//	else
//		$('warnings').innerHTML = 'No errors';
//	var canvas = $("canvas"+count);
//	paper = Raphael(canvas, 1500, 1500);
//	printer = new ABCPrinter(paper);
//	printer.printABC(tune);
//	printer.addSelectListener(editArea);
//	abc_mousemove();
//	}
 
//var bReentry = false;
//var oldt ="";
//function abc_keystroke()
//{
//	if (bReentry)
//		return;
//	bReentry = true;
//	var t = editArea.get();
//	if (t===oldt) {
//	  abc_mousemove();
//	  bReentry = false;
//	  return;
//	} else {
//	  oldt = t;
//	}
//	// clear out any old tune
//	var done = false;
//	var i = 0;
//	while (!done) {
//		var el = $("canvas"+i);
//		if (el)
//			el.innerHTML = "";
//		else
//			done = true;
//		i++;
//	}
//
//	processAbc({ tunebook: t, fnCallback: writeOneTune });
//
//	bReentry = false;
//}
 
function selectFirstTune() {
	if (gTunes.length > 0) {
		var tune = gTunes[0];
		abc_editor.editarea.setString(tune.abc);
//		editArea.set(tune.abc);
//		abc_keystroke();
	}
}
 
function selectTune(value)
{
	abc_editor.editarea.setString("");
//	editArea.set("");
//	abc_keystroke();
	var id = parseInt(value);
	gTunes.each(function(tune) {
		if (tune.id === id) {
			abc_editor.editarea.setString(tune.abc);
//			editArea.set(tune.abc);
//			abc_keystroke();
			return;
		}
	});
}
 
/////////////////////////////////////////////////////////////////////////////////
 
//function selectNote(div)
//{
//	var pos = div.getAttribute("charPos");
//	selection.start = pos;
//	if (pos !== undefined)
//	{
//		editArea.setSelection(parseInt(pos), parseInt(pos)+1);
//	}
//	abc_keystroke();
//}
 
