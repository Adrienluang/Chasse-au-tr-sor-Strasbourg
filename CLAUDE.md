# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes de développement

```bash
npm run dev      # Serveur de développement (Vite)
npm run build    # Build de production
npm run preview  # Prévisualiser le build de production
```

Pas de tests configurés pour le moment.

## Architecture du projet

Application Vue 3 + Vite (PWA/Web app) pour une chasse au trésor immersive dans Strasbourg.

### Concept fonctionnel

- Les participants suivent un parcours à pied dans Strasbourg guidé par une carte interactive
- À chaque checkpoint, ils prennent une photo d'un élément spécifique (reconnaissance d'image prévue) pour débloquer la suite de l'histoire
- L'histoire narrative suit le journal d'Armand K. (1871) à travers des lieux emblématiques de Strasbourg
- **Pas de base de données** : tout est statique (assets + contenu du parcours embarqué dans l'app)

### Stack technique

- **Vue 3** avec `<script setup>` (Composition API)
- **Leaflet** pour la carte interactive (OpenStreetMap comme fond de carte)
- **GraphHopper API** pour le calcul d'itinéraire pédestre (`foot` profile)
- **Axios** pour les appels API
- **Polyline** pour le décodage d'itinéraires encodés
- Reconnaissance d'image prévue avec **ORB/SIFT** (OpenCV) — pas encore implémentée

### Structure des composants

- `src/App.vue` — Racine, monte le composant principal plein écran (100vw/100vh)
- `src/components/Test.vue` — Version avec OpenRouteService (commentée, abandon)
- `src/components/Test2.vue` — Version active avec GraphHopper, trace le parcours complet des 17 waypoints

### Parcours (17 waypoints dans l'ordre)

Place Saint-Étienne → Quai des Pêcheurs → Restaurant "Au Canon" → Quai Saint-Nicolas → Rue du Vieux-Marché-aux-Poissons → Rue des Dentelles → Quai de la Petite France → Place Benjamin Zix → Pont du Faisan → Les Ponts Couverts → Barrage Vauban → Rue du Bain-aux-Plantes → Grand'Rue → Rue St-Hélène → Place Kléber → Place du Temple Neuf → Cathédrale de Strasbourg

### Clés API

- **GraphHopper** : clé présente en dur dans `Test2.vue` — à externaliser dans `.env` avant mise en production
- **OpenRouteService** : clé dans `Test.vue` (composant abandonné)

### Contenu narratif

Le scénario complet est documenté dans `docs/01_parcour_cree_par_adrien.md` :
- Extraits du journal d'Armand K. pour chaque lieu (1871)
- Récit en 1928 d'Elias Morgenstern
- Les "fragments" dans l'histoire correspondent à des obus réels enchâssés dans les murs de Strasbourg (guerre franco-prussienne 1870-71 / WWI)

### Fonctionnalités prévues (non encore implémentées)

- Reconnaissance d'image (OpenCV) pour valider les checkpoints
- Déblocage progressif des étapes
- Barre de progression du parcours
- Narration audio des textes
- Consentement RGPD pour le stockage local
