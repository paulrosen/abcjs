var setClass = require('../helpers/set-class');

var highlight = function (klass, color) {
	if (klass === undefined)
		klass = "abcjs-note_selected";
	if (color === undefined)
		color = "#ff0000";
	setClass(this.elemset, klass, "", color);
};

module.exports = highlight;
