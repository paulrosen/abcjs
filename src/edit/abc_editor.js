// window.ABCJS.Editor:
//
// constructor(editarea, params)
//		if editarea is a string, then it is an HTML id of a textarea control.
//		Otherwise, it should be an instantiation of an object that expresses the EditArea interface.
//
//		params is a hash of:
//		canvas_id: or paper_id: HTML id to draw in. If not present, then the drawing happens just below the editor.
//		generate_midi: if present, then midi is generated.
//		midi_id: if present, the HTML id to place the midi control. Otherwise it is placed in the same div as the paper.
//		midi_download_id: if present, the HTML id to place the midi download link. Otherwise it is placed in the same div as the paper.
//		generate_warnings: if present, then parser warnings are displayed on the page.
//		warnings_id: if present, the HTML id to place the warnings. Otherwise they are placed in the same div as the paper.
//		onchange: if present, the callback function to call whenever there has been a change.
//		gui: if present, the paper can send changes back to the editor (presumably because the user changed something directly.)
//		parser_options: options to send to the parser engine.
//		midi_options: options to send to the midi engine.
//		render_options: options to send to the render engine.
//		indicate_changed: the dirty flag is set if this is true.
//
// - setReadOnly(bool)
//		adds or removes the class abc_textarea_readonly, and adds or removes the attribute readonly=yes
// - setDirtyStyle(bool)
//		adds or removes the class abc_textarea_dirty
// - modelChanged()
//		Called when the model has been changed to trigger re-rendering
// - parseABC()
//		Called internally by fireChanged()
//		returns true if there has been a change since last call.
// - updateSelection()
//		Called when the user has changed the selection. This calls the engraver to show the selection.
// - fireSelectionChanged()
//		Called by the textarea object when the user has changed the selection.
// - paramChanged(engraverparams)
//		Called to signal that the engraver params have changed, so re-rendering should occur.
// - fireChanged()
//		Called by the textarea object when the user has changed something.
// - setNotDirty()
//		Called by the client app to reset the dirty flag
// - isDirty()
//		Returns true or false, whether the textarea contains the same text that it started with.
// - highlight(abcelem)
//		Called by the engraver to highlight an area.
// - pause(bool)
//		Stops the automatic rendering when the user is typing.
//
var parseCommon = require('../parse/abc_common');
var SynthController = require('../synth/synth-controller');
var supportsAudio = require('../synth/supports-audio');
var renderAbc = require('../api/abc_tunebook_svg');
var EditArea = require('./abc_editarea');

function gatherAbcParams(params) {
	// There used to be a bunch of ways parameters can be passed in. This just simplifies it.
	var abcjsParams = {};
	var key;
	if (params.abcjsParams) {
		for (key in params.abcjsParams) {
			if (params.abcjsParams.hasOwnProperty(key)) {
				abcjsParams[key] = params.abcjsParams[key];
			}
		}
	}
	if (params.midi_options) {
		for (key in params.midi_options) {
			if (params.midi_options.hasOwnProperty(key)) {
				abcjsParams[key] = params.midi_options[key];
			}
		}
	}
	if (params.parser_options) {
		for (key in params.parser_options) {
			if (params.parser_options.hasOwnProperty(key)) {
				abcjsParams[key] = params.parser_options[key];
			}
		}
	}
	if (params.render_options) {
		for (key in params.render_options) {
			if (params.render_options.hasOwnProperty(key)) {
				abcjsParams[key] = params.render_options[key];
			}
		}
	}
	/*
	if (params.tablature_options) {
		abcjsParams['tablatures'] = params.tablature_options;
	}
	*/
	if (abcjsParams.tablature) {
		if (params.warnings_id) {
			// store for plugin error handling
			abcjsParams.tablature.warnings_id = params.warnings_id;
		}
	}
	return abcjsParams;
}

