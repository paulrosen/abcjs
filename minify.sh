echo "Concatenating all files..."
cat parse/proto.js parse/abc_parse.js parse/abc_parse_directive.js parse/abc_parse_header.js parse/abc_parse_key_voice.js parse/abc_tokenizer.js > tmp/parse.js
cat write/abc_glyphs.js write/abc_graphelements.js write/abc_layout.js write/abc_write.js write/sprintf.js > tmp/write.js
cat api/abc_tunebook.js data/abc_tune.js midi/abc_midiwriter.js tmp/parse.js tmp/write.js > tmp/abcjs-no-raphael.js
cat write/raphael.js tmp/abcjs-no-raphael.js > tmp/abcjs_all.js
cat tmp/abcjs_all.js edit/abc_editor.js > tmp/abcjs_editor.js
cat tmp/abcjs_all.js plugin/abc_plugin.js > tmp/abcjs_plugin.js
echo "Compressing basic..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin/abcjs_basic_$1-min.js tmp/abcjs_all.js
echo "Compressing editor..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin/abcjs_editor_$1-min.js tmp/abcjs_editor.js
echo "Compressing plugin..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin/abcjs_plugin-nojquery_$1-min.js tmp/abcjs_plugin.js
cat jquery-1.7.2.min.js bin/abcjs_plugin-nojquery_$1-min.js > bin/abcjs_plugin_$1-min.js
cat plugin/greasemonkey.js bin/abcjs_plugin_$1-min.js > bin/abcjs_plugin_$1.user.js

