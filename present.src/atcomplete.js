/**
 * Quick and dirty audio playback using sprites. Includes
 * arming of audio.
 * First time you try to play audio it will arm the audio
 * tag and return false. Will return true when already armed
 * and actually playing the sprite.
 * If called with 'null' as spriteName it will (re)arm the
 * audio tag and return false.
 */
var playAudioBySpriteName = ( function( config ) {

    var tag = null;

    /**
     * (re)Arm the audio tag.
     */
    function armAudio( ) {
        tag = document.createElement( "audio" );
        tag.src = config.resources[0];
        tag.play();
        tag.pause();
        return false;
    }

    /**
     * Play a sprite by name as defined in config. No safeties
     * have been built in.
     */
    function playSprite( spriteName ) {
        if ( tag === null || spriteName === null ) return armAudio();
        var sprite = config.spritemap[spriteName];
        tag.currentTime = sprite.start;
        tag.play();
        function monitorPlayBack() {
            if (tag.currentTime < sprite.end) {
                requestAnimationFrame(monitorPlayBack);
            } else {
                tag.pause();
            }
        }
        monitorPlayBack();
        return true;
    }

    return function( spriteName ) {
        playSprite( spriteName );
    };

}(
    {
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
));