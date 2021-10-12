declare module 'abcjs' {
	//
	// Enumerations
	//

	export type Clef = 'treble' | 'tenor' | 'bass' | 'alto' | 'treble+8' | 'tenor+8' | 'bass+8' | 'alto+8' | 'treble-8' | 'tenor-8' | 'bass-8' | 'alto-8' | 'none' | 'perc';

	export type MeterType = 'common_time' | 'cut_time' | 'specified' | 'tempus_perfectum' | 'tempus_imperfectum' | 'tempus_perfectum_prolatio' | 'tempus_imperfectum_prolatio';

	export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

	export type AccidentalName = 'flat' | 'natural' | 'sharp' | 'dblsharp' | 'dblflat' | 'quarterflat' | 'quartersharp';

	export type KeyRoot = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'HP' | 'Hp' | 'none';

	export type KeyAccidentalName = '' | '#' | 'b';

	export type Mode = '' | 'm' | 'Dor' | 'Mix' | 'Loc' | 'Phr' | 'Lyd';

	export type Placement = 'above' | 'below';

	export type BracePosition = "start" | "continue" | "end";

	export type Alignment = 'left' | 'center' |'right';

	export type Media = 'screen' | 'print';

	export type ProgressUnit = "seconds" | "beats" | "percent";

	export type NoteTimingEventType = "end" | "event";

	export type MidiOutputType = 'encoded' | 'binary' | 'link';

	export type Responsive = 'resize';
	//
	// Basic types
	//
	export type Selector = String | HTMLElement

	type NumberFunction = () => number;

	export interface MeterFraction {
		num: string;
		den?: string;
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

	export interface CharRange {
		startChar: number;
		endChar: number;
	}

	export type MidiParam = Array<string|number>;

	export type MidiGracePitches = Array<{instrument: string; pitch: number; volume: number; cents?: number}>;

	export interface MidiPitch {
		instrument: string;
		pitch: number;
		duration: number;
		volume: number;
		cents?: number
	}

	export type MidiPitches = Array<MidiPitch>;

	export type AbsoluteElement = any; // TODO

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

	export interface AbcVisualParams { // CHECK
		add_classes?: boolean;
		afterParsing?: AfterParsing;
		clickListener?: ClickListener;
		dragColor?: string;
		dragging?: any; // TODO
		foregroundColor?: string;
		format?: { any: any }; // TODO
		lineBreaks?: Array<number>;
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
		selectTypes?: Array<string>;
		showDebug?: Array<"grid" | "box">;
		staffwidth?: number;
		startingTune?: number;
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
		synthControl?: SynthObjectController; // STUDY
		el: Selector;
		cursorControl: CursorControl; // STUDY
		options: SynthOptions; // STUDY
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
		onEnded?: () => void;
		pan?: Array<number>;
		voicesOff?: boolean | Array<number>;
		drum?: string;
		drumIntro?: number;
}

	export interface SynthVisualOptions {
		displayLoop: boolean | false
		displayRestart: boolean | false
		displayPlay: boolean | false
		displayProgress: boolean | false
		displayWarp: boolean | false
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

		elements?: Array<HTMLElement>;
		endChar?: number;
		endCharArray?: Array<number>;
		endX?: number;
		height?: number;
		left?: number;
		line?: number;
		measureNumber?: number;
		midiPitches?: MidiPitches;
		startChar?: number;
		startCharArray?: Array<number>;
		top?: number;
		width?: number;
		measureStart?: boolean;
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
			drum: MidiParam;
			drumbars?: MidiParam;
			drummap: MidiParam;
			drumoff?: MidiParam;
			drumon?: MidiParam;
			expand?: MidiParam;
			fermatafixed?: MidiParam;
			fermataproportional?: MidiParam;
			gchord: MidiParam;
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
		percmap?: any; // TODO
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
		tempofont: Font;
		textfont: Font;
		titlefont: Font;
		tripletfont: Font;
		vocalfont: Font;
		voicefont: Font;
		wordsfont: Font;
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
		// TODO
	}

	export interface VoiceItemBar {
		el_type: "bar";
		// TODO
	}

	export interface VoiceItemGap {
		el_type: "gap";
		// TODO
	}

	export interface VoiceItemKey {
		el_type: "key";
		// TODO
	}

	export interface VoiceItemMeter {
		el_type: "meter";
		// TODO
	}

	export interface VoiceItemMidi {
		el_type: "midi";
		// TODO
	}

	export interface VoiceItemOverlay {
		el_type: "overlay";
		// TODO
	}

	export interface VoiceItemPart {
		el_type: "part";
		// TODO
	}

	export interface VoiceItemScale {
		el_type: "scale";
		// TODO
	}

	export interface VoiceItemStem {
		el_type: "stem";
		// TODO
	}

	export interface VoiceItemStyle {
		el_type: "style";
		// TODO
	}

	export interface VoiceItemTempo {
		el_type: "tempo";
		// TODO
	}

	export interface VoiceItemTranspose {
		el_type: "transpose";
		// TODO
	}

	export interface VoiceItemNote {
		el_type: "note";
		// TODO
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
		getElementFromChar: (charPos: number) => any;  // TODO
		millisecondsPerMeasure: NumberFunction;
		setTiming: (bpm?: number, measuresOfDelay? : number) => void;
		setUpAudio: (options: any) => any;  // TODO
		lineBreaks?: Array<number>;
		visualTranspose?: number;
	}

	export type TuneObjectArray = [TuneObject]

	export type AbcElem = any // TODO

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
		elements: Array< any>; // TODO
		startCharArray: Array<number>;
		endCharArray: Array<number>;
		midiPitches: MidiPitches
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
		beats: any; // TODO
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
		cached: [any] // TODO
		error: [any] // TODO
		loaded: [any] // TODO
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
	export type ClickListener = (abcElem: AbcElem, tuneNumber: number, classes: any, analysis: any, drag: any) => void; // TODO

	export type AfterParsing = (tune: TuneObject, tuneNumber: number, abcString: string) => TuneObject;

	// TimingCallbacks
	export type BeatCallback = (beatNumber: any, totalBeats: any, totalTime: any, position: any, debugInfo: any) => void; // TODO

	export type EventCallback = (event: TimingEvent) => void;

	export type LineEndCallback = (info : LineEndInfo, event: TimingEvent, details: LineEndDetails) => void;

	// Editor
	export type OnChange = (editor: Editor) => void;

	export type SelectionChangeCallback = (startChar: number, endChar: number) => void;

	// Audio
	export interface CursorControl {
		beatSubDivision?: number

		onStart?(): void
		onFinished?(): void
		onBeat?(beatNumber: number, totalBeats?: number, totalTime?: number): void
		onEvent?(event: any): void // TODO
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
	export type AudioControl = any // TODO

	export interface MidiBuffer {
		init(params?: MidiBufferOptions): Promise<MidiBufferPromise>
		prime(): Promise<void>
		start(): void
		pause(): void
		resume(): void
		seek(position: number, units: ProgressUnit): void
		stop(): void
		download(): any // returns audio buffer in wav format
	}

	export interface SynthObjectController { // TODO
		disable(isDisabled: boolean): void
		setTune(visualObj: TuneObject, userAction: Boolean, audioParams?: AbcVisualParams): Promise<any> // TODO
		load(selector: string, cursorControl?: any, visualOptions?: SynthVisualOptions): void // TODO
		play(): void
		pause(): void
		toggleLoop(): void
		restart(): void
		setProgress(ev: number): void
		setWarp(percent: number): void
		download(fName: string): void
	}

	export interface SynthSequenceClass {
		// TODO
	}

	export namespace synth {
		let instrumentIndexToName: [string]
		let pitchToNoteName: [string]
		let SynthController: { new (): SynthObjectController }
		let CreateSynth: { new (): MidiBuffer }
		let SynthSequence: { new (): SynthSequenceClass }

		export function supportsAudio(): boolean
		export function registerAudioContext(AudioContext): boolean
		export function activeAudioContext(): AudioContext
		export function CreateSynthControl(element: Selector, options: AbcVisualParams): AudioControl // TODO
		export function getMidiFile(source: String | TuneObject, options?: MidiFileOptions): MidiFile;
		export function playEvent(pitches: MidiPitches, graceNotes: MidiGracePitches, milliSecondsPerMeasure: number): Promise<void>;
		export function activeAudioContext(): AudioContext
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

	//
	// Glyph
	//
	export function setGlyph(glyphName: string, glyph: GlyphDef) : void;
}
