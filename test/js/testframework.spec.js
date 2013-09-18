/**

    var atf = new AudioTestFramework();
    var osc = atf.createOscillator();
    osc.connect( atf.destination );
    osc.start(0);
    console.log(osc.playbackState, atf.getVolumeAverage());
    osc.stop( 0 );
    console.log(osc.playbackState, atf.getVolumeAverage());
    osc.disconnect( );
    console.log(osc.playbackState, atf.getVolumeAverage());

 */

describe("Audio Test Framework", function () {
    
    var atf = new AudioTestFramework(),
        requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame;

    it("should detect sound is not playing", function () {

        expect( atf.getVolumeAverage() ).toBe( 0 );
        expect( atf.isPlaying() ).toBeFalsy( );

    });
    
    it("should be able to create an oscillator", function () {

        var osc = atf.createOscillator();
        expect( osc ).toBeDefined(  );

    });

    it("should detect when sound is playing", function () {

        var osc = atf.createOscillator( );

        runs(function () {

            osc.connect( atf.destination );
            if ( osc.start ) osc.start( 0 );
            else osc.noteOn( 0 );

        });
        waitsFor(function () {

            return atf.isPlaying();

        }, "sound to start playing", 250 );
        runs(function () {

            expect( osc.playbackState ).toBe( 2 );
            if ( osc.stop ) osc.stop( 0 );
            else osc.noteOff( 0 );

        });
        waitsFor(function () {

            return !atf.isPlaying();

        }, "sound to stop playing", 250 );
        runs(function () {

            expect( osc.playbackState ).toBe( 3 );
            osc.disconnect( );

        });

    });
    
    it("should detect when sound is playing from an Audio tag", function () {

        var sound,
            seek;
        
        runs(function () {

            sound = new Audio( "test/js/testsample.mp3" );

        });
        waitsFor(function () {

            return sound.isConnected;

        }, "sound to finish loading", 250 );
        runs(function () {

            console.log("Starting the sound to play.")
            sound.play();

        });
        waitsFor(function () {

            return atf.isPlaying() || atf.getVolumeAverage( true ) > 0;

        }, "sound to start playing", 250 );
        runs(function () {

            seek = sound.seek;
            expect( sound.seek > 0 );
            sound.pause();

        });
        waitsFor(function () {

            return atf.getVolumeAverage( true ) === 0;

        }, "sound to stop playing", 250 );
        runs(function () {

            seek = sound.seek;
            expect( sound.seek === seek );

        });


    });

    it("should detect sound playing from XHR request", function () {

        var src;

        /**
         * Wrap the process of getting the sound as an array-buffer
         * into a `Promise`.
         * 
         * @returns Promise
         * @resolves ArrayBuffer.
         */
        function getArrayBuffer( uri ) {
            return new RSVP.Promise( function( resolve, reject ) {

                var client = new XMLHttpRequest( );
                client.open( "GET", uri, true );
                client.onload = function( ) {
                    resolve( client.response );
                };
                client.responseType = "arraybuffer";
                client.send();

            } );
        }

        /**
         * Wrap the audio decoding into a `Promise`.
         * 
         * @returns Promise 
         * @resolves AudioBuffer
         */
        function createAudioBuffer( binaryData ) {
            return new RSVP.Promise( function( resolve, reject ) {

                atf.decodeAudioData( binaryData, function( buffer ) {
                    resolve( buffer );
                }, function( arg ) {
                    reject( arg );
                } );

            } );
        }

        /**
         * Grab audio source and decode it, using `Promise`s.
         * Basically a convenience method around `getArrayBuffer` and
         * `createAudioBuffer`.
         * 
         * @returns Promise
         * @resolves AudioBuffer
         */
        function getAudioBuffer( uri ) {
            return getArrayBuffer( uri ).then( function( binaryData ) {
                return createAudioBuffer( binaryData );
            } );
        }
        
        runs(function () {

            expect( atf.getVolumeAverage( true ) ).toBe( 0 );
            getAudioBuffer( "test/js/testsample.mp3" ).then( function( buffer ) {
                console.log('Sound is in tha house');
                src = atf.createBufferSource();
                src.buffer = buffer;
                src.connect( atf.destination );
                if ( src.start ) src.start( 0 );
                else src.noteOn( 0 );
            }, function() {
                console.log( "Failed to load sound :(", arguments );
            } );

        });
        waitsFor(function () {

            return typeof src !== "undefined" && atf.getVolumeAverage( true ) > 0;

        }, "XHR request to finish", 500);
        runs(function () {

            expect( atf.getVolumeAverage( true ) ).toBeGreaterThan( 0 );
            if ( src.stop ) src.stop( 0 );
            else src.noteOff( 0 );

        });

    });

});