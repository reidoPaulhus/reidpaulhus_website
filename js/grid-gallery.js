document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll(".gg-box img");
  if (images.length === 0) return;

  let currentIndex = 0;

  // Create lightbox element directly on the body root
  const lightbox = document.createElement('div');
  lightbox.id = 'custom-lightbox';
  lightbox.style.display = 'none';
  lightbox.innerHTML = `
        <button id="lb-close" class="lb-btn" title="Close">&times;</button>
        <button id="lb-prev" class="lb-btn" title="Previous">&#10094;</button>
        <img id="lb-img" src="" alt="Gallery Preview">
        <button id="lb-next" class="lb-btn" title="Next">&#10095;</button>
    `;
  document.body.appendChild(lightbox);

  const lbImg = document.getElementById('lb-img');
  const btnClose = document.getElementById('lb-close');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');

  function showImage(index) {
    currentIndex = index;
    lbImg.src = images[currentIndex].src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function hideLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore page scrolling
  }

  // Attach click listeners to gallery thumbnails
  images.forEach((img, index) => {
    img.addEventListener('click', () => showImage(index));
  });

  // Close on clicking close button or anywhere on the dark background overlay
  btnClose.addEventListener('click', hideLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });

  // Cycle through images independently
  btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
  });

  btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src = images[currentIndex].src;
  });

  // Keyboard support (Escape to exit, Arrow keys to navigate)
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowLeft') btnPrev.click();
      if (e.key === 'ArrowRight') btnNext.click();
    }
  });
});

function gridGallery() {}