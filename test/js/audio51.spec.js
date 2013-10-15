/*global describe, it, expect, afterEach, beforeEach, runs, spyOn, waitsFor, require */
/*global AudioContext, console*/
describe("The Audio51 framework", function () {
    'use strict';
    
    var audio51 = null,
        context = null,
        contextTypes = [1, 2],
        contextType = null,
        i;

    require(["audio51"], function(a51) {
        audio51 = a51
        context = audio51.getContext();
    });
    
    beforeEach(function () {

        waitsFor(function () {

            return context !== null;

        }, "waiting for require to load up our context", 500);
        
        runs(function () {

            if (contextType !== null) {
                context = audio51.getContext( contextType );
            }

        });

    });
    
    for (i = 0; i < contextTypes.length; ++i) {
        contextType = contextTypes[i];
        
        describe("Verifying context type " + contextType, function () {

            it("can load a sound", function () {

                var sound = null;
                
                runs(function () {

                    context.loadSound('test/js/pulse.wav').then(
                        function(s) {
                            sound = s;
                        },
                        function(e) {
                            sound = false;
                            console.warn(e);
                        }
                    );

                });
                
                waitsFor(function () {

                    return sound !== null;

                }, "sound to finish loading", 2000);
                
                runs(function () {

                    console.debug( sound );
                    expect( sound.play ).toBeTruthy( );
                    sound.play();

                });
                
                waitsFor(function () {

                    return AudioTestFramework.getVolumeAverage() > 0;

                }, "sound to start playing", 2000);
                
                runs(function () {

                    sound.stop();

                });

            });
            
            it("can load sprites", function () {

                

            });
            
            it("can play a sprite", function () {

                

            });

            it("can play multiple streams", function () {

                

            });
            
            it("can override existing stream, when only 1 stream is allowed", function () {

                

            });
            
            
            it("can be configured to prefer existing sprite, when only 1 stream is allowed",
                function () {

                

            });
            
            it("can determine which sound is preferred based on priority", function () {

                

            });

            it("can do fade-in", function () {

                

            });
            
            it("can do fade-out", function () {

                

            });
            
            it("can do cross-fade", function () {

                

            });

        });
    }
    
});