import * as THREE from 'three';

window.onload = () => {
  const canvas = document.getElementById("globe-webgl");
  const cleanCanvas = canvas.cloneNode(true);
  canvas.parentNode.replaceChild(cleanCanvas, canvas);

  const renderer = new THREE.WebGLRenderer({ canvas: cleanCanvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(3, 2, 5);
  scene.add(light);

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
  });
};
