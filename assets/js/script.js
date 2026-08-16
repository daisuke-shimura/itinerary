// モーダルの開閉処理
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

    // スマホでの動作を安定させる設定
    mobileScrollSupport: true,
    maxShadowOpacity: 0,
    
    // ライブラリ標準の「どこでもタップでめくれる機能」をオフにする
    disableFlipByClick: true
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  // 2. 画面サイズに合わせた縮小処理
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

  // 3. ページセレクター（プルダウン）の設定
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

  // 4. 前へ・次へボタンの確実な遷移処理（バグ対策版）
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

  // 5. 目次からのページ遷移
  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = parseInt(item.getAttribute('data-page'), 10);
      pageFlip.flip(targetPage); 
    });
  });

  // 6. iframe（Googleマップ等）のタッチ暴発防止
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    iframe.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
  });

  // 7. 【最終版】めっちゃ端っこ15%タップのみ遷移 ＆ 中の要素クリック許可
  document.getElementById('book').addEventListener('click', (e) => {
    // 押した場所がボタン・リンク・セレクトボックス・マップ(iframe)なら、めくりを無視
    if (e.target.closest('button, a, select, input, iframe, .modal')) {
      return; 
    }

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    const edgeArea = screenWidth * 0.15; // 左右15%を「端っこ」の判定エリアにする

    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();

    if (clickX < edgeArea) {
      // 左端15%をタップした場合は「前へ」
      if (current > 0) pageFlip.flip(current - 1);
    } else if (clickX > screenWidth - edgeArea) {
      // 右端15%をタップした場合は「次へ」
      if (current < total - 1) pageFlip.flip(current + 1);
    }
    // 真ん中付近をタップした場合は何もしない（中の要素は通常通り反応する）
  });
});
