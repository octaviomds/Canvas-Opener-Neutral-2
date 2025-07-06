const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Garde une référence globale de l'objet window
let mainWindow;

function createWindow() {
  // Crée la fenêtre du navigateur avec une configuration sécurisée
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Configuration de sécurité moderne
      nodeIntegration: false,        // Désactive l'intégration Node.js
      contextIsolation: true,        // Active l'isolation du contexte
      enableRemoteModule: false,     // Désactive le module remote
      preload: path.join(__dirname, 'preload.js') // Charge le script preload
    },
    titleBarStyle: 'default',
    show: false,
    // Configuration supplémentaire pour macOS
    titleBarOverlay: false,
    trafficLightPosition: { x: 20, y: 20 }
  });

  // Charge le fichier index.html de l'application
  mainWindow.loadFile('src/index.html');

  // Affiche la fenêtre une fois qu'elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // En mode développement, ouvre les outils de développement
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Émis lorsque la fenêtre est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Sécurité: empêche la navigation vers des URLs externes
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Autorise seulement les URLs locales
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault();
    }
  });

  // Sécurité: empêche l'ouverture de nouvelles fenêtres
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Optionnel: ouvrir dans le navigateur par défaut
    // require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Gestionnaires IPC pour la communication sécurisée
ipcMain.handle('demo-action', async (event, data) => {
  console.log('Action reçue du renderer:', data);
  
  // Traite l'action et renvoie une réponse
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    receivedData: data,
    message: 'Action traitée avec succès'
  };
  
  // Envoie une réponse au processus de rendu
  event.sender.send('demo-response', response);
  
  return response;
});

ipcMain.handle('get-system-info', async (event) => {
  const systemInfo = {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node
  };
  
  return systemInfo;
});

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  createWindow();
  
  // Configuration de sécurité globale
  app.on('web-contents-created', (event, contents) => {
    // Sécurité: désactive la navigation
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.origin !== 'file://') {
        event.preventDefault();
      }
    });
    
    // Sécurité: désactive les nouvelles fenêtres
    contents.setWindowOpenHandler(({ url }) => {
      return { action: 'deny' };
    });
  });
});

// Quitte l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour les applications de rester actives
  // jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre quand l'icône du dock
  // est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion propre de la fermeture
app.on('before-quit', () => {
  // Nettoyage avant fermeture
  console.log('Application en cours de fermeture...');
});