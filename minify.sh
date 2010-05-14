cat proto.js sprintf.js abc_glyphs.js abc_graphelements.js abc_layout.js abc_write.js abc_tunebook.js abc_parse_header.js abc_tune.js abc_tokenizer.js abc_parse.js abc_midiwriter.js > abcjs-no-raphael.js
cat raphael.js abcjs-no-raphael.js > abcjs_all.js
cat abcjs_all.js abc_editor.js > abcjs_editor.js
cat abcjs_all.js abc_plugin.js > abcjs_plugin.js
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o abcjs_basic_$1-min.js abcjs_all.js
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o abcjs_editor_$1-min.js abcjs_editor.js
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o abcjs_plugin-nojquery_$1-min.js abcjs_plugin.js
cat jquery-1.4.2.min.js abcjs_plugin-nojquery_$1-min.js > abcjs_plugin_$1-min.js

