### Leaflet Tooltip Example (JavaScript)

Source: https://leafletjs.com/2016/09/27/leaflet-1.0-final

Shows how to create and use the `L.Tooltip` class in Leaflet for dynamic labeling on map features. This feature is useful for displaying information when interacting with map elements.

```javascript
var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindTooltip("A pretty CSS3 tooltip.").openTooltip();

var popup = L.popup()
    .setLatLng([51.515, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);
```

--------------------------------
