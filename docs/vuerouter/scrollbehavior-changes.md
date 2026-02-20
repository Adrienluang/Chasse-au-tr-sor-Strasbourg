### `scrollBehavior` changes

The object returned in `scrollBehavior` is now similar to [`ScrollToOptions`](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions): `x` is renamed to `left` and `y` is renamed to `top`. See [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0035-router-scroll-position.md).

**Reason**: making the object similar to `ScrollToOptions` to make it feel more familiar with native JS APIs and potentially enable future new options.
