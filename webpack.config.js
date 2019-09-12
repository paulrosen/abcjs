const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const path = require("path");
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");

const pJson = require('./package.json');
const version = pJson.version;

module.exports = ({mode, presets, type} = {mode: "production", presets: []}) => {
	const outputFilename = `abcjs_${type}_${version}-min.js`;
	const banner1 = `abcjs_${type} v${version} Copyright © 2009-2019 Paul Rosen and Gregory Dyke (https://abcjs.net) */`;
	const banner2 = `/*! midi.js Copyright © Michael Deal (http://mudcu.be) */`;
	const banner3 = `/*! For license information please see ${outputFilename}.LICENSE`;
	const hasMidi = type === 'midi';
	const banner = hasMidi ? `${banner1}\n${banner2}\n${banner3}` : `${banner1}\n${banner3}`;

	return webpackMerge(
		{
			entry: `./static-wrappers/${type}.js`,
			mode,
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: "babel-loader"
					}
				]
			},
			output: {
				filename: outputFilename,
				path: path.join(__dirname, "bin")
			},
			plugins: [
				new UglifyJsWebpackPlugin({
					extractComments: {
						condition: /\!$/,
						banner: banner
					}
				})
			]
		},
		modeConfig(mode),
		presetConfig({mode, presets})
	);
};
