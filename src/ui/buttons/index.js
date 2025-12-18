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

  dom() {
    return this.root;
  }

  has(elt) {
    return this.parts.includes(elt.getAttribute("data-id"));
  }

  attachEvents() {
    this.attachTrafficLightEvents();

    // ✅ Export
    const exportBtn = this.root.querySelector("#export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        UserData.exportToJSON();
      });
    }

    // ✅ Import
    const importBtn = this.root.querySelector("#import-btn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        this.promptImport();
      });
    }

    // ✅ Reset
    const resetBtn = this.root.querySelector("#reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.promptReset();
      });
    }
  }

  attachTrafficLightEvents() {
    const redLight = this.root.querySelector(".buttons-traffic-light-red");
    const greenLight = this.root.querySelector(".buttons-traffic-light-green");

    if (redLight) {
      redLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.collapse();
      });
    }

    if (greenLight) {
      greenLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.expand();
      });
    }
  }

  collapse() {
    if (this.isCollapsed) return;
    this.isCollapsed = true;
    this.root.classList.add("buttons-collapsed");
  }

  expand() {
    if (!this.isCollapsed) return;
    this.isCollapsed = false;
    this.root.classList.remove("buttons-collapsed");
  }


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
            UserData.importFromJSON(importedData); // 
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
   * Réinitialiser les données
   */
  promptReset() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
      UserData.clear();
      alert('Toutes les données ont été réinitialisées.');
      location.reload();
    }
  }
}

export { ButtonsView };