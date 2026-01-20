import { gsap } from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(DrawSVGPlugin, ScrollToPlugin);

let Animation = {};

Animation.rotateElement = function (element, duration = 1) {
  gsap.to(element, {
    rotation: "+=360",
    transformOrigin: "50% 50%",
    repeat: -1,
    ease: "linear",
    duration: duration,
  });
};

Animation.colorTransition = function (
  element,
  fromColor,
  toColor,
  duration = 1,
) {
  gsap.fromTo(
    element,
    { fill: fromColor },
    {
      fill: toColor,
      cursor: "pointer",
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    },
  );
};

Animation.stretchElement = function (
  element,
  direction = "x",
  scale = 2,
  duration = 1,
) {
  const props = direction === "x" ? { scaleX: scale } : { scaleY: scale };
  gsap.to(element, {
    ...props,
    duration: duration,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut",
    transformOrigin: "50% 50%",
  });
};

Animation.drawLine = function (paths, fills, duration = 1) {
  gsap
    .timeline()
    .from(paths, {
      drawSVG: 0,
      duration: duration,
      ease: "power1.inOut",
      stagger: 0.1,
    })
    .from(
      fills,
      {
        opacity: 0,
        scale: 1.5,
        transformOrigin: "center center",
        duration: 0.8,
        ease: "elastic.out(2, 0.3)",
      },
      "-=1",
    );
};

Animation.bounce = function (element, duration = 1, height = 100) {
  gsap.to(element, {
    y: -height,
    duration: duration / 2,
    // ease: "power1.out",
    ease: "elastic.inOut(1,0.8)",
    yoyo: true,
    repeat: 1,
    transformOrigin: "50% 100%",
  });
};












/**
 * Hover intelligent pour les AC
 * Préserve la couleur des AC coloriés (opacité > 0)
 */
Animation.hoverElement = function (
  element,
  fromColor,
  toColor,
  duration = 0.3,
) {
  element.addEventListener("mouseenter", () => {
    const opacity = parseFloat(element.style.opacity) || 0;
    
    // Hover SEULEMENT si AC n'est pas colorié (opacity = 0)
    if (opacity === 0) {
      element.style.fill = toColor;
      element.style.stroke = toColor + "CC";
    }
  });

  element.addEventListener("mouseleave", () => {
    const opacity = parseFloat(element.style.opacity) || 0;
    
    // Restaurer SEULEMENT si AC n'est pas colorié
    if (opacity === 0) {
      element.style.fill = fromColor;
      element.style.stroke = fromColor;
    }
  });
};


























Animation.selectElement = function (
  element,
  fromColor,
  toColor,
  duration = 0.3,
) {
  element.addEventListener("click", (e) => {
    e.stopPropagation();

    // Basculer l'état de sélection de cet élément uniquement
    if (element.dataset.isSelected === "true") {
      element.dataset.isSelected = "false";
      gsap.to(element, {
        fill: fromColor,
        stroke: fromColor,
        duration: duration,
        ease: "linear",
      });
    } else {
      // Sélectionner l'élément actuel (sans déselectionner les autres)
      element.dataset.isSelected = "true";
      element.dataset.originalColor = fromColor;
      gsap.to(element, {
        fill: toColor,
        stroke: toColor + "CC",
        duration: duration,
        ease: "linear",
      });
    }
  });
};

Animation.togglePanel = function (root, duration = 0.3) {
  const toggleBtn = root.querySelector("#toggle-niveaux");
  const panelContent = root.querySelector(".panel-content");

  if (root.classList.contains("collapsed")) {
    // Ouvrir le panneau
    gsap.to(panelContent, {
      opacity: 1,
      height: "auto",
      duration: duration,
      ease: "power2.inOut",
    });

    gsap.to(toggleBtn, {
      rotation: 0,
      duration: duration,
      ease: "power2.inOut",
    });
  } else {
    // Fermer le panneau
    gsap.to(panelContent, {
      opacity: 0,
      height: 0,
      duration: duration,
      ease: "power2.inOut",
    });

    gsap.to(toggleBtn, {
      rotation: 180,
      duration: duration,
      ease: "power2.inOut",
    });
  }
};





