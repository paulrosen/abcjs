/*global Class */
/*global sprintf */
/*extern  ABCBeamElem, ABCGraphElem, ABCPrinter, AbcGlyphs, AbcSpacing, getDuration */

var AbcGlyphs = Class.create({
	initialize: function(paper) {
		var glyphs = {'#':{d:[["M", 5.125000000000014, -2.7916666666666785], ["l", -2.917, 1], ["l", 0, 4.417], ["l", 2.917, -0.917], ["l", 0, -4.5], ["z"], ["m", -5.083, -1.417], ["l", 1.25, -0.416], ["l", -0, -4.917], ["l", 0.916, 0], ["l", 0, 4.583], ["l", 2.917, -0.916], ["l", 0, -4.417], ["l", 0.917, 0], ["l", -0, 4.083], ["l", 1.166, -0.333], ["l", 0, 3.083], ["l", -1.166, 0.417], ["l", -0, 4.417], ["l", 1.166, -0.334], ["l", 0, 3.084], ["l", -1.166, 0.416], ["l", -0, 4.834], ["l", -0.917, -0], ["l", 0, -4.584], ["l", -2.917, 0.917], ["l", 0, 4.5], ["l", -0.916, -0], ["l", -0, -4.167], ["l", -1.25, 0.417], ["l", -0, -3.083], ["l", 1.25, -0.417], ["l", -0, -4.5], ["l", -1.25, 0.417], ["l", -0, -3.084], ["z"]],w:7.167,h:20.5},'&':{d:[["M", 12.291666666666657, -8.208333333333329], ["c", 10, -0.75, 10.917, 12.5, 2.5, 15.583], ["c", 0.083, 1.584, 1.583, 8.417, 0.5, 10.084], ["c", -1, 1.5, -2.25, 3.083, -5, 3.25], ["c", -2.083, 0.083, -6.167, -0.834, -6.417, -4.167], ["c", -0.083, -1.917, 0.75, -4.25, 3.084, -4.25], ["c", 4, 0, 4.583, 5.583, -0.084, 6.5], ["c", 1.667, 1.917, 6.667, 1.167, 7.667, -1.583], ["c", 0.917, -2.667, -0.25, -6.75, -0.5, -9.584], ["c", -8.833, 1.5, -14, -6.166, -14, -11.083], ["c", 0, -7.167, 5.083, -11.5, 9.75, -14.917], ["c", -0.417, -3.333, -1.083, -4.416, -0.25, -9.916], ["c", 0.333, -2, 2.917, -6.75, 4.667, -6.75], ["c", 1.333, -0, 3.416, 5.416, 3.5, 8.083], ["c", -0, 7.083, -3, 9.583, -6.417, 12.917], ["c", -0, -0, 1, 5.416, 1, 5.833], ["z"], ["m", 2.333, -22.167], ["c", -3.083, 0, -4.75, 6.5, -4.083, 11.417], ["c", 2.583, -2, 6.167, -5.833, 5.917, -8.833], ["c", -0.084, -0.917, -0.5, -2.584, -1.834, -2.584], ["z"], ["m", -1.75, 26.25], ["l", 1.75, 10.5], ["c", 3.417, -1.167, 3.5, -4.167, 3.417, -5.917], ["c", -0.084, -1.5, -0.75, -4.833, -5.167, -4.583], ["z"], ["m", -0.75, 0.083], ["c", -5.583, 0.584, -4.667, 6, -1.667, 7.75], ["c", -0.166, 0.084, -0.333, 0.334, -0.333, 0.334], ["c", -4.5, -2.084, -5.25, -7.584, -1.083, -11], ["c", 1, -0.834, 1.583, -0.917, 2.5, -1.167], ["l", -0.917, -5.417], ["c", -2.167, 1.334, -9.083, 7.5, -8.583, 12.417], ["c", 0.5, 5, 5.916, 9.167, 11.833, 7.75], ["z"]],w:20.466,h:55.75},'.':{d:[["M", 0.9583333333333321, -0.541666666666667], ["c", 0, -0.833, 0.75, -1.5, 1.583, -1.5], ["c", 0.834, 0, 1.584, 0.667, 1.584, 1.5], ["c", -0, 0.833, -0.75, 1.5, -1.584, 1.5], ["c", -0.833, 0, -1.583, -0.667, -1.583, -1.5], ["z"]],w:3.167,h:3},'0':{d:[["M", 5.958333333333343, -7.375], ["c", 7.917, 0.083, 7.833, 14.583, 0, 14.667], ["c", -8, -0.084, -7.917, -14.584, 0, -14.667], ["z"], ["m", 0, 0.75], ["c", -2.917, 0.5, -2.833, 12.583, 0, 13.083], ["c", 2.833, -0.5, 2.833, -12.583, 0, -13.083], ["z"]],w:11.875,h:14.667},'1':{d:[["M", 7.958333333333314, 7.291666666666671], ["l", -6.583, 0], ["c", -0.417, -1.5, 1.416, -0.083, 1.416, -1.75], ["l", 0, -10.25], ["c", -0.916, 1.417, -1.333, 5.417, -2.833, 4.75], ["l", 3.083, -7.25], ["l", 3.417, 0], ["l", 0, 12.667], ["c", 0.167, 1.666, 2, 0.333, 1.5, 1.833], ["z"]],w:8.089,h:14.5},'2':{d:[["M", 0.041666666666665186, 7.458333333333314], ["c", -1.083, -6.083, 8.833, -7.167, 7.75, -10.833], ["c", 0.083, -3.334, -3.583, -4.417, -5, -1.834], ["c", -0.083, 0.584, 1.583, 0.667, 2, 2.167], ["c", 0.333, 1.167, -0.583, 2.667, -2, 2.667], ["c", -2, -0, -2.417, -1.917, -2.417, -3.084], ["c", 0, -2.333, 3, -4, 5.5, -4], ["c", 2, 0, 5.834, 0.25, 5.834, 4.584], ["c", -0, 3.916, -7.084, 3.75, -8.75, 5.916], ["c", 4.333, -1.416, 6.416, 2.917, 7.916, -1], ["c", 0.334, 0, 0.167, 0.167, 0.5, 0.167], ["c", -0.416, 2.333, -1.583, 5.25, -4.083, 5.25], ["c", -2.083, 0, -2.917, -1.667, -4.417, -1.667], ["c", -1.083, 0, -2, 0.75, -2.25, 1.667], ["l", -0.583, 0], ["z"]],w:11.75,h:14.917},'3':{d:[["M", 11.208333333333314, 3.0416666666666643], ["c", 0, 5.833, -11.083, 5.833, -11.167, 0.417], ["c", 0, -2.5, 4.334, -3, 4.334, -0.25], ["c", -0, 1.833, -2.167, 3, 0.166, 3.583], ["c", 2, 0, 2.917, -2.333, 2.917, -3.667], ["c", 0, -2.583, -2.333, -2.333, -4.25, -2.75], ["l", 0, -0.75], ["c", 1.917, -0.25, 3.833, -0.916, 3.833, -3.166], ["c", 0, -3.667, -3, -3.5, -3.75, -2.167], ["c", 0.084, 0.667, 1, 0.917, 1.417, 2.083], ["c", 0.417, 1.167, -0.917, 2.417, -2.083, 2.417], ["c", -1.334, -0, -2.334, -1.417, -2.334, -2.167], ["c", 0, -1.75, 1.417, -4, 6.084, -4], ["c", 2, 0, 4.25, 1.417, 4.25, 3.667], ["c", -0, 2.917, -3.417, 3.167, -3.417, 3.583], ["c", 1.75, 0.167, 4, 0.834, 4, 3.167], ["z"]],w:11.167,h:14.845},'4':{d:[["M", 12.208333333333343, 3.375000000000007], ["l", -2.167, 0], ["l", 0, 1.917], ["c", 0.25, 1.75, 1.917, 0.416, 1.417, 2], ["l", -6.5, -0], ["l", 0, -0.834], ["c", 1.333, 0.584, 1.5, -1.666, 1.417, -3.083], ["l", -5.584, 0], ["l", -0.5, -0.583], ["c", 3.667, -4.917, 3.667, -5.834, 4.5, -10.25], ["l", 5.25, -0], ["c", -1.25, 2.25, -5.416, 6.583, -8.333, 10], ["l", 4.667, -0], ["l", -0, -3.75], ["l", 3.666, -4], ["l", 0, 7.75], ["l", 2.167, -0], ["l", -0, 0.833], ["z"]],w:11.917,h:14.75},'5':{d:[["M", 10.291666666666657, -7.541666666666657], ["c", -1, 2.333, -1.667, 3.333, -4.667, 3.583], ["c", -1.416, 0.084, -3.25, -0.333, -4.25, -0.25], ["l", 0, 3.25], ["c", 4.334, -3.25, 10.834, 0.334, 7.917, 5.75], ["c", -1.333, 2.5, -3.083, 2.667, -5, 2.667], ["c", -1.833, 0, -4.25, -1.25, -4.25, -3.417], ["c", 0.083, -2.75, 4.167, -3.083, 4.25, -0.333], ["c", 0, 1.5, -1.167, 1.75, -1.083, 2.25], ["c", 0.083, 0.417, 0.833, 0.75, 0.916, 0.75], ["c", 1.667, 0, 2.584, -2.667, 2.584, -3.583], ["c", -0, -1.5, -0.667, -4.167, -2.834, -4.167], ["c", -1.25, 0, -2.25, 0.667, -3.25, 1.5], ["l", 0, -8], ["c", 3.084, 0.333, 5.917, 0.5, 9.667, 0], ["z"]],w:10.25,h:15},'6':{d:[["M", -0.041666666666665186, 0.7916666666666679], ["c", 0.25, -4.75, 2.083, -7.667, 6.5, -7.833], ["c", 1.583, -0, 4.25, 1, 4.25, 2.916], ["c", 0, 0.834, -0.5, 2.167, -1.75, 2.167], ["c", -1.833, 0, -2.5, -1.583, -2.25, -2.25], ["c", 0.333, -1.083, 0.667, -0.5, 0.667, -1.417], ["c", -0.834, -1.416, -3, -0.833, -3.25, 1.834], ["c", -0.084, 0.833, -0.584, 2.583, -0.5, 4], ["c", 2.833, -2.417, 7.75, -1, 7.666, 2.583], ["c", 0, 3.167, -2.833, 4.917, -5.75, 4.917], ["c", -2.666, -0, -5.833, -2.917, -5.583, -6.917], ["z"], ["m", 3.917, 3.083], ["c", -0, 0.75, 0.416, 3.084, 1.75, 3.084], ["c", 1.583, -0, 2.166, -2.667, 2.083, -4], ["c", 0, -0.75, -0.5, -2.75, -2.083, -2.5], ["c", -1.75, 0.25, -1.75, 2.75, -1.75, 3.416], ["z"]],w:11.349,h:14.75},'7':{d:[["M", 11.708333333333314, -7.541666666666657], ["c", 1, 0.333, 0.667, 1.25, 0.083, 2.917], ["c", -2.25, 6.833, -3.666, 5.833, -4.166, 12.25], ["c", -1.917, -0.25, -2.834, -0.25, -4.75, -0], ["c", -0.334, -5.5, 6.083, -7.417, 7.083, -11], ["c", -3.167, 2.333, -4.333, -1.334, -7.167, -1.334], ["c", -1.25, 0, -2, 1, -2.25, 2.084], ["l", -0.5, -0], ["l", 0, -4.584], ["c", 0.75, -0.25, 0.417, 0.584, 0.917, 0.917], ["c", 0.75, 0, 2.25, -1.167, 3.833, -1.167], ["c", 2.334, 0, 4, 2.167, 5, 2.167], ["c", 1, 0, 1.25, -1.583, 1.917, -2.25], ["z"]],w:12.306,h:15.167},'8':{d:[["M", 11.291666666666657, 2.5416666666666643], ["c", 0, 3.083, -3.083, 5, -5.667, 5], ["c", -2.333, 0, -5.583, -1.083, -5.583, -3.833], ["c", 0, -1.917, 1.417, -3.25, 2.25, -3.584], ["c", -4, -2.416, -1.25, -7.416, 3.333, -7.416], ["c", 5.667, -0, 6.334, 4, 3.75, 6.583], ["c", 1.084, 0.5, 1.917, 1.667, 1.917, 3.25], ["z"], ["m", -3, -3.917], ["c", 1.75, -1.833, 1.333, -5.25, -2.667, -5.166], ["c", -1.5, -0, -3.083, 0.833, -2.833, 2.083], ["c", 0.25, 1.25, 4.25, 2.667, 5.5, 3.083], ["z"], ["m", 0, 5.5], ["c", 0, -2.333, -3.833, -3.167, -5.083, -3.417], ["c", -2.75, 1.334, -2, 6.167, 2.083, 5.834], ["c", 0.917, -0, 3, -1, 3, -2.417], ["z"]],w:11.327,h:14.833},'9':{d:[["M", 11.291666666666657, -0.708333333333333], ["c", 0, 4.667, -2.083, 8.25, -6.417, 8.417], ["c", -1.583, -0, -4.166, -1.334, -4.166, -3.25], ["c", -0, -0.917, 0.75, -2.084, 2, -2.084], ["c", 1.416, 0, 2.583, 0.917, 2.083, 2.084], ["c", -0.5, 1.25, -1.583, 2.083, 0.333, 2.583], ["c", 1.5, -0.167, 3, -4.667, 2.5, -6.917], ["c", -2.916, 2.5, -7.666, 0.75, -7.666, -2.833], ["c", -0, -3.167, 2.833, -4.333, 5.75, -4.333], ["c", 2.916, -0, 5.583, 2.333, 5.583, 6.333], ["z"], ["m", -3.833, -3.083], ["c", -0, -0.667, -0.5, -2.584, -1.834, -2.584], ["c", -1.583, 0, -2.166, 2.25, -2.083, 3.5], ["c", 0, 0.75, 0.583, 2.917, 2.167, 2.667], ["c", 1.75, -0.25, 1.75, -2.833, 1.75, -3.583], ["z"]],w:11.333,h:14.75},'=':{d:[["M", 29.958333333333314, -30.04166666666663], ["l", -29.917, 0], ["l", 0, -0.583], ["l", 29.917, -0], ["l", 0, 0.583], ["z"], ["m", 0, 7.667], ["l", -29.917, -0], ["l", 0, -0.584], ["l", 29.917, 0], ["l", 0, 0.584], ["z"], ["m", 0, 7.583], ["l", -29.917, 0], ["l", 0, -0.583], ["l", 29.917, -0], ["l", 0, 0.583], ["z"], ["m", 0, 7.583], ["l", -29.917, 0], ["l", 0, -0.583], ["l", 29.917, 0], ["l", 0, 0.583], ["z"], ["m", 0, 7.583], ["l", -29.917, 0], ["l", 0, -0.583], ["l", 29.917, -0], ["l", 0, 0.583], ["z"]],w:29.917,h:31},'?':{d:[["M", 1.4583333333333357, -0.2916666666666643], ["c", 0.25, -9.5, 13.167, -9.083, 15, -1.833], ["c", 2.75, 10.833, -6.25, 18.25, -16.083, 19.75], ["l", -0.167, -0.417], ["c", -0, 0, 5.083, -1.5, 7.583, -4.167], ["c", 3.25, -3.416, 4.917, -7.5, 4.834, -12.75], ["c", -0, -2.333, -0.834, -6.916, -4.584, -6.916], ["c", -2.166, -0, -5.25, 1.833, -5, 4.166], ["c", 0.084, 0.334, 0.917, -0.333, 2.584, -0.25], ["c", 3.25, 0.25, 3.083, 6.084, -0.417, 6.084], ["c", -1.917, -0, -3.75, -1.417, -3.75, -3.667], ["z"], ["m", 16.667, -3.333], ["c", -0, -0.917, 0.75, -1.667, 1.666, -1.667], ["c", 0.917, 0, 1.667, 0.667, 1.667, 1.583], ["c", -0, 0.917, -0.75, 1.667, -1.667, 1.667], ["c", -0.916, -0, -1.666, -0.667, -1.666, -1.583], ["z"], ["m", 0, 7.5], ["c", 0, -0.917, 0.75, -1.583, 1.667, -1.583], ["c", 0.916, -0, 1.666, 0.666, 1.666, 1.583], ["c", 0, 0.917, -0.666, 1.667, -1.583, 1.667], ["c", -0.917, -0, -1.75, -0.75, -1.75, -1.667], ["z"]],w:21.25,h:25.126},'C':{d:[["M", 6.125, 6.375000000000014], ["l", 0, -12.667], ["c", -3.333, 1.667, -3.25, 11.084, 0, 12.667], ["z"], ["m", 6.25, -4.167], ["c", -0.083, 2.75, -2.917, 5.334, -5.333, 5.334], ["l", -0, 4.833], ["l", -0.917, 0], ["l", 0, -4.917], ["c", -7.667, -0.583, -7.917, -14.333, 0, -14.833], ["l", 0, -3.833], ["l", 0.917, -0], ["l", -0, 3.833], ["c", 3.083, 0.083, 5.5, 1.667, 5.5, 4.417], ["c", -0, 1.166, -1.417, 2.25, -2.25, 2.25], ["c", -0.834, -0, -2.584, -0.417, -2.584, -2.25], ["c", 0, -1.167, 0.834, -2, 1.917, -2], ["c", 0.667, -0, 0.667, -0.5, 0.417, -0.75], ["c", -0.584, -0.667, -1.667, -1.084, -3, -0.834], ["l", -0, 13.084], ["c", 2.25, 0.083, 4.5, -1.667, 4.5, -4.334], ["l", 0.833, 0], ["z"]],w:11.663,h:23.583},'E':{d:[["M", 0.6249999999999991, 14.875], ["c", 5.167, 0, 9.75, -10.083, 6.167, -15.833], ["c", -1.834, 1.25, -4.917, 1.416, -6.167, -0.167], ["l", 0, 16], ["z"], ["m", -0.583, -17.667], ["c", 0.333, -3, 3.416, -4.833, 6.25, -4.916], ["c", 4.583, -0.084, 3.75, 5.166, 0.916, 6.583], ["c", 2, 4.167, 1.75, 9, -0.666, 13.167], ["c", -2.167, 3.666, -5.25, 6.25, -5.834, 10.833], ["c", -0.333, 0, -0.583, 0.083, -0.666, -0.167], ["l", -0, -25.5], ["z"]],w:9.001,h:30.583},'H':{d:[["M", 9.791666666666657, -6.874999999999986], ["c", 1.167, 5.167, -4.75, 8.75, -9.25, 5.833], ["l", 0, 24], ["l", -0.583, 0], ["l", -0, -25.916], ["c", 1.083, -3.5, 2.833, -5.417, 7.166, -5.167], ["c", 0.667, 0.083, 2.084, 0.167, 2.667, 1.25], ["z"], ["m", -0.75, 0.5], ["c", -2.167, -1.583, -4.833, 1.083, -6.667, 2.083], ["c", -0.916, 0.5, -2, 1.584, -1.416, 2.584], ["c", 2.083, 1.666, 4.666, -1.25, 6.666, -2], ["c", 0.834, -0.584, 2, -1.667, 1.417, -2.667], ["z"]],w:9.983,h:31.106},'Q':{d:[["M", 0.04166666666666696, -2.7083333333333357], ["c", 0.25, -3.083, 3.333, -5, 6.25, -5], ["c", 2.583, 0, 3.833, 1.75, 3.083, 3.917], ["c", -0.916, 3, -6.25, 5.333, -8.75, 2.666], ["l", 0, 23.917], ["l", -0.583, -0], ["l", 0, -25.5], ["z"]],w:9.517,h:30.5},'T':{d:[["M", 3.0416666666666714, -1.4583333333333357], ["c", -0.917, 0, -2.333, 0.5, -2.333, 2.167], ["c", -0, 2, 1.666, 2.25, 3, 1.666], ["c", 0.916, 0.167, 1.583, 0.667, 1.583, 1.5], ["c", 0, 0.75, -1.167, 1.334, -2, 1.167], ["c", -1.917, -0.333, -3.333, -2.417, -3.333, -4.25], ["c", -0, -2.667, 2.166, -4.667, 4.333, -4.667], ["c", 5, 0.084, 6.667, 6.584, 11.417, 6.5], ["c", 0.916, 0, 2.416, -0.5, 2.416, -2.166], ["c", 0, -3.584, -4.333, -0.334, -4.583, -3.084], ["c", 0, -0.75, 1.083, -1.416, 1.917, -1.25], ["c", 1.916, 0.334, 3.416, 2.417, 3.416, 4.25], ["c", 0, 2.667, -2.25, 4.667, -4.416, 4.667], ["c", -5, -0.083, -6.667, -6.583, -11.417, -6.5], ["z"]],w:18.917,h:8.965},'X':{d:[["M", 4.5416666666666785, 17.125], ["c", 0.667, -0.333, 6.5, -5.583, 3.75, -9.25], ["c", -1.583, 4.333, -7.167, 5.25, -7.75, 9.917], ["c", 0, -0, 2.417, 0.083, 4, -0.667], ["z"], ["m", 3.75, -19.083], ["c", -1.667, 2, -5.833, 2.833, -7.667, 0.833], ["l", 0, 13.083], ["c", 0, 0, 3, -0.833, 4.5, -1.833], ["c", 3, -2.083, 5.334, -7.833, 3.167, -12.083], ["z"], ["m", -8.25, -0.5], ["c", 0.083, -3.25, 3.25, -5.167, 6.167, -5.25], ["c", 3.416, -0.167, 4.25, 3.167, 2.416, 5.25], ["c", 1.5, 2.667, 1.084, 7, -0.083, 9.75], ["c", 0.583, 0.667, 1.5, 3.833, 0.917, 5.417], ["c", -0.5, 3.333, -5.334, 6.166, -7.084, 7.833], ["c", -0.916, 0.833, -1.75, 1.083, -1.75, 3.25], ["l", -0.583, 0], ["l", -0, -26.25], ["z"]],w:9.556,h:31.5},'\\':{d:[["M", 0.625, -30.375], ["l", 0, 30.417], ["l", -0.583, -0], ["l", -0, -30.417], ["l", 0.583, 0], ["z"]],w:0.583,h:30.417},'_':{d:[["M", 12.708333333333314, -0.5416666666666661], ["l", 0, 0.583], ["l", -12.667, 0], ["l", 0, -0.583], ["l", 12.667, 0], ["z"]],w:12.667,h:0.583},'b':{d:[["M", 0.7916666666666679, -12.958333333333314], ["l", 0, 9.583], ["c", 2.5, -3, 7, -0.166, 5.167, 3.25], ["c", -0.917, 1.667, -4.917, 4, -5.917, 4.917], ["l", 0, -17.75], ["l", 0.75, -0], ["z"], ["m", 1.75, 14.75], ["c", 2.167, -1.333, 1.25, -6.917, -1.417, -4.083], ["c", -0.666, 1.5, -0.25, 3.583, -0.333, 5.583], ["c", 0, 0, 1.167, -0.917, 1.75, -1.5], ["z"]],w:6.344,h:17.75},'c':{d:[["M", 12.375, 2.2083333333333357], ["c", -0.083, 2.75, -2.833, 5.333, -5.417, 5.333], ["c", -4, 0, -6.833, -3.583, -6.833, -7.5], ["c", 0, -3.833, 2.667, -7.416, 6.5, -7.416], ["c", 3.25, -0, 5.917, 1.5, 5.917, 4.416], ["c", -0, 1.167, -1.417, 2.25, -2.25, 2.25], ["c", -0.834, 0, -2.584, -0.416, -2.584, -2.25], ["c", 0, -1.166, 0.834, -2, 1.917, -2], ["c", 0.75, 0, 0.667, -0.5, 0.417, -0.75], ["c", -0.667, -0.666, -1.834, -1.166, -3.334, -0.75], ["c", -2.333, 0.667, -2.916, 3.5, -2.916, 6.5], ["c", -0, 3.334, 0.583, 6.5, 3.5, 6.5], ["c", 2, 0, 4.333, -1.75, 4.25, -4.333], ["l", 0.833, 0], ["z"]],w:12.417,h:14.917},'e':{d:[["M", 9.541666666666657, -5.208333333333329], ["c", 0, 3.417, -3.25, 5.25, -6.167, 5.25], ["c", -2.5, 0, -3.833, -1.75, -3.083, -3.917], ["c", 1, -3, 6.25, -5.25, 8.75, -2.666], ["l", 0, -24.167], ["l", 0.5, 0], ["c", 0.333, 4.167, 3.167, 5.917, 5, 9.25], ["c", 2.333, 4.167, 2.833, 9.5, 1.25, 14.333], ["l", -0.333, -0.25], ["c", 2.083, -6.166, -0.5, -15.416, -5.917, -15.5], ["l", 0, 17.667], ["z"]],w:16.415,h:30.75},'h':{d:[["M", 0.20833333333333304, -1.2083333333333357], ["c", -1.25, -5.25, 4.75, -8.667, 9.25, -5.833], ["l", 0, -24], ["l", 0.583, -0], ["l", 0, 25.916], ["c", -1, 3.667, -2.833, 5.334, -7.166, 5.167], ["c", -0.667, -0.083, -2.084, -0.167, -2.667, -1.25], ["z"], ["m", 0.75, -0.5], ["c", 2.083, 1.5, 4.833, -1.083, 6.583, -2.083], ["c", 0.917, -0.584, 2.084, -1.584, 1.5, -2.584], ["c", -2.166, -1.583, -4.833, 1.084, -6.666, 2], ["c", -1, 0.5, -2.084, 1.667, -1.417, 2.667], ["z"]],w:10.001,h:31.095},'k':{d:[["M", 0.5416666666666661, -4.958333333333336], ["c", 0, -0.833, 0.75, -1.5, 1.583, -1.5], ["c", 0.834, 0, 1.584, 0.667, 1.584, 1.5], ["c", -0, 0.833, -0.75, 1.5, -1.584, 1.5], ["c", -0.833, 0, -1.583, -0.667, -1.583, -1.5], ["z"]],w:3.167,h:3},'n':{d:[["M", 4.208333333333329, -2.708333333333332], ["l", -3.417, 0.917], ["l", 0, 4.666], ["l", 3.417, -0.916], ["l", 0, -4.667], ["z"], ["m", -3.417, -2], ["l", 4.167, -1.167], ["l", 0, 17.167], ["l", -0.75, -0], ["l", 0, -6.417], ["l", -4.167, 1.084], ["l", 0, -17.334], ["l", 0.75, 0], ["l", 0, 6.667], ["z"]],w:4.917,h:22.667},'q':{d:[["M", 9.541666666666657, -5.041666666666671], ["c", -0.167, 3.167, -3.333, 5.083, -6.25, 5.083], ["c", -2.5, 0, -3.917, -1.75, -3.167, -3.916], ["c", 0.917, -3, 6.25, -5.25, 8.834, -2.667], ["l", -0, -24], ["l", 0.583, 0], ["l", 0, 25.5], ["z"]],w:9.591,h:30.583},'w':{d:[["M", 0.04166666666666785, -0.04166666666666696], ["c", -0.167, -2.083, 2.583, -3.917, 5.917, -3.917], ["c", 3.333, 0, 6.416, 1.334, 6.666, 4.084], ["c", 0.167, 2, -2.5, 3.916, -5.833, 3.916], ["c", -3.333, 0, -6.5, -1.333, -6.75, -4.083], ["z"], ["m", 3.75, -0.583], ["c", 0.333, 2.166, 0.917, 3.916, 2.917, 3.916], ["c", 1.416, 0, 2.416, -1.416, 2.25, -2.5], ["c", -0.334, -2.166, -1.084, -3.916, -3.084, -3.916], ["c", -1.416, -0, -2.25, 1.416, -2.083, 2.5], ["z"]],w:12.591,h:8},'x':{d:[["M", 9.624999999999986, -4.958333333333336], ["c", -0.333, 3.083, -3.417, 5, -6.25, 5], ["c", -2.5, 0, -3.833, -1.75, -3.083, -3.917], ["c", 0.916, -3, 6.25, -5.333, 8.75, -2.666], ["l", -0, -22.75], ["l", 0.583, -0], ["c", 0, 2.166, 1, 2.416, 2, 3.25], ["c", 2.417, 1.833, 8.75, 8, 5.167, 13.25], ["c", 1.333, 2.25, 1.5, 7.75, 0.166, 9.666], ["l", -0.333, -0.166], ["c", 2.25, -4.834, -0.333, -10.25, -3.25, -12.25], ["c", -1.5, -1, -3.75, -1.834, -3.75, -1.834], ["l", 0, 12.417], ["z"], ["m", 7, -8.417], ["c", 2.333, -5.25, -2.417, -9.75, -6.917, -9.916], ["c", 0.167, 1.666, 0.584, 2.083, 1.75, 3.333], ["c", 1.584, 1.667, 3.834, 4, 5.167, 6.583], ["z"]],w:17.734,h:29.333},'~':{d:[["M", 10.041666666666657, -3.875000000000014], ["c", -0.5, 0.667, -3.167, 3.417, -4.583, 3.333], ["c", -2.584, -0.083, -2.834, -2.583, -5.417, -1.583], ["c", -0.583, 0.25, -1.167, 0.75, -1.833, 0.583], ["c", 0.583, -0.75, 3.083, -3.5, 4.5, -3.416], ["c", 2.5, 0.166, 2.916, 2.583, 5.5, 1.583], ["c", 0.583, -0.25, 1.333, -0.833, 1.833, -0.5], ["z"]],w:11.833,h:4.42},'\u2211':{d:[["M", 0.04166666666666696, -7.458333333333329], ["l", 9.583, 0], ["l", 0, 4.25], ["l", -9.583, 0], ["l", 0, -4.25], ["z"]],w:9.583,h:4.25},'\u2248':{d:[["M", 4.541666666666671, 4.708333333333329], ["c", 3.25, 0, 3.25, -5.167, 4.083, -7.667], ["c", -0.75, 0.584, -2.583, 1.75, -4, 1.834], ["c", -3.083, 0.25, -3.75, -4.334, -0.5, -5.167], ["c", 2.167, -0.5, 2.75, 2, 2.417, 3.25], ["c", 1.333, -0.167, 2.333, -1.333, 2.917, -2.25], ["l", 0.416, 0.25], ["l", -5.333, 20.417], ["l", -1.167, -0], ["c", 0.834, -2, 2.584, -7.667, 3.25, -10.584], ["c", -0.75, 0.584, -2.5, 1.834, -3.916, 1.917], ["c", -3.167, 0.167, -3.834, -4.333, -0.584, -5.167], ["c", 2.167, -0.5, 2.75, 1.917, 2.417, 3.167], ["z"]],w:9.744,h:21.667},'\u2026':{d:[["M", 5.958333333333329, -7.041666666666671], ["c", 0, 4.5, 0.917, 9.75, -3.667, 9.833], ["c", -0.333, 0, -1.416, 0, -1.833, -0.666], ["c", -1.583, -2.75, 1.833, -5.5, 4.917, -4.25], ["c", 0.083, -1.667, -0, -4.584, -0, -4.584], ["l", -3.75, 1.917], ["l", -0, -0.667], ["l", 3.75, -2], ["l", -0, -9.833], ["l", 0.416, -0.083], ["c", -0.166, 1.833, 3.917, 5.166, 4.5, 7.25], ["l", 2.667, -1.417], ["c", -0, 1.417, -1.667, 1.25, -2.333, 2], ["c", 0.666, 1.333, 0.833, 6.083, -0.417, 7.75], ["l", -0.333, -0.167], ["c", 1.25, -2.25, 0.916, -4.833, 0.083, -7.25], ["z"], ["m", 0, -5], ["l", 0, 4.25], ["l", 3.75, -2], ["c", -0.75, -1.583, -2.25, -2.333, -3.75, -2.25], ["z"]],w:12.5,h:20.167},'\u0152':{d:[["M", 4.625, 0.5416666666666661], ["c", -0.083, 2.833, 2.75, 3.833, 3.167, 6], ["c", -2.167, -1, -4.584, -0.917, -4.834, 1.583], ["c", -0.083, 1.25, 2.5, 2.417, 1.167, 2.667], ["c", 0, 0, -3.417, -2.083, -3.833, -4.25], ["c", -0.5, -2.333, 2.5, -3.5, 4.75, -2.667], ["c", -2.834, -2.75, -4.417, -4.833, -4.167, -5.333], ["c", 0.583, -0.667, 2.583, -3.167, 2.583, -5.333], ["c", 0, -1.834, -3.25, -4.75, -1.666, -4.75], ["l", 5.416, 6.833], ["c", 0, 0, -2.583, 3.083, -2.583, 5.25], ["z"]],w:7.5,h:22.333},'\u0153':{d:[["M", 0.2916666666666683, 0.04166666666666652], ["c", 0.75, -2.167, 3.5, -3.75, 6, -3.75], ["c", 2.583, 0, 3.917, 1.667, 3.083, 3.833], ["c", -0.75, 2.167, -3.5, 3.917, -6, 3.917], ["c", -2.5, 0, -3.916, -1.833, -3.083, -4], ["z"]],w:9.566,h:7.75},'\u2030':{d:[["M", 4.625, -3.125], ["c", 1.417, 0, 2.083, -1.333, 2.917, -2.167], ["l", 0.416, 0.167], ["l", -3.333, 12.583], ["l", -1.167, 0], ["l", 1.667, -4.916], ["c", 1.25, -3.5, 1.583, -5.584, 1.583, -5.584], ["c", -0.75, 0.584, -2.5, 1.834, -3.916, 1.917], ["c", -3.167, 0.167, -3.834, -4.417, -0.584, -5.25], ["c", 2.167, -0.5, 2.834, 2, 2.417, 3.25], ["z"]],w:7.744,h:13.833},'\u00d3':{d:[["M", 0.041666666666666075, -3.7916666666666714], ["l", 9.5, 0], ["l", 0, 3.833], ["l", -9.5, 0], ["l", 0, -3.833], ["z"]],w:9.5,h:3.833}};


		this.printSymbol = function (x,y,symb) {
		  var pathArray = glyphs[symb].d;
		  pathArray[0][1] +=x;
		  pathArray[0][2] +=y;
		  var path = paper.path(glyphs[symb].d).attr({fill: "#000", stroke: "none"});
		  pathArray[0][1] -=x;
		  pathArray[0][2] -=y;
		  return path;//.translate(x,y);
		};

		this.getSymbolWidth = function (symbol) {
		  return glyphs[symbol].w;
		};

		this.getSymbolHeight = function (symbol) {
		  return glyphs[symbol].h;
		};

		this.getYCorr = function (symbol) {
		  switch(symbol) {
		  case "k": return 0.5;
		  case "\u2026": // gracenote
		  case "_":
		  case "\u0153": // notehead
		  case "#":
		  case "b":
		  case "n":
		  case "w": return 1;
		  default: return 0;
		  }
		}
	}
});



