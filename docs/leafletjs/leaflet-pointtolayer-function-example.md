### Leaflet pointToLayer Function Example

Source: https://leafletjs.com/reference-2.0.0

Defines how GeoJSON points are converted into Leaflet layers. This function is called internally for each GeoJSON point feature, receiving the feature and its LatLng coordinates. The default behavior is to create a standard Leaflet Marker.

```javascript
function(geoJsonPoint, latlng) {
    return new Marker(latlng);
}
```

--------------------------------
