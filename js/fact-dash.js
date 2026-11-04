/* ===== FACT DASH ===== */
/* Daily single-digit fact practice: quick rounds, a 60-second sprint, one-number
   practice, the fact boss, and fact maps that light up as facts are mastered.
   The facts, tips and scheduling live in js/facts.js; this file is the screens. */
/// <reference path="./types.js" />

const FactDash = (() => {
    const F = Facts;
    const SPRINT_MS = 60000;
    const NEXT_DELAY_FAST = 250;    // pause after a ⚡ answer before the next fact
    const NEXT_DELAY_SLOW = 420;
    const SPRINT_MISS_MS = 1300;    // sprint shows the right answer this long, then moves on

    let origin = 'map';             // where Back on the home screen returns to
    let gridOp = 'x';
    let familyOp = 'x';

    /**
     * @typedef {Object} FactRun
     * @property {'round'|'sprint'} mode
     * @property {'+'|'-'|'x'|'mix'} op
     * @property {number|null} family
     * @property {Fact[]} queue
     * @property {number} index
     * @property {Fact|null} fact
     * @property {number} shownAt
     * @property {'answer'|'retype'|'wait'} phase
     * @property {{fact: Fact, correct: boolean, ms: number}[]} results
     * @property {Object.<string, number>} retries
     * @property {Fact[]} mastered
     * @property {number} streak
     * @property {number} bestStreak
     * @property {boolean} reachedGoal
     * @property {number} sprintLeftMs
     * @property {number} lastTick
     * @property {number|null} rafId
     * @property {ReturnType<typeof setInterval>|null} clockId
     * @property {ReturnType<typeof setTimeout>|null} nextTimer
     * @property {string|null} lastKey
     */

    /** @type {FactRun|null} */
    let run = null;

    const $ = (/** @type {string} */ id) => document.getElementById(id);

    function escape(text) {
        return String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function guide() {
        const grade = typeof App !== 'undefined' && App.getCurrentGrade ? App.getCurrentGrade() : '3rd';
        return Story.world(grade).guide;
    }

    function modeLabel(op, family = null) {
        if (family !== null && family !== undefined) return `🎯 ${F.SYMBOL[op]} facts with ${family}`;
        return op === 'mix' ? '🔀 Mixed facts' : `${F.SYMBOL[op]} ${F.OP_NAME[op]}`;
    }

    function todayMeter() {
        const ms = F.msToday();
        const pct = Math.min(100, (ms / F.DAILY_GOAL_MS) * 100);
        const minutes = Math.min(10, Math.floor(ms / 60000));
        const streak = F.streak();
        return `
            <div class="facts-today${pct >= 100 ? ' done' : ''}">
                <div class="facts-today-head">
                    <b>Today</b>
                    <span>${pct >= 100 ? '✅ 10 / 10 min' : `${minutes} / 10 min`}</span>
                    <span>${streak > 0 ? `🔥 ${streak}-day streak` : '🔥 Start a streak!'}</span>
                </div>
                <div class="facts-meter"><div class="facts-meter-fill" style="width:${pct}%"></div></div>
            </div>`;
    }

    function guideLine() {
        const tricky = F.trickiest(3).map(f => f.text);
        if (F.goalReachedToday()) {
            return `Today's facts are DONE! 🎉 Every extra round makes you even faster.`;
        }
        if (F.msToday() === 0) {
            return `Let's warm up! Fast facts make every big problem easier. We'll start with your 6s, 7s and 8s. 💪`;
        }
        const left = Math.max(1, Math.ceil((F.DAILY_GOAL_MS - F.msToday()) / 60000));
        return `${left} more minute${left === 1 ? '' : 's'} to hit today's goal!${tricky.length ? ` Watch out for ${tricky.join(', ')}.` : ''}`;
    }

    // --- Fact maps ---------------------------------------------------------

    function gridHTML(op) {
        const stats = F.stats();
        const head = op === '-' ? n => `−${n}` : n => String(n);
        let html = `<table class="fact-grid" aria-label="${escape(F.OP_NAME[op])} fact map"><thead><tr><th class="corner">${F.SYMBOL[op]}</th>`;
        for (let c = 0; c <= 9; c++) html += `<th>${op === '-' ? c : c}</th>`;
        html += '</tr></thead><tbody>';
        for (let r = 0; r <= 9; r++) {
            html += `<tr><th>${head(r)}</th>`;
            for (let c = 0; c <= 9; c++) {
                // + and ×: row a, column b. −: row = number taken away, column = answer.
                const fact = op === '-' ? F.byKey(`-:${c}:${r}`) : F.byKey(`${op}:${r}:${c}`);
                const lv = F.levelOf(stats[fact.key]);
                const label = lv === F.MASTERED ? (op === '-' ? fact.left : fact.answer) : '';
                html += `<td class="lv-${F.LEVEL_NAME[lv]}${F.isFocus(fact) ? ' focus' : ''}" title="${escape(`${fact.text} = ${fact.answer} · ${F.LEVEL_NAME[lv]}`)}">${label}</td>`;
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        if (op === '-') html += `<p class="fact-grid-note">Rows: the number taken away. Columns: the answer. A ⭐ square shows the starting number (15 in row −7, column 8 means 15 − 7 = 8).</p>`;
        return html;
    }

    function renderHome() {
        const g = guide();
        const next = F.recommendOp();
        const boss = F.bossRecord();
        const opCard = op => {
            const c = F.counts(op);
            const pct = Math.round((c.mastered / c.total) * 100);
            return `
                <button type="button" class="facts-op" onclick="FactDash.startRound('${op}')">
                    <span class="facts-op-symbol">${F.SYMBOL[op]}</span>
                    <span class="facts-op-name">${F.OP_NAME[op]}</span>
                    <span class="facts-op-bar"><span style="width:${pct}%"></span></span>
                    <span class="facts-op-count">⭐ ${c.mastered} / ${c.total} mastered</span>
                </button>`;
        };
        $('facts-home').innerHTML = `
            <h2 class="facts-title">⚡ Fact Dash</h2>
            <p class="facts-sub">Single-digit + − × facts. Type fast, beat the ⚡ bar, light up your fact maps!</p>
            <div class="guide-bubble static">
                <span class="guide-emoji" aria-hidden="true">${g.emoji}</span>
                <span class="guide-text"><b>${escape(g.name)}:</b> ${escape(guideLine())}</span>
            </div>
            ${todayMeter()}
            <button type="button" class="btn btn-start facts-go" id="facts-go" onclick="FactDash.startRound()">▶ Start round: ${escape(modeLabel(next))}</button>
            <div class="facts-ops">
                ${F.OPS.map(opCard).join('')}
                <button type="button" class="facts-op" onclick="FactDash.startRound('mix')">
                    <span class="facts-op-symbol">🔀</span>
                    <span class="facts-op-name">Mix it up</span>
                    <span class="facts-op-count">All three, shuffled</span>
                </button>
            </div>
            <div class="facts-challenges">
                <div class="facts-challenge">
                    <div class="facts-section-title">⏱️ 60-Second Sprint</div>
                    <p>How many facts can you get in one minute?</p>
                    <div class="facts-chips">
                        ${['+', '-', 'x', 'mix'].map(op => `
                            <button type="button" class="facts-chip" onclick="FactDash.startSprint('${op}')">
                                ${op === 'mix' ? '🔀' : F.SYMBOL[op]} <small>best ${F.sprintBest(op)}</small>
                            </button>`).join('')}
                    </div>
                </div>
                <div class="facts-challenge boss">
                    <div class="facts-section-title">${Story.FACT_BOSS.emoji} Fact Boss</div>
                    <p>${escape(Story.FACT_BOSS.name)} attacks with your trickiest facts. 8 seconds per fact!</p>
                    <button type="button" class="btn btn-boss" onclick="FactDash.startBoss()">⚔️ Fight${boss.bestMs ? ` · best ${Boss.formatMs(boss.bestMs)}` : ''}</button>
                </div>
            </div>
            <div class="facts-family">
                <div class="facts-section-title">🎯 Practice one number</div>
                <div class="facts-tabs" role="tablist">
                    ${F.OPS.map(op => `<button type="button" role="tab" class="facts-tab${op === familyOp ? ' on' : ''}" aria-selected="${op === familyOp}" onclick="FactDash.setFamilyOp('${op}')">${F.SYMBOL[op]} ${F.OP_NAME[op]}</button>`).join('')}
                </div>
                <div class="facts-chips">
                    ${Array.from({ length: 10 }, (_, n) => `<button type="button" class="facts-chip num${F.FOCUS.includes(n) ? ' focus' : ''}" onclick="FactDash.startRound('${familyOp}', ${n})">${n}</button>`).join('')}
                </div>
            </div>
            <div class="facts-grids">
                <div class="facts-section-title">🗺️ Fact maps</div>
                <div class="facts-tabs" role="tablist">
                    ${F.OPS.map(op => `<button type="button" role="tab" class="facts-tab${op === gridOp ? ' on' : ''}" aria-selected="${op === gridOp}" onclick="FactDash.setGridOp('${op}')">${F.SYMBOL[op]} ${F.OP_NAME[op]}</button>`).join('')}
                </div>
                <div class="fact-grid-wrap">${gridHTML(gridOp)}</div>
                <div class="facts-legend">
                    <span><i class="lv-new"></i> new</span><span><i class="lv-learning"></i> learning</span>
                    <span><i class="lv-almost"></i> almost</span><span><i class="lv-mastered"></i> ⭐ mastered</span>
                    <span><i class="focus-key"></i> 6s, 7s, 8s</span>
                </div>
            </div>`;
    }

    // --- Playing -----------------------------------------------------------

    function playMarkup(mode, op, family) {
        return `
            <div class="fp-top">
                <button type="button" class="btn-back fp-quit" onclick="FactDash.quit()">✕ Stop</button>
                <div class="fp-progress"><div class="fp-progress-fill" id="fp-progress-fill"></div></div>
                <div class="fp-status" id="fp-status"></div>
                <div class="fp-streak" id="fp-streak"></div>
            </div>
            <div class="fp-mode">${mode === 'sprint' ? '⏱️ Sprint · ' : ''}${escape(modeLabel(op, family))}</div>
            <div class="fp-card" id="fp-card">
                <div class="fp-fact">
                    <span class="fp-num" id="fp-left"></span>
                    <span class="fp-op" id="fp-op"></span>
                    <span class="fp-num" id="fp-right"></span>
                    <span class="fp-eq">=</span>
                    <input id="fp-input" class="fp-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off" aria-label="Your answer">
                    <span class="fp-mark" id="fp-mark" aria-hidden="true"></span>
                </div>
                <div class="fp-speed" id="fp-speed" aria-hidden="true"><div class="fp-speed-fill" id="fp-speed-fill"></div><span class="fp-speed-icon">⚡</span></div>
                <div class="fp-feedback" id="fp-feedback" aria-live="polite"></div>
            </div>
            <div class="fp-toast" id="fp-toast" role="status"></div>
            <p class="fp-help">Just type the answer — it checks itself. Beat the ⚡ bar (3 seconds) to count toward ⭐ mastery. Esc to stop.</p>`;
    }

    function clearTimers() {
        if (!run) return;
        if (run.rafId) cancelAnimationFrame(run.rafId);
        if (run.clockId) clearInterval(run.clockId);
        clearTimeout(run.nextTimer);
        run.rafId = null;
        run.clockId = null;
    }

    function speedLoop() {
        if (!run || run.phase !== 'answer') return;
        const share = 1 - (performance.now() - run.shownAt) / F.FAST_MS;
        const fill = $('fp-speed-fill');
        if (!fill) return;
        fill.style.width = `${Math.max(0, share) * 100}%`;
        if (share <= 0) {
            $('fp-speed').classList.add('slow');
            run.rafId = null;
            return;
        }
        run.rafId = requestAnimationFrame(speedLoop);
    }

    function updateTop() {
        const status = $('fp-status');
        const streak = $('fp-streak');
        const fill = $('fp-progress-fill');
        if (!status) return;
        if (run.mode === 'sprint') {
            status.textContent = `⏱️ ${Math.max(0, Math.ceil(run.sprintLeftMs / 1000))}s`;
            status.classList.toggle('urgent', run.sprintLeftMs <= 10000);
            streak.textContent = `✓ ${run.results.filter(r => r.correct).length}`;
            fill.style.width = `${(Math.max(0, run.sprintLeftMs) / SPRINT_MS) * 100}%`;
        } else {
            status.textContent = `${Math.min(run.index + 1, run.queue.length)} / ${run.queue.length}`;
            streak.textContent = run.streak >= 3 ? `🔥 ${run.streak}` : '';
            fill.style.width = `${(run.index / run.queue.length) * 100}%`;
        }
    }

    function showFact() {
        if (!run) return;
        const fact = run.mode === 'sprint'
            ? F.pickSprintFact({ op: run.op, stats: F.stats(), lastKey: run.lastKey })
            : run.queue[run.index];
        run.fact = fact;
        run.lastKey = fact.key;
        run.phase = 'answer';
        $('fp-left').textContent = String(fact.left);
        $('fp-op').textContent = F.SYMBOL[fact.op];
        $('fp-right').textContent = String(fact.right);
        $('fp-feedback').innerHTML = '';
        $('fp-mark').textContent = '';
        $('fp-card').classList.remove('wrong');
        const input = /** @type {HTMLInputElement} */ ($('fp-input'));
        input.value = '';
        input.placeholder = '?';
        input.readOnly = false;
        input.className = 'fp-input';
        $('fp-speed').classList.remove('slow', 'stopped');
        updateTop();
        run.shownAt = performance.now();
        if (run.rafId) cancelAnimationFrame(run.rafId);
        run.rafId = requestAnimationFrame(speedLoop);
        input.focus({ preventScroll: true });
    }

    function toast(text) {
        const el = $('fp-toast');
        if (!el) return;
        el.textContent = text;
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
    }

    /** Count the time spent on the current fact toward today's goal. */
    function bankTime() {
        if (!run || !run.fact || !run.shownAt) return;
        const { reachedNow } = F.addTime(performance.now() - run.shownAt);
        run.shownAt = 0;
        if (reachedNow) {
            run.reachedGoal = true;
            AudioManager.fanfare();
            toast(`🎉 Today's 10 minutes are done! Keep going or take a break.`);
        }
    }

    function advance() {
        if (!run) return;
        clearTimeout(run.nextTimer);
        bankTime();
        if (run.mode === 'sprint') {
            if (run.sprintLeftMs <= 0) { endSprint(); return; }
            showFact();
            return;
        }
        run.index++;
        if (run.index >= run.queue.length) { endRound(); return; }
        showFact();
    }

    /** @param {string} value */
    function submit(value) {
        if (!run || run.phase !== 'answer') return;
        const fact = run.fact;
        const ms = performance.now() - run.shownAt;
        const correct = Number(value) === fact.answer;
        run.phase = 'wait';
        if (run.rafId) { cancelAnimationFrame(run.rafId); run.rafId = null; }
        $('fp-speed').classList.add('stopped');
        const input = /** @type {HTMLInputElement} */ ($('fp-input'));
        input.readOnly = true;

        const { before, after } = F.recordAnswer(fact, correct, ms);
        run.results.push({ fact, correct, ms });
        if (after === F.MASTERED && before !== F.MASTERED && !run.mastered.includes(fact)) run.mastered.push(fact);

        if (correct) {
            const fast = ms <= F.FAST_MS;
            run.streak++;
            run.bestStreak = Math.max(run.bestStreak, run.streak);
            input.classList.add('ok');
            $('fp-mark').textContent = fast ? '⚡' : '✓';
            $('fp-mark').className = `fp-mark ${fast ? 'fast' : 'slow'}`;
            if (fast) AudioManager.ding(); else AudioManager.pop();
            if (after === F.MASTERED && before !== F.MASTERED) toast(`⭐ ${fact.text} = ${fact.answer} is MASTERED!`);
            updateTop();
            run.nextTimer = setTimeout(advance, fast ? NEXT_DELAY_FAST : NEXT_DELAY_SLOW);
            return;
        }

        run.streak = 0;
        input.classList.add('bad');
        $('fp-card').classList.add('wrong');
        AudioManager.incorrect();
        updateTop();
        if (run.mode === 'sprint') {
            $('fp-feedback').innerHTML = `<div class="fp-answer">${escape(fact.text)} = <b>${fact.answer}</b></div>`;
            run.nextTimer = setTimeout(advance, SPRINT_MISS_MS);
            return;
        }
        // Round: show the fact and its strategy, have her type the right answer, and bring the fact back soon
        $('fp-feedback').innerHTML = `
            <div class="fp-answer">${escape(fact.text)} = <b>${fact.answer}</b></div>
            <div class="fp-tip">💡 ${escape(fact.tip)}</div>
            <div class="fp-retype">Type <b>${fact.answer}</b> to keep going ⌨️</div>`;
        const tries = run.retries[fact.key] || 0;
        if (tries < 2) {
            run.retries[fact.key] = tries + 1;
            run.queue.splice(Math.min(run.index + 4, run.queue.length), 0, fact);
        }
        input.value = '';
        input.placeholder = String(fact.answer);
        input.readOnly = false;
        input.classList.remove('bad');
        input.classList.add('retype');
        run.phase = 'retype';
        input.focus({ preventScroll: true });
    }

    function onInput() {
        if (!run) return;
        const input = /** @type {HTMLInputElement} */ ($('fp-input'));
        const digits = input.value.replace(/\D/g, '').slice(0, 3);
        if (digits !== input.value) input.value = digits;
        const need = String(run.fact.answer).length;
        if (digits.length < need) return;
        if (run.phase === 'answer') { submit(digits); return; }
        if (run.phase === 'retype') {
            if (Number(digits) === run.fact.answer) {
                run.phase = 'wait';
                input.classList.add('ok');
                AudioManager.pop();
                run.nextTimer = setTimeout(advance, NEXT_DELAY_SLOW);
            } else {
                input.classList.remove('nudge');
                void input.offsetWidth;
                input.classList.add('nudge');
                input.value = '';
            }
        }
    }

    function onKeydown(e) {
        if (!run) return;
        if (e.key === 'Escape') { e.preventDefault(); FactDash.quit(); return; }
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const value = /** @type {HTMLInputElement} */ ($('fp-input')).value;
        if (run.phase === 'answer' && value !== '') submit(value);
    }

    function startClock() {
        run.lastTick = performance.now();
        run.clockId = setInterval(() => {
            if (!run) return;
            const now = performance.now();
            const dt = now - run.lastTick;
            run.lastTick = now;
            if (document.hidden) return; // the sprint clock pauses in a background tab
            run.sprintLeftMs -= dt;
            updateTop();
            if (run.sprintLeftMs <= 0) {
                clearInterval(run.clockId);
                run.clockId = null;
                // A fact on screen when time runs out doesn't count; feedback already showing finishes first
                if (run.phase === 'answer' || run.phase === 'retype') endSprint();
            }
        }, 100);
    }

    /**
     * @param {'round'|'sprint'} mode
     * @param {'+'|'-'|'x'|'mix'} op
     * @param {number|null} family
     */
    function begin(mode, op, family) {
        stop();
        run = {
            mode, op, family,
            queue: mode === 'round' ? F.buildRound({ op, stats: F.stats(), today: F.dayNumber(), family }) : [],
            index: 0, fact: null, shownAt: 0, phase: 'wait',
            results: [], retries: {}, mastered: [],
            streak: 0, bestStreak: 0, reachedGoal: false,
            sprintLeftMs: SPRINT_MS, lastTick: 0,
            rafId: null, clockId: null, nextTimer: null, lastKey: null
        };
        $('facts-play').innerHTML = playMarkup(mode, op, family);
        const input = $('fp-input');
        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeydown);
        App.showScreen('screen-facts-play');
        AudioManager.click();
        if (mode === 'sprint') startClock();
        showFact();
    }

    // --- Summaries ---------------------------------------------------------

    function chips(facts, cls) {
        const seen = new Set();
        return facts.filter(f => !seen.has(f.key) && seen.add(f.key))
            .map(f => `<span class="fs-chip ${cls}">${escape(f.text)} = ${f.answer}</span>`).join('');
    }

    function finishCelebration() {
        if (run.reachedGoal && !F.celebratedToday()) {
            F.markCelebrated();
            setTimeout(() => { Animations.celebrate(); Animations.emojiRain(['⚡', '⭐', '🔥', '🎉']); }, 200);
            return `<div class="fs-goal">🎉 Today's 10 minutes are DONE! ${F.streak() > 1 ? `🔥 ${F.streak()}-day streak!` : 'Come back tomorrow to start a streak! 🔥'}</div>`;
        }
        return '';
    }

    function endRound() {
        const r = run;
        clearTimers();
        bankTime();
        F.noteRound(r.op);
        const answered = r.results.length;
        const correct = r.results.filter(x => x.correct).length;
        const fast = r.results.filter(x => x.correct && x.ms <= F.FAST_MS).length;
        const missed = r.results.filter(x => !x.correct).map(x => x.fact);
        const accuracy = answered ? correct / answered : 0;
        const next = r.family !== null ? r.op : F.recommendOp();
        const goalBand = finishCelebration();
        AudioManager[accuracy >= 0.9 ? 'fanfare' : 'star']();
        if (accuracy >= 0.9 && !goalBand) setTimeout(() => Animations.correctBurst(window.innerWidth / 2, window.innerHeight / 3), 150);
        $('facts-play').innerHTML = `
            <div class="fs-card">
                <div class="fs-icon">${accuracy >= 0.9 ? '🏆' : accuracy >= 0.7 ? '🌟' : '💪'}</div>
                <h2 class="fs-title">${accuracy >= 0.9 ? 'Lightning round!' : accuracy >= 0.7 ? 'Nice round!' : 'Round complete — those facts are getting stronger!'}</h2>
                <div class="fs-stats">
                    <div class="fs-stat"><b>${correct}/${answered}</b><span>right first try</span></div>
                    <div class="fs-stat"><b>${fast}</b><span>⚡ under 3 sec</span></div>
                    <div class="fs-stat"><b>${r.bestStreak}</b><span>🔥 best streak</span></div>
                </div>
                ${r.mastered.length ? `<div class="fs-row"><div class="fs-row-title">⭐ New facts mastered</div>${chips(r.mastered, 'gold')}</div>` : ''}
                ${missed.length ? `<div class="fs-row"><div class="fs-row-title">🎯 These come back next round</div>${chips(missed, 'warn')}</div>` : ''}
                ${goalBand}
                ${todayMeter()}
                <div class="fs-buttons">
                    <button type="button" class="btn btn-start" id="fs-next" onclick="FactDash.startRound('${next}'${r.family !== null ? `, ${r.family}` : ''})">▶ Next round: ${escape(modeLabel(next, r.family))}</button>
                    <button type="button" class="btn btn-success" onclick="FactDash.open()">🏠 Fact Dash</button>
                </div>
            </div>`;
        run = null;
        setTimeout(() => $('fs-next')?.focus({ preventScroll: true }), 60);
    }

    function endSprint() {
        const r = run;
        clearTimers();
        // The fact on screen when time ran out is dropped, not counted
        r.shownAt = 0;
        const correct = r.results.filter(x => x.correct).length;
        const fast = r.results.filter(x => x.correct && x.ms <= F.FAST_MS).length;
        const previous = F.sprintBest(r.op);
        const isBest = F.recordSprint(r.op, correct);
        const goalBand = finishCelebration();
        if (isBest && correct > 0) {
            AudioManager.fanfare();
            if (!goalBand) setTimeout(() => { Animations.celebrate(); Animations.emojiRain(['⏱️', '⚡', '🏆']); }, 200);
        } else {
            AudioManager.star();
        }
        $('facts-play').innerHTML = `
            <div class="fs-card">
                <div class="fs-icon">⏱️</div>
                <h2 class="fs-title">${correct} fact${correct === 1 ? '' : 's'} in 60 seconds!</h2>
                ${isBest && correct > 0 ? `<div class="boss-badge record">🏆 NEW PERSONAL BEST!${previous ? ` (old best ${previous})` : ''}</div>` : `<p class="fs-sub">Personal best: <b>${previous}</b>${correct >= previous - 2 && previous > 0 ? ' — so close!' : ''}</p>`}
                <div class="fs-stats">
                    <div class="fs-stat"><b>${correct}</b><span>✓ correct</span></div>
                    <div class="fs-stat"><b>${fast}</b><span>⚡ under 3 sec</span></div>
                    <div class="fs-stat"><b>${r.results.length - correct}</b><span>missed</span></div>
                </div>
                ${goalBand}
                ${todayMeter()}
                <div class="fs-buttons">
                    <button type="button" class="btn btn-start" id="fs-next" onclick="FactDash.startSprint('${r.op}')">⏱️ Sprint again</button>
                    <button type="button" class="btn btn-success" onclick="FactDash.open()">🏠 Fact Dash</button>
                </div>
            </div>`;
        run = null;
        setTimeout(() => $('fs-next')?.focus({ preventScroll: true }), 60);
    }

    /** Stop a round or sprint in progress (time spent so far is kept). */
    function stop() {
        if (!run) return;
        clearTimers();
        bankTime();
        run = null;
    }

    // Esc anywhere on the play screen stops (the input also handles it)
    if (typeof document !== 'undefined') {
        document.addEventListener('keydown', e => {
            if (e.key !== 'Escape' || !run) return;
            if (!$('screen-facts-play')?.classList.contains('active')) return;
            if (e.target && /** @type {HTMLElement} */ (e.target).id === 'fp-input') return;
            FactDash.quit();
        });
    }

    return {
        /** @param {'map'|'worlds'|'practice'} [from] where Back returns to */
        open(from) {
            if (from) origin = from;
            stop();
            renderHome();
            App.showScreen('screen-facts');
            setTimeout(() => $('facts-go')?.focus({ preventScroll: true }), 60);
        },

        exit() {
            AudioManager.click();
            if (origin === 'worlds') App.showWorldSelect();
            else if (origin === 'practice') App.showPracticeZone();
            else App.showMap();
        },

        /**
         * @param {'+'|'-'|'x'|'mix'} [op] defaults to the recommended operation
         * @param {number|null} [family] practice only facts with this number
         */
        startRound(op, family = null) {
            begin('round', op || F.recommendOp(), family);
        },

        /** @param {'+'|'-'|'x'|'mix'} op */
        startSprint(op) {
            begin('sprint', op, null);
        },

        startBoss() {
            stop();
            const deck = F.bossDeck({ stats: F.stats() });
            let i = 0;
            const zapped = [];
            const missed = [];
            Boss.startCustom({
                theme: 'gd',
                boss: Story.FACT_BOSS,
                guide: guide(),
                maxHp: 10,
                timeLimitMs: 8000,
                bestMs: F.bossRecord().bestMs,
                draw() {
                    const fact = deck[i++ % deck.length];
                    return { type: 'input', questionText: `<span class="boss-fact-q">${fact.text} = ?</span>`, answer: fact.answer, hint3: `💡 ${fact.tip}`, factKey: fact.key };
                },
                record(isCorrect, usedMs, question) {
                    const fact = F.byKey(question.factKey);
                    F.recordAnswer(fact, isCorrect, usedMs);
                    F.addTime(usedMs);
                    (isCorrect ? zapped : missed).push(fact);
                },
                results(s) {
                    const record = F.recordBoss(s.won, s.activeMs);
                    const best = F.bossRecord().bestMs;
                    return `
                        <div class="boss-result ${s.won ? 'win' : 'lose'}">
                            <div class="boss-result-emoji" aria-hidden="true">${s.boss.emoji}</div>
                            <h2 class="results-title">${s.won ? `🏆 You beat ${escape(s.boss.name)}!` : `${escape(s.boss.name)} chomped away… this time!`}</h2>
                            <p class="results-subtitle">${s.won ? `“${escape(s.boss.win)}”` : `You knocked off <b>${s.maxHp - Math.max(0, s.hp)}</b> of ${s.maxHp} HP.`}</p>
                            ${s.won && s.hearts === Boss.MAX_HEARTS ? '<div class="boss-badge flawless">✨ FLAWLESS — no hearts lost!</div>' : ''}
                            ${s.won ? `
                                <div class="results-stats">
                                    <div class="stat-box"><div class="stat-value">${Boss.formatMs(s.activeMs)}</div><div class="stat-label">⏱️ Time</div></div>
                                    <div class="stat-box"><div class="stat-value">${s.hearts}/${Boss.MAX_HEARTS}</div><div class="stat-label">❤️ Hearts</div></div>
                                    <div class="stat-box"><div class="stat-value">${s.crits}</div><div class="stat-label">⚡ Crits</div></div>
                                </div>
                                ${record.newRecord ? `<div class="boss-badge record">⏱️ NEW BEST TIME! (old best ${Boss.formatMs(record.previousBestMs)})</div>` : (best ? `<div class="boss-best">⏱️ Best time: ${Boss.formatMs(best)}</div>` : '')}` : ''}
                            ${zapped.length ? `<div class="fs-row"><div class="fs-row-title">⚡ Facts you zapped</div>${chips(zapped, 'gold')}</div>` : ''}
                            ${missed.length ? `<div class="fs-row"><div class="fs-row-title">🎯 Practice these</div>${chips(missed, 'warn')}</div>` : ''}
                            <div class="results-buttons">
                                <button class="btn btn-boss" onclick="FactDash.startBoss()">${s.won ? '⚔️ Rematch — beat your time' : '⚔️ Try Again'}</button>
                                <button class="btn btn-success" onclick="FactDash.open()">⚡ Fact Dash</button>
                            </div>
                        </div>`;
                },
                onExit() { FactDash.open(); }
            });
        },

        quit() {
            stop();
            AudioManager.click();
            FactDash.open();
        },

        stop,

        isRunning() { return run !== null; },

        /** @param {'+'|'-'|'x'} op */
        setGridOp(op) { gridOp = op; AudioManager.click(); renderHome(); },

        /** @param {'+'|'-'|'x'} op */
        setFamilyOp(op) { familyOp = op; AudioManager.click(); renderHome(); }
    };
})();
