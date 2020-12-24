<template>
	<div class="synth-sandbox-code">
		<h3>Head</h3>
		{{declaration}}
		<h3>HTML</h3>
		<h3>JavaScript</h3>
	</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
	name: 'synth-sandbox-code',
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
		declaration() {
			if (this.usingNode)
				return 'import abcjs from "abcjs"';
			else
				return '&lt;script src="../dist/abcjs-basic.js" type="text/javascript">&lt;/script>'.replace(/&lt;/g, "<");
		}
	},
}
</script>

<style scoped>

</style>
