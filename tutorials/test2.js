( function( AC ) {

    var ctx = new AC( );

    new RSVP.Promise( function( resolve, reject ) {

        //Get the sound
        var client = new XMLHttpRequest( );
        client.open( "GET", "samples/thunder.ogg", true );
        client.onload = function( ) {
            //resolve promise and pass raw data
            resolve( client.response );
        };
        client.responseType = "arraybuffer";
        client.send();

    } ).then (
        
        //Parse the raw data
        function( binaryData ) {
            return new RSVP.Promise( function( resolve, reject ) {
                ctx.decodeAudioData( binaryData, function( buffer ) {
                    //resolve promise and pass buffer
                    resolve( buffer );
                }, function( arg ) {
                    reject( arg );
                } );
            } );
        }

    ).then(
        
        //Play the sound
        function( arg ) {
            var src = ctx.createBufferSource();
            src.buffer = arg;
            src.connect( ctx.destination );
            src.start( 0 );
        }

    ).then(null, function( error ) {
        console.error( error );
    });

}(
    window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext
));