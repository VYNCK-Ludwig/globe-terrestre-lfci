document.addEventListener("DOMContentLoaded", () => {
  const typeDeBien = document.body.dataset.type || "maison";
  const nomBase = `${typeDeBien}DB`;
  const nomTable = `${typeDeBien}s`;
  let db;

  const conteneurAnnonces = document.querySelector(".annonces");

  const request = indexedDB.open(nomBase, 1);
  request.onerror = (e) => console.error("IndexedDB erreur :", e.target.error);
  request.onsuccess = (e) => {
    db = e.target.result;
    afficherBiens();
  };
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(nomTable)) {
      db.createObjectStore(nomTable, { keyPath: "slug" });
    }
  };

  function afficherBiens() {
    conteneurAnnonces.innerHTML = "";
    const tx = db.transaction([nomTable], "readonly");
    const store = tx.objectStore(nomTable);
    const cursor = store.openCursor();
    cursor.onsuccess = (e) => {
      const result = e.target.result;
      if (result) {
        ajouterBienAuDOM(result.value);
        result.continue();
      }
    };
  }

  function ajouterBienAuDOM(bien) {
    const adminActif = localStorage.getItem("adminActif") === "true";
    const fiche = document.createElement("div");
    fiche.classList.add("bien");
    fiche.dataset.slug = bien.slug;

    fiche.innerHTML = `
      <a href="${typeDeBien}.html?slug=${bien.slug}" class="carte-maison">
        ${bien.image ? `<img src="${bien.image}" alt="${bien.titre}" />` : ""}
        <div class="infos-maison">
          <h3>${bien.titre}</h3>
          <p class="prix">${bien.prix} €</p>
        </div>
      </a>
      ${adminActif ? `<button class="supprimer-bien" data-slug="${bien.slug}">🗑 Supprimer</button>` : ""}
    `;
    conteneurAnnonces.appendChild(fiche);

    if (adminActif) {
      fiche.querySelector(".supprimer-bien")?.addEventListener("click", () => {
        const tx = db.transaction([nomTable], "readwrite");
        tx.objectStore(nomTable).delete(bien.slug);
        fiche.remove();
      });
    }
  }

  const formulaire = document.getElementById("form-maison");
  const boutonAjout = document.getElementById("ajouter-maison");
  const blocFormulaire = document.getElementById("formulaire-ajout");
  let premiereImageDataUrl = "";

  boutonAjout?.addEventListener("click", () => {
    blocFormulaire.style.display = "block";
    boutonAjout.style.display = "none";
  });

  document.getElementById("photos")?.addEventListener("change", (e) => {
    const apercu = document.getElementById("aperçu-images");
    apercu.innerHTML = "";
    premiereImageDataUrl = "";
    [...e.target.files].forEach((file, index) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = document.createElement("img");
        img.src = ev.target.result;
        img.style.maxWidth = "120px";
        img.style.margin = "8px";
        img.style.borderRadius = "6px";
        img.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
        apercu.appendChild(img);
        if (index === 0) premiereImageDataUrl = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  formulaire?.addEventListener("submit", (e) => {
    e.preventDefault();
    const titre = document.getElementById("titre").value.trim();
    const prix = document.getElementById("prix").value.trim();
    const description = document.getElementById("description").value.trim();
    const slug = encodeURIComponent(titre);
    const bien = { slug, titre, prix, description, image: premiereImageDataUrl };

    const tx = db.transaction([nomTable], "readwrite");
    tx.objectStore(nomTable).put(bien).onsuccess = () => {
      afficherBiens();
      formulaire.reset();
      document.getElementById("aperçu-images").innerHTML = "";
      premiereImageDataUrl = "";
      blocFormulaire.style.display = "none";
      boutonAjout.style.display = "inline-block";
      alert(`✅ ${typeDeBien} ajouté !`);
    };
  });
  // Recherche en temps réel
  document.getElementById("recherche-bien")?.addEventListener("input", (e) => {
    const terme = e.target.value.toLowerCase();
    const fiches = [...document.querySelectorAll(".bien")];
    fiches.forEach(fiche => {
      fiche.style.display = fiche.textContent.toLowerCase().includes(terme) ? "" : "none";
    });

    if (!terme) {
      const conteneur = document.querySelector(".annonces");
      fiches
        .sort((a, b) => a.dataset.slug.localeCompare(b.dataset.slug))
        .forEach(fiche => {
          fiche.style.display = "";
          conteneur.appendChild(fiche);
        });
    }
  });

  // Tri dynamique
  document.getElementById("tri-bien")?.addEventListener("change", (e) => {
    const mode = e.target.value;
    const conteneur = document.querySelector(".annonces");
    const fiches = [...document.querySelectorAll(".bien")].filter(f => f.style.display !== "none");

    fiches.sort((a, b) => {
      const getTitre = el => el.querySelector("h3")?.textContent.toLowerCase().trim() || "";
      const getPrix = el => parseFloat(el.querySelector(".prix")?.textContent.replace(/[^\d]/g, "")) || 0;

      switch (mode) {
        case "prix-asc": return getPrix(a) - getPrix(b);
        case "prix-desc": return getPrix(b) - getPrix(a);
        case "titre-asc": return getTitre(a).localeCompare(getTitre(b), "fr");
        case "titre-desc": return getTitre(b).localeCompare(getTitre(a), "fr");
        default: return 0;
      }
    });

    fiches.forEach(f => conteneur.appendChild(f));
  });

  // Contrôle musique
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

  // Thème jour / nuit
  const btnTheme = document.getElementById("toggle-theme");
  btnTheme?.addEventListener("click", () => {
    document.body.classList.toggle("nuit");
    btnTheme.textContent = document.body.classList.contains("nuit") ? "☀️ Mode jour" : "🌙 Mode nuit";
  });

  // Activation / désactivation du mode admin
  document.addEventListener("keydown", (e) => {
    const adminActif = localStorage.getItem("adminActif") === "true";
    if (e.ctrlKey && e.key.toLowerCase() === "m" && !adminActif) {
      const mdp = prompt("🔐 Mot de passe admin :");
      if (mdp === "Kooligan011.") {
        localStorage.setItem("adminActif", "true");
        alert("✅ Mode admin activé !");
        location.reload();
      } else {
        alert("❌ Mot de passe incorrect.");
      }
    }
    if (e.ctrlKey && e.key.toLowerCase() === "q" && adminActif) {
      localStorage.removeItem("adminActif");
      alert("🔓 Mode admin désactivé.");
      location.reload();
    }
  });

  // Affichage des boutons admin au chargement
  if (localStorage.getItem("adminActif") === "true") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
  }
});
