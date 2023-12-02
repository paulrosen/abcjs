/*
 * Tablature Plugins
 * tablature are defined dynamically and registered inside abcjs
 * by calling abcTablatures.register(plugin) 
 * where plugin represents a plugin instance 
 * 
 */
var ViolinTablature = require('../tablatures/instruments/violin/tab-violin');
var GuitarTablature = require('../tablatures/instruments/guitar/tab-guitar');

/* extend the table below when adding a new instrument plugin */

// Existing tab classes 
var pluginTab = {
  'violin': 'ViolinTab',
  'fiddle': 'ViolinTab',
  'mandolin': 'ViolinTab',
  'guitar': 'GuitarTab'
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
          plugin = this.plugins[tabName];
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
    if (tabs && (tabs.length > 0)){
      var nTabs = tabs.length;
      for (var kk=0;kk<nTabs;++kk){
        if (tabs[kk] && tabs[kk].params.firstStaffOnly){
          tabs[kk].params.suppress = false;
        }
      }
    }

    for (var ii = 0; ii < abcTune.lines.length; ii++) {
      var line = abcTune.lines[ii];

      if (line.staff){
        staffLineCount++;
      }
      
      // MAE 27Nov2023
      // If tab param "firstStaffOnly", remove the tab label after the first staff
      if (staffLineCount > 1){
        if (tabs && (tabs.length > 0)){
          var nTabs = tabs.length;
          for (var kk=0;kk<nTabs;++kk){
            if (tabs[kk].params.firstStaffOnly){
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
              tabPlugin.instance = new tabPlugin.classz();
              // plugin.init(tune, tuneNumber, args, ii);
              // call initer first
              tabPlugin.instance.init(abcTune,
                tabPlugin.tuneNumber,
                tabPlugin.params,
                jj
              );
            }
            // render next
            tabPlugin.instance.render(renderer, line, jj);
          }
        }
      }  
    }
  },

  /**
   * called once internally to register internal plugins
   */
  init: function () {
    // just register plugin hosted by abcjs 
    if (!this.inited) {
      this.register(new ViolinTablature());
      this.register(new GuitarTablature());
      this.inited = true;
    }
  }
};


module.exports = abcTablatures ;
