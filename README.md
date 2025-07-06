# Canvas Opener

Une application Electron moderne et sécurisée, prête pour le développement et le packaging macOS. Cette base vide offre une architecture solide avec les meilleures pratiques de sécurité Electron.

## 🚀 Fonctionnalités

- ✅ **Architecture sécurisée** - Configuration Electron moderne avec isolation de contexte
- ✅ **Communication IPC sécurisée** - API exposée via preload script
- ✅ **Interface responsive** - Design moderne avec CSS Grid/Flexbox
- ✅ **Build automatisé** - Support macOS (Intel + Apple Silicon)
- ✅ **Mode développement** - Hot reload et outils de développement
- ✅ **Prêt pour l'extension** - Structure modulaire et extensible

## 📋 Prérequis

- **Node.js** 16.x ou supérieur
- **npm** 7.x ou supérieur
- **macOS** (pour le build macOS)

## 🛠 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd canvas-opener

# Installer les dépendances
npm install
```

## 🚀 Utilisation

### Mode développement

```bash
# Lancer l'application en mode développement
npm run dev

# Ou simplement
npm start
```

Le mode développement active automatiquement :
- Les outils de développement Chrome
- Le rechargement automatique
- Les logs détaillés

### Build de production

```bash
# Build pour macOS (Intel + Apple Silicon)
npm run build:mac

# Build universel
npm run build

# Créer un package sans distribution
npm run pack

# Créer les fichiers de distribution
npm run dist
```

Les fichiers générés se trouvent dans le dossier `dist/` :
- `.dmg` - Installateur macOS
- `.zip` - Archive portable
- Dossiers par architecture (x64, arm64)

## 📁 Structure du projet

```
canvas-opener/
├── src/                    # Code source principal
│   ├── main.js            # Processus principal Electron
│   ├── preload.js         # Script de préchargement sécurisé
│   ├── renderer.js        # Logique côté interface
│   ├── index.html         # Interface utilisateur
│   └── styles.css         # Feuilles de style
├── assets/                # Ressources statiques
│   └── .gitkeep          # (Ajoutez vos icônes ici)
├── dist/                  # Fichiers de build (généré)
├── node_modules/          # Dépendances (généré)
├── package.json           # Configuration du projet
├── package-lock.json      # Verrouillage des versions
└── README.md             # Ce fichier
```

## 🔧 Configuration

### Personnalisation de l'application

1. **Métadonnées** - Modifiez `package.json` :
   ```json
   {
     "name": "votre-app",
     "productName": "Votre Application",
     "description": "Description de votre app",
     "author": "Votre Nom"
   }
   ```

2. **Icône** - Ajoutez `assets/icon.icns` pour macOS

3. **Fenêtre** - Configurez dans `src/main.js` :
   ```javascript
   mainWindow = new BrowserWindow({
     width: 1200,        // Largeur
     height: 800,        // Hauteur
     minWidth: 800,      // Largeur minimale
     minHeight: 600,     // Hauteur minimale
     // ... autres options
   });
   ```

### Configuration du build

Le build est configuré dans `package.json` sous la section `build` :

```json
{
  "build": {
    "productName": "Canvas Opener",
    "directories": {
      "output": "dist"
    },
    "mac": {
      "category": "public.app-category.utilities",
      "target": [
        { "target": "dmg", "arch": ["x64", "arm64"] },
        { "target": "zip", "arch": ["x64", "arm64"] }
      ]
    }
  }
}
```

## 🔒 Sécurité

Cette application implémente les meilleures pratiques de sécurité Electron :

### Configuration sécurisée

- ❌ `nodeIntegration: false` - Pas d'accès Node.js direct
- ✅ `contextIsolation: true` - Isolation du contexte
- ✅ `preload` script - API contrôlée
- ❌ `enableRemoteModule: false` - Module remote désactivé

### Communication IPC

```javascript
// Dans renderer.js - Communication sécurisée
window.electronAPI.sendMessage('channel-name', data);

// Dans main.js - Gestionnaire sécurisé
ipcMain.handle('channel-name', async (event, data) => {
  // Traitement sécurisé
  return response;
});
```

### Protection contre les vulnérabilités

- Navigation externe bloquée
- Ouverture de nouvelles fenêtres contrôlée
- Liste blanche des canaux IPC
- Validation des données entrantes

## 🎨 Développement

### Ajouter de nouvelles fonctionnalités

1. **Interface utilisateur** - Modifiez `src/index.html`
2. **Styles** - Ajoutez vos CSS dans `src/styles.css`
3. **Logique frontend** - Développez dans `src/renderer.js`
4. **Logique backend** - Étendez `src/main.js`
5. **API sécurisée** - Exposez via `src/preload.js`

### Exemple d'ajout de fonctionnalité

```javascript
// 1. Dans preload.js - Exposer l'API
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file-dialog')
});

// 2. Dans main.js - Gérer l'action
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
  });
  return result;
});

// 3. Dans renderer.js - Utiliser l'API
document.getElementById('open-btn').addEventListener('click', async () => {
  const result = await window.electronAPI.openFile();
  console.log('Fichier sélectionné:', result);
});
```

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'application |
| `npm run dev` | Mode développement avec DevTools |
| `npm run build` | Build pour toutes les plateformes |
| `npm run build:mac` | Build spécifique macOS |
| `npm run pack` | Package sans distribution |
| `npm run dist` | Crée les fichiers de distribution |

## 🐛 Débogage

### Outils de développement

En mode développement (`npm run dev`), les outils Chrome DevTools sont automatiquement ouverts.

### Logs

```javascript
// Dans le processus principal (main.js)
console.log('Log du processus principal');

// Dans le processus de rendu (renderer.js)
console.log('Log du processus de rendu');
```

### Problèmes courants

1. **Erreur de sécurité CSP** - Vérifiez la configuration `webPreferences`
2. **API non disponible** - Assurez-vous que `preload.js` est chargé
3. **Build échoue** - Vérifiez les permissions et l'espace disque

## 📦 Distribution

### Préparer la distribution

1. **Tester en mode production** :
   ```bash
   npm run pack
   # Testez l'app dans dist/mac/Canvas Opener.app
   ```

2. **Créer les installateurs** :
   ```bash
   npm run build:mac
   ```

3. **Fichiers générés** :
   - `dist/Canvas Opener-1.0.0.dmg` - Installateur
   - `dist/Canvas Opener-1.0.0-mac.zip` - Archive portable

### Signature de code (optionnel)

Pour distribuer sur macOS sans avertissements :

1. Obtenez un certificat développeur Apple
2. Configurez dans `package.json` :
   ```json
   {
     "build": {
       "mac": {
         "identity": "Developer ID Application: Votre Nom"
       }
     }
   }
   ```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez (`git commit -am 'Ajoute nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/votre-repo/issues)
- **Documentation Electron** : [electronjs.org](https://www.electronjs.org/)
- **Electron Builder** : [electron.build](https://www.electron.build/)

## 🔄 Changelog

### v1.0.0
- ✅ Configuration initiale Electron
- ✅ Architecture sécurisée
- ✅ Build macOS (Intel + Apple Silicon)
- ✅ Interface utilisateur de base
- ✅ Documentation complète

---

**Développé avec ❤️ et Electron**