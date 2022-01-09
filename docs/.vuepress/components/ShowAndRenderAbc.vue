<template>
	<div class="show-and-render">
		<div class="language- extra-class"><pre class="language-text"><code>{{abc}}</code></pre></div>
		<render-abc :abc="abc" :options="options"></render-abc>
	</div>
</template>

<script>
	import { nextTick } from 'vue';
	import RenderAbc from "./RenderAbc";
	export default {
		name: "show-and-render-abc",
		components: {RenderAbc},
		props: {
			abc: {
				type: String,
				required: true
			},
			options: {
				type: Object,
				required: false,
				default: {}
			}
		},
		data() {
			return {
				visualObj: null,
				defaultOptions: { paddingleft: 0, paddingright: 0, responsive: "resize" },
			};
		},
		mounted() {
			nextTick(() => {
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
