<template>
	<div class="sandbox-container">
		<nav>
			<div class="tab-container">
			<button @click="selected = 'options'" :class="optionsClass">Options</button>
			<button @click="selected = 'demo'" :class="demoClass">Demo</button>
			<button @click="selected = 'source'" :class="sourceClass">Source Code</button>
			</div>
			<button @click="download" class="download">Download Working Demo</button>
		</nav>
		<div class="options" v-if="selected === 'options'">
		<sandbox-input></sandbox-input>
		</div>

		<div class="demo" v-if="selected === 'demo'">
		<sandbox-output></sandbox-output>

		</div>

		<div class="source-code" v-if="selected === 'source'">
		<sandbox-code ref="code"></sandbox-code>
		</div>

	</div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import SandboxInput from "./SandboxInput.vue";
import SandboxOutput from "./SandboxOutput.vue";
import SandboxCode from "./SandboxCode.vue";
export default {
	name: "sandbox-container",
	components: {SandboxCode, SandboxOutput, SandboxInput},
	computed: {
		...mapGetters([
			'fullDemo',
			'filename',
		]),
		optionsClass() {
			let k = [ 'tab' ];
			if (this.selected === 'options')
				k.push("selected");
			return k;
		},
		demoClass() {
			let k = [ 'tab' ];
			if (this.selected === 'demo')
				k.push("selected");
			return k;
		},
		sourceClass() {
			let k = [ 'tab' ];
			if (this.selected === 'source')
				k.push("selected");
			return k;
		},
	},
	data() {
		return {
			selected: 'options',
		}
	},
	methods: {
		...mapMutations({
			'setIsDownloading' : 'isDownloading',
		}),
		download() {
			this.setIsDownloading(true);
			const url = "data:application/txt," + encodeURIComponent(this.fullDemo);
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute("style", "display: none;");
			link.href = url;
			link.download = this.filename;
			link.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
			this.setIsDownloading(false);
		}
	}
}
</script>

<style scoped>
nav {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}
.tab-container {
	border-bottom: 2px solid #5c5c5c;
	padding: 0 10px;
}
button {
	font-size: 1em;
	padding: 5px 10px;
	background: #9ce9c7;
	border: 1px solid #5c5c5c;
	border-radius: 4px;
}

button.tab {
	border-radius: 8px 8px 0 0;
	border-bottom: none;
}
button.tab.selected {
	background: #ffffff;
	font-weight: bold;
}
button:hover {
	background-color: #3FB07C;
	color: white;
}
button.selected:hover {
	background: #ffffff;
	color: inherit;
}
button.tab.selected:after {
	content: " ";
	position: absolute;
	border-bottom: 2px solid white;
	bottom: -2px;
	width: 100%;
	left: 0;
}
</style>
