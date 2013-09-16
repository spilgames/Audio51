/**
 * Test framework for testing audio-based code. This is no more, or less, than
 * a mock class for the AudioContext of the WebAudio API. Well, a little more,
 * as it's default destination is an analyzer node, which allows for calculation
 * on values like average volume, frequency buckets, etc...
 * Will also include a method to retrieve an Audio Node slaved to this mock so
 * that it's output can be unit-tested.
 * 
 */
AudioTestFramework = (function() {

    var getContext = (function(AC){
            var ctx = null;
            
            return function() {
                if ( ctx === null ) {
                    ctx = new AC();
                }
                return ctx;
            }
        }(
            window.AudioContext || 
            window.webkitAudioContext || 
            window.mozAudioContext || 
            window.oAudioContext || 
            window.msAudioContext
        )),
        orgContext = window.AudioContext
        orgAudio = Audio
    ;

    /**
     * 
        interface AudioProcessingEvent : Event {

            readonly attribute double playbackTime;
            readonly attribute AudioBuffer inputBuffer;
            readonly attribute AudioBuffer outputBuffer;
        
        };
     */
    function processAudio( wrapper, args ) {
        //stub
    }

    function AudioContextWrapper() {
        this.ctx = getContext();
        this.destination = this.ctx.createAnalyser();
        this.destination.smoothingTimeConstant = 0;
        this.destination.fftSize = 1024;
        var self = this;
        
        Audio = function( url ) {
            var at = new orgAudio(  );
            at.autoplay = true;

            // Cannot attach audio tag to context before it is ready to play
            // or it won't actually attach to the context. This is a work-around
            // for a bug.
            // More info: crbug.com/112368
            at.addEventListener("canplay", function() {
                var an = getContext().createMediaElementSource( at );
                console.log("connecting audio to context");
                an.connect( self.destination );
                at.pause();
                at.audionode = an;
                at.tc = self;
                at.isConnected = true;
            }, 0 );

            if ( url ) {
                at.src = url;
            }

            return at;
        }

        this.destination.connect(this.ctx.destination);
    }

    AudioContextWrapper.prototype = {
        getContext: function() {
            return this.ctx;
        },
        /**
         * Attempts to get average output volume of all frequencies as
         * reported by a RealtimeAnalyzerNode. Information gained lags
         * a little, take this into account in unit-testing.
         */
        getVolumeAverage: function( override ) {
            if ( !override && this.ctx.activeSourceCount == 0 ) {
                return 0;
            }
            var values = 0,
                array =  new Uint8Array(this.destination.frequencyBinCount),
                length, average, i;

            this.destination.getByteFrequencyData(array);
            length = array.length;

            // get all the frequency amplitudes
            for (i = 0; i < length; ++i) {
                values += array[i];
            }
     
            average = values / length;
            return average;
        },
        /**
         * isPlaying will return true if any source in the context is
         * attempting to produce sound. Nomatter if it is or is not
         * connected to the speakers.
         */
        isPlaying: function() {
            return this.ctx.activeSourceCount > 0;
        }
    }
    
    for ( var m in getContext() ) {
        (function( method ) { 
            AudioContextWrapper.prototype[method] = function() {
                var ctx = getContext();
                console.log(method, arguments);
                return ctx[method].apply( ctx, arguments );
            }
        }(m));
    }
    
    AudioContextWrapper.undo = function() {
        window.AudioContext = orgContext;
    }
    window.AudioContext = AudioContextWrapper;

    return AudioContextWrapper;
    
}());
