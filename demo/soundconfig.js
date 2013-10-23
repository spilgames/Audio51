/*global define, RSVP*/
/**
 * Soundset generated using `audiosprite -p mp3,ogg,ac3 -o sounds -e mp3,ogg,ac3 -c 2 *.ogg`
 */
require(["audio51"], function(audio51) {
    
    var sounds = [],
        l1 = document.getElementById("l1"),
        l2 = document.getElementById("l2");

    audio51.getContext( audio51.AUDIOTAG );
    audio51.loadSoundSet('sounds.json');
    
    function stop() {
        while (sounds.length) {
            sounds.pop().stop();
        }
    }
    
    function start() {
        sounds.push(audio51.play("thunder"));
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
