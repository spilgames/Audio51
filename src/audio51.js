/*global define, RSVP*/
define( ["webaudio/context","audiotag/context","unrestrict"], function(wac, atc, unrestrict) {
    'use strict';
    
    var fileTypes = {
            //Safe format, but relatively large
            'mp3': 'audio/mpeg',
            //Chrome on Android can't seek in ogg (or so it appeared 2013-04-25)
            //Bad support, small size though
            'ogg': 'audio/ogg',
            //Not always supported, but medium size
            'ac3': 'audio/ac3'
        },
        soundSet = {}
    ;

    return {
        /**
         * Get an `AudioContext` audio51 style. This method will figure out which scenario fits
         * the current environment best. In case you find a use-case where you need to overrule
         * this automation, you can provide an override.
         * Internal caching will ensure that you can always quickly call this method to retreive
         * an `AudioContext`, override will always break the cache, but on subsequent calls will
         * be cached if the override parameter is omitted.
         * 
         * @param {int} override Force this method to return a context of your own chosing.
         */
        getContext: ( function() {
            var ctx = null;

            //Determine override type, if provided.
            return function( override ) {
                if ( override ) {

                    switch (override) {
                        case 2:
                            ctx = atc
                            break;

                        default:
                            ctx = wac
                            break;
                    }

                } else if (ctx === null) {

                    //If WebAudio API is available it should be used
                    if ( wac.canIUse() ) {
                        //WebAudio API has internal 'arming' so mobile and desktop are the same
                        ctx = wac;
                    } else {

                        //Check for touch, touch probably means mobile, acceptable margin of error
                        if ( unrestrict.isTouch() ) {
                            ctx = atc; //TODO: Load restricted set (audiosprite)
                        } else {
                            ctx = atc;
                        }

                    }
                }

                //Return cached context
                return ctx;
            };
        }()),
        
        loadSoundSet: function( uri, exts ) {
            var client = new XMLHttpRequest( ),
                self = this;

            return new RSVP.Promise( function( resolve, reject ) {
                
                client.open( "GET", uri, true );
                client.onload = function( ) {
                    resolve( self.parseSoundSet( JSON.parse(client.response), exts ) );
                };
                client.send();

            } );
        },
        
        parseSoundSet: function( newSet, exts ) {
            var tag = document.createElement('audio'),
                i, ext, type;

            soundSet = newSet;

            console.log("%c Parsing new set of sounds!!", "background: #222; color: #bada55", newSet);
            for (i = 0; i < exts.length; i++) {
                ext = exts[i];
                type = fileTypes[ext];
                if (type && tag.canPlayType && tag.canPlayType(type)) {
                    //break loop;
                    i = exts.length;
                }
            }
            
            return soundSet;
        }

    }

});
