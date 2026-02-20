### Initialize Leaflet Map and Add WMS Layer

Source: https://leafletjs.com/examples/wms/wms

This JavaScript code demonstrates how to initialize a Leaflet map and add a WMS tile layer. It requires a map container ID and WMS layer options.

```javascript
var map = L.map(mapDiv, mapOptions);

var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', wmsOptions).addTo(map);
```

--------------------------------
