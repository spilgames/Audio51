# HTML5 Audio Examples
## A quick summary of what needs to be done.

---

## The basics

```javascript
//Get the sound
var ctx = new window.AudioContext( ),
    client = new XMLHttpRequest( );
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
```

[Source](present.src/basics.js)

---

## What happened?

1. Raw sound is retreived using XHR
2. Sound is decoded and returned as a buffer
3. Source node is created
4. Sound(buffer) is assigned to Source node
5. Source node destination is set to speakers
6. Sound gets played.

---

## Chopping up

- Some steps are a-syncronous
- Some steps have callbacks
- Developers like 'sameness'

[Promises/A+](https://github.com/promises-aplus/promises-spec) to the rescue. I'll be using [RSVP](https://github.com/tildeio/rsvp.js/) in my examples because that's what I'm familiar with.

---

## Grabbing sound over XHR

```javascript
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
```

---

## Decode Audio

```javascript
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

```

---

## Convenience Method

```javascript
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
```
Since the most common situations require that you grab and decode…

---

## Making it Rain

```javascript
getAudioBuffer( "samples/rain.ogg" ).then( function( buffer ) {
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect( ctx.destination );
    src.start( 0 );
} );
```

Looks much better, right? And it works too: [basicpromises.js](present.src/basicpromises.js)

---


<script src="present.src/rsvp.js"></script><script src="present.src/scriptloader.js"></script>