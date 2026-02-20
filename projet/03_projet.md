# Document de projet — Chasse au trésor Strasbourg

> Document de référence partagé entre **Mathieu** (technique) et **Adrien** (contenu/narration).
> Version initiale : février 2026. À faire évoluer au fil des décisions.

---

## 1. Vision & Contexte

### Concept

Une application web immersive qui guide les participants à pied dans Strasbourg sur les traces d'**Armand K.**, un personnage énigmatique du XIXe siècle. À chaque étape, un fragment de son journal (1871) ou du récit d'Elias Morgenstern (1928) se dévoile, mêlant histoire locale, mystère et découverte urbaine.

La différenciation principale n'est **pas technique** — c'est la **qualité narrative**. La technologie est au service de l'immersion, pas l'inverse.

### Origine et ambitions

- **Point de départ** : expérience offerte aux locataires Airbnb d'Adrien à Strasbourg
- **Répartition** : Adrien (histoire, checkpoints, vision produit, tests terrain, com) / Mathieu (technique) — 50/50 sur les gains éventuels
- **Potentiel à terme** : freemium (parcours premium), multi-villes, plateforme communautaire

### Public cible V1

Touristes et visiteurs de Strasbourg, y compris internationaux. L'application est **bilingue FR/EN dès la V1**.

### Chiffres clés

- ~17 waypoints, parcours à pied dans le centre de Strasbourg
- Durée estimée : 2h à 2h30 pauses comprises
- Accès via QR code → application web (PWA installable)

---

## 2. Fonctionnalités utilisateur

### V1 — MVP

**Accès et démarrage**
- Scan d'un QR code physique (remis par Adrien ou affiché quelque part) → ouverture de la PWA dans le navigateur
- Écran d'onboarding : présentation du concept, règles du jeu, explication du mécanisme
- Consentement RGPD minimal au premier lancement (stockage local uniquement, aucune donnée personnelle collectée)
- Application installable sur l'écran d'accueil du téléphone (PWA)

**Carte et navigation**
- Carte interactive (OpenStreetMap) centrée sur Strasbourg
- Tracé du parcours complet visible
- Marqueurs différenciés selon le rôle de chaque lieu :
  - **Point vert** → départ (Place Saint-Étienne)
  - **Points rouges** → checkpoints avec fragment (validation GPS requise)
  - **Points bleus** → lieux narratifs enrichissants (pas de validation, contenu contextuel)
  - **Point final** → destination finale (Cathédrale)

**Progression linéaire stricte**
- Le waypoint suivant n'est visible et accessible qu'après avoir validé le précédent
- Impossible de "sauter" une étape — l'ordre de la narration est préservé

**Validation d'un checkpoint**
- Le joueur arrive à proximité GPS (rayon ~80m, à calibrer sur le terrain)
- Le marqueur s'illumine / un bouton "Découvrir" apparaît
- Clic → le fragment narratif de l'étape se dévoile
- Retour à la carte → le checkpoint suivant est débloqué

**Contenu narratif**
- Affichage du texte : extrait du journal d'Armand K. ou récit d'Elias Morgenstern
- Informations contextuelles : narrateur, date narrative ("17 février 1871")
- Illustration optionnelle associée

**Suivi de progression**
- Barre de progression visible (ex : "5 / 17 étapes")
- Progression sauvegardée automatiquement (localStorage, identifiant anonyme généré au 1er lancement)
- Possibilité de reprendre le parcours le lendemain
- Option explicite "Recommencer depuis le début"

**Langues**
- Interface et contenus narratifs disponibles en français et en anglais
- Sélection de la langue à l'onboarding

### Explicitement hors scope V1

- Compte utilisateur
- Reconnaissance d'image
- Narration audio
- Paiement
- Multi-parcours

### V2 — Enrichissement de l'expérience

