describe("Synth", function() {
	var abcThatsAPlenty =
	'T:That\'s A Plenty\n' +
	'M:4/4\n' +
	'L:1/8\n' +
	'Q:1/4=220\n' +
	'K:Dm\n' +
	'P:A\n' +
	'"Dm"d2^c2d2c2|d2^cd- dc =c=B|"Gm"_B2A2B2A2|B2AB- BA GF|\n' +
	'"A7"E2BA-A4|E2BA-A4|1"Dm"D^C DE FE D^D|"A7"E^D EA-A4:|2A^G AB A=G FE|"Dm"D8y||\n';

	//////////////////////////////////////////////////////////


	it("drum-intro", function() {
		this.timeout(5000);
		const tune = abcjs.renderAbc("paper", abcThatsAPlenty, {
			add_classes: true,
//			visualTranspose: currentTransposition,
//			responsive: "resize",
			paddingtop: 0,
			paddingbottom: 0,
			paddingright: 0,
			paddingleft: 0,
			format: {
				vocalfont: "Helvetica 14",
			}
		});
		const meter = tune[0].getMeter();
		const synthController = new abcjs.synth.SynthController();
		synthController.load("#midi", self.cursorControl, {
			displayLoop: true,
			displayRestart: true,
			displayPlay: true,
			displayProgress: true,
			displayWarp: true
		});
		synthController.setTune(tune[0], false, {
			// qpm: tempo,
			// midiTranspose: currentTransposition,
			drum: getDrumString(meter),
			drumIntro: 2,
			voicesOff: false,
			chordsOff: false,
		});
		return synthController.play().then(function (response){
			return sleep(4000).then(function () {
				synthController.pause();
			});
		});
	})
})

function getDrumString(meter) {
	let num;
	let den;
	switch (meter.type) {
		case "common_time": num = 4; den = 4; break;
		case "cut_time": num = 2; den = 2; break;
		default:
			num = meter.value[0].num;
			den = meter.value[0].den;
	}
	let drum = "";
	switch (num+"/"+den) {
		case "2/2":
			drum = "dd 76 77 60 30";
			break;
		case "2/4":
			drum = "dd 76 77 60 30";
			break;
		case "3/4":
			drum = "ddd 76 77 77 60 30 30";
			break;
		case "4/4":
			drum = "dddd 76 77 77 77 60 30 30 30";
			break;
		case "5/4":
			drum = "ddddd 76 77 77 76 77 60 30 30 60 30";
			break;
		case "6/8":
			drum = "dd 76 77 60 30";
			break;
		case "9/8":
			drum = "ddd 76 77 77 60 30 30";
			break;
	}
	return drum;
}

function sleep(ms) {
	return new Promise(function (resolve) {
		setTimeout(resolve, ms);
	});
}
