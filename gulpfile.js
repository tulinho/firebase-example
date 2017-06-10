'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var gutil = require("gulp-util");
var gsequence = require('gulp-sequence')
var htmlmin = require('gulp-html-minifier');
var webpack = require('webpack-stream');
var webpackserver = require("webpack-dev-server");
var wpconfig = require('./webpack.production.config.js');
var del = require('del');
var childprocess = require('child_process');

gulp.task('clean', function (cb) {
  return del('dist', cb);
});

gulp.task('copy', function () {
  return gulp.src([
    'src/**/*',
    '!src/index.js',
    '!src/**/*.html'
  ]).pipe(gulp.dest('./dist'));
});

gulp.task('minify', function() {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task("webpack-deploy", function(callback) {
  return gulp.src('src/index.js')
  .pipe(webpack(require('./webpack.production.config.js')))
  .pipe(gulp.dest('./dist'));
});

gulp.task("serve", function(callback) {
  return execute('yarn run dev');
});

gulp.task('firebase-deploy', function(cb){
  return execute('firebase deploy');
});

gulp.task('default', function (cb) {
  gsequence('clean', ['copy', 'minify', 'webpack-deploy'], 'firebase-deploy')(cb);
});

function execute(script) {
  return new Promise((resolve, reject) => {
    childprocess.exec(script, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}