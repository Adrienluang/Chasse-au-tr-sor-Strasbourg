### Leaflet: Create GridLayer with Asynchronous Tile Initialization

Source: https://leafletjs.com/examples/extending/extending-2-layers

This JavaScript snippet demonstrates how to implement asynchronous initialization for a custom L.GridLayer's tiles using the 'done' callback. It shows how to return a tile element after a delay, simulating asynchronous operations like data fetching or image loading. Dependencies include the Leaflet library and standard JavaScript.

```javascript
createTile: function (coords, done) {
    var tile = document.createElement('div');
    tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
    tile.style.outline = '1px solid red';

    setTimeout(function () {
        done(null, tile);    // Syntax is 'done(error, tile)'
    }, 500 + Math.random() * 1500);

    return tile;
}
```

--------------------------------
