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

  this.oldt = "";
  this.bReentry = false;
  this.updateRendering();
}

ABCEditor.prototype.updateRendering = function() {
  if (this.bIsPaused)
    return;
  if (this.bReentry)
    return; // TODO is this likely?
  this.bReentry = true;
  var t = this.editarea.getString();
  if (t===this.oldt) {
    this.updateSelection();
    this.bReentry = false; 
    return;
  }

  // only render once the user has quit typing, so wait a little while and do the update on a timer.
  var This = this;
  var doRendering = function() {
	  This.timerId = null;
	  t = This.editarea.getString();	// need to get the text again because it might have changed since the callback.
	  This.oldt = t;
	  // clear out any old tune
	  This.div.innerHTML = "";
	  var tunebook = new AbcTuneBook(t);
	  var abcParser = new AbcParse(This.parserparams);
	  abcParser.parse(tunebook.tunes[0].abc); //TODO handle multiple tunes
	  var tune = abcParser.getTune();
	  var paper = Raphael(This.div, 800, 400);
	  This.printer = new ABCPrinter(paper);
	  This.printer.printABC(tune);
	  if (ABCMidiWriter && This.mididiv) {
		(This.mididiv != This.div) && (This.mididiv.innerHTML="");
		var midiwriter = new ABCMidiWriter(This.mididiv,This.midiparams);
		midiwriter.writeABC(tune);
	  }
	  if (This.warningsdiv) {
		var warnings = abcParser.getWarnings();
		This.warningsdiv.innerHTML = (warnings) ? warnings.join("<br />") : "No errors";
	  }
	  This.printer.addSelectListener(This);
	  This.updateSelection();
	  This.bReentry = false;
  };
  
	if (this.timerId)	// If the user is still typing, cancel the update
		clearTimeout(this.timerId);
	this.timerId = setTimeout(doRendering, 300);	// Is this a good comprimise between responsiveness and not redrawing too much?
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

ABCEditor.prototype.pause = function(shouldPause) {
	this.bIsPaused = shouldPause;
	if (!shouldPause)
		this.updateRendering();
};
