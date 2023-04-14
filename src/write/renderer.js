//    abc_renderer.js: API to render to SVG/Raphael/whatever rendering engine

/*global Math */

var spacing = require('./helpers/spacing');
var Svg = require('./svg');

/**
 * Implements the API for rendering ABCJS Abstract Rendering Structure to a canvas/paper (e.g. SVG, Raphael, etc)
 * @param {Object} paper
 */
var Renderer = function (paper) {
	this.paper = new Svg(paper);
	this.controller = null;

	this.space = 3 * spacing.SPACE;
	this.padding = {}; // renderer's padding is managed by the controller
	this.reset();
	this.firefox112 = navigator.userAgent.indexOf('Firefox/112.0') >= 0
};

Renderer.prototype.reset = function () {

	this.paper.clear();
	this.y = 0;
	this.abctune = null;
	this.path = null;
	this.isPrint = false;
	this.lineThickness = 0;
	this.initVerticalSpace();
};

Renderer.prototype.newTune = function (abcTune) {
	this.abctune = abcTune; // TODO-PER: this is just to get the font info.
	this.setVerticalSpace(abcTune.formatting);
	//this.measureNumber = null;
	//this.noteNumber = null;
	this.isPrint = abcTune.media === 'print';
	this.setPadding(abcTune);
};

Renderer.prototype.setLineThickness = function (lineThickness) {
	this.lineThickness = lineThickness
};

Renderer.prototype.setPaddingOverride = function (params) {
	this.paddingOverride = {
		top: params.paddingtop, bottom: params.paddingbottom,
		right: params.paddingright, left: params.paddingleft
	};
};

Renderer.prototype.setPadding = function (abctune) {
	// If the padding is set in the tune, then use that.
	// Otherwise, if the padding is set in the override, use that.
	// Otherwise, use the defaults (there are a different set of defaults for screen and print.)
	function setPaddingVariable(self, paddingKey, formattingKey, printDefault, screenDefault) {
		if (abctune.formatting[formattingKey] !== undefined)
			self.padding[paddingKey] = abctune.formatting[formattingKey];
		else if (self.paddingOverride[paddingKey] !== undefined)
			self.padding[paddingKey] = self.paddingOverride[paddingKey];
		else if (self.isPrint)
			self.padding[paddingKey] = printDefault;
		else
			self.padding[paddingKey] = screenDefault;
	}
	// 1cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 38px
	// 1.8cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 68px
	setPaddingVariable(this, 'top', 'topmargin', 38, 15);
	setPaddingVariable(this, 'bottom', 'botmargin', 38, 15);
	setPaddingVariable(this, 'left', 'leftmargin', 68, 15);
	setPaddingVariable(this, 'right', 'rightmargin', 68, 15);
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 * @param {float} scale
 */
Renderer.prototype.adjustNonScaledItems = function (scale) {
	this.padding.top /= scale;
	this.padding.bottom /= scale;
	this.padding.left /= scale;
	this.padding.right /= scale;
	this.abctune.formatting.headerfont.size /= scale;
	this.abctune.formatting.footerfont.size /= scale;
};

/**
 * Set the the values for all the configurable vertical space options.
 */
Renderer.prototype.initVerticalSpace = function () {
	// conversion: 37.7953 = conversion factor for cm to px.
	// All of the following values are in px.
	this.spacing = {
		composer: 7.56, // Set the vertical space above the composer.
		graceBefore: 8.67, // Define the space before, inside and after the grace notes.
		graceInside: 10.67,
		graceAfter: 16,
		info: 0, // Set the vertical space above the infoline.
		lineSkipFactor: 1.1, // Set the factor for spacing between lines of text. (multiply this by the font size)
		music: 7.56, // Set the vertical space above the first staff.
		paragraphSkipFactor: 0.4, // Set the factor for spacing between text paragraphs. (multiply this by the font size)
		parts: 11.33, // Set the vertical space above a new part.
		slurHeight: 1.0, // Set the slur height factor.
		staffSeparation: 61.33, // Do not put a staff system closer than <unit> from the previous system.
		stemHeight: 26.67 + 10, // Set the stem height.
		subtitle: 3.78, // Set the vertical space above the subtitle.
		systemStaffSeparation: 48, // Do not place the staves closer than <unit> inside a system. * This values applies to all staves when in the tune header. Otherwise, it applies to the next staff
		text: 18.9, // Set the vertical space above the history.
		title: 7.56, // Set the vertical space above the title.
		top: 30.24, //Set the vertical space above the tunes and on the top of the continuation pages.
		vocal: 0, // Set the vertical space above the lyrics under the staves.
		words: 0 // Set the vertical space above the lyrics at the end of the tune.
	};
	/*
	TODO-PER: Handle the x-coordinate spacing items, too.
maxshrink <float>Default: 0.65
Set how much to compress horizontally when music line breaks
are automatic.
<float> must be between 0 (natural spacing)
and 1 (max shrinking).

// This next value is used to compute the natural spacing of
// the notes. The base spacing of the crotchet is always
// 40 pts. When the duration of a note type is twice the
// duration of an other note type, its spacing is multiplied
// by this factor.
// The default value causes the note spacing to be multiplied
// by 2 when its duration is multiplied by 4, i.e. the
// space of the semibreve is 80 pts and the space of the
// semiquaver is 20 pts.
// Setting this value to 1 sets all note spacing to 40 pts.
noteSpacingFactor: 1.414, // Set the note spacing factor to <float> (range 1..2).

scale <float> Default: 0.75 Set the page scale factor. Note that the header and footer are not scaled.

stretchlast <float>Default: 0.8
Stretch the last music line of a tune when it exceeds
the <float> fraction of the page width.
<float> range is 0.0 to 1.0.
	 */
};

Renderer.prototype.setVerticalSpace = function (formatting) {
	// conversion from pts to px 4/3
	if (formatting.staffsep !== undefined)
		this.spacing.staffSeparation = formatting.staffsep * 4 / 3;
	if (formatting.composerspace !== undefined)
		this.spacing.composer = formatting.composerspace * 4 / 3;
	if (formatting.partsspace !== undefined)
		this.spacing.parts = formatting.partsspace * 4 / 3;
	if (formatting.textspace !== undefined)
		this.spacing.text = formatting.textspace * 4 / 3;
	if (formatting.musicspace !== undefined)
		this.spacing.music = formatting.musicspace * 4 / 3;
	if (formatting.titlespace !== undefined)
		this.spacing.title = formatting.titlespace * 4 / 3;
	if (formatting.sysstaffsep !== undefined)
		this.spacing.systemStaffSeparation = formatting.sysstaffsep * 4 / 3;
	if (formatting.subtitlespace !== undefined)
		this.spacing.subtitle = formatting.subtitlespace * 4 / 3;
	if (formatting.topspace !== undefined)
		this.spacing.top = formatting.topspace * 4 / 3;
	if (formatting.vocalspace !== undefined)
		this.spacing.vocal = formatting.vocalspace * 4 / 3;
	if (formatting.wordsspace !== undefined)
		this.spacing.words = formatting.wordsspace * 4 / 3;
};


/**
 * Calculates the y for a given pitch value (relative to the stave the renderer is currently printing)
 * @param {number} ofs pitch value (bottom C on a G clef = 0, D=1, etc.)
 */
Renderer.prototype.calcY = function (ofs) {
	return this.y - ofs * spacing.STEP;
};

Renderer.prototype.moveY = function (em, numLines) {
	if (numLines === undefined) numLines = 1;
	this.y += em * numLines;
};

Renderer.prototype.absolutemoveY = function (y) {
	this.y = y;
};

module.exports = Renderer;
