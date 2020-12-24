<template>
	<div class="synth-sandbox-output">
		<pre>usingNode {{ usingNode }}
soundfont {{ soundfont }}
sheetMusic {{ sheetMusic }}
cursor {{ cursor }}
changes {{ changes }}
playbackWidget {{ playbackWidget }}
large {{ large }}
loop {{ loop }}
restart {{ restart }}
play {{ play }}
progress {{ progress }}
warp {{ warp }}
clock {{ clock }}
usingCallbacks {{ usingCallbacks }}
metronome {{ metronome }}
tempo {{ tempo }}
stereo {{ stereo }}
instrument {{ instrument }}
transpose {{ transpose }}
noChords {{ noChords }}
noVoice {{ noVoice }}
tweak {{ tweak }}
midi {{ midi }}
playImmediate {{ playImmediate }}</pre>
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
