<template>
	<div class="abcjs-editor">
		<textarea id="abc" v-html="abc"></textarea>
		<div id="warnings"></div>
		<div id="paper"></div>
	</div>
</template>

<script>
	import Vue from 'vue';

	export default {
		name: "abcjs-editor",
		props: {
			abc: {
				type: String,
				required: true
			}
		},
		mounted() {
			Vue.nextTick(() => {
				const abcjs = require('abcjs');
				const abc_editor = new abcjs.Editor("abc", {
					canvas_id: "paper",
					warnings_id: "warnings"
				});
			});
		}
	}
</script>

<style>
	#warnings {
		color: red;
	}
</style>