var getDuration = function(elem) {
	if (!elem || !elem.duration)
		return 0;
	return elem.duration / 8;	// the parser calls a 1 an eigth note.
};

var AbcSpacing = function() {};
AbcSpacing.FONTEM = 360;
AbcSpacing.FONTSIZE = 30;
AbcSpacing.STEP = AbcSpacing.FONTSIZE*93/720;
AbcSpacing.SPACE = 10;
AbcSpacing.TOPNOTE = 20;
AbcSpacing.STAVEHEIGHT = 100;

function ABCGraphElem (elem,notehead,fixedspace,propspace,bbox) {
  this.elem = elem;
  this.fixedspace = fixedspace;
  this.propspace = propspace;
  this.notehead = notehead;
  this.bbox = bbox;
}

ABCGraphElem.prototype.getSpace = function(propunit) {
  return this.fixedspace + this.propspace*propunit;
};

function ABCBeamElem () {
  this.elems = [];
  this.notes = [];
  this.total = 0;
}

ABCBeamElem.prototype.add = function(elem,note) {
  this.elems[this.elems.length] = elem;
  this.notes[this.notes.length] = note;
  this.total += note.pitch;
  if (!this.min || note.pitch<this.min) {
    this.min = note.pitch;
  }
  if (!this.max || note>this.max) {
    this.max = note.pitch;
  }
};

