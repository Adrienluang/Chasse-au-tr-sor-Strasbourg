### Leaflet VideoOverlay Constructor

Source: https://leafletjs.com/reference-2.0.0

Illustrates the instantiation of a Leaflet VideoOverlay. The constructor accepts a video source (URL, array of URLs, or HTMLVideoElement), geographical bounds, and optional configuration options.

```javascript
const videoElement = document.createElement('video');
videoElement.src = 'path/to/your/video.mp4';
const bounds = [[51.5, -0.1], [51.4, -0.0]];
const videoOverlay = new VideoOverlay(videoElement, bounds, {
  autoplay: true,
  loop: true,
  muted: false
});
videoOverlay.addTo(map);
```

--------------------------------
