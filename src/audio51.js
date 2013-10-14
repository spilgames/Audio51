/*global define, RSVP*/
define( ["webaudio/context","audiotag/context"], function(wac, atc) {
    'use strict';

    var getContext = ( function() {
            var ctx = null;
            
            return function() {
                if ( wac.canIUse() ) {
                    ctx = wac;
                } else {
                    ctx = atc;
                }
                return ctx;
            };
        }())
    ;
    
    return getContext();

});
