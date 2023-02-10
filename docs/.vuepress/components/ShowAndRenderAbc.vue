<template>
	<div class="show-and-render">
		<div class="language- extra-class"><pre class="language-text"><code>{{abc}}</code></pre></div>
		<render-abc :abc="abc" :options="options"></render-abc>
	</div>
</template>

<script>
	import { waitForAbcjs } from '../wait-for-abcjs';
	import RenderAbc from "./RenderAbc.vue";
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
		async mounted() {
			await waitForAbcjs()
			const el = this.$refs.paper;
			this.visualObj = ABCJS.renderAbc(el, this.abc, this.defaultOptions);
		},
		methods: {
			getObj() {
				return this.visualObj[0];
			}
		}
	}
</script>
