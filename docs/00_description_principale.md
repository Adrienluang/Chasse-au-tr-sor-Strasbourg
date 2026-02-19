# Chasse au trésor Adrien

Une application de chasse au trésor dans Strasbourg.

L’idée est d’avoir des checkpoint dans Strasbourg.  
On débloquerait les checkpoint à partir de photos d'éléments spécifiques.

Le parcours commencera par le scan d’un QR code.  
Téléchargement d’une application ou une page Web.  
Une première explication des regle du jeux.

Vous aurez une map pour vous faire visiter Strasbourg de manière interactive et immersive.

On leur affiche une carte GPS avec un tracé et une route spécifique.

Lorsqu'ils arrivent à la destination du premier point.  
Ils devront prendre une photo spécifique.  
Ce qui leur débloque une partie de l’histoire sous forme de texte et la suite de l'itinéraire.

Et ça jusqu'à arriver à destination.

J’aurais des questions :   
Quel type de stack tu me conseillerait pour que ce soit simple et à des coûts abordables.

Pas de base de donnée,  
Rien à stocker sur serveur mise a part l’application et des assets.

Proposition stack :

- (PWA Web app vuejs ou react)
- App mobile React Native

# Stack

- VueJS
- Leaflet
- graphhopper.com (Pour le calcul d’itineraire)
- Matching d’image avec ORB, SIFT ou SURF (Méthode simple, peu d’images)

# Reconnaissance d’image

## **📊 Comparaison des trois algorithmes**

| Algorithme | Vitesse ⏱ | Robustesse 🛡 | Invariant échelle 🔍 | Invariant rotation 🔄 | Licence 📜 |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **SIFT** | LENT ❌ | ✅ ✅ ✅ | ✅ ✅ ✅ | ✅ ✅ ✅ | Open-source (depuis 2020\) |
| **SURF** | MOYEN ⚡ | ✅ ✅ | ✅ ✅ ✅ | ✅ ✅ ✅ | **Breveté** |
| **ORB** | RAPIDE 🚀 | ✅ | ✅ | ✅ | **Open-source (libre)** |

# Fonctionnalités

- Les checkpoint doivent apparaître progressivement lorsqu’ils sont validés
- Décider de recommencer le parcour
- Accepter de stocker des données \=\> RGPD
- Reconnaissance d’images avec openCV

Il faudrait avoir une librairie type GPS.

Idée Expérience utilisateur.

Avoir une sorte de progress bar pour savoir où on en est.  
Les textes peuvent être narré par l’application.