var Tune = require('../data/abc_tune');
var parseDirective = require('../parse/abc_parse_directive');
var multiLineVars = require('../parse/multiline_vars');

function parse(mei) {
	var tune = new Tune();
	multiLineVars.reset();
	multiLineVars.noteIds = [];
	parseDirective.initialize(null, null, {}, tune);

	var meiBody;
	for (var i = 0; i < mei.elements.length; i++) {
		var topLevel = mei.elements[i];
		if (topLevel.type === 'element') {
			for (var j = 0; j < topLevel.elements.length; j++) {
				var secondLevel = topLevel.elements[j];
				if (secondLevel.type === "element" && secondLevel.name === "music")
					meiBody = secondLevel.elements;
			}
		}
	}
	if (meiBody)
		parse2(tune, meiBody);

	var ph = 11*72;
	var pl = 8.5*72;
	tune.cleanUp(pl, ph, multiLineVars.barsperstaff, multiLineVars.staffnonote, multiLineVars.openSlurs);

	return tune;
}

function traverseTree(tune, multiLineVars, elements, breadcrumbs) {
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		switch (element.type) {
			case "element":
				handleElement(tune, multiLineVars, element.name, element.attributes, breadcrumbs, element.elements !== undefined );
				break;
			case "text":
				handleElement(tune, multiLineVars, "text", element, breadcrumbs, element.elements !== undefined );
				break;
			case "comment":
				// Can just ignore this
				break;
			default:
				console.log("MEI: element type ignored.", element.type);
		}

		if (element.elements) {
			breadcrumbs.push(element.name);
			traverseTree(tune, multiLineVars, element.elements, breadcrumbs);
			popElement(tune, multiLineVars, element.name, element.attributes, breadcrumbs);
		}
	}
}

var clefTranslation = {
	'G': "treble"
	// TODO-PER: add the rest of the clefs
};

var noteTranslation = {
	a2: -9,
	b2: -8,
	c3: -7,
	d3: -6,
	e3: -5,
	f3: -4,
	g3: -3,
	a3: -2,
	b3: -1,
	c4: 0,
	d4: 1,
	e4: 2,
	f4: 3,
	g4: 4,
	a4: 5,
	b4: 6,
	c5: 7,
	d5: 8,
	e5: 9,
	f5: 10,
	g5: 11,
	a5: 12,
	b5: 13,
	c6: 14,
	d6: 15,
	e6: 16,
	f6: 17,
	g6: 18,
	a6: 19,
	b6: 20,
	c7: 21,
};

var durationTranslation = {
	'1': 1,
	'2': 1/2,
	'4': 1/4,
	'8': 1/8
};

var accidentalTranslation = {
	'f': "flat",
	'n': "natural",
	's': "sharp",
};

var accidentalTranslation2 = {
	'f': "b",
	'n': "",
	's': "#",
};

var barTranslation = {
	'single': 'bar_thin',
	'end': 'bar_thin_thick',
	'rptend': 'bar_right_repeat',
};

// TODO-PER: fill in the rest of these.
var keySigTranslation = {
	'1f': [{"acc":"flat","note":"B", verticalPos: 6 }],
	'2f': [{"acc":"flat","note":"B", verticalPos: 6 },{"acc":"flat","note":"e", verticalPos: 9 }],
	'3f': [{"acc":"flat","note":"B", verticalPos: 6 },{"acc":"flat","note":"e", verticalPos: 9 },{"acc":"flat","note":"A", verticalPos: 5 }],
};

// TODO-PER: fill in the rest of these.
var keyModeTranslation = {
	'major': '',
	'minor': 'm'
};

