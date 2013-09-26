/*global define, RSVP*/
define(["webaudio/sound"],function( Sound ) {
    'use strict';

    var getAudioContext = ( function( AC ){
            var ctx = null;
            
            return function() {
                if ( ctx === null ) {
                    ctx = new AC();
                }
                return ctx;
            };
        }(
            window.AudioContext || 
            window.webkitAudioContext || 
            window.mozAudioContext || 
            window.oAudioContext || 
            window.msAudioContext
        )),
        /**
         * Wrap the process of getting the sound as an array-buffer
         * into a `Promise`.
         * 
         * @returns Promise
         * @resolves ArrayBuffer.
         */
         getArrayBuffer = function( uri ) {
            return new RSVP.Promise( function( resolve, reject ) {

                var client = new XMLHttpRequest( );
                client.open( "GET", uri, true );
                client.onload = function( ) {
                    resolve( client.response );
                };
                client.responseType = "arraybuffer";
                client.send();

            } );
        },
        /**
         * Wrap the audio decoding into a `Promise`.
         * 
         * @returns Promise 
         * @resolves AudioBuffer
         */
        createAudioBuffer = function( binaryData ) {
            return new RSVP.Promise( function( resolve, reject ) {

                getAudioContext().decodeAudioData( binaryData, function( buffer ) {
                    resolve( buffer );
                }, function( arg ) {
                    reject( arg );
                } );

            } );
        },
        /**
         * Grab audio source and decode it, using `Promise`s.
         * Basically a convenience method around `getArrayBuffer` and
         * `createAudioBuffer`.
         * 
         * @returns Promise
         * @resolves AudioBuffer
         */
        getAudioBuffer = function( uri ) {
            return getArrayBuffer( uri ).then( function( binaryData ) {
                return createAudioBuffer( binaryData );
            } );
        }
    ;
    
    return {

        /**
         * Load a sound-buffer and create a `Sound` object.
         */
        loadSound: function( url ) {
            return getAudioBuffer( url ).then(
                function(buffer) {
                    var ctx = getAudioContext(),
                        node = ctx.createBufferSource();
                    node.buffer = buffer;
                    return new Sound(node, ctx);
                }
            );
        }

    }

});