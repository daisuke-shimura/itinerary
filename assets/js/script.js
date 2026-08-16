function openModal(modalId) {
  document.getElementById(modalId).classList.add('is-active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function() {
  // 1. PageFlipの初期化
  const pageFlip = new St.PageFlip(document.getElementById('book'), {
    width: 794,
    height: 1123,
    size: "fixed",
    showCover: false,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0,
    disableFlipByClick: true // 全画面でのタップめくりだけをオフ
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  // 2. 画面リサイズ対応
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

  // 3. セレクトボックス（目次）の設定
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

  // 4. 前へ・次へボタンの処理
  document.getElementById('btn-prev').addEventListener('click', () => {
    pageFlip.flipPrev();
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    pageFlip.flipNext();
  });

  // 5. 目次リンクからのページ遷移
  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = parseInt(item.getAttribute('data-page'), 10);
      pageFlip.flip(targetPage); 
    });
  });

  // -----------------------------------------------------
  // 6. ★最重要★ ライブラリの「タッチ横取り」からボタン類を守るバリア
  // -----------------------------------------------------
  const interactives = document.querySelectorAll('button, a, select, input, iframe, .modal, .toc-item');
  interactives.forEach(el => {
    // 指やマウスで触れた瞬間に「ライブラリには渡さない！」とブロックする
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    el.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
  });

  // -----------------------------------------------------
  // 7. ★自作★ 端っこ15%タップ判定（スワイプと区別する賢い処理）
  // -----------------------------------------------------
  let startX = 0;
  let startY = 0;
  const bookEl = document.getElementById('book');

  // 指を置いた場所を記録
  bookEl.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });

  // 指を離した時に判定
  bookEl.addEventListener('pointerup', (e) => {
    const endX = e.clientX;
    const endY = e.clientY;

    // 指が動いた距離が10px未満なら「スワイプではなく、ただのタップ」とみなす
    if (Math.abs(endX - startX) < 10 && Math.abs(endY - startY) < 10) {
      
      // もしボタンやマップの上をタップしていたら、めくり処理は中止
      if (e.target.closest('button, a, select, input, iframe, .modal, .toc-item')) {
        return;
      }

      const screenWidth = window.innerWidth;
      const edgeArea = screenWidth * 0.15; // 左右15%の幅

      // めっちゃ端っこならページをめくる
      if (endX < edgeArea) {
        pageFlip.flipPrev();
      } else if (endX > screenWidth - edgeArea) {
        pageFlip.flipNext();
      }
    }
  });
});
