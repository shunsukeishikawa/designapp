(function () {
  const state = {
    questionIndex: 0,
    answers: [], // answers[i] = { axis: 'personal'|'emotion', score: number }
  };

  const els = {
    startButton: document.getElementById('start-button'),
    progressDots: document.getElementById('progress-dots'),
    questionNumber: document.getElementById('question-number'),
    questionText: document.getElementById('question-text'),
    questionChoices: document.getElementById('question-choices'),
    backButton: document.getElementById('back-button'),
    resultType: document.getElementById('result-type'),
    resultTagline: document.getElementById('result-tagline'),
    resultName: document.getElementById('result-name'),
    resultBadge: document.getElementById('result-badge'),
    resultPoints: document.getElementById('result-points'),
    resultOthersLabel: document.getElementById('result-others-label'),
    resultOthersButtons: document.getElementById('result-others-buttons'),
    aboutTitle: document.getElementById('about-title'),
    aboutBody: document.getElementById('about-body'),
    disclaimer: document.getElementById('disclaimer'),
    noteLink: document.getElementById('note-link'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    modalType: document.getElementById('modal-type'),
    modalTagline: document.getElementById('modal-tagline'),
    modalName: document.getElementById('modal-name'),
    modalBadge: document.getElementById('modal-badge'),
    modalPoints: document.getElementById('modal-points'),
  };

  function trackCount(counterKey) {
    if (!CONFIG.COUNTER_ENABLED) return;
    const name = CONFIG.COUNTER_NAMES[counterKey];
    if (!name) return;
    const url = `https://api.counterapi.dev/v2/${CONFIG.COUNTER_WORKSPACE}/${name}/up`;
    // /up はGETだがカウントを変化させる操作なのでブラウザキャッシュを必ず回避する
    fetch(url, { mode: 'cors', cache: 'no-store' }).catch(() => {});
  }

  async function showDiagnosisCount() {
    if (!CONFIG.COUNTER_ENABLED) return;
    const name = CONFIG.COUNTER_NAMES.diagnosisStart;
    if (!name) return;
    const el = document.getElementById('diagnosis-count');
    try {
      const url = `https://api.counterapi.dev/v2/${CONFIG.COUNTER_WORKSPACE}/${name}`;
      const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      const count = json.data.up_count;
      el.textContent = CONTENT.top.counterLabel.replace('{count}', count);
      el.hidden = false;
    } catch (e) {
      // 取得に失敗しても画面には出さない
    }
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  function fillStaticText() {
    document.querySelectorAll('[data-bind]').forEach((el) => {
      const path = el.getAttribute('data-bind').split('.');
      let value = CONTENT;
      for (const key of path) value = value ? value[key] : undefined;
      if (value != null) el.textContent = value;
    });
  }

  function renderQuestion(index) {
    const q = CONTENT.questions[index];

    els.progressDots.innerHTML = '';
    CONTENT.questions.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i <= index) dot.classList.add('filled');
      els.progressDots.appendChild(dot);
    });

    els.questionNumber.textContent = q.title;
    els.questionText.textContent = q.text;

    els.questionChoices.innerHTML = '';
    q.choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-key">${choice.key}</span><span>${choice.label}</span>`;
      btn.addEventListener('click', () => onAnswer(index, q.axis, choice.score));
      els.questionChoices.appendChild(btn);
    });

    showScreen('screen-question');
  }

  function onAnswer(index, axis, score) {
    state.answers[index] = { axis, score };
    if (index + 1 < CONTENT.questions.length) {
      state.questionIndex = index + 1;
      renderQuestion(state.questionIndex);
    } else {
      finishQuestions();
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

  function finishQuestions() {
    let personalTotal = 0;
    let emotionTotal = 0;
    state.answers.forEach((answer) => {
      if (answer.axis === 'personal') personalTotal += answer.score;
      if (answer.axis === 'emotion') emotionTotal += answer.score;
    });

    const axis1 = personalTotal > 0 ? 'personal' : 'group';
    const axis2 = emotionTotal > 0 ? 'emotion' : 'logic';
    const typeKey = CONTENT.matrix[`${axis1}_${axis2}`];

    renderResult(typeKey);
    showScreen('screen-result');
  }

  function fillResultInto(typeKey, refs) {
    const result = CONTENT.results[typeKey];
    refs.type.textContent = result.title;
    refs.tagline.textContent = result.tagline;
    refs.name.textContent = result.name;
    refs.badge.style.setProperty('--badge-color', result.color);
    refs.points.innerHTML = '';
    result.points.forEach((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      refs.points.appendChild(li);
    });
  }

  function renderResult(typeKey) {
    fillResultInto(typeKey, {
      type: els.resultType,
      tagline: els.resultTagline,
      name: els.resultName,
      badge: els.resultBadge,
      points: els.resultPoints,
    });

    els.resultOthersLabel.textContent = CONTENT.common.otherTypesLabel;
    els.resultOthersButtons.innerHTML = '';
    Object.keys(CONTENT.results)
      .filter((key) => key !== typeKey)
      .forEach((key) => {
        const btn = document.createElement('button');
        btn.textContent = CONTENT.results[key].title;
        btn.addEventListener('click', () => openModal(key));
        els.resultOthersButtons.appendChild(btn);
      });

    els.aboutTitle.textContent = CONTENT.common.aboutTitle;
    els.aboutBody.textContent = CONTENT.common.aboutBody;
    els.disclaimer.textContent = CONTENT.common.disclaimer;

    els.noteLink.textContent = CONTENT.common.noteButton;
    els.noteLink.href = CONTENT.noteArticleUrl;
  }

  function openModal(typeKey) {
    fillResultInto(typeKey, {
      type: els.modalType,
      tagline: els.modalTagline,
      name: els.modalName,
      badge: els.modalBadge,
      points: els.modalPoints,
    });
    els.modalOverlay.classList.add('active');
  }

  function closeModal() {
    els.modalOverlay.classList.remove('active');
  }

  fillStaticText();
  showDiagnosisCount();

  els.startButton.addEventListener('click', () => {
    trackCount('diagnosisStart');
    state.questionIndex = 0;
    state.answers = [];
    renderQuestion(0);
  });

  els.backButton.addEventListener('click', onBack);
  els.modalClose.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
  els.noteLink.addEventListener('click', () => trackCount('noteClick'));
})();
