### LeafletJS TileLayer.WMS Usage Example

Source: https://leafletjs.com/reference-2.0.0

Demonstrates how to create and configure a TileLayer.WMS object to display data from a WMS service on a Leaflet map. This involves specifying the WMS server URL and providing options such as the desired layers, image format, transparency, and attribution. The example shows the instantiation of a weather data layer.

```javascript
const nexrad = new TileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});
```

--------------------------------
