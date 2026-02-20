### Initializing Prosthetic-Hand Library

Source: https://leafletjs.com/2016/03/20/debugging-touch-interactions

This JavaScript code initializes the prosthetic-hand library, creating a new 'Hand' instance. It demonstrates how to specify a timing mode, such as 'frame', which controls the granularity of event dispatching. This is the first step in using the library to simulate user interactions.

```javascript
var h = new Hand({ timing: 'frame' });

```

--------------------------------
