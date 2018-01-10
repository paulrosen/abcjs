const animation = require('./src/api/abc_animation');
const tuneBook = require('./src/api/abc_tunebook');

let abcjs = {};

abcjs.signature = "abcjs_basic v3.3.0";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');

const parser = require('./src/parse/abc_parse');
abcjs['parse'] = {Parse: parser};

const engraverController = require('./src/write/abc_engraver_controller');
abcjs['write'] = {EngraverController: engraverController};

const editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
