import gulp from "gulp";
import changed from "gulp-changed";
import through from "through2";
import {computeFileName, computeScaleInstructions} from "./gulp-retina.js";
import scaleImages from "gulp-scale-images";

const gulpVariables = {
    distPath: './dist/',
    docsPath: './docs/',

    htmlPathStart: './src/*.html',
    htmlPathAll: './src/**/*.html',
    htmlPathEnd: './dist/',
    htmlPathEndDocs: './docs/',

    scssPathStart: './src/scss/*.scss',
    scssPathAll: './src/scss/**/*.scss',
    scssPathEnd: './dist/css/',
    scssPathEndDocs: './docs/css/',

    imagePathStart: './src/image/**/*',
    imagePathAll: './src/image/**/*',
    imagePathEnd: './dist/image/',
    imagePathEndWebp: './dist/image/webp',
    imagePathEndDocs: './docs/image/',
    imagePathEndDocsWebp: './docs/image/webp',

    filesPathStart: './src/files/**/*',
    filesPathAll: './src/files/**/*',
    filesPathEnd: './dist/files/',
    filesPathEndDocs: './docs/files/',

    jsPathStart: './src/js/*.js',
    jsPathAll: './src/js/**/*.js',
    jsPathEnd: './dist/js/',
    jsPathEndDocs: './docs/js/',
}

export default gulpVariables;