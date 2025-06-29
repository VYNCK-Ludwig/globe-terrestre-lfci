// Sélection du canvas
const canvas = document.getElementById("globe");
console.log("canvas trouvé ?", canvas)

if (!canvas) {
  alert("❌ Erreur : #globe introuvable !");
  throw new Error("Canvas not found");
}

// Création du moteur de rendu
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scène + caméra
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(3, 2, 5);
scene.add(light);

// Texture Terre
const loader = new THREE.TextureLoader();
const texture = loader.load("Images/earth.jpg", () => {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: texture });

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Animation
  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.003;
    renderer.render(scene, camera);
  }

  animate();
}, undefined, err => {
  console.error("❌ Échec de chargement de la texture :", err);
});
