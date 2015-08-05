'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
var closureCompiler = require('gulp-closure-compiler');
var browserSync = require('browser-sync');
var ghPages = require('gulp-gh-pages');

var DEST = './dist/' + pkg.version;

gulp.task('scripts', function() {
  return gulp.src(['lib/**/*.js', 'index.js'])
    .pipe(closureCompiler({
      fileName: 'uibench.js',
      compilerPath: 'node_modules/closurecompiler/compiler/compiler.jar',
      continueWithWarnings: true,
      compilerFlags: {
        closure_entry_point: 'uibench.export',
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        use_types_for_optimization: true,
        only_closure_dependencies: true,
        output_wrapper: '(function(){%output%}).call();',
        warning_level: 'VERBOSE',
        jscomp_warning: 'reportUnknownTypes',
        summary_detail_level: 3
      }
    }))
    .pipe(gulp.dest(DEST));
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
  return gulp.src(DEST + '/**/*')
      .pipe(ghPages());
});

gulp.task('default', ['scripts', 'assets']);
