# Stack V1 — Inventaire de référence

> Ce document liste tous les éléments de la stack V1, avec les noms de packages exacts et les URLs de documentation officielle.
> Objectif : trouver facilement les fichiers `.llms.txt` ou docs LLM de chaque outil pour éviter les hallucinations lors du développement.

---

## 1. Framework principal

| Package | Type | Rôle |
|---|---|---|
| `nuxt` | dep | Framework principal — inclut Vue 3, Vite, Vue Router, Nitro, ofetch, unhead |
| `vue` | inclus dans Nuxt | Framework UI réactif (Composition API, `<script setup>`) |
| `vue-router` | inclus dans Nuxt | Routing file-based (`pages/`) |
| `vite` | inclus dans Nuxt | Build tool (bundler, HMR) |
| `nitro` | inclus dans Nuxt | Serveur — utilisé en V2 pour les API routes (inactif en V1 SPA) |
| `ofetch` / `$fetch` | inclus dans Nuxt | HTTP client natif (remplace Axios) |
| `typescript` | inclus dans Nuxt | Typage statique |
| `@nuxt/devtools` | devDep (optionnel) | Dev tools Nuxt dans le navigateur |

**Documentation :**
- Nuxt 3 : <https://nuxt.com/docs>
- Vue 3 : <https://vuejs.org/guide>
- Vue Router : <https://router.vuejs.org>
- Vite : <https://vitejs.dev/guide>
- Nitro : <https://nitro.build/guide>
- ofetch : <https://github.com/unjs/ofetch>

**Note llms.txt :**
- Nuxt : <https://nuxt.com/llms.txt> et <https://nuxt.com/llms-full.txt>

---

## 2. CSS

| Package | Type | Rôle |
|---|---|---|
| `sass` | devDep | Compilateur SCSS (dart-sass). Nuxt le détecte automatiquement via Vite |

**Convention projet :**
- `assets/scss/global.scss` importé dans `nuxt.config.ts` → `css: ['~/assets/scss/global.scss']`
- Composants : `<style lang="scss">` **sans `scoped`** — scoping via classe racine du composant `.nom-composant { ... }`
- Pas de Tailwind, pas de CSS Modules — SCSS pur

**Documentation :**
- sass (dart-sass) : <https://sass-lang.com/documentation>

---

## 3. Carte & Navigation

| Package | Type | Rôle |
|---|---|---|
| `leaflet` | dep | Carte interactive (OpenStreetMap) — marqueurs, tracé du parcours |
| `@types/leaflet` | devDep | Types TypeScript pour Leaflet |
| `polyline` | dep | Décodage polylines encodées (réponse GraphHopper si `points_encoded: true`) |

**Services externes :**

