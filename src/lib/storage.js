// const STORAGE_KEY = "sae303_ac_data";
// const HISTORY_KEY = "sae303_ac_history";

// let Storage = {};




























// Storage.saveAC = function(acId, percent) {
//   let data = Storage.getAll();
//   data[acId] = percent;
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
//   // Ajouter à l'historique
//   Storage.addToHistory(acId, percent);
// };

// Storage.getAll = function() {
//   const data = localStorage.getItem(STORAGE_KEY);
//   return data ? JSON.parse(data) : {};
// };

// Storage.getAC = function(acId) {
//   return Storage.getAll()[acId] || 0;
// };

// Storage.clear = function() {
//   localStorage.removeItem(STORAGE_KEY);
//   localStorage.removeItem(HISTORY_KEY);
// };

// // Historique des modifications
// Storage.addToHistory = function(acId, percent) {
//   let history = Storage.getHistory();
  
//   const entry = {
//     acId: acId,
//     percent: percent,
//     date: new Date().toISOString(),
//     dateFormatted: new Date().toLocaleString('fr-FR', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     })
//   };
  
//   history.push(entry);
//   localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
// };

// Storage.getHistory = function() {
//   const data = localStorage.getItem(HISTORY_KEY);
//   return data ? JSON.parse(data) : [];
// };

// Storage.getHistoryByAC = function(acId) {
//   const history = Storage.getHistory();
//   return history.filter(entry => entry.acId === acId);
// };

// Storage.clearHistory = function() {
//   localStorage.removeItem(HISTORY_KEY);
// };

// Storage.export = function() {
//   const data = Storage.getAll();
//   const history = Storage.getHistory();
  
//   const exportData = {
//     data: data,
//     history: history,
//     exportDate: new Date().toISOString()
//   };
  
//   const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
//   link.click();
//   URL.revokeObjectURL(url);
// };

// export { Storage };




let Storage = {};

/**
 * Récupérer le pourcentage d'un AC spécifique
 * @param {string} acId - ID de l'AC
 * @returns {number} - Le pourcentage sauvegardé (0-100)
 */
Storage.get = function(acId) {
  const data = JSON.parse(localStorage.getItem(`ac-${acId}`) || '{}');
  return data.percent || 0;
};

/**
 * Récupérer tous les pourcentages d'AC
 * @returns {object} - Objet avec tous les AC et leurs pourcentages
 */
Storage.getAll = function() {
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
 * Sauvegarder le pourcentage d'un AC avec timestamp
 * @param {string} acId - ID de l'AC
 * @param {number} percent - Pourcentage (0-100)
 */
Storage.saveAC = function(acId, percent) {
  const timestamp = new Date().toLocaleString('fr-FR');
  const data = {
    percent: parseInt(percent),
    dateFormatted: timestamp,
    timestamp: Date.now()
  };
  
  // Sauvegarder les données principales
  localStorage.setItem(`ac-${acId}`, JSON.stringify(data));
  
  // Sauvegarder/mettre à jour l'historique
  const historyKey = `history-${acId}`;
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  history.push(data);
  localStorage.setItem(historyKey, JSON.stringify(history));
};





/**
 * Récupérer l'historique d'un AC
 * @param {string} acId - ID de l'AC
 * @returns {array} - Tableau de l'historique
 */
Storage.getHistoryByAC = function(acId) {
  const history = JSON.parse(localStorage.getItem(`history-${acId}`) || '[]');
  return history;
};





/**
 * Récupérer TOUTES les données : AC + historique
 * @returns {object} - Objet avec tous les AC et leurs historiques
 */
Storage.getAllWithHistory = function() {
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
 * Réinitialiser toutes les données
 */
Storage.clear = function() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('ac-') || key.startsWith('history-'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};











export { Storage };