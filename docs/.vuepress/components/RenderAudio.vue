<template>
	<ClientOnly>
		<div ref='audio' class="render-audio"></div>
	</ClientOnly>
</template>

<script>
	import Vue from 'vue';
	export default {
		name: "render-audio",
		props: {
			obj: {
				type: Object,
				required: true
			}
		},
		mounted() {
			Vue.nextTick(() => {
				const abcjs = require('abcjs');
				let synthControl = new abcjs.synth.SynthController();
				synthControl.load(this.$refs.audio, null, {displayLoop: true, displayRestart: true, displayPlay: true, displayProgress: true, displayWarp: true});
				synthControl.setTune(this.obj.getObj(), false);
			});
		}
	}
</script>
