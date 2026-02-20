### Handle Map Click Events in Leaflet (with Alert)

Source: https://leafletjs.com/examples/quick-start

This code sets up an event listener for map clicks in Leaflet. When the map is clicked, the `onMapClick` function is executed, which displays an alert box showing the latitude and longitude of the click location. It requires a map object and a click event handler.

```javascript
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);
```

--------------------------------
