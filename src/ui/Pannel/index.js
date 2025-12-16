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
    
    let nodes = this.root.querySelectorAll("[data-id]");
    for (let node of nodes) {
      this.parts.push(node.getAttribute("data-id"));
    }

    if (svgid !== undefined) {
      this.svgid = svgid;
      this.root.setAttribute("data-svgid", svgid);
    }
    
    this.attachTrafficLightEvents();
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