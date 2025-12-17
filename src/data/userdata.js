import apcr from "./competence.json";

/**
 * Module de gestion des données utilisateur
 * Gère la persistance et l'historique des AC via localStorage minimal
 */

const UserData = {
  acs: {},
  STORAGE_KEY: "sae303-userdata"
};

/** Initialiser les AC depuis le JSON. */
UserData.init = function() {



  // Charger depuis localStorage d'abord
  this.loadFromStorage();
  
  
  
  
  // Initialiser les AC manquants
  for (let ac in apcr) {
    if (!this.acs[ac]) {
      this.acs[ac] = {
        percent: 0,
        dateFormatted: new Date().toLocaleString('fr-FR'),
        timestamp: Date.now(),
        history: []
      };
    }
  }
};



















/**
 * Charger toutes les données depuis localStorage (SEUL getItem)
 */
UserData.loadFromStorage = function() {
  const stored = localStorage.getItem(this.STORAGE_KEY);
  if (stored) {
    try {
      this.acs = JSON.parse(stored);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      this.acs = {};
    }
  }
};
















/**
 * Sauvegarder toutes les données dans localStorage (SEUL setItem)
 */
UserData.saveToStorage = function() {
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.acs));
};




















/**
 * Récupérer un AC spécifique (EN MÉMOIRE)
 */
UserData.getAC = function(acId) {
  return this.acs[acId] || null;
};

























/**
 * Récupérer le pourcentage d'un AC (EN MÉMOIRE)
 */
UserData.get = function(acId) {
  const ac = this.getAC(acId);
  return ac ? ac.percent : 0;
};




























/**
 * Récupérer tous les pourcentages (EN MÉMOIRE)
 */
UserData.getAll = function() {
  const allData = {};
  for (let acId in this.acs) {
    allData[acId] = this.acs[acId].percent || 0;
  }
  return allData;
};





















/**
 * Récupérer l'historique d'un AC (EN MÉMOIRE)
 */
UserData.getHistoryByAC = function(acId) {
  const ac = this.getAC(acId);
  return ac ? ac.history || [] : [];
};
























/**
 * Mettre à jour le pourcentage d'un AC (EN MÉMOIRE + localStorage)
 */
UserData.updatePercentage = function(acId, percent) {
  if (!this.acs[acId]) {
    this.acs[acId] = {
      percent: 0,
      dateFormatted: new Date().toLocaleString('fr-FR'),
      timestamp: Date.now(),
      history: []
    };
  }
  
  const ac = this.acs[acId];
  ac.percent = parseInt(percent);
  ac.dateFormatted = new Date().toLocaleString('fr-FR');
  ac.timestamp = Date.now();
  
  // Ajouter à l'historique
  ac.history.push({
    percent: ac.percent,
    dateFormatted: ac.dateFormatted,
    timestamp: ac.timestamp
  });
  
  // Sauvegarder en localStorage
  this.saveToStorage();
};


















/**
 * Alias pour updatePercentage (compatibilité)
 */
UserData.saveAC = function(acId, percent) {
  this.updatePercentage(acId, percent);
};

















/**
 * Récupérer TOUTES les données avec historique (EN MÉMOIRE)
 */
UserData.getAllWithHistory = function() {
  const allData = {};
  
  for (let acId in this.acs) {
    const ac = this.acs[acId];
    allData[acId] = {
      percent: ac.percent || 0,
      dateFormatted: ac.dateFormatted || '',
      timestamp: ac.timestamp || Date.now(),
      history: ac.history || []
    };
  }
  
  return allData;
};



















/**
 * Exporter les données en JSON
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














































UserData.importFromJSON = function(importedData) {
  if (!importedData || typeof importedData !== 'object') {
    console.error("Données importées invalides");
    return;
  }

  Object.keys(importedData).forEach(acId => {
    const data = importedData[acId];
    
    //  Initialiser l'AC s'il n'existe pas
    if (!this.acs[acId]) {
      this.acs[acId] = {
        percent: 0,
        dateFormatted: new Date().toLocaleString('fr-FR'),
        timestamp: Date.now(),
        history: []
      };
    }
    
    const ac = this.acs[acId];
    
    // Format 1 : Simple pourcentage (ancien format)
    if (typeof data === 'number') {
      ac.percent = parseInt(data);
      ac.dateFormatted = new Date().toLocaleString('fr-FR');
      ac.timestamp = Date.now();
      ac.history = [
        {
          percent: ac.percent,
          dateFormatted: ac.dateFormatted,
          timestamp: ac.timestamp
        }
      ];
      return;
    }
    
    // Format 2 : Objet avec percent, dateFormatted, history (format export standard)
    if (typeof data === 'object' && data.percent !== undefined) {
      ac.percent = parseInt(data.percent);
      ac.dateFormatted = data.dateFormatted || new Date().toLocaleString('fr-FR');
      ac.timestamp = data.timestamp || Date.now();
      ac.history = Array.isArray(data.history) ? data.history : [];
      return;
    }
  });
  this.saveToStorage();
};
























/**
 * Réinitialiser toutes les données
 */
UserData.clear = function() {
  this.acs = {};
  this.saveToStorage();
};
















export { UserData };