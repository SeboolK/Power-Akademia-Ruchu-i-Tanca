document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });
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
        }, { threshold: 0.15 });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("visible"));
    }

    setupGallery();
    setupSignupForm();
});

function setupGallery() {
    const albums = document.querySelectorAll("[data-album]");
    const photoContainer = document.getElementById("photo-container");
    const photosDiv = document.getElementById("photos");
    const closeGalleryBtn = document.getElementById("close-gallery");
    const galleryTitle = document.getElementById("gallery-title");

    if (!albums.length || !photoContainer || !photosDiv || !closeGalleryBtn) {
        return;
    }

    const albumPhotos = {
        album1: 10,
        album2: 4,
        album3: 23,
        album4: 7,
        album5: 5,
        album7: 2
    };

    const albumTitles = {};
    albums.forEach((album) => {
        albumTitles[album.dataset.album] = album.dataset.title || album.textContent.trim();
    });

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
            img.src = `images/${albumId}/img${i}.jpg`;
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
        const fullscreenOverlay = document.createElement("div");
        fullscreenOverlay.className = "fullscreen-overlay";

        const viewer = document.createElement("div");
        viewer.className = "fullscreen-viewer";

        const enlargedImg = document.createElement("img");
        enlargedImg.src = `images/${currentAlbum}/img${currentIndex}.jpg`;
        enlargedImg.alt = `${albumTitle} - powiększone zdjęcie ${currentIndex}`;
        enlargedImg.className = "fullscreen-img";

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
            enlargedImg.src = `images/${currentAlbum}/img${currentIndex}.jpg`;
            enlargedImg.alt = `${albumTitle} - powiększone zdjęcie ${currentIndex}`;
        }

        function navigate(direction) {
            currentIndex += direction;
            if (currentIndex < 1) currentIndex = totalImages;
            if (currentIndex > totalImages) currentIndex = 1;
            updateImage();
        }

        function closeFullscreen() {
            fullscreenOverlay.remove();
            document.removeEventListener("keydown", handleKeys);
        }

        function handleKeys(event) {
            if (event.key === "ArrowLeft") navigate(-1);
            if (event.key === "ArrowRight") navigate(1);
            if (event.key === "Escape") closeFullscreen();
        }

        prevBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            navigate(-1);
        });

        nextBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            navigate(1);
        });

        fullscreenOverlay.addEventListener("click", (event) => {
            if (event.target === fullscreenOverlay) closeFullscreen();
        });

        updateImage();
        viewer.append(enlargedImg);
        fullscreenOverlay.append(prevBtn, viewer, nextBtn);
        document.body.appendChild(fullscreenOverlay);
        document.addEventListener("keydown", handleKeys);
    }

    albums.forEach((album) => {
        album.addEventListener("click", () => showAlbumPhotos(album.dataset.album));
    });

    closeGalleryBtn.addEventListener("click", closeAlbum);
    photoContainer.addEventListener("click", (event) => {
        if (event.target === photoContainer) closeAlbum();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && photoContainer.classList.contains("open")) {
            closeAlbum();
        }
    });
}

function setupSignupForm() {
    const form = document.getElementById("signup-form");
    const message = document.getElementById("signup-message");

    if (!form || !message) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const subject = encodeURIComponent("Zapisy na zajęcia - POWER Akademia");
        const body = encodeURIComponent(
            `Imię i nazwisko: ${data.get("name")}\n` +
            `Email: ${data.get("email")}\n` +
            `Telefon: ${data.get("phone") || "-"}\n` +
            `Uczestnik/grupa: ${data.get("group")}\n\n` +
            `Wiadomość:\n${data.get("message") || "-"}`
        );

        message.textContent = "Otwieram wiadomość email z przygotowanym zgłoszeniem.";
        window.location.href = `mailto:biuro.powerart@gmail.com?subject=${subject}&body=${body}`;
    });
}
