(function () {
  const state = {
    questionIndex: 0,
    answers: [], // answers[i] = { axis: 'personal'|'emotion', score: number }
    modalOpener: null,
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    topBase: $('top-base'),
    topHero: $('top-hero'),
    startButton: $('start-button'),
    diagnosisCount: $('diagnosis-count'),
    questionBase: $('question-base'),
    questionChoices: $('question-choices'),
    backButton: $('back-button'),
    resultBase: $('result-base'),
    resultOthers: $('result-others'),
    noteLink: $('note-link'),
    modalOverlay: $('modal-overlay'),
    modalBase: $('modal-base'),
    modalClose: $('modal-close'),
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- カウンター（CounterAPI） ---------- */

  // CounterAPIのレスポンスはCDN(Cloudflare)でキャッシュされるため、
  // 毎回異なるクエリを付けてキャッシュを必ず素通りさせる。
  // (fetchのcache:'no-store'はブラウザキャッシュにしか効かない)
  function counterUrl(name, action) {
    const base = `https://api.counterapi.dev/v2/${CONFIG.COUNTER_WORKSPACE}/${name}`;
    const path = action ? `${base}/${action}` : base;
    return `${path}?t=${Date.now()}${Math.random().toString(36).slice(2)}`;
  }

  function trackCount(counterKey) {
    if (!CONFIG.COUNTER_ENABLED) return;
    const name = CONFIG.COUNTER_NAMES[counterKey];
    if (!name) return;
    fetch(counterUrl(name, 'up'), { mode: 'cors', cache: 'no-store' }).catch(() => {});
  }

  async function showDiagnosisCount() {
    if (!CONFIG.COUNTER_ENABLED) return;
    const name = CONFIG.COUNTER_NAMES.diagnosisStart;
    if (!name) return;
    try {
      const res = await fetch(counterUrl(name), { mode: 'cors', cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      const count = json.data.up_count;
      els.diagnosisCount.textContent = CONTENT.top.counterLabel.replace('{count}', count);
      els.diagnosisCount.hidden = false;
    } catch (e) {
      // 取得に失敗しても画面には出さない
    }
  }

  /* ---------- 画像ユーティリティ ---------- */

  const preloaded = new Map();
  function preload(src) {
    if (!src || preloaded.has(src)) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    preloaded.set(src, img);
  }

  function imageButton(tag, className, image, label) {
    const el = document.createElement(tag);
    el.className = `hotspot ${className}`;
    el.setAttribute('aria-label', label);
    const img = document.createElement('img');
    img.src = image;
    img.alt = '';
    el.appendChild(img);
    return el;
  }

  function setButtonImage(el, image, label) {
    el.querySelector('img').src = image;
    el.setAttribute('aria-label', label);
  }

  /* ---------- 画面遷移 ---------- */

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    window.scrollTo(0, 0);
    if (id === 'screen-top') playHero();
    else els.topHero.pause();
  }

  function playHero() {
    if (reducedMotion) return;
    const p = els.topHero.play();
    if (p && p.catch) p.catch(() => {}); // 低電力モード等で自動再生不可ならポスター画像のまま
  }

  function renderTop() {
    const top = CONTENT.top;
    els.topBase.src = top.base;
    els.topBase.alt = top.alt;
    els.topHero.poster = top.heroPoster;
    if (reducedMotion) {
      els.topHero.removeAttribute('autoplay');
      els.topHero.preload = 'none';
    }
    els.topHero.src = top.heroVideo;
    setButtonImage(els.startButton, top.startButton.image, top.startButton.label);
  }

  function renderQuestion(index) {
    const q = CONTENT.questions[index];
    els.questionBase.src = q.base;
    els.questionBase.alt = q.text;

    els.questionChoices.innerHTML = '';
    q.choices.forEach((choice, i) => {
      const btn = imageButton('button', 'choice', choice.image, `${choice.key}. ${choice.label}`);
      btn.style.setProperty('--i', i);
      btn.addEventListener('click', () => onAnswer(index, q.axis, choice.score));
      els.questionChoices.appendChild(btn);
    });

    if (index === CONTENT.questions.length - 1) preloadResultCandidates();
    showScreen('screen-question');
  }

  function onAnswer(index, axis, score) {
    state.answers[index] = { axis, score };
    state.answers.length = index + 1;
    if (index + 1 < CONTENT.questions.length) {
      state.questionIndex = index + 1;
      renderQuestion(state.questionIndex);
    } else {
      renderResult(judgeType(state.answers));
    }
  }

  function onBack() {
    if (state.questionIndex === 0) {
      showScreen('screen-top');
      return;
    }
    state.questionIndex -= 1;
    renderQuestion(state.questionIndex);
  }

  /* ---------- 判定 ---------- */

  function judgeType(answers) {
    let personalTotal = 0;
    let emotionTotal = 0;
    answers.forEach((answer) => {
      if (answer.axis === 'personal') personalTotal += answer.score;
      if (answer.axis === 'emotion') emotionTotal += answer.score;
    });
    const axis1 = personalTotal > 0 ? 'personal' : 'group';
    const axis2 = emotionTotal > 0 ? 'emotion' : 'logic';
    return CONTENT.matrix[`${axis1}_${axis2}`];
  }

  // 最後の質問を表示した時点で、ありうる結果画面だけ先読みしておく
  function preloadResultCandidates() {
    const last = CONTENT.questions[CONTENT.questions.length - 1];
    last.choices.forEach((choice) => {
      const answers = state.answers.slice(0, CONTENT.questions.length - 1)
        .concat({ axis: last.axis, score: choice.score });
      const type = judgeType(answers);
      preload(CONTENT.results[type].page);
    });
    Object.values(CONTENT.results).forEach((r) => preload(r.card));
  }

  /* ---------- 結果 ---------- */

  function renderResult(typeKey) {
    const result = CONTENT.results[typeKey];
    els.resultBase.src = result.page;
    els.resultBase.alt = `「あたり前」Jumper診断 結果 ${result.name}`;

    els.resultOthers.innerHTML = '';
    Object.keys(CONTENT.results)
      .filter((key) => key !== typeKey)
      .forEach((key, i) => {
        const other = CONTENT.results[key];
        const btn = imageButton('button', 'type-card', other.card, `${other.name}の結果を見る`);
        btn.style.setProperty('--i', i);
        btn.addEventListener('click', () => openModal(key, btn));
        els.resultOthers.appendChild(btn);
        preload(other.modal);
      });

    setButtonImage(els.noteLink, CONTENT.noteButton.image, CONTENT.noteButton.label);
    els.noteLink.href = CONTENT.noteArticleUrl;

    showScreen('screen-result');
  }

  /* ---------- モーダル ---------- */

  function openModal(typeKey, opener) {
    const result = CONTENT.results[typeKey];
    els.modalBase.src = result.modal;
    els.modalBase.alt = `${result.name}の診断結果`;
    els.modalOverlay.setAttribute('aria-label', result.name);
    els.modalOverlay.hidden = false;
    els.modalOverlay.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    state.modalOpener = opener;
    els.modalClose.focus({ preventScroll: true });
  }

  function closeModal() {
    if (els.modalOverlay.hidden) return;
    els.modalOverlay.hidden = true;
    document.documentElement.style.overflow = '';
    if (state.modalOpener) state.modalOpener.focus({ preventScroll: true });
    state.modalOpener = null;
  }

  // カード外（半透明の背景部分）をタップしたら閉じる
  // モーダル画像は左右上下24pxが透明な余白なので、その範囲も背景扱いにする
  function onOverlayClick(e) {
    if (e.target === els.modalClose || els.modalClose.contains(e.target)) return;
    const rect = els.modalBase.getBoundingClientRect();
    const u = rect.width / 390;
    const x = (e.clientX - rect.left) / u;
    const y = (e.clientY - rect.top) / u;
    const card = { left: 24, right: 366, top: 24, bottom: rect.height / u - 24 };
    if (x < card.left || x > card.right || y < card.top || y > card.bottom) closeModal();
  }

  /* ---------- 初期化 ---------- */

  renderTop();
  setButtonImage(els.backButton, CONTENT.backButton.image, CONTENT.backButton.label);
  setButtonImage(els.modalClose, CONTENT.closeButton.image, CONTENT.closeButton.label);
  showDiagnosisCount();
  playHero();

  // 質問画面の画像はトップ表示後に先読み（遷移時のチラつき防止）
  window.addEventListener('load', () => {
    CONTENT.questions.forEach((q) => {
      preload(q.base);
      q.choices.forEach((c) => preload(c.image));
    });
    preload(CONTENT.backButton.image);
  });

  els.startButton.addEventListener('click', () => {
    trackCount('diagnosisStart');
    state.questionIndex = 0;
    state.answers = [];
    renderQuestion(0);
  });

  els.backButton.addEventListener('click', onBack);
  els.modalClose.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  els.noteLink.addEventListener('click', () => trackCount('noteClick'));
})();
