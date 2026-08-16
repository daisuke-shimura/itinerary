function openModal(modalId) {
  document.getElementById(modalId).classList.add('is-active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function() {
  function resizeBook() {
    const wrapper = document.getElementById('book-wrapper');
    if (!wrapper) return;

    const bookWidth = 794;
    const screenWidth = window.innerWidth;

    let scale = (screenWidth - 20) / bookWidth;
    if (scale > 1) scale = 1;

    wrapper.style.transformOrigin = 'top center';
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.height = `${1123 * scale}px`;
  }

  window.addEventListener('resize', resizeBook);
  resizeBook();

  const pages = document.querySelectorAll('.page');
  let currentPage = 0; 

  function showPage(index) {
    pages.forEach(page => page.classList.remove('is-active'));
    pages[index].classList.add('is-active');
    document.getElementById('page-selector').value = index;
    window.scrollTo(0, 0);
  }

  if (pages.length > 0) {
    showPage(currentPage);
  }

  const pageSelector = document.getElementById('page-selector');
  const totalPagesSpan = document.getElementById('total-pages');
  totalPagesSpan.textContent = `/ ${pages.length}`;

  for (let i = 0; i < pages.length; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = (i + 1);
    pageSelector.appendChild(option);
  }

  pageSelector.addEventListener('change', (e) => {
    currentPage = parseInt(e.target.value, 10);
    showPage(currentPage);
  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = parseInt(item.getAttribute('data-page'), 10);
      showPage(currentPage);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, select, input, iframe, .modal, .toc-item')) {
      return; 
    }

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    const edgeArea = screenWidth * 0.15; 

    if (clickX < edgeArea) {
      
      if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
      }
    } else if (clickX > screenWidth - edgeArea) {
      
      if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
      }
    }
  });
});
