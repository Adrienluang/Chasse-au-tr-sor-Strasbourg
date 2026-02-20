# Récap & TODO — Suite retour critique et analyse concurrence

> Synthèse des décisions et tâches issues de `08_b_retour_gpt.md` et `08_c_conccurents.md`.
> À tenir à jour jusqu'au démarrage du développement de l'interface.

---

## A — Décisions figées (actées, ne plus en débattre)

| Décision | Choix retenu | Source |
|---|---|---|
| Framework frontend | **Nuxt 4** | Mathieu, suite retour GPT |

---

## B — Décisions en suspens (à trancher avant de coder)

Ces points doivent être tranchés **par écrit** avant de commencer le dev de l'interface.
Chaque décision doit atterrir dans le Decision Log (voir section D).

### B1 — Analytics en V1

| Option | Implications |
|---|---|
| **Non (strict)** | Zéro complexité RGPD, cohérent avec "minimal V1", pas de consentement |
| **PostHog anonyme cadré** | Consentement à gérer, paramétrage events, mais abandon par checkpoint dès V1 |

➜ **À trancher par Mathieu.** Le retour conseille "non en V1" sauf si on veut les données dès le départ.

---

### B2 — Promesse offline / carte

| Option | Implications |
|---|---|
| **Best effort** (assets + contenu + progression) | Simple, honnête, gérable en V1 |
| **Offline carte complète** (tuiles OSM depuis cache SW) | Lourde, aléatoire selon navigateur, "trou sans fond" (retour GPT) |

➜ **Recommandation : best effort.** Ne pas promettre offline carte en V1.

---

### B3 — Fallback GPS

| Option | Implications |
|---|---|
| **Bouton "Je suis ici"** + confirmation (ex: rester 20s) | Réduit les abandons injustes, nécessite une mini-règle |
| **GPS uniquement** | Simple, mais laisse tomber les users en rues étroites / iPhone Safari |

➜ **Recommandation forte : prévoir le fallback GPS.** C'est identifié comme "tueur n°1" dans le retour.

---

## C — TODOs produit

- [ ] **Plan B GPS** — Définir le mécanisme exact (bouton + durée + message) avant d'implémenter la validation de checkpoint
- [ ] **Rythme du contenu mobile** — Retravailler avec Adrien : titres, respirations, éviter les pavés ; le récit est riche mais doit passer sur petit écran
- [ ] **Écran final mémorable** — Même simple en V1 : épilogue + sentiment de "j'ai fini quelque chose"
- [ ] **Mesure d'abandon par checkpoint** — À prévoir en V2 dès que la base est posée (PostHog events)

---

## D — TODOs organisation

- [ ] **Créer un Decision Log** — 1 page (`projet/decision_log.md`) : chaque décision figée + date + rationale. Commencer avec : Nuxt 4, et les choix de la section B une fois tranchés.
- [ ] **Créer une checklist de test terrain** — (`projet/checklist_test_terrain.md`) avec au moins :
  - iPhone Safari + Android Chrome
  - GPS on / off / précision faible
  - Batterie en mode économie d'énergie
  - Centre-ville (immeubles, multipath)
  - Parcours interrompu puis repris
  - Roaming (touriste étranger)

---

## E — Analyse concurrence (délégué à Adrien)

Une demande formelle a été envoyée à Adrien (voir `05_demande_adrien.md`).

### Apps à tester en priorité

| App | Catégorie | Plateforme |
|---|---|---|
| **Baludik** | Parcours / offices de tourisme | iOS + Android |
| **Piste et Trésor** | 300+ parcours France/Belgique | iOS + Android |
| **Totemus** | Jeu de piste / géocaching grand public | iOS + Android |
| **Atlantide – Jeu de piste** | Enquêtes géolocalisées outdoor | iOS + Android |
| **Actionbound** | Plateforme création (référence B2B) | iOS + Android |

### Template de fiche par app (à remplir par Adrien)

```
## [Nom de l'app]

- **Prix** : gratuit / freemium / payant (montant)
- **Zone géographique** : France / international / local
- **Parcours utilisateur** : description de l'expérience de A à Z
- **Points forts UX** :
  - …
- **Points faibles UX** :
  - …
- **Ce qu'ils font mieux que nous** :
  - …
- **Ce qu'on peut revendiquer contre eux** :
  - …
```

### Livrable attendu

Document écrit dans `projet/` (ex: `09_analyse_concurrence_adrien.md`), une fiche par app.
**Délai : avant le démarrage du développement de l'interface.**

---

## Récapitulatif des statuts

| Point | Statut |
|---|---|
| Nuxt 4 | ✅ Figé |
| Analytics V1 | ⏳ En suspens |
| Offline / carte | ⏳ En suspens (recommandation : best effort) |
| Fallback GPS | ⏳ En suspens (recommandation : obligatoire) |
| Plan B GPS (implémentation) | 📋 TODO produit |
| Rythme contenu mobile | 📋 TODO produit (avec Adrien) |
| Écran final V1 | 📋 TODO produit |
| Decision Log | 📋 TODO organisation |
| Checklist test terrain | 📋 TODO organisation |
| Analyse concurrence | 📤 Délégué à Adrien |
