#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Call with a version number argument in the form x.y"
echo $1 | grep -E -q '^[1-9]\.[0-9ab]+$' || die "Version number argument required (x.y), $1 provided"
echo "Concatenating all files..."
cp file_header.js tmp/file_header.js
perl -pi -e "s/VERSION/$1/" tmp/file_header.js
cat api/*.js data/*.js midi/*.js parse/*.js write/*.js > tmp/abcjs-noraphael.js
cat raphael.js tmp/abcjs-noraphael.js > tmp/abcjs_basic.js
cat tmp/abcjs_basic.js edit/*.js > tmp/abcjs_editor.js
cat tmp/abcjs-noraphael.js edit/*.js > tmp/abcjs_editor-noraphael.js
cat tmp/abcjs-noraphael.js plugin/abc_plugin.js > tmp/abcjs_plugin-noraphael.js
cat tmp/abcjs_basic.js plugin/abc_plugin.js > tmp/abcjs_plugin.js
cat tmp/file_header.js tmp/abcjs_basic.js > tmp/abcjs_basic-stamped.js
cat tmp/file_header.js tmp/abcjs-noraphael.js > tmp/abcjs-noraphael-stamped.js
cat tmp/file_header.js tmp/abcjs_editor.js > tmp/abcjs_editor-stamped.js
cat tmp/file_header.js tmp/abcjs_editor-noraphael.js > tmp/abcjs_editor-noraphael-stamped.js
cat tmp/file_header.js tmp/abcjs_plugin-noraphael.js > tmp/abcjs_plugin-noraphael-stamped.js
cat tmp/file_header.js tmp/abcjs_plugin.js > tmp/abcjs_plugin-stamped.js
echo "Compressing basic..."
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_basic_$1-min.js tmp/abcjs_basic-stamped.js
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_basic_noraphael_$1-min.js tmp/abcjs-noraphael-stamped.js
echo "Compressing editor..."
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_editor_$1-min.js tmp/abcjs_editor-stamped.js
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_editor_noraphael_$1-min.js tmp/abcjs_editor-noraphael-stamped.js
echo "Compressing plugin..."
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_plugin_noraphael_nojquery_$1-min.js tmp/abcjs_plugin-noraphael-stamped.js
java -jar yuicompressor-2.4.7.jar  --line-break 7000 -o bin/abcjs_plugin_nojquery_$1-min.js tmp/abcjs_plugin-stamped.js
cat jquery-1.11.3.min.js bin/abcjs_plugin_nojquery_$1-min.js > bin/abcjs_plugin_$1-min.js
cat plugin/greasemonkey.js bin/abcjs_plugin_$1-min.js > bin/abcjs_plugin_$1.user.js
echo "Creating latest..."
cp bin/abcjs_basic_$1-min.js bin/abcjs_basic_latest-min.js
cp bin/abcjs_editor_$1-min.js bin/abcjs_editor_latest-min.js
cp bin/abcjs_plugin_$1-min.js bin/abcjs_plugin_latest-min.js
echo "Fix readme..."
perl -pi -e "s/abcjs_(.+)_1([^-]+)-min.js/abcjs_\$1_$1-min.js/" README.md
perl -pi -e "s/abcjs_(.+)_1([^-]+).user.js/abcjs_\$1_$1.user.js/" README.md

