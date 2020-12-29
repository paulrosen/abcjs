<template>
  <div class="synth-sandbox-code">
    <button @click="download">Download Complete Demo</button>
    <h3>Header</h3>
    <code>
    {{declaration}}
    </code>
    <h3>HTML</h3>
    <code>
    {{sheetMusicHtml}}
    </code>
    <h3>JavaScript</h3>
    <code>
    {{sheetMusicJs}}
    </code>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

const CLICK_LISTENER_FUNCTION = ` function(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {  
  // modify the ABC string and rerender 
}`

const replaceFunctionPlaceholders = (stringifiedObject) => {
  return stringifiedObject
    .replace("\"__FUNCTION_PLACEHOLDER_CLICK_LISTENER__\"", CLICK_LISTENER_FUNCTION);
}

const animationCode = (sandbox, animationOptions) => {
  if (sandbox.cursor || sandbox.hideMeasures) {
    if (sandbox.cursor) {
      animationOptions.showCursor = true;
    }
    if (sandbox.hideMeasures) {
      animationOptions.hideFinishedMeasures = true;
    }
    // TODO: startAnimation() is deprecated.
    return `
ABCJS.startAnimation(paper, abc_editor.tunes[0], ${JSON.stringify(animationOptions)});`
  }

  return '';
}

const changesCode = (sandbox, visualOptions) => {
   // TODO: Change these radio-button options to checkboxes, as they are not mutually exclusive.
  switch (sandbox.changes) {
    case 'editor':
      return `
var abc_editor = new window.ABCJS.Editor("abc", {
  paper_id: "paper",
  warnings_id:"warnings",
  abcjsParams: {
    add_classes: true
  }
});`;
  case 'drag':
    visualOptions.dragging = true;
    visualOptions.clickListener = "__FUNCTION_PLACEHOLDER_CLICK_LISTENER__"
    return '';
  default:
    '';
}
}

const audioControlCode = (sandbox) => {
  if (!sandbox.playbackWidget) {
    return `var mySynth = new ABCJS.synth.CreateSynth();
mySynth.init(synthOptions).then(() => { 
  synth.prime().then(() => {
    start();
  });
});`;
  }

  return `var mySynth = new ABCJS.synth.CreateSynth();
var synthControl = new synth.SynthController();
var mySynth = new ABCJS.synth.CreateSynth();

mySynth.init(synthOptions).then(function() {
  synthControl.setTune(visualObj[0], true, audioParams)
  .then(function(){
    console.log('Audio successfully loaded.')
  }).catch(function(error) {
    console.warn('Audio problem: ', error);
  })
});

synthControl.load('#audio', cursorControl, {
  displayLoop: ${sandbox.loop},
  displayRestart: ${sandbox.restart},
  displayPlay: ${sandbox.play},
  displayProgress: ${sandbox.progress},
  displayWarp: ${sandbox.warp},
  displayClock: ${sandbox.clock} 
});`
}

const soundCode = (sandbox, animationOptions, visualOptions, audioParams) => {
  // TODO: How should a dev use these parameters if they do not have a playback widget to pass audioParams to? 
  if(sandbox.metronome) console.log('metronome')   // TODO
  if(sandbox.tempo) {
    animationOptions.bpm = 120;
    audioParams.qpm = 120;
  }
  if(sandbox.stereo) console.log('stereo')   // TODO
  if(sandbox.instrument) audioParams.program = 0;
  if(sandbox.transpose) { 
    visualOptions.visualTranspose = 0;
    audioParams.midiTranspose = 0;
  }
  if(sandbox.noChords) audioParams.chordsOff = true;
  if(sandbox.noVoice) audioParams.voicesOff = true;
}

const timingCode = (sandbox) => {
  if (!sandbox.usingCallbacks) return '';

  // TODO: Currently, both objects will be instantiated if user selects "Listen for callbacks". Suggestion to present TimingCallbacks and CursorControl as separate options in the sandbox.
  return `
var timingCallbacks = new abcjs.TimingCallbacks(visualObj, {});
cursorControl = new synth.CursorControl();`
}

const otherCode = (sandbox, synthOptions, audioParams) => {
  if(sandbox.tweak) {
    synthOptions.sequenceCallback = 'callback to change audio before it is buffered';
    audioParams.sequenceCallback = 'callback to change audio before it is buffered';
  }
  // TODO
  if(sandbox.playImmediate) { 
    console.log('playImmediate') 
  }   

  // TODO: Midi is deprecated.
  return sandbox.midi ? `ABCJS.renderMidi("midi-download", abc, { generateDownload: true, generateInline: false });` : '';
}

