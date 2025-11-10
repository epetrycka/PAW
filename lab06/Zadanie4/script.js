const ACCESS_KEY = 'PCrPFWg0AnhKrZb8LxiFxV-DdZV2fOXcthfXKCt0ucY';

const searchPrompt = document.getElementById('search-prompt');
const sliderContainer = document.getElementById('slider-container');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const sliderStrip = document.getElementById('slider-strip');
const sliderWindow = document.querySelector('.slider-window');

const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');

const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightboxBtn = document.getElementById('close-lightbox');

let currentScroll = 0;

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchPrompt.style.display = 'none';
        sliderContainer.style.display = 'flex';
        
        const images = await getImages(query);
        renderImages(images);
    }
});

async function getImages(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${ACCESS_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Nie udało się pobrać zdjęć:", error);
        sliderStrip.innerHTML = `<p style="padding: 20px;">Wystąpił błąd lub nie znaleziono zdjęć. Sprawdź swój klucz API.</p>`;
        return [];
    }
}

function renderImages(images) {
    sliderStrip.innerHTML = '';
    currentScroll = 0;
    sliderStrip.style.transform = `translateX(0px)`;
    
    if (images.length === 0) {
        sliderStrip.innerHTML = `<p style="padding: 20px;">Brak wyników dla zapytania.</p>`;
        return;
    }

    images.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = img.urls.small;
        imgEl.alt = img.alt_description;
        imgEl.classList.add('thumbnail');
        
        imgEl.dataset.clickCount = 0;
        imgEl.dataset.lastClickTime = 0;

        imgEl.addEventListener('click', () => {
            handleImageClick(imgEl, img.urls.regular);
        });

        sliderStrip.appendChild(imgEl);
    });
}

function handleImageClick(imgElement, regularUrl) {
    const now = new Date().getTime();
    const lastClickTime = parseInt(imgElement.dataset.lastClickTime || 0);
    let clickCount = parseInt(imgElement.dataset.clickCount || 0);

    if (now - lastClickTime > 2000) {
        clickCount = 1;
    } else {
        clickCount++;
    }

    imgElement.dataset.clickCount = clickCount;
    imgElement.dataset.lastClickTime = now;

    if (clickCount === 2) {
        showLightbox(regularUrl);
        imgElement.dataset.clickCount = 0;
        imgElement.dataset.lastClickTime = 0;
    }
}

scrollRightBtn.addEventListener('click', () => {
    const maxScroll = sliderStrip.scrollWidth - sliderWindow.offsetWidth;
    currentScroll -= sliderWindow.offsetWidth; 
    
    if (currentScroll < -maxScroll) {
        currentScroll = -maxScroll;
    }
    sliderStrip.style.transform = `translateX(${currentScroll}px)`;
});

scrollLeftBtn.addEventListener('click', () => {
    currentScroll += sliderWindow.offsetWidth;

    if (currentScroll > 0) {
        currentScroll = 0;
    }
    sliderStrip.style.transform = `translateX(${currentScroll}px)`;
});

function showLightbox(imageUrl) {
    lightboxImage.src = imageUrl;
    lightboxOverlay.style.display = 'flex';
}

function hideLightbox() {
    lightboxOverlay.style.display = 'none';
    lightboxImage.src = '';

    const allThumbnails = sliderStrip.querySelectorAll('.thumbnail');
    allThumbnails.forEach(thumb => {
        thumb.dataset.clickCount = 0;
        thumb.dataset.lastClickTime = 0;
    });
}

closeLightboxBtn.addEventListener('click', hideLightbox);

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
        hideLightbox();
    }
});