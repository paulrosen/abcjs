declare module 'abcjs' {
	//
	// Global syntactic sugar types
	//
	export type TuneObject = any
	export type TuneObjectArray = [TuneObject]
	export type AudioContext = any
	export type AudioControl = any
	export type AudioSequence = any
	export type Selector = String | HTMLElement
	export type MidiFile = any
	export type AbcElem = any

	// TODO : to be detailed and enhanced later
	export type Pitches = [any]

	export type ClickListener = (abcElem: AbcElem, tuneNumber: number, classes: any, analysis: any, drag: any) => void;

	export type AfterParsing = (tune: TuneObject, tuneNumber: number, abcString: string) => TuneObject;

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
		clickListener?: ClickListener;
		dragColor?: string;
		dragging?: any;
		foregroundColor?: string;
		format?: { any };
		lineBreaks?: Array<number>;
		minPadding?: number;
		oneSvgPerLine?: boolean;
		paddingbottom?: number;
		paddingleft?: number;
		paddingright?: number;
		paddingtop?: number;
		print?: boolean;
		responsive?: "resize";
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

	export interface AudioContextPromise {
		cached: [any]
		error: [any]
		loaded: [any]
	}

	export interface CursorControl {
		beatSubDivision?: number

		onStart?(): void
		onFinished?(): void
		onBeat?(beatNumber: number, totalBeats?: number, totalTime?: number): void
		onEvent?(event: any): void
	}

	export interface MidiBuffer {
		init?(params: AudioContext): Promise<AudioContextPromise>
		prime?(): Promise<void>
		start?(): void
		pause?(): void
		resume?(): void
		download?(): any // returns audio buffer in wav format
	}

	//
	// Synth widget controller
	//
	export interface SynthObjectController {
		disable(isDisabled: boolean): void
		setTune(visualObj: TuneObject, userAction: Boolean, audioParams?: AbcVisualParams): Promise<any>
		load(selector: string, cursorControl?: any, visualOptions?: AbcVisualParams): void
		play(): void
		pause(): void
		toggleLoop(): void
		restart(): void
		setProgress(ev: number): void
		setWarp(percent: number): void
		download(fName: string): void
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
		elements: Array< any>;
		startCharArray: Array<number>;
		endCharArray: Array<number>;
		midiPitches: Array<{
				pitch: number;
				durationInMeasures: number;
				volume: number;
				instrument: number;
		}>
	}
	export type BeatCallback = (beatNumber, totalBeats, totalTime, position, debugInfo) => void;
	export type EventCallback = (event: TimingEvent) => void;
	export interface LineEndInfo {
		milliseconds: number;
		top: number;
		bottom: number;
	}
	export interface LineEndDetails {
		line: number;
		endTimings: Array<LineEndInfo>;
	}
	export type LineEndCallback = (info : LineEndInfo, event: TimingEvent, details: LineEndDetails) => void;

	export interface AnimationOptions {
		qpm?: number;
		extraMeasuresAtBeginning?: number;
		lineEndAnticipation?: number;
		beatSubdivisions?: number;
		beatCallback?: BeatCallback;
		eventCallback?: EventCallback;
		lineEndCallback?: LineEndCallback;
	}
	export class TimingCallbacks {
		constructor(visualObj: TuneObject, options?: AnimationOptions) ;
		replaceTarget(visualObj: TuneObject): void;
		start(offsetPercent?: number) : void;
		pause() : void;
		reset() : void;
		stop() : void;
		setProgress(position: number, units?: "seconds" | "beats" | "percent" ) : void;
	}

	//
	// Editor
	//
	export type OnChange = (editor: Editor) => void;
	export type SelectionChangeCallback = (startChar: number, endChar: number) => void;
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
	export interface SynthOptions {

	}

	export namespace synth {
		let instrumentIndexToName: [string]
		let pitchToNoteName: [string]
		let SynthController: { new (): SynthObjectController }
		let CreateSynth: { new (): MidiBuffer }

		export function supportsAudio(): boolean
		export function CreateSynthControl(element: Selector, options: AbcVisualParams): AudioControl
		export function getMidiFile(source: String | TuneObject, options?: AbcVisualParams): MidiFile
		export function synthSequence(): AudioSequence
		export function playEvent(pitches: Pitches, graceNotes: Pitches, milliSecondsPerMeasure: number): Promise<any>
		export function activeAudioContext(): AudioContext
	}

	//
	// Analysis
	//
	export interface AnalyzedTune {
		abc: string;
		id: string;
		pure: string;
		startPos: number;
		title: string;
	}
	export class TuneBook {
		constructor(tunebookString: string) ;
		getTuneById(id: string | number): AnalyzedTune;
		getTuneByTitle(id: string): AnalyzedTune;

		tunes: Array<AnalyzedTune>;
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

	export function extractMeasures(abc: string) : MeasureList;
}
