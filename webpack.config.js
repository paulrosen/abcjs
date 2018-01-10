const path = require("path");
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");

const pJson = require('./package.json');
const version = pJson.version;

module.exports = (env) => {
	const outputFilename = `abcjs_${env.type}_${version}-min.js`;
	const banner1 = `abcjs_${env.type} v${version} Copyright © 2009-2018 Paul Rosen and Gregory Dyke (http://abcjs.net) */`;
	const banner2 = `/*! midi.js Copyright © Michael Deal (http://mudcu.be) */`;
	const banner3 = `/*! For license information please see ${outputFilename}.LICENSE`;
	const hasMidi = env.type === 'midi';
	const banner = hasMidi ? `${banner1}\n${banner2}\n${banner3}` : `${banner1}\n${banner3}`;

	return {
		entry: `./static-wrappers/${env.type}.js`,
		output: {
			filename: outputFilename,
			path: path.join(__dirname, "bin")
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: "babel-loader"
				}
			]
		},
		plugins: [
			new UglifyJsWebpackPlugin({
				extractComments: {
					condition: /\!$/,
					banner: banner
				}
			})
		]
	};
};
