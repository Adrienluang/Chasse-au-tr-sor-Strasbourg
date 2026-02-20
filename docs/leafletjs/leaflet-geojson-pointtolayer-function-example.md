### Leaflet GeoJSON pointToLayer Function Example

Source: https://leafletjs.com/reference

Defines how GeoJSON points are rendered as Leaflet layers. This function is called for each point feature, receiving the GeoJSON point and its LatLng. The default behavior is to create a standard L.marker. Customizations can include using different marker types or adding custom icons.

```javascript
function(geoJsonPoint, latlng) {
    return L.marker(latlng);
}
```

--------------------------------
