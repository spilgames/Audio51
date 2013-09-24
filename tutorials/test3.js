( function( AC ) {

    var ctx = new window.AudioContext( );

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
            reject( arg );
        } );
    };
    client.responseType = "arraybuffer";
    client.send();

}(
    window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext
));