ABCBeamElem.prototype.average = function() {
  try {
    return this.total/this.elems.length;
  } catch (e) {
    return 0;
  }
};

ABCBeamElem.prototype.draw = function(paper,y) {
  if (this.elems.length === 0) return;
  this.drawBeam(paper,y);
  this.drawStems(paper);
};


ABCBeamElem.prototype.drawBeam = function(paper,basey) {

  var average = this.average();
  this.asc = average<6; // hardcoded 6 is B
  this.pos = Math.round(this.asc ? Math.max(average+7,this.max+5) : Math.min(average-7,this.min-5));
  var slant = this.notes[0].pitch-this.notes[this.notes.length-1].pitch;
  var maxslant = this.notes.length/2;

  if (slant>maxslant) slant = maxslant;
  if (slant<-maxslant) slant = -maxslant;
  this.starty = basey+((AbcSpacing.TOPNOTE-(this.pos+Math.round(slant/2)))*AbcSpacing.STEP);
  this.endy = basey+((AbcSpacing.TOPNOTE-(this.pos+Math.round(-slant/2)))*AbcSpacing.STEP);

  this.startx = this.elems[0].bbox.x;
  if(this.asc) this.startx+=this.elems[0].bbox.width;
  this.endx = this.elems[this.elems.length-1].bbox.x;
  if(this.asc) this.endx+=this.elems[this.elems.length-1].bbox.width;

  var dy = (this.asc)?AbcSpacing.STEP:-AbcSpacing.STEP;

  paper.path("M"+this.startx+" "+this.starty+" L"+this.endx+" "+this.endy+
	     "L"+this.endx+" "+(this.endy+dy) +" L"+this.startx+" "+(this.starty+dy)+"z").attr({fill: "#000000"});
};