function handleElement(tune, multiLineVars, type, attributes, breadcrumbs, hasChildren) {
	switch (type) {
		case "body":
		case "mdiv":
		case "score":
		case "pb":
		case "pgHead":
		case "staffDef":
		case "rend":
		case "staff":
		case "section":
		case "measure":
		case "beam":
		case "layer":
		case 'instrDef': // TODO-PER: This has midi controls and could be handled: { midi.channel: "1", midi.pan: "63", midi.volume: "100" }
			// elements that don't have an immediate action.
			break;
		case "scoreDef":
			var clef = attributes["clef.shape"] ? clefTranslation[attributes["clef.shape"]] : 'treble';
			if (!clef)
				clef = attributes["clef.shape"];
			multiLineVars.clef = { type: clef, verticalPos: 0 };
			var key = attributes['key.pname'] + attributes['key.accid'] + attributes['key.mode'];
			if (attributes['meter.sym'] === 'common')
				multiLineVars.meter = { type: "common_time"};
			else if (attributes['meter.sym'] === 'cut')
				multiLineVars.meter = { type: "cut_time"};
			else if (attributes['meter.count'])
				multiLineVars.meter = { type: "specified", value: [ { num: attributes['meter.count'], den: attributes['meter.unit'] } ] };
			if (attributes['key.pname']) {
				multiLineVars.key = {accidentals: keySigTranslation[attributes['key.sig']], root: attributes['key.pname'].toUpperCase(), acc: accidentalTranslation2[attributes['key.accid']], mode: keyModeTranslation[attributes['key.mode']]};
			}
			break;
		case "text":
			if (breadcrumbs.indexOf("pgHead") >= 0) {
				// TODO-PER: the title isn't clearly marked, so just assume that text in the header is a title.
				tune.addMetaText('title', attributes.text);
			} else if (breadcrumbs.indexOf("harm") >= 0) {
				var target = multiLineVars.noteIds[multiLineVars.harmId];
				if (target)
					target.chord = [{name: attributes.text, position: 'default'}];
				else
					console.log("MEI Element (no target)", type, attributes, breadcrumbs);
			} else
				console.log("MEI Element", type, attributes, breadcrumbs);
			break;
		case "harm":
			var startid = attributes.startid;
			if (startid)
				multiLineVars.harmId = startid.substring(1);
			else
				console.log("harm (no id)", attributes);
			break;
		case "sb":
			tune.startNewLine({ startChar: -1, endChar: -1, clef: multiLineVars.clef, key: multiLineVars.key, meter: multiLineVars.meter });
			break;
		case "staffGrp":
			tune.startNewLine({ startChar: -1, endChar: -1, clef: multiLineVars.clef, key: multiLineVars.key, meter: multiLineVars.meter });
			break;
		case "accid":
			if (multiLineVars.partialNote)
				multiLineVars.partialNote.pitches[0].accidental = accidentalTranslation[attributes.accid];
			else
				console.log("ACCID", attributes);
			break;
		case "note":
			var note= attributes.pname + attributes.oct;
			var pitch = noteTranslation[note];
			if (pitch === undefined)
				console.log("PITCH:", attributes);
			var noteObj = {
				duration: durationTranslation[attributes.dur],
				pitches: [ { pitch: pitch } ],
			};
			if (hasChildren)
				multiLineVars.partialNote = noteObj;
			else
				multiLineVars.noteIds[attributes['xml:id']] = tune.appendElement('note', -1, -1, noteObj);
			break;
		case 'ending':
			multiLineVars.startEnding = attributes.label;
			break;
		default:
			console.log("MEI Element", type, attributes, breadcrumbs);
			break;
	}
}

function popElement(tune, multiLineVars, type, attributes, breadcrumbs) {
	switch (type) {
		case "section":
		case "score":
		case "mdiv":
		case "body":
		case "rend":
		case "pgHead":
		case "staffGrp":
		case "scoreDef":
		case "layer":
		case "harm":
		case "staffDef":
			// Don't need to do anything for these elements
			break;
		case "measure":
			var barType = attributes.right ? barTranslation[attributes.right] : 'bar_thin';
			if (barType) {
				var attr = {type: barType};
				if (multiLineVars.startEnding) {
					attr.startEnding = multiLineVars.startEnding;
					delete multiLineVars.startEnding;
				}
				if (attributes.label)
					attr.startEnding = attributes.label;
				tune.appendElement('bar', -1, -1, attr);
			}
			else
				console.log("MEI Pop (unknown bar type)", type, attributes, breadcrumbs);
			break;
		case "staff":
			tune.closeLine();
			break;
		case "beam":
			tune.endBeamOnMostRecentNote();
			break;
		case "note":
			if (multiLineVars.partialNote)
				multiLineVars.noteIds[attributes['xml:id']] = tune.appendElement('note', -1, -1, multiLineVars.partialNote);
			delete multiLineVars.partialNote;
			break;
		default:
			console.log("MEI Pop", type, attributes, breadcrumbs);
	}
	breadcrumbs.pop();
}

function parse2(tune, meiBody) {
	var breadcrumbs = [];
	traverseTree(tune, multiLineVars, meiBody, breadcrumbs);
}

module.exports = parse;

// part = is like a score, but just one part
// section = just a grouping, probably doesn't look different, but might have things like tempo change.
// ending = like section
// expansion = ignore for now
//
// 	staffDef– Container for staff meta-information.
// 	layerDef– Container for layer meta-information.
// 	grpSym– A brace or bracket used to group two or more staves of a score or part.
// 	label A container for text that identifies the feature to which it is attached.
// 	clef Indication of the exact location of a particular note on the staff and, therefore, the other notes as well.
// 	clefGrp – A set of simultaneously-occurring clefs.
// 	keySig – Written key signature.
// 	keyAccid
//
// layer (probably the same as "voice")
//
// chord
// rest
//
// barLine
// custos
//
// accid
// artic
// dot
//
// syl (lyric)
//
// space (like the "y")
//
// dir (decoration)
// tempo
// dynam
// phrase / slur - both are slurs
// ornam
//
// Meta:
//
// 	bibl – Provides a loosely-structured bibliographic citation; contain a mix of text and more specific elements, including the following:
// 	arranger
// author
// composer
// librettist
// lyricist
// funder
// sponsor
// respStmt(responsibility statement)
// title
// edition
// editor
// series
// imprint
// pubPlace
// publisher
// distributor
// biblScope
// extent
// date
// identifier
// annot
// creation
// genre
// recipient
// textLang
// repository
// physLoc
// relatedItem
//
//
// The following should be acknowledged, but probably not handled:
// 	p - for paragraph, not sure what it means to us
// titlePage
// name
// date
// num
// address
// addrLine
// annot