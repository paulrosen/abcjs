var browserify = require('browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

const DEFAULT_ENTRY = 'index.js';
const DEFAULT_OUTPUT = 'abcjs.js';

const PLUGIN_ENTRY = 'index-plugin.js';
const PLUGIN_OUTPUT = 'abcjs-plugin.js';

var defaultBrowserifyOptions = {
  cache: {},
  packageCache: {},
  standalone: 'ABCJS',
  debug: true
};

var defaultBrowserify = browserify(DEFAULT_ENTRY, defaultBrowserifyOptions);
var pluginBrowserify = browserify(PLUGIN_ENTRY, defaultBrowserifyOptions);

function bundle(browserify, fileName) {
  return browserify.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'));
}

function minify(b) {
  return b.pipe(rename({ extname: '-min.js' }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('js', function () {
  return minify(bundle(defaultBrowserify, DEFAULT_OUTPUT));
});

gulp.task('js:plugin', function () {
  return minify(bundle(pluginBrowserify, PLUGIN_OUTPUT));
});

gulp.task('watch', function () {
  var watcher = watchify(defaultBrowserify)
    .on('update', function () {
        return bundle(watcher, DEFAULT_OUTPUT);
    });

  return bundle(watcher, DEFAULT_OUTPUT);
});

gulp.task('serve', ['watch'], function () {
  browserSync({
    server: {
      baseDir: '.',
      directory: true
    }
  });

  gulp.watch(['./dist/*.js'], browserSync.reload);
});

gulp.task('default', ['js', 'js:plugin']);
