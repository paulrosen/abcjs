/**
 * @author paulrosen
 */

PlayEmbedded = Class.create();

PlayEmbedded.prototype = {
	initialize: function () {
		playTune = new PlayTune();
	},
	
	play: function(abcParsed)
	{
		var abcPitchToAbsPitch = [
			33, 35, 36, 38, 40, 41, 43,
			45, 47, 48, 50, 52, 53, 55,
			57, 59, 60, 62, 64, 65, 67,
			69, 71, 72, 74, 76, 77, 79,
			81, 83, 84, 86, 88, 89, 91,
			93, 95, 96, 98, 100, 101, 103
		];
		var tune = [];
		
		// This turns the internal parsed format into an array of absolute notes and durations.
		abcParsed.lines.each(function(line) {
			if (line.staff != undefined)
			{
				line.staff.each(function(item) {
					switch (item.el_type)
					{
						case 'note':
							tune[tune.length] = [ abcPitchToAbsPitch[item.pitch], item.duration];
							break;
					}
				});
			}
		});
		
		playTune.play(tune, 89);
	},
	
	stop: function()
	{
		playTune.stop();
	}

};
	
