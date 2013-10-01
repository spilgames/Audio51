(function(w, d, b) {

    var ctx = null,
        vollumeControl,
        sound1 = null,
        node1 = null, node2 = null,
        silentBytes = [82,73,70,70,52,0,0,0,87,65,86,69,102,109,116,32,16,0,0,0,1,0,1,0,64,31,0,0,128,62,0,0,2,0,16,0,100,97,116,97,16,0,0,0,0,0,1,0,254,255,2,0,254,255,2,0,255,255,0,0],
        i = 0, l = silentBytes.length,
        silence = new ArrayBuffer(l),
        bytes = new Uint8Array(silence);
    
    while (i < l) {
        bytes[i] = silentBytes[i++];
    }

    /**
     * Wrap the process of getting the sound as an array-buffer
     *  into a `Promise`.
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

    function createVolume() {
        if ( ctx == null ) {
            ctx = getContext();
            volumeControl = ctx.createGainNode();
            volumeControl.connect( ctx.destination );
        }
    }

    w.addEventListener("load", function() {
        createVolume();
        d.getElementById("l2").addEventListener("click",function() {
            volumeControl.disconnect();
        });

        createAudioBuffer( silence ).then(
            function( buffer ) {
                sound1 = buffer;
            },
            function() {
                console.error( 'Shit happend', arguments );
            } 
        );
        
        d.getElementById("l1").addEventListener("click",function() {
            var src = ctx.createBufferSource();
            src.buffer = sound1;
            src.connect( volumeControl );
            src.start?src.start( 0 ):src.noteOn( 0 );
            node2 = src;
        });

         getAudioBuffer( "samples/pulse.wav" ).then(
             function( buffer ) {
                var src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect( volumeControl );
                src.loop = true;
                src.start?src.start( 0 ):src.noteOn( 0 );
                node1 = src;
            },
            function() {
                console.error( 'Shit happend', arguments );
            }
        );
        d.getElementById("l3").addEventListener("click",function() {
            if (node1 !== null) {
                node1.stop?node1.stop( 0 ):node1.noteOff( 0 );
            }
        });
        d.getElementById("l4").addEventListener("click",function() {
            if (node2 !== null) {
                node2.stop?node2.stop( 0 ):node2.noteOff( 0 );
            }
        });

   });

}(window, document, document.body));