# Decision Log

> Décisions figées du projet. Une fois inscrite ici, une décision ne se re-débat pas.
> Toute nouvelle décision structurante doit être ajoutée à ce fichier.

---

| # | Décision | Choix retenu | Rationale | Date |
|---|---|---|---|---|
| 1 | Framework frontend | **Nuxt 4** | Version actuelle stable, cohérente avec la stack prévue. Nuxt 3 écarté pour éviter les incohérences de migration. | 2026-02 |
| 2 | Analytics en V1 | **Non** | Complexité RGPD inutile en V1. PostHog prévu en V2 pour mesurer l'abandon par checkpoint. | 2026-02 |
| 3 | Offline / carte | **Best effort** | Pas de promesse offline carte (tuiles OSM = trop lourd et aléatoire). Assets + contenu + progression mis en cache suffisent pour V1. | 2026-02 |
| 4 | Fallback GPS | **Bouton "Je suis ici"** | La précision GPS en centre-ville est unreliable (iPhone Safari, rues étroites, batterie). Le jeu n'est pas un examen : la triche n'est pas un problème en V1. Priorité = ne pas perdre les joueurs sur un bug GPS. | 2026-02 |
| 5 | Tests V1 | **Chrome mobile, beta testeurs proches** | Tests terrain formels (checklist multi-devices) reportés en V2 si V1 concluante. | 2026-02 |
| 6 | Dossier app Nuxt | **`App/`** | Cohérent avec README existant ("L'application elle même en nuxt est dans le dossier `./App`"). Le prototype Vue 3 reste dans `v0/` pour référence. | 2026-02 |
