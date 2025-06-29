// Sélection du canvas dans index.html
const canvas = document.getElementById("globe");

// Création du moteur de rendu WebGL
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scène & caméra
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Lumière directionnelle (comme le Soleil)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

// Chargement de la texture Terre
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("Images/earth.jpg");

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Fonction d'animation
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.003;
  renderer.render(scene, camera);
}

animate();
// Gestion du redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});