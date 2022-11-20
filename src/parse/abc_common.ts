//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.

var parseCommon = {};

// @ts-expect-error TS(2339): Property 'clone' does not exist on type '{}'.
parseCommon.clone = function (source: any) {
  var destination = {};
  for (var property in source)
    if (source.prototype.hasOwnProperty.call(property))
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      destination[property] = source[property];
  return destination;
};

// @ts-expect-error TS(2339): Property 'cloneArray' does not exist on type '{}'.
parseCommon.cloneArray = function (source: any) {
  var destination = [];
  for (var i = 0; i < source.length; i++) {
    // @ts-expect-error TS(2339): Property 'clone' does not exist on type '{}'.
    destination.push(parseCommon.clone(source[i]));
  }
  return destination;
};

// @ts-expect-error TS(2339): Property 'cloneHashOfHash' does not exist on type ... Remove this comment to see the full error message
parseCommon.cloneHashOfHash = function (source: any) {
  var destination = {};
  for (var property in source)
    if (source.prototype.hasOwnProperty.call(property))
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      destination[property] = parseCommon.clone(source[property]);
  return destination;
};

// @ts-expect-error TS(2339): Property 'cloneHashOfArrayOfHash' does not exist o... Remove this comment to see the full error message
parseCommon.cloneHashOfArrayOfHash = function (source: any) {
  var destination = {};
  for (var property in source)
    if (source.prototype.hasOwnProperty.call(property))
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      destination[property] = parseCommon.cloneArray(source[property]);
  return destination;
};

// @ts-expect-error TS(2339): Property 'gsub' does not exist on type '{}'.
parseCommon.gsub = function (source: any, pattern: any, replacement: any) {
  return source.split(pattern).join(replacement);
};

// @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
parseCommon.strip = function (str: any) {
  return str.replace(/^\s+/, "").replace(/\s+$/, "");
};

// @ts-expect-error TS(2339): Property 'startsWith' does not exist on type '{}'.
parseCommon.startsWith = function (str: any, pattern: any) {
  return str.indexOf(pattern) === 0;
};

// @ts-expect-error TS(2339): Property 'endsWith' does not exist on type '{}'.
parseCommon.endsWith = function (str: any, pattern: any) {
  var d = str.length - pattern.length;
  return d >= 0 && str.lastIndexOf(pattern) === d;
};

// @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
parseCommon.each = function (arr: any, iterator: any, context: any) {
  for (var i = 0, length = arr.length; i < length; i++)
    iterator.apply(context, [arr[i], i]);
};

// @ts-expect-error TS(2339): Property 'last' does not exist on type '{}'.
parseCommon.last = function (arr: any) {
  if (arr.length === 0) return null;
  return arr[arr.length - 1];
};

// @ts-expect-error TS(2339): Property 'compact' does not exist on type '{}'.
parseCommon.compact = function (arr: any) {
  var output = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) output.push(arr[i]);
  }
  return output;
};

// @ts-expect-error TS(2339): Property 'detect' does not exist on type '{}'.
parseCommon.detect = function (arr: any, iterator: any) {
  for (var i = 0; i < arr.length; i++) {
    if (iterator(arr[i])) return true;
  }
  return false;
};

// The following is a polyfill for Object.remove for IE9, IE10, and IE11.
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
try {
  (function (arr) {
    arr.forEach(function (item) {
      // @ts-expect-error TS(2339): Property 'prototype' does not exist on type 'Eleme... Remove this comment to see the full error message
      if (item.prototype.hasOwnProperty.call("remove")) {
        return;
      }
      Object.defineProperty(item, "remove", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null) this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
} catch (e) {
  // if we aren't in a browser, this code will crash, but it is not needed then either.
}
export default parseCommon;