ABCBeamElem.prototype.drawStems = function(paper) {
  for (var i=0,ii=this.elems.length; i<ii; i++) {
    var bbox = this.elems[i].bbox;
    var y = bbox.y + ((this.asc) ? -bbox.height/3 : bbox.height/3);
    var x = bbox.x + ((this.asc) ? bbox.width : 0);
    var dx = (this.asc) ? -0.6 : 0.6;
    var bary=this.getBarYAt(x);
    paper.path(sprintf("M %f %f L %f %f L %f %f L %f %f z", x, y, x, bary,
		       x+dx, bary, x+dx, y)).attr({stroke:"none",fill: "#000000"});

    if (getDuration(this.notes[i]) < 1/8) {

      var sy = (this.asc) ? 1.5*AbcSpacing.STEP: -1.5*AbcSpacing.STEP;


      if (!this.auxbeamx) { // TODO replace with a pile/stack of auxbeams for each depth
	this.auxbeamx = x;
	this.auxbeamy = bary+sy;
	this.auxbeamsingle = true;
      } else {
	this.auxbeamsingle = false;
      }

      if (i===ii-1 || getDuration(this.notes[i+1]) >=1/8) {

	var auxbeamendx = x;
	var auxbeamendy = bary + sy;
	var dy = (this.asc) ? AbcSpacing.STEP: -AbcSpacing.STEP;
	if (this.auxbeamsingle) {
	  auxbeamendx = (i===0) ? x+5 : x-5;
	  auxbeamendy = this.getBarYAt(auxbeamendx) + sy;
	}
	 paper.path("M"+this.auxbeamx+" "+this.auxbeamy+" L"+auxbeamendx+" "+auxbeamendy+
	     "L"+auxbeamendx+" "+(auxbeamendy+dy) +" L"+this.auxbeamx+" "+(this.auxbeamy+dy)+"z").attr({fill: "#000000"});

	this.auxbeamx = null;
	this.auxbeamy = null;
      }
    }
  }
};

