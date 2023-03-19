var setClass = function (elemset, addClass, removeClass, color) {
	if (!elemset)
		return;
	for (var i = 0; i < elemset.length; i++) {
		var el = elemset[i];
		var attr = el.getAttribute("highlight");
		if (!attr) attr = "fill";
		el.setAttribute(attr, color);
		var kls = el.getAttribute("class");
		if (!kls) kls = "";
		kls = kls.replace(removeClass, "");
		kls = kls.replace(addClass, "");
		if (addClass.length > 0) {
			if (kls.length > 0 && kls[kls.length - 1] !== ' ') kls += " ";
			kls += addClass;
		}
		el.setAttribute("class", kls);
	}
};

module.exports = setClass;
