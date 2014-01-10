/*global define, RSVP*/
/*
 *  @module Sound
 *  @copyright (C) 2013 SpilGames
 *  @author Martin Reurings
 *  @license BSD 3-Clause License (see LICENSE file in project root)
 */
define(["audio51/unrestrict"],function(unrestrict) {
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
                play: function( volume ) {
                    if (volume !== void 0) {
                        setVolume( tag, volume );
                    }
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
                setVolume: function ( value ) {
                    setVolume( tag, value );
                },
                setMute: function ( value ) {
                    setMute( tag, value );
                },
                getVolume: function () {
                    return getVolume( tag );
                },
                isPlaying: function () {
                    return isPlaying( tag );
                },
                onEnded: function (callback, scope) {
                    onEnded(tag, callback, scope);
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
        },
        setVolume = function( tag, value ) {
            tag.volume = value;
        },
        getVolume = function( tag ) {
            return tag.volume;
        },
        isPlaying = function ( tag ) {
            return !tag.ended;
        },
        onEnded = function ( tag, callback ) {
            tag.addEventListener('ended', callback);
        },
        setMute = function( tag, value ) {
            tag.muted = value ? true : false;
        }
    ;

    return Sound;

});
