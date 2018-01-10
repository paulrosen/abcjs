var animation = require('./src/api/abc_animation');
var tunebook = require('./src/api/abc_tunebook');

var abcjs = {};

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
	abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');

var parser = require('./src/parse/abc_parse');
abcjs['parse'] = {Parse: parser};

var engraverController = require('./src/write/abc_engraver_controller');
abcjs['write'] = {EngraverController: engraverController};

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
