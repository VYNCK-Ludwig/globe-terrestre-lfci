// 🎵 Contrôle de la musique
const music = document.getElementById("bg-music");
const btnMusic = document.getElementById("toggle-music");

if (music && btnMusic) {
  btnMusic.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      btnMusic.textContent = "🔊 Couper la musique";
    } else {
      music.pause();
      btnMusic.textContent = "🔇 Musique coupée";
    }
  });
}

// 🌙 Mode nuit avec texte dynamique
const btnTheme = document.getElementById("toggle-theme");

if (btnTheme) {
  btnTheme.addEventListener("click", () => {
    document.body.classList.toggle("nuit");
    const nuitActive = document.body.classList.contains("nuit");

    // Met à jour le texte et l’icône
    btnTheme.textContent = nuitActive ? "☀️ Mode jour" : "🌙 Mode nuit";
  });
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "m") {
    const mdp = prompt("🔐 Entrez le mot de passe admin :");
    if (mdp === "lfci2024") {
      localStorage.setItem("adminActif", "true");
      alert("✅ Mode admin activé !");
      location.reload(); // recharge la page pour afficher les éléments admin
    } else {
      alert("❌ Mot de passe incorrect.");
    }
  }
});
