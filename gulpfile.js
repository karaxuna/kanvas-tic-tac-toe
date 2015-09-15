var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref');

// build
gulp.task('build', function () {
    var assets = useref.assets();
    return gulp.src('./index.html')
        .pipe(assets)
        //.pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});