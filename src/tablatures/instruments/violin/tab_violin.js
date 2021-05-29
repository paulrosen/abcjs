/*
Emit tab for violin staff
*/
var plugin = {

  /**
   * upon init mainly store provided instances for later usage
   * @param {*} renderer the abcjs renderer
   * @param {*} abcTune  the parsed tune AST tree
  *  @param {*} tuneNumber  the parsed tune AST tree
   * @param {*} params  complementary args provided to Tablature Plugin
   */
  init: function (renderer, abcTune , tuneNumber ,params) {
    this.renderer = renderer; 
    this.tune = abcTune;
    this.params = params;
    this.tuneNumber = tuneNumber;
    console.log('ViolinTab plugin inited');
  },

  /**
   * render line using current abcjs renderer 
   * NB : we assume that renderer , current tunes info + tab params 
   * operational inside plugin instance
   * @param {*} line 
   */
  render: function (line) {
    console.log('ViolinTab plugin rendered');
  }
};

//
// Tablature plugin definition
//
var AbcViolinTab = function() {
  return { name: 'ViolinTab', tablature: plugin };
}

module.exports = AbcViolinTab;