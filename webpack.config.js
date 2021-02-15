const pkg = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = (env = {} , argv) => {
  const defaults = (argv, type) => {
    const config = {
      output: {
        library: {
          amd: 'abcjs',
          root: 'ABCJS',
          commonjs: 'abcjs'
        },
        libraryTarget: 'umd',
        globalObject: 'this',
        filename: argv.mode === 'development' ? `abcjs-${type}.js` : `abcjs-${type}-min.js`,
      },
      devtool: argv.mode === 'development' ? 'source-map' : false,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: "babel-loader"
          }, {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
          }
        ],
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
        new WebpackBundleAnalyzer()
      ]
    }
    return config
  }

  return [
    {
      name: 'basic',
      entry: `./index.js`,
      ...defaults(argv, 'basic')
    }, {
      name: 'plugin',
      entry: `./static-wrappers/plugin.js`,
      ...defaults(argv, 'plugin')
    }, {
      name: 'midi',
      entry: `./midi.js`,
      ...defaults(argv, 'midi')
    }
  ]
};

function makeBanner(type) {
  const outputFilename = `abcjs_${type}-min.js`;
  const banner1 = `abcjs_${type} v${pkg.version} Copyright © 2009-2021 Paul Rosen and Gregory Dyke (https://abcjs.net) */`;
  const banner2 = `/*! midi.js Copyright © Michael Deal (http://mudcu.be) */`;
  const banner3 = `/*! For license information please see ${outputFilename}.LICENSE`;
  const hasMidi = type === 'midi';
  return hasMidi ? `${banner1}\n${banner2}\n${banner3}` : `${banner1}\n${banner3}`;
}
