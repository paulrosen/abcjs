//import { version } from "./package.json" assert { type: "json" };
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin as WebpackBundleAnalyzer } from "webpack-bundle-analyzer";

export default (env = {}, argv) => {
  const defaults = (argv, type) => {
    const config = {
      target: ["web", "es5"],
      output: {
        library: {
          amd: "abcjs",
          root: "ABCJS",
          commonjs: "abcjs",
        },
        libraryTarget: "umd",
        globalObject: "this",
        filename:
          argv.mode === "development"
            ? `abcjs-${type}.js`
            : `abcjs-${type}-min.js`,
      },
      devtool: argv.mode === "development" ? "source-map" : false,
      resolve: {
          extensions: ['.ts', '.js', '.json']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "babel-loader",
          },
        ],
      },
      mode: "production",
      optimization: {
        minimizer: [
          new TerserPlugin({
            extractComments: {
              filename: "[file].LICENSE",
              condition: /^\*\**!/i,
              banner: makeBanner(type),
            },
          }),
        ],
      },
    };

    if (env.analyze) {
      config.plugins = [
        new WebpackBundleAnalyzer({
          analyzerMode: "static",
        }),
        ,
      ];
    }
    return config;
  };

  return [
    {
      name: "basic",
      entry: `./index.ts`,
      ...defaults(argv, "basic"),
    },
    {
      name: "plugin",
      entry: `./plugin.ts`,
      ...defaults(argv, "plugin"),
    },
  ];
};

function makeBanner(type) {
  let banner = `abcjs_${type} v${"2"} Copyright © 2009-2022 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n`;
  return (
    banner + `/*! For license information please see abcjs_${type}.LICENSE`
  );
}
