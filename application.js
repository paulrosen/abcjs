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
/*extern abcParser, EditArea, editArea, writeOneTune */
/*global abc_contents_output */

function EditArea(id) {
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

editArea = new EditArea('abc');

/////////////////////////////////////////////////////////////////////////////////

var abcParser = null;
var printer = null;
var paper = null;

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

function abc_mousemove() {
  var selection = editArea.getSelection();
  try {
  printer.rangeHighlight(selection.start, selection.end);
  } catch (e) {}
}

function writeOneTune(tune, warnings, count) {
	if (warnings) {
	  if (warnings.join) {
		warnings = warnings.join("<br />");
		$('warnings').innerHTML = warnings;
	  } else {
	    throw warnings;
	  }
	}
	else
		$('warnings').innerHTML = 'No errors';
	var canvas = $("canvas"+count);
	paper = Raphael(canvas, 1500, 1500);
	printer = new ABCPrinter(paper);
	printer.printABC(tune);
        if (ABCMidiWriter) {
	  midiwriter = new ABCMidiWriter(canvas);
	  midiwriter.writeABC(tune);
	}
	printer.addSelectListener(editArea);
	abc_mousemove();
	}

var bReentry = false;
var oldt ="";
function abc_keystroke()
{
	if (bReentry)
		return;
	bReentry = true;
	var t = editArea.get();
	if (t===oldt) {
	  abc_mousemove();
	  bReentry = false; 
	  return;
	} else {
	  oldt = t;
	}
	// clear out any old tune
	var done = false;
	var i = 0;
	while (!done) {
		var el = $("canvas"+i);
		if (el)
			el.innerHTML = "";
		else
			done = true;
		i++;
	}

	processAbc({ tunebook: t, fnCallback: writeOneTune });

	// Put the click handlers on all the music we just printed.
//	var paths = $$('path');
//	var click = function() {
//		var x = this.getAttribute('abc-pos');
//		//$(this).setStyle({ backgroundColor: '#ff0000' });
//		if (x && !x.startsWith('-1')) {
//			var arr = x.split(',');
//			editArea.setSelection(parseInt(arr[0])-1, parseInt(arr[1]));
//		}
//	};
//	paths.each(function(path) {
//		path.onclick = click;
//	});

	bReentry = false;
}

function redrawCurrent()
{
	abc_keystroke();
}

function pickTuneAndPdf(pdf_id, folder, abc_file)
{
	var sel = abc_contents_output[abc_file];
	$("persistent_url").innerHTML = "http://" + window.location.host + "/comparison?tune=" + abc_file;
	var filename = abc_file.substring(0, abc_file.lastIndexOf('.'));
	var pdf_file = "/testdata/" + folder + '/' + filename.gsub('\\+', '%2B') + '.ps';
	$("abcm2ps_output").innerHTML = sel.out.gsub(' ', '&nbsp;').gsub('\n', '<br />');

	editArea.set(sel.abc);
	abc_keystroke();
	var pdf = $(pdf_id);
	pdf.innerHTML = "<embed src='" + pdf_file + "' height='100%' width='100%'>";
}

function pickTune(value)
{
	var sel = abc_contents_output[value];
	editArea.set(sel);
	//editArea.set(value.gsub('`n', '\n').gsub('`a', "'"));
	abc_keystroke();
}

function createPDF()
{
	var t = editArea.get();
	new Ajax.Updater('ajax_status', '/tunes/createPdf', 
	{parameters: {abc: t, authenticity_token: window.authenticity_token}});
}

function createMIDI()
{
	var t = editArea.get();
	new Ajax.Updater('ajax_status', '/tunes/createMidi', 
	{parameters: {abc: t, authenticity_token: window.authenticity_token}});
}

function save()
{
	var t = editArea.get();
	new Ajax.Updater('ajax_status', '/tunes/save', 
	{parameters: {abc: t, authenticity_token: window.authenticity_token}});
}

function magnify(value)
{
//	DrawNotation.prototype.setCssZoom(value);
//	abc_keystroke();
}

function saveCurrentToTest()
{
	var onSuccess = function(resp) {
		var arr = resp.responseText.split('/');
		var fname = arr[arr.length-1];
		fname = fname.split(' ')[0];
		$('paul_failed_tests').appendChild(new Element('option').innerHTML = fname);
		abc_contents_output[fname] = { abc: editArea.get(), out: "Unknown: reload page to see this data." };
	};
	var t = editArea.get();
	new Ajax.Updater('ajax_status', '/tunes/save_test',
	{parameters: {abc: t, authenticity_token: window.authenticity_token}, onSuccess: onSuccess});
}
/////////////////////////////////////////////////////////////////////////////////

var playEmbedded = null;
window.onload = function() {
//	playEmbedded = new PlayEmbedded();
};

function play()
{
//	var t = editArea.get();
//	if (abcParser === null)
//		abcParser = new AbcParse();
//	abcParser.parse(t);
//	//selection = editArea.getSelection();
//	playEmbedded.play(abcParser.getTune());
}

function stopPlay()
{
//	playEmbedded.stop();
}

//function doScale() {
//	var paper = Raphael(document.getElementById("canvas"), 1000, 600);
//	var font = paper.getFont("Maestro", 500);
//	scale_font(font, 30, paper);
//}

function click()
{
	abc_keystroke();
}

function selectNote(div)
{
	var pos = div.getAttribute("charPos");
	selection.start = pos;
	if (pos !== undefined)
	{
		editArea.setSelection(parseInt(pos), parseInt(pos)+1);
	}
	abc_keystroke();
}

function doGradeTest(url, failed_tests, passed_tests, pass) {
	var failed = $(failed_tests);
	var passed = $(passed_tests);
	var selection = pass ? failed.options[failed.selectedIndex] : passed.options[passed.selectedIndex];
	var value = selection.innerHTML;
	var num_success = parseInt($('success_count').innerHTML);
	var num_fail = parseInt($('fail_count').innerHTML);
	selection.remove();
	if (pass) {
		passed.appendChild(selection);
		num_success++;
		num_fail--;
	}
	else {
		failed.appendChild(selection);
		num_success--;
		num_fail++;
	}

	$('success_count').innerHTML = num_success;
	$('fail_count').innerHTML = num_fail;

	new Ajax.Request(url, {parameters: {pass: pass, value: value, authenticity_token: window.authenticity_token}});
}

var lint = new AbcParserLint();

function lintOneTune(tune, warnings, count) {
	if (tune === null)
		return warnings;
	var output = lint.lint(tune, warnings);
	return output;
}

function showRegression() {
	var t = editArea.get();
	var ret = processAbc({ tunebook: t, fnCallback: lintOneTune });
	$("warnings").innerHTML = ret.join('<br />').gsub('\n', '<br />').gsub('\t', '&nbsp;&nbsp;&nbsp;&nbsp;');
}

function runRegressionTest() {
	$("warnings").innerHTML = "";
	var failList = "";
	Object.keys(abc_contents_output).each(function(filename) {
		var contents = abc_contents_output[filename].abc;
		var ret = processAbc({ tunebook: contents, fnCallback: lintOneTune });
		ret = ret.join('\n');
		var onSuccess = function(resp) {
			var origFile = resp.responseText;
			var pass = (ret === origFile);
			if (pass)
				$("warnings").innerHTML = filename + ":  pass<br />" + failList;
			else {
				failList = filename + ":  fail<br />" + failList;
				$("warnings").innerHTML = failList;
			}
		};
		new Ajax.Request("/tunes/get_file", { onSuccess: onSuccess, parameters: { authenticity_token: window.authenticity_token, file: "regression/" + filename + ".out" }});
	});
}

function createRegressionData() {
//	var x = confirm("This will overwrite all the regression data that is currently saved. Do you want to continue?");
//	if (x === false)
//		return;

	var count = 1;
	Object.keys(abc_contents_output).each(function(filename) {
		var contents = abc_contents_output[filename].abc;
		var ret = processAbc({ tunebook: contents, fnCallback: lintOneTune });
		ret = ret.join('\n');
		new Ajax.Updater('warnings', "/tunes/write_regression_data", { parameters: { authenticity_token: window.authenticity_token, filename: filename, data: ret, count: count++ }});
	});
}

function profileParser() {
	var t = editArea.get();
	for (var i = 1; i <= 20; i++) {
		var nothing = function() { $('warnings').innerHTML = "Pass: " + i; };
		processAbc({ tunebook: t, fnCallback: nothing });
	}
}

function profileRegression() {
	var t = editArea.get();
	for (var i = 1; i <= 20; i++) {
		$('warnings').innerHTML = "running...";
		processAbc({ tunebook: t, fnCallback: lintOneTune });
		$('warnings').innerHTML = "finished";
	}
}
