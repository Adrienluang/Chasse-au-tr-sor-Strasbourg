# Premier déploiement — Checklist

## Fichiers Docker créés

- [x] `App/Dockerfile` — Multi-stage : node:22-alpine build → nginx:alpine serve
- [x] `App/nginx.conf` — Config SPA avec fallback + cache assets
- [x] `App/.dockerignore` — Exclut node_modules, .nuxt, .output, .env
- [x] `compose.base.yml` — Service de base avec build args
- [x] `compose.prod.yml` — Labels Traefik + réseau dokploy
- [x] `compose.dokploy.yml` — Fichier fusionné pour Dokploy

## Regénérer compose.dokploy.yml

```bash
docker compose -f compose.base.yml -f compose.prod.yml config > compose.dokploy.yml
```

## Test local Docker

```bash
# Build
docker build -t chasse-tresor ./App

# Run
docker run -p 8080:80 chasse-tresor

# Vérifier :
# - http://localhost:8080 → page d'accueil
# - http://localhost:8080/map → refresh ne donne pas 404 (SPA routing)
```

## Configuration Dokploy

1. **Créer l'application** dans Dokploy (type : Docker Compose)
2. **Compose file** : utiliser `compose.dokploy.yml`
3. **Variables d'environnement** à configurer dans Dokploy :
   - `NUXT_PUBLIC_GRAPHHOPPER_API_KEY` — clé API GraphHopper

## DNS Cloudflare

1. Ajouter un enregistrement **CNAME** :
   - Name : `chasse-tresor`
   - Target : IP/domaine du serveur Dokploy
   - Proxy : **activé** (orange cloud)
2. SSL/TLS mode Cloudflare : **Full (strict)**

## Vérification post-déploiement

- [ ] `https://chasse-tresor.mathieufroehly.fr` charge l'app
- [ ] HTTPS valide (cadenas vert)
- [ ] Refresh sur `/map` fonctionne (pas de 404)
- [ ] La carte Leaflet s'affiche correctement
- [ ] Test sur mobile (responsive + géolocalisation)
- [ ] Les assets `/_nuxt/` sont cachés (vérifier headers Cache-Control)
