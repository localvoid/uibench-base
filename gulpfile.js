var gulp = require('gulp');
var pkg = require('./package.json');
var closureCompiler = require('google-closure-compiler').gulp();
var browserSync = require('browser-sync');
var ghPages = require('gulp-gh-pages');

var DEST = './dist/' + pkg.version;

gulp.task('scripts', function() {
  return gulp.src(['lib/**/*.js', 'index.js'])
      .pipe(closureCompiler({
        js_output_file: 'uibench.js',
        dependency_mode: 'STRICT',
        entry_point: 'goog:uibench.export',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        output_wrapper: '(function(){%output%}).call();',
        warning_level: 'VERBOSE',
        jscomp_warning: 'reportUnknownTypes',
        summary_detail_level: 3
      }))
      .pipe(gulp.dest(DEST))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', function() {
  return gulp.src('assets/*')
      .pipe(gulp.dest(DEST));
});

gulp.task('serve', ['default'], function() {
  browserSync({
    open: false,
    port: 3000,
    notify: false,
    server: DEST
  });

  gulp.watch('./assets/*', ['assets']);
  gulp.watch('./lib/*.js', ['scripts']);
});

gulp.task('deploy', ['default'], function () {
  return gulp.src('./dist/**/*')
      .pipe(ghPages());
});

gulp.task('default', ['scripts', 'assets']);
