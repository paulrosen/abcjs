<template>
	<ClientOnly>
		<div ref='paper' class="render-abc"></div>
	</ClientOnly>
</template>

<script>
	import Vue from 'vue';
	export default {
		name: "render-abc",
		props: {
			abc: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				visualObj: null,
				defaultOptions: { paddingleft: 0, paddingright: 0, responsive: "resize" },
			};
		},
		mounted() {
			Vue.nextTick(() => {
				const abcjs = require('../../../index');
				const el = this.$refs.paper;
				this.visualObj = abcjs.renderAbc(el, this.abc, this.defaultOptions);
			});
		},
		methods: {
			getObj() {
				return this.visualObj[0];
			}
		}
	}
</script>
