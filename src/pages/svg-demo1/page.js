import { gsap } from "gsap";
import { FlowerView } from "@/ui/flower";
import { NiveauxView } from "@/ui/niveaux";
import { ButtonsView } from "@/ui/buttons";
import { htmlToDOM } from "@/lib/utils.js";
import template from "./template.html?raw";
import { Animation } from "@/lib/animation.js";
import { HistoriqueView } from "@/ui/historique";
import { PannelView } from "@/ui/Pannel";
import { Storage } from "@/lib/storage.js";







let M = {};

let response = await fetch('/src/data/competence.json');
M.CompetencesData = await response.json();

















let C = {};


C.init = function() {
  return V.init();
}

























let V = {
  rootPage: null,
  flowers: null,
  selectedAC: null,
  pannelView: null,
  niveauxView: null,
  buttonsView: null,
  historiqueView: null,
};

















V.init = function() {
  V.rootPage = htmlToDOM(template);
  V.flowers = new FlowerView();
  V.rootPage.querySelector('slot[name="svg"]').replaceWith( V.flowers.dom() );


  V.niveauxView = new NiveauxView();
  V.rootPage.querySelector('slot[name="niveaux"]').replaceWith(V.niveauxView.dom());

  V.pannelView = new PannelView();
  V.rootPage.querySelector('slot[name="pannel"]').replaceWith(V.pannelView.dom());

  V.buttonsView = new ButtonsView();
  V.rootPage.querySelector('slot[name="buttons"]').replaceWith(V.buttonsView.dom());

  V.historiqueView = new HistoriqueView();
  V.rootPage.querySelector('slot[name="historique"]').replaceWith(V.historiqueView.dom());
  V.pannelView.historiqueView = V.historiqueView;
  

   // Charger les données sauvegardées
  V.loadSavedData();
 


  const mmiCenter = V.flowers.dom().querySelector("#Hexagon path");
  if (mmiCenter) {
    mmiCenter.addEventListener("click", () => {
      V.triggerACRippleEffect();
    });
  }

 
  V.flowers.rotateElipses();
  V.flowers.rotateCompetences();

  
  const groups = V.flowers.dom().querySelectorAll("g[id^='AC']");
  const colorMap = {
    "competence-1": "#A30000",
    "competence-2": "#FF5500",
    "competence-3": "#FFCC00",
    "competence-4": "#2A5B1D",
    "competence-5": "#1A2D5C"
  };
  
  groups.forEach((g) => {
    const compClass = Array.from(g.classList).find(c => c.startsWith("competence-"));
    const color = colorMap[compClass];
    const paths = g.querySelectorAll("path[opacity]");
    
    paths.forEach(path => {
      Animation.hoverElement(path, "#B5B5B5", color, 0.2);

      path.addEventListener("click", (e) => {
        e.stopPropagation();
        V.selectedAC = g;
        // ✅ Passer les données de l'AC depuis acDescriptions
        const acData = M.CompetencesData[g.id] || {};
        V.pannelView.show(g.id, compClass, acData);
      });
    });
  });
  
  V.attachEvents();
  return V.rootPage;
};












// Charger les données au démarrage
V.loadSavedData = function() {
  const allData = Storage.getAll();
  const colorMap = {
    "competence-1": "#A30000",
    "competence-2": "#FF5500",
    "competence-3": "#FFCC00",
    "competence-4": "#2A5B1D",
    "competence-5": "#1A2D5C"
  };
  
  Object.keys(allData).forEach(acId => {
    const acElement = V.flowers.dom().querySelector(`g[id='${acId}']`);
    if (acElement) {
      const percent = allData[acId];
      acElement.setAttribute("data-percentage", percent);
      
      const path = acElement.querySelector("path[opacity]");
      if (path) {
        path.style.opacity = percent / 100;
        const compClass = Array.from(acElement.classList).find(c => c.startsWith("competence-"));
        const color = colorMap[compClass];
        path.style.fill = color;
        path.style.stroke = color + "CC";
      }
    }
  });
  
  V.updateNiveauxPanel();
};








// Mise à jour des sélecteurs dans V.attachEvents()
V.attachEvents = function() {
  const percentBtns = V.pannelView.dom().querySelectorAll(".panel-percent-btn");
  percentBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const percent = e.target.getAttribute("data-percent");
      V.setPercentageFill(V.selectedAC, percent);
      V.pannelView.hide();
    });
  });

  const closeBtn = V.pannelView.dom().querySelector("#toggle-pannel");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      V.pannelView.hide();
    });
  }

  document.addEventListener("click", (e) => {
    if (!V.pannelView.dom().contains(e.target) && !e.target.closest("[id^='AC']")) {
      V.pannelView.hide();
    }
  });
};











// Mettre à jour le remplissage d'un AC et sauvegarder
V.setPercentageFill = function(acElement, percent) {
  const acId = acElement.id;
  
  // Sauvegarder dans le localStorage
  Storage.saveAC(acId, percent);
  
  // Mettre à jour l'affichage SVG
  const opacity = percent / 100;
  const path = acElement.querySelector("path[opacity]");
  if (path) {
    path.style.opacity = opacity;
    
    const colorMap = {
      "competence-1": "#A30000",
      "competence-2": "#FF5500",
      "competence-3": "#FFCC00",
      "competence-4": "#2A5B1D",
      "competence-5": "#1A2D5C"
    };
    
    const compClass = Array.from(acElement.classList).find(c => c.startsWith("competence-"));
    const color = colorMap[compClass];
    
    path.style.fill = color;
    path.style.stroke = color + "CC";
  }
  
  // Mettre à jour le panneau des niveaux
  V.updateNiveauxPanel();
  
  // Mettre à jour l'historique si le panneau est actif
  if (V.pannelView.historiqueView && V.pannelView.currentAcId === acId) {
    V.pannelView.historiqueView.display(acId, V.pannelView.currentCompetence);
  }
};










// Mettre à jour le panneau des niveaux de compétence
V.updateNiveauxPanel = function() {
  const groups = V.flowers.dom().querySelectorAll("g[id^='AC']");
  const competences = {
    comprendre: [],
    concevoir: [],
    exprimer: [],
    developper: [],
    entreprendre: [],
  };
  
  groups.forEach(g => {
    const acId = g.id;
    // Récupérer le pourcentage depuis Storage (localStorage) au lieu du SVG
    const percentage = parseInt(Storage.get(acId)) || 0;
    const compClass = Array.from(g.classList).find(c => c.startsWith("competence-"));
    
    const competenceMap = {
      "competence-1": "comprendre",
      "competence-2": "concevoir",
      "competence-3": "exprimer",
      "competence-4": "developper",
      "competence-5": "entreprendre"
    };
    

    // Ajouter le pourcentage à la compétence correspondante
    const competenceKey = competenceMap[compClass];
    if (competenceKey) {
      competences[competenceKey].push(percentage);
    }
  });




  Object.keys(competences).forEach(key => {
    const arr = competences[key];
    const avg = arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b) / arr.length) : 0;
    V.niveauxView.updateCompetence(key, avg);
  });
};





































































// Effet vague sur les AC lorsque je clique sur le bouton du milieu MMI
V.triggerACRippleEffect = function() {
  const acGroups = V.flowers.dom().querySelectorAll("g[id^='AC']");
  Animation.rippleWaveEffect(acGroups, 2, 0.05);
};


export function SvgDemo1Page() {
  return C.init();
}