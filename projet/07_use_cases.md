# Use Cases — Chasse au Trésor Strasbourg (MVP V1)

## Personas de référence

- **Claire** — FR, iPhone, Safari, tolérance faible aux frictions
- **James** — EN, Android, Chrome, en déplacement / roaming, tolérance très faible
- **Adrien** — Organisateur / testeur (persona secondaire, V2)

---

## UC-01 — Accès initial & Onboarding

**En tant que** Claire ou James, **je veux** accéder à l'application via un QR code **afin de** comprendre rapidement comment fonctionne la chasse au trésor et commencer à jouer.

**Préconditions :**
- Le QR code est imprimé sur le support remis par Adrien
- L'appareil dispose d'un navigateur moderne (Safari iOS, Chrome Android)

**Flux principal :**
1. Le joueur scanne le QR code avec son appareil
2. Le navigateur ouvre la PWA (Safari pour Claire, Chrome pour James)
3. L'app affiche un écran d'accueil avec le titre et une courte accroche narrative
4. Écran 2 : explication du concept (2-3 phrases max + icônes)
5. Écran 3 : règles essentielles (marcher, prendre des photos aux checkpoints)
6. Bouton "Commencer l'aventure" → vers UC-02 (sélection de langue)

**Edge cases :**
- **[EC-01.1]** QR code invalide ou URL malformée → affichage d'une page 404 claire avec message "Ce lien n'est pas valide. Contactez votre guide." — pas d'écran blanc
- **[EC-01.2]** Appareil sans caméra → l'URL peut être saisie manuellement dans le navigateur, même comportement
- **[EC-01.3]** Onboarding fermé à mi-chemin (appel entrant, fermeture app) → à la réouverture, retour à l'écran d'onboarding où le joueur s'était arrêté (step sauvegardé en localStorage)
- **[EC-01.4]** Onboarding déjà complété (retour le lendemain) → l'app saute l'onboarding et charge directement la carte avec la progression existante

---

## UC-02 — Sélection de langue

**En tant que** joueur francophone (Claire) ou anglophone (James), **je veux** que l'app s'affiche dans ma langue **afin de** comprendre les instructions et les textes narratifs sans effort.

**Préconditions :**
- L'onboarding a démarré (UC-01 complété ou en cours)
- `navigator.language` est accessible

**Flux principal :**
1. L'app lit `navigator.language` au chargement
2. Si la langue détectée est `fr` ou `fr-*` → FR pré-sélectionné (Claire voit le bon contenu directement)
3. Si la langue détectée est `en` ou `en-*` → EN pré-sélectionné (James voit le bon contenu directement)
4. L'écran de sélection affiche les deux options avec la langue détectée mise en avant
5. Le joueur confirme ou change sa langue
6. La préférence est sauvegardée en localStorage

**Edge cases :**
- **[EC-02.1]** Langue détectée non supportée (ex. `de`, `es`) → défaut FR avec possibilité de choisir EN
- **[EC-02.2]** `navigator.language` inaccessible → défaut FR
- **[EC-02.3]** Changement de langue en cours de parcours → tout le contenu switche immédiatement (textes narratifs, labels UI), la progression est conservée intacte
- **[EC-02.4]** localStorage indisponible (mode navigation privée) → langue non persistée, re-sélection à chaque session

---

## UC-03 — Consentement RGPD

**En tant que** joueur, **je veux** comprendre ce que l'app stocke sur mon appareil **afin de** donner un consentement éclairé avant de commencer.

**Préconditions :**
- La langue a été sélectionnée (UC-02 complété)
- C'est la première utilisation (pas de consentement déjà enregistré)

**Flux principal :**
1. Affichage d'un écran simple : "Cette application stocke votre progression localement sur votre appareil uniquement. Aucune donnée n'est envoyée à un serveur."
2. Bouton "Accepter et commencer" → un UUID anonyme est généré, localStorage est initialisé
3. L'app passe à la carte interactive (UC-04)