- Narration audio des textes (enregistrements d'Adrien ou voix générée)
- Page de fin avec épilogue complet
- Partage sur réseaux sociaux (image de complétion)
- Mode hors-ligne amélioré (pré-cache des tuiles de carte)
- Sync de progression optionnelle vers un serveur (pour reprendre sur un autre appareil)

### V3 — Plateforme

- Second parcours premium (ex : Strasbourg nocturne)
- Système de paiement (Stripe) pour les parcours payants
- Comptes créateurs (pour publier leurs propres parcours)
- Interface de création de parcours
- Multi-villes

---

## 3. Fonctionnalités admin

### V1 — Pas de panel admin

En V1, le contenu (textes narratifs, coordonnées GPS, types de marqueurs) est stocké dans un fichier TypeScript versionné dans le dépôt Git (`content/parcours.ts`).

**Workflow :**
1. Adrien prépare ou modifie un texte
2. Il envoie la modification à Mathieu
3. Mathieu met à jour le fichier et redéploie

**Pourquoi ce choix :** le contenu est stable, il n'y a qu'un seul parcours, et les modifications sont rares. Ajouter un panel admin en V1 serait de la complexité pour rien.

### V2 — Dashboard lecture seule

- Accès pour Adrien à un dashboard PostHog (analytics de progression)
- Protégé par Cloudflare Access (pas d'authentification custom à développer)
- Données consultables : nombre de parcours démarrés/terminés, taux d'abandon par checkpoint, etc.

### V3 — Panel admin complet

- CRUD des parcours et waypoints
- Modération et publication des parcours communautaires
- Dashboard métriques avancé

---

## 4. Stack technique

### Recommandation principale : Nuxt 3

**Nuxt 3** est le framework qui s'impose pour ce projet. Il inclut Vue 3 nativement et permet de faire évoluer l'application sans migration douloureuse : en V1 on déploie une SPA statique légère (zéro Node.js en production), et dès la V2 on active Nitro (le serveur intégré) pour ajouter des API routes sans changer de stack.

**Un seul dépôt, un seul container Docker** — c'est l'avantage décisif face à une architecture Vue frontend + backend séparé.

### Tableau de décisions

| Besoin | Solution retenue | Alternative écartée | Raison |
|---|---|---|---|
| Frontend | **Nuxt 3 / Vue 3** | Vue 3 + Vite (actuel) | Prêt pour V2 backend sans migration |
| Backend V2+ | **Nitro** (intégré Nuxt) | Symfony, Express séparé | Intégré, un seul container |
| Carte | **Leaflet** | MapLibre GL | Déjà fonctionnel dans le prototype |
| Calcul d'itinéraire | **GraphHopper API** | OSRM, Geoapify | Free tier suffisant, déjà intégré |
| Géolocalisation | **Web Geolocation API** (native) | Lib tierce | Aucune dépendance externe nécessaire |
| i18n | **@nuxtjs/i18n** | Vue i18n manuel | Intégration Nuxt native |
| PWA | **@vite-pwa/nuxt** | — | Cache offline, installable |
| Analytics V2+ | **PostHog** self-hosted | Matomo | Product analytics (funnels, events) — hors scope V1 (RGPD) |
| DB V2+ | **PostgreSQL + Drizzle ORM** | Prisma, SQLite | Déjà dans l'infra Dokploy ; Drizzle = léger + Edge-compatible |
| Auth admin V2+ | **nuxt-auth-utils** | JWT custom | Minimal + Cloudflare Access en couche réseau |

### Détail des choix

**PostHog vs Matomo**
Matomo est un outil d'analytics web classique (pages vues, sessions, rebond) — adapté pour une landing page ou un site vitrine. PostHog est un outil de product analytics orienté événements et funnels (checkpoint validé, parcours terminé, étape d'abandon) — exactement ce dont on a besoin pour comprendre l'expérience de jeu. PostHog sera déployé en **self-hosted sur le serveur Dokploy** (même infra que l'app) — pas de coût SaaS, données 100% chez nous.

**Drizzle ORM vs Prisma**
Les deux fonctionnent avec Nuxt/Nitro. Drizzle est plus léger, SQL-first, et Edge-compatible (important pour une éventuelle migration vers Cloudflare Workers). Prisma est plus opinioné et génère son propre client. Pour un projet géré par un développeur seul, Drizzle offre moins de magie et plus de contrôle.

