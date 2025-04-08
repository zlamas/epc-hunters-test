document.querySelectorAll('.slider').forEach((slider) => {
    let slideWrapper = slider.querySelector('.slider__slides');
    let slides = slider.querySelectorAll('.slider__slide');

    let prevButton = slider.querySelector('.slider__prev');
    let nextButton = slider.querySelector('.slider__next');

    let currentSlide = 0;
    let slideCount = slides.length;
    let offsets = Array.prototype.map.call(
        slides,
        (slide) => slide.offsetLeft - slides[0].offsetLeft
    );
    let timeout;

    slideWrapper.scroll({ left: 0, behavior: 'instant' });

    function scrollSlider(step) {
        currentSlide += step;
        currentSlide = (currentSlide + slideCount) % slideCount;
        slides[currentSlide].scrollIntoView();
    }

    slideWrapper.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            currentSlide = Array.prototype.findIndex.call(
                offsets,
                (offset) => slideWrapper.scrollLeft <= offset
            );
        }, 100);
    });

    prevButton.addEventListener('click', () => scrollSlider(-1));
    nextButton.addEventListener('click', () => scrollSlider(1));
});
