'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var path = require('path');
var autoprefixer = require('autoprefixer-core');
var postcss = require('gulp-postcss');
var del = require('del');

var params = {
    out: 'docs',
    htmlSrc: './bundles/index/index.html',
    levels: ['blocks'] // Уровни переопределения
};

gulp.task('default', ['build', 'server']);

gulp.task('clean', () => {
    return del(params.out);
});

gulp.task('selectJS', () => {
    gulp.src('./scripts/*.js')
        .pipe(gulp.dest(path.join(params.out, 'scripts')));
});

gulp.task('server', () => {
    browserSync.init({
        server: params.out
    });

    gulp.watch('*.html', ['html']);

    gulp.watch(params.levels.map((level) => {
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['css']);
});

gulp.task('build', ['clean'], () => {
    gulp.start(['selectJS', 'html', 'css', 'images', 'fonts']);
});

gulp.task('html', () => {
    gulp.src(params.htmlSrc)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(params.out))
        .pipe(reload({stream: true}));
});

gulp.task('css', () => {
    gulp.src(params.levels.map((dir) => dir + '/**/*.css'))
    .pipe(concat('style.css'))
    .pipe(postcss([autoprefixer({
            browsers: ['last 4 versions']
        })]))
        .pipe(gulp.dest(params.out))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', () => {
    gulp.src('./fonts/*')
        .pipe(gulp.dest(path.join(params.out, 'fonts')));
});

gulp.task('images', () => {

    var levels = params.levels.map((level) => {
        var imgGlob = level + '/**/*.{png,jpg,svg}';

        return imgGlob;
    });

    return gulp.src(levels)
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(params.out + '/images/'));
});