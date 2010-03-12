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
  
  this.parserparams = params["parser_params"] || {};

  this.oldt = "";
  this.bReentry = false;
  this.updateRendering();
}

ABCEditor.prototype.updateRendering = function() {
  if (this.bReentry)
    return; // TODO is this likely?
  this.bReentry = true;
  var t = this.editarea.getString();
  if (t===this.oldt) {
    this.updateSelection();
    this.bReentry = false; 
    return;
  } else {
    this.oldt = t;
  }
  // clear out any old tune
  this.div.innerHTML = "";
  var tunebook = new AbcTuneBook(t);
  var abcParser = new AbcParse(this.parserparams);
  abcParser.parse(tunebook.tunes[0].abc); //TODO handle multiple tunes
  var tune = abcParser.getTune();
  var paper = Raphael(this.div, 800, 400);
  this.printer = new ABCPrinter(paper);
  this.printer.printABC(tune);
  if (ABCMidiWriter && this.mididiv) {
    this.mididiv.innerHTML="";
    var midiwriter = new ABCMidiWriter(this.mididiv);
    midiwriter.writeABC(tune);
  }
  if (this.warningsdiv) {
    var warnings = abcParser.getWarnings();
    this.warningsdiv.innerHTML = (warnings) ? warnings.join("<br />") : "No errors";
  }
  this.printer.addSelectListener(this);
  this.updateSelection();
  this.bReentry = false;
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

ABCEditor.prototype.fireChanged = function() {
  this.updateRendering();
};

ABCEditor.prototype.highlight = function(abcelem) {
  this.editarea.setSelection(abcelem.startChar, abcelem.endChar);
};
