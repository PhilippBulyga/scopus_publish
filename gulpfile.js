/*Gulp main variables*/
import gulp from 'gulp';
import server from 'gulp-server-livereload';
import changed from "gulp-changed";
import webpack from "webpack-stream";
import gulpVariables from './gulp/gulp-variables.js';
/*NOTIFICATION variables */
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
/*CLEAN variables */
import fs from 'fs'
import clean from 'gulp-clean';
/*HTML variables */
import fileInclude from 'gulp-file-include';
import webpHTML from 'gulp-webp-retina-html';
import replace from 'gulp-replace';
import prettier from '@bdchauvette/gulp-prettier';
/*IMAGE variables*/
import imagemin from "gulp-imagemin";
import webp from 'gulp-webp';
import through from 'through2';
import scaleImages from 'gulp-scale-images';
import gifsicle from 'imagemin-gifsicle'
import optipng from "imagemin-optipng";
import mozjpeg from 'imagemin-mozjpeg';
import {computeFileName, computeScaleInstructions} from "./gulp/gulp-retina.js";
/*JS variables */
import webpackConfig from './webpack.config.js';
import babel from 'gulp-babel';
/*SCSS variables */
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
// import gulpCSSO from 'gulp-csso';
import sourceMaps from 'gulp-sourcemaps';
import groupMedia from 'gulp-group-css-media-queries';



//import variables
const sass = gulpSass(dartSass)
const plumberNotify = (title) => {
    return {errorHandler: notify.onError({title: title, message: 'Error <%= error.message %>', sound:false})}
}


/*SUB DEVELOPMENT TASKS */
//CLEAN TASK
gulp.task('clean:dev', function(done){
    if(fs.existsSync(gulpVariables.distPath)){
        return gulp.src(gulpVariables.distPath, {read: false}).pipe(clean({force: true}))
    }
    done();
});

