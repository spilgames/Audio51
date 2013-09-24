# Audio51, a no-nonsense solution for Audio in HTML5

## Unit testing

Currently there are still some bugs in the WebAudio API implmentation. Some of these came up while attempting to create an easy to use unit-testing environment. Most notably:

1. Safari failed to fire `canPlay` event if the first audio would be generated by an AudioTag node.
2. After generating sound through an Oscillator Source, after stopping and disconnecting the Oscillator, the analyzer node registers a volume of up to 100, while it should be 0.

The first of these should be taken into account when testing AudioTag implementations and they fail only in Safari. The second can easily be prevented in our current API, we only intend to support playing sound from files...