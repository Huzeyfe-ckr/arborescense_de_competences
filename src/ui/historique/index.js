import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { gsap } from "gsap";
import { Storage } from "../../lib/storage.js";

class HistoriqueView {
  constructor() {
    this.root = htmlToDOM(template);
    this.currentAcId = null;
    this.competenceClass = null;
  }

  dom() {
    return this.root;
  }

  /**
   * Afficher l'historique d'un AC spécifique
   * @param {string} acId - ID de l'AC
   * @param {string} competenceClass - Classe de la compétence
   */
  display(acId, competenceClass) {
    this.currentAcId = acId;
    this.competenceClass = competenceClass;

    const colorMap = {
      "competence-1": "#A30000",
      "competence-2": "#FF5500",
      "competence-3": "#FFCC00",
      "competence-4": "#2A5B1D",
      "competence-5": "#1A2D5C"
    };

    const color = colorMap[competenceClass] || "#007aff";
    const history = Storage.getHistoryByAC(acId);
    const historyContainer = this.root.querySelector(".historique-ac-history");

    // Vider le conteneur
    historyContainer.innerHTML = "";

    if (!history || history.length === 0) {
      const noHistory = document.createElement("p");
      noHistory.className = "historique-no-history";
      noHistory.textContent = "Aucun historique";
      historyContainer.appendChild(noHistory);
      return;
    }

    // Afficher l'historique
    history.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "historique-entry";

      const headerDiv = document.createElement("div");
      headerDiv.className = "historique-entry-header";

      const dateSpan = document.createElement("span");
      dateSpan.className = "historique-entry-date";
      dateSpan.textContent = entry.dateFormatted || new Date(entry.timestamp).toLocaleString('fr-FR');

      const percentSpan = document.createElement("span");
      percentSpan.className = "historique-entry-percent";
      percentSpan.textContent = `${entry.percent}%`;

      headerDiv.appendChild(dateSpan);
      headerDiv.appendChild(percentSpan);

      const barContainer = document.createElement("div");
      barContainer.className = "historique-bar-container";

      const barFill = document.createElement("div");
      barFill.className = "historique-bar-fill";
      barFill.style.backgroundColor = color;
      barFill.style.width = "0%";

      barContainer.appendChild(barFill);

      entryDiv.appendChild(headerDiv);
      entryDiv.appendChild(barContainer);

      historyContainer.appendChild(entryDiv);

      // Animation de la barre
      gsap.to(barFill, {
        width: `${entry.percent}%`,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1
      });
    });

    // Scroll vers le bas
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  clear() {
    const historyContainer = this.root.querySelector(".historique-ac-history");
    historyContainer.innerHTML = "";
    const noHistory = document.createElement("p");
    noHistory.className = "historique-no-history";
    noHistory.textContent = "Aucun historique";
    historyContainer.appendChild(noHistory);
  }
}

export { HistoriqueView };