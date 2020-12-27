<template>
  <div class="synth-sandbox-code">
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
      return `
${paper}
${warnings}
${audio}`;
    },
    sheetMusicJs() {
      // console.log(this.changes);
      // SETUP
      const abcjs = this.usingNode ? 'abcjs' : 'ABCJS';


      // TODO: hide measures, cursor that highlights current note
      // VISUAL
      let visualOptions = {};
      const target = this.sheetMusic ? 'paper' : '*';
      let animation = '';
      if (this.cursor || this.hideMeasures) {
        console.log(this.hideMeasures);
        const params = {};
        if (this.cursor) {
          console.log('hi from cursor highlight');
          // add to params
          params.hi = "cursor highlight";
        }
        // TODO: this.hideMeasures = undefined
        if (this.hideMeasures) {
          console.log('hi from hide measures');
          // add to params
          params.hello = 'hide measures';
        }
        animation = 
`// use a button and ABCJS.pauseAnimation() to allow user to pause the animation 
ABCJS.startAnimation(paper, abc_editor.tunes[0], ${JSON.stringify(params)});`
      }
//       const cursorHighlight = this.cursor ? 
// ``
//       const hideMeasures = this.hideMeasures ? 
// `// use a button and ABCJS.pauseAnimation() to allow user to pause the animation 
// ABCJS.startAnimation(paper, abc_editor.tunes[0], params);` :
//       '';


      // TODO
      // CHANGES
      let synthOptions = {};  // will be passed to mySynth.init
      let changes = '';
      switch (this.changes) {
        case 'editor':
          changes = `var abc_editor = new window.ABCJS.Editor("abc", {
  paper_id: "paper",
  warnings_id:"warnings",
  abcjsParams: {
    add_classes: true
  }
});`;
          break;
        case 'drag':
          // use visualOptions
          break;
        case 'params':
          // add to synthOptions
          break;
        case 'programmatic':
          // see flow chart
          break;
      }


      // CURSOR
      const cursorControl = this.usingCallbacks ? 
`// see docs for parameters
var cursorControl = new synth.CursorControl();` : 
'var cursorControl = null;';


      // AUDIO CONTROL. Edit out the midiTranspose stuff
      const widget = this.playbackWidget ? `var mySynth = new ABCJS.synth.CreateSynth();
var synthControl = new synth.SynthController();
var mySynth = new ABCJS.synth.CreateSynth();

mySynth.init(synthOptions).then(function() {
    synthControl.setTune(visualObj[0], true, { midiTranspose: transposeBy })
    .then(function(){
      console.log('Audio successfully loaded.')
    }).catch(function(error) {
      console.warn('Audio problem: ', error);
    })
});

synthControl.load('#audio', cursorControl, {
  displayLoop: ${this.loop},
  displayRestart: ${this.restart},
  displayPlay: ${this.play},
  displayProgress: ${this.progress},
  displayWarp: ${this.warp},
  displayClock: ${this.clock} 
});` : `var mySynth = new ABCJS.synth.CreateSynth();
mySynth.init(synthOptions).then(() => { 
  synth.prime(() => { 
    ... });
  .start();`; 

// TODO: check syntax ^^
      // SOUND
      // TIMING
      // OTHER


      return `
var visualObj = ${abcjs}.renderAbc("${target}", abcString, ${JSON.stringify(visualOptions)});
var synthOptions = { visualObj: visualObj[0], ...${JSON.stringify(synthOptions)} };

${changes}

${cursorControl}

// trigger these on a user gesture: 
${widget}

${animation}`;
    },
  },
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
