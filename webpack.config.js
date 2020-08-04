const {merge} = require("webpack-merge");
const modeConfig = env => require(`./build-utils/webpack.${env.mode}`)(env);
const presetConfig = require("./build-utils/loadPresets");

module.exports = ({mode, presets, type} = {mode: "production", presets: []}) => {
	return merge(
		{
			entry: `./static-wrappers/${type}.js`,
			output: {
				library: {
					amd: 'abcjs',
					root: 'ABCJS',
					commonjs: 'abcjs'
				},
				libraryTarget: 'umd',
				globalObject: 'this'
			},
			mode,
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
			plugins: [
			]
		},
		modeConfig({mode, type}),
		presetConfig({mode, presets, type})
	);
};
