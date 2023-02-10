<template>
	<div class="sandbox-output">
		<div v-html="sheetMusicCss"></div>
		<button class="run-demo" v-if="!running" @click="onloadCode">Run Demo</button>
		<div :class="`demo ${running ? 'running' : ''}`" v-html="sheetMusicHtml"></div>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import { nextTick } from "vue"

export default {
	name: "sandbox-output",
	computed: {
		...mapGetters([
			'sheetMusicCss',
			'sheetMusicJsNode',
			'sheetMusicHtml',
		]),
	},
	watch: {
		sheetMusicJsNode() {
			this.running = false;
		},
	},
	data() {
		return {
			running: false,
		}
	},
	methods: {
		onloadCode() {
			this.running = true;
			const abcString = `T: Cooley's
M: 4/4
L: 1/8
R: reel
K: Emin
|:D2|"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|
"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|"Em"DEFD E2:|
|:gf|"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|
"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|"Em"DEFD E2:|`;

			nextTick().then(() => {
				eval(this.sheetMusicJsNode)
			})
		}
	}
}
</script>

<style>
.sandbox-output .demo {
	border: 1px solid #888888;
	padding: 10px;
	background: #fefffa;
	box-shadow: -1px -1px 1px #aaaaaa, 1px 2px 4px #aaaaaa;
	border-top: none;
	border-left: none;
	width: 800px;
	transform: scale(.9);
	transform-origin: top left;
	transition: opacity 4s cubic-bezier(.25,.8,.25,1);
	opacity: 0;
}
.sandbox-output .demo.running {
	opacity: 1;
}

.sandbox-output #paper {
	max-width: 780px;
}

.sandbox-output button {
	font-size: 1em;
	padding: 5px 10px;
	background: #e2fdf1;
	border: 1px solid #5c5c5c;
	border-radius: 4px;
}

.sandbox-output button:hover {
	background-color: #3FB07C;
	color: white;
}
</style>
