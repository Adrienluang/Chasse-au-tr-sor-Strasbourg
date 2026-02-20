### Create WMS Tile Layer - Leaflet.js

Source: https://leafletjs.com/reference

This example demonstrates how to create and configure a WMS (Web Map Service) tile layer using Leaflet.js. It specifies the WMS server URL and provides options such as layers, image format, transparency, and attribution. The created layer can then be added to the map.

```javascript
var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});
```

--------------------------------
