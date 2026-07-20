//    abc_relative_element.js: Definition of the RelativeElement class.

import type * as types from "abcjs";

export default class RelativeElement implements types.RelativeElement {
	x: number;
	c: string;
	dx: number;
	w: number;
	pitch: number;
	pitch2?: number;
	scalex: number;
	scaley: number;
	type: string;
	name: string;
	linewidth?: number;
	klass?: string;
	anchor?: "start" | "middle" | "end";
	top: number;
	bottom: number;
	dim?: number;
	position?: types.Placement;
	realWidth?: number;
	partHeightAbove?: number;
	chordHeightAbove?: number;
	chordHeightBelow?: number;
	lyricHeightAbove?: number;
	lyricHeightBelow?: number;
	parent: types.AbsoluteElement;
	chordPos?: number;
	voiceNumber?: number;
	height: number;
	centerVertically: boolean;

	private lane: number | undefined;

	constructor(
		c: string,
		dx: number,
		w: number,
		pitch: number,
		opt?: {
			scalex?: number;
			scaley?: number;
			type?: string;
			pitch2?: number;
			linewidth?: number;
			klass?: string;
			chordPos?: number;
			anchor?: "start" | "middle" | "end";
			thickness?: number;
			stemHeight?: number;
			dim?: number;
			position?: types.Placement;
			voiceNumber?: number;
			height?: number;
			top?: number;
			bottom?: number;
			name?: string;
			realWidth?: number;
		},
	) {
		opt = opt || {};
		this.x = 0;
		this.c = c; // character or path or string
		this.dx = dx; // relative x position
		this.w = w; // minimum width taken up by this element (can include gratuitous space)
		this.pitch = pitch; // relative y position by pitch
		this.scalex = opt.scalex || 1; // should the character/path be scaled?
		this.scaley = opt.scaley || 1; // should the character/path be scaled?
		this.type = opt.type || "symbol"; // cheap types.
		this.pitch2 = opt.pitch2;
		this.linewidth = opt.linewidth;
		this.klass = opt.klass;
		this.chordPos = opt.chordPos;
		this.anchor = opt.anchor ? opt.anchor : "middle";
		this.top = pitch;
		if (this.pitch2 !== undefined && this.pitch2 > this.top)
			this.top = this.pitch2;
		this.bottom = pitch;
		if (this.pitch2 !== undefined && this.pitch2 < this.bottom)
			this.bottom = this.pitch2;
		if (opt.thickness) {
			this.top += opt.thickness / 2;
			this.bottom -= opt.thickness / 2;
		}
		if (opt.stemHeight) {
			if (opt.stemHeight > 0) this.top += opt.stemHeight;
			else this.bottom += opt.stemHeight;
		}
		if (opt.dim) this.dim = opt.dim;
		if (opt.position) this.position = opt.position;
		if (opt.voiceNumber !== undefined) this.voiceNumber = opt.voiceNumber;
		this.height = opt.height ? opt.height : 4; // The +1 is to give a little bit of padding.
		if (opt.top) this.top = opt.top;
		if (opt.bottom) this.bottom = opt.bottom;
		if (opt.name) this.name = opt.name;
		else if (this.c) this.name = this.c;
		else this.name = this.type;
		if (opt.realWidth) this.realWidth = opt.realWidth;
		else this.realWidth = this.w;
		this.centerVertically = false;
		switch (this.type) {
			case "debug":
				this.chordHeightAbove = this.height;
				break;
			case "lyric":
				if (opt.position && opt.position === "below")
					this.lyricHeightBelow = this.height;
				else this.lyricHeightAbove = this.height;
				break;
			case "chord":
				if (opt.position && opt.position === "below")
					this.chordHeightBelow = this.height;
				else this.chordHeightAbove = this.height;
				break;
			case "text":
				if (this.pitch === undefined) {
					if (opt.position && opt.position === "below")
						this.chordHeightBelow = this.height;
					else this.chordHeightAbove = this.height;
				} else this.centerVertically = true;
				break;
			case "part":
				this.partHeightAbove = this.height;
				break;
		}
	}

	getChordDim() {
		if (this.type === "debug") return null;
		if (!this.chordHeightAbove && !this.chordHeightBelow) return null;
		// Chords are centered, annotations are left justified.
		// NOTE: the font reports extra space to the left and right anyway, so there is a built in margin.
		// We add a little margin so that items can't touch - we use half the font size as the margin, so that is 1/4 on each side.
		// if there is only one character that we're printing, use half of that margin.
		// var margin = this.dim.font.size/4;
		// if (this.c.length === 1)
		// 	margin = margin / 2;
		const margin = 0;

		const offset = this.type === "chord" ? this.realWidth / 2 : 0;
		const left = this.x - offset - margin;
		const right = left + this.realWidth + margin;
		return { left: left, right: right };
	}

	invertLane(total: number) {
		if (this.lane === undefined) this.lane = 0;
		this.lane = total - this.lane - 1;
	}

	putChordInLane(i: number) {
		this.lane = i;
		// Add some extra space to account for the character's descenders.
		if (this.chordHeightAbove)
			this.chordHeightAbove = this.height * 1.25 * this.lane;
		else this.chordHeightBelow = this.height * 1.25 * this.lane;
	}

	getLane() {
		if (this.lane === undefined) return 0;
		return this.lane;
	}

	setX(x: number) {
		this.x = x + this.dx;
	}
}
