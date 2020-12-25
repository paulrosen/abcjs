<template>
	<div class="synth-sandbox-code">
		<h3>Header</h3>
		<code>
		{{declaration}}
		</code>
		<h3>HTML</h3>
		<code>
		{{sheetMusicHtml}}
		</code>
		<h3>JavaScript</h3>
		<code>
		{{sheetMusicJs}}
		</code>
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
		},
		sheetMusicHtml() {
			if (this.sheetMusic)
				return '<div id="paper"></div>';
			return '';
		},
		sheetMusicJs() {
			const target = this.sheetMusic ? 'paper' : '*';
			const abcjs = this.usingNode ? 'abcjs' : 'ABCJS';
			return `var visualObj = ${abcjs}.renderAbc("${target}", abcString, {});`;
		}
	},
}
</script>

<style scoped>
code {
	background: black;
	color: white;
	width: 100%;
	display: inline-block;
	font-size: 1.1em;
}
</style>
