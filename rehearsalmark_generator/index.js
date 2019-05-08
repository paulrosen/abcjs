const TextToSVG = require('text-to-svg');
var svgpath = require('svgpath');

const textToSVG = TextToSVG.loadSync('./NotoSerifCJKjp-Bold.otf');

const attributes = {fill: 'black', stroke: 'black'};
const options = {x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes};


const dash = svgpath(textToSVG.getD("’", options)).rel().scale(0.75).translate(50,10)
const dash2 = svgpath(textToSVG.getD("’", options)).rel().scale(0.75).translate(60,10)
const data = {}

for(var i = 0; i < 12; i++){
  const text = String.fromCodePoint('🄰'.codePointAt(0)+i)
  const d = textToSVG.getD(text, options);
  const char = String.fromCharCode('A'.charCodeAt(0)+i)
  const tmp = {}
  tmp[`${char}`] = {}
  tmp[`${char}\\'`] = {}
  tmp[`${char}\\'\\'`] = {}
  tmp[`${char}`].svg = d
  tmp[`${char}\\'`].svg = d + dash
  tmp[`${char}\\'\\'`].svg = d + dash + dash2
  for(j in tmp) {
    tmp[j].scaleX = 0.33
    tmp[j].scaleY = 0.33
    tmp[j].translateX = -33
    tmp[j].translateY = -85
    data[j] = tmp[j]
  }
}
data['Intro'] = {}
data['Intro'].svg = textToSVG.getD('Intro', options)
data['Intro'].scaleX = 0.15
data['Intro'].scaleY = 0.23
data['Intro'].translateX = -33
data['Intro'].translateY = -85

data['Verse'] = {}
data['Verse'].svg = textToSVG.getD('Verse', options)
data['Verse'].scaleX = 0.15
data['Verse'].scaleY = 0.23
data['Verse'].translateX = -33
data['Verse'].translateY = -85

data['Solo'] = {}
data['Solo'].svg = textToSVG.getD('Solo', options)
data['Solo'].scaleX = 0.17
data['Solo'].scaleY = 0.23
data['Solo'].translateX = -33
data['Solo'].translateY = -85

data['Ending'] = {}
data['Ending'].svg = textToSVG.getD('Ending', options)
data['Ending'].scaleX = 0.13
data['Ending'].scaleY = 0.23
data['Ending'].translateX = -33
data['Ending'].translateY = -85

data['Interlude'] = {}
data['Interlude'].svg = textToSVG.getD('Interlude', options)
data['Interlude'].scaleX = 0.10
data['Interlude'].scaleY = 0.23
data['Interlude'].translateX = -33
data['Interlude'].translateY = -85

for(index in data) {
  var transformed = svgpath(data[index].svg)
                    .scale(data[index].scaleX, data[index].scaleY)
                    .translate(data[index].translateX, data[index].translateY)
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
