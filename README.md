# Tableau de suivi des scénarios Gherkin

Cette mini-application fournit un tableau interactif permettant de suivre l'avancement des scénarios écrits en Gherkin. Elle est conçue pour être publiée sur GitHub Pages et ne nécessite aucune base de données : les statuts et commentaires sont stockés dans le navigateur de l'utilisateur et peuvent être exportés sous forme de fichier JSON.

## Fonctionnalités principales

- **Génération automatique** du fichier `data/scenarios.json` à partir des fichiers Markdown présents dans `gherkin/`.
- **Onglets par fonctionnalité** permettant de naviguer facilement entre les scénarios.
- **Sélecteur de statut** avec badges colorés (OK, KO, N/A, FIX) grâce à [DaisyUI](https://daisyui.com/).
- **Champ de commentaire** pour chaque scénario.
- **Sauvegarde automatique** des statuts et commentaires dans le `localStorage` du navigateur.
- **Bouton d'export** pour récupérer un JSON à jour.
- **Bouton "Générer les scénarios"** afin de recharger la définition depuis les fichiers Gherkin côté client.

## Prérequis

- Node.js ≥ 18 (pour exécuter le script de génération).
- Les fichiers Gherkin au format Markdown dans le dossier `gherkin/`.

## Générer le JSON des scénarios

```bash
npm run generate
```

Cette commande :

1. scanne le dossier `gherkin/`,
2. extrait toutes les fonctionnalités et scénarios,
3. met à jour `data/scenarios.json` et `data/gherkin-files.json`.

Les statuts/commentaires existants sont conservés lorsqu'ils sont présents dans le JSON précédent.

## Lancer l'application en local

Comme il s'agit d'un site statique, il suffit de servir la racine du dépôt. Par exemple :

```bash
python -m http.server 4173
```

Puis ouvrez [http://localhost:4173](http://localhost:4173) dans votre navigateur.

> Vous pouvez utiliser n'importe quel autre serveur HTTP statique (Caddy, nginx, `npx serve`, etc.).

## Déploiement sur GitHub Pages

1. Générez le JSON via `npm run generate` et validez les changements.
2. Poussez le contenu du dépôt sur GitHub.
3. Dans les paramètres de GitHub Pages, sélectionnez la branche contenant le projet (par exemple `main`) et choisissez la source **/ (root)**.
4. GitHub Pages servira directement `index.html`, ainsi que les dossiers `gherkin/`, `data/`, `assets/` et `js/`.

## Persistance des statuts

- Les choix effectués dans l'interface sont enregistrés dans le `localStorage` du navigateur.
- L'export JSON reflète en permanence l'état courant (statuts et commentaires).
- Pour partager les résultats, exportez le fichier JSON et ajoutez-le au dépôt si nécessaire.

## Structure du projet

```
├── assets/                  # Styles additionnels
├── data/                    # JSON générés par le script
├── gherkin/                 # Fichiers Gherkin au format Markdown
├── js/                      # Code JavaScript de l'interface
├── scripts/generate-scenarios.mjs
├── index.html
└── package.json
```

## Personnalisation

- L'apparence s'appuie sur Tailwind CSS + DaisyUI via CDN ; adaptez le thème dans `index.html` si besoin.
- Les statuts disponibles sont définis dans `js/main.js` (`STATUS_OPTIONS`). Ajoutez des entrées pour gérer d'autres workflows.
- Le parseur Gherkin est minimaliste. Si votre syntaxe évolue (par exemple avec des `Scenario Outline` plus complexes), mettez à jour la fonction `parseGherkinContent` dans le script Node **et** dans `js/main.js`.

Bonne recette de tests !
