import apcr from "./competence.json";

/**
 * Module de gestion des données utilisateur
 * Gère le localStorage pour la persistance et l'historique des AC
 */

const UserData = {
  acs: {

     },

};

UserData.init = function(){
  for (let ac in apcr)  {
    this.acs[ac] = {
      percent: 0,
      history: [],
    };
  }
}

UserData.getAC = function(acId) {
  return this.acs[acId] || null;
}





UserData.updatePercentage = function(acId, percent) {
  const ac = this.getAC(acId);
  if (ac) {
    ac.percent = percent;
  }
}








/**
 * Récupérer le pourcentage d'un AC spécifique
 * @param {string} acId - ID de l'AC
 * @returns {number} - Pourcentage (0-100)
 */
UserData.get = function(acId) {
  const data = JSON.parse(localStorage.getItem(`ac-${acId}`) || '{}');
  return data.percent || 0;
};





























/**
 * Récupérer tous les pourcentages d'AC (sans historique)
 * @returns {object} - Objet {acId: pourcentage}
 */
UserData.getAll = function() {
  const allData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ac-')) {
      const acId = key.replace('ac-', '');
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      allData[acId] = data.percent || 0;
    }
  }
  return allData;
};

















/**
 * Récupérer l'historique d'un AC
 * @param {string} acId - ID de l'AC
 * @returns {array} - Tableau d'entrées historiques
 */
UserData.getHistoryByAC = function(acId) {
  const history = JSON.parse(localStorage.getItem(`history-${acId}`) || '[]');
  return history;
};































/**
 * Sauvegarder le pourcentage d'un AC avec timestamp
 * @param {string} acId - ID de l'AC
 * @param {number} percent - Pourcentage (0-100)
 */
UserData.saveAC = function(acId, percent) {
  const timestamp = new Date().toLocaleString('fr-FR');
  const data = {
    percent: parseInt(percent),
    dateFormatted: timestamp,
    timestamp: Date.now()
  };
  
  localStorage.setItem(`ac-${acId}`, JSON.stringify(data));
  
  // Sauvegarder/mettre à jour l'historique
  const historyKey = `history-${acId}`;
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  history.push(data);
  localStorage.setItem(historyKey, JSON.stringify(history));
};



























/**
 * Récupérer TOUTES les données : AC + historique (format simplifié pour export)
 * @returns {object} - Objet avec tous les AC, pourcentage actuel et historique
 */
UserData.getAllWithHistory = function() {
  const allData = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('ac-')) {
      const acId = key.replace('ac-', '');
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      
      // Ajouter les données de l'AC - format simplifié
      allData[acId] = {
        percent: data.percent || 0,
        dateFormatted: data.dateFormatted || '',
        history: this.getHistoryByAC(acId).map(entry => ({
          percent: entry.percent,
          dateFormatted: entry.dateFormatted
        }))
      };
    }
  }
  
  return allData;
};























/**
 * Importer des données depuis un JSON exporté
 * @param {object} importedData - Données importées (peut être plusieurs formats)
 */
UserData.importFromJSON = function(importedData) {
  Object.keys(importedData).forEach(acId => {
    const data = importedData[acId];
    
    // Format 1 : Simple pourcentage
    if (typeof data === 'number') {
      this.saveAC(acId, data);
      return;
    }
    
    // Format 2 : Objet avec percent, dateFormatted, history (format export standard)
    if (data.percent !== undefined && Array.isArray(data.history)) {
      const currentData = {
        percent: data.percent,
        dateFormatted: data.dateFormatted || new Date().toLocaleString('fr-FR'),
        timestamp: Date.now()
      };
      localStorage.setItem(`ac-${acId}`, JSON.stringify(currentData));
      
      // Restaurer l'historique avec les timestamps si disponibles
      const restoredHistory = data.history.map(entry => ({
        percent: entry.percent,
        dateFormatted: entry.dateFormatted,
        timestamp: entry.timestamp || Date.now()
      }));
      localStorage.setItem(`history-${acId}`, JSON.stringify(restoredHistory));
      return;
    }
  });
};



































/**
 * Réinitialiser toutes les données
 */
UserData.clear = function() {
  Object.keys(localStorage)
    .filter(key => key.startsWith('ac-') || key.startsWith('history-'))
    .forEach(key => localStorage.removeItem(key));
};








/**
 * Exporter les données en JSON (avec historique)
 * @returns {void} - Lance le téléchargement du fichier
 */
UserData.exportToJSON = function() {
  const allData = this.getAllWithHistory();
  const dataStr = JSON.stringify(allData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `competences-export-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};














/**
 * Importer des données depuis un JSON exporté
 * @param {object} importedData - Données importées (peut être plusieurs formats)
 * @returns {void}
 */
UserData.importFromJSON = function(importedData) {
  Object.keys(importedData).forEach(acId => {
    const data = importedData[acId];
    
    // Format 1 : import d'un Simple pourcentage
    if (typeof data === 'number') {
      this.saveAC(acId, data);
      return;
    }
    
    // Format 2 : Objet avec percent, dateFormatted, history (format export standard)
    if (data.percent !== undefined && Array.isArray(data.history)) {
      const currentData = {
        percent: data.percent,
        dateFormatted: data.dateFormatted || new Date().toLocaleString('fr-FR'),
        timestamp: Date.now()
      };
      localStorage.setItem(`ac-${acId}`, JSON.stringify(currentData));
      
      // Restaurer l'historique avec les timestamps si disponibles
      const restoredHistory = data.history.map(entry => ({
        percent: entry.percent,
        dateFormatted: entry.dateFormatted,
        timestamp: entry.timestamp || Date.now()
      }));
      localStorage.setItem(`history-${acId}`, JSON.stringify(restoredHistory));
      return;
    }
  });
};













/**
 * Réinitialiser toutes les données
 * @returns {void}
 */
UserData.clear = function() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('ac-') || key.startsWith('history-'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};











export { UserData };