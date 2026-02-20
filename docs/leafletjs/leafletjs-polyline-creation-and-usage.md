### LeafletJS Polyline Creation and Usage

Source: https://leafletjs.com/reference

Demonstrates how to create and use LeafletJS Polylines, which are used for drawing lines on a map. The examples show creating a simple polyline with a specified color and fitting the map bounds to it. It also illustrates how to create multi-dimensional polylines.

```javascript
// create a red polyline from an array of LatLng points
var latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];

var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());


```

```javascript
// create a red polyline from an array of arrays of LatLng points
var latlngs = [
    [[45.51, -122.68],
     [37.77, -122.43],
     [34.04, -118.2]],
    [[40.78, -73.91],
     [41.83, -87.62],
     [32.76, -96.72]]
];


```

--------------------------------