**Edge cases :**
- **[EC-03.1]** Refus du consentement → l'app affiche un message explicatif : "Sans stockage local, votre progression ne peut pas être sauvegardée. L'application n'est pas utilisable en mode privé complet." — pas de forçage, mais accès bloqué
- **[EC-03.2]** localStorage désactivé (Safari mode navigation privée) → message d'avertissement clair avant même l'écran de consentement : "Votre navigateur bloque le stockage local. Ouvrez ce lien en navigation normale pour jouer."
- **[EC-03.3]** Consentement déjà donné (retour sur l'app) → cet écran est sauté, on va directement à la carte

---

## UC-04 — Carte interactive

**En tant que** joueur en début de parcours, **je veux** voir la carte de Strasbourg avec les checkpoints **afin de** comprendre le trajet global et savoir où je dois aller.

**Préconditions :**
- Consentement donné (UC-03 complété)
- localStorage initialisé avec UUID et progression (checkpoints validés)

**Flux principal :**
1. La carte Leaflet s'affiche, centrée sur Strasbourg
2. Les 17 waypoints sont visibles sous forme de marqueurs
3. Le checkpoint actif (prochain à valider) est mis en évidence (couleur différente)
4. Les checkpoints déjà validés sont affichés avec un indicateur "✓"
5. Les checkpoints futurs sont grisés et non cliquables
6. La barre de progression "N / 17" est visible en haut ou en bas d'écran
7. Le tracé GraphHopper relie les waypoints dans l'ordre

**Edge cases :**
- **[EC-04.1]** Pas de connexion réseau → les tuiles OpenStreetMap sont servies depuis le cache PWA ; le tracé GraphHopper est pré-calculé et embarqué dans l'app (pas de recalcul en live)
- **[EC-04.2]** GPS désactivé → message non-bloquant : "Activez votre localisation pour un guidage en temps réel" + bouton "Ouvrir les paramètres" (deep link OS) ; la carte reste utilisable
- **[EC-04.3]** Zoom trop éloigné → les marqueurs restent toujours visibles (minZoom imposé) ; les marqueurs ne se superposent pas à l'extrême zoom out (clustering si nécessaire)
- **[EC-04.4]** Première ouverture → la carte est centrée sur le premier waypoint (Place Saint-Étienne), pas sur la position GPS du joueur

---

## UC-05 — Navigation GPS vers un checkpoint

**En tant que** joueur en déplacement, **je veux** être alerté quand je suis proche d'un checkpoint **afin de** savoir que je suis au bon endroit sans avoir à vérifier constamment.

**Préconditions :**
- GPS activé et permission accordée
- Un checkpoint actif existe (parcours non terminé)

**Flux principal :**
1. L'app calcule la distance Haversine entre la position GPS du joueur et le checkpoint actif toutes les 5 secondes
2. À moins de 80 mètres → le marqueur du checkpoint s'illumine / s'anime
3. Le bouton "Découvrir" apparaît en bas d'écran
4. Le joueur appuie sur "Découvrir" → UC-06

**Edge cases :**
- **[EC-05.1]** GPS instable (oscillation autour du seuil de 80m) → debounce de 3 secondes : le joueur doit rester sous 80m pendant 3s consécutives avant que le bouton apparaisse — évite les faux positifs
- **[EC-05.2]** Tentative d'accès au waypoint N+1 sans avoir validé N → bouton "Découvrir" absent ou disabled, marqueur N+1 reste grisé
- **[EC-05.3]** Perte du signal GPS en cours de route → le dernier état connu est conservé ; un indicateur discret signale la perte GPS ("Signal GPS faible") ; pas de régression de l'état
- **[EC-05.4]** Joueur au-delà du seuil de 80m mais checkpoint déjà validé → aucun bouton ne réapparaît, le checkpoint reste en état validé

---

## UC-06 — Validation d'un checkpoint

**En tant que** joueur arrivé à un lieu, **je veux** valider ma présence **afin de** débloquer le fragment narratif associé et progresser dans l'histoire.

**Préconditions :**
- Le joueur est à moins de 80m du checkpoint actif (UC-05 complété)
- Le checkpoint n'a pas encore été validé

**Flux principal :**
1. Le joueur appuie sur "Découvrir"
2. **Avant d'afficher le contenu**, le checkpoint est immédiatement marqué comme validé en localStorage
3. L'app navigue vers la page de détail du checkpoint (UC-07)
4. Le checkpoint actif passe au suivant dans la progression

**Edge cases :**
- **[EC-06.1]** Double-clic rapide sur "Découvrir" → throttle : la première validation est prise en compte, les clics suivants dans la seconde qui suit sont ignorés
- **[EC-06.2]** App fermée ou crashée pendant l'affichage du contenu narratif → comme la sauvegarde a lieu **avant** l'affichage, le checkpoint reste validé au redémarrage ; le contenu narratif est ré-accessible depuis la carte
- **[EC-06.3]** Tentative d'accès URL directe à un checkpoint non débloqué (ex. `/checkpoint/5` alors que le joueur en est au 2) → redirect automatique vers le checkpoint actif courant
- **[EC-06.4]** Checkpoint déjà validé re-cliqué depuis la carte → affichage du contenu narratif en mode "relecture", sans re-validation ni modification de la progression

---

## UC-07 — Affichage du contenu narratif

**En tant que** joueur venant de valider un checkpoint, **je veux** lire (ou entendre) l'extrait du journal d'Armand K. **afin de** m'immerger dans l'histoire et comprendre le lien avec ce lieu de Strasbourg.

**Préconditions :**
- Checkpoint validé (UC-06 complété)
- Le contenu narratif est embarqué dans l'app (statique)

**Flux principal :**
1. La page affiche : le nom du lieu, la date narrative (ex. "12 novembre 1871"), le nom du narrateur (Armand K. ou Elias Morgenstern)
2. Le texte narratif s'affiche dans la langue choisie (FR ou EN)
3. Une illustration optionnelle apparaît si disponible
4. Bouton "Retour à la carte" → retour UC-04, le checkpoint suivant est désormais actif

**Edge cases :**
- **[EC-07.1]** Texte très long → scroll vertical natif activé sur la page ; pas de troncature arbitraire
- **[EC-07.2]** Illustration absente ou URL invalide → fallback silencieux (l'image n'est tout simplement pas affichée, aucun message d'erreur, aucune requête 404 visible dans l'UI)
- **[EC-07.3]** Retour OS — bouton "back" Android ou geste iOS → retour à la carte, pas fermeture de l'app ; le checkpoint reste validé
- **[EC-07.4]** Contenu narratif dans une langue non encore traduite → affichage de la version FR par défaut avec indicateur discret "[FR]" si la langue choisie est EN

---

## UC-08 — Progression & sauvegarde

**En tant que** joueur, **je veux** que ma progression soit automatiquement sauvegardée **afin de** ne pas perdre mon avancement en cas de fermeture accidentelle.

**Préconditions :**
- Consentement RGPD donné, localStorage accessible
- Au moins un checkpoint validé

**Flux principal :**
1. À chaque validation de checkpoint (UC-06, étape 2), localStorage est mis à jour : `{ uuid, lang, onboardingDone, checkpoints: [0, 1, 2, ...], currentCheckpoint: N }`
2. La barre de progression "N / 17" se met à jour immédiatement en UI
3. Aucune action utilisateur requise — sauvegarde transparente

**Edge cases :**
- **[EC-08.1]** localStorage corrompu (JSON invalide, écriture incomplète) → à l'ouverture, l'app détecte l'erreur de parsing, affiche "Votre progression semble corrompue et a été réinitialisée." puis repart de zéro
- **[EC-08.2]** Deux onglets ou fenêtres ouverts simultanément → chaque onglet a sa propre progression indépendante ; pas de synchronisation entre onglets (comportement acceptable pour le MVP)
- **[EC-08.3]** Quota de stockage localStorage atteint → l'erreur `QuotaExceededError` est catchée ; message discret "Impossible de sauvegarder la progression. Libérez de l'espace sur votre appareil." ; l'app reste opérationnelle en session uniquement

---

## UC-09 — Reprise du parcours

**En tant que** James revenant le lendemain après avoir visité 8 checkpoints, **je veux** retrouver ma progression intacte **afin de** reprendre là où je m'étais arrêté sans recommencer depuis le début.

**Préconditions :**
- localStorage contient une progression valide (UUID + checkpoints validés)
- Le joueur rouvre l'app ou rafraîchit la page

**Flux principal :**
1. L'app lit localStorage au démarrage
2. UUID trouvé → progression chargée (liste des checkpoints validés, langue, step onboarding)
3. L'onboarding est sauté, le consentement est considéré déjà donné
4. La carte s'affiche avec l'état correct : checkpoints validés marqués, checkpoint actif mis en évidence

**Edge cases :**
- **[EC-09.1]** UUID absent (navigation privée, storage effacé manuellement) → nouvelle progression depuis zéro, onboarding rejoué
- **[EC-09.2]** Version de l'app mise à jour entre deux sessions → si le schéma de localStorage a changé, migration automatique ; si migration impossible, reset avec message "Mise à jour détectée — votre progression a été réinitialisée."
- **[EC-09.3]** Parcours entièrement complété lors de la session précédente → l'app affiche l'écran de fin / récapitulatif au lieu de la carte de navigation

---

## UC-10 — Recommencer depuis le début

**En tant que** joueur souhaitant rejouer ou ayant prêté son téléphone à quelqu'un d'autre, **je veux** réinitialiser ma progression **afin de** repartir de zéro proprement.

**Préconditions :**
- Une progression existe dans localStorage

**Flux principal :**
1. Le joueur accède à l'option "Recommencer" (accessible depuis un menu ou la page de fin)
2. Une confirmation est demandée : "Voulez-vous effacer toute votre progression ? Cette action est irréversible."
3. Deux boutons : "Annuler" (rien ne se passe) et "Confirmer"
4. Après confirmation : localStorage est vidé (clés liées à la progression uniquement), un nouvel UUID est généré, l'app revient à l'écran d'onboarding

**Edge cases :**
- **[EC-10.1]** Clic accidentel sur "Recommencer" → la demande de confirmation est obligatoire et ne peut pas être contournée ; il n'y a pas de "Annuler le reset" après confirmation
- **[EC-10.2]** Reset depuis la page de fin de parcours → même comportement que depuis le menu
- **[EC-10.3]** localStorage déjà vide → l'option "Recommencer" est soit cachée, soit affiche directement l'onboarding sans passer par la confirmation

---

## UC-11 — Installation PWA

**En tant que** joueur voulant un accès rapide et une meilleure expérience, **je veux** installer l'app sur mon écran d'accueil **afin de** l'ouvrir comme une vraie app et d'y accéder hors ligne.

**Préconditions :**
- L'app est servie en HTTPS avec un manifest valide et un service worker enregistré
- L'onboarding est terminé (le prompt n'apparaît pas au premier écran)

