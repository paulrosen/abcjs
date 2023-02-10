<template>
	<div class="example-tune-book">
		<abcjs-editor :callbacks="callbacks" :abc="abc"></abcjs-editor>
	</div>
</template>

<script>
import AbcjsEditor from "./AbcjsEditor.vue";

	export default {
		name: "example-tune-book",
		components: {AbcjsEditor},
		props: {
			callbacks: {
				type: Array,
				required: false
			},
			tuneId: {
				type: Number,
				required: false
			},
		},
		computed: {
			abc() {
				let str;
				if (!window.abcjs)
				 	return "";

				if (this.tuneId === undefined)
					return this.allTunes;

				const book = new window.abcjs.TuneBook(this.allTunes);
				return book.getTuneById(''+this.tuneId).abc;
			},
		},
		data() {
			const abc = `%%gchordfont "itim-music,Itim" 20
X: 1
T:Money Lost
M:3/4
L:1/8
Q:1/4=100
C:Paul Rosen
S:Copyright 2007, Paul Rosen
R:Klezmer
K:Dm
Ade|:"Dm"(f2d)e gf|"A7"e2^c4|"Gm"B>>^c BA BG|"A"A3Ade|"Dm"(f2d)e gf|"A7"e2^c4|
"Gm"A>>B "A7"AG FE|1"Dm"D3Ade:|2"Dm"D3DEF||:"Gm"(G2D)E FG|"Dm"A2F4|"Gm"B>>c "A7"BA BG|
"Dm"A3 DEF|"Gm"(G2D)EFG|"Dm"A2F4|"E°"E>>Fy "(A7)"ED^C2|1"Dm"D3DEF:|2"Dm"D6||

X: 32
T:Pretty Little Liza
C:Paul Rosen
S:Copyright 2005, Paul Rosen
M:4/4
L:1/8
Q:1/2=106
R:old time
K:Am
"Am"A2AA c2dd|e2eg e2dc|A2AA c2dd|e2cc A2cc|"Em (G)"B2BB B2BB|
B2BB B2BB|"Am"A2AA c2dd|e2eg e2c2|"D"d2dd d2dd|d2dd d2cd|
"Am"e2cc A2c2|"G"BAG2 BAG2|"Am"A2AA A2AA|A2AA A2AA|:"Am"e4 a3e|"G"g2d2- d2eg|
"Am"a2aa ged2|"Em"e2ee e2ee|"Am"e4 a3e|"G"g2d2- d2Bc|"Em"d2e2 dcB2|"Am"A2AA A2AA:|

X:49
M:4/4
L:1/16
%%stretchlast .7
Q:1/4=100
T:Piano
%%staves {(PianoRightHand) (PianoLeftHand)}
V:PianoRightHand clef=treble
V:PianoLeftHand clef=bass
K:C
[V: PianoRightHand] !mp!e2f2 e2d2 c2B2 A4|!>(!B2d2 g4 c6 !>)!e2|!p![G4e4] z4 A4 G4|c12 z4|[A12f12] [g4d4]|z4 !<(!B4 !<)![A8c8]|
!mf!A4 z4 d8|B8 [G4c4] z4|f2A2 c4 f4 g4|[f12d12] e4|!<(!A4 A4 c2e2 !<)!g4|!f!e8 z8|
[A4d4] z4 A8|BcBA G4 c4 G2B2|A2G2 A2B2 c4 B2G2|c12 z4|]
[V: PianoLeftHand] [E,12C,12] F,4|[G,8D,8] [C,8E,8]|G,4 C,4 C,4 B,,A,,C,B,,|A,,12 z4|A,,4 B,,4 C,2D,2 B,,C,D,E,|C,2E,2 G,4 E,2F,2 G,4|
F,4 A,4 [A,8F,8]|G,2F,2 E,2D,2 [C,4E,4] z4|[F,8A,8] [D,4A,4] z4|F,2G,2 A,2F,2 D,2F,2 C,2B,,2|C,4 F,A,D,F, E,4 z4|C,8 z8|
F,4 E,4 F,4 A,4|[D,8G,8] E,4 z4|C,4 [C,4F,4] z4 G,4|C,12 z4|]

X:77
T:Mary
M:C
L:1/4
K:G
BAGA| BBB2|AAA2| Bdd2|
w:Mar- y had a lit- tle lamb, lit- tle lamb, lit- tle lamb,
BAGA| BBBB|AABA |G|]
w:Mar- y had a lit- tle lamb whose fleece was white as snow.

X:102
%%staves 1 2 3
T: Sonata I
C: J.S. Bach
M: C
Q:"Adagio"
L: 1/8
K:C
V:1 clef=treble name="Violino I"      sname="Vl. I"
V:2 clef=treble name="Violino II"     sname="Vl. II"  space=+10
V:3 clef=bass   name="Violoncello" sname="Vc."
[V:1]  g8-|gf/e/ {e}f>g (a/f/d/f/) (A//=B//A//B//TB3//A///B///)|
[V:2] z8 | z8 |
[V:3] z cec gGBG | Aa- a/_b/a/g/ f3 g/f/ |
%
[V:1] c/gf/ E/ed/ c/c'b/ A/ag/ | ^f/e/d- d/(c/B/A/) G/(e/c/e/) Aa| d2-d/g/_b/a/ a3 g/=f/|
[V:2] c8- | cB/A/ {A}B>c (e/c/A/c/) (E//^F//E//F//TF3//E///F///) | G/(D/G/A/) _B/G/g/e/ ^cA d2-|
[V:3] edcB AG^FE | D^FGg c3d/c/| _BG g2-gf/e/ f>g|

X:232
T:Amazing Grace
C:Lyric Author: John Newton
R:Early American Melody
Z:Public Domain
N:A well known tune
L:1/4
M:3/4
%%staves (S A) (T B)
V:S clef=treble name=""
V:A clef=treble name=""
V:T clef=bass name=""
V:B clef=bass name=""
K:Ab
% Measures 1 - 7
[V:S] (E/ F/) | A2 (c/ A/) | c2 B | A2 F |  E2 (E/ F/) | A2 (c/ A/) | c2 (B/ c/) | He2 |
[V:A] (C/ D/) | C2 (E/ C/) | E2 D | C2 D | C2 (C/ D/) | C2 (E/ C/) | E2 A | G2 |
[V:T] A, | E,2 A, | A,2 G, | A,2 A, | A,2 A, | E,2 A, | A,2 A, | HB,2 |
[V:B] A,, | A,,2 A,, | A,,2 E, | F,2 D, | A,,2 A,, | A,,2 A,, | A,2 F, | E,2 |
% Measures 8 - 14
[V:S] (B/ c/) | e2 (e/ c/)  | A2 (F/ E/) |  A2 F | E2 (E/ F/) | A2 (c/ A/) | c2 B | HA2 |
[V:A] G | A2 (A/ E/) | E2 (D/ C/) | F2 D | C2 (C/ D/) | C2 (E/ A/) | G2 G | E2 |
[V:T] E | C2 (C/ A,/) | C2 A, | A,2 A, | A,2 A, | A,2 (A,/ C/) | E2 D | HC2 |
[V:B] E, | A,2 A, | A,2 A, | D,2 D, | A,,2 A, | F,2 E, | E,2 E, | A,,2 |

X:400
T:Drum Kit
%%map drummap D    print=D heads=x_head   % pedal hi-hat
%%map drummap E    print=E                % bass drum 1
%%map drummap F    print=F                % acoustic bass drum
%%map drummap G    print=G                % low floor tom-tom
%%map drummap A    print=A                % high floor tom-tom
%%map drummap B    print=B                % low tom-tom
%%map drummap ^B   print=B heads=triangle % tambourine
%%map drummap c    print=c                % acoustic snare
%%map drummap _c   print=c                % electric snare
%%map drummap ^c   print=c heads=triangle % low wood block
%%map drummap =c   print=c                % side stick
%%map drummap d    print=d                % low-mid tom tom
%%map drummap ^d   print=d heads=triangle % high wood block
%%map drummap e    print=e                % high-mid tom tom
%%map drummap ^e   print=e heads=triangle % cowbell
%%map drummap f    print=f                % high tom tom
%%map drummap ^f   print=f heads=x_head   % ride cymbal 1
%%map drummap g    print=g heads=x_head   % closed hi-hat
%%map drummap ^g   print=g heads=diamond  % open hi-hat
%%map drummap a    print=a heads=x_head   % crash cymbal 1
%%map drummap ^a   print=a heads=triangle % open triangle
%%MIDI drummap D   44 % pedal hi-hat
%%MIDI drummap E   36 % bass drum 1
%%MIDI drummap F   35 % acoustic bass drum
%%MIDI drummap G   41 % low floor tom-tom
%%MIDI drummap A   43 % high floor tom-tom
%%MIDI drummap B   45 % low tom-tom
%%MIDI drummap ^B  54 % tambourine
%%MIDI drummap c   38 % acoustic snare
%%MIDI drummap _c  40 % electric snare
%%MIDI drummap ^c  77 % low wood block
%%MIDI drummap =c  37 % side stick
%%MIDI drummap d   47 % low-mid tom tom
%%MIDI drummap ^d  76 % high wood block
%%MIDI drummap e   48 % high-mid tom tom
%%MIDI drummap ^e  56 % cowbell
%%MIDI drummap f   50 % high tom tom
%%MIDI drummap ^f  51 % ride cymbal 1
%%MIDI drummap g   42 % closed hi-hat
%%MIDI drummap ^g  46 % open hi-hat
%%MIDI drummap a   49 % crash cymbal 1
%%MIDI drummap ^a  81 % open triangle
%%score (1 2)
Q:1/4=120
M:4/4
L:1/4
K:C perc
V:1
z4| g/^f/g/^f/ g/^f/g/^f/| c/^f/g/^f/ A/^f/g/^f/| c/^f/g/^f/ A/^f/g/^f/|
c/c/g/^f/ A/A/g/^f/| c/^f/c/^f/ A/^f/A/^f/|(3B/B/B/ (3f/f/f/ (3e/e/e/ (3d/d/d/ | a4|
V:2
E D E/E/ D|E D E/E/ D|E D E/E/ D|E D E/E/ D|
E D E/E/ D|E D E/E/ D|E D E/E/ D|E D E/E/ D|
`;

			return {
				allTunes: abc,
				abcjs: null,
			}
		},
	};
</script>
