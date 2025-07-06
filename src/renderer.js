// Ce fichier s'exécute dans le processus de rendu (navigateur)
// Il utilise maintenant l'API sécurisée exposée par preload.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Récupère les informations système via l'API sécurisée
        const versions = window.electronAPI.getVersions();
        
        // Affiche les informations système
        document.getElementById('node-version').textContent = versions.node;
        document.getElementById('electron-version').textContent = versions.electron;
        document.getElementById('platform').textContent = versions.platform;
        
        // Gestion du bouton de démonstration
        const demoButton = document.getElementById('demo-button');
        const messageDiv = document.getElementById('message');
        
        demoButton.addEventListener('click', async () => {
            try {
                // Envoie un message au processus principal
                await window.electronAPI.sendMessage('demo-action', { 
                    timestamp: new Date().toISOString(),
                    action: 'button-clicked'
                });
                
                // Affiche le message de succès
                showMessage('Bouton cliqué ! L\'application fonctionne correctement.', 'success');
                
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                showMessage('Erreur lors de la communication avec le processus principal.', 'error');
            }
        });
        
        // Fonction utilitaire pour afficher les messages
        function showMessage(text, type = 'success') {
            messageDiv.textContent = text;
            messageDiv.className = `message ${type}`;
            
            // Cache le message après 3 secondes
            setTimeout(() => {
                messageDiv.className = 'message hidden';
            }, 3000);
        }
        
        // Écoute les réponses du processus principal
        window.electronAPI.onMessage('demo-response', (event, data) => {
            console.log('Réponse du processus principal:', data);
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        // Affichage d'erreur si l'API n'est pas disponible
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Erreur: API Electron non disponible. Vérifiez la configuration de sécurité.';
        messageDiv.className = 'message error';
    }
});

// Nettoyage lors de la fermeture
window.addEventListener('beforeunload', () => {
    // Supprime tous les écouteurs d'événements
    if (window.electronAPI && window.electronAPI.removeAllListeners) {
        window.electronAPI.removeAllListeners('demo-response');
        window.electronAPI.removeAllListeners('system-info-response');
    }
});