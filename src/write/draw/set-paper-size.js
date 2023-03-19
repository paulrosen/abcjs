function setPaperSize(renderer, maxwidth, scale, responsive) {
	var w = (maxwidth + renderer.padding.right) * scale;
	var h = (renderer.y + renderer.padding.bottom) * scale;
	if (renderer.isPrint)
		h = Math.max(h, 1056); // 11in x 72pt/in x 1.33px/pt
	// TODO-PER: We are letting the page get as long as it needs now, but eventually that should go to a second page.

	// for accessibility
	if (renderer.ariaLabel !== '') {
		var text = "Sheet Music";
		if (renderer.abctune && renderer.abctune.metaText && renderer.abctune.metaText.title)
			text += " for \"" + renderer.abctune.metaText.title + '"';
		renderer.paper.setTitle(text);
		var label = renderer.ariaLabel ? renderer.ariaLabel : text;
		renderer.paper.setAttribute("aria-label", label);
	}

	// for dragging - don't select during drag
	var styles = [
		"-webkit-touch-callout: none;",
		"-webkit-user-select: none;",
		"-khtml-user-select: none;",
		"-moz-user-select: none;",
		"-ms-user-select: none;",
		"user-select: none;"
	];
	renderer.paper.insertStyles(".abcjs-dragging-in-progress text, .abcjs-dragging-in-progress tspan {" + styles.join(" ") + "}");

	var parentStyles = { overflow: "hidden" };
	if (responsive === 'resize') {
		renderer.paper.setResponsiveWidth(w, h);
	} else {
		parentStyles.width = "";
		parentStyles.height = h + "px";
		if (scale < 1) {
			parentStyles.width = w + "px";
			renderer.paper.setSize(w / scale, h / scale);
		} else
			renderer.paper.setSize(w, h);
	}
	renderer.paper.setScale(scale);
	renderer.paper.setParentStyles(parentStyles);
}

module.exports = setPaperSize;
