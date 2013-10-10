/**
 * This simply exists for other code to depend on. It will fire only once, on user interaction.
 * 
 */
define(function() {
    'use strict';
    
    //Always doing this because it won't hurt devices that don't need it...
    var eventtypes = ["touchstart","touchmove","touchenter","touchcancel","click","scroll"],
        eventhandlers = [],
        b = document.body,
        i, eventtype, l = eventtypes.length,

        listener = function() {
            unrestrict.trigger("userInteraction");
            cleanup();
        },
        cleanup = function() {
            for (i = 0; i < l; ++i) {
                eventtype = eventtypes[i];
                b.removeEventListener(eventtype, listener);
            }
            eventhandlers = [];
            unrestrict.off("userInteraction");
        },
        unrestrict = {
            arm: function() {
                if (eventhandlers.length > 0) return; //Already armed
                for (i = 0; i < l; ++i) {
                    eventtype = eventtypes[i];
                    b.addEventListener(eventtype, listener);
                }
            }
        }
    ;
    
    unrestrict.arm();
    RSVP.EventTarget.mixin(unrestrict);
    return unrestrict;

});
