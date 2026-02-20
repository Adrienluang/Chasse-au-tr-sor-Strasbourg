### Usage of `history.state`

Vue Router saves information on the `history.state`. If you have any code manually calling `history.pushState()`, you should likely avoid it or refactor it with a regular `router.push()` and a `history.replaceState()`:

```js
// replace
history.pushState(myState, '', url)
// with
await router.push(url)
history.replaceState({ ...history.state, ...myState }, '')
```

Similarly, if you were calling `history.replaceState()` without preserving the current state, you will need to pass the current `history.state`:

```js
// replace
history.replaceState({}, '', url)
// with
history.replaceState(history.state, '', url)
```

**Reason**: We use the history state to save information about the navigation like the scroll position, previous location, etc.
