/*global define, RSVP*/
define("webaudiocontext/interactive/test2", ["audiotag/context"], function(context) {
    
    var saw = null,
        pulse = null,
        l1 = document.getElementById("l1"),
        l2 = document.getElementById("l2");

    context.loadSound('../js/pulse.wav').then(
        function(s) {
            pulse = s;
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
        pulse.play();
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
