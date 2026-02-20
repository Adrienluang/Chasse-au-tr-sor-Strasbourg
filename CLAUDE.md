# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes de développement

Depuis le dossier `App/` :

```bash
npm run dev      # Serveur de développement (Nuxt/Vite)
npm run build    # Build de production
npm run preview  # Prévisualiser le build de production
```

Pas de tests configurés pour le moment.

## Architecture du projet

Application **Nuxt 4** (PWA/SPA) pour une chasse au trésor immersive dans Strasbourg.

### Structure du repo

```
chasse_tresor/          ← repo git
├── App/                ← app Nuxt 4 (npx nuxi init ici)
├── v0/                 ← prototype Vue 3 (référence uniquement)
├── projet/             ← docs projet (scénario, décisions, écrans...)
├── docs/               ← docs techniques (Nuxt, Leaflet, etc.)
├── CLAUDE.md
└── README.md
```

### Concept fonctionnel

- Les participants suivent un parcours à pied dans Strasbourg guidé par une carte interactive
- À chaque checkpoint, ils prennent une photo d'un élément spécifique (reconnaissance d'image prévue) pour débloquer la suite de l'histoire
- L'histoire narrative suit le journal d'Armand K. (1871) à travers des lieux emblématiques de Strasbourg
- **Pas de base de données** : tout est statique (assets + contenu du parcours embarqué dans l'app)

### Stack technique

- **Nuxt 4** avec `<script setup>` (Composition API, SPA mode)
- **Leaflet** pour la carte interactive (OpenStreetMap comme fond de carte)
- **GraphHopper API** pour le calcul d'itinéraire pédestre (`foot` profile)
- **$fetch** (natif Nuxt/ofetch) pour les appels API
- **Polyline** pour le décodage d'itinéraires encodés
- **SCSS** (sans Tailwind) — scoping via classe racine du composant
- **@vite-pwa/nuxt** pour le mode PWA offline
- **@nuxtjs/i18n** pour FR/EN

### Structure Nuxt 4 (dans `App/`)

- `app/pages/` — Routes (file-based routing)
- `app/components/` — Composants Vue
- `app/composables/` — Composables
- `app/layouts/` — Layouts
- `app/app.vue` — Point d'entrée
- `public/` — Assets statiques
- `assets/scss/` — Styles globaux

### Prototype de référence (`v0/`)

- `v0/src/components/Test2.vue` — Version active avec GraphHopper, trace le parcours complet des 17 waypoints

### Parcours (17 waypoints dans l'ordre)

Place Saint-Étienne → Quai des Pêcheurs → Restaurant "Au Canon" → Quai Saint-Nicolas → Rue du Vieux-Marché-aux-Poissons → Rue des Dentelles → Quai de la Petite France → Place Benjamin Zix → Pont du Faisan → Les Ponts Couverts → Barrage Vauban → Rue du Bain-aux-Plantes → Grand'Rue → Rue des Tanneurs → Place Kléber → Place du Temple Neuf → Cathédrale de Strasbourg

### Clés API

- **GraphHopper** : à stocker dans `App/.env` → variable `GRAPHHOPPER_API_KEY`
- Clé de référence dans `v0/src/components/Test2.vue` (prototype)

### Contenu narratif

Le scénario complet est documenté dans `projet/01_parcour_cree_par_adrien.md` :
- Extraits du journal d'Armand K. pour chaque lieu (1871)
- Récit en 1928 d'Elias Morgenstern
- Les "fragments" correspondent à des obus enchâssés dans les murs de Strasbourg (guerre franco-prussienne 1870-71 / WWI)

### Fonctionnalités prévues (non encore implémentées)

- Reconnaissance d'image pour valider les checkpoints
- Déblocage progressif des étapes
- Barre de progression du parcours
- Narration audio des textes
- Consentement RGPD pour le stockage local

À Lire systematiquement : 

@LLMInstruction.md

@README.md
