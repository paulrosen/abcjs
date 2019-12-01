# Tune Book

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

The following assumes you've created a `TuneBook` object like this: 

```
var tunebook = ABCJS.TuneBook(tunebookString);
```

| `TuneBook` Object | Description |
| ------------- | ----------- |
| `tuneHash = tunebook.getTuneById(id)` | The `id` is the value in the tune's `X:` field. The returns the **first** occurrence of a tune with that ID. |
| `tuneHash = tunebook.getTuneByTitle(title)` | The `title` is the value in the tune's first `T:` field. The returns the **first** occurrence of a tune with that title.  |
| `tunebook.tunes` | Array of `tune` hash. |
| `tunebook.header` | Any ABC `%%directives` that appear at the top of the `tunebookString`, before the first tune. |

| `tuneHash` | description |
| ------------- | ----------- |
| `abc` |  String in ABC format. |
| `startPos` | Character position (zero-based) in the original tunebook where the tune starts. |
