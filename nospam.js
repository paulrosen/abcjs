//------------------------------------------------------------------------
//    Copyright 2009 Applied Research in Patacriticism and the University of Virginia
//    
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//  
//        http://www.apache.org/licenses/LICENSE-2.0
//  
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//----------------------------------------------------------------------------

// This looks for our specially encoded email addresses and replaces them with a simple mailto on the fly.
// The hope is that spambots run on the downloaded source, which doesn't contain the address, but a
// tenth of a second after the page finishes loading we will decode the email address so the user can click
// on it normally.
// The node should look like one of the following:
//		<a class="nospam" href="encoded_address">$$$$</a>
//		<a class="nospam" href="encoded_address">anything</a>
// The first form is where the visible text is the email address. The function changes both.
// The second form is where the visible text is not the email address. For instance, it could be "click here to email us".
// The encoded_address replaces the @ and the . with spaces. For instance, if this is encoded "me example com", then the address is "me@example.com".

/*global $$ */
/*global document, setTimeout */
/*extern nospam */

var nospam = function() {
	var links = $$("a.nospam");
	links.each(function(link) {
		var raw_addr = link.href;
		// The format of the href is processed by the browser. A site is prepended so we need to ignore everything before the last "/" and the spaces are converted to "%20"
		var arrParts = raw_addr.split('/');
		var arr = arrParts[arrParts.length-1].split('%20');
		if (arr.length === 3)
		{
			var addr = arr[1] + '@' + arr[0] + '.' + arr[2];
			link.href = "mailto:" + addr;
			if (link.innerHTML === '$$$$')
				link.innerHTML = addr; // "DESPAMMED!" + addr;	// Add some identifying text while debugging. Remove this before checking in.
		}
	});
};

document.observe('dom:loaded', function() {
 	setTimeout(function() {
		nospam();
	}, 100);
 });
