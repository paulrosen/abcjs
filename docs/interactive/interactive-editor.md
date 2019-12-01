# Interactive Editor

There is a built in system for instantly updating the visual music as the end user is typing an ABC string into a textarea.

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

## Example

```html
<textarea id="abc"></textarea>
<div id="warnings"></div>
<div id="paper"></div>
```
```javascript
window.onload = function() {
    abc_editor = new abcjs.Editor("abc", { 
        canvas_id: "paper", 
        warnings_id:"warnings" 
    });
}
```

<abcjs-editor :abc="`X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
`"></abcjs-editor>


## Constructor

Call this constructor to link a textarea with a div that should display the music:
```javascript
let editor = new abcjs.Editor(editArea, editorParams);
```

| Edit parameters | Description |
| ------------- | ----------- |
| `editArea` | If it is a string, then it is an HTML id of a textarea control. Otherwise, it should be an instantiation of an object that expresses the `EditArea` interface. |
| `editorParams` | Hash of parameters for the editor. |

## Editor params

| editorParams | Description |
| ------------- | ----------- |
| `canvas_id` or `paper_id` | HTML id to draw in. If not present, then the drawing happens just below the editor. |
| `generate_midi` | if present, then midi is generated. |
| `midi_id` | if present, the HTML id to place the midi control. Otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"inline-midi midi-%d"`. |
| `midi_download_id` | if present, the HTML id to place the midi download link. Otherwise, if `midi_id` is present it is placed there, otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"download-midi midi-%d"`.|
| `generate_warnings` | if present, then parser warnings are displayed on the page. |
| `warnings_id` | if present, the HTML id to place the warnings. Otherwise they are placed in the same div as the paper. |
| `onchange` | if present, the callback function to call whenever there has been a change. |
| `gui` | if present, the paper can send changes back to the editor (presumably because the user changed something directly.) |
| `abcjsParams` | options to send to abcjs when re-rendering both the visual and the midi. |
| `indicate_changed` | the dirty flag is set if this is true. |

## Available methods

| Editor entry points | Description |
| ------------- | ----------- |
| `setReadOnly(bool)` |adds or removes the class abc_textarea_readonly, and adds or removes the attribute readonly=yes |
| `setDirtyStyle(bool)` | adds or removes the class abc_textarea_dirty |
| `renderTune(abc, parserParams, domElement)` | Immediately renders the tune. (Useful for creating the SVG output behind the scenes, if div is hidden) |
| `modelChanged()` | Called when the model has been changed to trigger re-rendering |
| `parseABC()` | Called internally by fireChanged() -- returns true if there has been a change since last call. |
| `updateSelection()` | Called when the user has changed the selection. This calls the engraver_controller to show the selection. |
| `fireSelectionChanged()` | Called by the textarea object when the user has changed the selection. |
| `paramChanged(engraverParams)` | Called to signal that the engraver params have changed, so re-rendering should occur. |
| `fireChanged()` | Called by the textarea object when the user has changed something. |
| `setNotDirty()` | Called by the client app to reset the dirty flag |
| `isDirty()` | Returns true or false, whether the textarea contains the same text that it started with. |
| `highlight(abcelem, tuneNumber, classes)` | Called by the engraver_controller to highlight an area. |
| `pause(bool)` | Stops the automatic rendering when the user is typing. |
| `pauseMidi(shouldPause)` | Stops the automatic re-rendering of the MIDI. |

