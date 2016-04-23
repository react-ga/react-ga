var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');
var del = require('del');
var browserify = require('browserify');
var shim = require('browserify-shim');

var DEST = 'dist/';
var SRC = 'src/**/*.js';
var TEST = 'test/**/*.js';
var PKG = 'react-ga';

var LINT_DIRS = [
  SRC,
  TEST
];

var TEST_TASKS = [
  'jscs'
];

var BUILD_TASKS = [
  'jscs',
  'clean',
  'package'
];

gulp.task('jscs', function () {
  return gulp.src(LINT_DIRS)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('clean', function () {
  return del([DEST]);
});

gulp.task('package', function () {
    return browserify('./src/index.js', {
              standalone: 'ReactGA'
            })
            .transform(shim)
            .bundle()
            .pipe(source(PKG + '.js'))
            .pipe(gulp.dest(DEST))
            .pipe(rename(PKG + '.min.js'))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest(DEST));
});

gulp.task('test', TEST_TASKS);
gulp.task('build', BUILD_TASKS);
