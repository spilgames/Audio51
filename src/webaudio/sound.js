/*global define, RSVP*/
define(function() {
    'use strict';
    
    var Sound = function( buffer, ctx ) {
            this.buffer = buffer;
            this.context = ctx;
            createBufferSource( this );
        },
        createBufferSource = function( sound ) {
            var node = sound.context.createBufferSource();
            node.buffer = sound.buffer;
            sound.node = node;
            return node;
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
            //Create new buffersource so we can fire this sound again
            createBufferSource( this );
        },
        getLength: function() {
            return this.node.buffer.length / this.node.buffer.sampleRate;
        },
        loop: function(value) {
            this.node.loop = value;
        }
    };

    return Sound;

});
