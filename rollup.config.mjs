import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser';
import version from "./src/version.js";

export default [
	{
		// create regular minimized file
		input: 'index.js',
		output: [
			{
				file: 'dist/abcjs-basic-min.js',
				format: 'iife',
				name: 'ABCJS',
				sourcemap: true,
			},
		],
		plugins: [
			resolve(),
			commonjs({
				include: ['*.js', 'src/**/*.js'],
			}),
			typescript({ tsconfig: './tsconfig.json' }),
			terser({
				format: {
					preamble: makeBanner('basic')
				}
			}),
		]
	},
	{
		// create non-minimized file
		input: 'index.js',
		output: {
			file: 'dist/abcjs-basic.js',
			format: 'iife',
			name: 'ABCJS',
			sourcemap: false,
		},
		plugins: [
			resolve(),
			commonjs({
				include: ['*.js', 'src/**/*.js'],
			}),
			typescript({ tsconfig: './tsconfig.json' }),
		]
	},
	{
		// create minimized plugin file
		input: 'plugin.js',
		output: {
			file: 'dist/abcjs-plugin-min.js',
			format: 'iife',
			name: 'ABCJS',
			sourcemap: true,
		},
		plugins: [
			resolve(),
			commonjs({
				include: ['*.js', 'src/**/*.js'],
			}),
			typescript({ tsconfig: './tsconfig.json' }),
			terser({
				format: {
					preamble: makeBanner('plugin')
				}
			}),
		]
	},
]

function makeBanner(type) {
	let banner = `// abcjs_${type} v${version} Copyright © 2009-2024 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n`
	return banner + `// For license information please see LICENSE.md\n`;
}
