echo "Concatenating all files..."

set versao=%1
set versao=2.07

cat parse\abc_common.js parse\abc_parse.js parse\abc_parse_directive.js ^
    parse\abc_parse_header.js parse\abc_parse_key_voice.js ^
    parse\abc_tokenizer.js parse\abc_transposer.js > tmp\parse.js

cat tablature\accordion_map.js tablature\accordion_parse.js ^
    tablature\accordion_infer.js tablature\accordion_layout.js > tmp\tablature.js

cat diatonic\diatonic-map.js diatonic\accordion* > tmp\diatonic.js

cat write\abc_glyphs.js write\abc_graphelements.js write\abc_layout.js ^
    write\abc_write.js write\sprintf.js > tmp\write.js

cat api\abc_tunebook.js data\abc_tune.js tmp\parse.js tmp\write.js > tmp\abcjs-noraphael-nomidi.js
cat tmp\abcjs-noraphael-nomidi.js midi\abc_midiwriter.js > tmp\abcjs-noraphael.js
cat write\raphael.js tmp\abcjs-noraphael-nomidi.js > tmp\abcjs_nomidi.js
cat write\raphael.js tmp\abcjs-noraphael.js > tmp\abcjs_all.js

cat tmp\abcjs_all.js edit\abc_editor.js > tmp\abcjs_editor.js
cat tmp\abcjs_nomidi.js edit\abc_editor.js > tmp\abcjs_editor-nomidi.js
cat tmp\abcjs-noraphael.js edit\abc_editor.js > tmp\abcjs_editor-noraphael.js
cat tmp\abcjs-noraphael-nomidi.js edit\abc_editor.js > tmp\abcjs_editor-noraphael-nomidi.js

cat tmp\abcjs_editor.js tmp\tablature.js > tmp\abcjs_tabeditor.js
cat tmp\abcjs_editor-nomidi.js tmp\tablature.js > tmp\abcjs_tabeditor-nomidi.js
cat tmp\abcjs_editor-noraphael.js tmp\tablature.js > tmp\abcjs_tabeditor-noraphael.js
cat tmp\abcjs_editor-noraphael-nomidi.js tmp\tablature.js > tmp\abcjs_tabeditor-noraphael-nomidi.js

cat tmp\abcjs-noraphael.js plugin\abc_plugin.js > tmp\abcjs_plugin-noraphael.js
cat tmp\abcjs_all.js plugin\abc_plugin.js > tmp\abcjs_plugin.js

echo "Compressing basic..."
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_basic_%versao%-min.js tmp\abcjs_all.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_basic_nomidi_%versao%-min.js tmp\abcjs_nomidi.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_basic_noraphael_%versao%-min.js tmp\abcjs-noraphael.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_basic_noraphael_nomdidi_%versao%-min.js tmp\abcjs-noraphael-nomidi.js
rem echo "Compressing editor..."
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_editor_%versao%-min.js tmp\abcjs_editor.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_editor_nomidi_%versao%-min.js tmp\abcjs_editor-nomidi.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_editor_noraphael_%versao%-min.js tmp\abcjs_editor-noraphael.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_editor_noraphael_nomidi_%versao%-min.js tmp\abcjs_editor-noraphael-nomidi.js
echo "Compressing tabeditor..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_tabeditor_%versao%-min.js tmp\abcjs_tabeditor.js
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_tabeditor_nomidi_%versao%-min.js tmp\abcjs_tabeditor-nomidi.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_tabeditor_noraphael_%versao%-min.js tmp\abcjs_tabeditor-noraphael.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_tabeditor_noraphael_nomidi_%versao%-min.js tmp\abcjs_tabeditor-noraphael-nomidi.js
rem echo "Compressing plugin..."
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_plugin_noraphael_nojquery_%versao%-min.js tmp\abcjs_plugin-noraphael.js
rem java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o bin\abcjs_plugin_nojquery_%versao%-min.js tmp\abcjs_plugin.js

rem cat jquery-1.10.2.min.js bin\abcjs_plugin_nojquery_%versao%-min.js > bin\abcjs_plugin_%versao%-min.js
rem cat plugin\greasemonkey.js bin\abcjs_plugin_%versao%-min.js > bin\abcjs_plugin_%versao%.user.js

echo "Removing temporary files..."
rm tmp\*

