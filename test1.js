( function( AC ) {

    var ctx = null;
    if ( AC ) {
        ctx = new AC( );
        console.log( "Created context", ctx );
    } else {
        console.warn( "No Audio API!!!" );
    }

    
    /**
     * Wrap the process of getting the sound as an array-buffer into a Promise.
     */
    function getArrayBuffer( uri ) {
        return new RSVP.Promise( function( resolve, reject ) {

            var client = new XMLHttpRequest( );
            client.open( "GET", uri, true );
            client.onload = function( ) {
                resolve( client.response );
            };
            client.responseType = "arraybuffer";
            client.send();

        } );
    }

    /**
     * Grab the source of the audio using XHR via the getArrayBuffer method and then
     * wrap the decoding into a promise which is returned.
     */
    function getAudioBuffer( uri ) {
        return getArrayBuffer( uri ).then( function( binaryData ) {
            return new RSVP.Promise( function( resolve, reject ) {

                ctx.decodeAudioData( binaryData, function( buffer ) {
                    resolve( buffer );
                }, function( arg ) {
                    reject( arg );
                } );

            } );
        } );
    }

    //Test the above methods ;)
    getAudioBuffer( "samples/rain.ogg" ).then( function( arg ) {
        var src = ctx.createBufferSource();
        src.buffer = arg;
        src.connect( ctx.destination );
        src.start( 0 );
        console.log( 'test' );
    } );

}(
    window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext
));