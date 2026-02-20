### Leaflet VideoOverlay Usage Example

Source: https://leafletjs.com/reference-2.0.0

A basic example demonstrating how to create and add a video overlay to a Leaflet map. It utilizes the VideoOverlay class with a video URL and geographical bounds.

```javascript
const videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm';
const videoBounds = [[ 32, -130], [ 13, -100]];
new VideoOverlay(videoUrl, videoBounds ).addTo(map);
```

--------------------------------
