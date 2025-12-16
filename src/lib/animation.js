import { gsap } from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
gsap.registerPlugin(DrawSVGPlugin);

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




















export { Animation };
