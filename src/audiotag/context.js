/*global define, RSVP*/
define(["audiotag/sound"],function( Sound ) {
    'use strict';
    
    return {

        /**
         * Load a sound-buffer and create a `Sound` object.
         */
        loadSound: function( url ) {
            var promise = new RSVP.Promise( function( resolve, reject ) {

                var tag = new Audio();
                tag.addEventListener( "canplay", function() {
                    resolve( new Sound( tag ) );
                } );
                tag.src = url;

            } );
            return promise;
        }

    };

});