// abc_editor.js
//    Copyright (C) 2015-2020 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// window.ABCJS.Editor is the interface class for the area that contains the ABC text. It is responsible for
// holding the text of the tune and calling the parser and the rendering engines.
//
// EditArea is an example of using a textarea as the control that is shown to the user. As long as
// the same interface is used, window.ABCJS.Editor can use a different type of object.
//
// EditArea:
// - constructor(textareaid)
//		This contains the id of a textarea control that will be used.
// - addSelectionListener(listener)
//		A callback class that contains the entry point fireSelectionChanged()
// - addChangeListener(listener)
//		A callback class that contains the entry point fireChanged()
// - getSelection()
//		returns the object { start: , end: } with the current selection in characters
// - setSelection(start, end)
//		start and end are the character positions that should be selected.
// - getString()
//		returns the ABC text that is currently displayed.
// - setString(str)
//		sets the ABC text that is currently displayed, and resets the initialText variable
// - getElem()
//		returns the textarea element
// - string initialText
//		Contains the starting text. This can be compared against the current text to see if anything changed.
//

// Polyfill for CustomEvent for old IE versions
try {
	if (typeof window.CustomEvent !== "function") {
		var CustomEvent = function (event, params) {
			params = params || {bubbles: false, cancelable: false, detail: undefined};
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}
} catch (e) {
	// if we aren't in a browser, this code will crash, but it is not needed then either.
}

var EditArea = function(textareaid) {
  this.textarea = document.getElementById(textareaid);
  this.initialText = this.textarea.value;
  this.isDragging = false;
}

EditArea.prototype.addSelectionListener = function(listener) {
  this.textarea.onmousemove = function(ev) {
	  if (this.isDragging)
	    listener.fireSelectionChanged();
  };
};

EditArea.prototype.addChangeListener = function(listener) {
  this.changelistener = listener;
  this.textarea.onkeyup = function() {
    listener.fireChanged();
  };
  this.textarea.onmousedown = function() {
	this.isDragging = true;
    listener.fireSelectionChanged();
  };
  this.textarea.onmouseup = function() {
	this.isDragging = false;
    listener.fireChanged();
  };
  this.textarea.onchange = function() {
    listener.fireChanged();
  };
};

//TODO won't work under IE?
EditArea.prototype.getSelection = function() {
  return {start: this.textarea.selectionStart, end: this.textarea.selectionEnd};
};

EditArea.prototype.setSelection = function(start, end) {
	if(this.textarea.setSelectionRange)
	   this.textarea.setSelectionRange(start, end);
	else if(this.textarea.createTextRange) {
		// For IE8
	   var e = this.textarea.createTextRange();
	   e.collapse(true);
	   e.moveEnd('character', end);
	   e.moveStart('character', start);
	   e.select();
	}
  this.textarea.focus();
};

EditArea.prototype.getString = function() {
  return this.textarea.value;
};

EditArea.prototype.setString = function(str) {
  this.textarea.value = str;
  this.initialText = this.getString();
  if (this.changelistener) {
    this.changelistener.fireChanged();
  }
};

EditArea.prototype.getElem = function() {
  return this.textarea;
};

module.exports = EditArea;
