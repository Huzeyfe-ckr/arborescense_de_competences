import { htmlToDOM } from "@/lib/utils.js";
import { BarbaMeView } from "@/ui/BarbaMe";

import template from "./template.html?raw";

import { Animation } from "@/lib/animation.js";

let C = {};

C.init = function () {
  return V.init();
};

let V = {
  rootPage: null,
  barbapapa: null,
};

V.init = function () {
  V.rootPage = htmlToDOM(template);
  V.barbapapa = new BarbaMeView();
  V.rootPage.querySelector('slot[name="svg"]').replaceWith(V.barbapapa.dom());

  // Passer l'élément DOM directement au lieu d'un sélecteur CSS
  const bpapElement = V.barbapapa.dom().querySelector("#bpap");
  Animation.drawLine(V.barbapapa.getPaths(), V.barbapapa.getFills(), 2);

  return V.rootPage;
};

V.attachEvents = function () {
  // no events to attach
};

export function SvgDemo4Page() {
  return C.init();
}




// V.attachStorageButtons = function() {




//   const storageContainer = document.createElement("div");
//   storageContainer.id = "storage-buttons";
//   storageContainer.style.cssText = `
//     position: fixed;
//     bottom: 30px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 998;
//     display: flex;
//     gap: 10px;
//   `;

//   // Bouton Export
//   const exportBtn = document.createElement("button");
//   exportBtn.textContent = "📥 Exporter";
//   exportBtn.style.cssText = `
//     padding: 10px 15px;
//     background: #333;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     font-weight: bold;
//     transition: all 0.2s ease;
//   `;
//   exportBtn.addEventListener("click", () => {
//     Storage.exportData();
//   });
//   exportBtn.addEventListener("mouseenter", (e) => {
//     e.target.style.background = "#555";
//   });
//   exportBtn.addEventListener("mouseleave", (e) => {
//     e.target.style.background = "#333";
//   });

//   // Bouton Import
//   const importBtn = document.createElement("button");
//   importBtn.textContent = "📤 Importer";
//   importBtn.style.cssText = `
//     padding: 10px 15px;
//     background: #333;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     font-weight: bold;
//     transition: all 0.2s ease;
//  `;
//   importBtn.addEventListener("click", () => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = ".json";
//     fileInput.addEventListener("change", (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         Storage.importData(file).then(() => {
//           alert("Données importées avec succès !");
//           location.reload();
//         }).catch((error) => {
//           alert("Erreur : " + error.message);
//         });
//       }
//     });
//     fileInput.click();
//   });
//   importBtn.addEventListener("mouseenter", (e) => {
//     e.target.style.background = "#555";
//   });
//   importBtn.addEventListener("mouseleave", (e) => {
//     e.target.style.background = "#333";
//   });

//   // Bouton Réinitialiser
//   const resetBtn = document.createElement("button");
//   resetBtn.textContent = "🔄 Réinitialiser";
//   resetBtn.style.cssText = `
//     padding: 10px 15px;
//   background: #A30000;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     font-weight: bold;
//     transition: all 0.2s ease;
//   `;
//   resetBtn.addEventListener("click", () => {
//     if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
//       Storage.clearAllData();
//       location.reload();
//     }
//   });
//   resetBtn.addEventListener("mouseenter", (e) => {
//     e.target.style.background = "#C40000";
//   });
//   resetBtn.addEventListener("mouseleave", (e) => {
//     e.target.style.background = "#A30000";
//   });

//   storageContainer.appendChild(exportBtn);
//   storageContainer.appendChild(importBtn);
//   storageContainer.appendChild(resetBtn);
//   document.body.appendChild(storageContainer);
// };

 // Passer l'élément DOM directement au lieu d'un sélecteur CSS
  // Animer les éléments spécifiques
 
 
 
 
 
  /*
  const flowerElement1 = V.flowers.dom().querySelector("#Vector_competence_1");
  const flowerElement2 = V.flowers.dom().querySelector("#Vector_competence_2");
  const flowerElement3 = V.flowers.dom().querySelector("#Vector_competence_3");
  const flowerElement4 = V.flowers.dom().querySelector("#Vector_competence_4");
  const flowerElement5 = V.flowers.dom().querySelector("#Vector_competence_5");
  const flowerElementellipse = V.flowers.dom().querySelector("#ellipse_but_1");
  const flowerElementellipse2 = V.flowers.dom().querySelector("#ellipse_but_2");
  const flowerElementellipse3 = V.flowers.dom().querySelector("#ellipse_but_3");

  Animation.rotateElement(flowerElementellipse, 300);
  Animation.rotateElement(flowerElementellipse2, 200);
  Animation.rotateElement(flowerElementellipse3, 150);
  Animation.rotateElement(flowerElement1, 25);
  Animation.rotateElement(flowerElement2, 25);
  Animation.rotateElement(flowerElement3, 25);
  Animation.rotateElement(flowerElement5, 25);
  Animation.rotateElement(flowerElement4, 25);
*/