<template>
	<ClientOnly>
		<div ref='audio' class="render-audio"></div>
	</ClientOnly>
</template>

<script>
	import Vue from 'vue';
	import css from 'abcjs/abcjs-audio.css';
	export default {
		name: "render-audio",
		props: {
			obj: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				synthControl: null,
			};
		},
		mounted() {
			Vue.nextTick(() => {
				const abcjs = require('abcjs');
				this.synthControl = new abcjs.synth.SynthController();
				this.synthControl.load(this.$refs.audio, null, {displayLoop: true, displayRestart: true, displayPlay: true, displayProgress: true, displayWarp: true});
				this.setTune();
			});
		},
		methods: {
			setTune() {
				if (this.obj.tune)
					this.synthControl.setTune(this.obj.tune.getObj(), false);
				else {
					setTimeout(() => {
						this.setTune();
					}, 100);
				}
			},
		},
	}
</script>
