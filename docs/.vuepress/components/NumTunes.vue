<template>
	<ClientOnly>
		<div class="num-tunes">
			<div class="language- my-code">
				<span class="code-results">{{answer}}</span>
				<span> = ABCJS.numberOfTunes(tunebookString);</span>
			</div>
		</div>
	</ClientOnly>
</template>

<script>
	export default {
		name: "num-tunes",
		data() {
			return {
				answer: "",
				abcjs: null,
			};
		},
		methods: {
			redraw(tunebookString) {
				this.answer = window.abcjs.numberOfTunes(tunebookString);
			}
		}
	}
</script>
