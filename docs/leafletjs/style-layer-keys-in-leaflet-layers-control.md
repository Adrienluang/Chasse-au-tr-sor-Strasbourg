### Style Layer Keys in Leaflet Layers Control

Source: https://leafletjs.com/examples/layers-control

This example demonstrates how to style the text labels for layers within the Leaflet Layers Control by using HTML spans with inline styles in the layer definition objects.

```javascript
var baseMaps = {
    "OpenStreetMap": osm,
    "<span style='color: red'>OpenStreetMap.HOT</span>": osmHOT
};
```

--------------------------------
