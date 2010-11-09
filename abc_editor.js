function EditArea(textareaid) {
  this.textarea = document.getElementById(textareaid); 
}

EditArea.prototype.addSelectionListener = function(listener) {
  this.textarea.onmousemove = function() {
    listener.fireSelectionChanged();
  }
};

EditArea.prototype.addChangeListener = function(listener) {
  this.changelistener = listener;
  this.textarea.onkeyup = function() {
    listener.fireChanged();
  }
  this.textarea.onmouseup = function() {
    listener.fireChanged();
  }
  this.textarea.onchange = function() {
    listener.fireChanged();
  }
};

//TODO won't work under IE?
EditArea.prototype.getSelection = function() {
  return {start: this.textarea.selectionStart, end: this.textarea.selectionEnd};
};

EditArea.prototype.setSelection = function(start, end) {
  this.textarea.setSelectionRange(start,end);
  this.textarea.focus();
};

EditArea.prototype.getString = function() {
  return this.textarea.value;
};

EditArea.prototype.setString = function(str) {
  this.textarea.value = str;
  if (this.changelistener) {
    this.changelistener.fireChanged();
  }
};

EditArea.prototype.getElem = function() {
  return this.textarea;
} 

function ABCEditor(editarea, params) {
  if (typeof editarea == "string") {
    this.editarea = new EditArea(editarea);
  } else {
    this.editarea = editarea;
  }
  this.editarea.addSelectionListener(this);
  this.editarea.addChangeListener(this);

  if (params["canvas_id"]) {
    this.div = document.getElementById(params["canvas_id"]);
  } else {
    this.div = document.createElement("DIV");
    this.editarea.getElem().parentNode.insertBefore(this.div, this.editarea.getElem());
  }
  
  if (params["generate_midi"] || params["midi_id"]) {
    if (params["midi_id"]) {
      this.mididiv = document.getElementById(params["midi_id"]);
    } else {
      this.mididiv = this.div;
    }
  }
  
  if (params["generate_warnings"] || params["warnings_id"]) {
    if (params["warnings_id"]) {
      this.warningsdiv = document.getElementById(params["warnings_id"]);
    } else {
      this.warningsdiv = this.div;
    }
  }
  
  this.parserparams = params["parser_options"] || {};
  this.midiparams = params["midi_options"] || {};
  this.printerparams = params["render_options"] || {};
  
  if (params["gui"]) {
    this.target = document.getElementById(editarea);
  } 
  this.oldt = "";
  this.bReentry = false;
  this.parseABC();
  this.modelChanged();
}

ABCEditor.prototype.modelChanged = function() {

  if (this.bReentry)
    return; // TODO is this likely? maybe, if we rewrite abc immediately w/ abc2abc
  this.bReentry = true;
  this.timerId = null;
  this.div.innerHTML = "";
  var paper = Raphael(this.div, 800, 400);
  this.printer = new ABCPrinter(paper, this.printerparams);
  this.printer.printABC(this.tune);
  if (ABCMidiWriter && this.mididiv) {
    (this.mididiv != this.div) && (this.mididiv.innerHTML="");
    var midiwriter = new ABCMidiWriter(this.mididiv,this.midiparams);
    midiwriter.addListener(this.printer);
    midiwriter.writeABC(this.tune);
  }
  if (this.warningsdiv) {
    this.warningsdiv.innerHTML = (this.warnings) ? this.warnings.join("<br />") : "No errors";
  } 
  if (this.target) {
    var textprinter = new ABCTextPrinter(this.target, true);
    textprinter.printABC(this.tune);
  }
  this.printer.addSelectListener(this);
  this.updateSelection();
  this.bReentry = false;
};

// return true if the model has changed
ABCEditor.prototype.parseABC = function() {
  var t = this.editarea.getString();
  if (t===this.oldt) {
    this.updateSelection();
    return false;
  }
  
  this.oldt = t;
  var tunebook = new AbcTuneBook(t);
  var abcParser = new AbcParse(this.parserparams);
  abcParser.parse(tunebook.tunes[0].abc); //TODO handle multiple tunes
  this.tune = abcParser.getTune();
  this.warnings = abcParser.getWarnings();
};

ABCEditor.prototype.updateSelection = function() {
  var selection = this.editarea.getSelection();
  try {
    this.printer.rangeHighlight(selection.start, selection.end);
  } catch (e) {} // maybe printer isn't defined yet?
};

ABCEditor.prototype.fireSelectionChanged = function() {
  this.updateSelection();
};

// call when abc text is changed and needs re-parsing
ABCEditor.prototype.fireChanged = function() {
  if (this.bIsPaused)
    return;
  if (this.parseABC()) {
    var self = this;
    if (this.timerId)	// If the user is still typing, cancel the update
      clearTimeout(this.timerId);
    this.timerId = setTimeout(function () {
      self.modelChanged();
    }, 300);	// Is this a good comprimise between responsiveness and not redrawing too much?  
  }
};

ABCEditor.prototype.highlight = function(abcelem) {
  this.editarea.setSelection(abcelem.startChar, abcelem.endChar);
};

ABCEditor.prototype.pause = function(shouldPause) {
	this.bIsPaused = shouldPause;
	if (!shouldPause)
		this.updateRendering();
};
