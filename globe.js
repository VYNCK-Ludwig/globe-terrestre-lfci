window.onload = () => {
  // Vérification que THREE est bien chargé
  if (typeof THREE === "undefined") {
    console.error("❌ THREE.js n'est pas chargé !");
    alert("Erreur : la bibliothèque Three.js est introuvable. Vérifie le lien dans index.html.");
    return;
  }

  // Récupère le canvas HTML
  const canvas = document.getElementById("globe");

  if (!canvas) {
    alert("❌ Le canvas #globe est introuvable !");
    return;
  }

  // Teste si WebGL est disponible
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("❌ WebGL n’est pas disponible sur ce navigateur !");
    console.error("WebGL non supporté ou bloqué.");
    return;
  }

  // Crée le moteur de rendu WebGL
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  } catch (e) {
    alert("❌ Impossible d'initialiser WebGLRenderer : " + e.message);
    return;
  }

  // Création de la scène
  const scene = new THREE.Scene();

  // Caméra
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  // Lumière directionnelle
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

  // Chargement de la texture Terre
  const loader = new THREE.TextureLoader();
  const texture = loader.load("Images/earth.jpg", () => {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: texture });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.003;
      renderer.render(scene, camera);
    }

    animate();
  }, undefined, (err) => {
    console.error("❌ Erreur de chargement texture :", err);
    alert("Erreur de chargement de la texture Terre.");
  });
};
