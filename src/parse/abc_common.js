//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.
//    Copyright (C) 2010-2018 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var parseCommon = {};

parseCommon.clone = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = source[property];
	return destination;
};

parseCommon.cloneArray = function(source) {
	var destination = [];
	for (var i = 0; i < source.length; i++) {
		destination.push(parseCommon.clone(source[i]));
	}
	return destination;
};

parseCommon.cloneHashOfHash = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = parseCommon.clone(source[property]);
	return destination;
};

parseCommon.cloneHashOfArrayOfHash = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = parseCommon.cloneArray(source[property]);
	return destination;
};

parseCommon.gsub = function(source, pattern, replacement) {
	return source.split(pattern).join(replacement);
};

parseCommon.strip = function(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

parseCommon.startsWith = function(str, pattern) {
	return str.indexOf(pattern) === 0;
};

parseCommon.endsWith = function(str, pattern) {
	var d = str.length - pattern.length;
	return d >= 0 && str.lastIndexOf(pattern) === d;
};

parseCommon.each = function(arr, iterator, context) {
	for (var i = 0, length = arr.length; i < length; i++)
	  iterator.apply(context, [arr[i],i]);
};

parseCommon.last = function(arr) {
	if (arr.length === 0)
		return null;
	return arr[arr.length-1];
};

parseCommon.compact = function(arr) {
	var output = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i])
			output.push(arr[i]);
	}
	return output;
};

parseCommon.detect = function(arr, iterator) {
	for (var i = 0; i < arr.length; i++) {
		if (iterator(arr[i]))
			return true;
	}
	return false;
};

// The following is a polyfill for Object.remove for IE9, IE10, and IE11.
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				if (this.parentNode !== null)
					this.parentNode.removeChild(this);
			}
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

module.exports = parseCommon;
