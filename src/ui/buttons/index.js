import { gsap } from "gsap";
import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { UserData } from "../../data/userdata.js";

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
        UserData.exportToJSON(); // ✅ Appel direct à UserData
      });
    }

    // Événement d'import
    const importBtn = this.root.querySelector("#import-btn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        this.promptImport(); // ✅ Nouvelle méthode simple
      });
    }

    // Événement de réinitialisation
    const resetBtn = this.root.querySelector("#reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.promptReset(); // ✅ Nouvelle méthode simple
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
   * Demander la confirmation et importer les données
   */
  promptImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target.result);
            UserData.importFromJSON(importedData); // ✅ Appel à UserData
            alert('Données importées avec succès !');
            location.reload();
          } catch (error) {
            alert('Erreur lors de l\'importation : ' + error.message);
            console.error('Erreur import JSON :', error);
          }
        };
        reader.readAsText(file);
      }
    });
    input.click();
  }

  /**
   * Demander la confirmation et réinitialiser les données
   */
  promptReset() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
      UserData.clear(); // ✅ Appel à UserData
      alert('Toutes les données ont été réinitialisées.');
      location.reload();
    }
  }
}

export { ButtonsView };