
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
	// Use the user-provided tuning (from params.tuning) if available, otherwise
	// fall back to the instrument's defaultTuning from the pluginTab entry in
	// abc_tablatures.js. This allows the "custom" and "customBanjo" instruments
	// to accept any tuning the user types into the UI.
	var tuning = params.tuning;
	if (!tuning) {
		tuning = tabSettings.defaultTuning;
	}
	this.tuning = tuning;

	// Originally nbLines was derived from tabSettings.defaultTuning.length,
	// which meant custom tunings with a different number of strings would draw
	// the wrong number of tab lines. Now we derive it from the actual tuning
	// being used, so a 6-string custom tuning draws 6 lines even if the
	// instrument's default was 4.
	this.nbLines = tuning.length;
	this.isTabBig = tabSettings.isTabBig;
	this.tabSymbolOffset = tabSettings.tabSymbolOffset;
	this.capo = params.capo;
	this.transpose = params.visualTranspose;
	this.hideTabSymbol = params.hideTabSymbol;
	this.tablature = new StringTablature(this.nbLines, this.linePitch);

	// For banjo-type instruments (identified by isBanjo=true in abc_tablatures.js),
	// dynamically compute strOrder and maxFrets from the tuning length rather than
	// using hardcoded values. This is what makes "customBanjo" work with any number
	// of strings — a 4-string banjo gets strOrder [3,0,1,2], a 6-string gets
	// [5,0,1,2,3,4], etc.
	//
	// The pattern is always: [n-1, 0, 1, 2, ..., n-2]
	//   - The last element in ascending pitch order (the drone, index n-1)
	//     maps to physical string 0 (top of tab)
	//   - All other strings map sequentially starting from physical string 1
	//
	// maxFrets is computed as [24, 24, ..., 24, 0] — all strings allow up to
	// fret 24 except the drone (last in ascending order) which is locked to
	// fret 0 (open only). When tabSettings.frettedDrone is true (the _fretted
	// variant), maxFrets is set to null so no fret restriction is applied.
	//
	// For non-banjo instruments, strOrder and maxFrets come directly from the
	// pluginTab entry (or are undefined for standard instruments like fiddle).
	if (tabSettings.isBanjo) {
		var n = tuning.length;
		this.strOrder = [n - 1];
		for (var si = 0; si < n - 1; si++) { this.strOrder.push(si); }
		if (!tabSettings.frettedDrone) {
			this.maxFrets = [];
			for (var fi = 0; fi < n - 1; fi++) { this.maxFrets.push(24); }
			this.maxFrets.push(0);
		} else {
			this.maxFrets = null;
		}
	} else {
		this.strOrder = tabSettings.strOrder;
		this.maxFrets = tabSettings.maxFrets;
	}

	// StringPatterns handles the actual pitch-to-fret calculation. It receives
	// this plugin instance and reads tuning, strOrder, maxFrets, capo, etc.
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
