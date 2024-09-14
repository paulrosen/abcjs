const pkg = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = (env = {} , argv) => {
  const defaults = (argv, type) => {
    const config = {
      target: ['web', 'es5'],
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
          }
        ],
      },
      mode: 'production',
      optimization:{
        minimizer: [
          new TerserPlugin({
            extractComments: {
              filename: '[file].LICENSE',
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
      entry: `./index.js`,
      ...defaults(argv, 'basic')
    }, {
      name: 'plugin',
      entry: `./plugin.js`,
      ...defaults(argv, 'plugin')
    }
  ]
};

function makeBanner(type) {
  let banner = `abcjs_${type} v${pkg.version} Copyright © 2009-2024 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n`
  return banner + `/*! For license information please see abcjs_${type}.LICENSE`;
}
