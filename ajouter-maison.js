document.addEventListener("DOMContentLoaded", () => {
  // 🎵 Musique
  const music = document.getElementById("bg-music");
  const btnMusic = document.getElementById("toggle-music");

  btnMusic?.addEventListener("click", () => {
    if (music?.paused) {
      music.play();
      btnMusic.textContent = "🔊 Couper la musique";
    } else {
      music.pause();
      btnMusic.textContent = "🔇 Musique coupée";
    }
  });

  // 🌙 Thème
  const btnTheme = document.getElementById("toggle-theme");
  btnTheme?.addEventListener("click", () => {
    document.body.classList.toggle("nuit");
    btnTheme.textContent = document.body.classList.contains("nuit")
      ? "☀️ Mode jour"
      : "🌙 Mode nuit";
  });

  // 🔐 Activation / désactivation admin
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "m") {
      if (localStorage.getItem("adminActif") === "true") return;
      const mdp = prompt("🔐 Entrez le mot de passe admin :");
      if (mdp === "Kooligan011.") {
        localStorage.setItem("adminActif", "true");
        alert("✅ Mode admin activé !");
        location.reload();
      } else {
        alert("❌ Mot de passe incorrect.");
      }
    }

    if (e.ctrlKey && e.key.toLowerCase() === "q") {
      if (localStorage.getItem("adminActif") === "true") {
        localStorage.removeItem("adminActif");
        alert("🔓 Mode admin désactivé.");
        location.reload();
      }
    }
  });

  // 👨‍💼 Affiche les éléments admin si actif
  const adminActif = localStorage.getItem("adminActif") === "true";
  if (adminActif) {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
  }

  // ➕ Affichage du formulaire
  const boutonAjout = document.getElementById("ajouter-maison");
  const blocFormulaire = document.getElementById("formulaire-ajout");

  boutonAjout?.addEventListener("click", () => {
    blocFormulaire.style.display = "block";
    boutonAjout.style.display = "none";
  });

  // 🖼️ Prévisualisation image
  const inputPhotos = document.getElementById("photos");
  const apercu = document.getElementById("aperçu-images");
  let premiereImageDataUrl = "";

  inputPhotos?.addEventListener("change", () => {
    apercu.innerHTML = "";
    premiereImageDataUrl = "";
    const files = inputPhotos.files;

    for (const [index, file] of [...files].entries()) {
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = file.name;
        img.style.maxWidth = "100px";
        img.style.margin = "8px";
        img.style.borderRadius = "6px";
        img.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
        apercu.appendChild(img);

        if (index === 0) {
          premiereImageDataUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // 🏗️ Ajout d'une maison côté interface
  const formulaire = document.getElementById("form-maison");
  const conteneurAnnonces = document.querySelector(".annonces");

  formulaire?.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = formulaire.titre.value;
    const prix = formulaire.prix.value;
    const description = formulaire.description.value;

    const fiche = document.createElement("div");
    fiche.classList.add("bien");

    fiche.innerHTML = `
      ${premiereImageDataUrl ? `<img src="${premiereImageDataUrl}" alt="${titre}" style="max-width:100%; border-radius:6px; margin-bottom:15px;" />` : ""}
      <h3>${titre}</h3>
      <p><strong>Prix :</strong> ${prix} €</p>
      <p>${description}</p>
    `;

    conteneurAnnonces?.prepend(fiche);

    formulaire.reset();
    apercu.innerHTML = "";
    premiereImageDataUrl = "";
    blocFormulaire.style.display = "none";
    boutonAjout.style.display = "inline-block";
    alert("✅ Maison ajoutée à l’interface !");
  });
});
