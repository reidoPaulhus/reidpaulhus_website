document.addEventListener("DOMContentLoaded", function() {
  const root = document.querySelector("body, html");
  const container = document.querySelector('.gg-container');
  if (!container) return; // Exit if container doesn't exist on this page

  const images = container.querySelectorAll(".gg-box > img");
  const l = images.length;

  for(var i = 0; i < l; i++) {
    images[i].addEventListener("click", function() {
      var currentImg = this;
      const parentItem = currentImg.parentElement, screenItem = document.createElement('div');
      screenItem.id = "gg-screen";
      container.prepend(screenItem);
      if (parentItem.hasAttribute('data-theme')) screenItem.setAttribute("data-theme", "dark");
      var route = currentImg.src;
      root.style.overflow = 'hidden';
      screenItem.innerHTML = '<div class="gg-image"></div><div class="gg-close gg-btn-close"><div class="gg-prev gg-btn">&larr;</div><div class="gg-next gg-btn">&rarr;</div></div>';
      const first = images[0].src, last = images[l-1].src;
      const imgItem = document.querySelector(".gg-image"), prevBtn = document.querySelector(".gg-prev"), nextBtn = document.querySelector(".gg-next"), close = document.querySelector(".gg-close");
      imgItem.innerHTML = '<img src="' + route + '">';

      if (l > 1) {
        if (route == first) {
          prevBtn.hidden = true;
          var nextImg = currentImg.nextElementSibling;
        } else if (route == last) {
          nextBtn.hidden = true;
          var prevImg = currentImg.previousElementSibling;
        } else {
          var prevImg = currentImg.previousElementSibling;
          var nextImg = currentImg.nextElementSibling;
        }
      } else {
        prevBtn.hidden = true;
        nextBtn.hidden = true;
      }

      screenItem.addEventListener("click", function(e) {
        if (e.target == this || e.target == close) hide();
      });

      root.addEventListener("keydown", function(e) {
        if (e.keyCode == 37 || e.keyCode == 38) prev();
        if (e.keyCode == 39 || e.keyCode == 40) next();
        if (e.keyCode == 27) hide();
      });

      prevBtn.addEventListener("click", prev);
      nextBtn.addEventListener("click", next);

      function prev() {
        var prevImg = currentImg.previousElementSibling;
        if (!prevImg) return;
        imgItem.innerHTML = '<img src="' + prevImg.src + '">';
        currentImg = prevImg;
        var mainImg = document.querySelector(".gg-image > img").src;
        nextBtn.hidden = false;
        prevBtn.hidden = mainImg === first;
      };

      function next() {
        var nextImg = currentImg.nextElementSibling;
        if (!nextImg) return;
        imgItem.innerHTML = '<img src="' + nextImg.src + '">';
        currentImg = nextImg;
        var mainImg = document.querySelector(".gg-image > img").src;
        prevBtn.hidden = false;
        nextBtn.hidden = mainImg === last;
      };

      function hide() {
        root.style.overflow = 'auto';
        screenItem.remove();
      };
    });
  }
});

function gridGallery (options) {
  let selector = document.querySelector(options.selector || '.gg-container');
  if (!selector) return;
  if (options.darkMode) selector.setAttribute("data-theme", "dark");
  if (options.layout == "horizontal" || options.layout == "square") selector.setAttribute("data-layout", options.layout);
  if (options.gaplength) selector.style.setProperty('--gap-length', options.gaplength + 'px');
  if (options.rowHeight) selector.style.setProperty('--row-height', options.rowHeight + 'px');
  if (options.columnWidth) selector.style.setProperty('--column-width', options.columnWidth + 'px');
}