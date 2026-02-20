### LeafletJS FeatureGroup Usage Example

Source: https://leafletjs.com/reference-2.0.0

Demonstrates how to create and utilize a LeafletJS FeatureGroup to manage multiple layers. This example shows adding layers, binding a popup to all layers simultaneously, and attaching a click event handler to the group, which will be triggered by clicks on any member layer.

```javascript
new FeatureGroup([marker1, marker2, polyline])
    .bindPopup('Hello world!')
    .on('click', function() { alert('Clicked on a member of the group!'); })
    .addTo(map);
```

--------------------------------
