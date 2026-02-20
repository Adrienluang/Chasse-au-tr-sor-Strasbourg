### Leaflet.js Popup Usage Examples

Source: https://leafletjs.com/reference-2.0.0

Demonstrates common ways to use Leaflet's Popup class. Includes binding popups to markers, opening them on click, creating standalone popups, and setting their content and location.

```javascript
marker.bindPopup(popupContent).openPopup();
```

```javascript
const popup = new Popup()
    .setLatLng(latlng)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(map);
```

```javascript
const popup = new Popup(latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>'})
    .openOn(map);
```

--------------------------------
