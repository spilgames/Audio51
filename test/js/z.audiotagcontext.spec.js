/*global describe, it, expect, afterEach, beforeEach, runs, spyOn */
/*global waitsFor, xit, require, RSVP, console, AudioTestFramework */
describe("The audiotag/context", function () {
    'use strict';
    
    var context = null,
        Sound = null
    ;

    require(["audiotag/context", "audiotag/sound"], function(ctx, sound) {
        context = ctx;
        Sound = sound;
    });
    
    beforeEach(function () {

        waitsFor(function () {

            return context !== null;

        }, "waiting for require to load up our context", 500);

    });

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
            sound.play();

        });
        
        waitsFor(function () {

            return AudioTestFramework.getVolumeAverage() > 0;

        }, "sound to start playing", 2000);
        
        runs(function () {

            sound.stop();

        });

    });
    
    describe("audiotag/sound", function () {

        var sound = null;

        beforeEach(function() {
            
            sound = null;
            
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
            
        });

        it("can obtain the length of a sound", function () {

            expect( sound.getLength() ).toBe( 1 );

        });

    });
});
