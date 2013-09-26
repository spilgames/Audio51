/*global define, RSVP*/
define(function() {
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
        getContext = ( function() {
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
