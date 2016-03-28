#!/usr/bin/env bash
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/shim/Base64.js > tmp/midijs/Base64.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/shim/WebAudioAPI.js > tmp/midijs/WebAudioAPI.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/shim/WebMIDIAPI.js > tmp/midijs/WebMIDIAPI.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/dom/request_script.js > tmp/midijs/request_script.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/dom/request_xhr.js > tmp/midijs/request_xhr.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/dom/util.js > tmp/midijs/util.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/AudioSupports.js > tmp/midijs/AudioSupports.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/inc/EventEmitter.js > tmp/midijs/EventEmitter.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/loader.js > tmp/midijs/loader.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/adaptors.js > tmp/midijs/adaptors.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/adaptors-Audio.js > tmp/midijs/adaptors-Audio.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/adaptors-AudioAPI.js > tmp/midijs/adaptors-AudioAPI.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/adaptors-MIDI.js > tmp/midijs/adaptors-MIDI.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/channels.js > tmp/midijs/channels.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/gm.js > tmp/midijs/gm.js
curl https://raw.githubusercontent.com/paulrosen/MIDI.js/abcjs/js/player.js > tmp/midijs/player.js