export default {
  name: 'synth-sandbox-code',
  computed: {
    ...mapGetters([
      'usingNode',
      'soundfont',
      'sheetMusic',
      'cursor',
      'hideMeasures',
      'changes',
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
      if (this.usingNode)
        return 'import abcjs from "abcjs"';
      else
        return '&lt;script src="../dist/abcjs-basic.js" type="text/javascript">&lt;/script>'.replace(/&lt;/g, "<");
    },
    sheetMusicHtml() {
      const paper = this.sheetMusic ? '<div id="paper"></div>' : ''; 
      const warnings = '<div id="warnings"></div>';
      let audio = '';
      if (this.playbackWidget) {
        if (this.large) {
          audio = `<div id="audio" class="abcjs-large"></div>`;
        }
        else audio = '<div id="audio"></div>';
      }
      const midi = this.midi ? '<div id="midi-download"></div>' : '';
      return `
${paper}
${warnings}
${audio}
${midi}`;
    },

    sheetMusicJs() {

      // SETUP
      const abcjs = this.usingNode ? 'abcjs' : 'ABCJS';
      const visualOptions = {};  // will be passed to renderAbc()
      const synthOptions = {};  // will be passed to mySynth.init
      const audioParams = {};   // will be passed to synthControl.setTune()
      const animationOptions = {};    // will be passed to startAnimation()

      if (this.soundfont) {
        synthOptions.soundFontURL = 'URL';
        audioParams.soundFontURL = 'URL';
      }

      // VISUAL
      const target = this.sheetMusic ? 'paper' : '*';
      const animation = animationCode(this, animationOptions);
      
      // CHANGES
      const changes = changesCode(this, visualOptions);

      // AUDIO CONTROL
      const widget = audioControlCode(this);

      // SOUND
      soundCode(this, animationOptions, visualOptions, audioParams);

      // TIMING
      const timing = timingCode(this);

      // OTHER
      const other = otherCode(this, synthOptions, audioParams);

      // RETURNED CODE
      return `
var visualOptions = ${replaceFunctionPlaceholders(JSON.stringify(visualOptions))};
var audioParams = ${JSON.stringify(audioParams)};
var cursorControl = null;
var visualObj = ${abcjs}.renderAbc("${target}", abcString, visualOptions);
var synthOptions = { visualObj: visualObj[0], ...${JSON.stringify(synthOptions)} };

${changes}

// trigger these on a user gesture: 
${widget}

${animation} ${timing} ${other}`;
    },
		title() {
    	let options = [];
			if (this.sheetMusic) options.push("visual");
			if (this.sheetMusic && this.cursor) options.push("cursor");
			if (this.sheetMusic && this.hideMeasures) options.push("hide");
			options.push(this.changes);
			if (this.playbackWidget) options.push("playback");
			if (this.playbackWidget && this.large) options.push("large");
			if (this.playbackWidget && this.loop) options.push("loop");
			if (this.playbackWidget && this.restart) options.push("restart");
			if (this.playbackWidget && this.play) options.push("play");
			if (this.playbackWidget && this.progress) options.push("progress");
			if (this.playbackWidget && this.warp) options.push("warp");
			if (this.playbackWidget && this.clock) options.push("clock");
			if (this.usingCallbacks) options.push("callback");
			if (this.metronome) options.push("metronome");
			if (this.tempo) options.push("tempo");
			if (this.stereo) options.push("stereo");
			if (this.instrument) options.push("instrument");
			if (this.transpose) options.push("transpose");
			if (this.noChords) options.push("nochords");
			if (this.noVoice) options.push("novoice");
			if (this.tweak) options.push("tweak");
			if (this.midi) options.push("midi");
			if (this.playImmediate) options.push("immediate");
			if (this.soundfont) options.push("soundfont");

			return options.join(' ');
		},
	  filename() {
    	return this.title.replace(/ /g,'-') + ".html";
	  },
		fullDemo() {
			const preamble = `<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="utf-8">
\t<meta http-equiv="x-ua-compatible" content="ie=edge">
\t<meta name="viewport" content="width=device-width, initial-scale=1">

\t<title>${this.title}</title>
\t<script src="abcjs-basic.js" type="text/javascript">&lt;/script>
\t<script type="text/javascript">
\tvar abcString = "T: Cooley's\\n" +
\t\t"M: 4/4\\n" +
\t\t"L: 1/8\\n" +
\t\t"R: reel\\n" +
\t\t"K: Emin\\n" +
\t\t"|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\\n" +
\t\t"EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\\n" +
\t\t"|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\\n" +
\t\t"eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|";

\tfunction load() {
`.replace(/&lt;/g,"<");
			const middle = `}\n\t&lt;/script>
</head>
<body onload="load()">
<header>
\t<h1>${this.title}</h1>
</header>
\t<div class="container">
`.replace(/&lt;/g,"<");
			const postAmble = `\t</div>
</body>
</html>
`;
			return `${preamble}${this.sheetMusicJs}${middle}${this.sheetMusicHtml}${postAmble}`;

		}
  },
	methods: {
		download() {
			const url = "data:application/txt," + encodeURIComponent(this.fullDemo);
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute("style", "display: none;");
			link.href = url;
			link.download = this.filename;
			link.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);
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
