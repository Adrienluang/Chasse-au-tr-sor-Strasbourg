### Request Example
#### Default Usage
```javascript
const map = new Map('map', {
    renderer: new SVG()
});
```

#### Custom Usage
```javascript
const map = new Map('map');
const myRenderer = new SVG({ padding: 0.5 });
const line = new Polyline(coordinates, { renderer: myRenderer });
const circle = new Circle(center, { renderer: myRenderer, radius: 100 });
```
