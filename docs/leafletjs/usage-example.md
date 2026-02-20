### Usage example

```javascript
var myPositionMarker = L.marker([48.864716, 2.294694]).addTo(map);

myPositionMarker.on("click", function() {
    var pos = map.latLngToLayerPoint(myPositionMarker.getLatLng());
    pos.y -= 25;
    var fx = new L.PosAnimation();

    fx.once('end',function() {
        pos.y += 25;
        fx.run(myPositionMarker._icon, pos, 0.8);
    });

    fx.run(myPositionMarker._icon, pos, 0.3);
});
```
```

--------------------------------
