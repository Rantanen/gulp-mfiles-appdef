
'use strict';

var builder = require( 'xmlbuilder' );
var through = require( 'through2' );
var glob = require( 'glob' );

module.exports = function( opts ) {
    opts = opts || {};
    var globOptions = opts.glob || {};

    return through.obj( function( file, encoding, callback ) {

        if( file.isStream() ) {
            this.emit( 'error',
                new PluginError( 'gulp-mfiles-appdef',
                'Streaming not supported' ) );
        }

        var contents = file.contents.toString( encoding );
        var appdef = JSON.parse( contents );

        // Start the appdef xml.
        var chunks = []
        var xml = builder.begin( { pretty: true }, function( chunk ) { chunks.push( new Buffer( chunk ) ); } )
            .dec( { encoding: 'utf-8' } )
            .ele( 'application', {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:noNamespaceSchemaLocation': 'http://www.m-files.com/schemas/appdef.xsd' } )
                .ele( 'guid', appdef.guid ).up()
                .ele( 'name', appdef.name ).up()

        // Write the optional application properties.
        var writeIfExists = function( name, attribName ) {
            if( appdef[ name ] ) xml.ele( attribName || name, appdef[ name ] ).up();
        }
        writeIfExists( 'version' );
        writeIfExists( 'description' );
        writeIfExists( 'publisher' );
        writeIfExists( 'copyright' );
        writeIfExists( 'requiredMFilesVersion', 'required-mfiles-version' );
        writeIfExists( 'optional' );

        // Create the modules.
        if( appdef.environments) {
            xml.ele( 'modules' );
            Object.keys( appdef.environments || {} ).forEach( function( e ) {

                // Read the environment details.
                var env = appdef.environments[ e ];
                var attribs = { environment: e };
                if( env.eventPriority )
                    attribs[ 'event-priority' ] = env.eventPriority;

                // Start the module element.
                xml.ele( 'module', attribs );

                // Match the file patterns.
                env.files.forEach( function( pattern ) {
                    var files = glob.sync( pattern, globOptions );

                    // Create a file entry for each module.
                    // Ideally each file should be loaded into the environment
                    // before the environment invokes the first method.
                    files.forEach( function( file ) {
                        xml.ele( 'file', file ).up();
                    } );
                } );

                xml.up();  // end module
            } );
            xml.up();  // end modules
        }

        // Create the dashboards
        if( appdef.dashboards ) {
            xml.ele( 'dashboards' );
            appdef.dashboards.forEach( function( db ) {

                // Glob the dashboard content entries and get unique ones.
                console.log( db );
                var dbcontents = glob.sync( db.content, globOptions );

                // Create the dashboard elements.
                dbcontents.forEach( function( content ) {

                    // Remove the extension and turn paths into 'namespaces'.
                    var id = content.replace( /\.[^.]+$/, '' ).replace( /\//g, '.' )

                    // Start the dashboard element with the ID and content.
                    xml.ele( 'dashboard', { id: id } );
                    xml.ele( 'content', content ).up();

                    // Add the trusted content if any exists.
                    if( db[ 'trusted-content' ] ) {
                        db[ 'trusted-content' ].forEach( function( tc ) {
                            xml.ele( 'trusted-content', tc ).up()
                        } );
                    }

                    xml.up();  // end dashboard
                } );

            } );

            xml.up();  // end dashboards
        }

        xml.end( { pretty: true } );

        file.contents = Buffer.concat( chunks );
        callback( null, file );
    } );
};