**Pas de base de données en V1**
La progression est anonyme (localStorage) et le contenu est statique (fichier TS). Aucune raison d'ajouter PostgreSQL en V1 — cela viendra naturellement avec la V2 quand on activate Nitro.

---

## 5. Architecture V1

### Schéma applicatif

```
[Joueur mobile]
      |
      | HTTPS
      v
[Nuxt 3 SPA — Container Docker — Servi par nginx]
  │
  ├── pages/
  │   ├── index.vue              → Onboarding, règles, sélection langue
  │   ├── carte.vue              → Carte Leaflet, logique GPS, progression
  │   └── checkpoint/[id].vue   → Affichage fragment narratif
  │
  ├── composables/
  │   ├── useGeolocation.ts      → GPS watchPosition + calcul distance Haversine
  │   ├── useProgression.ts      → Lecture/écriture localStorage (UUID + checkpoints)
  │   └── useParcours.ts         → Chargement et accès aux données de content/parcours.ts
  │
  ├── content/
  │   └── parcours.ts            → 17 waypoints typés + textes narratifs FR/EN
  │
  └── i18n/
      ├── fr.json                → Traductions interface FR
      └── en.json                → Traductions interface EN

[GraphHopper API]    ← Appel HTTP depuis le navigateur (calcul itinéraire pédestre)
[OpenStreetMap]      ← Tuiles carte (Leaflet)
[PostHog]            ← Événements anonymes (checkpoint validé, parcours terminé, abandon)
```

### Flux utilisateur principal

```
Scan QR code
  → Onboarding (règles + sélection langue)
  → Consentement RGPD (stockage local)
  → Carte — seul le waypoint 1 est actif
  → Joueur se déplace vers Place Saint-Étienne
  → GPS détecte proximité < 80m
  → Bouton "Découvrir" s'active sur le marqueur
  → Clic → affichage du fragment narratif (extrait journal Armand K.)
  → Retour à la carte → waypoint 2 débloqué
  → ...
  → Arrivée à la Cathédrale (waypoint final)
  → Épilogue complet
  → Page de fin
```

### Modèle de données — contenu (`content/parcours.ts`)

```typescript
interface Waypoint {
  id: number
  nom: string
  type: 'depart' | 'fragment' | 'narratif' | 'fin'
  coordonnees: [number, number]  // [lat, lng]
  proximiteMetres: number        // rayon de validation GPS, défaut 80
  contenu: {
    narrateur: 'armand_k' | 'elias_morgenstern' | 'systeme'
    dateNarrative?: string       // ex : "17 février 1871"
    texteFr: string
    texteEn: string
    illustration?: string        // markdown embarqué (optionnel, fourni par Adrien)
  }
}
```

### Modèle de progression — localStorage

```typescript
interface Progression {
  id: string                    // UUID généré au premier lancement
  checkpointsValides: number[]  // ex : [0, 1, 2] (indices des waypoints validés)
  dateDebut: string             // ISO 8601
  dateDernierCheckpoint: string // ISO 8601
}
```

Clé localStorage : `chasse_tresor_progression`

---

## 6. Déploiement

Le déploiement suit exactement le pattern établi dans l'infra Dokploy (même structure que n8n, matomo).

### Fichiers Docker

**Structure :**
- `compose.base.yml` → définition du service (image, env, réseau interne)
- `compose.prod.yml` → labels Traefik, réseau `dokploy-network`
- `compose.dokploy.yml` → fichier fusionné généré, utilisé par Dokploy

**Commande de fusion :**
```bash
docker compose -f compose.base.yml -f compose.prod.yml config --no-interpolate -o compose.dokploy.yml
```

### Dockerfile (V1 — SPA statique)

```dockerfile
# Étape 1 : build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : serve (fichiers statiques via nginx, zéro Node.js)
FROM nginx:alpine AS runner
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

> Quand on activera le SSR en V2, le Dockerfile passe en mode Node.js :
> `CMD ["node", ".output/server/index.mjs"]`

### Variables d'environnement (secrets Dokploy)

| Variable | Usage | Notes |
|---|---|---|
| `GRAPHHOPPER_API_KEY` | Calcul d'itinéraire | Actuellement hardcodé dans Test2.vue — à externaliser |
| `NUXT_PUBLIC_APP_URL` | URL de l'application | ex : `https://chasse-tresor.domaine.com` |
| `NUXT_PUBLIC_POSTHOG_KEY` | Analytics PostHog | **V2** — hors scope V1 |

