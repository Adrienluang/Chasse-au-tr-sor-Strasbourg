### Create and Open a Standalone Popup in Leaflet

Source: https://leafletjs.com/examples/quick-start

This snippet demonstrates creating and displaying a popup as a standalone layer on a Leaflet map. It uses `L.popup()` to create a popup instance, sets its position and content, and then opens it on the map using `openOn`. This method handles automatic closing of previously opened popups.

```javascript
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);
```

--------------------------------
