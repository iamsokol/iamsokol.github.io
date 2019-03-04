var gulp = require('gulp'),
    pug = require('gulp-pug'),
    scss = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('pug', function(){
  return gulp.src('dev/pages/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public'))
});
gulp.task('pugComponents', function(){
  return gulp.src('dev/components/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/components'))
});

gulp.task('scss', function(){
  return gulp.src("dev/**/*/*.scss")
    .pipe(sourcemaps.init())
    .pipe(scss())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 10', 'ie 11'], { cascade: true }))
    .pipe(cssnano())
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest("public/"))
    .pipe(browserSync.reload({stream: true}))
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'public'
    },
    notify: false
  });
});

gulp.task('watch', ['img', 'scss', 'browser-sync'], function() {
  gulp.watch('dev/**/*.scss', ['scss']);
  gulp.watch('dev/**/*.pug', ['pug', 'pugComponents']);
  gulp.watch('public/**/*.html', browserSync.reload);
});

gulp.task('img', function() {
  return gulp.src('dev/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      use: [pngquant()]
    })))
    .pipe(gulp.dest('public/img'));
});

gulp.task('clear', function (callback) {
  return cache.clearAll();
})

gulp.task('default', ['pug', 'pugComponents', 'watch']);
