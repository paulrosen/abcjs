import {GetFontAndAttr} from "./get-font-and-attr";
import {Svg} from "../svg";

//TODO-PER: types
export interface TextAttr {
	"font-size": number;
	"font-style": string;
	"font-family": string;
	"font-weight": string;
	"text-decoration": string;
	"class": string;
}
interface HASH {
	font: {
		face: string;
		size: number;
		decoration: string;
		style: string;
		weight: string;
		padding:number;
		box?:boolean;
	};
	attr: TextAttr;

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

export class GetTextSize {
	getFontAndAttr: GetFontAndAttr;
	svg: Svg;

	constructor(getFontAndAttr: GetFontAndAttr, svg: Svg) {
		this.getFontAndAttr = getFontAndAttr;
		this.svg = svg;
	}

	updateFonts(fontOverrides:FO) {
		this.getFontAndAttr.updateFonts(fontOverrides);
	}

	attr(type:string, klass:string) {
		return this.getFontAndAttr.calc(type, klass);
	}

	getFamily(type:string) {
		if (type[0] === '"' && type[type.length - 1] === '"') {
			return type.substring(1, type.length - 1)
		}
		return type
	}

	calc(text:string, type:string|Font, klass:string, el?:SVGElement) {
		let hash;
		// This can be passed in either a string or a font. If it is a string it names one of the standard fonts.
		if (typeof type === 'string')
			hash = this.attr(type, klass);
		else {
			hash = {
				font: {
					face: type.face,
					size: type.size,
					decoration: type.decoration,
					style: type.style,
					weight: type.weight
				},
				attr: {
					"font-size": type.size,
					"font-style": type.style,
					"font-family": this.getFamily(type.face),
					"font-weight": type.weight,
					"text-decoration": type.decoration,
					"class": this.getFontAndAttr.classes.generate(klass)
				}
			}
		}
		const size = this.svg.getTextSize(text, hash.attr, el);
		if (hash.font.box) {
			const padding = hash.font.padding ? hash.font.padding : 0;
			// Add padding and an equal margin to each side.
			return {height: size.height + padding * 4, width: size.width + padding * 4}
		}
		return size;
	}

	baselineToCenter(text:string, type:string, klass:string, index:number, total:number) {
		// This is for the case where SVG wants to use the baseline of the first line as the Y coordinate.
		// If there are multiple lines of text or there is an array of text then that will not be centered so this adjusts it.
		const height = this.calc(text, type, klass).height;
		const fontHeight = this.attr(type, klass).font.size;

		return height * 0.5 + (total - index - 2) * fontHeight;
	}
}
