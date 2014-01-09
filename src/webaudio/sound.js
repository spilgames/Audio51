/*global define, RSVP*/
/*
 *  @module Sound
 *  @copyright (C) 2013 SpilGames
 *  @author Martin Reurings
 *  @license BSD 3-Clause License (see LICENSE file in project root)
 */
define(function() {
    'use strict';
    
    var Sound = function( buffer, ctx ) {
            var gainNode = createGainNode( ctx ),
                n = createBufferSource( buffer, ctx, gainNode ),
                startTime = 0;
            return {
                play: function( volume ) {
                    if (volume !== void 0) {
                        setVolume(gainNode, volume);
                    }
                    startTime = ctx.currentTime;
                    play( n );
                },
                stop: function() {
                    n = stop( n, buffer, ctx );
                },
                getLength: function() {
                    return getLength( n );
                },
                loop: function( value ) {
                    loop( n, value );
                },
                setVolume: function ( value ) {
                    setVolume( gainNode, value );
                },
                getVolume: function () {
                    return getVolume( gainNode );
                },
                isPlaying: function () {
                    return isPlaying( n, ctx, startTime );
                },
                onEnded: function ( callback ) {
                    onEnded( n, callback );
                }
            }
        },
        createBufferSource = function( buffer, context, gainNode ) {
            var node = context.createBufferSource();
            node.buffer = buffer;
            node.connect(gainNode);
            node.onended = function (evt) {
            };
            return node;
        },
        createGainNode = function( context ) {
            var gainNode = context.createGainNode();
            gainNode.connect(context.destination);
            return gainNode;
        },
        play = function( node ) {
            //Connect to speakers
            if ( node.start ) {
                node.start( 0 );
            } else {
                node.noteOn( 0 );
            }
        },
        stop = function( node, buffer, ctx ) {
            if ( node.stop ) {
                node.stop( 0 );
            } else {
                node.noteOff( 0 );
            }
            //Disconnect from speakers, allow garbage collection
            node.disconnect();
            //Create new buffersource so we can fire this sound again
            return createBufferSource( buffer, ctx );
        },
        getLength = function( node ) {
            return node.buffer.length / node.buffer.sampleRate;
        },
        loop = function( node, value ) {
            node.loop = value;
        },
        setVolume = function ( gainNode, value ) {
            gainNode.gain.value = value;
        },
        getVolume = function ( gainNode ) {
            return gainNode.gain.value;
        },
        isPlaying = function ( node, ctx, startTime ) {
            return ctx.currentTime >= startTime + getLength(node);
        },
        onEnded = function ( node, callback) {
            node.onended = callback;
        }
    ;

    return Sound;

});
