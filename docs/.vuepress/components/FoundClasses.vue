<template>
	<div class="found-classes">
		<div class="checkboxes">
			<label v-for="cls in classNames"><input type="checkbox" v-model="checkedClasses" :value="cls"> {{cls}}</label>
		</div>
		<div class="language- my-code" v-if="selector">
			var paper = document.querySelector("{{target}}");<br>
			var elements = paper.querySelectorAll("{{selector}}");
		</div>
	</div>
</template>

<script>
	import { nextTick } from 'vue';

	export default {
		name: "found-classes",
		watch: {
			target() {
				this.redraw();
			},
			checkedClasses: function (val) {
				const paper = document.querySelector(this.target);
				const svg = paper.querySelector("svg");
				const elements = svg.querySelectorAll('[fill]');
				elements.forEach((el) => {
					if (el.getAttribute("fill") !== "none")
						el.setAttribute("fill", "#000000");
					if (el.getAttribute("stroke") !== "none")
						el.setAttribute("stroke", "#000000");
				});

				this.selector = (val.length > 0) ? "." + val.join(".") : "";
				this.highlightSelectedClasses();
			},
		},
		props: {
			target: {
				type: String,
				required: true
			},
		},
		data() {
			return {
				classNames: [],
				checkedClasses: [],
				selector: "",
			}
		},
		mounted() {
			nextTick(() => {
				this.redraw();
			});
		},
		methods: {
			redraw() {
				if (this.target) {
					const svg = document.querySelector(this.target);
					if (svg) {
						const elements = svg.querySelectorAll('*');

						let classes = [];
						elements.forEach((el) => {
							const arr = el.classList ? el.classList.value.split(" ") : [];
							classes = classes.concat(arr);
						});
						this.classNames = [...new Set(classes)].filter(Boolean).sort();
					}
				}
			},
			highlightSelectedClasses() {
				if (this.selector.length > 0) {
					document.getElementById('paper').querySelectorAll(this.selector).forEach((el) => {
						if (el.getAttribute("fill") !== "none")
							el.setAttribute("fill", "#3D9AFC");
						if (el.getAttribute("stroke") !== "none")
							el.setAttribute("stroke", "#3D9AFC");
					});
				}
			},
		},
	}
</script>

<style scoped>
	.checkboxes {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	label {
		display: inline-block;
		width: 180px;
	}
</style>
