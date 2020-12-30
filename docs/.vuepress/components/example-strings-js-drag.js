export const dragJsString = (usingNode, allowDragging) => {
	if (!allowDragging)
		return '';
	
	return `function sanitize(str) {
return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatAbc(start, end) {
var abc;
if (start < 0 || end < 0)
abc = sanitize(abcString);
else {
abc = sanitize(abcString.substring(0, start)) +
'<span class="select">' +
sanitize(abcString.substring(start, end)) +
'</span>' +
sanitize(abcString.substring(end));
}
var el = document.getElementById("source");
el.innerHTML = abc.replace(/\\n/g,"<br>");
}
function draw() {
var options = {
add_classes: true,
selectionColor: "green",
dragColor: "blue",
clickListener: clickListener,
dragging: true,
selectTypes: [ 'note' ]
};

${usingNode ? 'abcjs' : 'ABCJS'}.renderAbc("paper", abcString, options);
}

var allPitches = [
'C,,,,', 'D,,,,', 'E,,,,', 'F,,,,', 'G,,,,', 'A,,,,', 'B,,,,',
'C,,,', 'D,,,', 'E,,,', 'F,,,', 'G,,,', 'A,,,', 'B,,,',
'C,,', 'D,,', 'E,,', 'F,,', 'G,,', 'A,,', 'B,,',
'C,', 'D,', 'E,', 'F,', 'G,', 'A,', 'B,',
'C', 'D', 'E', 'F', 'G', 'A', 'B',
'c', 'd', 'e', 'f', 'g', 'a', 'b',
"c'", "d'", "e'", "f'", "g'", "a'", "b'",
"c''", "d''", "e''", "f''", "g''", "a''", "b''",
"c'''", "d'''", "e'''", "f'''", "g'''", "a'''", "b'''",
"c''''", "d''''", "e''''", "f''''", "g''''", "a''''", "b''''"
];

function moveNote(note, step) {
var x =allPitches.indexOf(note);
if (x >= 0)
return allPitches[x-step];
return note;
}

function tokenize(str) {
var arr = str.split(/(!.+?!|".+?")/);
var output = [];
for (var i = 0; i < arr.length; i++) {
var token = arr[i];
if (token.length > 0) {
if (token[0] !== '"' && token[0] !== '!') {
var arr2 = arr[i].split(/([A-Ga-g][,']*)/);
output = output.concat(arr2);
} else
output.push(token);
}
}
return output;
}

var selectionCallback;
var currentIndex = -1;
var maxIndex = -1;

function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
if (drag) {
selectionCallback = drag.setSelection;
currentIndex = drag.index;
maxIndex = drag.max;
}
if (abcelem.pitches && drag && drag.step && abcelem.startChar >= 0 && abcelem.endChar >= 0) {
var originalText = abcString.substring(abcelem.startChar, abcelem.endChar);
var arr = tokenize(originalText);
// arr now contains elements that are either a chord, a decoration, a note name, or anything else. It can be put back to its original string with .join("").
for (var i = 0; i < arr.length; i++) {
arr[i] = moveNote(arr[i], drag.step);
}
var newText = arr.join("");

abcString = abcString.substring(0, abcelem.startChar) + newText + abcString.substring(abcelem.endChar);
formatAbc(abcelem.startChar, abcelem.endChar);
draw();
} else if (abcelem.startChar >= 0 && abcelem.endChar >= 0)
formatAbc(abcelem.startChar, abcelem.endChar);
}

formatAbc(-1,-1);
draw();
`
};