/*MAIN DEVELOPMENT TASKS*/
//HTML TASK
gulp.task('html:dev', function(){
    return gulp
            .src(gulpVariables.htmlPathStart)
            .pipe(changed(gulpVariables.htmlPathEnd, {hasChanged: changed.compareContents}))
            .pipe(plumber(plumberNotify('HTML')))
            .pipe(fileInclude({prefix: '@@', basepath: '@file'}))
            .pipe(
                replace(
                    /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
                    '$1./$4$5$7$1'
                )
            )
            .pipe(webpHTML({ extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'], retina: { 1: '',  2: '@2x', }, }))
            .pipe(prettier({ tabWidth: 4, useTabs: true, printWidth: 182, trailingComma: 'es5', bracketSpacing: false,}))
            .pipe(gulp.dest(gulpVariables.htmlPathEnd))
});

//SASS TASK
gulp.task('scss:dev', function(){
    return gulp
            .src(gulpVariables.scssPathStart)
            .pipe(changed(gulpVariables.scssPathEnd))
            .pipe(plumber(plumberNotify('SCSS')))
            .pipe(sourceMaps.init())
            .pipe(sass())
            .pipe(groupMedia())
            .pipe(sourceMaps.write())
            .pipe(gulp.dest(gulpVariables.scssPathEnd))
});

//IMAGE TASK
gulp.task('image:dev', function(){
    return gulp
        .src(gulpVariables.imagePathStart, {encoding: false})
        .pipe(changed(gulpVariables.imagePathEnd))
        .pipe(webp())
        .pipe(gulp.dest(gulpVariables.imagePathEnd))

        .pipe(gulp.src(gulpVariables.imagePathStart, {encoding: false}))
        .pipe(changed(gulpVariables.imagePathEnd))
        .pipe(imagemin([gifsicle({ interlaced: true }), mozjpeg({ quality: 85, progressive: true }), optipng({ optimizationLevel: 5 }),], { verbose: true }))
        .pipe(gulp.dest(gulpVariables.imagePathEnd))
});

//RETINA TASK
gulp.task('retina:dev', function(){
    return gulp
        .src('./dist/image/**', {encoding: false})
        .pipe(changed('./dist/image/**'))
        .pipe(through.obj(computeScaleInstructions))
        .pipe(scaleImages(computeFileName))
        .pipe(gulp.dest('./dist/image/'))
});

//FILES TASK
gulp.task('files:dev', function(){
    return gulp
            .src(gulpVariables.filesPathStart)
            .pipe(changed(gulpVariables.filesPathEnd))
            .pipe(gulp.dest(gulpVariables.filesPathEnd))
});

//JS TASK
gulp.task('js:dev', function(){
    return gulp
            .src(gulpVariables.jsPathStart)
            .pipe(changed(gulpVariables.jsPathEnd))
            .pipe(plumber(plumberNotify('JS')))
            .pipe(babel())
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(gulpVariables.jsPathEnd))
});

//SERVER TASK
gulp.task('server:dev', function(){
    return gulp
            .src(gulpVariables.distPath)
            .pipe(server({livereload: true, open: true}))
});

//WATCH TASK
gulp.task('watch:dev', function(){
    gulp.watch(gulpVariables.scssPathAll, gulp.parallel('scss:dev'));
    gulp.watch(gulpVariables.htmlPathAll, gulp.parallel('html:dev'));
    gulp.watch(gulpVariables.filesPathAll, gulp.parallel('files:dev'));
    gulp.watch(gulpVariables.jsPathAll, gulp.parallel('js:dev'));
    gulp.watch(gulpVariables.imagePathAll, gulp.parallel('image:dev'));
    gulp.watch(gulpVariables.imagePathAll, gulp.parallel('retina:dev'));
});





/*MAIN PRODUCTION TASKS*/
//CLEAN TASK
gulp.task('clean:prod', function(done){
    if(fs.existsSync(gulpVariables.docsPath)){
        return gulp.src(gulpVariables.docsPath, {read: false}).pipe(clean({force: true}))
    }
    done();
});
//HTML TASK
gulp.task('html:prod', function(){
    return gulp
            .src(gulpVariables.htmlPathStart)
            .pipe(changed(gulpVariables.htmlPathEndDocs))
            .pipe(plumber(plumberNotify('HTML')))
            .pipe(fileInclude({prefix: '@@', basepath: '@file'}))
            .pipe(webpHTML({ extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'], retina: { 1: '',  2: '@2x', }, }))
            .pipe(prettier({ tabWidth: 4, useTabs: true, printWidth: 182, trailingComma: 'es5', bracketSpacing: false,}))
            .pipe(gulp.dest(gulpVariables.htmlPathEndDocs))
});

//SASS TASK
gulp.task('scss:prod', function(){
    return gulp
            .src(gulpVariables.scssPathStart)
            .pipe(changed(gulpVariables.scssPathEndDocs))
            .pipe(plumber(plumberNotify('SCSS')))
            .pipe(autoPrefixer())
            .pipe(sass())
            .pipe(groupMedia())
            .pipe(csso())
            .pipe(gulp.dest(gulpVariables.scssPathEndDocs))
});

//IMAGE TASK
gulp.task('image:prod', function(){
    return gulp
        .src(gulpVariables.imagePathStart, {encoding: false})
        .pipe(changed(gulpVariables.imagePathEndDocs))
        .pipe(webp())
        .pipe(gulp.dest(gulpVariables.imagePathEndDocs))

        .pipe(gulp.src(gulpVariables.imagePathStart, {encoding: false}))
        .pipe(changed(gulpVariables.imagePathEndDocs))
        .pipe(imagemin([gifsicle({ interlaced: true }), mozjpeg({ quality: 85, progressive: true }), optipng({ optimizationLevel: 5 }),], { verbose: true }))
        .pipe(gulp.dest(gulpVariables.imagePathEndDocs))
});

//RETINA TASK
gulp.task('retina:prod', function(){
    return gulp
        .src('./docs/image/**', {encoding: false})
        .pipe(changed('./docs/image/**'))
        .pipe(through.obj(computeScaleInstructions))
        .pipe(scaleImages(computeFileName))
        .pipe(gulp.dest('./docs/image/'))
});

//FILES TASK
gulp.task('files:prod', function(){
    return gulp
            .src(gulpVariables.filesPathStart)
            .pipe(changed(gulpVariables.filesPathEndDocs))
            .pipe(gulp.dest(gulpVariables.filesPathEndDocs))
});

//JS TASK
gulp.task('js:prod', function(){
    return gulp
            .src(gulpVariables.jsPathStart)
            .pipe(changed(gulpVariables.jsPathEndDocs))
            .pipe(plumber(plumberNotify('JS')))
            .pipe(babel())
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(gulpVariables.jsPathEndDocs))
});

//SERVER TASK
gulp.task('server:prod', function(){
    return gulp
            .src(gulpVariables.docsPath)
            .pipe(server({livereload: true, open: true}))
});


//DEFAULT TASK
gulp.task(
    'default', 
    gulp.series('clean:dev',
        gulp.parallel('html:dev', 'scss:dev', 'image:dev', 'files:dev', 'js:dev'),
        gulp.series('retina:dev'),
        gulp.parallel('server:dev', 'watch:dev')
    )
);
//PRODUCTION TASK
gulp.task(
    'prod', 
    gulp.series('clean:prod',
    gulp.parallel('html:prod', 'scss:prod', 'image:prod', 'files:prod', 'js:prod'),
    gulp.series('retina:prod'),
    gulp.parallel('server:prod'))
);