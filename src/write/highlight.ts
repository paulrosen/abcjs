import setClass from './set-class';

var highlight = function(this: any, klass: any, color: any) {
  if (klass === undefined) klass = "abcjs-note_selected";
  if (color === undefined) color = "#ff0000";
  setClass(this.elemset, klass, "", color);
};

export default highlight;
