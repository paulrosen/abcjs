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
