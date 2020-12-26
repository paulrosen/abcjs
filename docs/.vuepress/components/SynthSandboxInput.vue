<template>
	<div class="synth-sandbox-input">
		<div>
		<field-set label="Setup">
			<template v-slot:controls>
				<check-box
					label="I am using the Node ecosystem"
					value="usingNode">
				</check-box>
				<check-box
					label="I have my own soundfont"
					value="soundfont">
				</check-box>
			</template>
		</field-set>

		<field-set label="Visual">
			<template v-slot:controls>
				<check-box
					label="Show sheet music"
					:sub-options="[
        { text: 'Cursor should follow the playback', value: 'cursor' },
        { text: 'Measures should hide as they finish playing', value: 'hideMeasures'}
    ]"
					value="sheetMusic">
				</check-box>
			</template>
		</field-set>

		<radio-group
			label="Changes"
			name="changes"
			:options="[
        { text: 'User changes the tune in an editor', value: 'editor' },
        { text: 'User changes the tune visually', value: 'drag' },
        { text: 'User changes the way the tune is played', value: 'params' },
        { text: 'Tune and/or parameters change programmatically', value: 'programmatic' },  ]">
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
					value="playbackWidget">
				</check-box>
			</template>
		</field-set>
		</div>
		<div>
		<field-set label="Sound">
			<template v-slot:controls>
				<check-box
					label="I want a metronome accompaniment"
					value="metronome">
				</check-box>
				<check-box
					label="I want to control the tempo programmatically"
					value="tempo">
				</check-box>

				<check-box
					label="I want to create a stereo effect"
					value="stereo">
				</check-box>

				<check-box
					label="I want to set the instrument(s) that are played back"
					value="instrument">
				</check-box>

				<check-box
					label="I want to transpose"
					value="transpose">
				</check-box>

				<check-box
					label="I want to turn off the chord accompaniment"
					value="noChords">
				</check-box>

				<check-box
					label="I want to turn off a voice"
					value="noVoice">
				</check-box>

			</template>
		</field-set>

		<field-set label="Timing">
			<template v-slot:controls>
				<check-box
					label="Listen for callbacks"
					value="usingCallbacks">
				</check-box>
			</template>
		</field-set>

		<field-set label="Other">
			<template v-slot:controls>
				<check-box
					label="I want to be able to tweak the audio before it is created."
					value="tweak">
				</check-box>

				<check-box
					label="I want to download a MIDI file"
					value="midi">
				</check-box>

				<check-box
					label="I want to play an arbitrary note without ABC"
					value="playImmediate">
				</check-box>

			</template>
		</field-set>
		</div>
	</div>
</template>

<script>
import FieldSet from "./FieldSet";
import CheckBox from "./CheckBox";
import RadioGroup from "./RadioGroup";
export default {
	name: "synth-sandbox-input",
	components: {RadioGroup, CheckBox, FieldSet},
}
</script>

<style scoped>
.synth-sandbox-input {
	display: flex;
}
.synth-sandbox-input > div {
	width: 50%;
}
.synth-sandbox-input > div:first-child {
	margin-right: 5px;
}
.synth-sandbox-input > div:last-child {
	margin-left: 5px;
}
</style>
