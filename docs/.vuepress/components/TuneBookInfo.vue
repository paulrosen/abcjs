<template>
	<ClientOnly>
		<div class="tune-book-info">
			<label>Choose Tune:
			<select v-model="currentTune" @change="setInfo">
				<option v-for="tune in tuneNames" :key="tune">{{tune}}</option>
			</select>
			</label>
			<div class="language- my-code" v-if="currentTune">
				<div>const info = tunebook.{{functionString}}("{{currentTune}}");</div>
				<div>console.log(info);</div>
				<div class="code-results" v-html="currentInfo"></div>
			</div>
		</div>
	</ClientOnly>
</template>

<script>
	export default {
		name: "tune-book-info",
		props: {
			type: {
				type: String,
				required: true
			},
		},
		computed: {
			functionString() {
				if (this.type === 'title') return "getTuneByTitle";
				else return "getTuneById";
			},
		},
		data() {
			return {
				tuneNames: [],
				currentTune: "",
				currentInfo: "",
				abcjs: null,
				tunebook: null,
			};
		},
		methods: {
			redraw(tunebookString) {
				this.tunebook = new window.abcjs.TuneBook(tunebookString);
				if (this.type === "title") {
					this.tuneNames = this.tunebook.tunes.map(tune => {
						return tune.title;
					});
				} else {
					this.tuneNames = this.tunebook.tunes.map(tune => {
						return tune.id;
					});
				}
			},
			setInfo() {
				let info;
				if (this.type === "title")
					info = this.tunebook.getTuneByTitle(this.currentTune);
				else
					info = this.tunebook.getTuneById(this.currentTune);
				this.currentInfo = `{
&nbsp;&nbsp;id: "${info.id}",
&nbsp;&nbsp;title: "${info.title}",
&nbsp;&nbsp;startPos: ${info.startPos},
&nbsp;&nbsp;abc: "${this.abcSnippet(info.abc)}",
&nbsp;&nbsp;pure: "${this.abcSnippet(info.pure)}",
}`;
				this.currentInfo = this.currentInfo.replace(/\n/g, "<br>");
			},
			sanitizeAbcString(abc) {
				return abc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			},
			abcSnippet(abc) {
				return this.sanitizeAbcString(abc.substring(0, 50)).replace(/\n/g, "\\n") + '...';
			},
		}
	}
</script>

<style scoped>
	label {
		margin-bottom: 10px;
		display: inline-block;
	}
</style>
