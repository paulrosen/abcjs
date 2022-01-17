const pkg = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;

module.exports = (env = {} , argv) => {
	const defaults = (argv, type, entry) => {
		const config = {
			output: {
				library: {
					amd: entry,
					root: entry.toUpperCase(),
					commonjs: entry
				},
				libraryTarget: 'umd',
				globalObject: 'this',
				filename: `abcjs-${type}-min.js`,
			},
			devtool: 'source-map',
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: [
							{
								loader: "babel-loader",
								options: {
									sourceType: 'unambiguous',
									cacheDirectory: (argv.mode === 'development'),
									presets: [
										[
											'@babel/preset-env',
											{
												debug: false, // outputs the needed polyfills
												//corejs: '3.9',
												useBuiltIns: false, // usage means to add polyfills as they are needed; false means to not add them.
												targets: {
													"chrome": "43",
													"firefox": "40",
													"safari": "9.1",
													"edge": "13"
												}
											}
										]
									]
								}
							},
						]
					},
					{
						test: /\.ts$/,
						exclude: /node_modules/,
						use: [
							'ts-loader',
						],
					}
				],
			},
			resolve: {
				extensions: ['.ts', '.js'],
			},
			mode: 'production',
			optimization:{
				minimizer: [
					new TerserPlugin({
						extractComments: {
							condition: /^\*\**!/i,
							banner: makeBanner(type)
						},
					}),
				],
			}
		}

		if (env.analyze) {
			config.plugins = [
				new WebpackBundleAnalyzer({
					analyzerMode: "static"
				})
			]
		}
		return config
	}

	return [
		{
			name: 'basic',
			entry: `./index.ts`,
			...defaults(argv, 'basic', 'abcjs')
		}, {
			name: 'plugin',
			entry: `./plugin.js`,
			...defaults(argv, 'plugin', 'abcjs')
		}, {
			name: 'test',
			entry: `./test.js`,
			...defaults(argv, 'test', 'abcjs')
		}, {
			name: 'synth',
			entry: `./synth.ts`,
			...defaults(argv, 'synth', 'synth')
		}
	]
};

function makeBanner(type) {
	let banner = `abcjs_${type} v${pkg.version} Copyright © 2009-2022 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n`
	return banner + `/*! For license information please see abcjs_${type}.LICENSE`;
}
