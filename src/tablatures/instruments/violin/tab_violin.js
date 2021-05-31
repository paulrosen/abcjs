/*
Emit tab for violin staff
*/
var plugin = {

  /**
   * upon init mainly store provided instances for later usage
   * @param {*} abcTune  the parsed tune AST tree
  *  @param {*} tuneNumber  the parsed tune AST tree
   * @param {*} params  complementary args provided to Tablature Plugin
   */
  init: function ( abcTune , tuneNumber ,params) {
    this.tune = abcTune;
    this.params = params;
    this.tuneNumber = tuneNumber;
    console.log('ViolinTab plugin inited');
  },

  /**
   * render a score line staff using current abcjs renderer 
   * NB : we assume that renderer , current tunes info + tab params 
   * operational inside plugin instance
   * @param {*} staff 
   */
  render: function ( renderer , staff) {
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