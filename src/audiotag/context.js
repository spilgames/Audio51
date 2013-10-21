/*global define, RSVP*/
define(["audiotag/sound"],function( Sound ) {
    'use strict';

    var sounds = {},
        loadSound = function( url ) {
            var promise = new RSVP.Promise( function( resolve, reject ) {
    
                var tag = new Audio();
                tag.addEventListener( "canplay", function() {
                    resolve( new Sound( tag ) );
                } );
                tag.src = url;
    
            } );
            return promise;
        },
        addSound = function( id, url ) {
            return loadSound( url ).then( function( sound ) {
                sounds[id] = sound;
                return sound;
            } );
        }
    ;

    return {

        /**
         * Load a sound-buffer and create a `Sound` object.
         */
        loadSound: function( url ) {
            return loadSound( url );
        },
        
        parse: function( soundSet, baseUrl, ext ) {
            var i = 0,
            all = [],
            spriteName, url;

            for (spriteName in soundSet.spritemap) {
                url = baseUrl + "_00" + (++i) + "." + ext;
                all.push( addSound( spriteName, url ) );
            }
    
            return RSVP.all( all );
        },
        
        play: function( id ) {
            var sound = null;
            if (sounds[id]) {
                sound = sounds[id];
                sound.play();
            }
            return sound;
        }

    };

});