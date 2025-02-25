document.addEventListener("DOMContentLoaded", function () {
    const albums = document.querySelectorAll(".album");
    const photoContainer = document.getElementById("photo-container");
    const photosDiv = document.getElementById("photos");
    const closeGalleryBtn = document.getElementById("close-gallery");

    let currentAlbum = null; // DODANE: Aktualnie otwarty album
    let currentIndex = 0; // DODANE: Indeks aktualnego zdjęcia

    // Liczba zdjęć w albumach
    const albumPhotos = {
        album1: 10,  
        album2: 4,  
        album3: 23,  
        album4: 0,  
        album5: 5,  
        album6: 0,  
        album7: 2,  
        album8: 0,  
    };

    function showAlbumPhotos(albumId) {
        photosDiv.innerHTML = "";
        currentAlbum = albumId; // DODANE: Zapisz aktualny album
        const albumFolder = `images/${albumId}/`;
        const imageCount = albumPhotos[albumId];

        for (let i = 1; i <= imageCount; i++) {
            const img = document.createElement("img");
            img.src = `${albumFolder}img${i}.jpg`;
            img.alt = `Zdjęcie ${i}`;
            img.classList.add("gallery-img");

            img.onload = () => img.classList.add("visible");

            img.addEventListener("click", function () {
                openImageInFullscreen(i, imageCount); // DODANE: Przechodzi do pełnoekranowego trybu
            });

            photosDiv.appendChild(img);
        }

        photoContainer.style.display = "flex";
    }

    function openImageInFullscreen(index, totalImages) {
        currentIndex = index; // DODANE: Zapisz indeks zdjęcia

        const fullscreenOverlay = document.createElement("div");
        fullscreenOverlay.classList.add("fullscreen-overlay");

        const enlargedImg = document.createElement("img");
        enlargedImg.src = `images/${currentAlbum}/img${index}.jpg`;
        enlargedImg.classList.add("fullscreen-img");

        // DODANE: Strzałki do przewijania zdjęć
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = "❮";
        prevBtn.classList.add("nav-btn", "prev-btn");
        prevBtn.addEventListener("click", function () {
            navigateImage(-1, totalImages);
        });

        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = "❯";
        nextBtn.classList.add("nav-btn", "next-btn");
        nextBtn.addEventListener("click", function () {
            navigateImage(1, totalImages);
        });

        fullscreenOverlay.appendChild(prevBtn);
        fullscreenOverlay.appendChild(enlargedImg);
        fullscreenOverlay.appendChild(nextBtn);
        document.body.appendChild(fullscreenOverlay);

        fullscreenOverlay.addEventListener("click", function (event) {
            if (event.target === fullscreenOverlay) {
                fullscreenOverlay.remove();
            }
        });

        document.addEventListener("keydown", keyboardNavigation);
    }

    function navigateImage(direction, totalImages) {
        currentIndex += direction;
        if (currentIndex < 1) currentIndex = totalImages;
        if (currentIndex > totalImages) currentIndex = 1;

        const fullscreenImg = document.querySelector(".fullscreen-img");
        fullscreenImg.src = `images/${currentAlbum}/img${currentIndex}.jpg`;
    }

    function keyboardNavigation(event) {
        if (document.querySelector(".fullscreen-overlay")) {
            if (event.key === "ArrowLeft") navigateImage(-1, albumPhotos[currentAlbum]);
            if (event.key === "ArrowRight") navigateImage(1, albumPhotos[currentAlbum]);
            if (event.key === "Escape") {
                document.querySelector(".fullscreen-overlay").remove();
                document.removeEventListener("keydown", keyboardNavigation);
            }
        }
    }

    // Dodany listener, który zatrzymuje propagację scrolla w kontenerze #photos,
    // aby scrollowanie wewnątrz albumu nie wpływało na przewijanie strony głównej.
    photosDiv.addEventListener("wheel", function (event) {
        event.stopPropagation();
    });

    albums.forEach(album => {
        album.addEventListener("click", function () {
            showAlbumPhotos(this.getAttribute("data-album"));
        });
    });

    closeGalleryBtn.addEventListener("click", function () {
        photoContainer.style.display = "none";
    });
});







document.addEventListener("DOMContentLoaded", function () {
    const newsItems = document.querySelectorAll(".news-item, .trainer ");

    // Ukrycie elementów na początku
    newsItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    // Tworzenie Intersection Observera
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 300);
                observer.unobserve(entry.target); // Przestaje obserwować element po jego animacji
            }
        });
    }, { threshold: 0.2 });

    // Obserwowanie elementów
    newsItems.forEach(item => observer.observe(item));
});







