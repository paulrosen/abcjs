<template>
	<div class="abcjs-editor">
		<textarea ref="textarea" id="abc"></textarea>
		<div id="warnings"></div>
		<div id="paper"></div>
	</div>
</template>

<script>
import { waitForAbcjs } from '../wait-for-abcjs';

	export default {
		name: "abcjs-editor",
		watch: {
			callbacks() {
				this.onchange();
			},
			abc() {
				this.$refs.textarea.value = this.abc;
				const abc_editor = new abcjs.Editor("abc", {
					canvas_id: "paper",
					warnings_id: "warnings",
					onchange: this.onchange,
					abcjsParams: { add_classes: true, responsive: "resize" },
					indicate_changed: true,
				});
			}
		},
		props: {
			abc: {
				type: String,
				required: true
			},
			callbacks: {
				type: Array,
				required: false
			},
		},
		async mounted() {
			await waitForAbcjs()
			this.$refs.textarea.value = this.abc;
			const abc_editor = new abcjs.Editor("abc", {
				canvas_id: "paper",
				warnings_id: "warnings",
				onchange: this.onchange,
				abcjsParams: { add_classes: true, responsive: "resize" },
				indicate_changed: true,
			});
		},
		methods: {
			onchange() {
				if (this.callbacks) {
					this.callbacks.forEach(fn => {
						if (fn.redraw)
							fn.redraw(this.$refs.textarea.value);
					})
				}
			},
		},
	}
</script>

<style>
	#warnings {
		color: red;
	}
</style>