var Editor = function(editarea, params) {
	// Copy all the options that will be passed through
	this.abcjsParams = gatherAbcParams(params);

	if (params.indicate_changed)
		this.indicate_changed = true;
  if (typeof editarea === "string") {
    this.editarea = new EditArea(editarea);
  } else {
    this.editarea = editarea;
  }
  this.editarea.addSelectionListener(this);
  this.editarea.addChangeListener(this);

  if (params.canvas_id) {
    this.div = params.canvas_id;
  } else if (params.paper_id) {
    this.div = params.paper_id;
  } else {
    this.div = document.createElement("DIV");
    this.editarea.getElem().parentNode.insertBefore(this.div, this.editarea.getElem());
  }
  if (typeof this.div === 'string')
	  this.div = document.getElementById(this.div);

  if (params.selectionChangeCallback) {
  	this.selectionChangeCallback = params.selectionChangeCallback;
  }

  this.clientClickListener = this.abcjsParams.clickListener;
  this.abcjsParams.clickListener = this.highlight.bind(this);

  if (params.synth) {
  	if (supportsAudio()) {
	    this.synth = {
		    el: params.synth.el,
		    cursorControl: params.synth.cursorControl,
		    options: params.synth.options
	    };
    }
  }
	// If the user wants midi, then store the elements that it will be written to. The element could either be passed in as an id,
	// an element, or nothing. If nothing is passed in, then just put the midi on top of the generated music.
	if (params.generate_midi) {
	  	this.generate_midi = params.generate_midi;
		if (this.abcjsParams.generateDownload) {
			if (typeof params.midi_download_id === 'string')
				this.downloadMidi = document.getElementById(params.midi_download_id);
			else if (params.midi_download_id) // assume, if the var is not a string it is an element. If not, it will crash soon enough.
				this.downloadMidi = params.midi_download_id;
		}
		if (this.abcjsParams.generateInline !== false) { // The default for this is true, so undefined is also true.
			if (typeof params.midi_id === 'string')
				this.inlineMidi = document.getElementById(params.midi_id);
			else if (params.midi_id) // assume, if the var is not a string it is an element. If not, it will crash soon enough.
				this.inlineMidi = params.midi_id;
		}
	}

  if (params.warnings_id) {
  	if (typeof(params.warnings_id) === "string")
      this.warningsdiv = document.getElementById(params.warnings_id);
  	else
		this.warningsdiv = params.warnings_id;
  } else if (params.generate_warnings) {
	  this.warningsdiv = document.createElement("div");
	  this.div.parentNode.insertBefore(this.warningsdiv, this.div);
  }

  this.onchangeCallback = params.onchange;

  this.currentAbc = "";
  this.tunes = [];
  this.bReentry = false;
  this.parseABC();
  this.modelChanged();

  this.addClassName = function(element, className) {
    var hasClassName = function(element, className) {
      var elementClassName = element.className;
      return (elementClassName.length > 0 && (elementClassName === className ||
        new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    };

    if (!hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  };

  this.removeClassName = function(element, className) {
    element.className = parseCommon.strip(element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' '));
    return element;
  };

  this.setReadOnly = function(readOnly) {
	  var readonlyClass = 'abc_textarea_readonly';
	  var el = this.editarea.getElem();
    if (readOnly) {
      el.setAttribute('readonly', 'yes');
	  this.addClassName(el, readonlyClass);
	} else {
      el.removeAttribute('readonly');
	  this.removeClassName(el, readonlyClass);
    }
  };
};

Editor.prototype.redrawMidi = function() {
	if (this.generate_midi && !this.midiPause) {
		var event = new window.CustomEvent("generateMidi", {
			detail: {
				tunes: this.tunes,
				abcjsParams: this.abcjsParams,
				downloadMidiEl: this.downloadMidi,
				inlineMidiEl: this.inlineMidi,
				engravingEl: this.div
			}
		});
		window.dispatchEvent(event);
	}
	if (this.synth) {
		var userAction = this.synth.synthControl; // Can't really tell if there was a user action before drawing, but we assume that if the synthControl was created already there was a user action.
		if (!this.synth.synthControl) {
			this.synth.synthControl = new SynthController();
			this.synth.synthControl.load(this.synth.el, this.synth.cursorControl, this.synth.options);
		}
		this.synth.synthControl.setTune(this.tunes[0], userAction, this.synth.options);
	}
};

Editor.prototype.modelChanged = function() {
  if (this.bReentry)
    return; // TODO is this likely? maybe, if we rewrite abc immediately w/ abc2abc
	this.bReentry = true;
	try {
		this.timerId = null;
		if (this.synth && this.synth.synthControl)
			this.synth.synthControl.disable(true);

		this.tunes = renderAbc(this.div, this.currentAbc, this.abcjsParams);
		if (this.tunes.length > 0) {
			this.warnings = this.tunes[0].warnings;
		}
		this.redrawMidi();
	} catch(error) {
		console.error("ABCJS error: ", error);
		if (!this.warnings)
			this.warnings = [];
		this.warnings.push(error.message);
	}

  if (this.warningsdiv) {
    this.warningsdiv.innerHTML = (this.warnings) ? this.warnings.join("<br />") : "No errors";
  }
  this.updateSelection();
  this.bReentry = false;
};

// Call this to reparse in response to the client changing the parameters on the fly
Editor.prototype.paramChanged = function(engraverParams) {
	if (engraverParams) {
		for (var key in engraverParams) {
			if (engraverParams.hasOwnProperty(key)) {
				this.abcjsParams[key] = engraverParams[key];
			}
		}
	}
	this.currentAbc = "";
	this.fireChanged();
};

Editor.prototype.synthParamChanged = function(options) {
	if (!this.synth)
		return;
	this.synth.options = {};
	if (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				this.synth.options[key] = options[key];
			}
		}
	}
	this.currentAbc = "";
	this.fireChanged();
};

