import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser';
import pkg from "./package.json";

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
			{
				file: 'dist/abcjs-basic-node.js',
				format: 'es',
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
				extractComments: {
					filename: '[file].LICENSE',
					condition: /^\*\**!/i,
					banner: makeBanner(type)
				},
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
			sourcemap: true,
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
			terser(),
		]
	},
]

function makeBanner(type) {
	let banner = `abcjs_${type} v${pkg.version} Copyright © 2009-2024 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n`
	return banner + `/*! For license information please see abcjs_${type}.LICENSE`;
}
