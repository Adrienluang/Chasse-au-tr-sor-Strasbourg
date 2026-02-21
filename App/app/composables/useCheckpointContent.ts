interface CheckpointContent {
  id: number
  location: string
  date: string
  narrator: 'armand' | 'elias'
  text: string
}

type CheckpointData = Record<number, { fr: CheckpointContent; en: CheckpointContent }>

const checkpointData: CheckpointData = {
  1: {
    fr: {
      id: 1,
      location: 'Place Saint-Étienne',
      date: '17 février 1871',
      narrator: 'armand',
      text: `Strasbourg, cette ville où chaque pierre semble murmurer des vérités oubliées, cache des secrets que peu osent chercher.

En parcourant une carte ancienne trouvée dans un vieux carnet, j'ai remarqué des marques intrigantes, dispersées dans la ville. Elles mènent à des lieux où des objets ont été enchâssés dans les murs, des formes métalliques gravées de symboles qui échappent à ma compréhension.

Ces objets ne sont pas là par hasard. Leur présence semble délibérée, leur placement calculé. Sont-ils des protections, des avertissements ou autre chose ?`,
    },
    en: {
      id: 1,
      location: 'Place Saint-Étienne',
      date: 'February 17, 1871',
      narrator: 'armand',
      text: `Strasbourg, this city where every stone seems to whisper forgotten truths, hides secrets that few dare to seek.

While studying an old map found in a worn notebook, I noticed intriguing marks scattered across the city. They lead to places where objects have been embedded in the walls — metallic shapes engraved with symbols beyond my understanding.

These objects are not there by chance. Their presence seems deliberate, their placement calculated. Are they protections, warnings, or something else entirely?`,
    },
  },
  2: {
    fr: {
      id: 2,
      location: 'Quai des Pêcheurs',
      date: '21 février 1871',
      narrator: 'armand',
      text: `Le Quai des Pêcheurs, avec son calme apparent, cache un passé troublant. En examinant les murs, j'ai découvert une autre de ces formes métalliques, encastrée dans une façade. Cette fois, les gravures semblaient presque effacées, comme si le temps avait tenté d'en effacer l'existence.

Un pêcheur, interrogé à propos de cet objet, a mentionné des récits anciens. On parlait de reflets étranges dans l'eau, la nuit, toujours à cet endroit. Certains murmuraient que ces reflets étaient des échos de ce que l'objet contenait ou protégeait.

Chaque découverte me rapproche de quelque chose, mais quoi ? Ces objets semblent attirer les regards tout en s'efforçant de rester discrets. Leurs secrets ne se révèlent qu'à ceux qui cherchent vraiment.`,
    },
    en: {
      id: 2,
      location: 'Quai des Pêcheurs',
      date: 'February 21, 1871',
      narrator: 'armand',
      text: `The Quai des Pêcheurs, with its apparent calm, hides a troubled past. While examining the walls, I discovered another of these metallic shapes, embedded in a facade. This time, the engravings seemed almost erased, as if time had tried to wipe away their existence.

A fisherman, questioned about this object, mentioned ancient stories. People spoke of strange reflections in the water at night, always at this spot. Some whispered that these reflections were echoes of what the object contained or protected.

Each discovery brings me closer to something — but what? These objects seem to attract attention while striving to remain discreet. Their secrets reveal themselves only to those who truly seek.`,
    },
  },
  3: {
    fr: {
      id: 3,
      location: 'Restaurant "Au Canon"',
      date: '25 février 1871',
      narrator: 'armand',
      text: `C'est ici, au Restaurant "Au Canon", que Hans-Erik Mülheim, autrefois l'un des hommes les plus puissants de Strasbourg, aurait acquis l'artefact qui a marqué sa chute.

Hans-Erik, connu pour son influence et ses affaires prospères, résidait dans la prestigieuse Maison Kammerzell. Les récits liés à ce lieu évoquent une soirée en 1790 où il aurait conclu une affaire inhabituelle ici. Il était décrit comme nerveux, presque terrifié. Les témoins se rappellent qu'il quitta les lieux en hâte, emportant un objet mystérieux qu'il dissimulait sous son manteau.

Peu après cette nuit, il fut arrêté et conduit au Pont du Corbeau, où il fut pendu. Lorsque son corps fut récupéré, l'objet avait disparu. Certains disent qu'il l'avait caché dans sa maison, d'autres pensent qu'il l'avait confié à un complice.`,
    },
    en: {
      id: 3,
      location: 'Restaurant "Au Canon"',
      date: 'February 25, 1871',
      narrator: 'armand',
      text: `It is here, at the Restaurant "Au Canon", that Hans-Erik Mülheim, once one of the most powerful men in Strasbourg, allegedly acquired the artifact that marked his downfall.

Hans-Erik, known for his influence and prosperous affairs, resided in the prestigious Maison Kammerzell. Stories of this place tell of an evening in 1790 when he concluded an unusual deal here. He was described as nervous, almost terrified. Witnesses recalled that he left in haste, carrying a mysterious object hidden beneath his coat.

Shortly after that night, he was arrested and taken to the Pont du Corbeau, where he was hanged. When his body was recovered, the object had vanished. Some say he had hidden it in his home; others believe he entrusted it to an accomplice.`,
    },
  },
  4: {
    fr: {
      id: 4,
      location: 'Quai Saint-Nicolas',
      date: '23 février 1871',
      narrator: 'armand',
      text: `Sur la façade d'un ancien bâtiment du Quai Saint-Nicolas, j'ai repéré un fragment enchâssé dans la pierre, presque invisible à l'œil nu. Ce n'est qu'en approchant que j'ai remarqué sa surface lisse et lumineuse, contrastant avec la rugosité du mur environnant.

Des témoins m'ont raconté des histoires de lumières inhabituelles aperçues dans les fenêtres de cet entrepôt il y a plus de deux siècles. Ces phénomènes étaient toujours accompagnés d'un profond sentiment d'effroi parmi les habitants du quartier. On disait que ces lumières suivaient l'activité de personnes qu'ils appelaient "les Veilleurs".

Ces fragments sont-ils des outils, des armes, ou autre chose ? Les Veilleurs de l'Aube semblent avoir orchestré leur placement, mais leur objectif reste hors de ma portée.`,
    },
    en: {
      id: 4,
      location: 'Quai Saint-Nicolas',
      date: 'February 23, 1871',
      narrator: 'armand',
      text: `On the facade of an old building on Quai Saint-Nicolas, I spotted a fragment set into the stone, nearly invisible to the naked eye. Only upon approaching did I notice its smooth, luminous surface, contrasting with the roughness of the surrounding wall.

Witnesses told me stories of unusual lights seen in the windows of this warehouse over two centuries ago. These phenomena were always accompanied by a deep sense of dread among the neighborhood's inhabitants. They said these lights followed the activity of people they called "the Watchers."

Are these fragments tools, weapons, or something else? The Watchers of the Dawn seem to have orchestrated their placement, but their purpose remains beyond my grasp.`,
    },
  },
  5: {
    fr: {
      id: 5,
      location: 'Rue du Vieux-Marché-aux-Poissons',
      date: '27 février 1871',
      narrator: 'armand',
      text: `À cet endroit, j'ai trouvé un fragment incrusté dans une vieille plaque murale, couverte de gravures presque effacées. Ces marques semblent représenter une constellation ou un message crypté.

Un marchand local m'a confié que cet emplacement était autrefois un centre névralgique pour les échanges. Il a évoqué des histoires d'étranges visiteurs qui venaient la nuit, transportant des objets qu'ils laissaient ici. Les fragments sont peut-être des témoins de ces mystérieux échanges.`,
    },
    en: {
      id: 5,
      location: 'Rue du Vieux-Marché-aux-Poissons',
      date: 'February 27, 1871',
      narrator: 'armand',
      text: `At this spot, I found a fragment embedded in an old wall plaque, covered with nearly faded engravings. These marks seem to represent a constellation or a coded message.

A local merchant confided that this location was once a nerve center for trade. He told stories of strange visitors who came at night, carrying objects they would leave here. The fragments may be witnesses to these mysterious exchanges.`,
    },
  },
  6: {
    fr: {
      id: 6,
      location: 'Rue des Dentelles',
      date: '15 janvier 1928',
      narrator: 'elias',
      text: `En entrant dans la Rue des Dentelles, je ressens une étrange lourdeur s'installer en moi. Loin de l'agitation de la ville, cette rue pavée semble m'envelopper, les maisons à colombages se refermant comme une cage autour de mes pensées.

Sur une poutre usée, à la base d'une maison, je crois voir un symbole gravé — des lignes délicates formant ce qui ressemble à une étoile ou peut-être une fleur stylisée. Intrigué, je m'approche pour mieux observer, mais une ombre traverse mon champ de vision, rapide et furtive.

Je me retourne instinctivement. Rien. La rue est déserte. Je reporte mon attention sur la poutre… mais le symbole a disparu. Seule reste la surface rugueuse et banale du bois, comme si rien n'avait jamais été là.

Des éclats de murmures me parviennent à travers les volets fermés d'une maison voisine. Une femme parle à voix basse, presque en prière, mais ses mots s'éteignent soudainement, laissant un vide assourdissant.`,
    },
    en: {
      id: 6,
      location: 'Rue des Dentelles',
      date: 'January 15, 1928',
      narrator: 'elias',
      text: `Entering the Rue des Dentelles, I feel a strange heaviness settling within me. Far from the city's bustle, this cobblestone street seems to envelop me, the half-timbered houses closing in like a cage around my thoughts.

On a worn beam at the base of a house, I think I see an engraved symbol — delicate lines forming what looks like a star or perhaps a stylized flower. Intrigued, I approach for a closer look, but a shadow crosses my field of vision, swift and furtive.

I turn instinctively. Nothing. The street is deserted. I look back at the beam… but the symbol has vanished. Only the rough, ordinary surface of the wood remains, as if nothing had ever been there.

Fragments of whispers reach me through the closed shutters of a neighboring house. A woman speaks in hushed tones, almost in prayer, but her words suddenly die away, leaving a deafening void.`,
    },
  },
  7: {
    fr: {
      id: 7,
      location: 'Quai de la Petite France',
      date: '15 janvier 1928',
      narrator: 'elias',
      text: `Les reflets des lumières sur l'eau du canal m'hypnotisent un instant alors que je longe le Quai de la Petite France. Les maisons penchées, avec leurs poutres apparentes, m'évoquent des carcasses anciennes veillant sur ces eaux qui semblent immuables.

Sur l'autre rive, une silhouette avance lentement, portant un long manteau noir.

Je reste figé, les mains serrées autour de mon carnet. La silhouette s'arrête, lève la tête comme pour chercher quelque chose au-dessus d'elle, puis disparaît sans bruit dans une ruelle. Je traverse un pont de pierre, sentant le poids d'un regard invisible me suivre dans la nuit.`,
    },
    en: {
      id: 7,
      location: 'Quai de la Petite France',
      date: 'January 15, 1928',
      narrator: 'elias',
      text: `The reflections of lights on the canal water mesmerize me for a moment as I walk along the Quai de la Petite France. The leaning houses, with their exposed beams, remind me of ancient carcasses watching over waters that seem timeless.

On the other bank, a figure moves slowly, wearing a long black coat.

I stand frozen, hands clenched around my notebook. The figure stops, raises its head as if searching for something above, then disappears silently into an alley. I cross a stone bridge, feeling the weight of an invisible gaze following me through the night.`,
    },
  },
  8: {
    fr: {
      id: 8,
      location: 'Place Benjamin Zix',
      date: '15 janvier 1928',
      narrator: 'elias',
      text: `Je trouve enfin un espace dégagé en arrivant sur la Place Benjamin Zix. Sous la lumière vacillante des lampadaires, cette place semble hors du temps, une sorte de théâtre où les murs eux-mêmes paraissent écouter.

Je m'assois sur un banc pour noter mes pensées. Une femme en tablier passe, portant un panier couvert d'un linge blanc. Alors qu'elle s'éloigne, un papier tombe au sol. Je le ramasse et lis une simple phrase :

"Quand la lune sera pleine, les étoiles révéleront le chemin."

La note est griffonnée à la hâte, mais l'écriture semble familière, comme si je l'avais déjà vue dans mes recherches précédentes.`,
    },
    en: {
      id: 8,
      location: 'Place Benjamin Zix',
      date: 'January 15, 1928',
      narrator: 'elias',
      text: `I finally find an open space upon arriving at Place Benjamin Zix. Under the flickering lamplight, this square seems outside of time, a sort of theater where the walls themselves appear to listen.

I sit on a bench to note my thoughts. A woman in an apron passes by, carrying a basket covered with a white cloth. As she walks away, a piece of paper falls to the ground. I pick it up and read a single sentence:

"When the moon is full, the stars will reveal the path."

The note is hastily scrawled, but the handwriting seems familiar, as if I had already seen it in my previous research.`,
    },
  },
  9: {
    fr: {
      id: 9,
      location: 'Pont du Faisan',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `Le Pont du Faisan, avec sa mécanique visible, a un charme austère. Alors que je traverse, un bruit métallique attire mon attention. Une faible lueur semble émaner de l'eau en contrebas. J'essaie de distinguer la source, mais le courant emporte rapidement ce que je crois être une lanterne.

En atteignant l'autre rive, un détail me frappe : des symboles gravés sur les balustrades du pont, si discrets qu'ils auraient pu passer inaperçus. Ils ressemblent à un langage perdu, mais leur complexité géométrique est troublante. Cela ne peut être qu'une trace des pratiques occultes liées au culte.`,
    },
    en: {
      id: 9,
      location: 'Pont du Faisan',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `The Pont du Faisan, with its visible mechanism, has an austere charm. As I cross, a metallic noise catches my attention. A faint glow seems to emanate from the water below. I try to make out the source, but the current quickly carries away what I believe to be a lantern.

Upon reaching the other bank, a detail strikes me: symbols engraved on the bridge's balustrades, so discreet they could have gone unnoticed. They resemble a lost language, but their geometric complexity is unsettling. This can only be a trace of the occult practices linked to the cult.`,
    },
  },
  10: {
    fr: {
      id: 10,
      location: 'Les Ponts Couverts',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `En m'approchant des Ponts Couverts, je ressens une tension presque palpable dans l'air. Les tours de garde se dressent comme des veilleurs silencieux, et je m'interroge sur ce qu'elles ont pu voir au cours des siècles.

En marchant entre les arches, je découvre un détail troublant : des oiseaux morts, posés de manière ordonnée sur le bord du canal, comme si une main invisible les avait placés là.

Je prends une photographie, incapable d'en saisir pleinement la signification. Le silence ici est étrange, profond, interrompu seulement par le bruit sourd de l'eau.`,
    },
    en: {
      id: 10,
      location: 'Les Ponts Couverts',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `Approaching the Ponts Couverts, I feel an almost palpable tension in the air. The guard towers stand like silent watchers, and I wonder what they may have witnessed over the centuries.

Walking between the arches, I discover a disturbing detail: dead birds, arranged in an orderly fashion on the edge of the canal, as if an invisible hand had placed them there.

I take a photograph, unable to fully grasp the meaning. The silence here is strange, deep, broken only by the muffled sound of the water.`,
    },
  },
  11: {
    fr: {
      id: 11,
      location: 'Barrage Vauban',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `La vue depuis le Barrage Vauban est à couper le souffle. Pourtant, mon esprit est accaparé par un détail intrigant : une lumière vacillante visible dans une tour située à l'autre bout du pont. Personne ne semble y habiter, mais elle clignote à intervalles réguliers, comme un signal codé.

En descendant vers le niveau inférieur, je trouve une pierre tombale abandonnée, gravée de mots presque illisibles. Je copie ce que je peux dans mon carnet, un fragment qui mentionne :

"la porte entre les mondes"

Cela résonne étrangement avec les indices accumulés jusqu'à présent.`,
    },
    en: {
      id: 11,
      location: 'Barrage Vauban',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `The view from the Barrage Vauban is breathtaking. Yet my mind is occupied by an intriguing detail: a flickering light visible in a tower at the far end of the bridge. No one seems to live there, but it blinks at regular intervals, like a coded signal.

Descending to the lower level, I find an abandoned tombstone, engraved with nearly illegible words. I copy what I can into my notebook — a fragment that mentions:

"the gateway between worlds"

It resonates strangely with the clues accumulated so far.`,
    },
  },
  12: {
    fr: {
      id: 12,
      location: 'Rue du Bain-aux-Plantes',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `Je descends vers la Rue du Bain-aux-Plantes, où le calme règne. Une vieille porte vermoulue attire mon regard. Elle porte une inscription à peine lisible :

"Fermez les yeux pour voir."

Le message me perturbe, car il correspond à une phrase inscrite dans les archives consultées avant mon départ de Paris.

Alors que je passe devant une vitrine poussiéreuse, un homme à l'intérieur me fait signe d'entrer. Il porte un monocle et un sourire énigmatique. Je décide d'ignorer son invitation, mais l'étrangeté de cette rencontre reste gravée dans mon esprit.`,
    },
    en: {
      id: 12,
      location: 'Rue du Bain-aux-Plantes',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `I head down to the Rue du Bain-aux-Plantes, where calm reigns. An old worm-eaten door catches my eye. It bears a barely legible inscription:

"Close your eyes to see."

The message disturbs me, for it matches a phrase found in the archives I consulted before leaving Paris.

As I pass a dusty shop window, a man inside beckons me to enter. He wears a monocle and an enigmatic smile. I choose to ignore his invitation, but the strangeness of this encounter remains etched in my mind.`,
    },
  },
  13: {
    fr: {
      id: 13,
      location: "Grand'Rue",
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `La Grand'Rue est animée, mais cette agitation me paraît presque artificielle, comme si elle cachait un secret. Mon attention est attirée par une librairie ancienne où un livre semble m'appeler.

"Rituels oubliés des terres du Rhin" lit-on sur la couverture. En le feuilletant, je tombe sur un chapitre mentionnant des configurations stellaires liées à des rituels de passage. L'alignement décrit correspond à celui que j'ai vu dans l'atelier de la Rue des Tanneurs.

Je n'hésite pas à l'acheter, convaincu que ses pages contiennent des réponses.`,
    },
    en: {
      id: 13,
      location: "Grand'Rue",
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `The Grand'Rue is bustling, but this activity seems almost artificial to me, as if hiding a secret. My attention is drawn to an old bookshop where a book seems to call out to me.

"Forgotten Rituals of the Rhine Lands" reads the cover. Leafing through it, I come upon a chapter mentioning stellar configurations linked to rites of passage. The alignment described matches the one I saw in the workshop on Rue des Tanneurs.

I don't hesitate to buy it, convinced that its pages hold answers.`,
    },
  },
  14: {
    fr: {
      id: 14,
      location: 'Rue des Tanneurs',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `Les bâtiments imposants de la Rue des Tanneurs me rappellent la dureté du travail qui devait s'y dérouler autrefois. Sur une porte entrouverte, un symbole gravé attire mon attention. Il semble correspondre à ceux vus sur le pont, bien que légèrement différent.

À l'intérieur, une odeur de cuir tanné m'enveloppe. Alors que je progresse dans cet atelier abandonné, je découvre une boîte de bois posée sous une table. Elle contient des fragments d'un carnet, griffonnés dans une écriture désordonnée. Certains mots évoquent les "Veilleurs", et un schéma semble montrer un alignement d'étoiles particulières.

Ce lien avec les autres indices ne peut être ignoré.`,
    },
    en: {
      id: 14,
      location: 'Rue des Tanneurs',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `The imposing buildings of the Rue des Tanneurs remind me of the harsh labor that once took place here. On a half-open door, an engraved symbol catches my attention. It seems to match those seen on the bridge, though slightly different.

Inside, the smell of tanned leather envelops me. As I advance through this abandoned workshop, I discover a wooden box placed beneath a table. It contains fragments of a notebook, scrawled in messy handwriting. Some words mention "the Watchers," and a diagram seems to show a particular alignment of stars.

This connection to the other clues cannot be ignored.`,
    },
  },
  15: {
    fr: {
      id: 15,
      location: 'Place Kléber',
      date: '16 janvier 1928',
      narrator: 'elias',
      text: `La statue au centre de la Place Kléber projette une ombre longue et menaçante sous la lumière changeante. Assis sur un banc, je relis mes notes, cherchant un fil conducteur. Une phrase du livre résonne dans mon esprit :

"Le veilleur attend toujours à l'intersection."

Strasbourg elle-même semble cette intersection, où les étoiles et les symboles se croisent.

Tout ce que j'ai vu dans le quartier de la Petite France me hante encore. L'étrange papier ramassé à la Place Benjamin Zix semble indiquer un lieu précis. En le comparant à d'autres fragments de cartes trouvés, un point semble se dégager : la Place du Temple Neuf.`,
    },
    en: {
      id: 15,
      location: 'Place Kléber',
      date: 'January 16, 1928',
      narrator: 'elias',
      text: `The statue at the center of Place Kléber casts a long, menacing shadow in the shifting light. Sitting on a bench, I reread my notes, searching for a thread. A phrase from the book echoes in my mind:

"The watcher always waits at the intersection."

Strasbourg itself seems to be that intersection, where stars and symbols converge.

Everything I've seen in the Petite France quarter still haunts me. The strange paper picked up at Place Benjamin Zix seems to point to a specific location. Comparing it to other map fragments found, one point emerges: the Place du Temple Neuf.`,
    },
  },
  16: {
    fr: {
      id: 16,
      location: 'Place du Temple Neuf',
      date: '19 février 1871',
      narrator: 'armand',
      text: `À la Place du Temple Neuf, sous une arche imposante, j'ai trouvé ce qui semble être l'un de ces objets. Une forme métallique noire, incrustée dans la pierre. En la touchant, j'ai ressenti un froid intense, comme si l'objet rejetait toute chaleur.

Les symboles gravés sur sa surface me rappellent d'anciennes constellations, mais leur agencement est chaotique. Un homme âgé, qui passait par là, m'a confié une histoire étrange : on raconte que cet objet aurait été placé ici par des maçons il y a des siècles, à la demande d'un groupe mystérieux. Les habitants de l'époque évitaient cet endroit, parlant de lumières et de sons venus d'un autre monde.

Je ne sais pas pourquoi ces objets ont été scellés dans les murs, mais ils ne sont pas ordinaires. Ce fragment est une pièce d'un puzzle plus grand, un puzzle dont je ne vois pas encore la forme.`,
    },
    en: {
      id: 16,
      location: 'Place du Temple Neuf',
      date: 'February 19, 1871',
      narrator: 'armand',
      text: `At the Place du Temple Neuf, beneath an imposing arch, I found what appears to be one of these objects. A black metallic shape, embedded in the stone. Upon touching it, I felt an intense cold, as if the object rejected all warmth.

The symbols engraved on its surface remind me of ancient constellations, but their arrangement is chaotic. An elderly man passing by shared a strange story: it is said that this object was placed here by masons centuries ago, at the request of a mysterious group. The inhabitants of that era avoided this place, speaking of lights and sounds from another world.

I do not know why these objects were sealed into the walls, but they are far from ordinary. This fragment is a piece of a larger puzzle — a puzzle whose shape I cannot yet see.`,
    },
  },
  17: {
    fr: {
      id: 17,
      location: 'Cathédrale de Strasbourg',
      date: '5 mars 1871',
      narrator: 'armand',
      text: `La Cathédrale de Strasbourg. Monument imposant, sentinelle intemporelle de la ville. Chaque pierre semble chargée de mémoire, chaque sculpture un gardien silencieux d'un secret oublié.

C'est dans un bâtiment adjacent, juste en face de la Maison Kammerzell, qu'une façade discrète abritait un autre de ces fragments. Incrusté dans le mur, à peine visible à l'œil nu, l'objet semblait attendre d'être retrouvé. Sa surface noire et gravée portait une gravité particulière, comme s'il avait une connexion plus intime avec ce lieu.

Les récits de Hans-Erik Mülheim me reviennent sans cesse. Son obsession pour ces artefacts, ses transactions au "Canon", et sa fin tragique sur le Pont du Corbeau ne peuvent pas être des coïncidences.

Une phrase gravée sur une plaque près de l'entrée m'a troublé :
"Là où les ombres de la pierre rencontrent la lumière des étoiles, le passage s'ouvre."

Je suis convaincu que la Cathédrale, plus que n'importe quel autre lieu, détient les clés de ce mystère.`,
    },
    en: {
      id: 17,
      location: 'Cathédrale de Strasbourg',
      date: 'March 5, 1871',
      narrator: 'armand',
      text: `The Strasbourg Cathedral. An imposing monument, a timeless sentinel of the city. Every stone seems charged with memory, every sculpture a silent guardian of a forgotten secret.

It was in an adjacent building, just across from the Maison Kammerzell, that a discreet facade housed another of these fragments. Embedded in the wall, barely visible to the naked eye, the object seemed to be waiting to be found. Its black, engraved surface carried a particular gravity, as if it held a more intimate connection to this place.

The stories of Hans-Erik Mülheim keep coming back to me. His obsession with these artifacts, his dealings at "Au Canon," and his tragic end on the Pont du Corbeau cannot be coincidences.

A phrase engraved on a plaque near the entrance troubled me:
"Where the shadows of stone meet the light of the stars, the passage opens."

I am convinced that the Cathedral, more than any other place, holds the keys to this mystery.`,
    },
  },
}

export function getCheckpointContent(id: number, locale: 'fr' | 'en'): CheckpointContent | null {
  const entry = checkpointData[id]
  if (!entry) return null
  return entry[locale]
}
