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
abcjs.renderMidi = require('./api/abc_tunebook_midi');

module.exports = abcjs;
