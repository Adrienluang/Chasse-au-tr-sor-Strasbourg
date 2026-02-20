### Removal of unnamed parameters

Due to the removal of `path-to-regexp`, unnamed parameters are no longer supported:

* `/foo(/foo)?/suffix` becomes `/foo/:_(foo)?/suffix`
* `/foo(foo)?` becomes `/foo:_(foo)?`
* `/foo/(.*)` becomes `/foo/:_(.*)`

:::tip
Note you can use any name instead of `_` for the param. The point is to provide one.
:::
