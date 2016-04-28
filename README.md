
gulp-mfiles-appdef
===================

Gulp plugin for transforming appdef.json to M-Files appdef.xml.

Installation
------------

`npm install gulp-mfiles-appdef`

Example
-------

```javascript
var gulp = require( "gulp" );
var rename = require( "gulp-rename" );
var appdef = require( "gulp-mfiles-appdef" );

gulp.task( "build", function() {

	return gulp.src( "appdef.json" )
        .pipe( appdef() )
        .pipe( rename( { extname: ".xml" } ) )
        .pipe( gulp.dest( "./build" ) ) );

} );
```
