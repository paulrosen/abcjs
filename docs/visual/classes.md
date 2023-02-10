# Classes

## Class Names

If you use, `{ add_classes: true }`, then the following classes are attached to various elements:

| class | description |
| ------------- | ----------- |
| abcjs-annotation | Text added with the `"^..."` format. |
| abcjs-author | The author text |
| abcjs-bar | The bar lines. |
| abcjs-bar-number | The bar numbers. |
| abcjs-beam-elem | The beams connecting eighth notes together. |
| abcjs-brace | The brace on the left side of the staff (like for piano music.) |
| abcjs-bracket | The bracket on the left side of the staff. |
| abcjs-chord | The chord symbols, specified in quotes. |
| abcjs-clef | All clefs |
| abcjs-composer | The composer text |
| abcjs-d0-25, etc. | The duration of the note. (Replace the dash with a decimal point. That is, the example is a duration of 0.25, or a quarter note.) |
| abcjs-decoration | Everything to do with the extra symbols, like crescendo. |
| abcjs-defined-text | Text that appears between the lines of music, created with `%%text`. |
| abcjs-dynamics | The dynamics markings: `p` for instance. Also the crescendo mark. |
| abcjs-end-m0-n0 | Added to slurs to indicate the ending note. |
| abcjs-ending | The line and decoration for the 1st and 2nd ending. |
| abcjs-key-signature | All key signatures |
| abcjs-l0, abcjs-l1, etc. | (lower case L, followed by a number) The staff line number, starting at zero. | 
| abcjs-ledger | ledger line. |
| abcjs-lyric | The lyric line. |
| abcjs-m0, abcjs-m1, etc. | The measure count from the START OF THE LINE. |
| abcjs-mm0, abcjs-mm1, etc. | The measure count from the START OF THE TUNE. |
| abcjs-meta-bottom | Everything that is printed after all the music. |
| abcjs-meta-top | Everything that is printed before the first staff line. |
| abcjs-n0, abcjs-n1, etc. | The note count from the START OF THE MEASURE. |
| abcjs-note | Everything to do with a note. |
| abcjs-note_selected | This is the element that the user has clicked on. |
| abcjs-p-1, abcjs-p1, etc. | The y-position of the note (where middle-C is zero). |
| abcjs-part | Each part marking in the music itself. |
| abcjs-part-order | The part order indicator at the top. |
| abcjs-rest | Everything to do with a rest. |
| abcjs-rhythm | The rhythm text. |
| abcjs-slur | Slurs and ties. (backwards compatible) |
| abcjs-start-m0-n0 | Added to slurs to indicate the beginning note. |
| abcjs-tie | Tie. |
| abcjs-legato | Slur. Because "abcjs-slur" was historically used to indicate either a slur or a tie this indicates only a slur. |
| abcjs-staff  | The horizontal lines that make up the staff. |
| abcjs-staff-extra | Clefs, key signatures, time signatures. |
| abcjs-stem | |
| abcjs-subtitle | The subtitle, both on the top and inserted in the middle |
| abcjs-symbol | Any special symbol, like a trill. |
| abcjs-tempo | The tempo marking. |
| abcjs-text | Extra text that is not part of the music. |
| abcjs-time-signature | All time signatures |
| abcjs-title | The line specified by T: |
| abcjs-top-line | This marks the top line of each staff. This is useful if you are trying to find where on the page the music has been drawn. |
| abcjs-top-of-system | This marks the top of each set of staves. This is useful if you are trying to find where on the page the music has been drawn. |
| abcjs-triplet | The extra markings that indicate a triplet. (But not the notes themselves.) |
| abcjs-unaligned-words | Lyrics at the bottom that aren't lined up with notes. |
| abcjs-v0, abcjs-v1, etc. | the voice number, starting at zero. |

## Test Tune

Paste in any ABC you want here and see how that affects the classes below:

<example-tune-book v-if="abcjsReady" :callbacks="callbacks" :tune-id="32"></example-tune-book>

<script>
	import { waitForAbcjs } from '../../../wait-for-abcjs';
	export default {
		async mounted() {
            await waitForAbcjs()
            this.abcjsReady = true;
			setTimeout(() => {
				this.callbacks = [this.$refs.foundClasses];
			}, 500);
		},
		data() {
			return {
				abcjsReady: false,
				callbacks: [],
			};
		},
	}
</script>

## Found Classes

Select the following classes to see what they point to. (They are ANDed together.)

<found-classes ref="foundClasses" target="#paper"></found-classes>

## CSS Possibilities

### changing colors

If you want to just change everything to one other color, you can do something like:
```
<style>
    svg {
        fill: pink;
        stroke: pink;
    }
<style>
```
If you want more control, you can use the classes. For instance, to turn only the horizontal staff lines pink, do this instead:
```
<style>
    svg .abcjs-staff {
        fill: pink;
        stroke: pink;
    }
<style>
```