ABCBeamElem.prototype.getBarYAt = function(x) {
  return this.starty + (this.endy-this.starty)/(this.endx-this.startx)*(x-this.startx);
};

//--------------------------------------------------------------------PRINTER

function ABCPrinter(paper) {
  this.x = 0;
  this.y = 0;
  this.paper = paper;
  this.space = 2*AbcSpacing.SPACE;
  this.glyphs = new AbcGlyphs(paper);
}

// assumes this.y is set appropriately
ABCPrinter.prototype.printSymbol = function(x, offset, symbol) {
  var ycorr = this.glyphs.getYCorr(symbol);
  return this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol);
};

ABCPrinter.prototype.calcY = function(ofs) {
  return this.y+((AbcSpacing.TOPNOTE-ofs)*AbcSpacing.STEP);
};

ABCPrinter.prototype.updateX = function(elem) {
  var d = elem.getSpace(this.space);
  this.x+= d;
  this.room=d-this.glyphs.getSymbolWidth("w");
}

ABCPrinter.prototype.getElem = function() {
  if (this.abcline.length <= this.pos)
    return null;
  return this.abcline[this.pos];
};

ABCPrinter.prototype.getNextElem = function() {
	if (this.abcline.length <= this.pos+1)
		return null;
    return this.abcline[this.pos+1];
};

