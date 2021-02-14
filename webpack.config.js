const pkg = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;

module.exports = (env, argv) => {
	const config = {
		basic: {
			name: 'basic',
			entry: `./static-wrappers/basic.js`,
			output: {
				filename: argv.mode === 'production' ? 'abcjs-basic-min.js' : `abcjs-basic.js`,
			},
		},
		plugin: {
			name: 'plugin',
			entry: `./static-wrappers/plugin.js`,
			output: {
				filename: argv.mode === 'production' ? 'abcjs-plugin-min.js' : `abcjs-plugin.js`,
			},
		},
		midi: {
			name: 'midi',
			entry: `./static-wrappers/midi.js`,
			output: {
				filename: argv.mode === 'production' ? 'abcjs-midi-min.js' : `abcjs-midi.js`,
			},
		}
	}

	const defaults = (argv, type) => {
		return {
			output: {
				library: {
					amd: 'abcjs',
					root: 'ABCJS',
					commonjs: 'abcjs'
				},
				libraryTarget: 'umd',
				globalObject: 'this'
			},
			devtool: argv.mode === 'production' ? false : 'source-map',
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: "babel-loader"
					},
					{
						test: /\.svg$/,
						loader: 'svg-inline-loader'
					}
				]
			},
			optimization:{
				minimizer: [
					new TerserPlugin({
						extractComments: {
							condition: /^\**!/,
							banner: makeBanner(type),
						},
					}),
				],
			}
		}
	}

	if (env.analyze) {
		defaults.plugins = [
			new WebpackBundleAnalyzer()
		]
	}

	return [
		{...defaults(argv, 'basic'), ...config.basic},
		{...defaults(argv, 'plugin'), ...config.plugin},
		{...defaults(argv, 'midi'), ...config.midi},
	];
};

function makeBanner(type) {
	const outputFilename = `abcjs_${type}-min.js`;
	const banner1 = `abcjs_${type} v${pkg.version} Copyright © 2009-2021 Paul Rosen and Gregory Dyke (https://abcjs.net) */`;
	const banner2 = `/*! midi.js Copyright © Michael Deal (http://mudcu.be) */`;
	const banner3 = `/*! For license information please see ${outputFilename}.LICENSE`;
	const hasMidi = type === 'midi';
	return hasMidi ? `${banner1}\n${banner2}\n${banner3}` : `${banner1}\n${banner3}`;
}
