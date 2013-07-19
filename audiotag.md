# Audio Tag Examples
## A quick summary of what needs to be done.

---

## The basics

```javascript
var tag = document.createElement( "audio" );
tag.src = "samples/thunder.ogg";
tag.play();
```

[Source](present.src/atbasics.js)

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

---

<script src="present.src/rsvp.js"></script><script src="present.src/scriptloader.js"></script><script src="present.src/sugar.js"></script>