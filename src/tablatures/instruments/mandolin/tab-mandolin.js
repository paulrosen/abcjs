
var AbcViolinTab = require('../violin/tab-violin');
var ViolinPlugin = AbcViolinTab().tablature;

//
// Tablature plugin definition
//
module.exports = function MandolinTab () {
  return { name: 'MandolinTab', tablature: ViolinPlugin };
};
