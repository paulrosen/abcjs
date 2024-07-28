
var StringTablature = require('./string-tablature');
var tabRenderer = require('../render/tab-renderer');
var StringPatterns = require('./string-patterns');


/**
 * upon init mainly store provided instances for later usage
 * @param {*} abcTune  the parsed tune AST tree
 * @param {*} tuneNumber  the parsed tune AST tree
 * @param {*} params  complementary args provided to Tablature Plugin
 */
Plugin.prototype.init = function (abcTune, tuneNumber, params, tabSettings) {
	//console.log("INIT AbcStringTab Plugin.init")
	this.tune = abcTune;
	this.params = params;
	this.tuneNumber = tuneNumber;
	this.inError = false;
	this.abcTune = abcTune;
	this.linePitch = 3;
	this.nbLines = tabSettings.defaultTuning.length;
	this.isTabBig = tabSettings.isTabBig;
	this.tabSymbolOffset = tabSettings.tabSymbolOffset;
	this.capo = params.capo;
	this.transpose = params.visualTranspose;
	this.hideTabSymbol = params.hideTabSymbol;
	this.tablature = new StringTablature(this.nbLines, this.linePitch);
	var tuning = params.tuning;
	if (!tuning) {
		tuning = tabSettings.defaultTuning;
	}
	this.tuning = tuning;
	this.semantics = new StringPatterns(this);
};

Plugin.prototype.setError = function (error) {
	//console.log("Plugin setError")
	if (error) {
		this.error = error;
		this.inError = true;
		if (this.tune.warnings) {
			this.tune.warnings.push(error);
		} else {
			this.tune.warnings = [error];
		}
	}
};

Plugin.prototype.render = function (renderer, line, staffIndex) {
	//console.log("RENDER AbcStringTab Plugin.render")
	if (this.inError) return;
	if (this.tablature.bypass(line)) return;
	tabRenderer(this, renderer, line, staffIndex);
};

function Plugin() { }

//
// Tablature plugin definition
//
var AbcStringTab = function () {
	return { name: 'StringTab', tablature: Plugin };
};

module.exports = AbcStringTab;
