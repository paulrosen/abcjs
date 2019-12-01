# Timing Callbacks

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

| `timingParams` | Default | Description |
| ------------- | ------- | ----------- |
| `qpm` | whatever is in the Q: field | Number of beats per minute. |
| `extraMeasuresAtBeginning` | 0 | Don't start the callbacks right away, but insert these number of measures first. |
| `beatCallback` | null | Called for each beat passing the beat number (starting at 0). |
| `eventCallback` | null | Called for each event (either a note, a rest, or a chord, and notes in separate voices are grouped together.) |
| `lineEndCallback` | null | Called at the end of each line. (This is useful if you want to be sure the music is scrolled into view at the right time.) See `lineEndAnticipation` for more details. |
| `lineEndAnticipation` | 0 | The number of milliseconds for the `lineEndCallback` to anticipate end of the line. That is, if you want to get the callback half a second before the end of the line, use 500. |
| `beatSubdivisions` | 1 | How many callbacks should happen for each beat. This allows finer control in the client, for instance, to handle a progress bar. |

| `animationParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `hideFinishedMeasures` | false | true or false |
| `hideCurrentMeasure` | false | true or false |
| `showCursor` | false | true or false |
| `bpm` | whatever is in the Q: field | Number of beats per minute. |

NOTE: To use animation, you MUST have `{ add_classes: true }` in the `engraverParams`. Also, the cursor is not visible unless you add some css. Often this will be something like either `.cursor { background-color: #ffffc0; opacity: 0.5 }` or `.cursor { border-left: 1px solid black; }`
