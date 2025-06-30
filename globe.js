window.onload = () => {
  // Vérifie que Three.js est chargé
  if (typeof THREE === "undefined") {
    alert("❌ THREE.js n'est pas chargé !");
    return;
  }

  // Récupère le canvas propre
  const oldCanvas = document.getElementById("globe-webgl");
  const canvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(canvas, oldCanvas);

  // Teste la dispo WebGL
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("❌ WebGL est bloqué ou non supporté !");
    return;
  }

  // Crée le renderer Three.js
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

  // Charge la texture
  const loader = new THREE.TextureLoader();
  loader.load("Images/earth.jpg", (texture) => {
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({ map: texture })
    );
    scene.add(earth);

    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();
  }, undefined, (err) => {
    console.error("❌ Erreur chargement texture :", err);
    alert("Erreur de chargement : earth.jpg manquant ?");
  });
};
