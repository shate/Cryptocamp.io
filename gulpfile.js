const gulp = require('gulp'),

    babel = require('gulp-babel'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    pngquant = require('imagemin-pngquant'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    spritesmith = require('gulp.spritesmith');
    reload = browserSync.reload;

const path = {
    build: {
        html: 'docs/',
        js: 'docs/js/',
        css: 'docs/css/',
        img: 'docs/img/',
        fonts: 'docs/fonts/',
        video : 'docs/video',
        sprite : 'docs/sprite'
    },
    src: {
        html: 'src/html/**/*.html',
        js: 'src/js/index.js',
        style: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        video : 'src/video/*.**',
        sprite : 'src/sprite'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        video : 'src/video/*.**'
    },
    clean: './docs'
};

const config = {
    production: !!gutil.env.production,
    server: {
        baseDir: "./docs"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});


gulp.task('style:build',  function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./css-maps'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        // .pipe(imagemin({
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()],
        //     interlaced: true
        // }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('video:build', function () {
    gulp.src(path.src.video)
    // .pipe(imagemin({
    //     progressive: true,
    //     svgoPlugins: [{removeViewBox: false}],
    //     use: [pngquant()],
    //     interlaced: true
    // }))
        .pipe(gulp.dest(path.build.video))
        .pipe(reload({stream: true}));
})

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('js:build',  function () {

    return browserify({entries: 'src/js/index.js', debug: !config.production})
        .transform(
            "babelify", {
                presets: ["es2015", 'stage-3'],
                sourceMaps: !!config.production
            }
        )
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./js-maps'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));

});

gulp.task('sprite:build', function () {
    var spriteData =
        gulp.src('src/ico/*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                format : 'png',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                padding : 10,
                imgPath: "../sprite/sprite.png",
                cssVarMap: function (sprite) {
                    sprite.name = 'ico-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('./src/sprite/'));
    spriteData.css.pipe(gulp.dest('./src/scss/'));
});

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('build', [
    'html:build',
    'js:build',
    'sprite:build',
    'style:build',
    'fonts:build',
    'image:build',
    'video:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('sprite:build');
    });

    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.video], function(event, cb) {
        gulp.start('video:build');
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);

