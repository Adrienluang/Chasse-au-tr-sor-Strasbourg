### Handle Map Click Events in Leaflet (with Popup)

Source: https://leafletjs.com/examples/quick-start

This improved event handling example shows how to display a popup with click coordinates instead of an alert. It defines a popup instance and an `onMapClick` function that updates the popup's position and content with the click coordinates and opens it on the map. This provides a more integrated user experience.

```javascript
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);
```

--------------------------------
