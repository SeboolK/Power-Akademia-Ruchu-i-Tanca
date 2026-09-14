document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  const setHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const canMove = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canMove) {
    const parallaxItems = document.querySelectorAll("[data-parallax] img");
    const moveParallax = () => {
      parallaxItems.forEach((img) => {
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (rect.top / window.innerHeight) * -28;
          img.style.transform = `translateY(${offset}px)`;
        }
      });
    };
    moveParallax();
    window.addEventListener("scroll", moveParallax, { passive: true });
  }

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (!canMove) return;
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
  });

  setupGallery();
});
function setupGallery() {
  const albums = document.querySelectorAll("[data-album]");
  const photoContainer = document.getElementById("photo-container");
  const photosDiv = document.getElementById("photos");
  const closeGalleryBtn = document.getElementById("close-gallery");
  const galleryTitle = document.getElementById("gallery-title");
  if (!albums.length || !photoContainer || !photosDiv || !closeGalleryBtn) return;

  const albumPhotos = { album1: 10, album2: 4, album3: 23, album4: 7, album5: 5, album7: 2 };
  const albumTitles = {};
  albums.forEach((album) => { albumTitles[album.dataset.album] = album.dataset.title || album.textContent.trim(); });

  let currentAlbum = "";
  let currentIndex = 1;

  function showAlbumPhotos(albumId) {
    photosDiv.innerHTML = "";
    currentAlbum = albumId;
    const imageCount = albumPhotos[albumId] || 0;
    const title = albumTitles[albumId] || "Galeria";
    if (galleryTitle) galleryTitle.textContent = title;

    for (let i = 1; i <= imageCount; i += 1) {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "gallery-thumb";
      thumb.setAttribute("aria-label", `Otwórz zdjęcie ${i} z albumu ${title}`);
      const img = document.createElement("img");
      img.src = `/images/${albumId}/img${i}.jpg`;
      img.alt = `${title} - zdjęcie ${i}`;
      img.loading = "lazy";
      thumb.append(img);
      thumb.addEventListener("click", () => openImageInFullscreen(i));
      photosDiv.appendChild(thumb);
    }

    photoContainer.classList.add("open");
    photoContainer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeAlbum() {
    photoContainer.classList.remove("open");
    photoContainer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openImageInFullscreen(index) {
    currentIndex = index;
    const totalImages = albumPhotos[currentAlbum] || 1;
    const albumTitle = albumTitles[currentAlbum] || "Galeria";
    const overlay = document.createElement("div");
    overlay.className = "fullscreen-overlay";
    const viewer = document.createElement("div");
    viewer.className = "fullscreen-viewer";
    const img = document.createElement("img");
    img.className = "fullscreen-img";
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.type = "button";
    prevBtn.className = "nav-btn prev-btn";
    prevBtn.setAttribute("aria-label", "Poprzednie zdjęcie");
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.type = "button";
    nextBtn.className = "nav-btn next-btn";
    nextBtn.setAttribute("aria-label", "Następne zdjęcie");

    function updateImage() {
      img.src = `/images/${currentAlbum}/img${currentIndex}.jpg`;
      img.alt = `${albumTitle} - powiększone zdjęcie ${currentIndex}`;
    }
    function navigate(direction) {
      currentIndex += direction;
      if (currentIndex < 1) currentIndex = totalImages;
      if (currentIndex > totalImages) currentIndex = 1;
      updateImage();
    }
    function closeFullscreen() {
      overlay.remove();
      document.removeEventListener("keydown", handleKeys);
    }
    function handleKeys(event) {
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "Escape") closeFullscreen();
    }

    prevBtn.addEventListener("click", (event) => { event.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener("click", (event) => { event.stopPropagation(); navigate(1); });
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeFullscreen(); });
    updateImage();
    viewer.append(img);
    overlay.append(prevBtn, viewer, nextBtn);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", handleKeys);
  }

  albums.forEach((album) => album.addEventListener("click", () => showAlbumPhotos(album.dataset.album)));
  closeGalleryBtn.addEventListener("click", closeAlbum);
  photoContainer.addEventListener("click", (event) => { if (event.target === photoContainer) closeAlbum(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && photoContainer.classList.contains("open")) closeAlbum(); });
}

