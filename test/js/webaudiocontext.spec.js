/*global describe, it, expect, afterEach, beforeEach, runs, spyOn */
/*global waitsFor, xit, RSVP, console, AudioTestFramework */
describe("The webaudio/context", function () {
    'use strict';
    
    var context = null,
        Sound = null
    ;

    require(["webaudio/context", "webaudio/sound"], function(ctx, sound) {
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

            context.loadSound('test/js/testsample.mp3').then(
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
            expect( sound instanceof Sound ).toBe( true );
            sound.play();

        });
        
        waitsFor(function () {

            return sound.context.destination.getVolumeAverage() > 0;

        }, "sound to start playing", 2000);
        
        runs(function () {

            sound.stop();

        });

    });
});
