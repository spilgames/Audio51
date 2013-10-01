var getContext = (function(AC){
    var ctx = null;
    
    return function() {
        if ( ctx === null ) {
            console.log('Creating new Context');
            ctx = new AC();
        }
        return ctx;
    }
}(
    window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext
));

var getSpriteConfig = function() {
    return {
        "resources": [
            "samples/output.ogg",
            "samples/output.ac3",
            "samples/output.mp3"
        ],
        "spritemap": {
            "churchbell1": {
                "start": 0,
                "end": 2.7820408163265307,
                "loop": false
            },
            "evllaugh": {
                "start": 4,
                "end": 8.091065759637189,
                "loop": false
            }
        }
    }
}