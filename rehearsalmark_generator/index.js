const TextToSVG = require('text-to-svg');
var svgpath = require('svgpath');

const textToSVG = TextToSVG.loadSync('./NotoSerifCJKjp-Bold.otf');

const attributes = {fill: 'black', stroke: 'black'};
const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};


const dash = svgpath(textToSVG.getD("’", options)).rel().scale(0.75).translate(50,10)
const dash2 = svgpath(textToSVG.getD("’", options)).rel().scale(0.75).translate(60,10)

for(var i = 0; i < 26; i++){
  const text = String.fromCodePoint('🄰'.codePointAt(0)+i)
  const d = textToSVG.getD(text, options);
  const char = String.fromCharCode('A'.charCodeAt(0)+i)
  const data = {}
  data[`${char}`] = d
  data[`${char}\\'`] = d + dash
  data[`${char}\\'\\'`] = d + dash + dash2
  for(index in data) {
    var transformed = svgpath(data[index])
                      .scale(0.33)
                      .translate(-33,-85)
                      .rel()
                      .round(3)
    const json = JSON.stringify(
      {
        d:transformed.segments,
        w:0,
				h:0
      }
    )
    console.log(`'scripts.${index}':${json},`)
  }
}
