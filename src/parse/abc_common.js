//    abc_common.js: Some common utility functions.

var parseCommon = {};

parseCommon.cloneArray = function(source) {
	var destination = [];
	for (var i = 0; i < source.length; i++) {
		destination.push(Object.assign({},source[i]));
	}
	return destination;
};

parseCommon.cloneHashOfHash = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = Object.assign({},source[property]);
	return destination;
};

parseCommon.cloneHashOfArrayOfHash = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = parseCommon.cloneArray(source[property]);
	return destination;
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

parseCommon.last = function(arr) {
	if (arr.length === 0)
		return null;
	return arr[arr.length-1];
};


module.exports = parseCommon;
