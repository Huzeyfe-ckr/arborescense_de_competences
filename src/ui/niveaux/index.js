import { gsap } from "gsap";
import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { Animation } from "../../lib/animation.js";

class NiveauxView {
  constructor() {
    this.root = htmlToDOM(template);
    this.isCollapsed = false;
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
    
    const arrow = this.root.querySelector(".niveaux-toggle-btn .niveaux-arrow");
    
    if (arrow) {
      gsap.to(arrow, {
        rotation: -180,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
    
    this.root.classList.add("niveaux-collapsed");
  }

  /**
   * Ouvrir le panneau
   */
  expand() {
    if (!this.isCollapsed) return;
    
    this.isCollapsed = false;
    
    const arrow = this.root.querySelector(".niveaux-toggle-btn .niveaux-arrow");
    
    if (arrow) {
      gsap.to(arrow, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
    
    this.root.classList.remove("niveaux-collapsed");
  }


  /**
   * Mettre à jour la barre de progression d'une compétence
   * @param {string} competence - Nom de la compétence (comprendre, concevoir, etc.)
   * @param {number} percent - Pourcentage de progression (0-100)
   */
  updateCompetence(competence, percent) {
    this.competences[competence] = percent;
    
    const competenceMap = {
      comprendre: 0,
      concevoir: 1,
      exprimer: 2,
      developper: 3,
      entreprendre: 4
    };
    
    const index = competenceMap[competence];
    if (index !== undefined) {
      const items = this.root.querySelectorAll(".niveaux-competence-item");
      const item = items[index];
      
      if (item) {
        const fill = item.querySelector(".niveaux-competence-fill");
        const percentText = item.querySelector(".niveaux-competence-percent");
        
        if (fill) {
          gsap.to(fill, {
            width: `${percent}%`,
            duration: 0.5,
            ease: "power2.out"
          });
        }
        
        if (percentText) {
          percentText.textContent = `${percent}%`;
        }
      }
    }
  }

  hide() {
    this.root.classList.add("niveaux-hidden");
  }

  show() {
    this.root.classList.remove("niveaux-hidden");
  }
}

export { NiveauxView };