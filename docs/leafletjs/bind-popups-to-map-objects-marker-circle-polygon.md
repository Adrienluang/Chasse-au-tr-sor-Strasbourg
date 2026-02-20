### Bind Popups to Map Objects (Marker, Circle, Polygon)

Source: https://leafletjs.com/examples/quick-start

This code shows how to attach popups to existing Leaflet map objects like markers, circles, and polygons. The `bindPopup` method associates HTML content with an object, which appears on click. `openPopup` can be used to immediately display a marker's popup.

```javascript
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");
```

--------------------------------
