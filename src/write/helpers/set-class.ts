export function setClass(elemSet: Array<SVGElement>, addClass: string, removeClass: string, color:string) {
	if (!elemSet)
		return;
	for (let i = 0; i < elemSet.length; i++) {
		const el = elemSet[i];
		let attr = el.getAttribute("highlight");
		if (!attr) attr = "fill";
		el.setAttribute(attr, color);
		let kls = el.getAttribute("class");
		if (!kls) kls = "";
		kls = kls.replace(removeClass, "");
		kls = kls.replace(addClass, "");
		if (addClass.length > 0) {
			if (kls.length > 0 && kls[kls.length - 1] !== ' ') kls += " ";
			kls += addClass;
		}
		el.setAttribute("class", kls);
	}
}
