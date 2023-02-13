# Javascript library for inserting music in the browser.

![abcjs](https://paulrosen.github.io/abcjs/img/abcjs_comp_extended_08.svg)

**ABC Music Notation** is a format for specifying sheet music using only a string of characters. 
For instance, the following string encodes the music that is shown below it. That music was
drawn by including this library on this webpage.

```
X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|
```

<render-abc ref="tune" :abc="`X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|`" ></render-abc>

In addition, the music can also be played by a synthesizer:

<render-audio :obj="$refs"></render-audio>
