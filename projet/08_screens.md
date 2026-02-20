# Inventaire des écrans — Chasse au Trésor Strasbourg

> Ce document fait le pont entre les use cases (`07_use_cases.md`) et le scaffolding **Nuxt 4**.
> Il définit quels fichiers créer, dans quel ordre, et comment les écrans se connectent.

---

## 1. Vue d'ensemble — tableau des écrans

| # | Nom | Route Nuxt | Fichier |
|---|-----|-----------|---------|
| S01 | Splash / Redirect | `/` | `app/pages/index.vue` |
| S02-S04 | Onboarding (3 steps) | `/onboarding` | `app/pages/onboarding.vue` |
| S06 | Consentement RGPD | `/rgpd` | `app/pages/rgpd.vue` |
| S07 | Carte interactive | `/map` | `app/pages/map.vue` |
| S08 | Contenu narratif | `/checkpoint/[id]` | `app/pages/checkpoint/[id].vue` |
| S09 | Fin de parcours | `/fin` | `app/pages/fin.vue` |
| S10 | Modal reset | (composant) | `app/components/ResetConfirmModal.vue` |

*La sélection de langue est intégrée dans l'onboarding step 1 — pas d'écran séparé.*

---

## 2. Diagramme de flux

```
[Ouverture app]
    │
    ▼
S01 / (index)
    ├─ localStorage vide / pas d'UUID ──→ S02 (/onboarding)
    ├─ UUID + onboarding fait ───────────→ S07 (/map)
    └─ UUID + parcours 17/17 ────────────→ S09 (/fin)

S02-S04 Onboarding (step géré en state interne)
    step 1 : sélection langue + accroche narrative
    step 2 : explication concept
    step 3 : règles → "Accepter et commencer"
    └─ "Accepter et commencer" ──→ S06 (/rgpd)

S06 Consentement RGPD
    ├─ "Accepter" ──────────────→ S07 (/map)
    └─ "Refuser" ───────────────→ message bloquant inline (pas de redirect)

S07 Carte interactive
    ├─ Joueur < 80m + "Découvrir" ──→ S08 (/checkpoint/[id])
    ├─ Progression = 17/17 ─────────→ S09 (/fin)
    └─ "Recommencer" (menu) ────────→ S10 (modal, reste sur S07)

S08 Contenu narratif /checkpoint/[id]
    └─ "Retour à la carte" / back OS → S07 (/map)

S09 Fin de parcours
    └─ "Recommencer" ───────────────→ S10 (modal, reste sur S09)

S10 Modal reset
    ├─ "Confirmer" → reset localStorage → S02 (/onboarding)
    └─ "Annuler" ───────────────────→ retour écran précédent (S07 ou S09)
```

---

## 3. Détail par écran

### S01 — Splash / Redirect

**Fichier :** `app/pages/index.vue`

