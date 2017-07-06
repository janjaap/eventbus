const gulp = require('gulp');
const babel = require('gulp-babel');

/**
 * Transpile any ES6 constructs to ES5 for browser compatibility
 *
 * 'js-copy' task will complete before this one is executed
 */
gulp.task('default', () => gulp
    .src([
        './src/**/*.js',
        '!src/**/*.test.js',
    ])
    .pipe(babel({
        presets: ['es2015'],
    }))
    .pipe(gulp.dest('./dist')));
