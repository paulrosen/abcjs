#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y"
echo $1 | grep -E -q '^[1-9]\.[0-9ab]+$' || die "Version number argument required (x.y), $1 provided"
echo "Concatenating all files..."
# NOTE: To run this, install uglifier with:
# npm install uglify-js -g
cp file_header.js tmp/file_header.js
perl -pi -e "s/VERSION/$1/" tmp/file_header.js
cat tmp/midijs/Base64.js tmp/midijs/WebAudioAPI.js tmp/midijs/WebMIDIAPI.js tmp/midijs/request_script.js tmp/midijs/request_xhr.js tmp/midijs/util.js tmp/midijs/AudioSupports.js tmp/midijs/EventEmitter.js tmp/midijs/loader.js tmp/midijs/adaptors.js tmp/midijs/adaptors-Audio.js tmp/midijs/adaptors-AudioAPI.js tmp/midijs/adaptors-MIDI.js tmp/midijs/channels.js tmp/midijs/gm.js tmp/midijs/player.js > tmp/midijs.js
cat api/*.js data/*.js midi/*.js parse/*.js write/*.js > tmp/abcjs-noraphael.js
cat raphael.js tmp/abcjs-noraphael.js > tmp/abcjs_basic.js
cat tmp/midijs.js tmp/abcjs_basic.js > tmp/abcjs_basic_midi.js
cat tmp/abcjs_basic.js edit/*.js > tmp/abcjs_editor.js
cat tmp/midijs.js tmp/abcjs_editor.js > tmp/abcjs_editor_midi.js
cat tmp/abcjs-noraphael.js edit/*.js > tmp/abcjs_editor-noraphael.js
cat tmp/abcjs-noraphael.js plugin/abc_plugin.js > tmp/abcjs_plugin-noraphael.js
cat tmp/abcjs_basic.js plugin/abc_plugin.js > tmp/abcjs_plugin.js
echo "Compressing basic..."
# The old yuicompressor used a command line like this:
# java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_THE-PACKAGE_$1-min.js tmp/abcjs-THE-PACKAGE-stamped.js
# yuicompressor 2.4.7 doesn't work because it doesn't recognize promises. 2.4.8 doesn't work because it doesn't recognize cc_on or promises.
# uglifyjs works, but it has a larger output, so if yuicompressor is ever updated again, try to switch back to that.
uglifyjs tmp/abcjs_basic.js -c -o tmp/abcjs_basic-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_basic-min-unstamped.js > bin/abcjs_basic_$1-min.js
uglifyjs tmp/abcjs-noraphael.js -c -o tmp/abcjs_basic_noraphael-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_basic_noraphael-min-unstamped.js > bin/abcjs_basic_noraphael_$1-min.js
uglifyjs tmp/abcjs_basic_midi.js -c -o tmp/abcjs_basic_midi-min-unstamped.js
cat tmp/file_header.js midi_file_header.js tmp/abcjs_basic_midi-min-unstamped.js > bin/abcjs_basic_midi_$1-min.js
echo "Compressing editor..."
uglifyjs tmp/abcjs_editor.js -c -o tmp/abcjs_editor-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_editor-min-unstamped.js > bin/abcjs_editor_$1-min.js
uglifyjs tmp/abcjs-noraphael.js -c -o tmp/abcjs_editor_noraphael-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_editor_noraphael-min-unstamped.js > bin/abcjs_editor_noraphael_$1-min.js
uglifyjs tmp/abcjs_editor_midi.js -c -o tmp/abcjs_editor_midi-min-unstamped.js
cat tmp/file_header.js midi_file_header.js tmp/abcjs_editor_midi-min-unstamped.js > bin/abcjs_editor_midi_$1-min.js
echo "Compressing plugin..."
uglifyjs tmp/abcjs_plugin-noraphael.js -c -o tmp/abcjs_plugin_noraphael_nojquery-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_plugin_noraphael_nojquery-min-unstamped.js > bin/abcjs_noraphael_nojquery_$1-min.js
uglifyjs tmp/abcjs_plugin.js -c -o tmp/abcjs_plugin_nojquery-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_plugin_nojquery-min-unstamped.js > bin/abcjs_plugin_nojquery_$1-min.js
cat jquery-1.11.3.min.js bin/abcjs_plugin_nojquery_$1-min.js > bin/abcjs_plugin_$1-min.js
cat plugin/greasemonkey.js bin/abcjs_plugin_$1-min.js > bin/abcjs_plugin_$1.user.js
echo "Creating latest..."
cp bin/abcjs_basic_midi_$1-min.js bin/abcjs_basic_latest-min.js
cp bin/abcjs_editor_midi_$1-min.js bin/abcjs_editor_latest-min.js
cp bin/abcjs_plugin_$1-min.js bin/abcjs_plugin_latest-min.js
echo "Fix readme..."
perl -pi -e "s/abcjs_(.+)_2([^-]+)-min.js/abcjs_\$1_$1-min.js/" README.md
perl -pi -e "s/abcjs_(.+)_2([^-]+).user.js/abcjs_\$1_$1.user.js/" README.md

