( function( ctx ) {
    
    /**
     * Wrap the process of getting the sound as an array-buffer
     * into a `Promise`.
     * 
     * @returns Promise
     * @resolves ArrayBuffer.
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
     * Wrap the audio decoding into a `Promise`.
     * 
     * @returns Promise 
     * @resolves AudioBuffer
     */
    function createAudioBuffer( binaryData ) {
        return new RSVP.Promise( function( resolve, reject ) {

            ctx.decodeAudioData( binaryData, function( buffer ) {
                resolve( buffer );
            }, function( arg ) {
                reject( arg );
            } );

        } );
    }

    /**
     * Grab audio source and decode it, using `Promise`s.
     * Basically a convenience method around `getArrayBuffer` and
     * `createAudioBuffer`.
     * 
     * @returns Promise
     * @resolves AudioBuffer
     */
    function getAudioBuffer( uri ) {
        return getArrayBuffer( uri ).then( function( binaryData ) {
            return createAudioBuffer( binaryData );
        } );
    }

    //Test the above methods ;)
    getAudioBuffer( "samples/rain.ogg" ).then( function( buffer ) {
        var src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect( ctx.destination );
        src.start( 0 );
    } );

}(
    getContext()
));