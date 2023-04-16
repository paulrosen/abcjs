declare module 'abcjs' {
	//
	// Enumerations
	//

	export type Clef = 'treble' | 'tenor' | 'bass' | 'alto' | 'treble+8' | 'tenor+8' | 'bass+8' | 'alto+8' | 'treble-8' | 'tenor-8' | 'bass-8' | 'alto-8' | 'none' | 'perc';

	export type Bar = 'bar_dbl_repeat' | 'bar_right_repeat' | 'bar_left_repeat' | 'bar_invisible' | 'bar_thick_thin' | 'bar_thin_thin' | 'bar_thin' | 'bar_thin_thick';

	export type MeterType = 'common_time' | 'cut_time' | 'specified' | 'tempus_perfectum' | 'tempus_imperfectum' | 'tempus_perfectum_prolatio' | 'tempus_imperfectum_prolatio';

	export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

	export type AccidentalName = 'flat' | 'natural' | 'sharp' | 'dblsharp' | 'dblflat' | 'quarterflat' | 'quartersharp';

	export type ChordRoot = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

	export type KeyRoot = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'HP' | 'Hp' | 'none';

	export type KeyAccidentalName = '' | '#' | 'b';

	export type Mode = '' | 'm' | 'Dor' | 'Mix' | 'Loc' | 'Phr' | 'Lyd';

	export type ChordType = '' | 'm' | '7' | 'm7' | 'maj7' | 'M7' | '6' | 'm6' | 'aug' | '+' | 'aug7' | 'dim' | 'dim7' | '9' |
		'm9' | 'maj9' | 'M9' | '11' | 'dim9' | 'sus' | 'sus9' | '7sus4' | '7sus9' | '5';

	export type Placement = 'above' | 'below';

	export type ChordPlacement = 'above' | 'below' | 'left' | 'right' | 'default';

	export type BracePosition = "start" | "continue" | "end";

	export type Alignment = 'left' | 'center' |'right';

	export type Media = 'screen' | 'print';

	export type ProgressUnit = "seconds" | "beats" | "percent";

	export type NoteTimingEventType = "end" | "event";

	export type MidiOutputType = 'encoded' | 'binary' | 'link';

	export type Responsive = 'resize';

	export type DragTypes = 	"author" | "bar" | "brace" | "clef" | "composer" | "dynamicDecoration" | "ending" | "extraText" |
		"freeText" | "keySignature" | "note" | "part" | "partOrder" | "rhythm" | "slur" | "subtitle" | "tempo" | "timeSignature" | "title" |
		"unalignedWords" | "voiceName";

	export type FormatAttributes = "titlefont" | "gchordfont" | "composerfont" | "footerfont" | "headerfont" | "historyfont" | "infofont" |
		"measurefont" | "partsfont" | "repeatfont" | "subtitlefont" | "tempofont" | "textfont" | "voicefont" | "tripletfont" | "vocalfont" |
		"wordsfont" | "annotationfont" | "scale" | "partsbox" | "freegchord" | "fontboxpadding" | "stretchlast" | "tablabelfont" | "tabnumberfont" | "tabgracefont";

	export type MidiCommands = "nobarlines" | "barlines" | "beataccents" | "nobeataccents" | "droneon" | "droneoff" | "noportamento" | "channel" | "c" |
		"drumon" | "drumoff" | "fermatafixed" | "fermataproportional" | "gchordon" | "gchordoff" | "bassvol" | "chordvol" | "bassprog" | "chordprog" |
		"controlcombo" | "temperamentnormal" | "gchord" | "ptstress" | "beatmod" | "deltaloudness" | "drumbars" | "pitchbend" |
		"gracedivider" | "makechordchannels" | "randomchordattack" | "chordattack" | "stressmodel" | "transpose" |
		"rtranspose" | "volinc" | "program" | "ratio" | "snt" | "bendvelocity" | "control" | "temperamentlinear" | "beat" | "beatstring" |
		"drone" | "bassprog" | "chordprog" | "drummap" | "portamento" | "expand" | "grace" | "trim" | "drum" | "chordname";

	export type StemDirection = 'up' | 'down' | 'auto' | 'none';

	export type NoteHeadType = 'normal' | 'harmonic' | 'rhythm' | 'x' | 'triangle';

	export type Decorations = "trill" | "lowermordent" | "uppermordent" | "mordent" | "pralltriller" | "accent" |
		"fermata" | "invertedfermata" | "tenuto" | "0" | "1" | "2" | "3" | "4" | "5" | "+" | "wedge" |
		"open" | "thumb" | "snap" | "turn" | "roll" | "irishroll" | "breath" | "shortphrase" | "mediumphrase" | "longphrase" |
		"segno" | "coda" | "D.S." | "D.C." | "fine" | "crescendo(" | "crescendo)" | "diminuendo(" | "diminuendo)" |"glissando(" | "glissando)" |
		"p" | "pp" | "f" | "ff" | "mf" | "mp" | "ppp" | "pppp" |  "fff" | "ffff" | "sfz" | "repeatbar" | "repeatbar2" | "slide" |
		"upbow" | "downbow" | "staccato" | "trem1" | "trem2" | "trem3" | "trem4" |
		"/" | "//" | "///" | "////" | "turnx" | "invertedturn" | "invertedturnx" | "arpeggio" | "trill(" | "trill)" | "xstem" |
		"mark" | "marcato" | "umarcato" |
		"D.C.alcoda" | "D.C.alfine" | "D.S.alcoda" | "D.S.alfine" | "editorial" | "courtesy"

	//
	// Basic types
	//
	export type Selector = string | HTMLElement

	type NumberFunction = () => number;

	export interface MeterFraction {
		num: number;
		den?: number;
	}

	export interface ClefProperties {
		stafflines?: number;
		staffscale?: number;
		transpose?: number;
		type: Clef;
		verticalPos: number;
		clefPos?: number;
	}

	export interface Meter {
		type: MeterType;
		value?: Array<MeterFraction>;
		beat_division?: Array<MeterFraction>;
	}

	export interface Accidental {
		acc: AccidentalName;
		note: NoteLetter;
		verticalPos: number;
	}

	export interface KeySignature {
		accidentals?: Array<Accidental>;
		root: KeyRoot;
		acc: KeyAccidentalName;
		mode: Mode;
	}

	export interface Font {
		face: string;
		size: number;
		weight: 'normal' | 'bold';
		style: 'normal' | 'italic';
		decoration: 'none' | 'underline';
	}

	export interface TempoProperties {
		duration?: Array<number>;
		bpm?: number;
		endChar: number;
		preString?: string;
		postString?: string;
		startChar: number;
		suppress?: boolean;
		suppressBpm?: boolean;
	}

	export interface TextFieldProperties {
		endChar?: number;
		font: Font;
		text: string;
		center?: boolean;
		startChar?: number;
	}

	export interface ChordProperties {
		name: string;
		chord: {
			root: ChordRoot;
			type: ChordType;
		},
		position?: ChordPlacement
		rel_position?: {
			x: number;
			y: number;
		}
	}

	export interface CharRange {
		startChar: number;
		endChar: number;
	}

	export type MidiParam = Array<string|number>;

	export type MidiGracePitches = Array<{instrument: number; pitch: number; volume: number; cents?: number; durationInMeasures: number}>;

	export interface MidiPitch {
		instrument: number;
		pitch: number;
		duration: number;
		volume: number;
		cents?: number;
		start: number;
		gap: number;
	}

	export type MidiPitches = Array<MidiPitch>;

	export interface RelativeElement {
		x: number;
		c: string;
		dx: number;
		w: number;
		pitch: number;
		pitch2?: number;
		scaleX: number;
		scaleY: number;
		type: string;
		name: string;
		linewidth?: number;
		klass?: string;
		anchor?: "start" | "middle" | "end";
		top: number;
		bottom: number;
		dim?: number;
		position?: number;
		realWidth?: number;
		partHeightAbove?: number;
		chordHeightAbove?: number;
		chordHeightBelow?: number;
		lyricHeightAbove?: number;
		lyricHeightBelow?: number;
	}

	export interface AbsoluteElement {
		abcelem : AbcElem;
		bottom : number;
		children : Array<RelativeElement>
		duration : number;
		durationClass : number;
		elemset : Array<SVGElement>
		extra : Array<RelativeElement>
		extraw : number;
		fixed : {w: number, t: number, b: number}
		heads : Array<RelativeElement>
		invisible : boolean;
		minspacing : number;
		notePositions : Array<{x:number; y:number;}>
		right : Array<RelativeElement>
		specialY : Array<{
			chordHeightAbove : number;
			chordHeightBelow : number;
			dynamicHeightAbove : number;
			dynamicHeightBelow : number;
			endingHeightAbove : number;
			lyricHeightAbove : number;
			lyricHeightBelow : number;
			partHeightAbove : number;
			tempoHeightAbove : number;
			volumeHeightAbove : number;
			volumeHeightBelow : number;
		}>
		top : number;
		tuneNumber : number;
		type : "symbol" | "tempo" | "part" | "rest" | "note" | "bar" | "staff-extra clef" | "staff-extra key-signature" | "staff-extra time-signature";
		w : number;
		x : number;
	}

	export type AbstractEngraver = any;

	export type NoteProperties = any; // TODO

	export type AudioTrackCommand = 'program' | 'text' | 'note';
	//
	// Input Types
	//

	// renderAbc
	export interface Wrap {
		preferredMeasuresPerLine: number;
		minSpacing: number;
		maxSpacing: number;
		lastLineLimit?: number;
		minSpacingLimit?: number;
	}

	export interface AbcVisualParams {
		add_classes?: boolean;
		afterParsing?: AfterParsing;
		ariaLabel?: string;
		clickListener?: ClickListener;
		dragColor?: string;
		dragging?: boolean;
		foregroundColor?: string;
		format?: { [attr in FormatAttributes]?: any };
		header_only?: boolean;
		initialClef?: boolean;
		jazzchords?: boolean;
		germanAlphabet?: boolean;
		lineBreaks?: Array<number>;
		lineThickness?: number;
		minPadding?: number;
		oneSvgPerLine?: boolean;
		paddingbottom?: number;
		paddingleft?: number;
		paddingright?: number;
		paddingtop?: number;
		print?: boolean;
		responsive?: Responsive;
		scale?: number;
		scrollHorizontal?: boolean;
		selectionColor?: string;
		selectTypes?: boolean | Array<DragTypes>;
		showDebug?: Array<"grid" | "box">;
		staffwidth?: number;
		startingTune?: number;
		stop_on_warning?: boolean;
		textboxpadding?: number;
		viewportHorizontal?: boolean;
		viewportVertical?: boolean;
		visualTranspose?: number;
		wrap?: Wrap;
	}

	// TimingCallbacks
	export interface AnimationOptions {
		qpm?: number;
		extraMeasuresAtBeginning?: number;
		lineEndAnticipation?: number;
		beatSubdivisions?: number;
		beatCallback?: BeatCallback;
		eventCallback?: EventCallback;
		lineEndCallback?: LineEndCallback;
	}

	// Editor

	export interface EditorSynth {
		synthControl?: SynthObjectController;
		el: Selector;
		cursorControl: CursorControl;
		options: SynthOptions;
	}

	export interface EditorOptions {
		canvas_id?: Selector;
		paper_id?: Selector;
		generate_warnings?: boolean;
		warnings_id?: Selector;
		onchange?: OnChange;
		selectionChangeCallback?: SelectionChangeCallback;
		abcjsParams?: AbcVisualParams;
		indicate_changed?: boolean;
		synth?: EditorSynth;
	}

	// Audio
	export interface NoteMapTrackItem {
		pitch: number;
		instrument: number;
		start: number;
		end: number;
		startChar: number;
		endChar: number;
		volume: number;
		style?: string;
		cents?: number;
	}
	export type NoteMapTrack = Array<NoteMapTrackItem>

	export interface SynthOptions {
		soundFontUrl?: string;
		soundFontVolumeMultiplier?: number;
		programOffsets?: {[instrument: string]: number}
		fadeLength?: number;
		sequenceCallback?: (sequence: Array<NoteMapTrack>, context: any) => Array<NoteMapTrack>;
		callbackContext?: any; // Anything is ok. It is just passed back in the callback
		onEnded?: (context: any) => void;
		pan?: Array<number>;
		voicesOff?: boolean | Array<number>;
		drum?: string;
		drumBars?: number;
		drumIntro?: number;
		program?: number;
		midiTranspose?: number;
		visualTranspose?: number;
		channel?: number;
		qpm?: number;
		defaultQpm?: number;
		chordsOff?: boolean;
		detuneOctave?: boolean;
}

	export interface SynthVisualOptions {
		displayLoop?: boolean;
		displayRestart?: boolean;
		displayPlay?: boolean;
		displayProgress?: boolean;
		displayWarp?: boolean;
	}

	export type DownloadLabelFn = (visualObj: TuneObject, index: number) => string;

	export interface MidiFileOptions extends SynthOptions {
		midiOutputType?: MidiOutputType
		downloadClass?: string
		preTextDownload?: string
		downloadLabel?: string | DownloadLabelFn
		postTextDownload?: string
		fileName?: string
	}

	export interface MidiBufferOptions {
		audioContext? : AudioContext;
		visualObj?: TuneObject;
		sequence?: AudioSequence;
		millisecondsPerMeasure?: number;
		debugCallback? : (message: string) => void;
		options?: SynthOptions;
		onEnded?: (context: any) => void;
	}

	// Glyph
	export interface GlyphDef {
		d: Array<[string, ...number[]]>;
		w: number;
		h: number;
	}

	//
	// Return Types
	//

	// renderAbc
	interface NoteTimingEvent {
		milliseconds: number;
		millisecondsPerMeasure: number;
		type: NoteTimingEventType;

		elements?: Array<Array<HTMLElement>>;
		endChar?: number;
		endCharArray?: Array<number>;
		endX?: number;
		height?: number;
		left?: number;
		line?: number;
		measureNumber?: number;
		midiPitches?: MidiPitches;
		midiGraceNotePitches?: MidiGracePitches;
		startChar?: number;
		startCharArray?: Array<number>;
		top?: number;
		width?: number;
		measureStart?: boolean;
	}

	export interface PercMapElement {
		sound: number;
		noteHead: NoteHeadType;
	}

	export interface Formatting {
		alignbars?: number;
		aligncomposer?: Alignment;
		auquality?: string;
		bagpipes?: boolean;
		botmargin?: number;
		botspace?: number;
		bstemdown?: boolean;
		composerspace?: number;
		continueall?: boolean;
		continuous?: string;
		dynalign?: boolean;
		exprabove?: boolean;
		exprbelow?: boolean;
		flatbeams?: boolean;
		footer?: string;
		freegchord?: boolean;
		gchordbox?: boolean;
		graceSlurs?: boolean;
		gracespacebefore?: number;
		gracespaceinside?: number;
		gracespaceafter?: number;
		header?: string;
		indent?: number;
		infoline?: boolean;
		infospace?: number;
		leftmargin?: number;
		linesep?: number;
		lineskipfac?: number;
		map?: string;
		maxshrink?: number;
		maxstaffsep?: number;
		maxsysstaffsep?: number;
		measurebox?: boolean;
		midi?: {
			barlines?: MidiParam;
			bassprog?: MidiParam;
			bassvol?: MidiParam;
			beat?: MidiParam;
			beataccents?: MidiParam;
			beatmod?: MidiParam;
			beatstring?: MidiParam;
			bendvelocity?: MidiParam;
			c?: MidiParam;
			channel?: MidiParam;
			chordattack?: MidiParam;
			chordname?: MidiParam;
			chordprog?: MidiParam;
			chordvol?: MidiParam;
			control?: MidiParam;
			controlcombo?: MidiParam;
			deltaloudness?: MidiParam;
			drone?: MidiParam;
			droneoff?: MidiParam;
			droneon?: MidiParam;
			drum?: MidiParam;
			drumbars?: MidiParam;
			drummap: MidiParam;
			drumoff?: MidiParam;
			drumon?: MidiParam;
			expand?: MidiParam;
			fermatafixed?: MidiParam;
			fermataproportional?: MidiParam;
			gchord?: MidiParam;
			gchordon?: MidiParam;
			gchordoff?: MidiParam;
			grace?: MidiParam;
			gracedivider?: MidiParam;
			makechordchannels?: MidiParam;
			nobarlines?: MidiParam;
			nobeataccents?: MidiParam;
			noportamento?: MidiParam;
			pitchbend?: MidiParam;
			program?: MidiParam;
			portamento?: MidiParam;
			ptstress?: MidiParam;
			randomchordattack?: MidiParam;
			ratio?: MidiParam;
			rtranspose?: MidiParam;
			snt?: MidiParam;
			stressmodel?: MidiParam;
			temperamentlinear?: MidiParam;
			temperamentnormal?: MidiParam;
			transpose?: MidiParam;
			trim?: MidiParam;
			volinc: MidiParam;
		}
		musicspace?: number;
		nobarcheck?: string;
		notespacingfactor?: number;
		parskipfac?: number;
		partsbox?: boolean;
		partsspace?: number;
		percmap?: Array<PercMapElement>;
		playtempo?: string;
		rightmargin?: number;
		scale?: number;
		score?: string;
		slurheight?: number;
		splittune?: boolean;
		squarebreve?: boolean;
		staffsep?: number;
		staffwidth?: number;
		stemheight?: number;
		straightflags?: boolean;
		stretchlast?: number;
		stretchstaff?: boolean;
		subtitlespace?: number;
		sysstaffsep?: number;
		systemsep?: number;
		textspace?: number;
		titleformat?: string;
		titleleft?: boolean;
		titlespace?: number;
		topmargin?: number;
		topspace?: number;
		vocalabove?: boolean;
		vocalspace?: number;
		wordsspace?: number;

		annotationfont: Font;
		composerfont: Font;
		footerfont: Font;
		gchordfont: Font;
		headerfont: Font;
		historyfont: Font;
		infofont: Font;
		measurefont: Font;
		pageheight: number;
		pagewidth: number;
		partsfont: Font;
		repeatfont: Font;
		subtitlefont: Font;
		tabgracefont: Font;
		tablabelfont: Font;
		tabnumberfont: Font;
		tempofont: Font;
		textfont: Font;
		titlefont: Font;
		tripletfont: Font;
		vocalfont: Font;
		voicefont: Font;
		wordsfont: Font;
	}

	export interface EngraverController {
		classes: any;
		dragColor: string;
		dragIndex: number;
		dragMouseStart: { x: number, y: number; };
		dragTarget: null | any;
		dragYStep: number;
		dragging: boolean;
		engraver: AbstractEngraver;
		getFontAndAttr: any;
		getTextSize: any;
		listeners: [ClickListener];
		rangeHighlight: any;
		renderer: any;
		responsive?: boolean;
		scale: number;
		initialClef?: any;
		selectTypes: boolean | Array<DragTypes>;
		selectables: Array<Selectable>;
		selected: Array<any>;
		selectionColor: string;
		space: number;
		staffgroups: [any];
		staffwidthPrint: number;
		staffwidthScreen: number;
		width: number;
	}

	export interface MetaText {
		"abc-copyright"?: string;
		"abc-creator"?: string;
		"abc-version"?: string;
		"abc-charset"?: string;
		"abc-edited-by"?: string;
		author?: string;
		book?: string;
		composer?: string;
		decorationPlacement?: Placement;
		discography?: string;
		footer?: {
			left: string;
			center: string;
			right: string;
		};
		group?: string;
		header?: {
			left: string;
			center: string;
			right: string;
		}
		history?: string;
		instruction?: string;
		measurebox?: boolean;
		notes?: string;
		origin?: string;
		partOrder?: string;
		rhythm?: string;
		source?: string;
		tempo?: TempoProperties;
		textBlock?: string;
		title?: string;
		transcription?: string;
		unalignedWords?: Array<TextFieldProperties|string>;
		url?: string;
	}

	export interface MetaTextInfo {
		"abc-copyright": CharRange;
		"abc-creator": CharRange;
		"abc-version": CharRange;
		"abc-charset": CharRange;
		"abc-edited-by": CharRange;
		author: CharRange;
		book: CharRange;
		composer: CharRange;
		discography: CharRange;
		footer: CharRange;
		group: CharRange;
		header: CharRange;
		history: CharRange;
		instruction: CharRange;
		notes: CharRange;
		origin: CharRange;
		partOrder: CharRange;
		rhythm: CharRange;
		source: CharRange;
		tempo: CharRange;
		textBlock: CharRange;
		title: CharRange;
		transcription: CharRange;
		unalignedWords: CharRange;
		url: CharRange;
	}

	export interface VoiceItemClef {
		el_type: "clef";
		stafflines?: number;
		staffscale?: number;
		transpose?: number;
		type: Clef;
		verticalPos: number;
		clefPos?: number;
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemBar {
		el_type: "bar";
		barNumber?: number;
		chord?: Array<ChordProperties>;
		decoration: Array<Decorations>;
		endEnding?: boolean;
		startEnding?: string;
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemGap {
		el_type: "gap";
		gap: number;
	}

	export interface VoiceItemKey extends KeySignature {
		el_type: "key";
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemMeter extends Meter {
		el_type: "meter";
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemMidi {
		el_type: "midi";
		cmd: MidiCommands;
		params: Array<string|number>;
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemOverlay {
		el_type: "overlay";
		startChar: number;
		endChar: number;
		overlay: Array<NoteProperties>;
	}

	export interface VoiceItemPart {
		el_type: "part";
		startChar: number;
		endChar: number;
		title: string;
	}

	export interface VoiceItemScale {
		el_type: "scale";
		size: number;
	}

	export interface VoiceItemStem {
		el_type: "stem";
		direction: StemDirection;
	}

	export interface VoiceItemStyle {
		el_type: "style";
		head: NoteHeadType;
	}

	export interface VoiceItemTempo extends TempoProperties {
		el_type: "tempo";
		startChar: number;
		endChar: number;
	}

	export interface VoiceItemTranspose {
		el_type: "transpose";
		steps: number;
	}

	export interface VoiceItemNote extends NoteProperties {
		el_type: "note";
		startChar: number;
		endChar: number;
	}

	export type VoiceItem = VoiceItemClef | VoiceItemBar | VoiceItemGap | VoiceItemKey | VoiceItemMeter | VoiceItemMidi | VoiceItemOverlay | VoiceItemPart | VoiceItemScale | VoiceItemStem | VoiceItemStyle | VoiceItemTempo | VoiceItemTranspose | VoiceItemNote;

	export interface TuneLine {
		columns?: { formatting: any, lines: any };
		image?: string;
		newpage?: number;
		staffbreak?: number;
		// Only one of separator, subtitle, text, or staff will be present
		separator?: {
			endChar: number;
			lineLength?: number;
			spaceAbove?: number;
			spaceBelow?: number;
			startChar: number;
		};
		subtitle?: {
			endChar: number;
			startChar: number;
			text: string;
		};
		text?: {
			endChar: number;
			startChar: number;
			text: TextFieldProperties;
		};
		staff?: Array<{
					barNumber?: number;
					brace: BracePosition;
					bracket: BracePosition;
					clef?: ClefProperties;
					connectBarLines: BracePosition;
					gchordfont: Font;
					tripletfont: Font;
					vocalfont: Font;
					key?: KeySignature;
					meter?: Meter;
					spacingAbove?: number;
					spacingBelow?: number;
					stafflines?: number;
					staffscale?: number;
					title?: Array<string>;
					voices?: Array<Array<VoiceItem>>;
			}>
		vskip?: number;
	}

	export interface TuneObject {
		formatting: Formatting;
		engraver?: EngraverController;
		lines: Array<TuneLine>;
		media: Media;
		metaText: MetaText;
		metaTextInfo: MetaTextInfo;
		version: string;

		getTotalTime: NumberFunction;
		getTotalBeats: NumberFunction;
		getBarLength: NumberFunction;
		getBeatLength: NumberFunction;
		getBeatsPerMeasure: NumberFunction;
		getBpm: NumberFunction;
		getMeter: () => Meter;
		getMeterFraction: () => MeterFraction;
		getPickupLength: NumberFunction;
		getKeySignature: () => KeySignature;
		getElementFromChar: (charPos: number) => VoiceItem | null;
		millisecondsPerMeasure: (bpm?: number) => number;
		setTiming: (bpm?: number, measuresOfDelay? : number) => void;
		setUpAudio: (options: SynthOptions) => AudioTracks;
		makeVoicesArray: () => Array<Selectable[]>
		lineBreaks?: Array<number>;
		visualTranspose?: number;
	}

	export type TuneObjectArray = [TuneObject]

	export interface Selectable {
		absEl: AbsoluteElement;
		isDraggable: boolean;
		staffPos: {
			height: number;
			top: number;
			zero: number;
		}
	}

	export interface AbcElem {
		el_type: string; //TODO enumerate these
		abselem: AbsoluteElement;
		beambr?: number;
		chord?: Array<{name: string; position: ChordPlacement}>
		decoration: Array<string> //TODO enumerate these
		duration: number
		endBeam?: boolean
		endSlur?: number
		endTriplet?: true
		gracenotes?: Array<{duration: number; name:string; pitch: number; verticalPosition: number;}>
		lyric?: Array<{syllable: string; divider: ' ' | '-' | '_';}>
		noStem?: boolean
		midiPitches?: MidiPitches;
		midiGraceNotePitches?: MidiGracePitches;
		pitches?: Array<{
			pitch: number;
			name: string;
			startSlur?: Array<{label: number}>;
			endSlur?: Array<number>;
			startTie?: {};
			endTie?: boolean;
			verticalPos: number;
			highestVert: number;
		}>
		positioning?: any
		rest?: {"type": "rest"}
		startBeam?: boolean
		startTriplet?: number
		tripletMultiplier?: number
		tripletR?: number
		stemConnectsToAbove?: true
		style?: NoteHeadType
		startChar: number
		endChar: number
	}

	export interface ClickListenerDrag {
		step: number;
		max: number;
		index: number;
		setSelection: (index: number) => void;
	}

	export interface ClickListenerAnalysis {
		staffPos: number;
		name: string;
		clickedName: string;
		parentClasses: Array<string>;
		clickedClasses: Array<string>;
		voice: number;
		line: number;
		measure: number;
		selectableElement: HTMLElement;
	}

	// TimingCallbacks
	export interface LineEndInfo {
		milliseconds: number;
		top: number;
		bottom: number;
	}

	export interface LineEndDetails {
		line: number;
		endTimings: Array<LineEndInfo>;
	}

	export interface TimingEvent {
		type: "event";
		milliseconds: number;
		millisecondsPerMeasure: number;
		line: number;
		measureNumber: number;
		top: number;
		height: number;
		left: number;
		width: number;
		elements: Array< HTMLElement>;
		startCharArray: Array<number>;
		endCharArray: Array<number>;
		midiPitches: MidiPitches
	}

	export interface TimingCallbacksPosition {
		top: number;
		left: number;
		height: number
	}

	export interface TimingCallbacksDebug {
		timestamp: number;
		startTime: number;
		ev: NoteTimingEvent;
		endMs: number;
		offMs: number;
		offPx: number;
		gapMs: number;
		gapPx: number;
	}

	// Audio
	export interface SequenceInstrument {
		el_type: "instrument";
		program: number;
		pickupLength: number;
	}

	export interface SequenceChannel {
		el_type: "channel";
		channel: number;
	}

	export interface SequenceTranspose {
		el_type: "transpose";
		transpose: number;
	}

	export interface SequenceName {
		el_type: "name";
		trackName: string;
	}

	export interface SequenceDrum {
		el_type: "drum";
		pattern: string;
		on: boolean;
		bars?: number;
		intro?: number;
	}

	export interface SequenceTempo {
		el_type: "tempo";
		qpm: number;
	}

	export interface SequenceKey {
		el_type: "key";
		accidentals: Array<Accidental>;
	}

	export interface SequenceBeat {
		el_type: "beat";
		beats: [number,number,number];
	}

	export interface SequenceBeatAccents {
		el_type: "beataccents";
		value: boolean;
	}

	export interface SequenceBagpipes {
		el_type: "bagpipes";
	}

	export interface SequenceNote {
		el_type: "note";
		duration: number;
		elem: AbsoluteElement;
		pitches: {pitch: number; name: NoteLetter};
		timing: number;
	}

	export type AudioSequenceElement = SequenceInstrument | SequenceChannel | SequenceTranspose | SequenceName | SequenceDrum | SequenceTempo | SequenceKey | SequenceBeat | SequenceBeatAccents | SequenceBagpipes | SequenceNote;

	export type AudioSequenceVoice = Array<AudioSequenceElement>;

	export type AudioSequence = Array<AudioSequenceVoice>;

	export type MidiFile = any // This is a standard midi file format

	export interface MidiBufferPromise {
		cached: Array<string>;
		error: Array<string>;
		loaded: Array<string>;
	}

	export interface AudioTrack {
		cmd: AudioTrackCommand;
		[param: string]: any; // TODO - make this a union
	}

	export interface AudioTracks {
		tempo: number;
		instrument: number;
		tracks: Array<AudioTrack>;
		totalDuration: number;
	}

	// Analysis
	export interface AnalyzedTune {
		abc: string;
		id: string;
		pure: string;
		startPos: number;
		title: string;
	}

	export interface MeasureDef {
		abc: string;
		startEnding?: string;
		endEnding?: true;
	}

	export interface MeasureList {
		header: string;
		measures: Array<MeasureDef>;
		hasPickup: boolean
	}


	//
	// Callbacks
	//

	// renderAbc
	export type ClickListener = (abcElem: AbcElem, tuneNumber: number, classes: string, analysis: ClickListenerAnalysis, drag: ClickListenerDrag) => void;

	export type AfterParsing = (tune: TuneObject, tuneNumber: number, abcString: string) => TuneObject;

	// TimingCallbacks
	export type BeatCallback = (beatNumber: number, totalBeats: number, totalTime: number, position: TimingCallbacksPosition, debugInfo: TimingCallbacksDebug) => void;

	export type EventCallback = (event: TimingEvent) => void;

	export type LineEndCallback = (info : LineEndInfo, event: TimingEvent, details: LineEndDetails) => void;

	// Editor
	export type OnChange = (editor: Editor) => void;

	export type SelectionChangeCallback = (startChar: number, endChar: number) => void;

	// Audio
	export interface CursorControl {
		beatSubDivision?: number

		onReady?(): void
		onStart?(): void
		onFinished?(): void
		onBeat?(beatNumber: number, totalBeats: number, totalTime: number): void
		onEvent?(event: NoteTimingEvent): void
	}

	//
	// Visual
	//
	let signature: string;

	export function renderAbc(target: Selector, code: string, params?: AbcVisualParams): TuneObjectArray

	export function parseOnly(abc: string, params?: AbcVisualParams) : TuneObjectArray

	//
	// Animation
	//
	export class TimingCallbacks {
		constructor(visualObj: TuneObject, options?: AnimationOptions) ;
		replaceTarget(visualObj: TuneObject): void;
		start(position?: number, units?: ProgressUnit) : void;
		pause() : void;
		reset() : void;
		stop() : void;
		setProgress(position: number, units?: ProgressUnit ) : void;
		currentMillisecond(): number;

		noteTimings: Array<NoteTimingEvent>;
	}

	//
	// Editor
	//
	export class Editor {
		constructor(target: Selector, options: EditorOptions);
		paramChanged(options: AbcVisualParams): void;
		synthParamChanged(options: SynthOptions): void;
		setNotDirty(): void;
		isDirty(): boolean;
		pause(shouldPause: boolean): void;
		millisecondsPerMeasure(): number;
		pauseMidi(shouldPause: boolean): void;
	}

	//
	// Audio
	//
	export interface AudioControl {
		disable: (isDisabled: boolean) => void;
		setWarp: (tempo: number, warp: number) => void;
		setTempo: (tempo: number) => void;
		resetAll: () => void;
		pushPlay: (push: boolean) => void;
		pushLoop: (push: boolean) => void;
		setProgress: (percent: number, totalTime: number) => void;
	}

	export interface MidiBuffer {
		init(params?: MidiBufferOptions): Promise<MidiBufferPromise>
		prime(): Promise<{ status: string, duration: number}>
		start(): void
		pause(): number
		resume(): void
		seek(position: number, units?: ProgressUnit): void
		stop(): number
		download(): string // returns audio buffer in wav format as a reference to a blob
	}

	export interface SynthInitResponse {
		status: "no-audio-context" | "created";
		loadingResponse?: {
			cached: Array<string>
			error: Array<string>
			loaded: Array<string>
		}
	}

	export interface SynthObjectController {
		disable(isDisabled: boolean): void
		setTune(visualObj: TuneObject, userAction: boolean, audioParams?: SynthOptions): Promise<SynthInitResponse>
		load(selector: Selector, cursorControl?: CursorControl | null, visualOptions?: SynthVisualOptions): void
		play(): void
		pause(): void
		toggleLoop(): void
		restart(): void
		setProgress(ev: number): void
		setWarp(percent: number): Promise<void>
		download(fName: string): void
		getAudioBuffer(): AudioBuffer | undefined
	}

	export interface SynthSequenceClass {
		addTrack(): AudioTrack
		setInstrument(trackNumber: number, instrumentNumber: number): void
		appendNote(trackNumber: number, pitch: number, durationInMeasures: number, volume: number, cents: number): void
	}

	export namespace synth {
		let instrumentIndexToName: [string]
		let pitchToNoteName: [string]
		let SynthController: { new (): SynthObjectController }
		let CreateSynth: { new (): MidiBuffer }
		let SynthSequence: { new (): SynthSequenceClass }

		export function supportsAudio(): boolean
		export function registerAudioContext(ac?: AudioContext): boolean
		export function activeAudioContext(): AudioContext
		export function CreateSynthControl(element: Selector, options: AbcVisualParams): AudioControl
		export function getMidiFile(source: string | TuneObject, options?: MidiFileOptions): MidiFile;
		export function playEvent(pitches: MidiPitches, graceNotes: MidiGracePitches | undefined, milliSecondsPerMeasure: number): Promise<void>;
		export function sequence(visualObj: TuneObject, options: AbcVisualParams): AudioSequence
	}

	//
	// Analysis
	//
	export class TuneBook {
		constructor(tunebookString: string) ;
		getTuneById(id: string | number): AnalyzedTune;
		getTuneByTitle(id: string): AnalyzedTune;

		header: string;
		tunes: Array<AnalyzedTune>;
	}

	export function numberOfTunes(abc: string) : number;
	export function extractMeasures(abc: string) : Array<MeasureList>;
	
	export function strTranspose(originalAbc: string, visualObj: TuneObject, steps: number): string;

	//
	// Glyph
	//
	export function setGlyph(glyphName: string, glyph: GlyphDef) : void;
}
