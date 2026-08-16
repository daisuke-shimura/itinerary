function openModal(modalId) {
  document.getElementById(modalId).classList.add('is-active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function() {
  const pageFlip = new St.PageFlip(document.getElementById('book'), {
    width: 794,
    height: 1123,
    size: "fixed",
    showCover: false,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0,
    swipeDistance: 80,
    clickEventForward: true,
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  function resizeBook() {
    const wrapper = document.getElementById('book-wrapper');
    const bookWidth = 794;
    const screenWidth = window.innerWidth;

    let scale = (screenWidth - 20) / bookWidth;
    if (scale > 1) scale = 1;

    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.height = `${1123 * scale}px`;
  }

  window.addEventListener('resize', resizeBook);
  resizeBook();

  const pageSelector = document.getElementById('page-selector');
  const totalPagesSpan = document.getElementById('total-pages');
  const totalPages = pageFlip.getPageCount();

  totalPagesSpan.textContent = `/ ${totalPages}`;

  for (let i = 0; i < totalPages; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = (i + 1);
    pageSelector.appendChild(option);
  }

  pageFlip.on('flip', (e) => {
    pageSelector.value = e.data; 
  });

  pageSelector.addEventListener('change', (e) => {
    const targetPage = parseInt(e.target.value, 10);
    pageFlip.flip(targetPage);
  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    const current = pageFlip.getCurrentPageIndex();
    if (current > 0) {
      pageFlip.flip(current - 1);
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();
    if (current < total - 1) {
      pageFlip.flip(current + 1);
    }
  });

  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = parseInt(item.getAttribute('data-page'), 10);
      pageFlip.flip(targetPage); 
    });
  });

  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    iframe.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
  });

  document.getElementById('book').addEventListener('click', (e) => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    if (clickX > screenWidth * 0.2 && clickX < screenWidth * 0.8) {
      e.stopPropagation(); 
      e.preventDefault();
    }
  }, true);
});
