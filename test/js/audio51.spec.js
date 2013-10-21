/*global describe, it, expect, afterEach, beforeEach, runs, spyOn, waitsFor, require */
/*global AudioContext, AudioTestFramework, console, xit*/
describe("The Audio51 framework", function () {
    'use strict';
    
    var audio51 = null,
        context = null,
        contextTypes = [1, 2],
        contextType = null,
        i
    ;

    require(["audio51"], function(a51) {
        audio51 = a51;
        context = audio51.getContext();
    });
    
    beforeEach(function () {

        waitsFor(function () {

            return audio51 !== null;

        }, "waiting for require to load up our context and silence to commense", 500);
        
        runs(function () {

            if (context === null) {
                context = audio51.getContext();
            }

        });

    });
    
    describe("can load a sound in ", function () {

        //TODO Figure out why this test causes 'loud silence'
        //(volume over 80 while no sound is playing)
        xit("webaudio context", function () {

            runs(function () {

                context = audio51.getContext( 1 );

            });

        });

        it("audiotag context", function () {

            runs(function () {

                context = audio51.getContext( 2 );

            });

        });
        
        afterEach(function () {

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
            waitsFor(function () {

                return AudioTestFramework.getVolumeAverage() === 0;

            }, "silence", 1500);

        });

    });
    
    describe("can play a sprite in ", function () {
        
        it("webaudio context", function () {

            runs(function () {

                context = audio51.getContext( 1 );

            });

        });

        it("audiotag context", function () {

            runs(function () {

                context = audio51.getContext( 2 );

            });

        });

        afterEach( function () {

            var parsed = null,
                sound = null;
            
            runs(function () {

                audio51.loadSoundSet("test/js/testsprite.json").then(
                    function( set ) {
                        parsed = set;
                    },
                    function( fail ) {
                        console.error( fail );
                    }
                );

            });
            
            waitsFor(function () {

                return parsed !== null;

            }, "sound-set to finish loading", 1000);
            
            runs(function () {

                expect( typeof parsed ).toBe( 'object' );
                sound = audio51.play('saw');

            });

            waitsFor(function () {

                return AudioTestFramework.getVolumeAverage() > 0;

            }, "sound to start playing", 1000);
            
            runs(function () {

                sound.stop();

            });

        } );

    });

    it("can play multiple streams", function () {

        

    });

    it("can do fade-in", function () {

        

    });
    
    it("can do fade-out", function () {

        

    });
    
    it("can do cross-fade", function () {

        

    });

    it("can override existing stream, when only 1 stream is allowed", function () {

        

    });
    
    
    it("can be configured to prefer existing sprite, when only 1 stream is allowed",
        function () {

        

    });
    
    it("can determine which sound is preferred based on priority", function () {

        

    });
    
});