import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import { src, dest, task, series, parallel, watch } from 'gulp';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import fileinclude from 'gulp-file-include';
import minify from 'gulp-minify';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import webp from 'gulp-webp';
import * as dartSass from 'sass';
import fs from 'node:fs';

const sass = gulpSass(dartSass);

const src_dir = 'src';
const dest_dir = 'dist';

task('pages', () => {
  return src(src_dir + '/pages/**/*', { dot: true })
    .pipe(fileinclude({ basepath: src_dir }))
    .pipe(dest(dest_dir))
    .pipe(browserSync.stream());
});

task('styles', () => {
  return src(src_dir + '/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(dest_dir + '/css'))
    .pipe(browserSync.stream());
});

task('scripts', () => {
  return src(src_dir + '/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(dest_dir + '/js'))
    .pipe(browserSync.stream());
});

task('images', () => {
  return src(src_dir + '/images/**/*.{jpg,jpeg,png,gif}', { encoding: false })
    .pipe(webp())
    .pipe(dest(dest_dir + '/images'));
});

task('icons', () => {
  return src(src_dir + '/images/**/*.{svg,ico}', { encoding: false })
    .pipe(dest(dest_dir + '/images'));
});

task('fonts', () => {
  return src(src_dir + '/fonts/*', { encoding: false })
    .pipe(dest(dest_dir + '/fonts'));
});

task('clean', () => {
  return deleteAsync(dest_dir + '/*');
});

task('build', parallel('pages', 'styles', 'scripts', 'images', 'icons', 'fonts'));

task('reload', (done) => {
  browserSync.reload();
  done();
});

task('serve', () => {
  browserSync.init({
    browser: ['chrome', 'firefox'],
    server: dest_dir,
    middleware: function (req, res, next) {
      if (!fs.existsSync(dest_dir + req.url)) {
        req.url += '.html';
      }
      next();
    },
  });

  watch(src_dir + '/**/*.html', series('pages', 'reload'));
  watch(src_dir + '/scss/**/*', series('styles', 'reload'));
  watch(src_dir + '/js/**/*', series('scripts', 'reload'));
  watch(src_dir + '/images/**/*.{jpg,jpeg,png,gif}', series('images', 'reload'));
  watch(src_dir + '/images/**/*.{svg,ico}', series('icons', 'reload'));
  watch(src_dir + '/fonts/**/*', series('fonts', 'reload'));
});

task('default', series('clean', 'build', 'serve'));
