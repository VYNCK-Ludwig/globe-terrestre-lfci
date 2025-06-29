// Initialisation des particules dynamiques
function initParticles(color = '#003f5c') {
  particlesJS("particles-js", {
    particles: {
      number: { value: 60 },
      size: { value: 3 },
      color: { value: color },
      opacity: { value: 0.6 },
      line_linked: {
        enable: true,
        distance: 130,
        color: color,
        opacity: 0.4,
        width: 1
      },
      move: { enable: true, speed: 2 }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: "repulse" } },
      modes: { repulse: { distance: 100 } }
    },
    retina_detect: true
  });
}

initParticles('#003f5c'); // Particules foncées par défaut

// Sélection des éléments
const themeBtn = document.getElementById('toggle-theme');
const toggle = document.getElementById('toggle-music');
const music = document.getElementById('bg-music');
const title = document.querySelector('.info-bien h1');

// Changement de thème (jour/nuit)
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  themeBtn.textContent = isDark ? '☀️ Mode jour' : '🌙 Mode nuit';

  // Redémarrer les particules avec couleur adaptée
  if (window.pJSDom && pJSDom.length) {
    pJSDom[0].pJS.fn.vendors.destroypJS();
    pJSDom = [];
  }
  initParticles(isDark ? '#b4ffff' : '#003f5c');

  // Mise à jour couleur du titre
  title.style.color = isDark ? '#f5f5f5' : '#00453f';

  // Afficher immédiatement les images visibles dans la fenêtre
  document.querySelectorAll('.gallery img').forEach(img => {
    const rect = img.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (isInView && !img.classList.contains('visible')) {
      img.classList.add('visible');
    }
  });
});

// Apparition des images au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery img').forEach(img => {
    observer.observe(img);
  });
});
