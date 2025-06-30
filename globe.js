window.onload = () => {
  // Sécurisation : vérifie que THREE est bien chargé
  if (typeof THREE === "undefined") {
    alert("❌ THREE.js n'est pas chargé !");
    return;
  }

  // Récupération du canvas dédié à WebGL
  const oldCanvas = document.getElementById("globe-webgl");
  const canvas = oldCanvas.cloneNode(true); // Clone propre
  oldCanvas.parentNode.replaceChild(canvas, oldCanvas); // Remplace le vieux canvas

  // Teste si WebGL est disponible
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("❌ WebGL n’est pas supporté ou bloqué par le navigateur.");
    return;
  }

  // Initialisation du moteur WebGL
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

  // Charge la texture de la Terre
  const loader = new THREE.TextureLoader();
  loader.load(
    "Images/earth.jpg",
    (texture) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshStandardMaterial({ map: texture })
      );
      scene.add(sphere);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.003;
        renderer.render(scene, camera);
      };

      animate();
    },
    undefined,
    (err) => {
      console.error("❌ Erreur de chargement texture :", err);
      alert("Impossible de charger la texture earth.jpg.");
    }
  );
};
