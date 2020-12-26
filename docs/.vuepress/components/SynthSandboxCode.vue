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
      const audio = this.playbackWidget ? '<div id="audio"></div>' : '';
      return `${paper}
${audio}`;
    },
    sheetMusicJs() {
      const target = this.sheetMusic ? 'paper' : '*';
      const abcjs = this.usingNode ? 'abcjs' : 'ABCJS';
      // TODO
      const cursor = this.cursor ? 'var cursorControl = new synth.CursorControl();' : 'var cursorControl = null;';
      const widget = this.playbackWidget ? `var synthControl = new synth.SynthController(); \n synthControl.load('#audio', cursorControl, {
        displayLoop: ${this.loop},
        displayRestart: ${this.restart},
        displayPlay: ${this.play},
        displayProgress: ${this.progress},
        displayWarp: ${this.warp},
        displayClock: ${this.clock} 
      });`  : ''; 
      // other widget options; large playback widget uses CSS 
      return `var visualObj = ${abcjs}.renderAbc("${target}", abcString, {});
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
  font-size: 1.1em;
}
</style>
