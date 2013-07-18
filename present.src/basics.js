( function( ctx ) {

    //Get the sound
    var client = new XMLHttpRequest( );
    client.open( "GET", "samples/thunder.ogg", true );
    client.onload = function( ) {
        //decode the sound
        ctx.decodeAudioData( client.response, function( buffer ) {
            //create/connect nodes
            var src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect( ctx.destination );
            //play the sound
            src.start( 0 );
        }, function( arg ) {
            console.error( arg );
        } );
    };
    client.responseType = "arraybuffer";
    client.send();

}(
    getContext()
));