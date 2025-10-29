document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const avatars = document.querySelectorAll('.avatar:not(.empty-avatar)'); // Wyklucz pusty awatar
    const personInfo = document.querySelector('.person-info');
    const infoName = document.getElementById('info-name');
    const infoRole = document.getElementById('info-role');

    let currentIndex = 0;

    function updateGallery() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            slide.style.zIndex = '';

            let offset = 0;
            if (index < currentIndex) {
                offset = currentIndex - index;
                slide.style.setProperty('--offset', offset);
                slide.classList.add('left-of-active');
            } else if (index > currentIndex) {
                offset = index - currentIndex;
                slide.style.setProperty('--offset', offset);
                slide.classList.add('right-of-active');
            } else {
                slide.classList.add('active');
                slide.style.setProperty('--offset', 0);
            }
            
            slide.style.zIndex = 10 - offset;
        });

        slides.forEach(slide => {
            slide.classList.remove('left-of-active', 'right-of-active');
        });
        
        const activeSlide = slides[currentIndex];
        infoName.textContent = activeSlide.dataset.name;
        infoRole.textContent = activeSlide.dataset.role;

        personInfo.classList.remove('show');
        setTimeout(() => {
            personInfo.style.display = 'block';
            personInfo.classList.add('show');
        }, 10);
        
        avatars.forEach((avatar, index) => {
            avatar.classList.toggle('active', index === currentIndex);
        });
    }

    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            const index = parseInt(avatar.dataset.index);
            if (index !== currentIndex) {
                currentIndex = index;
                updateGallery();
            }
        });
    });

    updateGallery();
});