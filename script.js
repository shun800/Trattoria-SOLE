/* ==========================================
   Trattoria SOLE - メインスクリプト
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- ハンバーガーメニュー制御 --- */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // ナビリンク押下でメニューを閉じる
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  /* --- ヘッダー スクロール時の背景変化 --- */
  const header = document.querySelector('.header');

  if (header) {
    const onScroll = () => {
      // 50px以上スクロールしたら背景を付ける
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // 初期状態もチェック（ページ途中でリロードした場合）
  }

  /* --- スクロールアニメーション（IntersectionObserver） --- */
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 一度表示したら監視解除
        }
      });
    }, {
      threshold: 0.15, // 要素の15%が見えたら発火
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  /* --- 予約フォーム バリデーション --- */
  const reserveForm = document.getElementById('reserveForm');

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault(); // デフォルト送信を防止

      // 全エラーをリセット
      document.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('has-error');
      });

      let isValid = true;

      // バリデーションルール定義
      const rules = [
        { id: 'date',    msg: 'ご希望日は必須項目です' },
        { id: 'time',    msg: 'ご希望時間を選択してください' },
        { id: 'guests',  msg: '人数を選択してください' },
        { id: 'name',    msg: 'お名前は必須項目です' },
        { id: 'phone',   msg: 'お電話番号は必須項目です', pattern: /^[0-9\-]+$/, patternMsg: '電話番号は数字とハイフンのみで入力してください' },
        { id: 'email',   msg: 'メールアドレスは必須項目です', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: 'メールアドレスの形式が正しくありません' },
        { id: 'course',  msg: 'コースを選択してください' },
      ];

      rules.forEach(rule => {
        const field = document.getElementById(rule.id);
        if (!field) return;

        const value = field.value.trim();
        const group = field.closest('.form-group');
        const errorEl = group.querySelector('.form-error');

        // 必須チェック
        if (!value) {
          group.classList.add('has-error');
          if (errorEl) errorEl.textContent = rule.msg;
          isValid = false;
          return;
        }

        // パターンチェック（電話番号・メールアドレス）
        if (rule.pattern && !rule.pattern.test(value)) {
          group.classList.add('has-error');
          if (errorEl) errorEl.textContent = rule.patternMsg;
          isValid = false;
        }
      });

      // バリデーション成功 → 完了ダイアログ表示
      if (isValid) {
        alert('ご予約を承りました。\n確認メールをお送りいたしますので、しばらくお待ちください。\n\nTrattoria SOLE');
        reserveForm.reset();
      }
    });
  }
});
