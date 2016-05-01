/* eslint-env node */

"use strict";

var gulp = require( "gulp" );
var eslint = require( "gulp-eslint" );
var rename = require( "gulp-rename" );
var appdef = require( "./" );

gulp.task( "lint", function() {

	return gulp.src( paths.scripts )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );
} );

gulp.task( "test", function() {

	return gulp.src( "appdef.json" )
        .pipe( appdef( { glob: { nonull: true } } ) )
        .pipe( rename( { extname: ".xml" } ) )
        .pipe( gulp.dest( "./" ) );
} );

