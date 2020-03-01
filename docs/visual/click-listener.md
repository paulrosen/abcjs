# Click Listener

If you want to get information about what the user has clicked on, you can set up a callback function. The callback function looks like this:

```javascript
function clickListener(abcelem, tuneNumber, classes, analysis, drag) {
}

renderAbc("paper", abcString, { clickListener: clickListener })
```

Here is the data that is returned to you:

## abcelem

TODO

## tuneNumber

If there are more than one tune in the original abcString, this reports which tune was clicked on.

## classes

TODO

## analysis

TODO

## drag

TODO
