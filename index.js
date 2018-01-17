const animation = require('./src/api/abc_animation');
const tuneBook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-basic v3.3.1";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');

const editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
