<template>
  <div class="sandbox-code">
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

export default {
  name: 'sandbox-code',
  computed: {
    ...mapGetters([
      'declaration',
      'sheetMusicHtml',
      'sheetMusicJs',
      'sheetMusicCss',
    ]),
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
