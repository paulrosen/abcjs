var animation = require('./api/animation');
var tunebook = require('./api/tunebook');

var abcjs = {
  Editor: require('./edit/editor')
};

Object.keys(animation).forEach(function (key) {
  abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
  abcjs[key] = tunebook[key];
});

module.exports = abcjs;
