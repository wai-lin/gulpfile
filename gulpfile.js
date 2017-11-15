const gulp = require('gulp');
const sass = require('gulp-sass');
const g_util = require('gulp-util');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');

gulp.task('clean', () => {
  gulp.src('./dist', { read: false })
    .pipe(clean())
});

gulp.task('html', () => {
  gulp.src(['**/*.html', '!dist/**/*.html', '!./node_modules/**'])
    .pipe(gulp.dest('dist/'))
    .pipe(reload({ stream: true }));
});

gulp.task('copy-assets', () => {
  gulp.src(['assets/**/*'])
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './dist/'
    }
  })
});

gulp.task('sass', () => {
  gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded' }))
    .on('error', g_util.log)
    .pipe(gulp.dest('dist/css/'))
    .pipe(autoprefixer())
    .pipe(reload({ stream: true }));
});

gulp.task('minify-css', () => {
  gulp.src(['dist/css/**/*.css', '!dist/css/**/*.min.css'])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css/'))
    .pipe(reload({ stream: true }));
});

gulp.task('js', () => {
  gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
    .on('error', g_util.log)
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', () => {
  gulp.watch(['**/*.html', '!dist/**/*.html'], ['html']);
  gulp.watch('scss/**/*.scss', ['sass', 'minify-css']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('assets/**/*', ['copy-assets']);
});

gulp.task('default', ['html', 'copy-assets', 'sass', 'minify-css', 'js', 'browser-sync', 'watch']);