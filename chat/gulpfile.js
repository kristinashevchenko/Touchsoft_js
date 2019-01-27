var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
    var files = [
        'public/index.html',
        'public/*.js',
        'public/*.css'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './public'
        }
    });
});