### Plain `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- Currently only affects SFCs
- Requires `vue-loader@>=17.0.0`

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```

---

---
url: /about/releases.md
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Releases {#releases}

<p v-if="version">
The current latest stable version of Vue is <strong>{{ version }}</strong>.
</p>
<p v-else>
Checking latest version...
</p>

A full changelog of past releases is available on [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Release Cycle {#release-cycle}

Vue does not have a fixed release cycle.

- Patch releases are released as needed.

- Minor releases always contain new features, with a typical time frame of 3~6 months in between. Minor releases always go through a beta pre-release phase.

- Major releases will be announced ahead of time, and will go through an early discussion phase and alpha / beta pre-release phases.

## Semantic Versioning Edge Cases {#semantic-versioning-edge-cases}

Vue releases follow [Semantic Versioning](https://semver.org/) with a few edge cases.
