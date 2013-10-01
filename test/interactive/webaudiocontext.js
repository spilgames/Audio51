/*global define, RSVP*/
define("webaudiocontext/interactive/test1", ["webaudio/context"], function(context) {
    
    var saw = null,
        pulse = null;
    
    context.loadSound('../js/saw.wav').then(
        function(s) {
            saw = s;
        },
        function(e) {
            sound = false;
            console.warn(e);
        }
    );

    context.loadSound('../js/pulse.wav').then(
        function(s) {
            pulse = s;
            s.play();
        },
        function(e) {
            sound = false;
            console.warn(e);
        }
    );
    
    document.getElementById("l1").addEventListener("click", function(){
        saw.play();
    });
    document.getElementById("l2").addEventListener("click", function(){
        saw.stop();
        pulse.stop();
    });
    
});