| Service | Rôle | Notes |
|---|---|---|
| **OpenStreetMap** | Fond de carte (tiles) | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` — gratuit |
| **GraphHopper Directions API** | Calcul d'itinéraire pédestre | Free tier 10 000 req/mois — clé en `GRAPHHOPPER_API_KEY` |

**Note d'intégration :**
Leaflet est utilisé directement dans un composable avec `onMounted` — pas de wrapper Vue. En SPA mode, pas d'enjeu SSR, donc `import L from 'leaflet'` fonctionne directement.

**Documentation :**
- Leaflet : <https://leafletjs.com/reference>
- GraphHopper Directions API : <https://docs.graphhopper.com>
- polyline (npm) : <https://github.com/mapbox/polyline>

---

## 4. PWA

| Package | Type | Rôle |
|---|---|---|
| `@vite-pwa/nuxt` | dep | Service worker, manifest PWA, cache offline des assets |

**Documentation :**
- @vite-pwa/nuxt : <https://vite-pwa-org.netlify.app/frameworks/nuxt>
- vite-plugin-pwa (base) : <https://vite-pwa-org.netlify.app>

---

## 5. i18n

| Package | Type | Rôle |
|---|---|---|
| `@nuxtjs/i18n` | dep | Internationalisation FR/EN — fichiers `i18n/fr.json` et `i18n/en.json` |

**Documentation :**
- @nuxtjs/i18n : <https://i18n.nuxtjs.org>
- vue-i18n (sous-jacent) : <https://vue-i18n.intlify.dev>

---

## 6. Analytics

> **Hors scope V1** — repoussé en V2 pour éviter la complexité RGPD et les obligations de consentement associées.
> PostHog self-hosted (Dokploy) sera ajouté en V2.

---

## 7. Natif browser (aucun package npm)

| API | Rôle |
|---|---|
| `navigator.geolocation` | Suivi GPS temps réel (`watchPosition`) + calcul de proximité (Haversine) |
| `crypto.randomUUID()` | Génération UUID anonyme pour identifier la progression — pas de package `uuid` nécessaire |
| `localStorage` | Persistance de la progression hors ligne |

**Documentation MDN :**
- Geolocation API : <https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API>
- crypto.randomUUID : <https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID>
- localStorage : <https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage>

---

## 8. Outils de build / dev

| Package | Type | Rôle |
|---|---|---|
| `vue-tsc` | inclus dans Nuxt | Vérification des types TypeScript dans les fichiers `.vue` |
| `eslint` | devDep (optionnel) | Linting |
| `@nuxt/eslint` | devDep (optionnel) | Config ESLint Nuxt — intègre les règles Vue 3 + Nuxt |

**Documentation :**
- @nuxt/eslint : <https://eslint.nuxt.com>

---

## 9. Déploiement (hors npm)

| Élément | Rôle |
|---|---|
| `node:22-alpine` (image Docker) | Stage de build Nuxt (`npm run build`) |
| `nginx:alpine` (image Docker) | Serve les fichiers statiques en production (SPA — zéro Node.js) |
| Docker Compose | Orchestration : `compose.base.yml` + `compose.prod.yml` → `compose.dokploy.yml` |
| Traefik (via Dokploy) | Reverse proxy + TLS automatique |
| Cloudflare | DNS + proxy CDN + Access (protection dashboard V2) |

**Variables d'environnement (secrets Dokploy) :**

| Variable | Usage |
|---|---|
| `GRAPHHOPPER_API_KEY` | Calcul d'itinéraire — actuellement hardcodé dans `Test2.vue`, à externaliser |
| `NUXT_PUBLIC_APP_URL` | URL publique de l'application |
| `NUXT_PUBLIC_POSTHOG_KEY` | Clé publique PostHog (exposée côté client — c'est normal) |

**Documentation :**
- Docker nginx : <https://hub.docker.com/_/nginx>
- Docker node : <https://hub.docker.com/_/node>
- Nuxt deployment : <https://nuxt.com/docs/getting-started/deployment>

---

## 10. Hors scope V1 (V2+)

| Package | Version cible | Rôle |
|---|---|---|
| `drizzle-orm` + `drizzle-kit` | V2 | ORM PostgreSQL pour Nitro |
| `pg` | V2 | Driver PostgreSQL |
| `nuxt-auth-utils` | V2 | Auth admin légère |
| `@nuxtjs/tailwindcss` | — | **Non retenu** — SCSS pur |
| `axios` | — | **Remplacé** par `$fetch` natif Nuxt |
| `uuid` | — | **Remplacé** par `crypto.randomUUID()` natif browser |

**Documentation V2 (pour référence) :**
- drizzle-orm : <https://orm.drizzle.team/docs/overview>
- nuxt-auth-utils : <https://github.com/atinux/nuxt-auth-utils>

---

## 11. Checklist documentation LLM

> Cocher quand la doc est installée dans `docs/` et référencée dans `docs/index.md`.
> Pour les éléments sans lien llms.txt connu : chercher sur [context7.com](https://context7.com).

* [x] **Nuxt**
* [x] **Vite**
* [x] **Vue 3**
* [x] **Vue Router**
* [x] **Leaflet**
* [x] **sass (dart-sass)**
* [x] **@vite-pwa/nuxt**
* [x] **@nuxtjs/i18n**
* ~~**posthog-js**~~ — V2
