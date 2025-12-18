import { htmlToDOM } from "../../lib/utils.js";
import { radarAnimations } from "../../lib/animation.js";
import template from "./template.html?raw";
import "./style.css";

class RadarView {
  constructor() {
    this.root = htmlToDOM(template);
    this.svg = this.root.querySelector(".radar-3d");
    this.fillPolygon = this.root.querySelector(".radar-fill");
    this.isCollapsed = false;
    
    this.competenceMap = {
      "comprendre": "#A30000",
      "concevoir": "#FF5500",
      "exprimer": "#FFCC00",
      "developper": "#2A5B1D",
      "entreprendre": "#1A2D5C"
    };
    
    this.percentages = {
      comprendre: 0,
      concevoir: 0,
      exprimer: 0,
      developper: 0,
      entreprendre: 0
    };
    
    this.attachPointEvents();
    this.attachTrafficLightEvents();
  }

  dom() {
    return this.root;
  }



























  /**
   * Attacher les événements aux points du radar
   */
  attachPointEvents() {
    const points = this.root.querySelectorAll(".radar-point");
    points.forEach(point => {
      point.addEventListener("mouseenter", (e) => {
        const competence = point.getAttribute("data-competence");
        this.highlightPoint(competence);
      });
      point.addEventListener("mouseleave", () => {
        this.resetHighlight();
      });
    });
  }



























  /**
   * Attacher les événements aux feux de circulation
   * Rouge : fermer
   * Vert : ouvrir
   */
  attachTrafficLightEvents() {
    const redLight = this.root.querySelector(".radar-traffic-light-red");
    const greenLight = this.root.querySelector(".radar-traffic-light-green");

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
    const content = this.root.querySelector(".radar-content");
    
    if (content) {
      radarAnimations.collapsePanel(content, () => {
        this.root.classList.add("radar-collapsed");
      });
    }
  }








































  /**
   * Ouvrir le panneau
   */
  expand() {
    if (!this.isCollapsed) return;
    
    this.isCollapsed = false;
    this.root.classList.remove("radar-collapsed");
    
    const content = this.root.querySelector(".radar-content");
    
    if (content) {
      radarAnimations.expandPanel(content);
    }
  }








































  /**
   * Mettre en avant un point
   */
  highlightPoint(competence) {
    const point = this.root.querySelector(`[data-competence="${competence}"]`);
    if (point) {
      const pointBg = point.querySelector(".radar-point-bg");
      if (pointBg) {
        radarAnimations.highlightPoint(pointBg);
      }
    }
  }








































  /**
   * Réinitialiser la mise en avant
   */
  resetHighlight() {
    const pointBgs = this.root.querySelectorAll(".radar-point-bg");
    if (pointBgs.length > 0) {
      radarAnimations.resetHighlight(pointBgs);
    }
  }








































  /**
   * Calculer les points du pentagone régulier en fonction des pourcentages
   */
  calculatePentagonPoints(percentages) {
    const center = { x: 200, y: 200 };
    const maxRadius = 120;

    const angles = [
      -Math.PI / 2,
      -Math.PI / 2 + 2 * Math.PI / 5,
      -Math.PI / 2 + 4 * Math.PI / 5,
      -Math.PI / 2 + 6 * Math.PI / 5,
      -Math.PI / 2 + 8 * Math.PI / 5
    ];

    const competences = ["comprendre", "concevoir", "exprimer", "developper", "entreprendre"];
    const points = [];

    competences.forEach((comp, index) => {
      const percent = Math.max(percentages[comp] || 0, 5);
      const radius = (percent / 100) * maxRadius;
      const angle = angles[index];

      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);

      points.push(`${x},${y}`);
    });

    return points.join(" ");
  }



























  /**
   * Mettre à jour un pourcentage de compétence
   */
  updateCompetence(competence, percentage) {
    this.percentages[competence] = percentage;

    // Mettre à jour le pourcentage affiché
    const point = this.root.querySelector(`[data-competence="${competence}"]`);
    if (point) {
      const percentSpan = point.querySelector(".radar-percent");
      if (percentSpan) {
        radarAnimations.animatePercentage(percentSpan, percentage);
      }
    }

    // Animer le pentagone
    const newPoints = this.calculatePentagonPoints(this.percentages);
    radarAnimations.animatePentagon(this.fillPolygon, newPoints);

    // Animer la couleur dominante
    this.updateFillColor();
  }





























  /**
   * Mettre à jour la couleur dominante du polygone
   */
  updateFillColor() {
    const maxComp = Object.keys(this.percentages).reduce((a, b) =>
      this.percentages[a] > this.percentages[b] ? a : b
    );
    const color = this.competenceMap[maxComp];
    
    radarAnimations.animatePentagonColor(this.fillPolygon, color);
  }






















  /**
   * Mettre à jour tous les pourcentages
   */
  updateAll(competences) {
    Object.keys(competences).forEach(comp => {
      if (this.competenceMap[comp]) {
        this.updateCompetence(comp, competences[comp]);
      }
    });
  }
}
















export { RadarView };