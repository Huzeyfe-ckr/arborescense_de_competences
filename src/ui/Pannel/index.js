import { gsap } from "gsap";
import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { Animation } from "../../lib/animation.js";

class PannelView {
  constructor(svgid = undefined) {
    this.svgid = undefined;
    this.root = htmlToDOM(template);
    this.isCollapsed = false;
    this.currentAcId = null;
    this.currentCompetence = null;
    this.historiqueView = null;
    this.parts = [];
    this.justifications = {};
    
    let nodes = this.root.querySelectorAll("[data-id]");
    for (let node of nodes) {
      this.parts.push(node.getAttribute("data-id"));
    }

    if (svgid !== undefined) {
      this.svgid = svgid;
      this.root.setAttribute("data-svgid", svgid);
    }
    
    this.attachTrafficLightEvents();
    this.attachJustificationEvents();
  }

  html() {
    return template;
  }

  dom() {
    return this.root;
  }

  setHistoriqueView(historiqueView) {
    this.historiqueView = historiqueView;
    this.root.querySelector('slot[name="historique"]').replaceWith(historiqueView.dom());
  }

  has(elt) {
    return this.parts.includes(elt.getAttribute("data-id"));
  }

  getPaths() {
    return this.root.querySelectorAll("path");
  }

  /**
   * Attacher les événements aux feux de circulation
   * Rouge : fermer
   * Vert : ouvrir
   */
  attachTrafficLightEvents() {
    const redLight = this.root.querySelector(".panel-traffic-light-red");
    const greenLight = this.root.querySelector(".panel-traffic-light-green");

    // Rouge = Fermer
    if (redLight) {
      redLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.collapse();
      });
      redLight.style.cursor = "pointer";
    }

    // Vert = Ouvrir
    if (greenLight) {
      greenLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.expand();
      });
      greenLight.style.cursor = "pointer";
    }
  }

  /**
   * Fermer le panneau
   */
  collapse() {
    if (this.isCollapsed) return;
    
    this.isCollapsed = true;
    this.root.classList.add("panel-collapsed");
  }

  /**
   * Ouvrir le panneau
   */
  expand() {
    if (!this.isCollapsed) return;
    
    this.isCollapsed = false;
    this.root.classList.remove("panel-collapsed");
  }




























    /**
   * Attacher les événements pour la gestion des justificatifs
   */
  attachJustificationEvents() {
    const importBtn = this.root.querySelector("#import-justification-btn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        this.importJustification();
      });
    }
  }



























  /**
   * Importer un justificatif (fichier) pour l'AC actuel
   */
  importJustification() {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*"; // Accepte tous les types de fichiers
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.addJustification(this.currentAcId, file);
      }
    });
    input.click();
  }



























  /**
   * Ajouter un justificatif à un AC
   * @param {string} acId - ID de l'AC
   * @param {File} file - Fichier à ajouter
   */
  addJustification(acId, file) {
    // Initialiser le tableau des justificatifs pour cet AC s'il n'existe pas
    if (!this.justifications[acId]) {
      this.justifications[acId] = [];
    }



























    // Créer un objet avec les infos du fichier
    const justification = {
      id: Date.now(), // ID unique basé sur timestamp
      name: file.name,
      size: (file.size / 1024).toFixed(2), // Taille en KB
      type: file.type,
      date: new Date().toLocaleString("fr-FR"),
      file: file // Stocker le fichier pour téléchargement futur
    };

    this.justifications[acId].push(justification);
    this.displayJustifications(acId);
  }








































  /**
   * Afficher les justificatifs pour un AC
   * @param {string} acId - ID de l'AC
   */
  displayJustifications(acId) {
    const listContainer = this.root.querySelector("#justification-list");
    listContainer.innerHTML = "";

    const justificationsList = this.justifications[acId] || [];

    if (justificationsList.length === 0) {
      listContainer.innerHTML = '<p style="color: #666; font-size: 12px; margin: 0;">Aucun justificatif pour le moment</p>';
      return;
    }

    justificationsList.forEach((justif) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "panel-justification-item";

      const nameSpan = document.createElement("span");
      nameSpan.className = "panel-justification-item-name";
      nameSpan.title = `${justif.name} (${justif.size} KB)`;
      nameSpan.textContent = `📄 ${justif.name}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "panel-justification-item-delete";
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => {
        this.removeJustification(acId, justif.id);
      });

      itemDiv.appendChild(nameSpan);
      itemDiv.appendChild(deleteBtn);
      listContainer.appendChild(itemDiv);
    });
  }




























  /**
   * Supprimer un justificatif
   * @param {string} acId - ID de l'AC
   * @param {number} justifId - ID du justificatif
   */
  removeJustification(acId, justifId) {
    if (this.justifications[acId]) {
      this.justifications[acId] = this.justifications[acId].filter(j => j.id !== justifId);
      this.displayJustifications(acId);
    }
  }

















































  /**
   * Afficher les infos d'un AC dans le panneau
   * @param {string} acId - ID de l'AC
   * @param {string} competenceClass - Classe de la compétence (competence-1, etc.)
   * @param {object} acData - Données de l'AC (titre, description)
   */
  show(acId, competenceClass = null, acData = {}) {
    this.currentAcId = acId;
    this.currentCompetence = competenceClass;
    
    const title = this.root.querySelector("#ac-title");
    const description = this.root.querySelector("#ac-description");
    const titre = this.root.querySelector("#ac-titre");

    // Afficher l'ID de l'AC
    if (title) {
      title.textContent = acId;
    }

    // Afficher la description
    if (description && acData.description) {
      description.textContent = acData.description;
    } else if (description) {
      description.textContent = "";
    }
    
    // Afficher le titre
    if (titre && acData.titre) {
      titre.textContent = acData.titre;
    } else if (titre) {
      titre.textContent = "";
    }


        //Afficher les justificatifs pour cet AC
    this.displayJustifications(acId);
    
    // Afficher l'historique avec la couleur de la compétence
    if (this.historiqueView) {
      this.historiqueView.display(acId, competenceClass);
    }
    
    // Afficher le panneau - TOUJOURS EXPAND quand on clique sur un AC
    this.root.classList.remove("panel-hidden");
    this.isCollapsed = false;
    this.root.classList.remove("panel-collapsed");
  }

  hide() {
    this.root.classList.add("panel-hidden");
  }
















}

export { PannelView };