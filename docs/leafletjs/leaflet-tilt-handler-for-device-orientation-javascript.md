### Leaflet Tilt Handler for Device Orientation (JavaScript)

Source: https://leafletjs.com/examples/extending/extending-3-controls

An example of a custom Leaflet handler that pans the map based on device orientation events (Gamma and Beta angles). It attaches listeners to the window object.

```javascript
L.TiltHandler = L.Handler.extend({
    addHooks: function() {
        L.DomEvent.on(window, 'deviceorientation', this._tilt, this);
    },

    removeHooks: function() {
        L.DomEvent.off(window, 'deviceorientation', this._tilt, this);
    },

    _tilt: function(ev) {
        // Treat Gamma angle as horizontal pan (1 degree = 1 pixel) and Beta angle as vertical pan
        this._map.panBy( L.point( ev.gamma, ev.beta ) );
    }
});

```

--------------------------------
