### Leaflet TileLayer Usage Example

Source: https://leafletjs.com/reference

Example demonstrating how to create and add a TileLayer to a Leaflet map. Includes specifying the URL template and essential options like attribution.

```javascript
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
```

--------------------------------
