### Leaflet DivIcon Usage Example

Source: https://leafletjs.com/reference-2.0.0

Demonstrates how to create and use a custom DivIcon for a Leaflet marker. This example shows instantiating DivIcon with custom CSS class and then adding a marker with this icon to a map.

```javascript
const myIcon = new DivIcon({className: 'my-div-icon'});
// you can set .my-div-icon styles in CSS

new Marker([50.505, 30.57], {icon: myIcon}).addTo(map);
```

--------------------------------
