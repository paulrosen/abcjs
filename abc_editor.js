function ABCEditor(textareaid, divid) {
  this.textarea = document.getElementById(textareaid);
  if (divid) {
    this.div = document.getElementById(divid);
  } else {
    this.div = document.createElement("DIV");
    this.textarea.parentNode.insertBefore(this.div, this.textarea);
  }

  var self = this;
  this.textarea.onmousemove = function() {
    self.updateSelection();
  }
  this.textarea.onkeyup = function() {
    self.updateRendering();
  }

  this.oldt = "";
  this.bReentry = false;

  this.updateRendering();
}

ABCEditor.prototype.updateRendering = function() {
  if (this.bReentry)
    return; // TODO is this likely?
  this.bReentry = true;
  var t = this.getString();
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
  var abcParser = new AbcParse();
  abcParser.parse(tunebook.tunes[0].abc); //TODO handle multiple tunes
  var tune = abcParser.getTune();
  var paper = Raphael(this.div, 800, 400);
  this.printer = new ABCPrinter(paper);
  this.printer.printABC(tune);
  if (ABCMidiWriter) {
    midiwriter = new ABCMidiWriter(this.div);
    midiwriter.writeABC(tune);
  }
  this.printer.addSelectListener(this);
  this.updateSelection();
  this.bReentry = false;
};

ABCEditor.prototype.updateSelection = function() {
  var selection = this.getSelection();
  try {
    this.printer.rangeHighlight(selection.start, selection.end);
  } catch (e) {} // maybe printer isn't defined yet?
};

//TODO won't work under IE?
ABCEditor.prototype.getSelection = function() {
  return {start: this.textarea.selectionStart, end: this.textarea.selectionEnd};
}

ABCEditor.prototype.highlight = function(abcelem) {
  this.textarea.setSelectionRange(abcelem.start,abcelem.end);
  this.textarea.focus();
};

ABCEditor.prototype.getString = function() {
  return this.textarea.value;
};

ABCEditor.prototype.setString = function(str) {
  this.textarea.value = str;
  this.updateRendering();
};
