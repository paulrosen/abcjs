const path = require("path");

module.exports = ({type}) => ({
	devtool: "source-map",
	output: {
		filename: `abcjs_${type}_${getVersion()}.js`,
		path: path.join(__dirname, "../bin")
	},
});

function getVersion() {
	const pJson = require('../package.json');
	return pJson.version;
}
