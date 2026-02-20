# Personas — Chasse au Trésor Strasbourg

> Étape 1 du PRD V1. Ces personas servent de référence pour les user stories (étape 2) et les décisions de priorisation.

---

## Persona 1 — Claire (primaire)

**Touriste française, découverte culturelle en couple**

| Champ | Détail |
|---|---|
| Âge | 38 ans |
| Situation | Visite Strasbourg en week-end avec son compagnon |
| Profil tech | À l'aise avec son smartphone (Instagram, Google Maps), pas développeuse |
| Device | iPhone (Safari), réseau 4G |
| Langue | Français uniquement |

### Objectif principal
Vivre une sortie originale et culturelle avec son compagnon, découvrir Strasbourg autrement qu'en visite guidée classique.

### Points de friction potentiels
- Interface peu claire ou trop de texte à lire avant de commencer
- Prise de photo refusée sans explication compréhensible
- L'app plante ou freeze en cours de parcours
- Obligation de créer un compte

### Tolérance à la complexité
**Faible.** Elle abandonne si l'onboarding dépasse 2-3 étapes ou si elle reste bloquée plus de 30 secondes sur un checkpoint.

---

## Persona 2 — James (primaire)

**Touriste anglophone, expérience guidée sans effort**

| Champ | Détail |
|---|---|
| Âge | 45 ans |
| Situation | Voyage depuis Londres, peu familier de Strasbourg |
| Profil tech | Utilisateur quotidien de Google Maps et apps de transport |
| Device | Android (Chrome), réseau limité possible (roaming EU) |
| Langue | Anglais uniquement |

### Objectif principal
Suivre un parcours guidé dans une ville inconnue sans effort de navigation, comprendre l'histoire locale de façon immersive.

### Points de friction potentiels
- Contenu uniquement en français
- Interface qui suppose une connaissance préalable de la ville
- Consommation data excessive sur réseau roaming
- Instructions de checkpoint ambiguës (pas de visuel de référence)

### Tolérance à la complexité
**Très faible.** L'interface doit être évidente sans lire : pictogrammes, flux linéaire, pas d'options cachées. Si James ne comprend pas en 5 secondes, il passe à autre chose.

---

## Persona 3 — Adrien (secondaire — V2)

**Organisateur, suivi de satisfaction locataires**

| Champ | Détail |
|---|---|
| Âge | 34 ans |
| Situation | Propriétaire Airbnb, recommande l'app à ses locataires |
| Profil tech | À l'aise avec les outils web, non-développeur |
| Device | Desktop (navigateur), accès dashboard Cloudflare Access |
| Langue | Français |

### Objectif principal
Proposer une activité différenciante à ses locataires et suivre leur niveau de satisfaction (taux de complétion, retours).

### Points de friction potentiels
- Dashboard analytics trop technique ou peu lisible
- Pas de moyen de savoir si l'expérience locataire s'est bien passée
- Dépendance à des outils tiers complexes à configurer

### Tolérance à la complexité
**Moyenne.** Adrien est motivé et patient car c'est son outil pro, mais il n'a pas de compétences techniques pour configurer des intégrations complexes.

### Note V1
Adrien n'interagit pas avec l'app joueur en V1. Son persona est documenté ici pour anticiper les besoins analytics de V2 (dashboard Cloudflare Access, Posthog).

---

## Résumé des priorités

| Persona | Priorité V1 | Point critique |
|---|---|---|
| Claire | Primaire | Onboarding fluide, feedback checkpoint clair |
| James | Primaire | Internationalisation (i18n), autonomie sans lecture |
| Adrien | Secondaire (V2) | Analytics, dashboard |
