const { contextBridge, ipcRenderer } = require('electron');

// Expose des APIs sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Informations système
  getVersions: () => ({
    node: process.versions.node,
    electron: process.versions.electron,
    platform: process.platform
  }),
  
  // Communication avec le processus principal
  sendMessage: (channel, data) => {
    // Liste blanche des canaux autorisés
    const validChannels = ['demo-action', 'get-system-info'];
    if (validChannels.includes(channel)) {
      ipcRenderer.invoke(channel, data);
    }
  },
  
  // Écouter les messages du processus principal
  onMessage: (channel, callback) => {
    const validChannels = ['demo-response', 'system-info-response'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  
  // Supprimer les écouteurs
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});