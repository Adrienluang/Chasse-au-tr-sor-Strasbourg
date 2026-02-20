# Récap & TODO — Suite retour critique et analyse concurrence

> Synthèse des décisions et tâches issues de `08_b_retour_gpt.md` et `08_c_conccurents.md`.

---

## A — Décisions figées

| Décision | Choix retenu |
|---|---|
| Framework frontend | **Nuxt 4** |
| Analytics V1 | **Non** — repoussé en V2 |
| Offline / carte | **Best effort** — assets + contenu + progression uniquement, pas de promesse offline carte |
| Fallback GPS | **Oui** — bouton "Je suis ici", souple (pas un examen, la triche n'est pas un problème en V1) |

---

## B — TODOs produit

- [ ] **Fallback GPS** — Implémenter le bouton "Je suis ici" pour valider un checkpoint sans GPS
- [ ] **Rythme du contenu mobile** — Retravailler avec Adrien : titres, respirations, éviter les pavés
- [ ] **Écran final** — Simple en V1 : épilogue + sentiment de "j'ai terminé"
- [ ] **Souplesse contenu** — Le système doit permettre des modifications de contenu facilement (parcours, textes, images)

---

## C — TODOs organisation

- [ ] **Decision Log** — Créer `projet/decision_log.md` (voir fichier dédié)
- [ ] **Tests V1** — Beta testeurs (nous-mêmes + proches) sur Chrome mobile en premier
- [ ] **Checklist test terrain** — À formaliser en V2 si les tests V1 sont concluants

---

## D — Analyse concurrence (délégué à Adrien)

Adrien teste les apps concurrentes au rythme d'une par semaine.
On continue le développement sans attendre ce livrable.

Apps attendues : Baludik, Piste et Trésor, Totemus, Atlantide, Actionbound.
Livrable : document écrit dans `projet/` (voir template dans `05_demande_adrien.md`).

---

## Récapitulatif des statuts

| Point | Statut |
|---|---|
| Nuxt 4 | ✅ Figé |
| Analytics V1 | ✅ Figé — Non (V2) |
| Offline / carte | ✅ Figé — Best effort |
| Fallback GPS | ✅ Figé — Bouton "Je suis ici" |
| Decision Log | 📋 TODO |
| Fallback GPS (implémentation) | 📋 TODO produit |
| Rythme contenu mobile | 📋 TODO produit (avec Adrien) |
| Écran final V1 | 📋 TODO produit |
| Souplesse contenu | 📋 TODO produit |
| Tests terrain formels | 📋 TODO V2 |
| Analyse concurrence | 📤 Délégué à Adrien |
