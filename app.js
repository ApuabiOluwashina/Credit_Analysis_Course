/* =========================================================
   Naira Credit Academy — app.js
   Frontend state, routing, quiz/exam engine, WebRTC proctoring,
   chunked Drive uploader and offline auto-save.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIG: paste your Apps Script Web App URL below.
     Leave it empty to run in demo mode (demo-backend.js).
     --------------------------------------------------------- */
  const CONFIG = {
    API_URL: '',                 // e.g. 'https://script.google.com/macros/s/AKfy.../exec'
    QUIZ_PASS: 70,
    EXAM_PASS: 75,
    CHUNK_MS: 60 * 1000,         // 1-minute WebM clips, each playable on its own
    AUTOSAVE_MS: 15 * 1000,      // exam answers saved to localStorage every 15 s
    GRACE_MS: 3 * 60 * 1000,     // 3-minute reconnection window
    HEARTBEAT_MS: 30 * 1000,
    VIDEO_BPS: 600000,           // ~4.5 MB per minute, safely under Apps Script's 50 MB limit
    CANVAS_MAX_W: 1280,
    FPS: 10
  };

  const C = window.CURRICULUM;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, area = localStorage) { try { return JSON.parse(area.getItem(k)); } catch (e) { return null; } },
    set(k, v, area = localStorage) { try { area.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k, area = localStorage) { try { area.removeItem(k); } catch (e) {} }
  };
  const ss = (() => { try { return window.sessionStorage; } catch (e) { return null; } })();

  /* ---------------- Icons ---------------- */
  const ICON = {
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    brief: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
    award: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>'
  };

  /* =========================================================
     THEME
     ========================================================= */
  const Theme = {
    toggle() {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('nca-theme', next);
      try { localStorage.setItem('nca-theme', next); } catch (e) {}
    }
  };

  /* =========================================================
     SESSION + API
     ========================================================= */
  const Session = {
    get() { return ss ? store.get('nca-session', ss) : Session._mem || null; },
    set(v) { if (ss) store.set('nca-session', v, ss); else Session._mem = v; },
    clear() { if (ss) store.del('nca-session', ss); Session._mem = null; },
    get token() { const s = Session.get(); return s && s.token; }
  };

  const API = {
    demo: !CONFIG.API_URL && !!window.DemoBackend,
    async call(action, payload = {}) {
      const body = Object.assign({ action, token: Session.token }, payload);
      let json;
      if (API.demo) {
        json = await window.DemoBackend.handle(body);
      } else {
        if (!CONFIG.API_URL) throw new Error('No API_URL set in app.js and demo-backend.js is not loaded.');
        // text/plain avoids a CORS preflight, which Apps Script cannot answer.
        const res = await fetch(CONFIG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), redirect: 'follow' });
        json = await res.json();
      }
      if (!json.ok) {
        const err = new Error(json.error || 'Request failed');
        err.code = json.code;
        if (json.code === 'AUTH') { Session.clear(); App.showAuth('Your session has expired. Please sign in again.'); }
        throw err;
      }
      return json.data;
    }
  };

  /* =========================================================
     STATE
     ========================================================= */
  const State = {
    dash: null,
    offset: 0, // serverNow - clientNow, so countdowns ignore the user's clock
    now() { return Date.now() + State.offset; },
    async refresh() {
      const d = await API.call('dashboard');
      State.offset = new Date(d.serverNow).getTime() - Date.now();
      State.dash = d;
      Nav.render();
      return d;
    },
    week(n) { return State.dash && State.dash.weeks.find((w) => w.week === n); }
  };

  /* =========================================================
     UI HELPERS
     ========================================================= */
  const UI = {
    toast(msg, isErr) {
      const t = $('#toast');
      t.textContent = msg;
      t.classList.toggle('is-err', !!isErr);
      t.classList.add('is-show');
      clearTimeout(UI._tt);
      UI._tt = setTimeout(() => t.classList.remove('is-show'), 4200);
    },
    crumb(html) { $('#crumb').innerHTML = html; },
    main(html) {
      const m = $('#main');
      m.innerHTML = '<div class="view">' + html + '</div>';
      window.scrollTo({ top: 0 });
    },
    loading() { UI.main('<div class="skeleton" style="height:180px;margin-bottom:1rem"></div><div class="skeleton" style="height:90px;margin-bottom:1rem"></div><div class="skeleton" style="height:260px"></div>'); },
    fmtCountdown(ms) {
      if (ms <= 0) return 'now';
      const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      if (d > 0) return d + 'd ' + h + 'h ' + m + 'm';
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    },
    fmtDate(iso) {
      try { return new Date(iso).toLocaleString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }) + ' WAT'; } catch (e) { return iso; }
    },
    pct(v) { return v == null || v === '' ? '--' : Math.round(Number(v)) + '%'; },
    badge(kind, text, icon) { return '<span class="badge badge--' + kind + '">' + (icon ? ICON[icon] : '') + esc(text) + '</span>'; }
  };

  // One ticker drives every countdown on the page.
  setInterval(() => {
    $$('[data-countdown]').forEach((el) => {
      const left = new Date(el.dataset.countdown).getTime() - State.now();
      el.textContent = UI.fmtCountdown(left);
      if (left <= 0 && !el.dataset.fired) { el.dataset.fired = '1'; setTimeout(() => Router.go(true), 1200); }
    });
  }, 1000);

  const isAdmin = () => !!(State.dash && State.dash.user && State.dash.user.role === 'Admin');

  /* =========================================================
     PROGRESS LOGIC (display only; the server enforces it all)
     ========================================================= */
  const Progress = {
    topicOpen(w, idx) {
      if (!w || !w.open) return false;
      if (idx === 0 || isAdmin()) return true;
      const prev = C.weeks[w.week - 1].topics[idx - 1];
      const p = w.topics[prev.id];
      return !!(p && p.passed);
    },
    allTopicsPassed(w) {
      const wk = C.weeks[w.week - 1];
      return wk.topics.every((t) => w.topics[t.id] && w.topics[t.id].passed);
    },
    weekPct(w) {
      const wk = C.weeks[w.week - 1];
      const total = wk.topics.length + 1;
      let done = wk.topics.filter((t) => w.topics[t.id] && w.topics[t.id].passed).length;
      if (w.exam && w.exam.passed) done++;
      return Math.round((done / total) * 100);
    },
    whyLocked(w) {
      if (!w.timeOpen) return { kind: 'time', text: 'Unlocks ' + UI.fmtDate(w.unlockAt) };
      if (!w.prevPassed) return { kind: 'score', text: 'Pass the Week ' + (w.week - 1) + ' exam (75%+) to unlock' };
      return null;
    }
  };

  /* =========================================================
     SIDEBAR NAV
     ========================================================= */
  const Nav = {
    render() {
      const d = State.dash;
      $('#week-nav').innerHTML = C.weeks.map((wk) => {
        const w = d && State.week(wk.week);
        const locked = !w || !w.open;
        const done = w && w.exam && w.exam.passed;
        return '<a href="#/week/' + wk.week + '" class="nav-link' + (locked ? ' is-locked' : '') + (done ? ' is-done' : '') + '" data-route="week-' + wk.week + '">' +
          '<span class="wk">' + (done ? '✓' : wk.week) + '</span><span class="nl-title">' + esc(wk.short) + '</span>' + (locked ? '<span class="lock">' + ICON.lock + '</span>' : '') + '</a>';
      }).join('');
      if (d) {
        const n = d.user.fullName || '';
        $('#avatar').textContent = n.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase() || '--';
      }
      Nav.highlight();
    },
    highlight() {
      const key = Router.key();
      $$('.nav-link').forEach((a) => a.classList.toggle('is-active', a.dataset.route === key));
    },
    open() { $('#app-view').classList.add('nav-open'); },
    close() { $('#app-view').classList.remove('nav-open'); }
  };

  /* =========================================================
     ROUTER
     ========================================================= */
  const Router = {
    parts() { return (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/'); },
    key() {
      const p = Router.parts();
      if (p[0] === 'week' || p[0] === 'lesson' || p[0] === 'quiz' || p[0] === 'case' || p[0] === 'exam') return 'week-' + p[1];
      return p[0];
    },
    async go(force) {
      if (Exam.active && !force) return; // never navigate away from a live exam
      Nav.close();
      const p = Router.parts();
      try {
        if (!State.dash || force || p[0] === 'dashboard') await State.refresh();
      } catch (e) { if (e.code !== 'AUTH') UI.main('<div class="card"><h3>Could not reach the server</h3><p>' + esc(e.message) + '</p><button class="btn btn--primary" data-action="retry">Try again</button></div>'); return; }
      Nav.highlight();
      const n = parseInt(p[1], 10), t = parseInt(p[2], 10);
      switch (p[0]) {
        case 'week': return Views.week(n);
        case 'lesson': return Views.lesson(n, t);
        case 'case': return Views.caseStudy(n, t);
        case 'quiz': return Views.quiz(n, t);
        case 'exam': return Views.examGate('W' + n);
        case 'final': return Views.examGate('FINAL');
        default: return Views.dashboard();
      }
    }
  };

  /* =========================================================
     VIEWS
     ========================================================= */
  const Views = {
    dashboard() {
      const d = State.dash, u = d.user;
      UI.crumb('<b>Dashboard</b>');
      const current = isAdmin() ? (d.weeks.find((w) => !(w.exam && w.exam.passed)) || d.weeks[7]) : (d.weeks.filter((w) => w.open).pop() || d.weeks[0]);
      const passedExams = d.weeks.filter((w) => w.exam && w.exam.passed).length;
      const quizDone = d.weeks.reduce((a, w) => a + Object.values(w.topics).filter((x) => x.passed).length, 0);
      const totalQuizzes = C.weeks.reduce((a, w) => a + w.topics.length, 0);
      const nextLocked = d.weeks.find((w) => !w.timeOpen);
      const score = Number(d.cumulativeScore) || 0;
      const circ = 2 * Math.PI * 64;
      const first = esc((u.fullName || '').split(' ')[0] || 'there');

      let certCard = '';
      if (u.status === 'Eligible' || u.status === 'Certified') {
        certCard = '<div class="card cert-card" style="margin-bottom:1.75rem">' + ICON.award +
          '<h2>' + (u.status === 'Certified' ? 'Your certificate has been sent' : 'You passed. Your certificate is on its way') + '</h2>' +
          '<p>' + (u.status === 'Certified' ? 'Check ' + esc(u.email) + ' for the PDF, issued ' + esc(u.certificateIssued || '') + '.' : 'Certificates go out at 8:00 AM WAT the morning after you pass. Look out for it in ' + esc(u.email) + '.') + '</p></div>';
      }

      const adminCard = isAdmin()
        ? '<div class="card admin-card"><div><span class="badge badge--accent">Admin test mode</span><h3 style="margin:.5rem 0 .25rem">Every module and exam is open to you</h3>' +
          '<p>No date locks, score gates, cooldowns or attempt limits. Exams are still proctored and recorded, and logged as "Admin Test". Students see the normal rules.</p></div>' +
          '<div id="reset-zone"><button class="btn btn--ghost" type="button" data-action="admin-reset">Reset my progress</button></div></div>'
        : '';
      UI.main(
        adminCard +
        '<section class="hero">' +
          '<div><p class="hero__eyebrow">Week ' + current.week + ' of 8 · Cohort started ' + esc(new Date(u.cohortStartDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })) + '</p>' +
          '<h1>Welcome back, ' + first + '.</h1>' +
          '<p>You are on <strong>' + esc(C.weeks[current.week - 1].title) + '</strong>. Topic quizzes need ' + CONFIG.QUIZ_PASS + '% and module exams need ' + CONFIG.EXAM_PASS + '% before the next stage opens.</p>' +
          '<div class="hero__actions"><a class="btn btn--accent" href="#/week/' + current.week + '">Continue Week ' + current.week + '</a>' +
          (nextLocked ? '<span class="btn btn--ghost" style="cursor:default">' + ICON.clock.replace('<svg', '<svg width="16" height="16" style="fill:none;stroke:currentColor;stroke-width:2"') + 'Week ' + nextLocked.week + ' in&nbsp;<span class="countdown" data-countdown="' + nextLocked.unlockAt + '">' + UI.fmtCountdown(new Date(nextLocked.unlockAt) - State.now()) + '</span></span>' : '') +
          '</div></div>' +
          '<div class="ring" role="img" aria-label="Cumulative score ' + Math.round(score) + ' percent">' +
            '<svg viewBox="0 0 150 150"><circle class="ring__track" cx="75" cy="75" r="64"/><circle class="ring__val" cx="75" cy="75" r="64" stroke-dasharray="' + circ + '" stroke-dashoffset="' + circ + '" data-target="' + (circ - (circ * Math.min(score, 100)) / 100) + '"/></svg>' +
            '<div class="ring__label"><strong>' + Math.round(score) + '%</strong><span>cumulative score</span></div>' +
          '</div>' +
        '</section>' +
        certCard +
        '<div class="stats">' +
          '<div class="stat stat--primary"><div class="stat__k">Current week</div><div class="stat__v">' + current.week + ' / 8</div><div class="stat__s">' + esc(C.weeks[current.week - 1].short) + '</div></div>' +
          '<div class="stat"><div class="stat__k">Topic quizzes passed</div><div class="stat__v">' + quizDone + ' / ' + totalQuizzes + '</div><div class="stat__s">Pass mark ' + CONFIG.QUIZ_PASS + '%</div></div>' +
          '<div class="stat"><div class="stat__k">Module exams passed</div><div class="stat__v">' + passedExams + ' / 8</div><div class="stat__s">Pass mark ' + CONFIG.EXAM_PASS + '%, proctored</div></div>' +
          '<div class="stat stat--accent"><div class="stat__k">Status</div><div class="stat__v">' + esc(u.status) + '</div><div class="stat__s">' + (u.status === 'Active' ? 'Final exam unlocks after Week 8' : 'Certificate stage') + '</div></div>' +
        '</div>' +
        '<div class="section-head"><h2>Your 8-week path</h2><p>Modules open every 7 days from your cohort start date, on server time.</p></div>' +
        '<div class="weeks">' + d.weeks.map(Views.weekCard).join('') + '</div>'
      );
      requestAnimationFrame(() => setTimeout(() => { const r = $('.ring__val'); if (r) r.style.strokeDashoffset = r.dataset.target; }, 60));
    },

    weekCard(w) {
      const wk = C.weeks[w.week - 1];
      const pct = Progress.weekPct(w);
      let badge;
      if (w.exam && w.exam.passed) badge = UI.badge('ok', 'Passed ' + UI.pct(w.exam.best), 'check');
      else if (w.bypassed) badge = UI.badge('accent', 'Admin unlocked');
      else if (!w.timeOpen) badge = UI.badge('lock', 'Locked', 'lock');
      else if (!w.prevPassed) badge = UI.badge('warn', 'Score locked', 'lock');
      else badge = UI.badge('info', 'In progress');
      const why = Progress.whyLocked(w);
      const meta = w.bypassed ? '<span>Students: opens ' + esc(UI.fmtDate(w.unlockAt)) + '</span><span>' + pct + '%</span>'
        : w.open ? '<span>' + wk.topics.length + ' topics · ' + wk.cases.length + ' cases</span><span>' + pct + '%</span>'
        : (why.kind === 'time' ? '<span>Opens in <span class="countdown" data-countdown="' + w.unlockAt + '">' + UI.fmtCountdown(new Date(w.unlockAt) - State.now()) + '</span></span>' : '<span>' + esc(why.text) + '</span>');
      return '<a class="week-card' + (w.open ? '' : ' is-locked') + '" href="#/week/' + w.week + '">' +
        '<div class="week-card__top"><span class="week-card__num">Week ' + w.week + '</span>' + badge + '</div>' +
        '<h3>' + esc(wk.title) + '</h3>' +
        '<div class="bar"><i style="width:' + (w.open ? pct : 0) + '%"></i></div>' +
        '<div class="week-card__meta">' + meta + '</div></a>';
    },

    lockedPanel(w) {
      const why = Progress.whyLocked(w);
      return '<div class="card locked-panel"><div class="big-lock">' + ICON.lock + '</div>' +
        '<h2>Week ' + w.week + ' is locked</h2>' +
        (why.kind === 'time'
          ? '<p>This module opens on ' + esc(UI.fmtDate(w.unlockAt)) + '.</p><span class="countdown" data-countdown="' + w.unlockAt + '">' + UI.fmtCountdown(new Date(w.unlockAt) - State.now()) + '</span><p style="color:var(--muted);font-size:.9rem">The unlock time is checked on the server, so changing your computer clock will not open it early.</p>'
          : '<p>' + esc(why.text) + '.</p><a class="btn btn--primary" href="#/week/' + (w.week - 1) + '">Go to Week ' + (w.week - 1) + '</a>') +
        '</div>';
    },

    week(n) {
      const wk = C.weeks[n - 1], w = State.week(n);
      if (!wk) return Views.dashboard();
      UI.crumb('Modules / <b>Week ' + n + '</b>');
      const head = '<div class="week-head"><p class="eyebrow">Week ' + n + (w.bypassed ? ' · <span class="badge badge--accent">Admin unlocked. Students: ' + esc(UI.fmtDate(w.unlockAt)) + '</span>' : '') + '</p><h1>' + esc(wk.title) + '</h1><p>' + esc(wk.summary) + '</p></div>';
      if (!w.open) return UI.main(head + Views.lockedPanel(w));

      const steps = wk.topics.map((t, i) => {
        const p = w.topics[t.id] || {};
        const open = Progress.topicOpen(w, i);
        const cls = p.passed ? 'is-done' : open ? 'is-open' : 'is-locked';
        const ready = t.ready !== false;
        const right = !open ? UI.badge('lock', 'Pass previous quiz', 'lock')
          : '<div style="display:flex;gap:.5rem;flex-wrap:wrap"><a class="btn btn--ghost btn--sm" href="#/lesson/' + n + '/' + (i + 1) + '">Read</a>' +
            (ready ? '<a class="btn btn--' + (p.passed ? 'ghost' : 'primary') + ' btn--sm" href="#/quiz/' + n + '/' + (i + 1) + '">' + (p.passed ? 'Retake quiz' : 'Quiz') + '</a>' : '') + '</div>';
        return '<li class="step ' + cls + '"><span class="step__dot">' + (p.passed ? ICON.check : i + 1) + '</span>' +
          '<div class="step__body"><strong>' + esc(t.id.replace('T', n + '.')) + ' ' + esc(t.title) + '</strong><span>' + (t.minutes || 15) + ' min read' +
          (p.best != null ? ' · best quiz ' + UI.pct(p.best) : '') + (ready ? '' : ' · content coming soon') + '</span></div>' + right + '</li>';
      }).join('');

      const ex = w.exam || {};
      const examReady = !!(wk.exam && wk.exam.questions && wk.exam.questions.length);
      const allPassed = Progress.allTopicsPassed(w);
      let examCta;
      if (isAdmin()) examCta = examReady ? (ex.passed ? UI.badge('ok', 'Passed with ' + UI.pct(ex.best), 'check') + '<br/><br/>' : '') + '<a class="btn btn--primary btn--block" href="#/exam/' + n + '">' + (ex.attempts ? 'Retake module exam (admin)' : 'Start module exam') + '</a>' : UI.badge('lock', 'Exam content coming soon', 'lock');
      else if (ex.passed) examCta = UI.badge('ok', 'Passed with ' + UI.pct(ex.best), 'check');
      else if (!examReady) examCta = UI.badge('lock', 'Exam content coming soon', 'lock');
      else if (!allPassed) examCta = UI.badge('lock', 'Pass all topic quizzes first', 'lock');
      else if (ex.attemptsLeft === 0) examCta = UI.badge('bad', 'No attempts left. Contact your administrator');
      else if (ex.cooldownUntil && new Date(ex.cooldownUntil) > State.now()) examCta = UI.badge('warn', 'Retake opens in ') + ' <span class="countdown" data-countdown="' + ex.cooldownUntil + '"></span>';
      else examCta = '<a class="btn btn--primary btn--block" href="#/exam/' + n + '">Start module exam</a>';

      UI.main(head +
        '<div class="grid-2"><div>' +
          '<div class="card"><h3>Topics</h3><ol class="step-list">' + steps + '</ol></div>' +
        '</div><div>' +
          '<div class="card"><h3>Case studies</h3>' + wk.cases.map((c, i) =>
            '<a class="case-link" href="#/case/' + n + '/' + (i + 1) + '"><span class="case-link__ic">' + ICON.brief + '</span><span><strong>' + esc(c.title) + '</strong><span>' + (c.ready === false ? 'Coming soon' : 'Case study ' + (i + 1)) + '</span></span></a>').join('') + '</div>' +
          '<div class="card exam-box"><h3>Module ' + n + ' exam</h3>' +
            '<ul><li>' + (wk.exam ? wk.exam.questions.length || 15 : 15) + ' questions, ' + (wk.exam ? wk.exam.durationMin : 30) + ' minutes</li><li>Pass mark ' + CONFIG.EXAM_PASS + '%</li><li>Webcam and screen recorded</li><li>Desktop or laptop only</li><li>' + (isAdmin() ? 'Admin: unlimited attempts, no cooldown' : 'Attempts used: ' + (ex.attempts || 0) + ' of 3') + '</li></ul>' +
            examCta + '</div>' +
        '</div></div>');
    },

    lesson(n, t) {
      const wk = C.weeks[n - 1], w = State.week(n), topic = wk && wk.topics[t - 1];
      if (!topic) return Views.week(n);
      UI.crumb('Week ' + n + ' / <b>' + esc(topic.title) + '</b>');
      if (!w.open) return UI.main(Views.lockedPanel(w));
      if (!Progress.topicOpen(w, t - 1)) return UI.main('<div class="card locked-panel"><div class="big-lock">' + ICON.lock + '</div><h2>Finish the previous topic first</h2><p>Score ' + CONFIG.QUIZ_PASS + '% or more on Topic ' + n + '.' + (t - 1) + ' to open this lesson.</p><a class="btn btn--primary" href="#/week/' + n + '">Back to Week ' + n + '</a></div>');
      Views.article(n, topic.id.replace('T', n + '.') + ' · ' + (topic.minutes || 15) + ' min read', topic.title, topic.html,
        topic.ready === false ? '<p>The quiz for this topic will open when the lesson is published.</p><a class="btn btn--ghost" href="#/week/' + n + '">Back to Week ' + n + '</a>'
          : '<p>Ready? You need ' + CONFIG.QUIZ_PASS + '% to unlock the next topic.</p><a class="btn btn--primary" href="#/quiz/' + n + '/' + t + '">Take the Topic ' + n + '.' + t + ' quiz</a>');
    },

    caseStudy(n, i) {
      const wk = C.weeks[n - 1], w = State.week(n), cs = wk && wk.cases[i - 1];
      if (!cs) return Views.week(n);
      UI.crumb('Week ' + n + ' / Case studies / <b>' + esc(cs.title) + '</b>');
      if (!w.open) return UI.main(Views.lockedPanel(w));
      const next = wk.cases[i] ? '<a class="btn btn--primary" href="#/case/' + n + '/' + (i + 1) + '">Next case study</a>' : '<a class="btn btn--primary" href="#/week/' + n + '">Back to Week ' + n + '</a>';
      Views.article(n, 'Case study ' + i, cs.title, cs.html, '<p>Work through the questions in the case before checking the suggested answer.</p>' + next);
    },

    article(n, meta, title, html, foot) {
      UI.main('<div class="reader__progress" id="read-prog"></div><div class="reader"><article class="article">' +
        '<div class="article-meta">' + UI.badge('accent', 'Week ' + n) + UI.badge('info', meta) + '</div>' +
        '<h1>' + esc(title) + '</h1>' + (html || '<p>This lesson is being written. Check back soon.</p>') +
        '<div class="lesson-foot">' + foot + '</div></article><aside class="reader__toc" id="toc"></aside></div>');
      const heads = $$('.article h2');
      heads.forEach((h, k) => { h.id = 'sec-' + k; });
      $('#toc').innerHTML = heads.length ? '<p>On this page</p>' + heads.map((h) => '<a href="javascript:void(0)" data-jump="' + h.id + '">' + esc(h.textContent) + '</a>').join('') : '';
      const prog = $('#read-prog');
      const onScroll = () => {
        if (!prog.isConnected) return window.removeEventListener('scroll', onScroll);
        const h = document.documentElement.scrollHeight - innerHeight;
        prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    },

    /* ---------- Topic quiz (not proctored) ---------- */
    quiz(n, t) {
      const wk = C.weeks[n - 1], w = State.week(n), topic = wk && wk.topics[t - 1];
      if (!topic) return Views.week(n);
      UI.crumb('Week ' + n + ' / ' + esc(topic.title) + ' / <b>Quiz</b>');
      if (!w.open || !Progress.topicOpen(w, t - 1) || topic.ready === false) { location.hash = '#/week/' + n; return; }
      const qs = topic.quiz;
      const key = 'nca-quiz-W' + n + '-' + topic.id;
      const saved = store.get(key) || {};
      UI.main('<div class="quiz"><div class="quiz__head"><div><p class="eyebrow" style="color:var(--primary);font-weight:900;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;margin:0">Topic quiz · ' + n + '.' + t + '</p><h2 style="margin:0">' + esc(topic.title) + '</h2></div>' +
        UI.badge('info', qs.length + ' questions · pass ' + CONFIG.QUIZ_PASS + '%') + '</div>' +
        '<form id="quiz-form">' + qs.map((q, i) => Views.question(q, 'W' + n + '-' + topic.id + '-Q' + (i + 1), i, qs.length, saved)).join('') +
        '<div class="quiz__nav"><a class="btn btn--ghost" href="#/lesson/' + n + '/' + t + '">Back to lesson</a><button class="btn btn--primary" type="submit">Submit answers</button></div></form><div id="quiz-result"></div></div>');
      const form = $('#quiz-form');
      form.addEventListener('change', () => store.set(key, Views.collect(form)));
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const answers = Views.collect(form);
        if (Object.keys(answers).length < qs.length) return UI.toast('Answer all ' + qs.length + ' questions before submitting.', true);
        const btn = form.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Grading...';
        try {
          const r = await API.call('submitQuiz', { moduleId: 'W' + n, topicId: topic.id, answers });
          store.del(key);
          $$('.q-card', form).forEach((card) => {
            const ok = r.results[card.dataset.qid];
            card.classList.add(ok ? 'is-right' : 'is-wrong');
            card.insertAdjacentHTML('beforeend', '<div class="q-flag">' + (ok ? 'Correct' : 'Not correct. Re-read the lesson section on this point.') + '</div>');
          });
          $$('input', form).forEach((i) => (i.disabled = true));
          btn.remove();
          await State.refresh();
          const nextT = wk.topics[t];
          $('#quiz-result').innerHTML = '<div class="card result ' + (r.passed ? 'is-pass' : 'is-fail') + '"><p style="margin:0">' + (r.passed ? 'You passed' : 'Not yet') + '</p><div class="result__score">' + Math.round(r.score) + '%</div>' +
            '<p>' + (r.passed ? (nextT ? 'Topic ' + n + '.' + (t + 1) + ' is now open.' : 'All topics done. The Module ' + n + ' exam is now available.') : 'You need ' + CONFIG.QUIZ_PASS + '%. Quizzes have no cooldown, so review the lesson and try again.') + ' Best score: ' + Math.round(r.best) + '%.</p>' +
            (r.passed ? '<a class="btn btn--primary" href="' + (nextT ? '#/lesson/' + n + '/' + (t + 1) : '#/week/' + n) + '">' + (nextT ? 'Next topic' : 'Go to module exam') + '</a>' : '<a class="btn btn--primary" href="#/lesson/' + n + '/' + t + '">Review lesson</a> <button class="btn btn--ghost" data-action="reload-route">Retake</button>') + '</div>';
          $('#quiz-result').scrollIntoView({ behavior: 'smooth' });
        } catch (err) { btn.disabled = false; btn.textContent = 'Submit answers'; UI.toast(err.message, true); }
      });
    },

    question(q, qid, i, total, saved, hidden) {
      return '<div class="q-card" data-qid="' + qid + '" data-idx="' + i + '"' + (hidden ? ' hidden' : '') + '><div class="q-num">Question ' + (i + 1) + ' of ' + total + '</div>' +
        '<div class="q-text">' + q.q + '</div><div class="q-opts" role="radiogroup">' +
        q.options.map((o, k) => {
          const key = 'abcdef'[k];
          return '<label class="q-opt"><input type="radio" name="' + qid + '" value="' + key + '"' + (saved[qid] === key ? ' checked' : '') + ' /><span class="q-opt__k">' + key.toUpperCase() + '</span><span>' + o + '</span></label>';
        }).join('') + '</div></div>';
    },

    collect(form) {
      const out = {};
      $$('input[type=radio]:checked', form).forEach((i) => (out[i.name] = i.value));
      return out;
    },

    /* ---------- Exam gate: device + permission checks ---------- */
    examGate(examId) {
      const isFinal = examId === 'FINAL';
      const n = isFinal ? 8 : parseInt(examId.slice(1), 10);
      const def = isFinal ? C.final : C.weeks[n - 1].exam;
      const d = State.dash;
      const st = isFinal ? d.final : (State.week(n).exam || {});
      const title = isFinal ? 'Final certification exam' : 'Module ' + n + ' exam: ' + C.weeks[n - 1].short;
      UI.crumb((isFinal ? '' : 'Week ' + n + ' / ') + '<b>' + esc(isFinal ? 'Final exam' : 'Module exam') + '</b>');

      let block = null;
      if (isAdmin()) {
        if (!def || !def.questions || !def.questions.length) block = 'This exam has not been published yet.';
      } else if (isFinal) {
        if (!st.open) block = st.reason || 'The final exam opens once Week 8 is unlocked and all eight module exams are passed.';
      } else {
        const w = State.week(n);
        if (!w.open) return UI.main(Views.lockedPanel(w));
        if (!Progress.allTopicsPassed(w)) block = 'Pass all Week ' + n + ' topic quizzes first.';
      }
      if (!isAdmin() && (!def || !def.questions || !def.questions.length)) block = block || 'This exam has not been published yet.';
      if (isAdmin()) { /* no attempt, cooldown or pass limits */ }
      else if (st.passed) block = 'You have already passed this exam with ' + UI.pct(st.best) + '.';
      else if (st.attemptsLeft === 0) block = 'You have used all 3 attempts. Please contact your programme administrator.';
      else if (st.cooldownUntil && new Date(st.cooldownUntil) > State.now()) block = 'Your retake opens in <span class="countdown" data-countdown="' + st.cooldownUntil + '"></span> (24-hour cooldown after a failed attempt).';

      const resume = Exam.findResumable(examId);
      const dev = Device.check();
      UI.main('<div class="quiz"><div class="week-head"><p class="eyebrow">' + (isFinal ? 'Week 8 · Certification' : 'Week ' + n) + '</p><h1>' + esc(title) + '</h1>' +
        '<p>' + (def ? def.questions.length : 0) + ' questions · ' + (def ? def.durationMin : 0) + ' minutes · pass mark ' + CONFIG.EXAM_PASS + '% · ' + (isAdmin() ? 'admin test attempt ' + ((st.attempts || 0) + 1) : 'attempt ' + Math.min((st.attempts || 0) + 1, 3) + ' of 3') + '</p></div>' +
        (block ? '<div class="card locked-panel"><div class="big-lock">' + ICON.lock + '</div><p>' + block + '</p><a class="btn btn--ghost" href="' + (isFinal ? '#/dashboard' : '#/week/' + n) + '">Go back</a></div>' :
        '<div class="card"><h3>Before you start</h3><p style="color:var(--muted)">This exam is proctored. Your webcam, microphone and full screen are recorded in 1-minute clips and saved to your private exam folder on Google Drive for review.</p>' +
        '<ul class="checklist" id="checks">' +
          '<li class="' + (dev.ok ? 'ok' : 'bad') + '"><span class="ck">' + (dev.ok ? ICON.check : ICON.x) + '</span>' + (dev.ok ? 'Desktop or laptop browser detected' : esc(dev.reason)) + '</li>' +
          '<li data-ck="cam"><span class="ck"></span>Webcam and microphone access</li>' +
          '<li data-ck="screen"><span class="ck"></span>Share your entire screen (not a single tab or window)</li>' +
          '<li class="' + (navigator.onLine ? 'ok' : 'bad') + '"><span class="ck">' + (navigator.onLine ? ICON.check : ICON.x) + '</span>Internet connection</li>' +
        '</ul>' +
        '<div class="callout callout--info"><span class="callout__t">If NEPA takes light or your data drops</span><p>Your answers save to this device every 15 seconds. You get a 3-minute grace period to reconnect, and the timer keeps running. Every disconnection is logged for the reviewer.</p></div>' +
        '<div class="callout callout--warn"><span class="callout__t">Rules</span><p>Stay on this tab. Keep your face in view. No phones, notes or second person in the room. Leaving the tab, stopping the screen share or covering the camera is flagged.</p></div>' +
        '<button class="btn btn--primary btn--block" id="start-exam"' + (dev.ok ? '' : ' disabled') + '>' + (resume ? 'Resume exam in progress' : 'Grant permissions and start') + '</button>' +
        '<p class="form__msg" id="exam-msg"></p></div>') + '</div>');

      const btn = $('#start-exam');
      if (btn) btn.addEventListener('click', () => Exam.begin(examId, def, title, btn));
    }
  };

  /* =========================================================
     DEVICE ENFORCEMENT
     ========================================================= */
  const Device = {
    check() {
      const md = navigator.mediaDevices;
      if (!md || typeof md.getDisplayMedia !== 'function') return { ok: false, reason: 'This browser cannot share your screen. Use Chrome, Edge or Firefox on a desktop or laptop.' };
      const uaMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent) || (navigator.userAgentData && navigator.userAgentData.mobile);
      const touchOnly = window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches;
      if (uaMobile || touchOnly) return { ok: false, reason: 'Exams must be taken on a desktop or laptop. You can keep reading lessons on your phone.' };
      if (!window.MediaRecorder) return { ok: false, reason: 'This browser cannot record video. Update Chrome, Edge or Firefox.' };
      return { ok: true };
    }
  };

  /* =========================================================
     PROCTOR: webcam + screen composited into one recording
     ========================================================= */
  const Proctor = {
    cam: null, screen: null, mixed: null, canvas: null, drawTimer: null,
    rec: null, segTimer: null, index: 0, active: false, mime: '',

    async acquire() {
      const mark = (k, ok) => { const li = $('[data-ck="' + k + '"]'); if (li) { li.className = ok ? 'ok' : 'bad'; li.querySelector('.ck').innerHTML = ok ? ICON.check : ICON.x; } };
      try {
        Proctor.cam = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: { echoCancellation: true, noiseSuppression: true } });
        mark('cam', true);
      } catch (e) { mark('cam', false); throw new Error('Camera or microphone was blocked. Allow access in the address bar and try again.'); }
      await Proctor.acquireScreen().then(() => mark('screen', true)).catch((e) => { mark('screen', false); Proctor.release(); throw e; });
    },

    async acquireScreen() {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor', frameRate: 10 }, audio: false, selfBrowserSurface: 'exclude', surfaceSwitching: 'exclude', monitorTypeSurfaces: 'include' });
      const track = s.getVideoTracks()[0];
      const surface = track.getSettings && track.getSettings().displaySurface;
      if (surface && surface !== 'monitor') { s.getTracks().forEach((t) => t.stop()); throw new Error('Please share your entire screen, not a window or a browser tab.'); }
      track.addEventListener('ended', () => Exam.onScreenLost());
      if (Proctor.screen) Proctor.screen.getTracks().forEach((t) => t.stop());
      Proctor.screen = s;
      if (Proctor.screenVid) { Proctor.screenVid.srcObject = s; Proctor.screenVid.play().catch(() => {}); }
    },

    buildMix() {
      const camVid = $('#webcam-preview');
      camVid.srcObject = Proctor.cam;
      camVid.play().catch(() => {});
      const sv = document.createElement('video');
      sv.muted = true; sv.playsInline = true; sv.srcObject = Proctor.screen; sv.play().catch(() => {});
      Proctor.screenVid = sv;
      const cv = document.createElement('canvas');
      const st = Proctor.screen.getVideoTracks()[0].getSettings();
      const sw = st.width || 1280, sh = st.height || 720, scale = Math.min(1, CONFIG.CANVAS_MAX_W / sw);
      cv.width = Math.round(sw * scale); cv.height = Math.round(sh * scale);
      const ctx = cv.getContext('2d');
      Proctor.canvas = cv;
      // setInterval (not rAF) keeps drawing when the page is in the background.
      Proctor.drawTimer = setInterval(() => {
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
        if (sv.readyState >= 2) ctx.drawImage(sv, 0, 0, cv.width, cv.height);
        const cw = Math.round(cv.width * 0.22), ch = Math.round(cw * 0.75), x = cv.width - cw - 16, y = cv.height - ch - 16;
        ctx.fillStyle = '#ff4d3a'; ctx.fillRect(x - 3, y - 3, cw + 6, ch + 6);
        if (camVid.readyState >= 2) ctx.drawImage(camVid, x, y, cw, ch);
        ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(12, 12, 360, 28);
        ctx.fillStyle = '#fff'; ctx.font = '14px Lato, Calibri, sans-serif';
        ctx.fillText(new Date(State.now()).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) + ' WAT · ' + (Exam.sessionId || ''), 20, 31);
      }, 1000 / CONFIG.FPS);
      const out = cv.captureStream(CONFIG.FPS);
      Proctor.cam.getAudioTracks().forEach((t) => out.addTrack(t));
      Proctor.mixed = out;
      const prefs = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus', 'video/webm'];
      Proctor.mime = prefs.find((m) => MediaRecorder.isTypeSupported(m)) || '';
    },

    start() { Proctor.active = true; Proctor.segment(); },

    // Each segment is a fresh MediaRecorder, so every 1-minute clip has its own WebM header and plays on its own.
    segment() {
      const parts = [];
      const rec = new MediaRecorder(Proctor.mixed, Proctor.mime ? { mimeType: Proctor.mime, videoBitsPerSecond: CONFIG.VIDEO_BPS } : { videoBitsPerSecond: CONFIG.VIDEO_BPS });
      rec.ondataavailable = (e) => { if (e.data && e.data.size) parts.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(parts, { type: Proctor.mime || 'video/webm' });
        if (blob.size) Uploader.enqueue(blob, ++Proctor.index);
        if (Proctor.active) Proctor.segment();
        else if (Proctor._done) { Proctor._done(); Proctor._done = null; }
      };
      rec.start(1000);
      Proctor.rec = rec;
      Proctor.segTimer = setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); }, CONFIG.CHUNK_MS);
    },

    stop() {
      Proctor.active = false;
      clearTimeout(Proctor.segTimer);
      return new Promise((resolve) => {
        if (Proctor.rec && Proctor.rec.state !== 'inactive') { Proctor._done = resolve; Proctor.rec.stop(); setTimeout(resolve, 4000); }
        else resolve();
      });
    },

    release() {
      clearInterval(Proctor.drawTimer);
      [Proctor.cam, Proctor.screen, Proctor.mixed].forEach((s) => s && s.getTracks().forEach((t) => t.stop()));
      Proctor.cam = Proctor.screen = Proctor.mixed = null;
      const v = $('#webcam-preview'); if (v) v.srcObject = null;
    }
  };

  /* =========================================================
     UPLOADER: sequential queue with retry + backoff
     ========================================================= */
  const Uploader = {
    queue: [], busy: false, uploaded: 0, sessionId: null,
    reset(sessionId) { Uploader.queue = []; Uploader.uploaded = 0; Uploader.sessionId = sessionId; Uploader.paint(); },
    enqueue(blob, index) { Uploader.queue.push({ blob, index, tries: 0 }); Uploader.paint(); Uploader.pump(); },
    toBase64(blob) {
      return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
    },
    async pump() {
      if (Uploader.busy) return;
      Uploader.busy = true;
      while (Uploader.queue.length) {
        if (!navigator.onLine) { await new Promise((r) => window.addEventListener('online', r, { once: true })); continue; }
        const item = Uploader.queue[0];
        try {
          const data = await Uploader.toBase64(item.blob);
          await API.call('uploadChunk', { sessionId: Uploader.sessionId, index: item.index, mime: item.blob.type, data });
          Uploader.queue.shift();
          Uploader.uploaded++;
        } catch (e) {
          item.tries++;
          await sleep(Math.min(30000, 2000 * Math.pow(2, item.tries)));
        }
        Uploader.paint();
      }
      Uploader.busy = false;
    },
    async drain(maxMs) {
      const end = Date.now() + maxMs;
      while ((Uploader.queue.length || Uploader.busy) && Date.now() < end) await sleep(500);
      return Uploader.queue.length === 0;
    },
    paint() {
      const a = $('#proctor-chunks'), b = $('#proctor-queue');
      if (a) a.textContent = Uploader.uploaded + ' clip' + (Uploader.uploaded === 1 ? '' : 's') + ' uploaded';
      if (b) b.textContent = Uploader.queue.length ? Uploader.queue.length + ' waiting to upload' : '';
    }
  };

  /* =========================================================
     EXAM ENGINE
     ========================================================= */
  const Exam = {
    active: false, examId: null, sessionId: null, expiresAt: 0, def: null,
    answers: {}, cur: 0, disconnects: 0, offlineSince: 0, graceTimer: null, graceKind: null,
    autosaveTimer: null, tickTimer: null, hbTimer: null, submitting: false,

    saveKey(examId) { return 'nca-exam-' + examId; },

    findResumable(examId) {
      const s = store.get(Exam.saveKey(examId));
      return s && s.expiresAt && new Date(s.expiresAt).getTime() > State.now() ? s : null;
    },

    async begin(examId, def, title, btn) {
      const msg = $('#exam-msg');
      btn.disabled = true; btn.textContent = 'Requesting permissions...'; msg.textContent = '';
      try {
        await Proctor.acquire();
        btn.textContent = 'Starting secure session...';
        const s = await API.call('startExam', { examId });
        Exam.examId = examId; Exam.def = def; Exam.sessionId = s.sessionId;
        Exam.expiresAt = new Date(s.expiresAt).getTime();
        State.offset = new Date(s.serverNow).getTime() - Date.now();
        const saved = store.get(Exam.saveKey(examId));
        Exam.answers = saved && saved.sessionId === s.sessionId ? saved.answers || {} : {};
        Exam.disconnects = saved && saved.sessionId === s.sessionId ? saved.disconnects || 0 : 0;
        Exam.cur = 0;
        Exam.active = true;
        Exam.persist();
        Uploader.reset(s.sessionId);
        Proctor.buildMix();
        Proctor.start();
        Exam.mount(title);
        Exam.wire();
        if (s.resumed) { UI.toast('Session resumed. Your saved answers have been restored.'); API.call('logProctor', { sessionId: Exam.sessionId, event: 'resumed', detail: '' }).catch(() => {}); }
      } catch (e) {
        Proctor.release();
        btn.disabled = false; btn.textContent = 'Grant permissions and start';
        msg.textContent = e.message;
      }
    },

    persist() {
      store.set(Exam.saveKey(Exam.examId), { sessionId: Exam.sessionId, expiresAt: new Date(Exam.expiresAt).toISOString(), answers: Exam.answers, disconnects: Exam.disconnects, savedAt: new Date().toISOString() });
    },

    qid(i) { return (Exam.examId === 'FINAL' ? 'FINAL' : Exam.examId + '-EXAM') + '-Q' + (i + 1); },

    mount(title) {
      document.body.classList.add('is-proctored');
      $('#proctor-overlay').hidden = false;
      const qs = Exam.def.questions;
      UI.crumb('<b>Exam in progress</b>');
      UI.main('<div class="quiz"><div class="quiz__head"><div><h2 style="margin:0">' + esc(title) + '</h2><small style="color:var(--muted)">Answers auto-save every 15 seconds</small></div>' +
        '<div class="quiz__progress"><small id="ans-count"></small><div class="bar"><i id="ans-bar" style="width:0"></i></div></div></div>' +
        '<div class="q-dots" id="q-dots">' + qs.map((_, i) => '<button type="button" data-goto="' + i + '">' + (i + 1) + '</button>').join('') + '</div>' +
        '<form id="exam-form">' + qs.map((q, i) => Views.question(q, Exam.qid(i), i, qs.length, Exam.answers, i !== 0)).join('') + '</form>' +
        '<div class="quiz__nav"><button class="btn btn--ghost" type="button" data-step="-1">Previous</button><div style="display:flex;gap:.5rem"><button class="btn btn--ghost" type="button" data-step="1">Next</button><button class="btn btn--primary" type="button" id="exam-submit">Submit exam</button></div></div>' +
        '<div id="exam-confirm"></div></div>');
      Exam.paint();
    },

    show(i) {
      const n = Exam.def.questions.length;
      Exam.cur = Math.max(0, Math.min(n - 1, i));
      $$('#exam-form .q-card').forEach((c) => (c.hidden = Number(c.dataset.idx) !== Exam.cur));
      Exam.paint();
    },

    paint() {
      const n = Exam.def.questions.length, done = Object.keys(Exam.answers).length;
      const ac = $('#ans-count'); if (ac) ac.textContent = done + ' of ' + n + ' answered';
      const ab = $('#ans-bar'); if (ab) ab.style.width = (done / n) * 100 + '%';
      $$('#q-dots button').forEach((b, i) => { b.classList.toggle('is-ans', !!Exam.answers[Exam.qid(i)]); b.classList.toggle('is-cur', i === Exam.cur); });
    },

    wire() {
      const form = $('#exam-form');
      form.addEventListener('change', (e) => { Exam.answers[e.target.name] = e.target.value; Exam.persist(); Exam.paint(); });
      $('#q-dots').addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) Exam.show(Number(b.dataset.goto)); });
      $$('[data-step]').forEach((b) => b.addEventListener('click', () => Exam.show(Exam.cur + Number(b.dataset.step))));
      $('#exam-submit').addEventListener('click', Exam.confirm);

      Exam.autosaveTimer = setInterval(Exam.persist, CONFIG.AUTOSAVE_MS);
      Exam.tickTimer = setInterval(Exam.tick, 1000);
      Exam.hbTimer = setInterval(() => { if (navigator.onLine) API.call('heartbeat', { sessionId: Exam.sessionId, answered: Object.keys(Exam.answers).length }).catch(() => {}); }, CONFIG.HEARTBEAT_MS);
      window.addEventListener('offline', Exam.onOffline);
      window.addEventListener('online', Exam.onOnline);
      document.addEventListener('visibilitychange', Exam.onVisibility);
      window.addEventListener('beforeunload', Exam.onUnload);
      Exam.tick();
    },

    unwire() {
      clearInterval(Exam.autosaveTimer); clearInterval(Exam.tickTimer); clearInterval(Exam.hbTimer); clearInterval(Exam.graceTimer);
      window.removeEventListener('offline', Exam.onOffline);
      window.removeEventListener('online', Exam.onOnline);
      document.removeEventListener('visibilitychange', Exam.onVisibility);
      window.removeEventListener('beforeunload', Exam.onUnload);
    },

    tick() {
      const left = Exam.expiresAt - State.now();
      const el = $('#exam-timer');
      const s = Math.max(0, Math.floor(left / 1000));
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      el.classList.toggle('is-low', s < 300);
      if (left <= 0 && !Exam.submitting) Exam.submit('time_up');
    },

    confirm() {
      const n = Exam.def.questions.length, done = Object.keys(Exam.answers).length;
      $('#exam-confirm').innerHTML = '<div class="card" style="margin-top:1rem;text-align:center"><h3>Submit your exam?</h3><p style="color:var(--muted)">' +
        (done < n ? 'You have ' + (n - done) + ' unanswered question' + (n - done === 1 ? '' : 's') + '. Unanswered questions score zero.' : 'All questions answered.') +
        '</p><div style="display:flex;gap:.5rem;justify-content:center"><button class="btn btn--ghost" type="button" id="cf-no">Keep working</button><button class="btn btn--primary" type="button" id="cf-yes">Yes, submit</button></div></div>';
      $('#cf-no').onclick = () => ($('#exam-confirm').innerHTML = '');
      $('#cf-yes').onclick = () => Exam.submit('manual');
      $('#exam-confirm').scrollIntoView({ behavior: 'smooth' });
    },

    /* ---- Grace-period handling (network and screen share) ---- */
    startGrace(kind, text) {
      if (Exam.graceKind) return;
      Exam.graceKind = kind;
      Exam.disconnects++;
      Exam.persist();
      const started = Date.now();
      $('#grace-title').textContent = kind === 'net' ? 'Connection lost' : 'Screen sharing stopped';
      $('#grace-text').textContent = text;
      $('#grace-action').hidden = kind !== 'screen';
      $('#grace-modal').hidden = false;
      const upd = () => {
        const left = CONFIG.GRACE_MS - (Date.now() - started);
        const s = Math.max(0, Math.ceil(left / 1000));
        $('#grace-count').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        if (left <= 0) { clearInterval(Exam.graceTimer); Exam.graceExpired(kind); }
      };
      upd();
      Exam.graceTimer = setInterval(upd, 500);
      Exam.graceStarted = started;
    },

    endGrace(kind) {
      if (Exam.graceKind !== kind) return;
      clearInterval(Exam.graceTimer);
      const secs = Math.round((Date.now() - Exam.graceStarted) / 1000);
      Exam.graceKind = null;
      $('#grace-modal').hidden = true;
      API.call('logProctor', { sessionId: Exam.sessionId, event: kind === 'net' ? 'reconnected' : 'screen_restored', detail: secs + 's', disconnectCount: Exam.disconnects }).catch(() => {});
      UI.toast(kind === 'net' ? 'Back online after ' + secs + 's. Carry on.' : 'Screen sharing restored.');
    },

    graceExpired(kind) {
      $('#grace-text').textContent = 'The 3-minute grace period has passed. Your saved answers will be submitted as soon as you are back online, and the attempt will be flagged for review.';
      $('#grace-action').hidden = true;
      Exam.submit(kind === 'net' ? 'grace_exceeded_network' : 'grace_exceeded_screen');
    },

    onOffline() { Exam.startGrace('net', 'Your answers are saved on this device. Reconnect within 3 minutes. The exam timer keeps running.'); },
    onOnline() { Exam.endGrace('net'); Uploader.pump(); },

    onScreenLost() {
      if (!Exam.active) return;
      API.call('logProctor', { sessionId: Exam.sessionId, event: 'screen_share_ended', detail: '' }).catch(() => {});
      Exam.startGrace('screen', 'Recording of your screen stopped. Share your entire screen again within 3 minutes to continue.');
      $('#grace-action').onclick = async () => {
        try { await Proctor.acquireScreen(); Exam.endGrace('screen'); }
        catch (e) { UI.toast(e.message, true); }
      };
    },

    onVisibility() {
      if (document.hidden && Exam.active) API.call('logProctor', { sessionId: Exam.sessionId, event: 'tab_hidden', detail: new Date().toISOString() }).catch(() => {});
    },

    onUnload(e) { if (Exam.active) { Exam.persist(); e.preventDefault(); e.returnValue = ''; } },

    async submit(reason) {
      if (Exam.submitting) return;
      Exam.submitting = true;
      Exam.persist();
      const btn = $('#exam-submit'); if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
      await Proctor.stop();
      // Wait for connectivity before grading; answers are already on disk.
      while (!navigator.onLine) await sleep(2000);
      let result = null, error = null;
      for (let i = 0; i < 4 && !result; i++) {
        try { result = await API.call('submitExam', { sessionId: Exam.sessionId, answers: Exam.answers, reason, disconnectCount: Exam.disconnects }); }
        catch (e) { error = e; if (e.code === 'CLOSED') break; await sleep(3000 * (i + 1)); }
      }
      $('#grace-modal').hidden = true;
      $('#main').querySelector('.view').innerHTML = '<div class="card result"><h3>Uploading the last recording clips...</h3><p>Please keep this tab open for a few seconds.</p></div>';
      await Uploader.drain(90 * 1000);
      Exam.unwire();
      Proctor.release();
      document.body.classList.remove('is-proctored');
      $('#proctor-overlay').hidden = true;
      Exam.active = false; Exam.submitting = false; Exam.graceKind = null;
      if (result) store.del(Exam.saveKey(Exam.examId));
      await State.refresh().catch(() => {});
      const isFinal = Exam.examId === 'FINAL';
      const n = isFinal ? 8 : parseInt(Exam.examId.slice(1), 10);
      if (!result) {
        return UI.main('<div class="card result is-fail"><h2>We could not submit your exam</h2><p>' + esc(error ? error.message : 'Unknown error') + '. Your answers are still saved on this device. Reopen the exam page when your connection is stable.</p><a class="btn btn--primary" href="#/dashboard">Dashboard</a></div>');
      }
      const pass = result.passed;
      UI.crumb('<b>Exam result</b>');
      UI.main('<div class="quiz"><div class="card result ' + (pass ? 'is-pass' : 'is-fail') + '">' + (pass && isFinal ? '<div style="color:var(--accent)">' + ICON.award.replace('<svg', '<svg width="64" height="64" style="margin:0 auto;fill:none;stroke:currentColor;stroke-width:1.5"') + '</div>' : '') +
        '<p style="margin:0">' + (pass ? 'Passed' : 'Not passed this time') + '</p><div class="result__score">' + Math.round(result.score) + '%</div>' +
        '<p>' + (pass
          ? (isFinal ? 'Congratulations. You are now marked Eligible. Your certificate will be emailed at 8:00 AM WAT tomorrow.' : (n < 8 ? (result.unlimited ? 'Admin account: Week ' + (n + 1) + ' is already open to you.' : 'Week ' + (n + 1) + ' opens on its scheduled date, and your score gate is now cleared.') : 'All module exams are done. The final exam is now open.'))
          : 'You need ' + CONFIG.EXAM_PASS + '%. ' + (result.unlimited ? 'Admin account: you can retake straight away.' : result.attemptsLeft > 0 ? 'You can retake after a 24-hour cooldown. Attempts left: ' + result.attemptsLeft + '.' : 'You have no attempts left. Your administrator will contact you.')) + '</p>' +
        (result.flagged ? '<p class="badge badge--warn">This attempt was flagged for proctor review</p>' : '') +
        '<div><a class="btn btn--primary" href="#/dashboard">Back to dashboard</a></div></div></div>');
    }
  };

  /* =========================================================
     APP BOOT + EVENTS
     ========================================================= */
  const App = {
    showAuth(msg) {
      $('#app-view').hidden = true;
      $('#auth-view').hidden = false;
      $('#demo-note').hidden = !API.demo;
      if (msg) $('#login-form .form__msg').textContent = msg;
    },
    showApp() {
      $('#auth-view').hidden = true;
      $('#app-view').hidden = false;
      UI.loading();
      Router.go(true);
    },
    netPill() {
      const p = $('#net-pill');
      p.classList.toggle('is-off', !navigator.onLine);
      p.querySelector('span').textContent = navigator.onLine ? 'Online' : 'Offline';
    }
  };

  function bindAuth() {
    $$('[data-auth-tab]').forEach((b) => b.addEventListener('click', () => {
      const tab = b.dataset.authTab;
      $$('[data-auth-tab]').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      $('#login-form').hidden = tab !== 'login';
      $('#register-form').hidden = tab !== 'register';
    }));

    const handle = (form, action) => form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form__msg');
      msg.className = 'form__msg'; msg.textContent = '';
      const data = Object.fromEntries(new FormData(form).entries());
      data.email = (data.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { msg.textContent = 'Enter a valid email address.'; return; }
      if ((data.password || '').length < 8) { msg.textContent = 'Password must be at least 8 characters.'; return; }
      if (action === 'register' && (data.fullName || '').trim().length < 3) { msg.textContent = 'Enter your full name.'; return; }
      const btn = form.querySelector('button[type=submit]'); const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Please wait...';
      try {
        const r = await API.call(action, data);
        Session.set({ token: r.token, user: r.user });
        form.reset();
        App.showApp();
      } catch (err) { msg.textContent = err.message; }
      finally { btn.disabled = false; btn.textContent = label; }
    });
    handle($('#login-form'), 'login');
    handle($('#register-form'), 'register');
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    if (a) {
      const act = a.dataset.action;
      if (act === 'toggle-theme') Theme.toggle();
      else if (act === 'open-nav') Nav.open();
      else if (act === 'close-nav') Nav.close();
      else if (act === 'retry' || act === 'reload-route') Router.go(true);
      else if (act === 'admin-reset') {
        $('#reset-zone').innerHTML = '<p style="margin:0 0 .5rem;font-size:.9rem">Delete all your quiz and exam scores?</p><button class="btn btn--ghost btn--sm" data-action="reload-route">Cancel</button> <button class="btn btn--danger btn--sm" data-action="admin-reset-yes">Yes, reset</button>';
      } else if (act === 'admin-reset-yes') {
        a.disabled = true; a.textContent = 'Resetting...';
        try { Object.keys(localStorage).filter((k) => k.indexOf('nca-quiz-') === 0 || k.indexOf('nca-exam-') === 0).forEach((k) => store.del(k)); } catch (e1) {}
        API.call('adminReset').then(() => { UI.toast('Progress reset. Start again from Week 1.'); Router.go(true); }).catch((e2) => UI.toast(e2.message, true));
      }
      else if (act === 'logout') {
        if (Exam.active) return UI.toast('Finish or submit your exam before signing out.', true);
        API.call('logout').catch(() => {});
        Session.clear(); State.dash = null; App.showAuth();
      }
    }
    const j = e.target.closest('[data-jump]');
    if (j) { e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  window.addEventListener('hashchange', () => {
    if (Exam.active) { UI.toast('Navigation is disabled during a proctored exam.', true); return; }
    Router.go();
  });
  window.addEventListener('online', App.netPill);
  window.addEventListener('offline', App.netPill);

  document.addEventListener('DOMContentLoaded', () => {
    if (!C) { document.body.innerHTML = '<p style="padding:2rem">content.js failed to load.</p>'; return; }
    bindAuth();
    App.netPill();
    if (Session.token) App.showApp(); else App.showAuth();
  });
})();
