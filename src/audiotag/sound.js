/*global define, RSVP*/
define(["unrestrict"],function(unrestrict) {
    'use strict';
    
    var /**
         * Create an audio-tag based sound, for use with an environment that does
         * not limit the number of tags playing at the same time.
         * 
         * @author martin.reurings
         * @constructor
         */
        Sound = function( tag, untangled ) {
            var setup = function() {
                    untangle( tag );
                }
            ;
            if (!untangled) {
                unrestrict.on( "userInteraction", setup );
                unrestrict.arm();
            }
            
            return{
                play: function() {
                    play( tag );
                },
                stop: function() {
                    stop( tag );
                },
                getLength: function() {
                    return getLength( tag );
                },
                loop: function( value ) {
                    loop( tag, value );
                },
                tag: tag //a little evil, but allows re-use by restricted context.
            };

        },
        untangle = function( tag ) {
            tag.play();
            tag.pause();
        },
        play = function( tag ) {
            tag.play();
        },
        stop = function( tag ) {
            tag.pause();
            tag.currentTime = 0;
        },
        getLength = function( tag ) {
            return tag.duration;
        },
        loop = function( tag, value ) {
            tag.loop = value;
        }
    ;

    return Sound;

});
