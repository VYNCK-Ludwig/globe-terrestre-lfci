window.addEventListener("DOMContentLoaded", () => {
  // Vérifie si THREE est bien chargé
  if (typeof THREE === "undefined") {
    console.error("❌ THREE n'est toujours pas défini !");
    alert("Erreur : la bibliothèque Three.js n'est pas encore disponible.");
    return;
  }

  const canvas = document.getElementById("globe");

  if (!canvas) {
    alert("❌ Le canvas #globe est introuvable !");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

  const loader = new THREE.TextureLoader();
  const texture = loader.load("Images/earth.jpg", () => {
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
  });
});
