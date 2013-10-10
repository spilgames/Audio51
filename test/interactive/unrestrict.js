/*global define, RSVP*/
define("webaudiocontext/interactive/test2", ["webaudio/context"], function(context) {
    
    var saw = null,
        pulse = null,
        l1 = document.getElementById("l1"),
        l2 = document.getElementById("l2");
    
    context.loadSound('../js/saw.wav'); //Just preloading...

    context.loadSound('../js/pulse.wav').then(
        function(s) {
            pulse = s;
            s.loop(true);
            s.play();
        },
        function(e) {
            sound = false;
            console.warn(e);
        }
    );
    
    function stop() {
        pulse.stop();
    }
    
    function start() {
        context.loadSound('../js/saw.wav').then(
            function(s) {
                s.play();
            },
            function(e) {
                sound = false;
                console.warn(e);
            }
        );
    }
    
    function addListeners(type) {
        l1.addEventListener(type, start);
        l2.addEventListener(type, stop);
    }
    
    function addTouch() {
        addListeners("touchstart");
        document.documentElement.removeEventListener("touchstart", addTouch);
    }
    
    function addClick() {
        addListeners("click");
        document.documentElement.removeEventListener("click", addClick);
    }

    document.getElementById("a1").addEventListener("click", function(){
        document.getElementById("playnow").className += " hide";
        return false;
    });


    document.documentElement.addEventListener("click", addClick);
    document.documentElement.addEventListener("touchstart", addTouch);

});
