/* eslint max-nested-callbacks: 0 */
'use strict';

var eslint = require('gulp-eslint');
var exec = require('child_process').exec;
var gulp = require('gulp');
var jsonEditor = require('gulp-json-editor');
var path = require('path');
var util = require('util');

function execCb(cb, err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(err);
}

var options = {
    coveragePaths: [
        '*.js',
        'lib/**/*.js',
        'plugins/*.js'
    ],
    lintPaths: [
        '*.js',
        'lib/**/*.js',
        'plugins/*.js',
        'templates/default/*.js',
        'templates/haruki/*.js',
        'test/specs/**/*.js'
    ],
    nodeBin: path.resolve(__dirname, './jsdoc.js'),
    nodePath: process.execPath
};

gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe(jsonEditor({
            revision: String( Date.now() )
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('coverage', function(cb) {
    var cmd = util.format('./node_modules/.bin/nyc --reporter=html %s -T', options.nodeBin);

    exec(cmd, execCb.bind(null, cb));
});

gulp.task('lint', function() {
    return gulp.src(options.lintPaths)
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.failOnError());
});

gulp.task('test', function(cb) {
    var cmd = util.format('%s "%s" -T', options.nodePath, options.nodeBin);

    exec(cmd, execCb.bind(null, cb));
});

gulp.task('default', gulp.series('lint', 'test'));
