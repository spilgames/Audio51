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
        Sound = function( tag ) {
            this.tag = tag;
            var self = this,
                setup = function() {
                    untangle( self );
                    //unrestrict.off( "userInteraction", setup );
                }
            ;
            unrestrict.on( "userInteraction", setup );
            unrestrict.arm();
        },
        untangle = function( sound ) {
            sound.tag.play();
            sound.tag.pause();
        }
    ;

    Sound.prototype = {
        play: function() {
            this.tag.play();
        },
        stop: function() {
            this.tag.pause();
            this.tag.currentTime = 0;
        },
        getLength: function() {
            return this.tag.duration;
        },
        loop: function(value) {
            this.tag.loop = value;
        }
    };

    return Sound;

});
