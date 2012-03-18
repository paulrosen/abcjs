// ==UserScript==
// @name          abcjs
// @namespace     http://code.google.com/p/abcjs
// @description	  This searches any page you load for ABC-formatted music and inserts the standard notation for it.
// ==/UserScript==

// Because the js files are concatenated, these variables will be visible to the ones in abcjs_plugin user script.
// However, this file is not included in the regular abcjs_plugin, so that won't be affected.
var abcjs_is_user_script = true;
var scripts = document.getElementsByTagName('script');
var abcjs_plugin_autostart = true;
for (var i = 0; i < scripts.length; i++) {
	var src = scripts[i].src;
	if (src.indexOf('abcjs') > 0)
		abcjs_plugin_autostart = false;
}
