// This turns the number of cents to detune into a value that is convenient to use in pitch calculations
// A cent is 1/100 of a musical half step and is calculated exponentially over the course of an octave.
// The equation is:
// Two to the power of cents divided by 1200

function centsToFactor(cents) {
	return Math.pow(2, cents/1200);
}

module.exports = centsToFactor;
