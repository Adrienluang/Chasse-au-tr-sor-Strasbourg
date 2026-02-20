# TODO — Implémentation V1 Chasse au Trésor Strasbourg

> Document de suivi par phases. Cocher `[x]` au fur et à mesure.

---

## ⚠️ Convention coordonnées GPS

**Stockage interne : `[lat, lng]`** (format Leaflet natif).
**Appel GraphHopper : `[lng, lat]`** — conversion explicite uniquement au moment de l'appel, avec des noms de variables clairs (`latLng` vs `lngLat`). Pas de `.reverse()` implicite.

**Waypoint "Rue des Tanneurs" :** coordonnées à vérifier sur le terrain (marquées TODO dans le prototype v0).

---

## Phase 0 — Configuration Nuxt 4

* [x] Installer `sass` (`npm install -D sass`)
* [x] Créer `App/assets/scss/global.scss` (reset minimal + variables)
* [x] Configurer `nuxt.config.ts` : SPA mode (`ssr: false`), import SCSS global, préparation futurs modules
* [x] Remplacer `<NuxtWelcome/>` par `<NuxtPage/>` dans `app.vue`
* [x] Créer `app/layouts/default.vue`
* [x] Créer `App/.env` avec `GRAPHHOPPER_API_KEY`
* [x] Ajouter `.env` dans `.gitignore` (vérifier)

**Test :** `npm run dev` démarre sans erreur, page vide s'affiche dans le navigateur.

**Critère de succès :** Nuxt tourne en SPA avec SCSS fonctionnel et layout par défaut.

---

## Phase 1 — Données & composables fondamentaux

* [x] Créer le type `Waypoint` (`id`, `name`, `coords: [lat, lng]`, `description`, `imageHint`) → `app/types/waypoint.ts`
* [x] Créer `app/data/parcours.ts` — les 17 waypoints avec coordonnées `[lat, lng]`
* [x] Créer `app/composables/useProgression.ts` — CRUD localStorage (UUID joueur, checkpoints validés, locale, flag onboarding)
* [x] Créer `app/composables/useGeolocation.ts` — `watchPosition` + calcul distance Haversine + debounce
* [x] Créer fonction utilitaire de conversion `toGraphHopperCoords(latLng): [lng, lat]` → `app/utils/coords.ts` (+ `haversineDistance`)
* [x] Écrire tests Vitest pour `useProgression` (mock localStorage) → `tests/useProgression.test.ts`
* [x] Écrire test Vitest pour le calcul Haversine (distances connues) → `tests/coords.test.ts`
* [x] Écrire test Vitest pour `toGraphHopperCoords` (vérifier inversion) → `tests/coords.test.ts`

**Critère de succès :** Composables importables sans erreur, tests passent.

---

## Phase 2 — Carte interactive (S07)

* [ ] Installer `leaflet` + `@types/leaflet` (`npm install leaflet @types/leaflet`)
* [ ] Créer `app/components/LeafletMap.vue` — initialisation carte, tuiles OSM, centrage Strasbourg
* [ ] Intégrer appel GraphHopper — tracé itinéraire pédestre avec les 17 waypoints (conversion `[lng, lat]` explicite)
* [ ] Décoder polyline GraphHopper et afficher tracé bleu sur la carte
* [ ] Créer `app/components/CheckpointMarker.vue` — marqueur avec statut (verrouillé / actif / validé)
* [ ] Créer `app/components/ProgressBar.vue` — barre X/17
* [ ] Créer `app/components/DiscoverButton.vue` — visible si distance < 80m du checkpoint actif
* [ ] Créer `app/components/GpsStatus.vue` — indicateur état GPS (actif / inactif / erreur)
* [ ] Créer `app/pages/map.vue` — assemblage de tous les composants carte
* [ ] Test E2E Playwright : page `/map` charge, carte visible, marqueurs présents
* [ ] Test unitaire : conversion coordonnées `[lat, lng]` → `[lng, lat]` pour GraphHopper

**Critère de succès :** Carte visible avec tracé bleu et 17 marqueurs positionnés correctement.

---

## Phase 3 — Onboarding & RGPD (S01, S02-S04, S06)

* [ ] Créer `app/pages/index.vue` — logique de redirection (si onboarding fait → carte, sinon → onboarding)
* [ ] Créer `app/pages/onboarding.vue` — écrans d'introduction narratifs
* [ ] Créer `app/components/OnboardingStep.vue` — composant step réutilisable
* [ ] Créer `app/components/LanguageSelector.vue` — choix FR/EN
* [ ] Créer `app/pages/rgpd.vue` — consentement + initialisation localStorage
* [ ] Créer `app/middleware/auth.ts` — protection des routes (onboarding + RGPD requis)
* [ ] Test E2E Playwright : premier lancement → onboarding → RGPD → redirection carte
* [ ] Test E2E Playwright : utilisateur existant → redirection directe carte

**Critère de succès :** Flux complet premier utilisateur fonctionne de bout en bout.

---

## Phase 4 — Contenu narratif & progression (S08, S09)

* [ ] Créer `app/composables/useCheckpointContent.ts` — contenu narratif FR/EN par checkpoint (journal d'Armand K.)
* [ ] Créer `app/pages/checkpoint/[id].vue` — page de découverte d'un checkpoint
* [ ] Créer `app/components/NarrativeCard.vue` — carte avec extrait du journal
* [ ] Créer `app/components/NarratorBadge.vue` — badge narrateur (Armand K. / Elias Morgenstern)
* [ ] Créer `app/pages/fin.vue` — écran de fin de parcours
* [ ] Créer `app/middleware/checkpoint-guard.ts` — vérifie que le checkpoint est débloqué
* [ ] Créer `app/middleware/parcours-actif.ts` — vérifie qu'un parcours est en cours
* [ ] Créer `app/components/ResetConfirmModal.vue` — modale de confirmation reset progression
* [ ] Test E2E Playwright : simuler progression complète (mock localStorage) → vérifier navigation
* [ ] Test E2E Playwright : accès direct à un checkpoint verrouillé → redirection

**Critère de succès :** Navigation checkpoint → retour carte → écran fin fonctionne correctement.

---

## Phase 5 — i18n + PWA

* [ ] Installer `@nuxtjs/i18n` (`npm install -D @nuxtjs/i18n`)
* [ ] Créer `App/i18n/fr.json` et `App/i18n/en.json`
* [ ] Configurer i18n dans `nuxt.config.ts` (lazy loading, locale par défaut FR)
* [ ] Remplacer tous les textes en dur par des clés i18n
* [ ] Installer `@vite-pwa/nuxt` (`npm install -D @vite-pwa/nuxt`)
* [ ] Configurer manifest PWA (nom, icônes, couleurs, mode standalone)
* [ ] Configurer service worker (stratégie cache)
* [ ] Test E2E Playwright : changer langue → vérifier que les textes changent
* [ ] Vérifier que l'app est installable (manifest valide)

**Critère de succès :** App installable en PWA, bilingue FR/EN fonctionnel.