**Flux principal :**
1. Après la fin de l'onboarding, l'app déclenche ou affiche un prompt d'installation personnalisé
2. Le joueur accepte → le navigateur installe la PWA sur l'écran d'accueil
3. L'app fonctionne désormais en mode standalone (sans barre d'URL)
4. En mode offline : les tuiles OpenStreetMap sont servies depuis le cache du service worker ; tout le contenu narratif (textes, illustrations) est embarqué statiquement

**Edge cases :**
- **[EC-11.1]** Safari iOS : le prompt natif n'est pas disponible → l'app affiche une instruction contextuelle : "Pour installer : appuyez sur Partager → Ajouter à l'écran d'accueil" avec icônes explicites
- **[EC-11.2]** Manifest invalide ou service worker en erreur → l'app reste entièrement opérationnelle en mode web classique ; aucun message d'erreur alarmant ; mode offline non disponible mais le joueur peut continuer avec une connexion
- **[EC-11.3]** Service worker échoue à se mettre à jour → l'ancienne version du SW continue à fonctionner ; pas de blocage de l'app ; la mise à jour sera retentée à la prochaine ouverture
- **[EC-11.4]** Joueur refuse l'installation → le refus est respecté, le prompt ne réapparaît pas dans la même session ; aucune dégradation de l'expérience

