/*global describe, it, expect, afterEach, beforeEach, runs, spyOn */
/*global waitsFor, xit, RSVP, console, AudioTestFramework */
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
    'use strict';
    
    var atf = new AudioTestFramework(),
        requestAnimationFrame = window.requestAnimationFrame||
                window.webkitRequestAnimationFrame,
        node = null, sound = null;
    
    afterEach(function() {
        runs(function () {

            if (node) {
                if ( node.stop ) {
                    node.stop( 0 );
                }
                else {
                    node.noteOff( 0 );
                }
            }
            if (sound !== null) {
                sound.pause();
                sound.audionode.disconnect();
                sound = null;
            }

        });
        waitsFor(function () {

            return atf.ctx.activeSourceCount === 0;

        }, "Nodes to stop being active...", 500);
        runs(function () {

            if (node) {
                node.disconnect();
                node = null;
            }

        });
    });

    it("should detect sound is not playing", function () {

        expect( atf.getVolumeAverage() ).toBe( 0 );
        expect( atf.isPlaying() ).toBeFalsy( );

    });
    
    xit("should be able to create an oscillator", function () {

        node = atf.createOscillator();
        expect( node ).toBeDefined(  );

    });

    xit("should detect when sound is playing", function () {

        node = atf.createOscillator( );

        runs(function () {

            node.connect( atf.destination );
            if ( node.start ) {
                node.start( 0 );
            } else {
                node.noteOn( 0 );
            }

        });
        waitsFor(function () {

            return atf.isPlaying();

        }, "sound to start playing", 250 );
        runs(function () {

            expect( node.playbackState ).toBe( 2 );
            if ( node.stop ) {
                node.stop( 0 );
            } else {
                node.noteOff( 0 );
            }

        });
        waitsFor(function () {

            return !atf.isPlaying();

        }, "sound to stop playing", 250 );
        runs(function () {

            expect( node.playbackState ).toBe( 3 );

        });

    });

    it("should detect sound playing from XHR request", function () {

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
                node = atf.createBufferSource();
                node.buffer = buffer;
                node.connect( atf.destination );
                if ( node.start ) {
                    node.start( 0 );
                } else {
                    node.noteOn( 0 );
                }
            }, function() {
                console.log( "Failed to load sound :(", arguments );
            } );

        });
        waitsFor(function () {

            return node !== null && atf.getVolumeAverage( true ) > 0;

        }, "XHR request to finish", 500);
        runs(function () {

            expect( atf.getVolumeAverage( true ) ).toBeGreaterThan( 0 );
            if ( node.stop ) {
                node.stop( 0 );
            } else {
                node.noteOff( 0 );
            }

        });

    });
    
    it("should detect when sound is playing from an Audio tag", function () {

        var seek;
        
        runs(function () {

            sound = new Audio( "test/js/testsample.mp3" );

        });
        waitsFor(function () {

            return sound.isConnected;

        }, "sound to finish loading", 250 );
        runs(function () {

            console.log("Starting the sound to play.");
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

});