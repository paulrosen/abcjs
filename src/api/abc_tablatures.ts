/*
 * Tablature Plugins
 * tablature are defined dynamically and registered inside abcjs
 * by calling abcTablatures.register(plugin)
 * where plugin represents a plugin instance
 *
 */
import ViolinTablature from '../tablatures/instruments/violin/tab-violin';

import GuitarTablature from '../tablatures/instruments/guitar/tab-guitar';

/* extend the table below when adding a new instrument plugin */

// Existing tab classes
var pluginTab = {
  violin: "ViolinTab",
  guitar: "GuitarTab"
};

var abcTablatures = {
  inited: false,
  plugins: {},

  /**
   * to be called once per plugin for registration
   * @param {*} plugin
   */
  register: function (plugin: any) {
    var name = plugin.name;
    var tablature = plugin.tablature;
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this.plugins[name] = tablature;
  },

  setError: function (tune: any, msg: any) {
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
  preparePlugins: function (tune: any, tuneNumber: any, params: any) {
    var returned = null;
    var nbPlugins = 0;
    if (params.tablature) {
      // validate requested plugins
      var tabs = params.tablature;
      returned = [];
      for (var ii = 0; ii < tabs.length; ii++) {
        var args = tabs[ii];
        var instrument = args["instrument"];
        if (instrument == null) {
          this.setError(tune, "tablature 'instrument' is missing");
          return returned;
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        var tabName = pluginTab[instrument];
        var plugin = null;
        if (tabName) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
            instance: null
          };
          // proceed with tab plugin  init
          // plugin.init(tune, tuneNumber, args, ii);
          returned.push(pluginInstance);
          nbPlugins++;
        } else {
          // unknown tab plugin
          //this.emit_error('Undefined tablature plugin: ' + tabName)
          this.setError(tune, "Undefined tablature plugin: " + instrument);
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
  layoutTablatures: function (renderer: any, abcTune: any) {
    var tabs = abcTune.tablatures;
    // chack tabs request for each staffs
    for (var ii = 0; ii < abcTune.lines.length; ii++) {
      var line = abcTune.lines[ii];
      var curStaff = line.staff;
      if (curStaff) {
        for (var jj = 0; jj < curStaff.length; jj++) {
          if (tabs[jj]) {
            // tablature requested for staff
            var tabPlugin = tabs[jj];
            if (tabPlugin.instance == null) {
              tabPlugin.instance = new tabPlugin.classz();
              // plugin.init(tune, tuneNumber, args, ii);
              // call initer first
              tabPlugin.instance.init(
                abcTune,
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
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      this.register(new ViolinTablature());
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      this.register(new GuitarTablature());
      this.inited = true;
    }
  }
};

export default abcTablatures;
