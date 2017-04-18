var animation = require('./api/abc_animation');
var tunebook = require('./api/abc_tunebook');

var abcjs = {};

Object.keys(animation).forEach(function (key) {
  abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
  abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./api/abc_tunebook_svg');

var parser = require('./parse/abc_parse');
abcjs['parse'] = { Parse: parser };

var engraverController = require('./write/abc_engraver_controller');
abcjs['write'] = { EngraverController: engraverController };

module.exports = abcjs;
