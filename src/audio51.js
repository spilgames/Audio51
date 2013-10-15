/*global define, RSVP*/
define( ["webaudio/context","audiotag/context"], function(wac, atc) {
    'use strict';

    return {
        getContext: ( function() {
            var ctx = null;
            
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
                    if ( wac.canIUse() ) {
                        ctx = wac;
                    } else {
                        ctx = atc;
                    }
                }
                return ctx;
            };
        }())
    }

});
