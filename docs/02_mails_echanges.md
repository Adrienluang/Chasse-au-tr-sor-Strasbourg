# Echanges de mails

## Mathieu => Adrien

Salut Adrien,

(Désolé pour les accents : j’ai un souci de clavier.)

Je pense souvent à ton projet d’appli de chasse au trésor. Tu m’as relancé plusieurs fois, et de mon côté j’ai du mal à bloquer un gros créneau pour qu’on avance efficacement.

Je te propose qu’on teste une organisation simple : on cadre le projet par mail, avec quelques réponses courtes, puis on se cale un échange une fois que c’est clair.

L’idée : répondre à quelques questions pour fixer un périmètre V1 et partir sur un mini cahier des charges.

Objectif du projet

C’est un projet “fun / perso” (gratuit) ou on vise une monétisation à terme ?

Si monétisation : quelle forme (paiement unique, parcours payants, partenariats, etc.) ?

Répartition / attentes

Si on vise un gain à terme : comment on répartit (pour éviter les flous plus tard) ?

Qui fait quoi côté contenu (histoire, checkpoints, textes/audio, identité visuelle) vs côté technique (app, carte, GPS, validation, déploiement) ?

Périmètre V1 (le plus simple possible)

Parcours unique à Strasbourg ? Combien de checkpoints ?

Validation : photo simple (pas “IA lourde”) ou vraie reconnaissance d’image dès la V1 ?

Données : est-ce qu’on accepte de stocker quelque chose (même minimal) ou on veut tout en local pour éviter le sujet RGPD au début ?

Mini analyse rapide

Concurrents : tu en as repéré (gratuits/payant) ?

Différenciation : qu’est-ce qui rend ton parcours unique (histoire, mise en scène, qualité des énigmes, DA) ?

Coûts : à ton avis, tu veux viser “coût quasi nul” (hébergement statique) ou tu acceptes un peu de récurrent si besoin ?

Si tu me réponds point par point (même en 2 lignes par question), je te fais ensuite une proposition de stack et un plan d’actions réaliste pour qu’on avance.

## Adrien => Mathieu

Salut cousin,

Désolé, je viens juste de voir ton mail : je l’ai reçu sur mon autre adresse (un peu “adresse poubelle”) que je ne check pas souvent…
Si tu veux m’écrire, le plus simple c’est de passer par cette adresse-ci, je la consulte régulièrement.

Merci pour ta proposition d’organisation, je suis chaud : je réponds point par point ci-dessous.

1) Objectif du projet
Projet fun / perso ou monétisation ?
Pour l’instant : projet fun / perso, pensé comme une expérience sympa pour mes locataires Airbnb (une chasse au trésor interactive pour découvrir Strasbourg, avec un fil narratif).
Mais je n’exclus pas une monétisation à terme si la V1 marche bien : d’abord Strasbourg, puis potentiellement d’autres villes, voire des “grosses chasses” plus événementialisées (affiches/QR code, téléchargement, etc.).

Si monétisation : quelle forme ?
Je verrais plusieurs pistes (pas forcément toutes en même temps) :

Freemium : un parcours gratuit + des parcours premium payants (micro-paiement).

Microtransactions : débloquer des parcours/chapitres, des “items” narratifs, des variantes.

Pub : plutôt en complément, mais à doser pour ne pas casser l’expérience.

Communautaire (plus tard) : permettre aux gens de publier leurs propres parcours (avec éventuellement une mise en avant payante / partage de revenus).

2) Répartition / attentes
Répartition si gain à terme
Je suis OK sur un 50/50 sur le principe. Mon intention aujourd’hui n’est pas “argent”, mais si ça devient rentable, autant être clair.

Qui fait quoi ?

Moi : histoire / narration, checkpoints, structuration du parcours, “vision produit” (mécaniques, expérience), tests terrain, et plus tard com/marketing si on le pousse.

Toi : app / technique (carte, GPS, logique de validation, stockage si besoin, déploiement).

Identité visuelle (DA) : je peux proposer des idées / références, mais je suis pas un crack. Si tu as des compétences ou si tu veux qu’on fasse simple au début (templates), ça me va.

3) Périmètre V1 (le plus simple possible)
Parcours
Pour la V1, je proposerais 15 à 20 checkpoints pour une balade cool (1h–2h), mais on peut descendre à 10–12 si tu veux vraiment ultra simple.

Validation
Je préfère une V1 sans reconnaissance d’image “lourde”.
Option V1 simple :

soit validation manuelle (“j’y suis” + bouton “valider” quand on est dans un rayon GPS)

soit photo simple (le joueur prend une photo, mais l’app ne “reconnaît” pas : ça sert juste de preuve/souvenir).

Et si on veut une mécanique à la Pokémon Go : POI sur la map, tu arrives à proximité → tu cliques → tu débloques une “page” / un contenu.

Données / RGPD
Au début, je suis plutôt pour minimiser :

idéalement pas de compte, pas d’email, pas de nom/prénom.

si on stocke : uniquement le strict minimum (progression anonyme, éventuellement un identifiant technique).
Ça m’arrange de rester light au départ, quitte à “industrialiser” quand on aura validé que l’expérience plaît (Airbnb + potentiellement d’autres apparts).

4) Mini analyse rapide
Concurrents repérés
Petit update : le concurrent dont je te parlais avant a fermé.
Par contre, il y a Diverti (D-I-V-E-R-T-y), qui permet de créer des escape games (plutôt orienté “escape game / jeu de piste”). Je n’ai pas encore creusé à fond, mais je vais regarder un peu plus (gratuit/payant, mécaniques, contraintes) et je te fais un retour.

Différenciation / ce qui rend le parcours unique

L’histoire : une narration immersive et intrigante qui s’appuie sur la ville (pas juste une suite de points).

L’objectif “visiter” : balade + découverte + storytelling, sans prise de tête.

Et à terme : dimension communautaire (les gens peuvent créer/poser leurs propres parcours et mécaniques : simple itinéraire, version énigmes, parcours à indices, etc.).

Coûts
Je suis preneur d’un coût quasi nul au départ si c’est possible.
Par contre, je suis ouvert à un peu de récurrent si ça apporte un vrai confort (fiabilité / simplicité / rapidité de dev).

Mes questions (pour que je comprenne bien)
Quand tu dis “hébergement statique”, tu entends quoi exactement, et quels sont les avantages / limites ?

La reconnaissance d’image, ça implique quoi en pratique (tech, coûts, complexité) ?

Sur le RGPD, c’est quoi le minimum vital à respecter si on fait : pas de compte, juste GPS + progression ?

Dans ta tête, le stack le plus simple pour sortir une V1 rapidement, ce serait quoi (et avec quel coût mensuel estimé) ?

Si tu me réponds avec tes options/recos sur ces 4 points, je suis chaud pour verrouiller un mini cahier des charges V1 et ensuite caler un échange court.

À dispo, et merci encore !

Adrien
