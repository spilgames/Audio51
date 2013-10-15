/*global define, RSVP*/
define( ["webaudio/context","audiotag/context","unrestrict"], function(wac, atc, unrestrict) {
    'use strict';

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
        }())
    }

});
