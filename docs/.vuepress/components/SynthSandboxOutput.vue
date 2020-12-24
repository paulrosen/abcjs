<template>
	<div class="synth-sandbox-output">
		TODO
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	name: "synth-sandbox-output",
	computed: {
		...mapGetters([
			'usingNode',
			'soundfont',
			'sheetMusic',
			'cursor',
			'changes',
			'playbackWidget',
			'large',
			'loop',
			'restart',
			'play',
			'progress',
			'warp',
			'clock',
			'usingCallbacks',
			'metronome',
			'tempo',
			'stereo',
			'instrument',
			'transpose',
			'noChords',
			'noVoice',
			'tweak',
			'midi',
			'playImmediate',
		]),
	},
}
</script>

<style scoped>
pre {
	color: white;
}
</style>