---

## Récapitulatif des edge cases par criticité

### Critiques (bloquants si non gérés)
| ID | Description |
|----|-------------|
| EC-03.2 | localStorage désactivé en navigation privée |
| EC-06.3 | Accès URL direct à un checkpoint non débloqué |
| EC-08.1 | localStorage corrompu → reset |
| EC-09.2 | Migration schéma localStorage après mise à jour |

### Importants (dégradent significativement l'expérience)
| ID | Description |
|----|-------------|
| EC-01.1 | QR code invalide → page 404 claire |
| EC-01.3 | Onboarding interrompu → reprise au bon step |
| EC-04.1 | Mode offline → tuiles et tracé en cache |
| EC-05.1 | GPS instable → debounce 3s |
| EC-06.2 | App fermée pendant contenu → checkpoint sauvegardé avant affichage |
| EC-11.1 | Safari iOS → instructions manuelles d'installation |

### Acceptables pour MVP (à gérer en V1 mais non bloquants)
| ID | Description |
|----|-------------|
| EC-02.3 | Changement de langue en cours de parcours |
| EC-07.2 | Illustration absente → fallback silencieux |
| EC-07.3 | Bouton back OS → retour carte |
| EC-08.2 | Deux onglets → progressions indépendantes |
| EC-10.1 | Confirmation obligatoire avant reset |