### DNS Cloudflare

- Un domaine (à définir) → proxy Cloudflare → Traefik Dokploy → container
- Accès public (joueurs) : domaine principal
- Dashboard PostHog Adrien (V2) : protégé par Cloudflare Access (SSO email, sans développement auth custom)

### Coût d'exploitation estimé

| Service | Coût |
|---|---|
| Dokploy + serveur | Déjà payé — 0 EUR supplémentaire |
| GraphHopper | Free tier 10 000 req/mois — suffisant pour V1 |
| OpenStreetMap | Gratuit |
| PostHog cloud | Free tier 1M events/mois — suffisant pour V1 |
| Domaine | ~10-15 EUR/an |

---

## 7. Questions ouvertes — à traiter avec Adrien

**Contenu narratif**
- Textes narratifs : complets (voir `projet/01_parcour_cree_par_adrien.md`) — document Adrien = référence
- Type de chaque waypoint (`fragment` / `narratif` / `depart` / `fin`) → **à définir ensemble**
- Illustrations : si présentes, format markdown embarqué — ✅ décidé

**Game design**
- Rayon GPS : configurable par waypoint (`proximiteMetres`), valeur par défaut 80m — ✅ décidé
- Carte : configurable par l'utilisateur (choix stocké en localStorage) — ✅ décidé

**Technique et infrastructure**
- Domaine MVP : `chasse-tresor.mathieufroehly.fr`, facilement modifiable via variable d'env — ✅ décidé
- PostHog : repoussé en V2 (complexité RGPD hors scope V1) — ✅ décidé

---

## 8. Roadmap

### V1 — MVP

**Objectif :** application fonctionnelle pour les premiers testeurs (locataires Airbnb d'Adrien)

Technique :
- [ ] Scaffolding Nuxt 3 (remplace le prototype Vue + Vite actuel)
- [ ] Intégration Leaflet + tracé GraphHopper
- [ ] Fichier `content/parcours.ts` avec les 17 waypoints et tous les textes narratifs
- [ ] Composable `useGeolocation` : suivi GPS temps réel + calcul de proximité (Haversine)
- [ ] Logique de déblocage linéaire (waypoint N+1 visible après validation N)
- [ ] Affichage des fragments narratifs (page dédiée ou modal)
- [ ] Persistance localStorage + UUID anonyme
- [ ] Option "Recommencer"
- [ ] Barre de progression
- [ ] Consentement RGPD minimal
- [ ] i18n FR/EN (`@nuxtjs/i18n`)
- [ ] PWA (manifest + service worker via `@vite-pwa/nuxt`)
- [ ] ~~Intégration PostHog~~ → V2
- [ ] Dockerfile + compose Dokploy
- [ ] Externalisation clé GraphHopper en variable d'environnement

Contenu (Adrien) :
- [x] Textes narratifs — quasi complets (voir `projet/01_parcour_cree_par_adrien.md`)
- [x] Clarification Rue des Tanneurs vs Rue St-Hélène — doc Adrien = référence ✅
- [ ] Classification type pour chaque étape (fragment / narratif / depart / fin) — à définir ensemble
- [ ] Vérification coordonnées GPS + rayon de proximité (test terrain)
- [ ] Illustrations éventuelles (format : markdown embarqué)

### V2 — Enrichissement

- Narration audio (enregistrements ou TTS)
- Page de fin avec épilogue complet
- Mode hors-ligne amélioré (pré-cache tuiles)
- Activation Nitro + PostgreSQL + Drizzle (backend léger)
- Sync progression serveur optionnelle
- Dashboard PostHog accessible à Adrien (protégé Cloudflare Access)

### V3 — Plateforme

- Multi-parcours (Strasbourg premium + autres villes)
- Freemium + paiement Stripe
- Comptes créateurs
- Interface de création de parcours
- Modération et publication communautaire
