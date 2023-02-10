<template>
	<ClientOnly>
		<div ref='paper' class="render-abc"></div>
	</ClientOnly>
</template>

<script>
	import { waitForAbcjs } from '../wait-for-abcjs';
	export default {
		name: "render-abc",
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
			this.visualObj = abcjs.renderAbc(el, this.abc, this.defaultOptions, this.options);
		},
		methods: {
			getObj() {
				return this.visualObj[0];
			}
		}
	}
</script>
