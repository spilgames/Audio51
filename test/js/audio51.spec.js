/*global describe, it, expect, afterEach, beforeEach, runs, spyOn, waitsFor, require */
/*global AudioContext*/
describe("The Audio51 framework", function () {
    'use strict';
    
    var context = null;
    require(["audio51"], function(ctx) {
        context = ctx;
    });
    
    beforeEach(function () {

        waitsFor(function () {

            return context !== null;

        }, "waiting for require to load up our context", 500);

    });

    it("can load audio", function () {
        var done = null;
        
        runs(function () {

            context.loadAudio("test/js/testsample.mp3").then(
                function(sprites) {
                    done = sprites;
                },
                function(sprites) {
                    done = false; //fail...
                }
            );

        });

        waitsFor(function () {

            return done !== null;

        }, "audio to load", 1000);

        runs(function () {

            console.log(done);
            expect(Array.isArray(done)).toBeTruthy();
            expect(done.length).toBeGreaterThan(0);

        });

    });
    
    it("can play audio", function () {

        var sprite = null;

        runs(function () {

            context.loadAudio("test/js/testsample.mp3").then(
                function(sprites) {
                    done = sprites;
                },
                function(sprites) {
                    done = false; //fail...
                }
            );

        });

        waitsFor(function () {

            return done !== null;

        }, "audio to load", 1000);

        runs(function () {

            console.log(done);
            expect(Array.isArray(done)).toBeTruthy();
            expect(done.length).toBeGreaterThan(0);

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