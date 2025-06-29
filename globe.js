window.onload = () => {
  // Vérifier que THREE est bien là
  if (typeof THREE === "undefined") {
    console.error("❌ THREE.js n'est pas chargé !");
    alert("Erreur critique : Three.js est introuvable. Vérifie ton <script> dans index.html.");
    return;
  }

  // Récupération du canvas
  const canvas = document.getElementById("globe");

  if (!canvas) {
    alert("❌ Le canvas avec id='globe' est introuvable !");
    return;
  }

  // Vérification si un autre contexte n'a pas déjà été créé
  if (canvas.getContext && canvas.getContext("2d")) {
    alert("⚠️ Attention : ce canvas a déjà un contexte 2D. Impossible de créer WebGL.");
    return;
  }

  // Vérifier que WebGL est disponible
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("❌ WebGL est bloqué ou non supporté !");
    return;
  }

  // Créer le renderer Three.js
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  } catch (e) {
    alert("❌ Échec du rendu WebGL : " + e.message);
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

  // Texture Terre
  const loader = new THREE.TextureLoader();
  loader.load(
    "Images/earth.jpg",
    (texture) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshStandardMaterial({ map: texture });

      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.003;
        renderer.render(scene, camera);
      }

      animate();
    },
    undefined,
    (err) => {
      console.error("❌ Erreur de chargement texture :", err);
      alert("Impossible de charger la texture Terre.");
    }
  );
};