// return true if the model has changed
Editor.prototype.parseABC = function() {
  var t = this.editarea.getString();
  if (t===this.currentAbc) {
    this.updateSelection();
    return false;
  }

  this.currentAbc = t;
  return true;
};

Editor.prototype.updateSelection = function() {
  var selection = this.editarea.getSelection();
  try {
  	if (this.tunes.length > 0 && this.tunes[0].engraver)
	  this.tunes[0].engraver.rangeHighlight(selection.start, selection.end);
  } catch (e) {} // maybe printer isn't defined yet?
	if (this.selectionChangeCallback)
		this.selectionChangeCallback(selection.start, selection.end);
};

// Called when the textarea's selection is in the process of changing (after mouse down, dragging, or keyboard arrows)
Editor.prototype.fireSelectionChanged = function() {
  this.updateSelection();
};

Editor.prototype.setDirtyStyle = function(isDirty) {
	if (this.indicate_changed === undefined)
		return;
  var addClassName = function(element, className) {
    var hasClassName = function(element, className) {
      var elementClassName = element.className;
      return (elementClassName.length > 0 && (elementClassName === className ||
        new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    };

    if (!hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
    return element;
  };

  var removeClassName = function(element, className) {
    element.className = parseCommon.strip(element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' '));
    return element;
  };

	var readonlyClass = 'abc_textarea_dirty';
	var el = this.editarea.getElem();
	if (isDirty) {
		addClassName(el, readonlyClass);
	} else {
		removeClassName(el, readonlyClass);
    }
};

// call when the textarea alerts us that the abc text is changed and needs re-parsing
Editor.prototype.fireChanged = function() {
  if (this.bIsPaused)
    return;
  if (this.parseABC()) {
    var self = this;
    if (this.timerId)	// If the user is still typing, cancel the update
      clearTimeout(this.timerId);
    this.timerId = setTimeout(function () {
      self.modelChanged();
    }, 300);	// Is this a good compromise between responsiveness and not redrawing too much?
	  var isDirty = this.isDirty();
	  if (this.wasDirty !== isDirty) {
		  this.wasDirty = isDirty;
		  this.setDirtyStyle(isDirty);
	  }
	  if (this.onchangeCallback)
		  this.onchangeCallback(this);
	  }
};

Editor.prototype.setNotDirty = function() {
	this.editarea.initialText = this.editarea.getString();
	this.wasDirty = false;
	this.setDirtyStyle(false);
};

Editor.prototype.isDirty = function() {
	if (this.indicate_changed === undefined)
		return false;
	return this.editarea.initialText !== this.editarea.getString();
};

Editor.prototype.highlight = function(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
	// TODO-PER: The marker appears to get off by one for each tune parsed. I'm not sure why, but adding the tuneNumber in corrects it for the time being.
//	var offset = (tuneNumber !== undefined) ? this.startPos[tuneNumber] + tuneNumber : 0;

  this.editarea.setSelection(abcelem.startChar, abcelem.endChar);
	if (this.selectionChangeCallback)
		this.selectionChangeCallback(abcelem.startChar, abcelem.endChar);
	if (this.clientClickListener)
		this.clientClickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent);
};

Editor.prototype.pause = function(shouldPause) {
	this.bIsPaused = shouldPause;
	if (!shouldPause)
		this.fireChanged();
};

Editor.prototype.millisecondsPerMeasure = function() {
	if (!this.synth || !this.synth.synthControl || !this.synth.synthControl.visualObj)
		return 0;
	return this.synth.synthControl.visualObj.millisecondsPerMeasure();
};

Editor.prototype.pauseMidi = function(shouldPause) {
	this.midiPause = shouldPause;
	if (!shouldPause)
		this.redrawMidi();
};

module.exports = Editor;
