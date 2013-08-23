var tag = ( function( config ) {

    var tag = null,
        spriteN = 0;
    
    function armAudio( config ) {
        tag = document.createElement( "audio" );
        tag.src = config.resources[0];
        tag.play();
        tag.pause();
    }
    function playSprite( spriteName, tag, config ) {
        var sprite = config.spritemap[spriteName];
        tag.currentTime = sprite.start;
        tag.play();
    }
    function playSprite2( spriteName, tag, config ) {
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
    }

    document.documentElement.addEventListener('click',function() {
        if ( tag === null ) {
            armAudio( config );
        } else {
            if ( spriteN === 0 ) {
                playSprite( 'evllaugh', tag, config );
                spriteN++;
            } else {
                playSprite2( 'churchbell1', tag, config );
            }
        }
    } );

    return tag;
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