Animation.toggleButtonsPanel = function (arrow, toggleBtn, isCollapsed, duration = 0.3) {
  const panelContent = toggleBtn.parentElement.querySelector(".buttons-content");
  


  if (isCollapsed) {
    // Ouvrir le panneau
    gsap.to(panelContent, {
      opacity: 1,
      height: "auto",
      duration: duration,
      ease: "power2.inOut",
    });

    gsap.to(toggleBtn, {
      rotation: 0,
      duration: duration,
      ease: "power2.inOut",
    });
  } else {
    // Fermer le panneau
    gsap.to(panelContent, {
      opacity: 0,
      height: 0,
      duration: duration,
      ease: "power2.inOut",
    });

    gsap.to(toggleBtn, {
      rotation: 180,
      duration: duration,
      ease: "power2.inOut",
    });
  }
};

Animation.fillBar = function (fillElement, percent, duration = 0.5) {
  gsap.to(fillElement, {
    width: percent + "%",
    duration: duration,
    ease: "power2.out",
  });
};

Animation.updatePercent = function (percentElement, percent, duration = 0.5) {
  gsap.to(
    { value: parseInt(percentElement.textContent) || 0 },
    {
      value: percent,
      duration: duration,
      ease: "power2.out",
      onUpdate: function () {
        percentElement.textContent = Math.round(this.targets()[0].value) + "%";
      },
    },
  );
};


Animation.rippleEffect = function (elements, duration = 0.6, stagger = 0.05) {
  gsap.set(elements, {
    opacity: 0,
    scale: 0,
  });

  gsap.to(elements, {
    opacity: 1,
    scale: 1,
    duration: duration,
    stagger: stagger,
    ease: "back.out(1.7)",
    onStart: function () {
      gsap.to(elements, {
        y: -15,
        duration: duration * 0.6,
        stagger: stagger,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 0,
      });
    },
  });
};

Animation.rippleWaveEffect = function (
  elements,
  duration = 0.8,
  stagger = 0.08,
) {
  gsap.set(elements, {
    opacity: 0,
    scale: 0,
    y: 0,
  });

  const timeline = gsap.timeline();

  timeline.to(
    elements,
    {
      opacity: 1,
      scale: 1,
      duration: duration,
      stagger: stagger,
      ease: "elastic.out(1, 0.5)",
    },
    0,
  );

  timeline.to(
    elements,
    {
      y: -20,
      duration: duration * 0.5,
      stagger: stagger,
      ease: "sine.inOut",
    },
    0,
  );

  timeline.to(
    elements,
    {
      y: 0,
      duration: duration * 0.5,
      stagger: stagger,
      ease: "sine.inOut",
    },
    duration * 0.5,
  );
};

Animation.splashEffect = function (elements, duration = 1, stagger = 0.06) {
  gsap.set(elements, {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
  });
  const timeline = gsap.timeline();

  timeline.to(
    elements,
    {
      opacity: 1,
      scale: 1,
      duration: duration * 0.6,
      stagger: stagger,
      ease: "back.out(1.5)",
    },
    0,
  );

  timeline.to(
    elements,
    {
      y: 0,
      duration: duration * 0.4,
      stagger: stagger,
      ease: "bounce.out",
    },
    duration * 0.4,
  );
};

Animation.fillPolygon = function (fillPath, color, percent, duration = 0.5) {
  fillPath.style.fill = color;
  fillPath.style.stroke = color + "CC";

  const percentValue = parseInt(percent);
  // Remplissage de bas en haut : 0% = vide, 100% = plein
  const fillHeight = percentValue / 100;

  const clipPath = `polygon(
    0% ${100 - fillHeight * 100}%, 
    100% ${100 - fillHeight * 100}%, 
    100% 100%, 
    0% 100%
  )`;

  gsap.to(fillPath, {
    clipPath: clipPath,
    duration: duration,
    ease: "power2.inOut",
  });
};



/**
 * Hover intelligent pour les AC
 * Lit l'opacité à chaque événement pour déterminer si on fait le hover
 */
