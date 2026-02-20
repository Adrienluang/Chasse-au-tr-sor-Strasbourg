### Basic Leaflet Map Initialization

Source: https://leafletjs.com/examples/choropleth

Initializes a Leaflet map on a specified HTML element ('map') and sets its initial view. It also adds a tile layer from OpenStreetMap and includes necessary attribution.

```javascript
var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.geoJson(statesData).addTo(map);
```

--------------------------------
