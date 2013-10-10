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
                tag.src = url;
                resolve( new Sound( tag ) );

            } );
            return promise;
        }

    };

});