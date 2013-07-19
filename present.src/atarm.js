var tag = ( function( config ) {

    var tag = null,
        spriteN = 0;
    
    function armAudio( config ) {
        tag = document.createElement( "audio" );
        tag.src = config.resources[0];
        tag.play();
        tag.pause();
        alert("Armed and ready!");
    }

    armAudio( config );

    return tag;

}(
    getSpriteConfig()
));