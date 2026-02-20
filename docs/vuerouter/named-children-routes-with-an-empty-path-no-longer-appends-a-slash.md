### Named children routes with an empty `path` no longer appends a slash

Given any nested named route with an empty `path`:

```js
const routes = [
  {
    path: '/dashboard',
    name: 'dashboard-parent',
    component: DashboardParent,
    children: [
      { path: '', name: 'dashboard', component: DashboardDefault },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: DashboardSettings,
      },
    ],
  },
]
```

Navigating or resolving to the named route `dashboard` will now produce a URL **without a trailing slash**:

```js
router.resolve({ name: 'dashboard' }).href // '/dashboard'
```

This has an important side effect about children `redirect` records like these:

```js
const routes = [
  {
    path: '/parent',
    component: Parent,
    children: [
      // this would now redirect to `/home` instead of `/parent/home`
      { path: '', redirect: 'home' },
      { path: 'home', component: Home },
    ],
  },
]
```

Note this will work if `path` was `/parent/` as the relative location `home` to `/parent/` is indeed `/parent/home` but the relative location of `home` to `/parent` is `/home`.

**Reason**: This is to make trailing slash behavior consistent: by default all routes allow a trailing slash. It can be disabled by using the `strict` option and manually appending (or not) a slash to the routes.