ABCPrinter.prototype.nextElemType = function() {
  var elem = this.getElem();
  if (elem === null)
    return "spacer";

  if (elem.el_type === "note" && (getDuration(elem)>=1/4 || elem.end_beam))
    return "spacer";
  
  var nextElem = this.getNextElem();
  if (nextElem === null)
    return "spacer";
  if (nextElem.el_type === "note" &&
      getDuration(nextElem)>=1/4) {
    return "spacer";
  }
  return nextElem.el_type;
};

ABCPrinter.prototype.debugMsg = function(msg) {
	this.paper.text(this.x, this.y, msg);
}

ABCPrinter.prototype.printABC = function(abctune) {
  //this.currenttune = abctune;
  //ABCNote.duration = eval(this.currenttune.header.fields["L"]);
  this.y = 15;
  if (abctune.formatting.stretchlast) { this.paper.text(200, this.y, "Format: stretchlast"); this.y += 20; }
  if (abctune.formatting.staffwidth) { this.paper.text(200, this.y, "Format: staffwidth="+abctune.formatting.staffwidth); this.y += 20; }
  if (abctune.formatting.scale) { this.paper.text(200, this.y, "Format: scale="+abctune.formatting.scale); this.y += 20; }
  this.paper.text(300, this.y, abctune.metaText.title).attr({"font-size":20});
  this.y+=20;
  if (abctune.metaText.author)
    this.paper.text(100, this.y, abctune.metaText.author);
  this.y+=15;
  if (abctune.metaText.origin)
    this.paper.text(100, this.y, "(" + abctune.metaText.origin + ")");
  if (abctune.metaText.tempo)
    this.paper.text(100, this.y+20, "Tempo: " + abctune.metaText.tempo.duration + '=' + abctune.metaText.tempo.bpm);

  for(var line=0; line<abctune.lines.length; line++) {
    var abcline = abctune.lines[line];
    if (abcline.staff) {
      this.printABCLine(abcline);
      this.y+=AbcSpacing.STAVEHEIGHT;
    } else if (abcline.subtitle) {
      this.printSubtitleLine(abcline);
      this.y+=20; //hardcoded
    }
  }
  var extraText = "";	// TODO-PER: This is just an easy way to display this info for now.
  if (abctune.metaText.notes) extraText += "Notes:\n" + abctune.metaText.notes;
  if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book;
  if (abctune.metaText.copyright) extraText += "Copyright: " + abctune.metaText.copyright;
  if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription;
  if (abctune.metaText.rhythm) extraText += "Rhythm: " + abctune.metaText.rhythm;
  if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography;
  if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history;
  if (abctune.metaText.unalignedWords) extraText += "Words:\n" + abctune.metaText.unalignedWords;
  this.paper.text(100, this.y, extraText);
};

