<template>
  <div class="sandbox-code">
    <button @click="download">Download Complete Demo</button>
    <h3>Header</h3>
    <code>{{declaration}}</code>
    <h3>HTML</h3>
    <code>{{sheetMusicHtml}}</code>
    <h3>JavaScript</h3>
    <code>{{sheetMusicJs}}</code>
    <h3>CSS</h3>
    <code>{{sheetMusicCss}}</code>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {
	audioString, clickListenerHtmlString,
	editorString,
	middleString,
	midiString,
	paperString, postAmbleString,
	preambleString,
	preamble2String,
	setupString, startTimerHtmlString
} from "./example-strings";
import {clickListenerJsString, editorJsString, renderAbcString, visualOptionsString} from "./example-strings-js";
import {cssString} from "./example-strings-css";
import {cursorJsString} from "./example-strings-js-cursor";

export default {
  name: 'sandbox-code',
  computed: {
    ...mapGetters([
      'usingNode',
      'soundfont',
      'sheetMusic',
      'responsive',
      'cursor',
      'hideMeasures',
      'changes',
      'hasSound',
      'playbackWidget',
      'large',
      'loop',
      'restart',
      'play',
      'progress',
      'warp',
      'clock',
      'usingCallbacks',
      'metronome',
      'tempo',
      'stereo',
      'instrument',
      'transpose',
      'noChords',
      'noVoice',
      'tweak',
      'midi',
      'playImmediate',
    ]),
    declaration() {
    	return setupString(this.usingNode)
    },
    sheetMusicHtml() {
      return `${editorString(this.hasEditor)}
${paperString(this.sheetMusic)}
${audioString(this.playbackWidget && this.hasSound, this.large)}
${midiString(this.midi)}
${clickListenerHtmlString(this.usingCallbacks)}
${startTimerHtmlString(this.sheetMusic && this.cursor)}
`;
    },

    sheetMusicCss() {
		return cssString(this.playbackWidget && this.hasSound, this.sheetMusic && this.cursor);
    },

    sheetMusicJs() {

      // SETUP
       const visualOptions = visualOptionsString(
			this.responsive,
			this.usingCallbacks,
		   this.hasSound && this.metronome
	   );  // will be passed to renderAbc()
//       const synthOptions = {};  // will be passed to mySynth.init
//       const audioParams = {};   // will be passed to synthControl.setTune()
//       const animationOptions = {};    // will be passed to startAnimation()
//
//       if (this.soundfont) {
//         synthOptions.soundFontURL = 'URL';
//         audioParams.soundFontURL = 'URL';
//       }
//
//       // VISUAL
//       const animation = animationCode(this, animationOptions);
//
//       // CHANGES
//       const changes = changesCode(this, visualOptions);
//
//       // AUDIO CONTROL
//       const widget = audioControlCode(this);
//
//       // SOUND
//       soundCode(this, animationOptions, visualOptions, audioParams);
//
//       // TIMING
//       const timing = timingCode(this);
//
//       // OTHER
//       const other = otherCode(this, synthOptions, audioParams);
//
//       // RETURNED CODE
//       return `
// var visualOptions = ${replaceFunctionPlaceholders(JSON.stringify(visualOptions))};
// var audioParams = ${JSON.stringify(audioParams)};
// var cursorControl = null;
// var synthOptions = { visualObj: visualObj[0], ...${JSON.stringify(synthOptions)} };
//
// ${changes}
//
// // trigger these on a user gesture:
// ${widget}
//
// ${animation} ${timing} ${other}`;
		var usingNode = this.isDownloading ? false : this.usingNode;
		return `${renderAbcString(usingNode, !this.hasEditor, this.sheetMusic, visualOptions)}
${editorJsString(usingNode, this.hasEditor, this.sheetMusic)}
${clickListenerJsString(this.usingCallbacks)}
${cursorJsString(usingNode, this.sheetMusic && this.cursor)}
`;
    },
	  hasEditor() {
    	return this.changes === 'editor';
	  },
		title() {
    	let options = [];
			if (this.sheetMusic) options.push("visual");
			if (this.sheetMusic && this.responsive) options.push("responsive");
			if (this.sheetMusic && this.cursor) options.push("cursor");
			if (this.sheetMusic && this.hideMeasures) options.push("hide");
			options.push(this.changes);
			if (this.usingCallbacks) options.push("callback");
			if (this.hasSound) options.push("sound");
			if (this.hasSound && this.playbackWidget) options.push("playback");
			if (this.hasSound && this.playbackWidget && this.large) options.push("large");
			if (this.hasSound && this.playbackWidget && this.loop) options.push("loop");
			if (this.hasSound && this.playbackWidget && this.restart) options.push("restart");
			if (this.hasSound && this.playbackWidget && this.play) options.push("play");
			if (this.hasSound && this.playbackWidget && this.progress) options.push("progress");
			if (this.hasSound && this.playbackWidget && this.warp) options.push("warp");
			if (this.hasSound && this.playbackWidget && this.clock) options.push("clock");
			if (this.hasSound && this.metronome) options.push("metronome");
			if (this.hasSound && this.tempo) options.push("tempo");
			if (this.hasSound && this.stereo) options.push("stereo");
			if (this.hasSound && this.instrument) options.push("instrument");
			if (this.hasSound && this.transpose) options.push("transpose");
			if (this.hasSound && this.noChords) options.push("nochords");
			if (this.hasSound && this.noVoice) options.push("novoice");
			if (this.hasSound && this.tweak) options.push("tweak");
			if (this.hasSound && this.midi) options.push("midi");
			if (this.hasSound && this.playImmediate) options.push("immediate");
			if (this.hasSound && this.soundfont) options.push("soundfont");

			return options.join(' ');
		},
	  filename() {
    	return this.title.replace(/ /g,'-') + ".html";
	  },
		fullDemo() {
			return `${preambleString(this.title)}${this.sheetMusicCss}${preamble2String(this.hasEditor)}${this.sheetMusicJs}${middleString(this.title)}${this.sheetMusicHtml}${postAmbleString()}`;
		}
  },
	data() {
  		return {
  			isDownloading: false,
		}
	},
	methods: {
		download() {
			this.isDownloading = true;
			const url = "data:application/txt," + encodeURIComponent(this.fullDemo);
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute("style", "display: none;");
			link.href = url;
			link.download = this.filename;
			link.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
			this.isDownloading = false;
		}
	}
}
</script>

<style scoped>
code {
  background: black;
  color: white;
  width: 100%;
  display: inline-block;
  white-space: pre-wrap;
  font-size: 1.1em;
}
</style>
