### Usage Examples

**1. Using Canvas by default for all paths in the map:**
```javascript
const map = new Map('map', {
    renderer: new Canvas()
});
```

**2. Using a Canvas renderer with extra padding for specific vector geometries:**
```javascript
const map = new Map('map');
const myRenderer = new Canvas({ padding: 0.5 });
const line = new Polyline(coordinates, { renderer: myRenderer });
const circle = new Circle(center, { renderer: myRenderer, radius: 100 });
```
```

--------------------------------
