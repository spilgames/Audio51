/*global define, RSVP*/
define(["webaudio/sound", "unrestrict"],function( Sound, Unrestrict ) {
    'use strict';

    var getAudioContext = ( function( AC ){
            var ctx = null;
            
            return function() {
                if ( ctx === null && AC ) {
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
        buffers = {},
        sounds = {},
        /**
         * Wrap the process of getting the sound as an array-buffer
         * into a `Promise`.
         * 
         * @returns Promise
         * @resolves ArrayBuffer.
         */
        getArrayBuffer = function( uri ) {
            return new RSVP.Promise( function( resolve, reject ) {
                
                if ( buffers[uri] ) {
                    resolve( buffers[uri] );
                } else {
                    var client = new XMLHttpRequest( );
                    client.open( "GET", uri, true );
                    client.onload = function( ) {
                        buffers[uri] = client.response;
                        resolve( client.response );
                    };
                    client.responseType = "arraybuffer";
                    client.send();
                }
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
        },
        /**
         * Create a tiny fraction of silence and play it, by calling this
         * method on any user-interaction, the webaudio context will become
         * unmuted on mobile iOS.
         */
        mobileUnMuteHack = function() {
            var ctx = new AudioTestFramework().getContext(),
                //Smallest possible buffer, 1 sample, thus silence...
                buffer = ctx.createBuffer(1,1,22050), 
                bufferSource = ctx.createBufferSource();
            
            //console.log("unhacking the audiocontext");
            bufferSource.buffer = buffer;
            bufferSource.connect(ctx.destination);
            if (bufferSource.start) {
                bufferSource.start( 0 );
            } else {
                bufferSource.noteOn( 0 );
            }
            //todo: add it to the garbage-bin, to potentially protect the collection cycle.
        },
        loadSound = function( url ) {
            return getAudioBuffer( url ).then(
                function(buffer) {
                    var ctx = getAudioContext();
                    return new Sound(buffer, ctx);
                }
            );
        },
        addSound = function( id, url ) {
            return loadSound( url ).then( function( sound ) {
                sounds[id] = sound;
                console.log( "Finished loading",  sound );
                return sound;
            } );
        }
    ;

    Unrestrict.on("userInteraction", mobileUnMuteHack);

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

            console.log(all);
            return RSVP.all( all );
        },
        
        canIUse: function() {
            return getAudioContext() !== null;
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