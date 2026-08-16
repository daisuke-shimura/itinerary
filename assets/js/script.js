// モーダルの開閉処理（そのまま）
function openModal(modalId) {
  document.getElementById(modalId).classList.add('is-active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  let currentPage = 0; // 今開いているページの番号（0が1ページ目）

  // 指定したページを表示する関数
  function showPage(index) {
    // 一旦すべてのページを非表示にする
    pages.forEach(page => page.classList.remove('is-active'));
    // 目的のページだけを表示する
    pages[index].classList.add('is-active');

    // プルダウンの表示も合わせる
    document.getElementById('page-selector').value = index;

    // ページ遷移したときに画面の一番上に戻るようにする（スマホで読みやすくするため）
    window.scrollTo(0, 0);
  }

  // 最初に1ページ目を表示
  if (pages.length > 0) {
    showPage(currentPage);
  }

  // プルダウン（目次）の生成
  const pageSelector = document.getElementById('page-selector');
  const totalPagesSpan = document.getElementById('total-pages');
  totalPagesSpan.textContent = `/ ${pages.length}`;

  for (let i = 0; i < pages.length; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = (i + 1);
    pageSelector.appendChild(option);
  }

  // プルダウンを変更したときの遷移
  pageSelector.addEventListener('change', (e) => {
    currentPage = parseInt(e.target.value, 10);
    showPage(currentPage);
  });

  // 前へボタン
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  // 次へボタン
  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  // 目次リンク（.toc-item）からの遷移
  const tocItems = document.querySelectorAll('.toc-item');
  tocItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = parseInt(item.getAttribute('data-page'), 10);
      showPage(currentPage);
    });
  });
});
