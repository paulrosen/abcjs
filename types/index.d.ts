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

	// TODO : to be detailed and enhanced later
	export type Pitches = [any]

	export type AbcParams = any
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
		setTune(visualObj: TuneObject, userAction: Boolean, audioParams?: AbcParams): Promise<any>
		load(selector: string, cursorControl?: any, visualOptions?: AbcParams): void
		play(): void
		pause(): void
		toggleLoop(): void
		restart(): void
		setProgress(ev: number): void
		setWarp(percent: number): void
		download(fName: string): void
	}

	//
	// Basic Visual  stuff
	//
	let signature: string

	export function renderAbc(target: Selector, code: string, params?: AbcParams): TuneObjectArray

	//
	// Basic Audio Stuff
	//
	export namespace synth {
		let instrumentIndexToName: [string]
		let pitchToNoteName: [string]
		let SynthController: { new (): SynthObjectController }
		let CreateSynth: { new (): MidiBuffer }

		export function supportsAudio(): boolean
		export function CreateSynthControl(element: Selector, options: AbcParams): AudioControl
		export function getMidiFile(source: String | TuneObject, options?: AbcParams): MidiFile
		export function synthSequence(): AudioSequence
		export function playEvent(pitches: Pitches, graceNotes: Pitches, milliSecondsPerMeasure: number): Promise<any>
		export function activeAudioContext(): AudioContext
	}
}
