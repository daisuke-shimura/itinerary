function openModal(modalId) {
  document.getElementById(modalId).classList.add('is-active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  let currentPage = 0; 

  function showPage(index) {
    const currentActive = document.querySelector('.page.is-active');
    if (currentActive) {
      currentActive.classList.remove('is-active');
    }
    pages[index].classList.add('is-active');

    const coverImages = pages[index].querySelectorAll('.image1, .image2');
  
    if (coverImages.length > 0) {
      coverImages.forEach(image => {
        image.style.animation = 'none';
        void image.offsetWidth; 
        image.style.animation = '';
      });
    }
  
    document.getElementById('page-selector').value = index;
    window.scrollTo(0, 0);

    const allTocItems = document.querySelectorAll('.toc-item');
    allTocItems.forEach(item => {
      item.classList.remove('is-current');
      
      if (parseInt(item.getAttribute('data-page'), 10) === index) {
        item.classList.add('is-current');
      }
    });
  }

  if (pages.length > 0) {
    showPage(currentPage);
  }

  // セレクトボックスの生成
  const pageSelector = document.getElementById('page-selector');
  const totalPagesSpan = document.getElementById('total-pages');
  totalPagesSpan.textContent = `/ ${pages.length}`;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < pages.length; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = (i + 1);
    fragment.appendChild(option);
  }
  pageSelector.appendChild(fragment);

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


  // ハンバーガーメニュー
  const btnHamburger = document.getElementById('btn-hamburger');
  const btnCloseToc = document.getElementById('btn-close-toc');
  const tocSidebar = document.getElementById('toc-sidebar');
  const tocOverlay = document.getElementById('toc-overlay');

  function closeToc() {
    if(tocSidebar) tocSidebar.classList.remove('is-open');
    if(tocOverlay) tocOverlay.classList.remove('is-active');
  }

  if(btnHamburger) {
    btnHamburger.addEventListener('click', () => {
      tocSidebar.classList.add('is-open');
      tocOverlay.classList.add('is-active');
    });
  }

  if(btnCloseToc) btnCloseToc.addEventListener('click', closeToc);
  if(tocOverlay) tocOverlay.addEventListener('click', closeToc);

  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = parseInt(item.getAttribute('data-page'), 10);
      showPage(currentPage);
      closeToc();
    });
  });


  // 画面端のクリック
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, select, input, iframe, .modal, .toc-item, .hamburger-btn, .toc-overlay')) {
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/itinerary/sw.js')
      .then((registration) => {
        console.log('ServiceWorker の登録が成功しました', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker の登録に失敗しました', error);
      });
  });
}
