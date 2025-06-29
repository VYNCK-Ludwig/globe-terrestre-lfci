console.log("🚀 globe.js lancé");

if (typeof THREE === "undefined") {
  console.error("❌ THREE n'est pas défini !");
} else {
  console.log("✅ THREE est disponible");
}

const canvas = document.getElementById("globe");
console.log("🧪 canvas =", canvas);

if (!canvas) {
  console.error("❌ Le canvas avec id 'globe' est introuvable.");
} else {
  // Test de création de contexte WebGL brut
  const testGL = canvas.getContext("webgl");
  if (!testGL) {
    console.error("❌ Impossible de créer un contexte WebGL sur ce canvas.");
  } else {
    console.log("✅ Contexte WebGL disponible.");
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    console.log("✅ WebGLRenderer créé avec succès.");
  } catch (e) {
    console.error("❌ Échec de création de WebGLRenderer avec canvas :", e);
    console.warn("🧪 Tentative de création SANS canvas (fallback)");

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      document.body.appendChild(renderer.domElement);
      console.log("✅ WebGLRenderer créé sans canvas fourni.");
    } catch (err) {
      console.error("❌ Fallback échoué :", err);
      alert("Impossible d'initialiser WebGL. 😢");
    }
  }

  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    console.log("✅ Scène créée");

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    console.log("✅ Caméra positionnée à z =", camera.position.z);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    console.log("✅ Lumière ajoutée");

    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x00AEEF });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    console.log("✅ Sphère ajoutée à la scène");

    function animate() {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.002;
      renderer.render(scene, camera);
    }

    animate();
    console.log("🎬 Animation lancée");

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
