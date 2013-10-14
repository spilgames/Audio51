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
    
    context.loadSound('../js/saw.wav').then(
        function(s) {
            saw = s;
        },
        function(e) {
            sound = false;
            console.warn(e);
        }
    );
    
    function start2() {
        saw.play();
    }
    
    function start() {
        pulse.play();
    }
    
    function addListeners(type) {
        l1.addEventListener(type, start);
        l2.addEventListener(type, start2);
    }
    
    function addTouch() {
        addListeners("touchstart");
        document.documentElement.removeEventListener("touchstart", addTouch);
        document.documentElement.addEventListener('touchstart',function(e){
            e.preventDefault();
            e.stopPropagation();
            e.returnValue = false;
            return false;
        });
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
