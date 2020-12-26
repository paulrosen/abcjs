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
      return `${paper}
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
      const hideMeasures = this.hideMeasures ? '' : '';


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
      const cursor = this.usingCallbacks ? `// see docs for parameters
var cursorControl = new synth.CursorControl();` : 'var cursorControl = null;';


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

// trigger these on a user gesture: 
${widget}`;
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
