document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const avatars = document.querySelectorAll('.avatar:not(.empty-avatar)');
    const personInfo = document.querySelector('.person-info');
    const infoName = document.getElementById('info-name');
    const infoRole = document.getElementById('info-role');

    let currentIndex = 7;

    slides.forEach((slide, i) => {
        const baseX = 80 * i - 50;
        slide.dataset.baseX = baseX;
        slide.style.transform = `translateX(${baseX}px)`;
        slide.style.zIndex = i;
    });

    function updateGallery() {
        slides.forEach((slide, index) => {
            const baseX = parseFloat(slide.dataset.baseX);
            slide.classList.remove('active');
            slide.style.transition = "transform 0.5s ease";

            if (index != currentIndex && slide.style.zIndex == '7') {
                slide.classList.add('active');
                slide.style.transform = `translateX(${baseX - 200}px)`;
                setTimeout(() => {
                    slide.style.zIndex = index;
                    slide.style.transform = `translateX(${baseX}px)`;
                }, 500);
            }
        });

        slides.forEach((slide, index) => {  
            const baseX = parseFloat(slide.dataset.baseX);

            if (index === currentIndex && index != slides.length - 1) {
                setTimeout(() => {
                    slide.classList.add('active');
                    slide.style.transform = `translateX(${baseX - 200}px)`;
                }, 500);
                setTimeout(() => {
                    slide.style.zIndex = '7';
                }, 1000);

                setTimeout(() => {
                    slide.style.transform = `translateX(${baseX}px)`;
                }, 1000);
            }
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
        
        avatar.addEventListener('mouseenter', () => {
            const index = avatar.dataset.index;
            const activeSlide = slides[index];
            infoName.textContent = activeSlide.dataset.name;
            infoRole.textContent = activeSlide.dataset.role;
            personInfo.style.visibility = 'visible';
            const x = -200 + (80 * index);
            personInfo.style.transform = `translateY(10px) translateX(${x}px)`;
            personInfo.style.opacity = '1';
        });

        avatar.addEventListener('mouseleave', () => {
            personInfo.style.visibility = 'hidden';
            personInfo.style.opacity = '0';
        });
    });
});
