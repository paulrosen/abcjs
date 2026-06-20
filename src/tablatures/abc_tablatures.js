/*
 * Tablature Plugins
 * tablature are defined dynamically and registered inside abcjs
 * by calling abcTablatures.register(plugin) 
 * where plugin represents a plugin instance 
 * 
 */

// This is the only entry point to the tablatures. It is called both after parsing a tune and just before engraving

var TabString = require('./instruments/tab-string');

/* extend the table below when adding a new instrument plugin */

// Existing tab classes 
var pluginTab = {
	'violin': { name: 'StringTab', defaultTuning: ['G,', 'D', 'A', 'e'], isTabBig: false, tabSymbolOffset: 0 },
	'fiddle': { name: 'StringTab', defaultTuning: ['G,', 'D', 'A', 'e'], isTabBig: false, tabSymbolOffset: 0 },
	'mandolin': { name: 'StringTab', defaultTuning: ['G,', 'D', 'A', 'e'], isTabBig: false, tabSymbolOffset: 0 },
	'guitar': { name: 'StringTab', defaultTuning: ['E,', 'A,', 'D', 'G', 'B', 'e'], isTabBig: true, tabSymbolOffset: 0 },
	'fiveString': { name: 'StringTab', defaultTuning: ['C,', 'G,', 'D', 'A', 'e'], isTabBig: false, tabSymbolOffset: -.95 },
	//
	// ═══ BANJO TUNINGS ═══
	//
	// 5-string banjo has a unique physical layout: the 5th string (short drone
	// string) is the highest-pitched string but sits at the top of the neck,
	// not the bottom. This means the physical string order doesn't match the
	// ascending pitch order that abcjs's tablature engine expects internally.
	//
	// To handle this, each banjo entry uses three custom properties:
	//
	// defaultTuning: notes listed in ASCENDING PITCH order, not physical order.
	//   For Open G (gDGBd physically), this is ['D','G','B','d','g'] because
	//   D is the lowest pitch and g (the drone) is the highest.
	//
	// strOrder: an array that remaps ascending-pitch indices to physical string
	//   positions on the tab staff. [4,0,1,2,3] means:
	//     - ascending index 0 (D, lowest)  → physical string 4 (bottom tab line)
	//     - ascending index 1 (G)          → physical string 0
	//     - ascending index 2 (B)          → physical string 1
	//     - ascending index 3 (d)          → physical string 2
	//     - ascending index 4 (g, drone)   → physical string 3 (but drawn at top
	//       because string 0 is at the top of the tab staff)
	//   This remapping is applied in tab-absolute-elements.js after the fret
	//   numbers are calculated.
	//
	// maxFrets: limits the maximum fret number per string (in ascending-pitch
	//   order). The last element [24,24,24,24,0] sets maxFret=0 for the drone
	//   (ascending index 4), meaning only open (fret 0) is allowed. When a note
	//   would need a higher fret on the drone string, the toNumber() function in
	//   string-patterns.js skips it and assigns the note to the next lower string.
	//
	// Each tuning has a corresponding "_fretted" variant that omits maxFrets,
	// allowing all frets on the drone string. These are not shown directly in
	// the UI — they're selected by appending "_fretted" to the instrument name
	// when the user checks "Allow fretted drone string".
	//
	'banjoOpenG':    { name: 'StringTab', defaultTuning: ['D', 'G', 'B', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoDoubleC':  { name: 'StringTab', defaultTuning: ['C', 'G', 'c', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoSawmill':  { name: 'StringTab', defaultTuning: ['D', 'G', 'c', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoOpenD':    { name: 'StringTab', defaultTuning: ['D', '^F', 'A', 'd', '^f'],  strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 }, // ^F = F#, ^f = f#
	'banjoOpenC':    { name: 'StringTab', defaultTuning: ['C', 'G', 'c', 'e', 'g'],    strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoGMinor':   { name: 'StringTab', defaultTuning: ['D', 'G', '_B', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 }, // _B = Bb
	'banjoDADE':     { name: 'StringTab', defaultTuning: ['D', 'A', 'd', 'e', 'a'],    strOrder: [4, 0, 1, 2, 3], maxFrets: [24, 24, 24, 24, 0], isTabBig: true, tabSymbolOffset: -.95 },
	// _fretted variants: identical tunings but no maxFrets restriction, so the
	// drone string can be fretted at any position. Hidden from the UI dropdown;
	// activated by the "Allow fretted drone string" checkbox which appends
	// "_fretted" to the instrument name before passing it to abcjs.
	'banjoOpenG_fretted':    { name: 'StringTab', defaultTuning: ['D', 'G', 'B', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoDoubleC_fretted':  { name: 'StringTab', defaultTuning: ['C', 'G', 'c', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoSawmill_fretted':  { name: 'StringTab', defaultTuning: ['D', 'G', 'c', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoOpenD_fretted':    { name: 'StringTab', defaultTuning: ['D', '^F', 'A', 'd', '^f'],  strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoOpenC_fretted':    { name: 'StringTab', defaultTuning: ['C', 'G', 'c', 'e', 'g'],    strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoGMinor_fretted':   { name: 'StringTab', defaultTuning: ['D', 'G', '_B', 'd', 'g'],   strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	'banjoDADE_fretted':     { name: 'StringTab', defaultTuning: ['D', 'A', 'd', 'e', 'a'],    strOrder: [4, 0, 1, 2, 3], isTabBig: true, tabSymbolOffset: -.95 },
	//
	// ═══ CUSTOM INSTRUMENTS ═══
	//
	// These allow users to define their own tuning via a text input in the UI.
	// The defaultTuning here is a fallback used when no custom tuning is provided.
	// The actual tuning is passed via params.tuning from the front-end, and
	// tab-string.js derives the number of tab lines from the tuning length
	// (not from defaultTuning.length), so any number of strings is supported.
	//
	// 'custom': a generic fretted instrument with no string reordering.
	//   Uses whatever tuning the user types, rendered as a standard tab staff.
	//
	// 'customBanjo': like custom, but with isBanjo=true. This flag tells
	//   tab-string.js to dynamically compute strOrder and maxFrets based on
	//   the tuning length — the last string in ascending order is always treated
	//   as the drone (mapped to physical string 0, locked to fret 0).
	//   This supports banjos with any number of strings (4, 5, 6, etc.).
	//
	// 'customBanjo_fretted': same as customBanjo but with frettedDrone=true,
	//   which tells tab-string.js to skip generating maxFrets, so the drone
	//   string can be fretted freely.
	//
	'custom':              { name: 'StringTab', defaultTuning: ['G,', 'D', 'A', 'e'], isTabBig: true, tabSymbolOffset: 0 },
	'customBanjo':         { name: 'StringTab', defaultTuning: ['D', 'G', 'B', 'd', 'g'], isBanjo: true, isTabBig: true, tabSymbolOffset: -.95 },
	'customBanjo_fretted': { name: 'StringTab', defaultTuning: ['D', 'G', 'B', 'd', 'g'], isBanjo: true, frettedDrone: true, isTabBig: true, tabSymbolOffset: -.95 },
};

var abcTablatures = {

	inited: false,
	plugins: {},


	/**
	 * to be called once per plugin for registration 
	 * @param {*} plugin 
	 */
	register: function (plugin) {
		var name = plugin.name;
		var tablature = plugin.tablature;
		this.plugins[name] = tablature;
	},

	setError: function (tune, msg) {
		if (tune.warnings) {
			tune.warning.push(msg);
		} else {
			tune.warnings = [msg];
		}
	},

	/**
	 * handle params for current processed score
	 * @param {*} tune current tune 
	 * @param {*} tuneNumber number in tune list
	 * @param {*} params params to be processed for tablature
	 * @return prepared tablatures plugin instances for current tune
	 */
	preparePlugins: function (tune, tuneNumber, params) {
		// Called after parsing a tune and before engraving it
		if (!this.inited) {
			// TODO-PER: I don't think this is needed - the plugin array can be hard coded, right?
			this.register(new TabString());
			this.inited = true;
		}
		var returned = null;
		var nbPlugins = 0;
		if (params.tablature) {
			// validate requested plugins 
			var tabs = params.tablature;
			returned = [];
			for (var ii = 0; ii < tabs.length; ii++) {
				var args = tabs[ii];
				var instrument = args['instrument'];
				if (instrument == null) {
					this.setError(tune, "tablature 'instrument' is missing");
					return returned;
				}
				var tabName = pluginTab[instrument];
				var plugin = null;
				if (tabName) {
					plugin = this.plugins[tabName.name];
				}
				if (plugin) {
					if (params.visualTranspose != 0) {
						// populate transposition request to tabs
						args.visualTranspose = params.visualTranspose;
					}
					args.abcSrc = params.tablature.abcSrc;
					var pluginInstance = {
						classz: plugin,
						tuneNumber: tuneNumber,
						params: args,
						instance: null,
						tabType: tabName,
					};
					// proceed with tab plugin  init 
					// plugin.init(tune, tuneNumber, args, ii);
					returned.push(pluginInstance);
					nbPlugins++;
				} else if (instrument === '') {
					// create a placeholder - there is no tab for this staff
					returned.push(null)
				} else {
					// unknown tab plugin 
					//this.emit_error('Undefined tablature plugin: ' + tabName)
					this.setError(tune, 'Undefined tablature plugin: ' + instrument);
					return returned;
				}
			}
		}
		return returned;
	},

	/**
	 * Call requested plugin
	 * @param {*} renderer 
	 * @param {*} abcTune 
	 */
	layoutTablatures: function layoutTablatures(renderer, abcTune) {
		var tabs = abcTune.tablatures;

		// chack tabs request for each staffs
		var staffLineCount = 0;

		// Clear the suppression flag
		if (tabs && (tabs.length > 0)) {
			var nTabs = tabs.length;
			for (var kk = 0; kk < nTabs; ++kk) {
				if (tabs[kk] && tabs[kk].params.firstStaffOnly) {
					tabs[kk].params.suppress = false;
				}
			}
		}

		for (var ii = 0; ii < abcTune.lines.length; ii++) {
			var line = abcTune.lines[ii];

			if (line.staff) {
				staffLineCount++;
			}

			// MAE 27Nov2023
			// If tab param "firstStaffOnly", remove the tab label after the first staff
			if (staffLineCount > 1) {
				if (tabs && (tabs.length > 0)) {
					var nTabs = tabs.length;
					for (var kk = 0; kk < nTabs; ++kk) {
						if (tabs[kk].params.firstStaffOnly) {
							// Set the staff draw suppression flag
							tabs[kk].params.suppress = true;
						}
					}
				}
			}

			var curStaff = line.staff;
			if (curStaff) {
				var maxStaves = curStaff.length
				for (var jj = 0; jj < curStaff.length; jj++) {

					if (tabs[jj] && jj < maxStaves) {
						// tablature requested for staff
						var tabPlugin = tabs[jj];
						if (tabPlugin.instance == null) {
							//console.log("★★★★ Tab Init line: " + ii + " staff: " + jj)
							tabPlugin.instance = new tabPlugin.classz();
							// plugin.init(tune, tuneNumber, args, ii);
							// call initer first
							tabPlugin.instance.init(abcTune,
								tabPlugin.tuneNumber,
								tabPlugin.params,
								tabPlugin.tabType
							);
						}
						// render next
						//console.log("★★★★ Tab Render line: " + ii + " staff: " + jj)
						tabPlugin.instance.render(renderer, line, jj);
					}
				}
			}
		}
	},

};


module.exports = abcTablatures;
