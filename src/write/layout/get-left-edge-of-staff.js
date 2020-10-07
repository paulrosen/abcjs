function getLeftEdgeOfStaff(renderer, getTextSize, voices, brace, bracket) {
	var x = renderer.padding.left;

	// find out how much space will be taken up by voice headers
	var voiceheaderw = 0;
	var i;
	var size;
	for (i=0;i<voices.length;i++) {
		if(voices[i].header) {
			size = getTextSize.calc(voices[i].header, 'voicefont', '');
			voiceheaderw = Math.max(voiceheaderw,size.width);
		}
	}
	if (brace) {
		for (i = 0; i < brace.length; i++) {
			if (brace[i].header) {
				size = getTextSize.calc(brace[i].header, 'voicefont', '');
				voiceheaderw = Math.max(voiceheaderw,size.width);
			}
		}
	}
	if (bracket) {
		for (i = 0; i < bracket.length; i++) {
			if (bracket[i].header) {
				size = getTextSize.calc(bracket[i].header, 'voicefont', '');
				voiceheaderw = Math.max(voiceheaderw,size.width);
			}
		}
	}
	if (voiceheaderw) {
		// Give enough spacing to the right - we use the width of an A for the amount of spacing.
		var sizeW = getTextSize.calc("A", 'voicefont', '');
		voiceheaderw += sizeW.width;
	}
	x += voiceheaderw;

	var ofs = 0;
	ofs = setBraceLocation(brace, x, ofs);
	ofs = setBraceLocation(bracket, x, ofs);
	return x + ofs;
}

function setBraceLocation(brace, x, ofs) {
	if (brace) {
		for (var i = 0; i < brace.length; i++) {
			setLocation(x, brace[i]);
			ofs = Math.max(ofs, brace[i].getWidth());
		}
	}
	return ofs;
}

function setLocation(x, element) {
	element.x = x;
}

module.exports = getLeftEdgeOfStaff;
