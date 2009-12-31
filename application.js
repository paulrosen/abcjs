// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/*global $, $$, Class, Ajax, Element */
/*global window, confirm */
/*global ParseAbc, AbcTuneBook, AbcParserLint, PlayEmbedded, DrawNotation, ABCPrinter, Raphael */
/*extern abcParser, EditArea, editArea, writeOneTune */
/*global abc_contents_output */

EditArea = Class.create();

EditArea.prototype = {
	initialize: function (id) {
		this._id = id;
	},
	
	_id : '',
	
	set : function(str)
	{
		//editAreaLoader.setValue(id, str);
		$(this._id).value =str;
	},
	
	get : function()
	{
		return $(this._id).value;
	},
	
	getSelection : function()
	{
		//selection = editAreaLoader.getSelectionRange('abc');
		return {start: $(this._id).selectionStart, end: $(this._id).selectionEnd};
	},
	
	setSelection : function(start, end)
	{
		//editAreaLoader.setSelectionRange('abc', pos, parseInt(pos)+1);
		$(this._id).setSelectionRange(start,end);
		$(this._id).focus();
	},
	highlight : function (abcelem)
	{
	  this.setSelection(abcelem.startChar, abcelem.endChar);
	}
};

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
			abcParser = new ParseAbc();

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
		warnings = warnings.join("<br />");
		$('warnings').update(warnings);
	}
	else
		$('warnings').update('No errors');
	var canvas = $("canvas"+count);
	paper = Raphael(canvas, 1500, 1500);
	printer = new ABCPrinter(paper);
	printer.printABC(tune);
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
	if (t==oldt) {
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
	$("persistent_url").update("http://" + window.location.host + "/comparison?tune=" + abc_file);
	var filename = abc_file.substring(0, abc_file.lastIndexOf('.'));
	var pdf_file = "/testdata/" + folder + '/' + filename.gsub('\\+', '%2B') + '.ps';
	$("abcm2ps_output").update(sel.out.gsub(' ', '&nbsp;').gsub('\n', '<br />'));

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
	DrawNotation.prototype.setCssZoom(value);
	abc_keystroke();
}

function saveCurrentToTest()
{
	var onSuccess = function(resp) {
		var arr = resp.responseText.split('/');
		var fname = arr[arr.length-1];
		fname = fname.split(' ')[0];
		$('paul_failed_tests').appendChild(new Element('option').update(fname));
		abc_contents_output[fname] = { abc: editArea.get(), out: "Unknown: reload page to see this data." };
	};
	var t = editArea.get();
	new Ajax.Updater('ajax_status', '/tunes/save_test',
	{parameters: {abc: t, authenticity_token: window.authenticity_token}, onSuccess: onSuccess});
}
/////////////////////////////////////////////////////////////////////////////////

var playEmbedded = null;
window.onload = function() {
	playEmbedded = new PlayEmbedded();
};

function play()
{
	var t = editArea.get();
	if (abcParser === null)
		abcParser = new ParseAbc();
	abcParser.parse(t);
	//selection = editArea.getSelection();
	playEmbedded.play(abcParser.getTune());
}

function stopPlay()
{
	playEmbedded.stop();
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
	selection['start'] = pos;
	if (pos != undefined)
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

	$('success_count').update(num_success);
	$('fail_count').update(num_fail);

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
	var x = confirm("This will overwrite all the regression data that is currently saved. Do you want to continue?");
	if (x === false)
		return;

	var count = 1;
	Object.keys(abc_contents_output).each(function(filename) {
		var contents = abc_contents_output[filename].abc;
		var ret = processAbc({ tunebook: contents, fnCallback: lintOneTune });
		ret = ret.join('\n');
		new Ajax.Updater('warnings', "/tunes/write_regression_data", { parameters: { authenticity_token: window.authenticity_token, filename: filename, data: ret, count: count++ }});
	});
}
