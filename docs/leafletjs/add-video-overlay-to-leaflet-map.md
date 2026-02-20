### Add Video Overlay to Leaflet Map

Source: https://leafletjs.com/examples/overlays

This example demonstrates adding a video overlay to a Leaflet map. It uses `L.VideoOverlay` and accepts an array of video URLs, geographical bounds, and various options like opacity, autoplay, and muted playback. The video overlay extends `L.ImageOverlay` and utilizes the HTML5 `<video>` element.

```javascript
var videoUrls = [
    'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
    'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
];
var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
var latLngBounds = L.latLngBounds([[32, -130], [13, -100]]);

var videoOverlay = L.videoOverlay(videoUrls, latLngBounds, {
    opacity: 0.8,
    errorOverlayUrl: errorOverlayUrl,
    interactive: true,
    autoplay: true,
    muted: true,
    playsInline: true
}).addTo(map);
```

--------------------------------
