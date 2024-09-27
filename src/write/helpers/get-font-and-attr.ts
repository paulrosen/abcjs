//TODO-PER: collect the types
//import {Classes} from "./classes";
interface Classes {
	generate: (str:string) => string
}


interface FO {
	gchordfont: Font;
	tripletfont: Font;
	annotationfont: Font;
	fontOverrides: Font;
	vocalfont: Font;
	fontboxpadding?: number;
}
interface Font {
	face: string;
	size: number;
	weight: 'normal' | 'bold';
	style: 'normal' | 'italic';
	decoration: 'none' | 'underline';
	box?: boolean;
	padding?:number;
}


export class GetFontAndAttr {
	formatting: FO;
	classes: Classes;

	constructor(formatting : FO, classes: Classes) {
		this.formatting = formatting;
		this.classes = classes;
	}

	updateFonts(fontOverrides : FO) {
		if (fontOverrides.gchordfont)
			this.formatting.gchordfont = fontOverrides.gchordfont;
		if (fontOverrides.tripletfont)
			this.formatting.tripletfont = fontOverrides.tripletfont;
		if (fontOverrides.annotationfont)
			this.formatting.annotationfont = fontOverrides.annotationfont;
		if (fontOverrides.vocalfont)
			this.formatting.vocalfont = fontOverrides.vocalfont;
	}

	getFamily(type:string) {
		if (type[0] === '"' && type[type.length - 1] === '"') {
			return type.substring(1, type.length - 1)
		}
		return type
	}

	calc(type:string|Font, klass:string) {
		let font:Font;
		if (typeof type === 'string') {
			//@ts-ignore - temp
			font = this.formatting[type];
			// Raphael deliberately changes the font units to pixels for some reason, so we need to change points to pixels here.
			if (font)
				font = {face: font.face, size: Math.round(font.size * 4 / 3), decoration: font.decoration, style: font.style, weight: font.weight, box: font.box};
			else
				font = {face: "Arial", size: Math.round(12 * 4 / 3), decoration: "underline", style: "normal", weight: "normal"};
		} else
			font = {face: type.face, size: Math.round(type.size * 4 / 3), decoration: type.decoration, style: type.style, weight: type.weight, box: type.box};
		const paddingPercent = this.formatting.fontboxpadding ? this.formatting.fontboxpadding : 0.1
		font.padding = font.size * paddingPercent;

		const attr = {
			"font-size": font.size, 'font-style': font.style,
			"font-family": this.getFamily(font.face), 'font-weight': font.weight, 'text-decoration': font.decoration,
			'class': this.classes.generate(klass)
		};
		return {font: font, attr: attr};
	}
}
