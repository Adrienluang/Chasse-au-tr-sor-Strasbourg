### LeafletJS Transformation Object Usage

Source: https://leafletjs.com/reference

Demonstrates the usage of the L.transformation object for applying and reversing affine transformations on points. Includes examples of creating a transformation matrix and transforming points.

```javascript
var transformation = L.transformation(2, 5, -1, 10),
    p = L.point(1, 2);

var p2 = transformation.transform(p); // Applies the transformation
console.log(p2); // L.point(7, 8)

var p3 = transformation.untransform(p2); // Reverses the transformation
console.log(p3); // L.point(1, 2)
```

--------------------------------
