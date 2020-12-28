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
      var visualObj = ['placeholder'];
      const synthOptions = {};  // will be passed to mySynth.init
      const audioParams = {};   // will be passed to synthControl.setTune()
      if (this.soundfont) {
        synthOptions.soundFontURL = 'URL';
        audioParams.soundFontURL = 'URL';
      }


      // VISUAL
      const target = this.sheetMusic ? 'paper' : '*';
      let animation = '';
      const animationOptions = {};    // will be passed to startAnimation()
      if (this.cursor || this.hideMeasures) {
        if (this.cursor) {
          animationOptions.showCursor = true;
        }
        if (this.hideMeasures) {
          animationOptions.hideFinishedMeasures = true;
        }
        // TODO: startAnimation() is deprecated and should be replaced with an implementation of the TimingCallbacks object.

        animation = `
ABCJS.startAnimation(paper, abc_editor.tunes[0], ${JSON.stringify(animationOptions)});`
      }


      // TODO
      // CHANGES
      let changes = '';
      switch (this.changes) {
        case 'editor':
          changes = `
var abc_editor = new window.ABCJS.Editor("abc", {
  paper_id: "paper",
  warnings_id:"warnings",
  abcjsParams: {
    add_classes: true
  }
});`;
          break;
        case 'drag':
          changes = `
visualOptions.dragging = true;
visualOptions.clickListener = function(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) { 
  // modify the ABC string and rerender 
}`;
          break;
        case 'params':
          // TODO
          break;
        case 'programmatic':
          // TODO
          break;
      }


      // AUDIO CONTROL
      const widget = this.playbackWidget ? 
`var mySynth = new ABCJS.synth.CreateSynth();
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
  displayLoop: ${this.loop},
  displayRestart: ${this.restart},
  displayPlay: ${this.play},
  displayProgress: ${this.progress},
  displayWarp: ${this.warp},
  displayClock: ${this.clock} 
});` : 
`var mySynth = new ABCJS.synth.CreateSynth();
mySynth.init(synthOptions).then(() => { 
    synth.prime().then(() => {
      start();
    });
  });`; 


      // SOUND
      // TODO: How can a dev use these parameters if they do not have a playback widget to pass audioParams to? 
      if(this.metronome) console.log('metronome')   // TODO
      if(this.tempo) {
        animationOptions.bpm = 120;
        audioParams.qpm = 120;
      }
      if(this.stereo) console.log('stereo')   // TODO
      if(this.instrument) audioParams.program = 0;
      if(this.transpose) { 
        visualOptions.visualTranspose = 0;
        audioParams.midiTranspose = 0;
      }
      if(this.noChords) audioParams.chordsOff = true;
      if(this.noVoice) audioParams.voicesOff = true;


      // TIMING
      // TODO: Currently, both code blocks are triggered by selecting usingCallbacks. Suggestion to present TimingCallbacks and CursorControl as separate checkboxes in the sandbox.
      const timing = this.usingCallbacks ? 
`
var timingCallbacks = new abcjs.TimingCallbacks(visualObj, {});` : '';
      const cursorControl = this.usingCallbacks ? 
`
cursorControl = new synth.CursorControl();` : 
'';


      // OTHER
      if(this.tweak) {
        synthOptions.sequenceCallback = 'callback to change audio before it is buffered';
        audioParams.sequenceCallback = 'callback to change audio before it is buffered';
      }
      const midi = this.midi ? `ABCJS.renderMidi("midi-download", abc, { generateDownload: true, generateInline: false });` : '';
      // TODO
      if(this.playImmediate) { 
        console.log('playImmediate') 
      }   

      // RETURNED CODE
      return `
var visualOptions = ${JSON.stringify(visualOptions)};
var audioParams = ${JSON.stringify(audioParams)};
var cursorControl = null;
var visualObj = ${abcjs}.renderAbc("${target}", abcString, visualOptions);
var synthOptions = { visualObj: visualObj[0], ...${JSON.stringify(synthOptions)} };

${changes}

// trigger these on a user gesture: 
${widget}

${midi} ${animation} ${timing} ${cursorControl}`;
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
