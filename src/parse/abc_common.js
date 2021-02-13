//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.

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
try {
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
} catch(e) {
	// if we aren't in a browser, this code will crash, but it is not needed then either.
}
module.exports = parseCommon;
