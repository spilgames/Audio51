( function( ctx ) {

    var src = null;
        gainNode = ctx.createGain();
    
    gainNode.connect( ctx.destination );
    
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
        }, function ( ) {
            console.error( "failed to load sample", arguments );
        } );
    }

    //Test the above methods ;)
    getAudioBuffer( "samples/spacey-synth.ogg" ).then( function( buffer ) {
        src = ctx.createBufferSource();
        src.loop = true;
        src.buffer = buffer;
        src.connect( gainNode );
        src.start( 0 );
    }, function ( ) {
        console.error( "failed to decode sample", arguments );
    } );
    
    function fade(fromV, toV) {
        var now = ctx.currentTime;
        gainNode.gain.setValueAtTime(fromV, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(toV, now + 1.2);
    }
    
    function fadeIn() {
        src.start( 0 );
        fade( 0.001, 1 );
    }
    
    function fadeOut() {
        fade( 1, 0.001 );
        src.stop( ctx.currentTim + 1.3 );
    }

    document.documentElement.addEventListener( 'click', function() {
        if (gainNode.gain.value >= 0.5 ) {
            fadeOut();
        } else {
            fadeIn();
        }
    } );

}(
    getContext()
));