ABCPrinter.prototype.printSubtitleLine = function(abcline) {
  this.paper.text(100, this.y, abcline.subtitle);
}

ABCPrinter.prototype.printABCLine = function(abcline) {
  this.x=0;
  this.room = 0;
  this.abcline = abcline.staff;
  var elem;
  var start = (this.partstartx) ? true : false;
  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var type = this.getElem().el_type;
    this.partstartx && start && type!="key" && type!="meter" && type!="clef" && (this.partstartx=this.x) && (start=false);
    elem = this.printABCElement();
    if (elem) {
      this.updateX(elem);
    }
  }
  if (this.abcline[this.abcline.length-1].el_type=== "bar") {this.x-=elem.getSpace(this.space);}
  this.printStave(this.x-1); // don't use the last pixel over the barline
  if (this.partstartx) {
    this.paper.path(sprintf("M %f %f L %f %f",
			    this.x, this.y, this.partstartx, this.y)).attr({stroke:"#000000"});
  }
};


// return array: [absolute width, relative spacing after]
// or maybe return element, and relative spacing after, so that the element can later be translated
ABCPrinter.prototype.printABCElement = function() {
  var graphelem = null;
  var elem = this.getElem();
  switch (elem.el_type) {
  case "note":
    graphelem = this.printBeam();
    break;
  case "bar":
    graphelem = this.printBarLine(elem);
    break;
  case "meter":
	this.printTimeSignature(elem);
    break;
  case "clef":
    break;
  case "key":
    this.printKeySignature(elem);
    break;
  case "rest":
    graphelem = this.printRest(elem);
    break;
  }

  return graphelem;
};

ABCPrinter.prototype.printBeam = function() {
  var graphelem = null;
  if (this.nextElemType() === 'note') {
    var beamelem = new ABCBeamElem();

    for (;;) {
      graphelem = this.printNote(this.getElem(),1);
      beamelem.add(graphelem,this.getElem());
      if (this.getElem().end_beam !== undefined || this.nextElemType()!=="note") {
		break;
      }
      this.pos++;
      this.updateX(graphelem);
    }
    beamelem.draw(this.paper,this.y);
  } else {
    graphelem = this.printNote(this.getElem());
  }
  return graphelem;
};

ABCPrinter.prototype.printRest = function(elem) {
  elem.pitch=7;
  return this.printNote(elem);
}

