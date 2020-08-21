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

An object containing the line, measure, and voice that was clicked.

## drag

See the [Dragging](./dragging.md) page for more details.

## mouseEvent

The original event that triggered this callback.
