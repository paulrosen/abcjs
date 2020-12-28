const path = require("path");

module.exports = ({type}) => ({
	mode: 'development',
	devtool: "source-map",
	output: {
		filename: `abcjs-${type}.js`,
		path: path.join(__dirname, "../dist")
	},
});

function getVersion() {
	const pJson = require('../package.json');
	return pJson.version;
}
