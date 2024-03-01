let currentIndex = 0;
const slides = document.getElementsByClassName('slide');

function showSlide(index) {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = i === index ? 'block' : 'none';
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

setInterval(nextSlide, 5000); // Change the duration (in milliseconds) between slides as needed