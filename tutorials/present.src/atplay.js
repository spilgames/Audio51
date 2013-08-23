( function( config, tag ) {

    function playSprite( spriteName, tag, config ) {
        var sprite = config.spritemap[spriteName];
        tag.currentTime = sprite.start;
        tag.play();
    }

    playSprite( 'evllaugh', tag, config );

}(
    getSpriteConfig(),
    tag
));