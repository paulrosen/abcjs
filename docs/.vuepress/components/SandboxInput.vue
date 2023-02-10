<template>
	<div class="sandbox-input">
		<div>
		<field-set label="Setup">
			<template v-slot:controls>
				<check-box
					label="I am using the Node ecosystem"
					value="usingNode">
				</check-box>
			</template>
		</field-set>

		<field-set label="Visual">
			<template v-slot:controls>
				<check-box
					label="Show sheet music"
					:sub-options="[
        { text: 'The width of the music should change with the width of the display', value: 'responsive' },
        { text: 'Cursor should follow the playback', value: 'cursor' },
        { text: 'Measures should hide as they finish playing', value: 'hideMeasures'},
        { text: 'I want to style the chords like a fake book', value: 'jazzChords'}
    ]"
					value="sheetMusic">
				</check-box>
			</template>
		</field-set>

		<radio-group
			label="Changes"
			name="changes"
			:options="[
        { text: 'The tune is determined programmatically', value: 'programmatic' },
        { text: 'User changes the tune with a visual editor', value: 'drag' },
        { text: 'User changes the tune with a text editor', value: 'editor' },  ]">
		</radio-group>

		<field-set label="Audio Control">
			<template v-slot:controls>
				<check-box
					label="Show playback widget"
					:sub-options="[
    { text: 'I want the large playback widget', value: 'large' },
    { text: 'Include Loop', value: 'loop' },
    { text: 'Include Restart', value: 'restart' },
    { text: 'Include Play', value: 'play' },
    { text: 'Include Progress', value: 'progress' },
    { text: 'Include Warp', value: 'warp' },
    { text: 'Include Clock', value: 'clock' },
    ]"
					value="playbackWidget"
					:disabled="!hasSound"
				>
				</check-box>
			</template>
		</field-set>
		</div>
		<div>
		<field-set label="Sound">
			<template v-slot:controls>
				<check-box
					label="I want sound"
					value="hasSound"
					:sub-options="audioOptions"
				></check-box>
			</template>
		</field-set>

		<field-set label="Timing">
			<template v-slot:controls>
				<check-box
					label="Listen for callbacks"
					value="usingCallbacks"
					:disabled="!sheetMusic"
				>
				</check-box>
			</template>
		</field-set>

		</div>
	</div>
</template>

<script>
import {mapGetters} from "vuex";
import FieldSet from "./FieldSet.vue";
import CheckBox from "./CheckBox.vue";
import RadioGroup from "./RadioGroup.vue";
export default {
	name: "sandbox-input",
	components: {RadioGroup, CheckBox, FieldSet},
	computed: {
		...mapGetters([
			'hasSound',
			'sheetMusic',
		]),
	},
	data() {
		return {
			audioOptions: [
				{ text: 'I want a metronome accompaniment', value: 'metronome' },
				{ text: 'I want to control the tempo programmatically', value: 'tempo' },
				{ text: 'I want to create a stereo effect', value: 'stereo' },
				{ text: 'I want to set the instrument(s) that are played back', value: 'instrument' },
				{ text: 'I want to transpose', value: 'transpose' },
				{ text: 'I want to turn off the chord accompaniment', value: 'noChords' },
				{ text: 'I want to turn off a voice', value: 'noVoice' },
				{ text: 'I want to be able to tweak the audio before it is created.', value: 'tweak', todo: true },
				{ text: 'I want to download a MIDI file', value: 'midi' },
				{ text: 'I want to play an arbitrary note without ABC', value: 'playImmediate' },
				{ text: 'I want to switch tunes dynamically', value: 'switchTunes', todo: true },
				{ text: 'I want to hide a voice visually but play it', value: 'hideVoice' },
				{ text: 'I want to preload notes', value: 'preload', todo: true },
				{ text: 'I want to loop some measures', value: 'loopMeasures', todo: true },
				{ text: 'I want to add swing feel', value: 'swingFeel', todo: true },
				{ text: 'I have my own soundfont', value: 'soundfont' },
			]
		}
	}
}
</script>

<style scoped>
.sandbox-input {
	display: flex;
}
.sandbox-input > div {
	width: 50%;
}
.sandbox-input > div:first-child {
	margin-right: 5px;
}
.sandbox-input > div:last-child {
	margin-left: 5px;
}
</style>
