
gulp-mfiles-appdef
===================

Gulp plugin for transforming appdef.json to M-Files appdef.xml.

Installation
------------

`npm install gulp-mfiles-appdef`

Example
-------

### appdef.json:
```
{
    "guid": "b1915115-931c-4279-86ea-6edb9e5a23b8",
    "name": "M-Files Sample Application",
    "description": "Sample application with a JSON appdef.",
    "environments": {
        "shellui": {
            "files": [ "lib/shellui/**/*.js" ]
        }
    },
	"dashboards": [
		{
			"content": "dashboards/**/*.html",
			"trusted-content": [
				"http://www.m-files.com",
				"http://www.m-files.fi"
			]
		}
	]
}
```

### gulpfile.js:
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

Features
--------

- Simple JSON format over XML
- Glob support for file paths

Also I want overriding values through the gulpfile at some point. For example
forcing certain version for the builds by defining it in the gulpfile instead
of having to change the appdef file each time.
