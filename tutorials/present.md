# Audio Tag Examples
## A quick summary of what needs to be done.

---

## The basics

```javascript
var tag = document.createElement( "audio" );
tag.src = "samples/thunder.ogg";
tag.play();
```

[atbasics.js](present.src/atbasics.js)

---

## So, what's wrong?

1. On Mobile, lag is induced between loading and playing
2. On Mobile you can only load a new sound on user interaction
3. On Mobile you can only have 1 audio tag playing at a time

## What to do?

- Audio-sprites can combat most of these problems. 
- Pre-load the sprite on any user-interaction
- fire of effects whenever you need.


---

## Creating audio-sprites

I recommend using [tonistiigi/audiosprite](https://github.com/tonistiigi/audiosprite)

- `audiosprite -e ac3,ogg,mp3 churchbell1.ogg evllaugh.ogg`
- Automatically padded with silence
- JSON generated with start/stop times

---

- Arm the sounds [atarm.js](present.src/atarm.js)

```javascript
document.documentElement.addEventListener('click',function() {
    tag.src = config.resources[0];
    tag.play();
    tag.pauze();
} );
```
- Seek and play [atplay.js](present.src/atplay.js)

```javascript
var sprite = config.spritemap[spriteName];
tag.currentTime = sprite.start;
tag.play();
```
- Monitor and pause [atmonitor.js](present.src/atmonitor.js)

```javascript
function monitorPlayBack() {
    if (tag.currentTime < sprite.end) {
        requestAnimationFrame(monitorPlayBack);
    } else {
        tag.pause();
    }
}
```


---

```javascript
var tag = null;

function armAudio( ) {
    tag = document.createElement( "audio" );
    tag.src = config.resources[0];
    tag.play();
    tag.pause();
    return false;
}

function playSprite( spriteName ) {
    if (tag === null) return armAudio();
    var sprite = config.spritemap[spriteName];
    tag.currentTime = sprite.start;
    tag.play();
    function monitorPlayBack() {
        if (tag.currentTime < sprite.end) {
            requestAnimationFrame(monitorPlayBack);
        } else {
            tag.pause();
        }
    }
    monitorPlayBack();
    return true;
}
```

---

## Here Be Dragons

- [This example](present.src/atcomplete.js?rough) is lacking some safeties, for instance in handling already playing.
- Chrome requires that a server supports [byte range request](https://developer.mozilla.org/en-US/docs/Configuring_servers_for_Ogg_media#Handle_HTTP_1.1_byte_range_requests_correctly)
- Not all audio formats are supported equally well, so you'll need to check and serve the correct type
- When switching tabs/windows sound will keep playing as getAnimationFrame gets paused...

---

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

[basics.js](present.src/basics.js)

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

Looks much better, right? And it works too: [basicpromises.js](present.src/basicpromises.js), which can be mixed with [basics.js](present.src/basics.js)

---

## Some of the sound basics

- Looping, just set src.loop = true;
- Fading, put a gainsource between your source and destination.
- Timing, is a little more tricky! But basically .start(n) will allow you to fire the sound at a later time.
- Generating sound. So many ways to go about this! OscillatorNode, JavascriptNode, or even writing your own ArrayBuffer and decoding it.

---

<script src="present.src/rsvp.js"></script><script src="present.src/scriptloader.js"></script><script src="present.src/sugar.js"></script>