Animation.attachACHover = function(path, fromColor, toColor, duration = 0.2) {
  const getOpacity = (el) => {
    const style = parseFloat(el.style.opacity);
    const attr = parseFloat(el.getAttribute("opacity"));
    return !isNaN(style) ? style : (!isNaN(attr) ? attr : 0);
  };

  path.addEventListener("mouseenter", () => {
    if (getOpacity(path) === 0) {
      path.style.fill = toColor;
      path.style.stroke = toColor + "CC";
    }
  });

  path.addEventListener("mouseleave", () => {
    if (getOpacity(path) === 0) {
      path.style.fill = fromColor;
      path.style.stroke = fromColor + "CC";
    }
  });
};



/**
   * Mettre en avant un point
   */
  Animation.highlightPoint = function(competence) {
    const point = this.root.querySelector(`[data-competence="${competence}"]`);
    if (point) {
      gsap.to(point.querySelector(".radar-point-bg"), {
        r: 12,
        opacity: 0.4,
        duration: 0.3
      });
    }
  };



  /**
   * Réinitialiser la mise en avant
   */
  Animation.resetHighlight = function() {
    gsap.to(".radar-point-bg", {
      r: 8,
      opacity: 0.2,
      duration: 0.3
    });
  }




  Animation.updateFillColor = function() {
    const maxComp = Object.keys(this.percentages).reduce((a, b) =>
      this.percentages[a] > this.percentages[b] ? a : b
    );
    const color = this.competenceMap[maxComp];
    
    gsap.to(this.fillPolygon, {
      attr: { fill: color, stroke: color },
      duration: 0.6,
      ease: "power2.out"
    });
  }









/**
 * Animations du Niveaux View
 */
const niveauxAnimations = {
  /**
   * Animer le pourcentage d'une compétence dans le panneau
   * @param {HTMLElement} percentSpan - L'élément texte du pourcentage
   * @param {number} targetValue - La valeur cible
   */
  animatePercentage(percentSpan, targetValue) {
    const currentValue = parseInt(percentSpan.textContent) || 0;
    gsap.to({ value: currentValue }, {
      value: Math.round(targetValue),
      duration: 0.6,
      ease: "power2.out",
      onUpdate: function() {
        percentSpan.textContent = Math.round(this.targets()[0].value) + "%";
      }
    });
  },

  /**
   * Animer la barre de progression
   * @param {HTMLElement} progressBar - La barre à animer
   * @param {number} percentage - Le pourcentage cible
   * @param {string} color - La couleur de la barre
   */
  animateProgressBar(progressBar, percentage, color) {
    gsap.to(progressBar, {
      width: `${percentage}%`,
      duration: 0.6,
      ease: "power2.out"
    });

    gsap.to(progressBar, {
      backgroundColor: color,
      duration: 0.4,
      ease: "power2.out"
    });
  },

  /**
   * Fermer le panneau niveaux avec animation
   * @param {HTMLElement} content - L'élément de contenu à fermer
   * @param {Function} onComplete - Callback une fois fermé
   */
  collapsePanel(content, onComplete) {
    gsap.to(content, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: onComplete
    });
  },

  /**
   * Ouvrir le panneau niveaux avec animation
   * @param {HTMLElement} content - L'élément de contenu à ouvrir
   */
  expandPanel(content) {
    gsap.to(content, {
      height: "auto",
      opacity: 1,
      marginTop: 20,
      duration: 0.3,
      ease: "power2.inOut"
    });
  },

  /**
   * Masquer complètement le panneau niveaux
   * @param {HTMLElement} root - L'élément racine du panneau
   */
  hidePanel(root) {
    gsap.to(root, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      ease: "power2.out"
    });
  },

  /**
   * Afficher le panneau niveaux
   * @param {HTMLElement} root - L'élément racine du panneau
   */
  showPanel(root) {
    gsap.to(root, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
      ease: "power2.out"
    });
  }
};

/**
 * Animations du Radar View
 */
