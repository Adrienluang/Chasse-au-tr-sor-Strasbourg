# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

L'application elle même en nuxt est dans le dossier ./App

## Script d'installation des documentations

### Nuxt
```shell
curl https://nuxt.com/llms-full.txt > docs/nuxt.md;
node ./script/md_split.mjs docs/nuxt.md docs/nuxt '#';
rm docs/nuxt.md
echo "* [Nuxt](./nuxt/index.md)" >> docs/index.md
```

### reka-ui
```shell
curl https://reka-ui.com/llms-full.txt > docs/reka-ui.md;
node ./script/md_split.mjs docs/reka-ui.md docs/reka-ui '#';
rm docs/reka-ui.md
echo "* [reka-ui](./reka-ui/index.md)" >> docs/index.md
```

### Nuxt Content
```shell
curl https://content.nuxt.com/llms-full.txt > docs/content.nuxt.md && \
node ./script/md_split.mjs docs/content.nuxt.md docs/nuxt_content '#' && \
rm docs/content.nuxt.md && \
echo "* [Nuxt Content](./nuxt_content/index.md)" >> docs/index.md;
```

### Vite
```shell
curl https://vite.dev/llms-full.txt > docs/vite.md && \
node ./script/md_split.mjs docs/vite.md docs/vite '#' && \
rm docs/vite.md && \
echo "* [Vite](./vite/index.md)" >> docs/index.md;
```

### Vitest
```shell
curl https://vitest.dev/llms-full.txt > docs/vitest.md && \
node ./script/md_split.mjs docs/vitest.md docs/vitest '#' && \
rm docs/vitest.md && \
echo "* [Vitest](./vitest/index.md)" >> docs/index.md;
```

### tsup
```shell
curl https://context7.com/websites/tsup_egoist_dev/llms.txt > docs/tsup.md && \
node ./script/md_split.mjs docs/tsup.md docs/tsup '###' && \
rm docs/tsup.md && \
echo "* [tsup](./tsup/index.md)" >> docs/index.md;
```

### typescript
```shell
curl https://context7.com/websites/typescriptlang/llms.txt > docs/typescript.md && \
node ./script/md_split.mjs docs/typescript.md docs/typescript '###' && \
rm docs/typescript.md && \
echo "* [typescript](./typescript/index.md)" >> docs/index.md;
```

### node
```shell
curl https://context7.com/websites/nodejs_api/llms.txt > docs/node.md && \
node ./script/md_split.mjs docs/node.md docs/node '###' && \
rm docs/node.md && \
echo "* [node](./node/index.md)" >> docs/index.md;
```

### culori
```shell
curl https://context7.com/evercoder/culori/llms.txt > docs/culori.md && \
node ./script/md_split.mjs docs/culori.md docs/culori '###' && \
rm docs/culori.md && \
echo "* [culori](./culori/index.md)" >> docs/index.md;
```

### Vuejs
```shell
curl https://vuejs.org/llms-full.txt > docs/vuejs.md && \
node ./script/md_split.mjs docs/vuejs.md docs/vuejs '###' && \
rm docs/vuejs.md && \
echo "* [vuejs](./vuejs/index.md)" >> docs/index.md;
```

### Vuerouter
```shell
curl https://router.vuejs.org/llms-full.txt > docs/vuerouter.md && \
node ./script/md_split.mjs docs/vuerouter.md docs/vuerouter '###' && \
rm docs/vuerouter.md && \
echo "* [Vue router](./vuerouter/index.md)" >> docs/index.md;
```

### Leaflet
```shell
curl https://context7.com/websites/leafletjs/llms.txt > docs/leafletjs.md && \
node ./script/md_split.mjs docs/leafletjs.md docs/leafletjs '###' && \
rm docs/leafletjs.md && \
echo "* [Leaflet](./leafletjs/index.md)" >> docs/index.md;
```


### Sass
```shell
curl https://context7.com/sass/sass > docs/sass.md && \
node ./script/md_split.mjs docs/sass.md docs/sass '###' && \
rm docs/leafletjs.md && \
echo "* [Sass](./sass/index.md)" >> docs/index.md;
```

