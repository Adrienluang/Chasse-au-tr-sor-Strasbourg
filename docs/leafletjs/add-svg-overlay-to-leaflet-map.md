### Add SVG Overlay to Leaflet Map

Source: https://leafletjs.com/examples/overlays

This example shows the basic usage for adding an SVG overlay to a Leaflet map using `L.svgOverlay`. It requires an SVG element, geographical bounds, and optional configuration. The SVG element must have a viewBox attribute for proper scaling.

```javascript
var svgOverlay = L.svgOverlay(SVGElement, svgElementBounds, options);
```

--------------------------------
