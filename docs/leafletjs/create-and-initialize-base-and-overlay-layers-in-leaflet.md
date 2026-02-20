### Create and Initialize Base and Overlay Layers in Leaflet

Source: https://leafletjs.com/examples/layers-control

This code demonstrates how to create TileLayer objects for base maps (e.g., OpenStreetMap, OpenStreetMap.HOT) and how to initialize a map with specific layers. It also shows the creation of objects to hold references to base layers and overlay layers for use with the Layers Control.

```javascript
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [osm, cities]
});

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT
};

var overlayMaps = {
    "Cities": cities
};
```

--------------------------------
