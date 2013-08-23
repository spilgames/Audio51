( function(  ) {

    document.documentElement.addEventListener('click',function() {
        var tag = document.createElement( "audio" );
        tag.src = "samples/thunder.ogg";
        tag.play();
    })

}( ));