/*global define, RSVP*/
define(function() {
    'use strict';

    function getConfig( uri ) {
        return new RSVP.Promise( function( resolve, reject ) {

            var client = new XMLHttpRequest( );
            client.open( "GET", uri, true );
            client.onload = function( ) {
                resolve( JSON.parse(client.responseText) );
            };
            client.send();

        } );
    }
});
