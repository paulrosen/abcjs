#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y.z"
echo $1 | grep -E -q '^[1-9]\.[0-9]+\.[0-9ab]+$' || die "Version number argument required (x.y.z), $1 provided"
echo "Concatenating all files..."
# NOTE: To run this, install uglifier with:
# npm install uglify-js -g
cp file_header.js tmp/file_header.js
perl -pi -e "s/VERSION/$1/" tmp/file_header.js

./node_modules/.bin/browserify index.js -o tmp/abcjs_basic.js -x canvas -x nw.gui --standalone ABCJS
./node_modules/.bin/browserify index-editor.js -o tmp/abcjs_editor.js -x canvas -x nw.gui --standalone ABCJS
./node_modules/.bin/browserify index-plugin.js -o tmp/abcjs_plugin.js -x canvas -x nw.gui --standalone ABCJS

echo "Compressing basic..."
# The old yuicompressor used a command line like this:
# java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_THE-PACKAGE_$1-min.js tmp/abcjs-THE-PACKAGE-stamped.js
# yuicompressor 2.4.7 doesn't work because it doesn't recognize promises. 2.4.8 doesn't work because it doesn't recognize cc_on or promises.
# uglifyjs works, but it has a larger output, so if yuicompressor is ever updated again, try to switch back to that.
./node_modules/.bin/uglifyjs tmp/abcjs_basic.js -c -o tmp/abcjs_basic-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_basic-min-unstamped.js > bin/abcjs_basic_midi_$1-min.js
echo "Compressing editor..."
./node_modules/.bin/uglifyjs tmp/abcjs_editor.js -c -o tmp/abcjs_editor-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_editor-min-unstamped.js > bin/abcjs_editor_midi_$1-min.js
echo "Compressing plugin..."
./node_modules/.bin/uglifyjs tmp/abcjs_plugin.js -c -o tmp/abcjs_plugin-min-unstamped.js
cat tmp/file_header.js tmp/abcjs_plugin-min-unstamped.js > bin/abcjs_plugin_$1-min.js
cat plugin/greasemonkey.js bin/abcjs_plugin_$1-min.js > bin/abcjs_plugin_$1.user.js
echo "Creating latest..."
cp bin/abcjs_basic_midi_$1-min.js bin/abcjs_basic_latest-min.js
cp bin/abcjs_editor_midi_$1-min.js bin/abcjs_editor_latest-min.js
cp bin/abcjs_plugin_$1-min.js bin/abcjs_plugin_latest-min.js
echo "Fix readme..."
perl -pi -e "s/abcjs_(.+)_3([^-]+)-min.js/abcjs_\$1_$1-min.js/" README.md
perl -pi -e "s/abcjs_(.+)_3([^-]+).user.js/abcjs_\$1_$1.user.js/" README.md

