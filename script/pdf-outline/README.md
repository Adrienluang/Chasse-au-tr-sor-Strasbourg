# Simple script permettant d'extraire depuis un fichier pdf l'arborescence des bookmark

```shell
node extract-outline.mjs ./RMxxxx.pdf > outline.json;
node preprocess-outline.mjs outline.json outline.preprocessed.json;
node build-index.mjs outline.preprocessed.json docs/00_index
node generate-section-files-v2.mjs outline.preprocessed.json docs --max-level 2 --recursive



```