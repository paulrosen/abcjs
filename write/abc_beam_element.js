//    abc_beam_element.js: Definition of the BeamElem class.
//    Copyright (C) 2010,2014 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*globals ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.BeamElem = function(type, flat) {
	this.isflat = (flat);
	this.isgrace = (type && type==="grace");
	this.forceup = (type && type==="up");
	this.forcedown = (type && type==="down");
	this.elems = []; // all the ABCJS.write.AbsoluteElements
	this.total = 0;
	this.dy = (this.asc)?ABCJS.write.spacing.STEP*1.2:-ABCJS.write.spacing.STEP*1.2;
	if (this.isgrace) this.dy = this.dy*0.4;
	this.allrests = true;
};

ABCJS.write.BeamElem.prototype.add = function(abselem) {
	var pitch = abselem.abcelem.averagepitch;
	if (pitch===undefined) return; // don't include elements like spacers in beams
	this.allrests = this.allrests && abselem.abcelem.rest;
	abselem.beam = this;
	this.elems.push(abselem);
	//var pitch = abselem.abcelem.averagepitch;
	this.total += pitch; // TODO CHORD (get pitches from abselem.heads)
	if (!this.min || abselem.abcelem.minpitch<this.min) {
		this.min = abselem.abcelem.minpitch;
	}
	if (!this.max || abselem.abcelem.maxpitch>this.max) {
		this.max = abselem.abcelem.maxpitch;
	}
};

ABCJS.write.BeamElem.prototype.average = function() {
	try {
		return this.total/this.elems.length;
	} catch (e) {
		return 0;
	}
};

ABCJS.write.BeamElem.prototype.draw = function(renderer) {
	if (this.elems.length === 0 || this.allrests) return;
	this.drawBeam(renderer);
	this.drawStems(renderer);
};

ABCJS.write.BeamElem.prototype.calcDir = function() {
	var average = this.average();
	//	var barpos = (this.isgrace)? 5:7;
	this.asc = (this.forceup || this.isgrace || average<6) && (!this.forcedown); // hardcoded 6 is B
	return this.asc;
};

ABCJS.write.BeamElem.prototype.drawBeam = function(renderer) {
	var average = this.average();
	var barpos = (this.isgrace)? 5:7;
	this.calcDir();

	var barminpos = this.asc ? 5 : 8;	//PER: I just bumped up the minimum height for notes with descending stems to clear a rest in the middle of them.
	this.pos = Math.round(this.asc ? Math.max(average+barpos,this.max+barminpos) : Math.min(average-barpos,this.min-barminpos));
	var slant = this.elems[0].abcelem.averagepitch-this.elems[this.elems.length-1].abcelem.averagepitch;
	if (this.isflat) slant=0;
	var maxslant = this.elems.length/2;

	if (slant>maxslant) slant = maxslant;
	if (slant<-maxslant) slant = -maxslant;
	this.starty = renderer.calcY(this.pos+Math.floor(slant/2));
	this.endy = renderer.calcY(this.pos+Math.floor(-slant/2));

	var starthead = this.elems[0].heads[(this.asc)? 0: this.elems[0].heads.length-1];
	var endhead = this.elems[this.elems.length-1].heads[(this.asc)? 0: this.elems[this.elems.length-1].heads.length-1];
	this.startx = starthead.x;
	if(this.asc) this.startx+=starthead.w-0.6;
	this.endx = endhead.x;
	if(this.asc) this.endx+=endhead.w;

	// PER: if the notes are too high or too low, make the beam go down to the middle
	if (this.asc && this.pos < 6) {
		this.starty = renderer.calcY(6);
		this.endy = renderer.calcY(6);
	} else if (!this.asc && this.pos > 6) {
		this.starty = renderer.calcY(6);
		this.endy = renderer.calcY(6);
	}

	var pathString = "M"+this.startx+" "+this.starty+" L"+this.endx+" "+this.endy+
		"L"+this.endx+" "+(this.endy+this.dy) +" L"+this.startx+" "+(this.starty+this.dy)+"z";
	renderer.printPath({path:pathString, stroke:"none", fill:"#000000", 'class': renderer.addClasses('beam-elem')});
};

ABCJS.write.BeamElem.prototype.drawStems = function(renderer) {
	var auxbeams = [];  // auxbeam will be {x, y, durlog, single} auxbeam[0] should match with durlog=-4 (16th) (j=-4-durlog)
	renderer.beginGroup();
	for (var i=0,ii=this.elems.length; i<ii; i++) {
		if (this.elems[i].abcelem.rest)
			continue;
		var furthesthead = this.elems[i].heads[(this.asc)? 0: this.elems[i].heads.length-1];
		var ovaldelta = (this.isgrace)?1/3:1/5;
		var pitch = furthesthead.pitch + ((this.asc) ? ovaldelta : -ovaldelta);
		var y = renderer.calcY(pitch);
		var x = furthesthead.x + ((this.asc) ? furthesthead.w: 0);
		var bary=this.getBarYAt(x);
		var dx = (this.asc) ? -0.6 : 0.6;
		renderer.printStem(x,dx,y,bary);

		var sy = (this.asc) ? 1.5*ABCJS.write.spacing.STEP: -1.5*ABCJS.write.spacing.STEP;
		if (this.isgrace) sy = sy*2/3;
		for (var durlog=ABCJS.write.getDurlog(this.elems[i].abcelem.duration); durlog<-3; durlog++) { // get the duration via abcelem because of triplets
			if (auxbeams[-4-durlog]) {
				auxbeams[-4-durlog].single = false;
			} else {
				auxbeams[-4-durlog] = {x:x+((this.asc)?-0.6:0), y:bary+sy*(-4-durlog+1),
					durlog:durlog, single:true};
			}
		}

		for (var j=auxbeams.length-1;j>=0;j--) {
			if (i===ii-1 || ABCJS.write.getDurlog(this.elems[i+1].abcelem.duration)>(-j-4)) {

				var auxbeamendx = x;
				var auxbeamendy = bary + sy*(j+1);


				if (auxbeams[j].single) {
					auxbeamendx = (i===0) ? x+5 : x-5;
					auxbeamendy = this.getBarYAt(auxbeamendx) + sy*(j+1);
				}
				// TODO I think they are drawn from front to back, hence the small x difference with the main beam

				var pathString ="M"+auxbeams[j].x+" "+auxbeams[j].y+" L"+auxbeamendx+" "+auxbeamendy+
					"L"+auxbeamendx+" "+(auxbeamendy+this.dy) +" L"+auxbeams[j].x+" "+(auxbeams[j].y+this.dy)+"z";
				renderer.printPath({path:pathString, stroke:"none", fill:"#000000", 'class': renderer.addClasses('beam-elem')});
				auxbeams = auxbeams.slice(0,j);
			}
		}
	}
	renderer.endGroup('beam-elem');
};

ABCJS.write.BeamElem.prototype.getBarYAt = function(x) {
	return this.starty + (this.endy-this.starty)/(this.endx-this.startx)*(x-this.startx);
};
