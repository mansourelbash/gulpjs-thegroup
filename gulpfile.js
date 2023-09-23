var gulp = require('gulp'); 
    gulpConcat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass')(require('sass')),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    zip = require('gulp-zip'),
    fontmin = require('gulp-fontmin'),
    cleanCSS = require('gulp-clean-css');

//convert Html Task
 gulp.task('html', function(){
  return gulp.src('project/index.pug')
        .pipe(pug({
          pretty: true
        }))
         .pipe(notify('Html Task is Done'))
         .pipe(gulp.dest('dist'))
         .pipe(livereload());

 })

 gulp.task('minFonts', function () {
  return gulp.src('project/fonts/*.ttf')
      .pipe(fontmin())
      .pipe(gulp.dest('dist/fonts'));
});
 
//Compress All Images
 gulp.task('minImages', async function() {
  const imagemin = await import('gulp-imagemin');
  const pngquant = await import('imagemin-pngquant');
  const jpegrecompress = await import('imagemin-jpeg-recompress');
  const svgo = await import('imagemin-svgo');

  return gulp.src('project/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin.default([
      pngquant.default(), // Compress PNG images
      jpegrecompress.default(), // Compress JPEG images
      svgo.default() // Compress SVG images
    ]))
    .pipe(gulp.dest('dist/images'));
});


//copy font awsome icon and contact on one file to dist folder
gulp.task('copyIcons', function(){
  return gulp.src('project/css/font-awsome/*.css')
         .pipe(gulpConcat('font-awsome-all.css'))
         .pipe(cleanCSS({compatibility: 'ie8'}))
         .pipe(gulp.dest('dist/font-awsome'))
});

//copy web fonts to dist folder

gulp.task('copyWebFonts', function(){
  return gulp.src('project/css/font-awsome/webfonts/*.*')
         .pipe(gulp.dest('dist/font-awsome/webfonts'))
});

//Css concat
gulp.task('concatCss', function(){
  return gulp.src('project/*.css')
         .pipe(gulpConcat('main.css'))
         .pipe(gulp.dest('dist/'))
         .pipe(notify('Css Concat Task is Done'))
         .pipe(livereload());

});

//Js task 
gulp.task('concatJs', function() {
  return gulp.src([
      'project/js/jquery.min.js',
      'project/js/popper.js',
      'project/js/bootstrap.min.js'
    ])
    .pipe(gulpConcat('plugins.js'))
    .pipe(gulp.dest('dist/js/plugin'))
    .pipe(notify('Js Concat Task is Done'));
});


//Css Auto Prefix task 
gulp.task('prefixCss', function(){
  return gulp.src('project/*.css')
        .pipe(sourcemaps.init())
         .pipe(autoprefixer('last 2 versions'))
         .pipe(gulpConcat('main.css'))
         .pipe(sourcemaps.write('.'))
         .pipe(gulp.dest('dist'))
});

//convert scss styles to css
gulp.task('convertScss', function(){
  return gulp.src('project/css/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulpConcat('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());

});

//compress file
gulp.task('compress', function(){
  return gulp.src('dist/**/*.*')
         .pipe(zip('thegroup.zip'))
         .pipe(gulp.dest('.'))
         .pipe(notify('All Files is Compressed'));
})

function runAllTasks() {
  return gulp.series(
    'html',
    'convertScss',
    'concatJs',
    'prefixCss',
    'concatCss',
    'copyIcons',
    'minFonts',
    'copyWebFonts',
    'minImages',
    'compress'
  )();
}

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('project/index.pug', gulp.series('html')); // Watch for copy html pug files
  gulp.watch('project/css/*.scss', gulp.series('convertScss'));  // Watch for convert scss to css
  gulp.watch('project/*.js', gulp.series('concatJs'));  // Watch for concat Js files
  gulp.watch('project/*.css', gulp.series('prefixCss'));  // Watch for add prefix css
  gulp.watch('project/*.css', gulp.series('concatCss'));  // Watch for concat css
  gulp.watch('project/css/font-awsome/*.css', gulp.series('copyIcons'));  // Watch for Copy Icons
  gulp.watch('project/fonts/*.ttf', gulp.series('minFonts'));  // Watch for minified fonts
  gulp.watch('project/css/font-awsome/webfonts/*.*', gulp.series('copyWebFonts'));  // Watch for Copy webfonts
  gulp.watch('project/images/**/*.+(png|jpg|jpeg|gif|svg)', gulp.series('minImages'));  // Watch for minifined images
  gulp.watch('dist/**/**.*', gulp.series('compress'));
});
gulp.task('default', gulp.series('watch'));
gulp.task('run-all-tasks', runAllTasks);
