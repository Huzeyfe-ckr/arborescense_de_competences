// import { htmlToDOM } from "../../lib/utils.js";
// import template from "./template.html?raw";
// import {Animation } from "@/lib/animation.js";


// class FlowerView {

//   constructor(svgid = undefined) {
//     this.svgid = undefined;
//     this.root = htmlToDOM(template);
//     this.parts = [];
//     this.initFillPolygons();
//     let nodes = this.root.querySelectorAll("[data-id]");
//     for (let node of nodes) {
//       this.parts.push(node.getAttribute("data-id"));
//     }

//     if (svgid !== undefined) {
//       this.svgid = svgid;
//       this.root.setAttribute("data-svgid", svgid);
//     }
//   }

//   html() {
//     return template;
//   }

//   dom() {
//     return this.root;
//   }
//   has(elt) {
//     return this.parts.includes(elt.getAttribute("data-id"));
//   }

//   getPaths() {
//     return this.root.querySelectorAll("path");
//   }

//   rotateElipses() {
//     const ellipse1 = this.dom().querySelector("#ellipse_but_1");
//     const ellipse2 = this.dom().querySelector("#ellipse_but_2");
//     const ellipse3 = this.dom().querySelector("#ellipse_but_3");

//     Animation.rotateElement(ellipse1, 300);
//     Animation.rotateElement(ellipse2, 200);
//     Animation.rotateElement(ellipse3, 150);

//   }

// initFillPolygons() {
//     const acGroups = this.root.querySelectorAll("g[id^='AC']");
    
//     acGroups.forEach(group => {
//       const originalPath = group.querySelector("path[opacity]");
      
//       if (!originalPath) return;
//       if (originalPath.classList.contains("ac-fill")) return;
      
//       // Vérifier que c'est bien un enfant du groupe
//       let foundInGroup = false;
//       for (let child of group.children) {
//         if (child === originalPath) {
//           foundInGroup = true;
//           break;
//         }
//       }
      
//       if (!foundInGroup) return; // Ignorer les paths qui ne sont pas enfants directs
      
//       const fillPath = originalPath.cloneNode(true);
//       fillPath.setAttribute("class", "ac-fill");
//       fillPath.setAttribute("data-ac-id", group.id);
//       fillPath.style.opacity = "1";
//       fillPath.style.pointerEvents = "none";
//       fillPath.style.clipPath = `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`;
      
//       originalPath.style.fill = "transparent";
//       originalPath.style.stroke = "transparent";
//       originalPath.style.opacity = "1";
      
//       // Insérer avant le path original
//       group.insertBefore(fillPath, originalPath);
//     });
//   }


//   rotateCompetences() {
//     for (let i = 1; i <= 5; i++) {
//       const competenceElement = this.dom().querySelector(`#Vector_competence_${i}`);
//       Animation.rotateElement(competenceElement, 25);
//     }
//   }

// }
// export { FlowerView };





import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import { Animation } from "@/lib/animation.js";

class FlowerView {
  constructor(svgid = undefined) {
    this.svgid = undefined;
    this.root = htmlToDOM(template);
    this.parts = [];
    
    let nodes = this.root.querySelectorAll("[data-id]");
    for (let node of nodes) {
      this.parts.push(node.getAttribute("data-id"));
    }

    if (svgid !== undefined) {
      this.svgid = svgid;
      this.root.setAttribute("data-svgid", svgid);
    }
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

  getPaths() {
    return this.root.querySelectorAll("path");
  }

  rotateElipses() {
    const ellipse1 = this.dom().querySelector("#ellipse_but_1");
    const ellipse2 = this.dom().querySelector("#ellipse_but_2");
    const ellipse3 = this.dom().querySelector("#ellipse_but_3");

    Animation.rotateElement(ellipse1, 300);
    Animation.rotateElement(ellipse2, 200);
    Animation.rotateElement(ellipse3, 150);
  }

  rotateCompetences() {
    for (let i = 1; i <= 5; i++) {
      const competenceElement = this.dom().querySelector(`#Vector_competence_${i}`);
      Animation.rotateElement(competenceElement, 25);
    }
  }
}

export { FlowerView };