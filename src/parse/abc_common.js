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

module.exports = parseCommon;
