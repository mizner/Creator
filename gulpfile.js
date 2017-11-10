const localUri = 'http://wordpress.dev';

const path = require('path');

const folder = {
    root: path.resolve('./'),
    assets: path.resolve('./assets'),
    dist: path.resolve('./dist'),
};

const gulp = require('gulp');

const plugins = {
    // General
    bs: require('browser-sync').create(),
    del: require('del'),
    concat: require('gulp-concat'),
    sourcemaps: require('gulp-sourcemaps'),
    plumber: require('gulp-plumber'),
    rename: require('gulp-rename'),
    // CSS
    sass: require('gulp-sass'),
    minify: require('gulp-clean-css'),
    autoprefixer: require('gulp-autoprefixer'),
    // JS
    babel: require('gulp-babel'),
    uglify: require('gulp-uglify'),
};


gulp.task('styles', () => {
    gulp.src(folder.assets + '/styles/**/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({
            'browsers': ['last 2 version']
        }))
        .pipe(plugins.minify({
            compatibility: '*', // (default) - Internet Explorer 10+ compatibility mode
            debug: true,
            specialComments: false
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.rename(path => {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(folder.dist))
        .pipe(plugins.bs.stream())
});

gulp.task('scripts', () => {
    gulp.src(folder.assets + '/scripts/**/*.js')
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('main.js')) // concat pulls all our files together before minifying them
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.babel({
            "presets": ["env"]
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.rename(path => {
            path.basename += ".min";
        }))
        .pipe(gulp.dest(folder.dist))
});

gulp.task('browser-sync', () => {
    plugins.bs.init(['*'], {
        proxy: localUri,
        root: [__dirname],
        open: {
            file: 'index.php'
        }
    });
});

gulp.task('clean:dist', () => {
    plugins.del(folder.dist + '/**/*', {
        force: true,
    });
});

gulp.task('watch', ['browser-sync'], () => {
    gulp.watch(folder.assets + '/styles/**/*.scss', ['styles']);
    gulp.watch(folder.assets + '/scripts/**/*.js', ['scripts', plugins.bs.reload]);
    gulp.watch(folder.root + '/**/*.php', plugins.bs.reload);
    gulp.watch('gulpfile.js').on('change', () => {
        // Kill watch if we modify the gulp configuration
        process.exit(0)
    })
});

gulp.task('build', [
    'clean:dist',
    'styles',
    'scripts'
]);

gulp.task('sweep', [
    'sweep:dist',
]);