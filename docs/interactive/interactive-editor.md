# Interactive Editor

There is a built in system for instantly updating the visual music as the end user is typing an ABC string into a textarea.

## Constructor

Call this constructor to link a textarea with a div that should display the music:
```javascript
let editor = new abcjs.Editor(editArea, editorParams);
```

| Editor Parameters | Description |
| ------------- | ----------- |
| `editArea` | If it is a string, then it is an HTML id of a textarea control. Otherwise, it should be an instantiation of an object that expresses the `EditArea` interface. |
| `editorParams` | Hash of parameters for the editor. |

## Editor Params

| editorParams | Description |
| ------------- | ----------- |
| `canvas_id` or `paper_id` | HTML id to draw in. If not present, then the drawing happens just below the editor. This can either be an ID or the actual HTML element. |
| `generate_warnings` | If present, then parser warnings are displayed on the page. The warnings are displayed just above the music. |
| `warnings_id` | If present, the HTML id to place the warnings. This supersedes `generate_warnings`. This can either be an id or the actual HTML element. |
| `onchange` | If present, the callback function to call whenever there has been a change in the ABC string. |
| `selectionChangeCallback` | If present, the callback function to call whenever there has been a change of selection. |
| `abcjsParams` | Options to send to abcjs when re-rendering both the visual and the audio. |
| `indicate_changed` | The dirty flag is set if this is true. When the user types in the textarea then the class `abc_textarea_dirty` is added to the textarea. Also see the `isDirty` and `setNotDirty` methods below. |
| `synth` | If present, add an audio control. This is an object. See below for the possible properties. Note: if the browser doesn't support synth, then this parameter has no effect. |

### Deprecated parameters:

The following parameters are still supported, but they are for the old style of audio generation that used midi.js.

| editorParams | Description |
| ------------- | ----------- |
| `generate_midi` | if present, then midi is generated. |
| `midi_id` | if present, the HTML id to place the midi control. Otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"inline-midi midi-%d"`. |
| `midi_download_id` | if present, the HTML id to place the midi download link. Otherwise, if `midi_id` is present it is placed there, otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"download-midi midi-%d"`.|

## Synth Properties

This is the object that is passed into the editor in the `synth` property. If this is present, then a `SynthController` object is created to handle the audio.

| Property | Description |
|---|---|
| el | Either a CSS selector or an HTML element for where to place the audio control. |
| cursorControl | Optional: The callback object of type `CursorControl` if you want to get notified when timing events happen. (See the [audio](https://paulrosen.github.io/abcjs/audio/synthesized-sound.html#cursorcontrol-object) section for more details.) |
| options | Optional: The options to pass directly to the [SynthController](https://raw.githubusercontent.com/paulrosen/abcjs/audio/synthesized-sound.html#audioparams) object. |

## Available Methods

| Editor entry points | Description |
| ------------- | ----------- |
| `setReadOnly(bool)` | adds or removes the class `abc_textarea_readonly`, and adds or removes the attribute `readonly`. |
| `updateSelection()` | Called when the user has changed the selection. This calls the engraver_controller to show the selection. |
| `fireSelectionChanged()` | Called by the textarea object when the user has changed the selection. |
| `fireChanged() | Can be called if the textarea is changed programmatically but the editor doesn't detect it. (For instance, useful in Vue when using `modelValue`) |
| `paramChanged(abcjsParams)` | Called to set the abcjsParams after the editor has been created. The music is re-rendered immediately. |
| `setNotDirty()` | Called by the client app to reset the dirty flag. (For instance, when the user saves their work.) |
| `isDirty()` | Returns true or false, whether the textarea contains the same text that it started with. |
| `pause(bool)` | Stops the automatic rendering when the user is typing. |
| `millisecondsPerMeasure()` | Called to return the number of milliseconds in a measure for the first tune in the editor. |
| `synthParamChanged(options)` | Called to replace the options passed in when the editor is created. It replaces the options here: `{ synth: { options: originalOptions } }` |

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