ABCPrinter.prototype.printNote = function(elem, stem) { //stem dir, null if normal stem
  var elemset = this.paper.set();
  var notehead = null;
  var roomtaken = 0; // room needed to the left of the note
  
  if (elem.chord !== undefined)
    this.paper.text(this.x, this.y+15 + (elem.chord.position === 'below' ? 65 : 0), elem.chord.name);

  if (elem.accidental !== undefined && elem.accidental !== 'none') {
    var symb; 
    switch (elem.accidental) {
    case "dbl_sharp":
    case "sharp":
      symb = "#";
      break;
    case "flat":
    case "dbl_flat":
      symb = "b";
      break;
    case "natural":
      symb = "n";
    }
    var acc = this.printSymbol(this.x, elem.pitch, symb); // 1 is hardcoded
    roomtaken += (this.glyphs.getSymbolWidth(symb)+2)
    acc.translate(-roomtaken,0); // hardcoded
    elemset.push(acc);
  }

  if (elem.lyric !== undefined) {
    this.debugMsg(elem.lyric.syllable + "  " + elem.lyric.divider);
  }

  var chartable = {up:{0:"w", 1:"h", 2:"q", 3:"e", 4: "x"},
		   down:{0:"w", 1:"H", 2:"Q", 3:"E", 4: "X"},
		   rest:{0:"\u2211", 1:"\u00d3", 2:"\u0152", 3:"\u2030", 4: "\u2248"}};

  
  var dur=getDuration(elem);
  var durlog = Math.floor(Math.log(dur)/Math.log(2));
  var dot = (Math.pow(2,durlog)!==dur);
  var c = "";
  if (!stem) {
    var dir = (elem.pitch>=6) ? "down": "up";
    (elem.el_type==="rest") && (dir="rest");
    c = chartable[dir][-durlog];
  } else {
    c="\u0153"; // 1 is hardcoded
  }
  
  if (c === undefined)
	  this.debugMsg("chartable["+ dir + "][" + (-durlog) + '] is undefined');
  else {

	  notehead = this.printSymbol(this.x, elem.pitch, c);

	  elemset.push(notehead);
	  

	  if (dot) {
		var dotadjust = (1-elem.pitch%2);
		elemset.push(this.glyphs.printSymbol(this.x+12, 1+this.calcY(elem.pitch+2-1+dotadjust), ".")); // 12 and 1 is hardcoded. some weird bug with dot y-pos ??!
	  }
  }

  
  for (var i=elem.gracenotes.length-1; i>=0; i--) {
    var grace = this.printSymbol(this.x, elem.gracenotes[i].pitch, "\u2026");
    roomtaken +=8;
    grace.translate(-roomtaken,0); // hardcoded
    elemset.push(grace);
  }

  if (elem.decoration) {
    var dec;
    var unknowndecs = [];
    var yslot = (elem.pitch>9) ? elem.pitch+4 : 13;
    for (var i=0;i<elem.decoration.length; i++) {
      var above = true;
      switch(elem.decoration[i]) {
      case "trill":dec="T";break;
      case "staccato":dec="k"; above=false; break;
      default:
	unknowndecs[unknowndecs.length]=elem.decoration[i];
	continue;
      }
      var ypos;
      if (above) {
	ypos=yslot;
	yslot+=1;
      } else {
	ypos = (elem.pitch>=6) ? elem.pitch+1+(1-elem.pitch%2):elem.pitch-1-(1-elem.pitch%2);
      }
      var deltax = (this.glyphs.getSymbolWidth("\u0153")-this.glyphs.getSymbolWidth(dec))/2;
      elemset.push(this.printSymbol(this.x+deltax, ypos, dec));
      
    }
    (unknowndecs.length>0) && this.debugMsg(unknowndecs.join(','));
  }

  // ledger lines
  for (i=elem.pitch; i>11; i--) {
    if (i%2===0) {
      elemset.push(this.printSymbol(this.x-1, i, "_"));
    }
  }

  for (i=elem.pitch; i<1; i++) {
    if (i%2===0) {
      elemset.push(this.printSymbol(this.x-1, i, "_"));
    }
  }

  var extraroom = roomtaken-this.room;

  if (extraroom>0) {
    elemset.translate(extraroom,0);
    this.x+=extraroom;
  }

  var bbox = {"x":this.x, "y":this.calcY(elem.pitch+this.glyphs.getYCorr(c)), "width": this.glyphs.getSymbolWidth(c), height: this.glyphs.getSymbolHeight(c,notehead)};

  return new ABCGraphElem(elemset, notehead,0,Math.sqrt(getDuration(elem)*8),bbox);
};

ABCPrinter.prototype.printBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var elemset = this.paper.set();
  var symb; // symbol which sets the spacing
  var symbscale = 1; //width of that symbol

  var firstdots = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var firstthin = (elem.type!="bar_left_repeat" && elem.type!="bar_thick_thin");
  var thick = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_left_repeat" ||
	       elem.type==="bar_thin_thick" || elem.type==="bar_thick_thin");
  var secondthin = (elem.type==="bar_left_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thin");
  var seconddots = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat");

  if (firstdots) {
    elemset.push(this.glyphs.printSymbol(this.x, 1+this.calcY(7+1), "."));
    elemset.push(this.glyphs.printSymbol(this.x, 1+this.calcY(5+1), "."));
    this.x+=5; //2 hardcoded, twice;
  }

  if (firstthin) {
    symb = this.printSymbol(this.x, 3, "\\"); // 3 is hardcoded
    symbscale = 1;
  }


  if (thick) { // also means end of nth part
    this.x+=3; //3 hardcoded;
    
    if (this.partstartx) {
      this.paper.path(sprintf("M %f %f L %f %f L %f %f", 
			      this.x, this.y+10, this.x, this.y, this.partstartx, this.y)).attr({stroke:"#000000"});
      this.partstartx = null;
    }     
    symb = this.printSymbol(this.x, 3, "\\"); // 3 is hardcoded
    symb.scale(10,1,this.x);
    symbscale = 10;
    elemset.push(symb);
    this.x+=6;
  }
  
  if (this.partstartx && (elem.type==="bar_thin_thin")) { // means end of nth part but at different place
    this.paper.path(sprintf("M %f %f L %f %f L %f %f", 
			      this.x, this.y+10, this.x, this.y, this.partstartx, this.y)).attr({stroke:"#000000"});
    this.partstartx = null;
  }


  if (secondthin) {
    this.x+=3; //3 hardcoded;
    symb = this.printSymbol(this.x, 3, "\\"); // 3 is hardcoded
    symbscale = 1;
    elemset.push(symb);
  }

  if (seconddots) {
    this.x+=2; //3 hardcoded;
    elemset.push(this.glyphs.printSymbol(this.x, 1+this.calcY(7+1), "."));
    elemset.push(this.glyphs.printSymbol(this.x, 1+this.calcY(5+1), "."));
  } // 2 is hardcoded

  if (elem.number) {
    this.partstartx = this.x;
    this.paper.path(sprintf("M %f %f L %f %f", 
			    this.x, this.y, this.x, this.y+10)).attr({stroke:"#000000"});
    this.paper.text(this.x+5,this.y+7,elem.number);
  } 

  return new ABCGraphElem(elemset, null, this.glyphs.getSymbolWidth("\\")*symbscale, 0.5);	

};

ABCPrinter.prototype.printStave = function (width) {
  var staff = this.printSymbol(0, 3, "="); // 3 is hardcoded
  width = width/(this.glyphs.getSymbolWidth("="));
  staff.scale(width,1,0);
};

ABCPrinter.prototype.printKeySignature = function(elem) {
  var clef = this.printSymbol(this.x, 5, "&"); //5 is hardcoded
  this.x += this.glyphs.getSymbolWidth("&")+10; // hardcoded
  var FLATS = [6,9,5,8,4,7];
  var SHARPS = [10,7,11,8,5,9];
  var accidentals = (elem.acc !== "sharp") ? FLATS : SHARPS;
  var number = elem.num;
  var symbol = (elem.acc !== "sharp") ? "b" : "#";
  for (var i=0; i<number; i++) {
    var path = this.printSymbol(this.x, accidentals[i], symbol);
    this.x += this.glyphs.getSymbolWidth(symbol);
  }
  this.x += 10; // hardcoded
};

ABCPrinter.prototype.printTimeSignature= function(elem) {
  //var timesig = this.currenttune.header.fields["M"];
  //var parts=timesig.match(/([\d]+)\/([\d]+)/);
  var graphelem;
  if (elem.type === "specified") {
    //TODO make the alignment for time signatures centered
    graphelem = this.paper.set();
    graphelem.push(this.printSymbol(this.x, 9, elem.num)); //7 is hardcoded
    graphelem.push(this.printSymbol(this.x, 5, elem.den)); //3 is hardcoded
  } else if (elem.type === "common_time") {
    graphelem = this.printSymbol(this.x, 7, "c"); //5 is hardcoded

  } else if (elem.type === "cut_time") {
    graphelem = this.glyphs.printSymbol(this.x, 7, "C"); //5 is hardcoded
  }
  this.x += graphelem.getBBox().width; // no caching
  this.x += AbcSpacing.SPACE;
};

