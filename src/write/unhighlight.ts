import setClass from './set-class';

var unhighlight = function(this: any, klass: any, color: any) {
  if (klass === undefined) klass = "abcjs-note_selected";
  if (color === undefined) color = "#000000";
  setClass(this.elemset, "", klass, color);
};

export default unhighlight;
