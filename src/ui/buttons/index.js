import { gsap } from "gsap";
import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { Storage } from "../../lib/storage.js";

class ButtonsView {
  constructor(svgid = undefined) {
    this.svgid = undefined;
    this.root = htmlToDOM(template);
    this.isCollapsed = false;
    this.parts = [];
    
    let nodes = this.root.querySelectorAll("[data-id]");
    for (let node of nodes) {
      this.parts.push(node.getAttribute("data-id"));
    }

    if (svgid !== undefined) {
      this.svgid = svgid;
      this.root.setAttribute("data-svgid", svgid);
    }
    
    this.attachEvents();
  }

  html() {
    return template;
  }

  dom() {
    return this.root;
  }

  has(elt) {
    return this.parts.includes(elt.getAttribute("data-id"));
  }

  attachEvents() {
    // Événement de toggle

    // Événements des feux de circulation
    this.attachTrafficLightEvents();

    // Événement d'export
    const exportBtn = this.root.querySelector("#export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportData();
      });
    }

    // Événement d'import
    const importBtn = this.root.querySelector("#import-btn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        this.importData();
      });
    }

    // Événement de réinitialisation
    const resetBtn = this.root.querySelector("#reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
          this.resetData();
        }
      });
    }
  }

  /**
   * Attacher les événements aux feux de circulation
   * Rouge : fermer
   * Vert : ouvrir
   */
  attachTrafficLightEvents() {
    const redLight = this.root.querySelector(".buttons-traffic-light-red");
    const greenLight = this.root.querySelector(".buttons-traffic-light-green");

    // Rouge = Fermer
    if (redLight) {
      redLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.collapse();
      });
    }

    // Vert = Ouvrir
    if (greenLight) {
      greenLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.expand();
      });
    }
  }


  /**
   * Fermer le panneau
   */
  collapse() {
    if (this.isCollapsed) return;
    
    this.isCollapsed = true;
    this.root.classList.add("buttons-collapsed");
  }

  /**
   * Ouvrir le panneau
   */
  expand() {
    if (!this.isCollapsed) return;
    
    this.isCollapsed = false;
    this.root.classList.remove("buttons-collapsed");
  }

    /**
   * Exporter les données en JSON (avec historique)
   */
  exportData() {
    const allData = Storage.getAllWithHistory();
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `competences-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importer les données depuis un fichier JSON
   */
importData() {
    // Crée un élément <input> invisible pour sélectionner un fichier
    const input = document.createElement('input');
    
    // Configure l'input pour accepter uniquement les fichiers JSON
    input.type = 'file';
    input.accept = 'application/json';
    
    // Ajoute un écouteur d'événement qui se déclenche quand un fichier est sélectionné
    input.addEventListener('change', (e) => {
        // Récupère le premier fichier sélectionné par l'utilisateur
        const file = e.target.files[0];
        
        // Vérifie qu'un fichier a bien été sélectionné
        if (file) {
            // Crée un objet FileReader pour lire le contenu du fichier
            const reader = new FileReader();
            
            // Se déclenche quand la lecture du fichier est terminée
            reader.onload = (event) => {
                // Parse le contenu du fichier JSON en objet JavaScript
                const importedData = JSON.parse(event.target.result);
                
                // Boucle sur chaque clé (ID d'AC) présente dans le JSON importé
                Object.keys(importedData).forEach(acId => {
                    // Récupère les données associées à cet AC
                    const data = importedData[acId];
                    
                    // === CAS 1 : Format ancien (juste un nombre/pourcentage) ===
                    if (typeof data === 'number') {
                        // Sauvegarde directement le pourcentage via la méthode Storage.saveAC()
                        Storage.saveAC(acId, data);
                    } 
                    // === CAS 2 : Format nouveau (objet avec current et history) ===
                    else if (data.current && data.history) {
                        // Génère un timestamp formaté en français pour la date d'import
                        const timestamp = new Date().toLocaleString('fr-FR');
                        
                        // Crée un objet avec les données actuelles à sauvegarder
                        const currentData = {
                            percent: data.current.percent,           // Le pourcentage actuel
                            dateFormatted: timestamp,                // Date formatée lisible
                            timestamp: Date.now()                    // Timestamp Unix pour comparaisons
                        };
                        
                        // Sauvegarde les données actuelles dans le localStorage
                        localStorage.setItem(`ac-${acId}`, JSON.stringify(currentData));
                        
                        // Sauvegarde l'historique complet dans le localStorage
                        localStorage.setItem(`history-${acId}`, JSON.stringify(data.history));
                    }
                });
                
                // Affiche un message de succès à l'utilisateur
                alert('Données importées avec succès !');
                
                // Recharge la page pour appliquer les changements (actualise l'interface)
                location.reload();
            };
            
            // Lance la lecture du fichier en tant que texte
            reader.readAsText(file);
        }
    });
    
    // Déclenche le clic programmatique pour ouvrir le sélecteur de fichier
    input.click();
}

  /**
   * Réinitialiser toutes les données
   */
  resetData() {
    Storage.clear();
    alert('Toutes les données ont été réinitialisées.');
    location.reload();
  }
}

export { ButtonsView };