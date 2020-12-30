import {entryPoint} from "./example-strings-js";

const cursor1 = `
// This demonstrates two methods of indicating where the music is.
	// 1) An element is created that is moved along for each note.
	// 2) The currently being played note is given a class so that it can be transformed.
	self.cursor = null; // This is the svg element that will move with the music.
	self.rootSelector = rootSelector; // This is the same selector as the renderAbc call uses.

	self.onStart = function() {
		// This is called when the timer starts so we know the svg has been drawn by now.
		// Create the cursor and add it to the sheet music's svg.
		var svg = document.querySelector(self.rootSelector + " svg");
		self.cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
		self.cursor.setAttribute("class", "abcjs-cursor");
		self.cursor.setAttributeNS(null, 'x1', 0);
		self.cursor.setAttributeNS(null, 'y1', 0);
		self.cursor.setAttributeNS(null, 'x2', 0);
		self.cursor.setAttributeNS(null, 'y2', 0);
		svg.appendChild(self.cursor);
	};

	self.removeSelection = function() {
		// Unselect any previously selected notes.
		var lastSelection = document.querySelectorAll(self.rootSelector + " .abcjs-highlight");
		for (var k = 0; k < lastSelection.length; k++)
			lastSelection[k].classList.remove("abcjs-highlight");
	};

`;

const cursor2 = `
		// This is called every time a note or a rest is reached and contains the coordinates of it.
		if (ev.measureStart && ev.left === null)
			return; // this was the second part of a tie across a measure line. Just ignore it.

		self.removeSelection();

		// Select the currently selected notes.
		for (var i = 0; i < ev.elements.length; i++ ) {
			var note = ev.elements[i];
			for (var j = 0; j < note.length; j++) {
				note[j].classList.add("abcjs-highlight");
			}
		}

		// Move the cursor to the location of the current note.
		if (self.cursor) {
			self.cursor.setAttribute("x1", ev.left - 2);
			self.cursor.setAttribute("x2", ev.left - 2);
			self.cursor.setAttribute("y1", ev.top);
			self.cursor.setAttribute("y2", ev.top + ev.height);
		}
`;

const cursor3 = `		self.removeSelection();

		if (self.cursor) {
			self.cursor.setAttribute("x1", 0);
			self.cursor.setAttribute("x2", 0);
			self.cursor.setAttribute("y1", 0);
			self.cursor.setAttribute("y2", 0);
		}
`;

const hide1 = `		if (ev.measureStart) {
			var elements = document.querySelectorAll('.abcjs-mm' + ev.measureNumber);
			for (var j = 0; j < elements.length; j++) {
				const element = elements[j];
				if (!element.classList.contains('abcjs-bar'))
					element.classList.add('hide-note');
			}
		}
`;

const hide2 = `
			var elements = document.querySelectorAll('.hide-note');
			for (var j = 0; j < elements.length; j++) {
				const element = elements[j];
					element.classList.remove('hide-note');
			}
`;

const cursorString = (usingNode, hasCursor, hideMeasures) => {
	return `function CursorControl(rootSelector) {
	var self = this;
${hasCursor ? cursor1 : '' }
	self.onEvent = function(ev) {
${hasCursor ? cursor2 : '' }
	${hideMeasures ? hide1 : '' }
	
	};
	self.onFinished = function() {
	${hasCursor ? cursor3 : '' }
	${hideMeasures ? hide2 : '' }
	};
}

var cursorControl = new CursorControl("#paper");

document.querySelector(".start").addEventListener("click", startTimer);

function onEvent(ev) {
if (ev)
cursorControl.onEvent(ev);
else
cursorControl.onFinished();
}

function startTimer() {
	${hasCursor ? 'cursorControl.onStart();' : '' }

var timingCallbacks = new ${usingNode ? 'abcjs' : 'ABCJS'}.TimingCallbacks(visualObj[0], {
	eventCallback: onEvent
});
timingCallbacks.start();
}
`
}

export const cursorJsString = (usingNode, hasCursor, hideMeasures) => {
	if (!hasCursor && !hideMeasures)
		return '';
	return cursorString(usingNode, hasCursor, hideMeasures);
};

