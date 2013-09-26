/*global define, RSVP*/
define(function() {
    'use strict';
    
    var Sound = function( node, ctx ) {
            this.node = node;
            this.context = ctx;
        }
    ;

    Sound.prototype = {
        play: function() {
            //Connect to speakers
            this.node.connect(this.context.destination);
            if ( this.node.start ) {
                this.node.start( 0 );
            } else {
                this.node.noteOn( 0 );
            }
        },
        stop: function() {
            if ( this.node.stop ) {
                this.node.stop( 0 );
            } else {
                this.node.noteOff( 0 );
            }
            //Disconnect from speakers, allow garbage collection
            this.node.disconnect();
        }
    };

    return Sound;

});
