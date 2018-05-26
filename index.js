var animation = require('./src/api/abc_animation');
var tuneBook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-basic v5.1.2";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