const radarAnimations = {
  /**
   * Animer la mise en avant d'un point du radar
   * @param {SVGElement} pointBg - L'élément de fond du point
   */
  highlightPoint(pointBg) {
    gsap.to(pointBg, {
      attr: { r: 12 },
      opacity: 0.4,
      duration: 0.3,
      ease: "power2.out"
    });
  },

  /**
   * Réinitialiser la mise en avant de tous les points
   * @param {NodeList} pointBgs - Tous les éléments de fond des points
   */
  resetHighlight(pointBgs) {
    gsap.to(pointBgs, {
      attr: { r: 8 },
      opacity: 0.2,
      duration: 0.3,
      ease: "power2.out"
    });
  },

  /**
   * Animer le pourcentage d'une compétence
   * @param {HTMLElement} percentSpan - L'élément texte du pourcentage
   * @param {number} targetValue - La valeur cible du pourcentage
   */
  animatePercentage(percentSpan, targetValue) {
    gsap.to(percentSpan, {
      textContent: Math.round(targetValue),
      duration: 0.6,
      snap: { textContent: 1 },
      ease: "power2.out",
      onUpdate: function() {
        percentSpan.textContent = Math.round(this.targets()[0].textContent) + "%";
      }
    });
  },

  /**
   * Animer le pentagone du radar
   * @param {SVGPolygonElement} fillPolygon - Le polygone à animer
   * @param {string} newPoints - Les nouveaux points du polygone
   */
  animatePentagon(fillPolygon, newPoints) {
    gsap.to(fillPolygon, {
      attr: { points: newPoints },
      duration: 0.6,
      ease: "power2.out"
    });
  },

  /**
   * Animer la couleur du pentagone
   * @param {SVGPolygonElement} fillPolygon - Le polygone à animer
   * @param {string} color - La nouvelle couleur
   */
  animatePentagonColor(fillPolygon, color) {
    gsap.to(fillPolygon, {
      attr: { fill: color, stroke: color },
      duration: 0.6,
      ease: "power2.out"
    });
  },

  /**
   * Fermer le panneau radar avec animation
   * @param {HTMLElement} content - L'élément de contenu à fermer
   * @param {Function} onComplete - Callback une fois fermé
   */
  collapsePanel(content, onComplete) {
    gsap.to(content, {
      height: 0,
      opacity: 0,
      marginTop: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: onComplete
    });
  },

  /**
   * Ouvrir le panneau radar avec animation
   * @param {HTMLElement} content - L'élément de contenu à ouvrir
   */
  expandPanel(content) {
    gsap.to(content, {
      height: "auto",
      opacity: 1,
      marginTop: 20,
      duration: 0.3,
      ease: "power2.inOut"
    });
  },

  /**
   * Masquer complètement le panneau radar
   * @param {HTMLElement} root - L'élément racine du panneau
   */
  hidePanel(root) {
    gsap.to(root, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      ease: "power2.out"
    });
  },

  /**
   * Afficher le panneau radar
   * @param {HTMLElement} root - L'élément racine du panneau
   */
  showPanel(root) {
    gsap.to(root, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
      ease: "power2.out"
    });
  }
};








































/**
 * Animations du Historique View
 */
const historiqueAnimations = {
  /**
   * Animer la barre de remplissage d'une entrée d'historique
   * @param {HTMLElement} barFill - La barre à animer
   * @param {number} percentage - Le pourcentage cible
   * @param {number} delay - Délai avant le début de l'animation
   */
  animateHistoriqueBar(barFill, percentage, delay = 0.1) {
    gsap.to(barFill, {
      width: `${percentage}%`,
      duration: 0.5,
      ease: "power2.out",
      delay: delay
    });
  },

  /**
   * Animer l'apparition d'une entrée d'historique
   * @param {HTMLElement} entryDiv - L'élément d'entrée à animer
   * @param {number} delay - Délai avant le début de l'animation
   */
  animateEntryAppear(entryDiv, delay = 0) {
    gsap.fromTo(entryDiv, 
      {
        opacity: 0,
        y: 10
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: delay
      }
    );
  },

  /**
   * Scroller automatiquement vers le bas du conteneur
   * @param {HTMLElement} container - Le conteneur à scroller
   */
  scrollToBottom(container) {
    gsap.to(container, {
      scrollTo: { y: container.scrollHeight },
      duration: 0.4,
      ease: "power2.inOut"
    });
  }
};

export { Animation,radarAnimations, niveauxAnimations, historiqueAnimations };
