
'use strict';

var builder = require( 'xmlbuilder' );
var through = require( 'through2' );

module.exports = function() {

    return through.obj( function( file, encoding, callback ) {

        if( file.isStream() ) {
            this.emit( 'error',
                new PluginError( 'gulp-mfiles-appdef',
                'Streaming not supported' ) );
        }

        var contents = file.contents.toString( encoding );
        var appdef = JSON.parse( contents );

        var chunks = []
        var xml = builder.begin( { pretty: true }, function( chunk ) { chunks.push( new Buffer( chunk ) ); } )
            .dec( { encoding: 'utf-8' } )
            .ele( 'application', {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:noNamespaceSchemaLocation': 'http://www.m-files.com/schemas/appdef.xsd' } )
                .ele( 'guid', appdef.guid ).up()
                .ele( 'name', appdef.name ).up()
                .ele( 'description', appdef.description ).up()
                .ele( 'modules' );

        Object.keys( appdef.environments ).forEach( function( e ) {

            var env = appdef.environments[ e ];
            xml = xml.ele( 'module', { environments: e } );

            env.files.forEach( function( file ) {
                xml.ele( 'file', file );
            } );

            xml = xml.up();
        } );

        xml.end( { pretty: true } );

        file.contents = Buffer.concat( chunks );
        callback( null, file );
    } );
};
