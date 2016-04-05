var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');

var DEST = 'dist/';

var LINT_DIRS = [
  'src/**/*.js',
  'test/**/*.js'
];

var TEST_TASKS = [
  'jscs'
];

var BUILD_TASKS = [
  'jscs',
  'package'
];

gulp.task('jscs', function () {
  return gulp.src(LINT_DIRS)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('package', function () {
  return gulp.src('src/**/*.js')

    // This will output the non-minified version
    .pipe(gulp.dest(DEST))

    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('test', TEST_TASKS);
gulp.task('build', BUILD_TASKS);
