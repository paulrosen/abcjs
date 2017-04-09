var browserify = require('browserify');
var browserifyIstanbul = require('browserify-istanbul');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var minimist = require('minimist');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');


var knownOptions = {
  string: 'env',
  default: { env: 'development' }
};

var options = minimist(process.argv.slice(2), knownOptions);

const DEFAULT_DIST = options.env === 'development' ? 'build': 'dist';

const DEFAULT_ENTRY = 'src/index.js';
const DEFAULT_OUTPUT = 'abc.js';

const PLUGIN_ENTRY = 'src/index-plugin.js';
const PLUGIN_OUTPUT = 'abc-plugin.js';

const TEST_ENTRY = 'test/spec/index.js';
const TEST_OUTPUT = 'abc-test.js';

var defaultBrowserifyOptions = {
  cache: {},
  packageCache: {},
  standalone: 'ABCJS',
  debug: true
};

// MIDI.js will try to require these modules :
var defaultExternals = ['canvas', 'nw.gui'];

var defaultBrowserify = browserify(DEFAULT_ENTRY, defaultBrowserifyOptions)
  .external(defaultExternals);

var pluginBrowserify = browserify(PLUGIN_ENTRY, defaultBrowserifyOptions)
  .external(defaultExternals);

var testBrowserify = browserify(TEST_ENTRY, defaultBrowserifyOptions)
  .external(defaultExternals);

function bundle(browserify, fileName) {
  return browserify.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(gulp.dest(DEFAULT_DIST));
}

function minify(b) {
  return b.pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEFAULT_DIST));
}

gulp.task('js', ['clean'], function () {
  return minify(bundle(defaultBrowserify, DEFAULT_OUTPUT));
});

gulp.task('js:plugin', ['clean'], function () {
  return minify(bundle(pluginBrowserify, PLUGIN_OUTPUT));
});

gulp.task('js:test', ['clean'], function () {
  return bundle(testBrowserify, TEST_OUTPUT);
});

gulp.task('js:coverage', ['clean'], function () {
  return bundle(
    testBrowserify.transform(browserifyIstanbul),
    TEST_OUTPUT);
});

gulp.task('watch', function () {
  var watcher = watchify(defaultBrowserify)
    .on('update', function () {
        return bundle(watcher, DEFAULT_OUTPUT);
    });

  return bundle(watcher, DEFAULT_OUTPUT);
});

gulp.task('watch:test', function () {
  var watcher = watchify(testBrowserify)
    .on('update', function () {
        return bundle(watcher, TEST_OUTPUT);
    });

  return bundle(watcher, TEST_OUTPUT);
});

gulp.task('serve', ['watch'], function () {
  browserSync({
    server: {
      baseDir: '.',
      directory: true
    }
  });

  gulp.watch(['./build/*.js'], browserSync.reload);
});

gulp.task('serve:test', ['watch:test'], function () {
  browserSync({
    startPath: 'test/index.html',
    server: {
      baseDir: '.',
      directory: true
    }
  });

  gulp.watch(['./build/*.js'], browserSync.reload);
});

gulp.task('test', ['js:test'], function () {
  return gulp
    .src('test/index.html')
    .pipe(mochaPhantomJS({
      phantomjs: {
        useColors: true
      }
    }));
});

gulp.task('coverage', ['js:coverage'], function () {
  return gulp
    .src('test/index.html')
    .pipe(mochaPhantomJS({
      reporter: 'dot',
      phantomjs: {
        hooks: 'mocha-phantomjs-istanbul',
        useColors: true
      }
    }));
});

gulp.task('clean', function () {
  return del([
    DEFAULT_DIST,
    'coverage'
  ]);
});

gulp.task('default', ['js', 'js:plugin']);
