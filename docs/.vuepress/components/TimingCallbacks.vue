<template>
	<div class="timing-callbacks">
		<form @submit.prevent="startTiming">
			<div class="language- my-code">
				<div>timer = new abcjs.TimingCallbacks(visualObj, {</div>
			<label>
				<span>qpm: </span>
				<input type="number" min="4" max="300" step="4" v-model="qpm">,
			</label>
			<label>
				<span>extraMeasuresAtBeginning: </span>
				<input type="number" min="0" max="4" v-model="extraMeasuresAtBeginning">,
			</label>
			<label>
				<span>lineEndAnticipation: </span>
				<input type="number" min="0" max="4000" step="100" v-model="lineEndAnticipation">,
			</label>
			<label>
				<span>beatSubdivisions: </span>
				<input type="number" min="1" max="8" v-model="beatSubdivisions">,
			</label>
				<div></div>
				<div class="label-indent">beatCallback: function() {...},</div>
				<div class="label-indent">eventCallback: function() {...},</div>
				<div class="label-indent">lineEndCallback: function() {...}</div>
				<div>}</div>
			</div>
			<button type="submit">Start()</button>
		</form>
		<button @click="stopTiming">Stop()</button>
		<button @click="pauseTiming">Pause()</button>
		<button @click="resetTiming">Reset()</button>
		<button @click="setProgress">Set Progress(10)</button>
		<div>
			<h3>Output Stream:</h3>
			<div class="output" v-html="outputStream"></div>
		</div>
	</div>
</template>

<script>
	import { nextTick } from 'vue';

	export default {
		name: "timing-callbacks",
		watch: {
		},
		props: {
			target: {
				type: String,
				required: true
			},
		},
		data() {
			return {
				abcjs: null,
				visualObj: null,
				timer: null,

				outputStream: "",

				qpm: 100,
				extraMeasuresAtBeginning: 0,
				lineEndAnticipation: 500,
				beatSubdivisions: 4,
			}
		},
		// mounted() {
		// 	nextTick(() => {
		// 		this.redraw();
		// 	});
		// },
		methods: {
			// redraw() {
			// 	console.log("redraw")
			// },
			startTiming() {
				const abc = document.getElementById("abc").value;
				this.visualObj = window.abcjs.renderAbc("*", abc)[0];
				console.log("startTiming",{
					qpm: this.qpm,
					extraMeasuresAtBeginning: this.extraMeasuresAtBeginning,
					lineEndAnticipation: this.lineEndAnticipation,
					beatSubdivisions: this.beatSubdivisions,
				})
				this.timer = new window.abcjs.TimingCallbacks(this.visualObj, {
					qpm: this.qpm,
					extraMeasuresAtBeginning: this.extraMeasuresAtBeginning,
					lineEndAnticipation: this.lineEndAnticipation,
					beatSubdivisions: this.beatSubdivisions,

					beatCallback: this.beatCallback,
					eventCallback: this.eventCallback,
					lineEndCallback: this.lineEndCallback,
				});
				this.timer.start();
				this.outputStream = "";
			},
			stopTiming() {
				if (!this.timer) return;
				this.timer.stop();
			},
			pauseTiming() {
				if (!this.timer) return;
				this.timer.pause();
			},
			resetTiming() {
				if (!this.timer) return;
				this.timer.reset();
				this.outputStream = "";
			},
			setProgress() {
				if (!this.timer) return;
				this.timer.setProgress(10);
				this.outputStream = "";
			},
			beatCallback(beatNumber, totalBeats, totalTime) {
				this.outputStream += `<div class="beat-callback"><div class="header">BEAT CALLBACK</div>
<div class="data">beatNumber = ${beatNumber}, totalBeats = ${totalBeats}, totalTime = ${totalTime}</div>
				</div>`;
			},
			eventCallback(ev) {
				if (ev) {
					delete ev.elements;
					this.outputStream += `<div class="event-callback"><div class="header">EVENT CALLBACK</div>
	<div class="data">${JSON.stringify(ev, null, "\t")}</div>
					</div>`;
				}
			},
			lineEndCallback( info, event, details) {
				this.outputStream += `<div class="line-end-callback"><div class="header">LINE END CALLBACK</div>
<div class="data">${JSON.stringify(info, null, "\t")}</div>
<div class="data">${JSON.stringify(event, null, "\t")}</div>
<div class="data">${JSON.stringify(details, null, "\t")}</div>
				</div>`;
			},
		},
	}
</script>

<style scoped>
	label, .label-indent {
		display: block;
		margin-left: 30px;
		width: calc(100% - 30px);
	}
	label span {
		display: inline-block;
		width: 240px;
	}
	input {
		width: 60px;
	}
	button {
		background: #acffd9;
		padding: 10px;
		border-radius: 8px;
		font-size: 1.2em;
		border: none;
		box-shadow: 3px 3px 3px #aaaaaa;
		margin: 10px;
	}
</style>

<style>
	.timing-callbacks .output {
		max-height: 600px;
		overflow: auto;
	}
	.timing-callbacks .beat-callback {
		padding: 4px;
		margin-bottom: 4px;
		background: #c8ffe6;
	}
	.timing-callbacks .event-callback {
		padding: 4px;
		margin-bottom: 4px;
		background: #c8f2ff;
	}
	.timing-callbacks .line-end-callback {
		padding: 4px;
		margin-bottom: 4px;
		background: #ffc8c8;
	}
	.timing-callbacks .output .header {
		font-weight: bold;
	}
</style>

