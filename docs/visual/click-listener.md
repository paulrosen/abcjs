# Click Listener

If you want to get information about what the user has clicked on, you can set up a callback function. The callback function looks like this:

```javascript
function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
}

renderAbc("paper", abcString, { clickListener: clickListener })
```

Here is the data that is returned to you:

## abcelem

The internal object that is associated with the element clicked. Use a debugger to see what is available.

::: tip Tip
This object is subject to change as the library gets more functionality. There is not a guarantee that it will stay backwards compatible. But that said, the structure of this object doesn't change much and usually just adds properties.
:::


## tuneNumber

If there are more than one tune in the original abcString, this reports which tune was clicked on.

## classes

The css classes of the element that was clicked. (This requires the parameter `{ add_classes: true }`).

## analysis

An object containing the following info about the item clicked:
 ```
{
    line: 0, // zero-based line
    measure: 0, // zero-based measure from the beginning of the line
    voice: 0, // zero-based voice 
    staffPos: { top: 0, height: 0, zero: 0 } // the Y-coordinates in the SVG for the staff system that contains the item. "zero" is the Y-coordinate of the middle-C.
    name: "", // The name of the parent item that was clicked.
	clickedName: "", // If the item is compound, then this is the name on the part that was clicked.
	parentClasses: "", // The classes on the parent item
	clickedClasses: "", // The classes on the clicked element
	selectableElement: HTMLElement, // The parent element that was selected. 
}
```
The svg elements may be wrapped in a `<g>` because there is more than one element that is contained. For instance, in `[Ac]` (when L:1/8), there is a `<g>` that contains an element for a notehead on the `A` line, a notehead on the `c` line, a stem, and an eighth note flag. Clicking anywhere on that `<g>` will cause the name to be "note" but if you click directly on a notehead, the name will still be "note" but the clickedName will be "A" or "c".


## drag

See the [Dragging](./dragging.md) page for more details.

## mouseEvent

The original event that triggered this callback.

Note that it might be more useful to use `analysis.selectableElement` than to use `mouseEvent.target`. The latter will be what the mouse actually clicked on, but that might not be what the user was intending because of two cases: If the SVG itself was clicked on, then the closest element will be returned as clicked because otherwise the target can be really narrow. Second, if the element is compound (for instance the dynamic `mp`) then the user will have clicked on either the `m` or the `p` but probably the intent was to select the immediate parent, which is a `<g>` tag that contains the info on the element.
