declare module 'abcjs' {
	//
	// Global syntactic sugar types
	//
	export type TuneObjectArray = [Object]
	export type AudioContext = any
	export type AudioControl = any
	export type AudioSequence = any

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
		onBeat?(beatNumber: number): void
		onEvent?(event: any): void
	}

	export interface MidiBuffer {
		init(params: AudioContext): Promise<AudioContextPromise>
		prime(): Promise<void>
		start(): void
		pause(): void
		resume(): void
		download(): any // returns audio buffer in wav format
	}

	//
	// Synth widget controller
	//
	export interface SynthObjectController {
		disable(isDisabled: boolean): void
		setTune(visualObj: TuneObjectArray, userAction: Boolean, audioParams: AbcParams): void
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

	export function renderAbc(target: string | HTMLElement, code: string, params: AbcParams): TuneObjectArray

	//
	// Basic Audio Stuff
	//

	export namespace synth {
		let instrumentIndexToName: [string]
		let pitchToNoteName: [string]
		let SynthController: { new (): SynthObjectController }

		export function supportsAudio(): boolean
		export function CreateSynth(): MidiBuffer
		export function CreateSynthControl(element: string, options: AbcParams): AudioControl
		export function getMidiFile(abcString: string, options: AbcParams): void
		export function synthSequence(): AudioSequence
		export function playEvent(pitches: Pitches, graceNotes: Pitches, milliSecondsPerMesure: number): Promise<any>
		export function activeAudioContext(): AudioContext

		// export function  SynthController =  (() => SynthObjectController) ;
	}
}
