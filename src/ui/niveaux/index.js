import { htmlToDOM } from "../../lib/utils.js";
import { niveauxAnimations } from "../../lib/animation.js";
import template from "./template.html?raw";
import "./style.css";

class NiveauxView {
  constructor() {
    this.root = htmlToDOM(template);
    this.isCollapsed = false;
    
    this.competenceMap = {
      "comprendre": { index: 0, color: "#A30000", class: "niveaux-competence-fill-1" },
      "concevoir": { index: 1, color: "#FF5500", class: "niveaux-competence-fill-2" },
      "exprimer": { index: 2, color: "#FFCC00", class: "niveaux-competence-fill-3" },
      "developper": { index: 3, color: "#2A5B1D", class: "niveaux-competence-fill-4" },
      "entreprendre": { index: 4, color: "#1A2D5C", class: "niveaux-competence-fill-5" }
    };
    
    this.competences = {
      comprendre: 0,
      concevoir: 0,
      exprimer: 0,
      developper: 0,
      entreprendre: 0
    };
    
    this.attachTrafficLightEvents();
  }

  dom() {
    return this.root;
  }

  /**
   * Attacher les événements aux feux de circulation
   * Rouge : fermer
   * Vert : ouvrir
   */
  attachTrafficLightEvents() {
    const redLight = this.root.querySelector(".niveaux-traffic-light-red");
    const greenLight = this.root.querySelector(".niveaux-traffic-light-green");

    if (redLight) {
      redLight.addEventListener("click", (e) => {
        e.stopPropagation();
        this.collapse();
      });
      redLight.style.cursor = "pointer";
    }

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
    const content = this.root.querySelector(".niveaux-content");
    
    if (content) {
      niveauxAnimations.collapsePanel(content, () => {
        this.root.classList.add("niveaux-collapsed");
      });
    }
  }

  /**
   * Ouvrir le panneau
   */
  expand() {
    if (!this.isCollapsed) return;
    
    this.isCollapsed = false;
    this.root.classList.remove("niveaux-collapsed");
    
    const content = this.root.querySelector(".niveaux-content");
    
    if (content) {
      niveauxAnimations.expandPanel(content);
    }
  }

  /**
   * Mettre à jour un pourcentage de compétence
   * @param {string} competence - Clé de la compétence (comprendre, concevoir, etc.)
   * @param {number} percentage - Pourcentage (0-100)
   */
  updateCompetence(competence, percentage) {
    const competenceData = this.competenceMap[competence];
    if (!competenceData) return;

    this.competences[competence] = percentage;

    // Récupérer l'élément du competence-item
    const items = this.root.querySelectorAll(".niveaux-competence-item");
    const item = items[competenceData.index];
    
    if (!item) return;

    const percentSpan = item.querySelector(".niveaux-competence-percent");
    const progressBar = item.querySelector(".niveaux-competence-fill");

    // Animer le pourcentage texte
    if (percentSpan) {
      niveauxAnimations.animatePercentage(percentSpan, percentage);
    }

    // Animer la barre de progression
    if (progressBar) {
      niveauxAnimations.animateProgressBar(progressBar, percentage, competenceData.color);
    }
  }

  /**
   * Mettre à jour tous les pourcentages de compétences
   * @param {object} competences - Objet avec les données des compétences
   */
  updateAll(competences) {
    Object.keys(competences).forEach(comp => {
      if (this.competenceMap[comp]) {
        this.updateCompetence(comp, competences[comp]);
      }
    });
  }

  /**
   * Masquer le panneau
   */
  hide() {
    niveauxAnimations.hidePanel(this.root);
  }

  /**
   * Afficher le panneau
   */
  show() {
    niveauxAnimations.showPanel(this.root);
  }
}

export { NiveauxView };