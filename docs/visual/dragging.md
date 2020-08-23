# Selecting and Dragging Elements

You can select which type of elements on the page you want to be selectable. If the element is a note, then it can also be draggable.

## Dragging

Using the option:
```
abcjs.renderAbc(..., ..., { dragging: true, clickListener: function() {...} })
```

turns on dragging. The user will be able to click on an element, (or use the tab key to go through the elements) and, if it is a draggable element, move it visually. When the user has finished moving the element, the click listener is called. The underlying music is not changed to reflect the user's action. The clickListener function should modify the ABC string and rerender if the user has made a change.

The fifth argument in the clickListener function is the results of the drag, if any. It is an object that looks like:
```
{
  step: number,
  setSelection: function,
  index: number, 
  max: number,
}
```

`step` are the number of visual positions the note was dragged. A negative number means that the note was dragged flatter and positive means it was dragged sharper. This is a purely visual count. That is, if the note was on a line and a `1` is returned, then the note is now on the space above it.
`setSelection` is a callback to the selection function. You can call that to change the selection programmatically.
`currentIndex` is which item is selected. This number doesn't mean anything on its own, but is used to call the `setSelection` function.
`max` is the number of selectable items in the music.

## Styles
Using the options:
```
abcjs.renderAbc(..., ..., { selectionColor: cssColor, dragColor: cssColor })
```
where `cssColor` is a legal format for a color allows you to control the look of the selection and dragging. For instance, you can use `"blue"` or `#0000ff`.

## Specifying what is selectable.

The following categories of musical items can be set to be selectable independently of each other:

```
	"author"
	"bar"
	"brace"
	"clef"
	"composer"
	"dynamicDecoration"
	"ending"
	"extraText"
	"freeText"
	"keySignature"
	"note"
	"part"
	"partOrder"
	"rhythm"
	"slur"
	"subtitle"
	"tempo"
	"timeSignature"
	"title"
	"unalignedWords"
	"voiceName"
```

Using the option:
```
abcjs.renderAbc(..., ..., { selectTypes: [] })
```

where the array is a list of items you want to allow the user to select. (Rests are included in the note category.)

If, instead of an array, you use the value `{ selectTypes: true }` then all of the items are selectable.

If, instead of an array, you use the value `{ selectTypes: false }` then none of the items are selectable.

If `selectTypes` is not passed in, then nothing is selectable (the same behavior as passing `false`), but notes and rests are clickable. (That is, the [clickListener](./click-listener.md) function will be called on a click. ) This mimics the previous behavior so it is backwards compatible.
