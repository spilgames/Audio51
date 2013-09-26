/*global define, RSVP*/
define(function() {
    'use strict';

    var getContext = ( function() {
            var ctx = null;
            
            return function() {
                if ( ctx === null ) {
                    ctx = new SimpleAudioContext();
                }
                return ctx;
            };
        }())
    ;
    
    function SimpleAudioContext() {
        console.log('Creating new context');
    }
    
    SimpleAudioContext.prototype = {
        loadAudio: function() {
            var promise = new RSVP.Promise(function(resolve,reject){

                resolve([]);

            });
            
            return promise;
        }
    };
    
    return getContext();

});
