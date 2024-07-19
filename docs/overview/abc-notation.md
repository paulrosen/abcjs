# ABC Music Notation

The input to **abcjs** is mostly standard ABC Music Notation. That notation is described here:

[ABC Notation](http://abcnotation.com/learn)

The working document for the standard is [ABC Standard](https://abcnotation.com/wiki/abc:standard)

In addition, there are many informal additions, particularly with new `%%` directives, that are supported to be compatible with other ABC software.

## Subtractions from the standard

We've made an attempt to be compatible with other ABC software, but there are some exceptions.

Some of the things that are supported by other packages are specific to that package's environment and don't apply to a web-based solution. Those features are not supported.

Here is a list of formatting options that will probably not be supported:

```
%%abc
%%abc2pscompat
%%abcm2ps
%%autoclef
%%beginps
%%beginsvg
%%bgcolor
%%break
%%breaklimit
%%breakoneoln
%%clip
%%deco
%%decoration
%%eps
%%format
%%fullsvg
%%map
%%micronewps
%%pango
%%pdfmark
%%ps
%%select
%%tune
%%voicemap
```

Some of the things that are supported by other packages we've just not gotten around to supporting yet. If you run into a feature that you would like to see, let us know.

## Additions to the standard

### Alternate note heads:

In both the K: and the V: element, you can include the parameter:

```
style=rhythm
style=harmonic
style=x
style=normal
style=triangle
```

You can also use the above as a decoration to a single note to affect just that note:

```
!style=rhythm!
```

This changes the note heads to a different shape.

Here's a sample:

<show-and-render-abc :abc='`X:1
T:alternate heads
M:C
L:1/8
U:n=!style=normal!
K:C treble style=rhythm
"Am" BBBB B2 B&gt;B | "Dm" B2 B/B/B "C" B4 |\
"Am" B2 nGnB B2 nGnA | "Dm" nDB/B/ nDB/B/ "C" nCB/B/ nCB/B/ |B8| B0 B0 B0 B0 |]
%%text This translates to:
[M:C][K:style=normal]
[A,EAce][A,EAce][A,EAce][A,EAce] [A,EAce]2 [A,EAce]&gt;[A,EAce] |\
[DAdf]2 [DAdf]/[DAdf]/[DAdf] [CEGce]4 |\
[A,EAce]2 GA [A,EAce] GA |\
D[DAdf]/[DAdf]/ D[DAdf]/[DAdf]/ C [CEGce]/[CEGce]/ C[CEGce]/[CEGce]/ |[CEGce]8 | [CEGce]2 [CEGce]2 [CEGce]2 [CEGce]2 |]
GAB2 !style=harmonic![gb]4|GAB2 [K: style=harmonic]gbgb|
[K: style=x]
C/A,/ C/C/E C/zz2|
w:Rock-y did-nt like that
`' ></show-and-render-abc>

### Chord Break:

If you want to skip a chord, then use one of the following as the chord:

```
"^break"
"^(break)"
"^no chord"
"^n.c."
"^tacet"
```

<render-abc ref="tune" :abc='`X:1
T:Struttin With Some BBQ
C:1923 Lil Hardin Armstrong
M:4/4
L:1/8
K:F
"G7"d4AFGA|dA-A6|"C7"cB"^N.C."GF EDC=B,|_B,2zF EFAc|
`' ></render-abc>

<render-audio :obj="$refs"></render-audio>

These are case-insensitive.

### mark:

To arbitrarily add the class "mark" to the next note, you can use the decoration:
```
!mark!
```

<render-abc :abc='`X:1
K:C
e!mark!f|g
`' ></render-abc>

### MIDI:

And extra octave parameter is accepted in `bassprog` and `chordprog`:
```
%%MIDI bassprog 22 octave=-1
%%MIDI chordprog 2 octave=1
```
