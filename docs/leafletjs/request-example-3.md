### Request Example
```javascript
// As a function
MyClass.addInitHook(function () {
    // ... custom initialization logic
    console.log('Custom initialization step 1');
});

// As a method call shortcut
MyClass.addInitHook('someMethod', 'arg1', 123);

// When an instance of MyClass is created, these hooks will be executed.
var instance = new MyClass();
```
