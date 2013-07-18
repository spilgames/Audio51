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

[Promises/A+](https://github.com/promises-aplus/promises-spec) to the rescue.

<script src="present.src/scriptloader.js"></script>