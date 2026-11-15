/* =========================================================
   Naira Credit Academy — demo-backend.js
   DEMO ONLY. Mimics the Apps Script API inside the browser so you
   can preview the site with no backend. It contains a copy of the
   Week 1 answer key, so DELETE THIS FILE (and its <script> tag in
   index.html) before you go live. app.js ignores it as soon as
   CONFIG.API_URL is set.
   ========================================================= */
(function () {
  'use strict';
  const KEY = 'nca-demo-db';
  const QUIZ_PASS = 70, EXAM_PASS = 75, MAX = 3, COOLDOWN = 24 * 3600e3, GRACE = 3 * 60e3;
  const ANSWERS = { 'W1-T1': 'bcdca', 'W1-T2': 'bcacd', 'W1-T3': 'abcda', 'W1-EXAM': 'bccaaddacaabdcd' };

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const save = (db) => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString(); };
  const uid = () => 'NCA-' + Math.random().toString(36).slice(2, 10).toUpperCase();

  function db() {
    let d = load();
    if (!d) {
      d = { users: [{ UserID: 'NCA-DEMO0001', FullName: 'Adaeze Okonkwo', Email: 'demo@academy.ng', Password: 'password123', CohortStartDate: today(), Status: 'Active', CertificateIssued: '' }], sessions: {}, progress: {}, exams: {} };
      save(d);
    }
    return d;
  }
  const ok = (data) => Promise.resolve({ ok: true, data });
  const err = (error, code) => Promise.resolve({ ok: false, error, code: code || 'RULE' });
  const pub = (u, d) => ({ userId: u.UserID, fullName: u.FullName, email: u.Email, cohortStartDate: u.CohortStartDate, currentWeek: 1, cumulativeScore: cum(u, d), status: u.Status, certificateIssued: u.CertificateIssued });

  function cum(u, d) {
    const p = d.progress[u.UserID] || {};
    const v = Object.values(p).map((x) => x.best).filter((x) => x != null);
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : 0;
  }
  function topicIds(week) { return Object.keys(ANSWERS).map((a) => a.match(/^W(\d+)-(T\d+)$/)).filter((m) => m && +m[1] === week).map((m) => m[2]); }
  function grade(aid, answers) {
    const key = ANSWERS[aid]; if (!key) return null;
    const results = {}; let got = 0;
    key.split('').forEach((c, i) => { const q = aid + '-Q' + (i + 1); results[q] = (answers || {})[q] === c; if (results[q]) got++; });
    return { score: Math.round((got / key.length) * 1000) / 10, results };
  }
  function examState(p) {
    p = p || {};
    const passed = p.best != null && p.best >= EXAM_PASS, attempts = p.attempts || 0;
    let cd = null;
    if (!passed && p.lastAt && p.last != null && p.last < EXAM_PASS && attempts < MAX && p.lastAt + COOLDOWN > Date.now()) cd = new Date(p.lastAt + COOLDOWN).toISOString();
    return { best: p.best == null ? null : p.best, attempts, passed, cooldownUntil: cd, attemptsLeft: passed ? null : Math.max(0, MAX - attempts) };
  }
  function state(u, d) {
    const p = d.progress[u.UserID] || {}, now = Date.now(), weeks = [];
    for (let w = 1; w <= 8; w++) {
      const at = new Date(new Date(u.CohortStartDate).getTime() + (w - 1) * 7 * 86400e3);
      const topics = {};
      Object.keys(p).forEach((k) => { const [m, t] = k.split('|'); if (m === 'W' + w && t !== 'EXAM') topics[t] = { best: p[k].best, attempts: p[k].attempts, passed: p[k].best >= QUIZ_PASS }; });
      const exam = examState(p['W' + w + '|EXAM']);
      const prevPassed = w === 1 || weeks[w - 2].exam.passed;
      weeks.push({ week: w, unlockAt: at.toISOString(), timeOpen: now >= at.getTime(), prevPassed, open: now >= at.getTime() && prevPassed, topics, exam });
    }
    const final = examState(p['FINAL|EXAM']);
    final.open = weeks[7].timeOpen && weeks.every((w) => w.exam.passed);
    final.reason = !weeks[7].timeOpen ? 'The final exam opens with Week 8.' : 'Pass all eight module exams to unlock the final exam.';
    return { weeks, final };
  }
  function me(d, token) { const id = d.sessions[token]; return id && d.users.find((u) => u.UserID === id); }

  const H = {
    register(b, d) {
      const email = (b.email || '').toLowerCase();
      if (d.users.find((u) => u.Email === email)) return err('An account with this email already exists. Sign in instead.');
      const u = { UserID: uid(), FullName: b.fullName.trim(), Email: email, Password: b.password, CohortStartDate: today(), Status: 'Active', CertificateIssued: '' };
      d.users.push(u); const t = uid() + uid(); d.sessions[t] = u.UserID; save(d);
      return ok({ token: t, user: pub(u, d) });
    },
    login(b, d) {
      const u = d.users.find((x) => x.Email === (b.email || '').toLowerCase() && x.Password === b.password);
      if (!u) return err('Email or password is incorrect.');
      const t = uid() + uid(); d.sessions[t] = u.UserID; save(d);
      return ok({ token: t, user: pub(u, d) });
    },
    logout(b, d) { delete d.sessions[b.token]; save(d); return ok({ done: true }); },
    dashboard(b, d, u) { const s = state(u, d); return ok({ serverNow: new Date().toISOString(), user: pub(u, d), cumulativeScore: cum(u, d), weeks: s.weeks, final: s.final }); },
    submitQuiz(b, d, u) {
      const week = +String(b.moduleId).slice(1), w = state(u, d).weeks[week - 1];
      if (!w || !w.open) return err('This module is still locked.');
      const order = topicIds(week), pos = order.indexOf(b.topicId);
      if (pos < 0) return err('This quiz has not been published yet.');
      if (pos > 0 && !(w.topics[order[pos - 1]] && w.topics[order[pos - 1]].passed)) return err('Pass the previous topic quiz first.');
      const g = grade(b.moduleId + '-' + b.topicId, b.answers);
      const P = (d.progress[u.UserID] = d.progress[u.UserID] || {});
      const k = b.moduleId + '|' + b.topicId, r = (P[k] = P[k] || { best: 0, attempts: 0 });
      r.attempts++; r.best = Math.max(r.best || 0, g.score); r.last = g.score; save(d);
      return ok({ score: g.score, best: r.best, passed: g.score >= QUIZ_PASS, results: g.results });
    },
    startExam(b, d, u) {
      const live = Object.values(d.exams).find((e) => e.u === u.UserID && e.examId === b.examId && e.status === 'Active' && e.exp + GRACE > Date.now());
      if (live) return ok({ sessionId: live.id, expiresAt: new Date(live.exp).toISOString(), serverNow: new Date().toISOString(), resumed: true });
      const isFinal = b.examId === 'FINAL', week = isFinal ? 8 : +b.examId.slice(1);
      const st = state(u, d), ex = isFinal ? st.final : st.weeks[week - 1].exam;
      if (!ANSWERS[isFinal ? 'FINAL' : b.examId + '-EXAM']) return err('This exam has not been published yet.');
      if (ex.attemptsLeft === 0) return err('No attempts left.', 'CLOSED');
      if (ex.cooldownUntil) return err('Retake available after the 24-hour cooldown.');
      const P = (d.progress[u.UserID] = d.progress[u.UserID] || {}), k = b.examId + '|EXAM';
      P[k] = P[k] || { best: null, attempts: 0 }; P[k].attempts++;
      const mins = isFinal ? 90 : 30, id = 'EX-' + uid();
      d.exams[id] = { id, u: u.UserID, examId: b.examId, exp: Date.now() + mins * 60e3, status: 'Active', chunks: 0, events: [] };
      save(d);
      return ok({ sessionId: id, expiresAt: new Date(d.exams[id].exp).toISOString(), serverNow: new Date().toISOString(), durationMin: mins, resumed: false });
    },
    uploadChunk(b, d) {
      // The demo discards the video (no Drive here) but counts the clips so you can see the uploader working.
      const e = d.exams[b.sessionId]; if (e) { e.chunks++; save(d); }
      return new Promise((r) => setTimeout(() => r({ ok: true, data: { fileId: 'demo-' + b.index } }), 400));
    },
    logProctor(b, d) { const e = d.exams[b.sessionId]; if (e) { e.events.push([Date.now(), b.event, b.detail]); save(d); } return ok({ logged: true }); },
    heartbeat() { return ok({ serverNow: new Date().toISOString() }); },
    submitExam(b, d, u) {
      const e = d.exams[b.sessionId];
      if (!e || e.status !== 'Active') return err('This exam has already been submitted.', 'CLOSED');
      e.status = 'Submitted';
      const g = grade(e.examId === 'FINAL' ? 'FINAL' : e.examId + '-EXAM', b.answers);
      const r = d.progress[u.UserID][e.examId + '|EXAM'];
      r.best = Math.max(r.best || 0, g.score); r.last = g.score; r.lastAt = Date.now();
      const passed = g.score >= EXAM_PASS;
      if (e.examId === 'FINAL' && passed) u.Status = 'Eligible';
      save(d);
      return ok({ score: g.score, passed, flagged: /^grace/.test(b.reason || '') || (b.disconnectCount || 0) >= 3, attemptsLeft: passed ? 0 : Math.max(0, MAX - r.attempts) });
    }
  };

  window.DemoBackend = {
    handle(body) {
      const h = H[body.action];
      if (!h) return err('Unknown action.');
      // Read the store at the moment of handling so overlapping calls never save stale data.
      return new Promise((r) => setTimeout(r, 180)).then(() => {
        const d = db();
        if (body.action === 'register' || body.action === 'login') return h(body, d);
        const u = me(d, body.token);
        if (!u) return err('Please sign in.', 'AUTH');
        return h(body, d, u);
      });
    },
    reset() { localStorage.removeItem(KEY); }
  };
})();
