# Cucina — Culinary Web App & Kitchen Companion

A modern cooking web application featuring curated recipes, interactive step-by-step cook mode with kitchen timers, dynamic ingredient serving scaler, pantry matcher, and culinary reference guides.

---

## 🚀 Comment publier sur GitHub Pages / How to deploy on GitHub Pages

GitHub Pages est un hébergeur **statique** (il lit uniquement HTML, CSS et JS compilés). Il n'exécute pas directement les fichiers sources TypeScript (`.tsx`) ou `package.json`.

Voici les deux façons simples de faire fonctionner le site sur **GitHub Pages** :

### Méthode 1 : Automatique avec GitHub Actions (Recommandée - 1 clic)

1. Allez sur votre dépôt GitHub : **https://github.com/alexand58098/web**
2. Cliquez sur **Settings** (Paramètres en haut)
3. Dans la colonne de gauche, cliquez sur **Pages**
4. Sous **Build and deployment** > **Source**, sélectionnez **GitHub Actions** (au lieu de *"Deploy from a branch"*)
5. Allez dans l'onglet **Actions** de votre dépôt : GitHub va automatiquement compiler l'application et la mettre en ligne sur `https://alexand58098.github.io/web/` !

---

### Méthode 2 : Téléversement manuel (Glisser-Déposer)

Si vous téléversez manuellement les fichiers sur GitHub :
1. Ne téléversez **pas** le dossier `src/` ou `package.json`.
2. Téléversez **uniquement** le contenu du dossier **`dist/`** :
   - `index.html`
   - Le dossier `assets/` (contenant le JS et CSS compilés)
   - Le fichier `.nojekyll`
3. Votre site fonctionnera immédiatement sans aucune erreur 404.
