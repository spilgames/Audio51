( function( config, tag ) {

    function playSprite( spriteName, tag, config ) {
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

    playSprite( 'churchbell1', tag, config );

}(
    getSpriteConfig(),
    tag
));