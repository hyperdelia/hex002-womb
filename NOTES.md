# Development notes

Audio
-----

If we use the [Resonance Audio Web SDK](https://developers.google.com/resonance-audio/),
we can make use of its `setListenerFromMatrix` which accepts a Three.js Matrix4 object.

* We can use createMediaElementSource to stream large files through Web Audio.
  This will only work for iOS 11.0.0 and above. Will have to check how the
  situation is on Android.

### Questions

* Should we use Tone.js for regular audio buffer management and timing purposes?

Visuals
-------

* Use Three.js