- Pas d'UI visible (spinner 200ms max)
- Lit localStorage (opération client uniquement — `localStorage` n'existe pas côté serveur) → redirige via `navigateTo()`
- Logique de redirection :
  - UUID absent → `/onboarding`
  - UUID présent + `onboarding_done` absent → `/onboarding`
  - UUID présent + progression < 17 → `/map`
  - UUID présent + progression = 17 → `/fin`
- Use cases couverts : UC-01
- Edge cases : EC-01.1 (premier lancement), EC-01.2 (retour milieu parcours), EC-01.3 (parcours complet)

---

### S02-S04 — Onboarding (3 steps)

**Fichier :** `app/pages/onboarding.vue`
**Composants enfants :** `app/components/OnboardingStep.vue`, `app/components/LanguageSelector.vue`

- State interne `step` (`ref<1 | 2 | 3>`, progression 1→2→3)
- Sauvegarde `onboarding_step` en localStorage à chaque changement de step (reprise possible)

**Step 1 — Sélection de langue + accroche narrative**
- `LanguageSelector.vue` : choix FR / EN → sauvegarde `locale` en localStorage
- Texte d'accroche : extrait du journal d'Armand K. (1871)

**Step 2 — Explication du concept**
- Icônes + texte i18n : "Suivre la carte → arriver au lieu → valider"
- Pas de formulaire, simple lecture

**Step 3 — Règles + confirmation**
- Liste des règles du jeu (marcher, valider sur place…)
- Bouton "Accepter et commencer" → `navigateTo('/rgpd')`

- Use cases couverts : UC-02, UC-03
- Edge cases : EC-02.1 (reprise onboarding), EC-03.1 (changement de langue en cours)

---

### S06 — Consentement RGPD

**Fichier :** `app/pages/rgpd.vue`

- Texte explicatif : données stockées uniquement en localStorage, aucun serveur
- **"Accepter"** :
  1. Try/catch sur `localStorage.setItem` (détecte mode privé Safari)
  2. Génère UUID via `crypto.randomUUID()`
  3. Initialise les clés localStorage (`uuid`, `progression`, `locale`, `onboarding_done: true`)
  4. `navigateTo('/map')`
- **"Refuser"** :
  - Affiche message explicatif inline (l'app ne peut pas fonctionner sans localStorage)
  - Pas de redirect — l'utilisateur reste bloqué sur cet écran
- Edge case EC-06.3 : mode privé Safari → catch sur setItem → message d'erreur dédié

- Use cases couverts : UC-06
- Edge cases : EC-06.1 (refus), EC-06.2 (second lancement), EC-06.3 (mode privé)

---

### S07 — Carte interactive

**Fichier :** `app/pages/map.vue`
**Composants :** `LeafletMap.vue`, `CheckpointMarker.vue`, `ProgressBar.vue`, `DiscoverButton.vue`, `GpsStatus.vue`
**Composables :** `useGeolocation.ts`, `useProgression.ts`
**Middleware :** `auth` (UUID requis → redirect `/onboarding`)

- Charge la carte Leaflet (OpenStreetMap) centrée sur Strasbourg
- Affiche les 17 checkpoints avec statut (visité / courant / verrouillé)
- `useGeolocation.ts` : `watchPosition` + calcul Haversine + debounce 3s
- `DiscoverButton.vue` : visible uniquement si distance < 80m du checkpoint courant
- `ProgressBar.vue` : `x/17` checkpoints validés
- `GpsStatus.vue` : indicateur signal GPS (précision, erreur, désactivé)
- Bouton "Recommencer" dans un menu → ouvre `ResetConfirmModal.vue`
- Si progression atteint 17/17 → `navigateTo('/fin')`

- Use cases couverts : UC-07, UC-08, UC-10, UC-11
- Edge cases : EC-07.1 (GPS désactivé), EC-07.2 (mauvaise précision), EC-08.1 (trop loin), EC-08.2 (déjà validé), EC-10.1 (hors réseau)

---

### S08 — Contenu narratif

**Fichier :** `app/pages/checkpoint/[id].vue`
**Composants :** `NarrativeCard.vue`, `NarratorBadge.vue`, `IllustrationFallback.vue`
**Composable :** `useCheckpointContent.ts`
**Middleware :** `checkpoint-guard` (checkpoint[id] non débloqué → redirect `/map`)

- `useCheckpointContent.ts` : retourne le contenu statique FR/EN par `id` (1–17)
- `NarrativeCard.vue` : texte narratif du journal d'Armand K. + récit Morgenstern (1928)
- `NarratorBadge.vue` : distingue visuellement les deux narrateurs
- `IllustrationFallback.vue` : placeholder si l'image n'est pas encore disponible
- **Important :** sauvegarde du checkpoint validé en localStorage **avant** l'affichage du contenu
- Bouton "Retour à la carte" / back OS → `navigateTo('/map')`

- Use cases couverts : UC-09
- Edge cases : EC-09.1 (accès direct URL non débloquée), EC-09.2 (id inconnu → redirect `/map`)

---

### S09 — Fin de parcours

**Fichier :** `app/pages/fin.vue`
**Middleware :** `parcours-actif` (progression < 17 → redirect `/map`)

- Écran de félicitations avec résumé du parcours
- Bouton "Recommencer" → ouvre `ResetConfirmModal.vue`

- Use cases couverts : UC-11
- Edge cases : EC-11.1 (accès direct URL si progression < 17)

---

### S10 — Modal reset

**Fichier :** `app/components/ResetConfirmModal.vue`

- Appelé par S07 et S09 via `v-model:open`
- **"Confirmer"** : vide les clés de progression dans localStorage, `navigateTo('/onboarding')`
  - Clés réinitialisées : `uuid`, `progression`, `onboarding_done`, `onboarding_step`
  - Clé conservée : `locale` (on garde la langue choisie)
- **"Annuler"** : ferme la modal, retour écran précédent (S07 ou S09)

- Use cases couverts : UC-10
- Edge cases : EC-10.2 (reset en cours de parcours), EC-10.3 (fermeture sans confirmer)

---

## 4. Composants partagés

| Composant | Fichier | Écran(s) |
|-----------|---------|----------|
| `ProgressBar.vue` | `app/components/ProgressBar.vue` | S07 |
| `CheckpointMarker.vue` | `app/components/CheckpointMarker.vue` | S07 |
| `DiscoverButton.vue` | `app/components/DiscoverButton.vue` | S07 |
| `LeafletMap.vue` | `app/components/LeafletMap.vue` | S07 |
| `GpsStatus.vue` | `app/components/GpsStatus.vue` | S07 |
| `NarrativeCard.vue` | `app/components/NarrativeCard.vue` | S08 |
| `NarratorBadge.vue` | `app/components/NarratorBadge.vue` | S08 |
| `IllustrationFallback.vue` | `app/components/IllustrationFallback.vue` | S08 |
| `ResetConfirmModal.vue` | `app/components/ResetConfirmModal.vue` | S07, S09 |
| `OnboardingStep.vue` | `app/components/OnboardingStep.vue` | S02-S04 |
| `LanguageSelector.vue` | `app/components/LanguageSelector.vue` | S02 (step 1) |

---

## 5. Composables identifiés

| Composable | Fichier | Rôle |
|------------|---------|------|
| `useProgression.ts` | `app/composables/useProgression.ts` | Lecture/écriture localStorage : UUID, checkpoints validés, langue, step onboarding, flag `onboarding_done` |
| `useGeolocation.ts` | `app/composables/useGeolocation.ts` | Wrapper `watchPosition` + calcul distance Haversine + debounce 3s + gestion erreurs GPS — `watchPosition` appelé dans `onMounted` uniquement (ou guard `if (import.meta.client)` pour éviter les erreurs SSR) |
| `useCheckpointContent.ts` | `app/composables/useCheckpointContent.ts` | Accès au contenu narratif statique (FR/EN) par ID de checkpoint (1–17) |

---

## 6. Middleware Nuxt 4

| Middleware | Fichier | Règle | Écrans protégés |
|------------|---------|-------|-----------------|
| `auth` | `app/middleware/auth.ts` | UUID absent → redirect `/onboarding` | S07, S08, S09 |
| `checkpoint-guard` | `app/middleware/checkpoint-guard.ts` | Checkpoint[id] non débloqué → redirect `/map` | S08 |
| `parcours-actif` | `app/middleware/parcours-actif.ts` | Progression < 17 → redirect `/map` (protège S09) | S09 |

> **Note — `auth` global vs explicite :**
> Un middleware nommé `auth.ts` (sans suffixe) n'est **pas** global automatiquement — il doit être déclaré sur chaque page via `definePageMeta({ middleware: 'auth' })`.
> Pour un middleware global (appliqué à toutes les routes sans `definePageMeta`), le fichier doit se nommer **`auth.global.ts`**.
> Source : [Nuxt docs — Route middleware](https://nuxt.com/docs/guide/directory-structure/middleware)
>
> **Note — syntaxe dans les middlewares :**
> `navigateTo()` doit toujours être **`return`-é** (jamais `await`-é) dans un middleware :
> ```ts
> export default defineNuxtRouteMiddleware((to) => {
>   if (!uuid) return navigateTo('/onboarding')
> })
> ```

---

## 7. Structure de fichiers cible (Nuxt 4)

```
app/
├── app.vue
├── pages/
│   ├── index.vue                    # S01 — Splash/Redirect
│   ├── onboarding.vue               # S02-S04 — Onboarding
│   ├── rgpd.vue                     # S06 — Consentement RGPD
│   ├── map.vue                      # S07 — Carte interactive
│   ├── checkpoint/
│   │   └── [id].vue                 # S08 — Contenu narratif
│   └── fin.vue                      # S09 — Fin de parcours
├── components/
│   ├── ResetConfirmModal.vue        # S10 — Modal reset
│   ├── LeafletMap.vue
│   ├── CheckpointMarker.vue
│   ├── ProgressBar.vue
│   ├── DiscoverButton.vue
│   ├── GpsStatus.vue
│   ├── NarrativeCard.vue
│   ├── NarratorBadge.vue
│   ├── IllustrationFallback.vue
│   ├── OnboardingStep.vue
│   └── LanguageSelector.vue
├── composables/
│   ├── useProgression.ts
│   ├── useGeolocation.ts
│   └── useCheckpointContent.ts
├── middleware/
│   ├── auth.ts
│   ├── checkpoint-guard.ts
│   └── parcours-actif.ts
└── layouts/
    └── default.vue                  # Layout minimal (pas de nav globale)

public/
├── images/
│   └── checkpoints/                 # Illustrations par checkpoint (01.jpg … 17.jpg)
└── manifest.webmanifest

assets/
└── scss/
    └── global.scss
```

---

## 8. Couverture use cases / edge cases

| UC | Écran(s) | Edge cases couverts |
|----|----------|---------------------|
| UC-01 | S01 | EC-01.1, EC-01.2, EC-01.3 |
| UC-02 | S02-S04 | EC-02.1 |
| UC-03 | S02-S04 | EC-03.1, EC-03.2 |
| UC-06 | S06 | EC-06.1, EC-06.2, EC-06.3 |
| UC-07 | S07 | EC-07.1, EC-07.2 |
| UC-08 | S07 | EC-08.1, EC-08.2 |
| UC-09 | S08 | EC-09.1, EC-09.2 |
| UC-10 | S07, S10 | EC-10.1, EC-10.2, EC-10.3 |
| UC-11 | S09, S10 | EC-11.1 |

> Chaque use case de `07_use_cases.md` est couvert par au moins un écran.
> Aucun écran orphelin — toutes les routes sont atteignables depuis le flux principal.
> Les edge cases critiques (EC-06.3 mode privé, EC-09.1 accès direct, EC-03.2 localStorage non disponible) ont un guard ou comportement assigné.
