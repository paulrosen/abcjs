function TabInstrumentName( text,  getTextSize ) {
  this.rows = [];
  this.rows.push({ left: 15,text: text, font: 'infofont', klass: 'text instrumentname', anchor: 'start' });
  var size = getTextSize.calc(text, 'infofont', 'text instrumentname');
  this.rows.push({ move: size.height });
}

module.exports = TabInstrumentName;
