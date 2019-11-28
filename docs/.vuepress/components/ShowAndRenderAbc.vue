<template>
	<div class="show-and-render">
		<div class="language- extra-class"><pre class="language-text"><code>{{abc}}</code></pre></div>
		<render-abc :abc="abc"></render-abc>
	</div>
</template>

<script>
	import Vue from 'vue';
	import RenderAbc from "./RenderAbc";
	export default {
		name: "show-and-render-abc",
		components: {RenderAbc},
		props: {
			abc: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				visualObj: null,
			};
		},
		mounted() {
			Vue.nextTick(() => {
				const abcjs = require('abcjs');
				const el = this.$refs.paper;
				this.visualObj = abcjs.renderAbc(el, this.abc);
			});
		},
		methods: {
			getObj() {
				return this.visualObj[0];
			}
		}
	}
</script>
