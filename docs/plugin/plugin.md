# Plugin

The abcjs plugin renders all the abc in a page (determined as a new line beginning with X:).

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

To use, simply include the plugin version in the page:

```javascript
<script src="abcjs_plugin_5.10.3-min.js" type="text/javascript"></script>
```

Certain options for the plugin can be changed like this, if executed on page load, just after including the plugin file:

```html
<script type="text/javascript">
  ABCJS.plugin.hide_abc = true;
</script>
```

The options available in abc_plugin are:

| Option | Description |
| ------------- | ----------- |
| `show_midi` | NO LONGER SUPPORTED: This option has been removed. |
| `hide_abc` | Whether the abc text should be hidden or not. (false by default) since 1.0.2 |
| `render_before` | Whether the rendered score should appear before the abc text. (false by default) since 1.0.2 |
| `midi_options` | NO LONGER SUPPORTED: This option has been removed. |
| `auto_render_threshold` | Number of tunes beyond which auto rendering is disabled; instead, each tune is accompanied by a "show" button. (default value is 20) since 1.0.2 |
| `show_text` | Text to be included on the "show" button before the tune title. (default value is "show score for: ") since 1.0.2 |
| `render_options` | The options to be used for the `engraverParams` |
| `render_classname` | The class name to use for the resulting SVG (default value is "abcrendered") |
| `text_classname` | The class name to use for wrapping the found ABC text (default value is "abctext") |

When abcjs plugin finds an abc tune, it wraps a `div.abctext` around it and renders it into a `div.abcrendered`. The show button is an `a.abcshow`. These hooks can be used for styling. since 1.0.2


## abcjs greasemonkey script

Just include the greasemonkey script in either FireFox or Chrome. You will then get a button that will begin the scan of the website.
