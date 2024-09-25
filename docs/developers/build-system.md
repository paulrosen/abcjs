# Build System

There are a few targets for the library and the build system is different for each.

## Hybrid System

Currently, some of the files are typescript and some are javascript. The javascript files are commonJS format. This causes some complications in the output.

To get all the variations to work there are compromises. 

## Node

To build for node, the `dist` folder contains the built files. They are `index.js` and all the files in the `dist/src` folder under that.

A complete build is done with 
```bash
npm run build:node
```

That cleans out old files, copies the javascript files, and compiles the typescript files.

The files that are bundled in the release are controlled by the `.npmignore` file. Some of the files in `dist` are checked in and some are only delivered later.

## Debugging

You can automatically compile the typescript files by starting:
```bash
npm run dev
```
That will watch for changes.

Unfortunately, it doesn't watch for javascript file changes. You'll have to copy them over yourself.

The node version is the version that is used by the automated tests.

## Script tag

To build for the script tag, rollup is used. That creates the files `dist/abcjs-basic-min.js` and `dist/abcjs-plugin-min.js`.

In addition, a special output is created for Eskin's dev process. It is `dist/abcjs-basic.js` which is the unminimized version.

## Support Files

`rollup.config.mjs` and `tsconfig-rollup.json` are used for the script tag outputs.

`tsconfig.json` is used for the node build.

## Test Systems

To be sure that the build works, the following need to be tested:

* `abcjs-basic-min.js` in a script tag
* `abcjs-plugin-min.js` in a script tag
* `import abcjs from "abcjs"` in a javascript system
* `import abcjs from "abcjs"` in a typescript system
* `import abcjs from "abcjs/dist/test"` in a typescript system

## Future plans

When all the files are converted to typescript, this build system should be revisited. In particular, there are settings in `tsconfig.json` that can be experimented with.

Also, it is unclear whether `.babelrc` is still used.
