/* ===== BOSS BATTLES ===== */
/* A timed fight against a unit's boss. Each question gets one try:
     - right answer  → the boss loses 1 HP (2 HP for a fast ⚡ critical hit)
     - wrong / time's up → Valerie loses a heart and sees the right answer
   Win before the hearts run out to earn the world's collectible, a story chapter,
   and the next unit. Wins record a best time to race against on rematches.
   Reuses the exercise screen and Engine's question rendering. */
/// <reference path="./types.js" />

const Boss = (() => {
    const BOSS_HP = 8;
    const MAX_HEARTS = 3;
    const CRIT_SHARE = 0.4;           // answer within the first 40% of the timer → critical hit
    const TIME_CHOICE_MS = 30000;     // multiple choice and true/false
    const TIME_TYPED_MS = 60000;      // typed answers and click-to-build questions
    const WARN_MS = 5000;             // timer turns red and ticks
    const HIT_ADVANCE_MS = 1300;      // after a hit, the next question comes automatically

    /**
     * @typedef {Object} Battle
     * @property {MathUnit} unit
     * @property {{name: string, emoji: string, intro: string, win: string, chapter: {title: string, text: string}}} boss
     * @property {{name: string, emoji: string}} guide
     * @property {'3rd'|'4th'} grade
     * @property {ExerciseDefinition[]} exercises
     * @property {number[]} deck shuffled exercise indexes still to draw
     * @property {number} lastIndex
     * @property {number} hp
     * @property {number} hearts
     * @property {number} activeMs time spent answering (feedback pauses excluded)
     * @property {number} limitMs
     * @property {number} remainingMs
     * @property {number} lastTick
     * @property {number|null} lastWarnSecond
     * @property {ReturnType<typeof setInterval>|null} timerId
     * @property {ReturnType<typeof setTimeout>|null} advanceTimer
     * @property {number} token bumps on every question so stale clicks/timeouts are ignored
     * @property {ExerciseQuestion|null} question
     * @property {string|null} skillId
     * @property {boolean} over
     * @property {number} correct
     * @property {number} crits
     */

    /** @type {Battle|null} */
    let battle = null;

    const $ = (/** @type {string} */ id) => document.getElementById(id);

    function escape(text) {
        return String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    function formatMs(ms) {
        const s = Math.max(1, Math.round(ms / 1000));
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }

    /** @param {ExerciseQuestion} question */
    function timeLimitFor(question) {
        return question.type === 'multiple-choice' || question.type === 'true-false' ? TIME_CHOICE_MS : TIME_TYPED_MS;
    }

    // --- HUD -------------------------------------------------------------

    function renderHud() {
        if (!battle) return;
        const hp = Math.max(0, battle.hp);
        $('boss-portrait').textContent = battle.boss.emoji;
        $('boss-name').textContent = battle.boss.name;
        $('boss-hp-fill').style.width = `${(hp / BOSS_HP) * 100}%`;
        $('boss-hp-text').textContent = `${hp} / ${BOSS_HP} HP`;
        const hearts = $('boss-hearts');
        hearts.innerHTML = Array.from({ length: MAX_HEARTS }, (_, i) =>
            `<span class="boss-heart${i < battle.hearts ? '' : ' lost'}">${i < battle.hearts ? '❤️' : '🖤'}</span>`
        ).join('');
        hearts.setAttribute('aria-label', `${battle.hearts} of ${MAX_HEARTS} hearts left`);
    }

    /** @param {{name: string, emoji: string}} speaker @param {string} text */
    function say(speaker, text) {
        const el = $('boss-chatter');
        el.innerHTML = `<span class="boss-chatter-emoji" aria-hidden="true">${speaker.emoji}</span><span><b>${escape(speaker.name)}:</b> ${escape(text)}</span>`;
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
    }

    function updateTimerBar() {
        if (!battle) return;
        const share = Math.max(0, battle.remainingMs) / battle.limitMs;
        const bar = $('boss-timer');
        $('boss-timer-fill').style.width = `${share * 100}%`;
        $('boss-timer-text').textContent = `${Math.max(0, Math.ceil(battle.remainingMs / 1000))}s`;
        bar.classList.toggle('crit-window', share >= 1 - CRIT_SHARE);
        bar.classList.toggle('urgent', battle.remainingMs <= WARN_MS);
    }

    /** @param {number} damage @param {boolean} crit */
    function animateHit(damage, crit) {
        const portrait = $('boss-portrait');
        portrait.classList.remove('boss-hit');
        void portrait.offsetWidth;
        portrait.classList.add('boss-hit');
        const pop = document.createElement('span');
        pop.className = `boss-damage${crit ? ' crit' : ''}`;
        pop.textContent = crit ? `⚡ −${damage}` : `−${damage}`;
        portrait.parentElement.appendChild(pop);
        setTimeout(() => pop.remove(), 1000);
        if (crit) {
            const r = portrait.getBoundingClientRect();
            Animations.correctBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
    }

    function animateAttack() {
        const screen = $('screen-exercise');
        screen.classList.remove('boss-attack');
        void screen.offsetWidth;
        screen.classList.add('boss-attack');
        setTimeout(() => screen.classList.remove('boss-attack'), 600);
    }

    // --- Timer -----------------------------------------------------------

    function stopTimer() {
        if (battle && battle.timerId) {
            clearInterval(battle.timerId);
            battle.timerId = null;
        }
    }

    /** @param {number} limitMs */
    function startTimer(limitMs) {
        stopTimer();
        battle.limitMs = limitMs;
        battle.remainingMs = limitMs;
        battle.lastTick = performance.now();
        battle.lastWarnSecond = null;
        updateTimerBar();
        battle.timerId = setInterval(tick, 100);
    }

    function tick() {
        if (!battle) return;
        const now = performance.now();
        const dt = now - battle.lastTick;
        battle.lastTick = now;
        // The clock stops while the tab is hidden or a story popup is open
        if (document.hidden || $('story-overlay')) return;
        battle.remainingMs -= dt;
        updateTimerBar();
        if (battle.remainingMs <= WARN_MS && battle.remainingMs > 0) {
            const second = Math.ceil(battle.remainingMs / 1000);
            if (second !== battle.lastWarnSecond) {
                battle.lastWarnSecond = second;
                AudioManager.tick();
            }
        }
        if (battle.remainingMs <= 0) onTimeout();
    }

    // --- Flow ------------------------------------------------------------

    function drawExercise() {
        if (battle.deck.length === 0) {
            battle.deck = Engine.Utils.shuffle(battle.exercises.map((_, i) => i));
            // Don't repeat the skill that just ended the previous pass
            if (battle.deck[0] === battle.lastIndex && battle.deck.length > 1) battle.deck.push(battle.deck.shift());
        }
        battle.lastIndex = battle.deck.shift();
        return battle.exercises[battle.lastIndex];
    }

    function nextQuestion() {
        if (!battle || battle.over) return;
        clearTimeout(battle.advanceTimer);
        const exercise = drawExercise();
        const skillId = exercise.skillId;
        const question = exercise.generate(Adaptive.getDifficulty(skillId), 'practice');
        question.skillId = skillId;
        battle.question = question;
        battle.skillId = skillId;
        battle.token++;
        Engine.showQuestion(question);
        startTimer(timeLimitFor(question));
    }

    /**
     * Feedback bar for the battle. Enter/Space or the button continues (the
     * engine's keyboard handler clicks .feedback-btn); `autoMs` continues by itself.
     */
    function feedback({ kind, icon, text, detail = '', button, autoMs = 0, onNext = nextQuestion }) {
        const fb = $('exercise-feedback');
        const token = battle.token;
        fb.className = `exercise-feedback show ${kind} boss-feedback`;
        fb.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">${icon}</span>
                <div>
                    <div class="feedback-text">${text}</div>
                    ${detail ? `<div class="feedback-detail">${detail}</div>` : ''}
                </div>
            </div>
            <button class="feedback-btn">${button}</button>`;
        const go = () => {
            if (!battle || token !== battle.token) return;
            battle.token++; // one continue per feedback bar
            clearTimeout(battle.advanceTimer);
            fb.className = 'exercise-feedback';
            fb.innerHTML = '';
            onNext();
        };
        fb.querySelector('.feedback-btn').addEventListener('click', go);
        if (autoMs) battle.advanceTimer = setTimeout(go, autoMs);
    }

    /** Highlight the right choice after a miss so she sees it on the question itself. */
    function revealCorrect(question) {
        const label = Engine.describeAnswer(question);
        document.querySelectorAll('#exercise-body .btn-answer').forEach(btn => {
            const own = btn.dataset.label || '';
            if (own === label || (question.type === 'true-false' && own.startsWith(label))) btn.classList.add('correct');
        });
    }

    /**
     * @param {boolean} isCorrect
     * @param {AnswerValue} userAnswer
     * @param {ExerciseQuestion} question
     */
    function onAnswer(isCorrect, userAnswer, question) {
        // Grid/fraction questions hand the engine a copy of the question, so check
        // that a question is live (its timer running) rather than object identity.
        if (!battle || battle.over || battle.timerId === null) return;
        stopTimer();
        const usedMs = Math.min(battle.limitMs, battle.limitMs - battle.remainingMs);
        battle.activeMs += usedMs;
        const unitId = battle.unit.id;
        Adaptive.recordDailyQuestion(isCorrect);

        if (!isCorrect) {
            Adaptive.recordWrong(battle.skillId, unitId, userAnswer, question, true);
            loseHeart('Ouch — not quite!', question);
            return;
        }

        Adaptive.recordCorrect(battle.skillId, unitId, true);
        const crit = usedMs <= battle.limitMs * CRIT_SHARE;
        const damage = crit ? 2 : 1;
        battle.hp -= damage;
        battle.correct++;
        if (crit) battle.crits++;
        AudioManager.hit(crit);
        animateHit(damage, crit);
        renderHud();

        if (battle.hp <= 0) {
            battle.over = true;
            say(battle.boss, battle.boss.win);
            feedback({ kind: 'correct', icon: '🏆', text: `${crit ? 'CRITICAL HIT! ' : ''}${escape(battle.boss.name)} is defeated!`, button: 'Victory! 🏆', autoMs: 1600, onNext: () => finish(true) });
            return;
        }
        if (crit) say(battle.guide, Story.guideCrit());
        else say(battle.boss, Story.bossHitLine());
        feedback({
            kind: 'correct',
            icon: crit ? '⚡' : '💥',
            text: crit ? `CRITICAL HIT! −2 HP` : `Hit! −1 HP`,
            detail: crit ? 'Super fast answer = double damage!' : `Answer in the ⚡ zone for a critical hit!`,
            button: 'Next ⚔️',
            autoMs: HIT_ADVANCE_MS
        });
    }

    function onTimeout() {
        if (!battle || battle.over) return;
        stopTimer();
        battle.activeMs += battle.limitMs;
        Engine.lockAnswers();
        loseHeart("Time's up! ⏰", battle.question);
    }

    /** @param {string} title @param {ExerciseQuestion} question */
    function loseHeart(title, question) {
        battle.hearts--;
        AudioManager.hurt();
        animateAttack();
        renderHud();
        revealCorrect(question);
        const answer = `✅ The answer was <b>${escape(Engine.describeAnswer(question))}</b>.`;
        const detail = question.hint3 ? `${answer} ${question.hint3}` : answer;
        if (battle.hearts <= 0) {
            battle.over = true;
            say(battle.boss, 'Hee hee! Better luck next time!');
            feedback({ kind: 'incorrect', icon: '💔', text: title, detail, button: 'See results', onNext: () => finish(false) });
            return;
        }
        say(battle.boss, Story.bossAttackLine());
        feedback({ kind: 'incorrect', icon: '💔', text: title, detail, button: 'Next ⚔️' });
    }

    function showIntro() {
        const b = battle;
        const record = Adaptive.getBoss(b.unit.id);
        const intro = document.createElement('div');
        intro.className = 'boss-intro';
        intro.setAttribute('role', 'dialog');
        intro.setAttribute('aria-label', `Boss battle: ${b.boss.name}`);
        intro.innerHTML = `
            <div class="boss-intro-card">
                <div class="boss-intro-label">⚔️ BOSS BATTLE ⚔️</div>
                <div class="boss-intro-emoji" aria-hidden="true">${b.boss.emoji}</div>
                <div class="boss-intro-name">${escape(b.boss.name)}</div>
                <p class="boss-intro-taunt">“${escape(b.boss.intro)}”</p>
                <ul class="boss-intro-rules">
                    <li>💥 Right answer = hit the boss (${BOSS_HP} HP)</li>
                    <li>⚡ Answer in the gold zone for a <b>critical hit</b> — double damage!</li>
                    <li>❤️ Wrong answer or time runs out = lose a heart. You have ${MAX_HEARTS}.</li>
                    <li>⌨️ Type and press Enter, or press 1–4 to pick an answer.</li>
                </ul>
                ${record.wins > 0 && record.bestMs
                    ? `<div class="boss-intro-record">🏆 Your best time: <b>${formatMs(record.bestMs)}</b> — can you beat it?</div>`
                    : ''}
                <button type="button" class="btn btn-start boss-fight-btn">⚔️ FIGHT!</button>
            </div>`;
        $('screen-exercise').appendChild(intro);
        AudioManager.bossAppear();
        const btn = intro.querySelector('.boss-fight-btn');
        btn.addEventListener('click', () => {
            if (!battle || battle !== b) return;
            AudioManager.click();
            intro.remove();
            say(b.guide, `${Story.guideCheer()} Go, Valerie!`);
            Engine.setAnswerInterceptor(onAnswer);
            nextQuestion();
        });
        setTimeout(() => btn.focus(), 60);
    }

    // --- Results ---------------------------------------------------------

    /**
     * @param {Battle} b
     * @param {boolean} won
     * @param {{firstWin: boolean, newRecord: boolean, previousBestMs: number|null}} result
     * @param {MathUnit|null} unlockedNext
     */
    function renderResults(b, won, result, unlockedNext) {
        const content = $('results-content');
        const world = Story.world(b.grade);
        const units = App.getUnitsForGrade(b.grade);
        const record = Adaptive.getBoss(b.unit.id);
        const chapterNumber = units.findIndex(u => u.id === b.unit.id) + 1;
        const collected = Adaptive.countBossWins(units.map(u => u.id));

        if (won) {
            const flawless = b.hearts === MAX_HEARTS;
            content.innerHTML = `
                <div class="boss-result win">
                    <div class="boss-result-emoji" aria-hidden="true">${b.boss.emoji}</div>
                    <h2 class="results-title">🏆 You beat ${escape(b.boss.name)}!</h2>
                    <p class="results-subtitle">“${escape(b.boss.win)}”</p>
                    ${flawless ? '<div class="boss-badge flawless">✨ FLAWLESS — no hearts lost!</div>' : ''}
                    <div class="results-stats">
                        <div class="stat-box"><div class="stat-value">${formatMs(b.activeMs)}</div><div class="stat-label">⏱️ Time</div></div>
                        <div class="stat-box"><div class="stat-value">${b.hearts}/${MAX_HEARTS}</div><div class="stat-label">❤️ Hearts</div></div>
                        <div class="stat-box"><div class="stat-value">${b.crits}</div><div class="stat-label">⚡ Crits</div></div>
                    </div>
                    ${result.newRecord
                        ? `<div class="boss-badge record">⏱️ NEW BEST TIME! (old best ${formatMs(result.previousBestMs)})</div>`
                        : (!result.firstWin && record.bestMs ? `<div class="boss-best">⏱️ Best time: ${formatMs(record.bestMs)}</div>` : '')}
                    ${result.firstWin ? `
                        <div class="boss-reward">${world.item.emoji} You won back a <b>${escape(world.item.name)}</b>! <span>${collected} / ${units.length}</span></div>
                        <div class="chapter-card">
                            <div class="chapter-label">📖 New story chapter</div>
                            <h3>Chapter ${chapterNumber}: ${escape(b.boss.chapter.title)}</h3>
                            <p>${escape(b.boss.chapter.text)}</p>
                        </div>` : ''}
                    ${unlockedNext ? `<div class="boss-unlock">🔓 <b>${escape(unlockedNext.title)}</b> is now unlocked!</div>` : ''}
                    <div class="results-buttons">
                        <button class="btn btn-boss" onclick="Boss.start('${b.unit.id}')">⚔️ Rematch — beat your time</button>
                        <button class="btn btn-success" onclick="App.showMap()">🗺️ Back to Map</button>
                    </div>
                </div>`;
        } else {
            const damage = BOSS_HP - Math.max(0, b.hp);
            content.innerHTML = `
                <div class="boss-result lose">
                    <div class="boss-result-emoji" aria-hidden="true">${b.boss.emoji}</div>
                    <h2 class="results-title">${escape(b.boss.name)} got away… this time!</h2>
                    <p class="results-subtitle">You knocked off <b>${damage}</b> of ${BOSS_HP} HP.</p>
                    <div class="boss-hp boss-hp-result"><div class="boss-hp-fill" style="width:${(Math.max(0, b.hp) / BOSS_HP) * 100}%"></div><span class="boss-hp-text">${Math.max(0, b.hp)} / ${BOSS_HP} HP left</span></div>
                    <div class="guide-bubble static">
                        <span class="guide-emoji" aria-hidden="true">${b.guide.emoji}</span>
                        <div class="guide-text"><b>${escape(b.guide.name)}:</b> ${damage >= BOSS_HP / 2 ? "So close! One more try and that boss is toast." : 'Bosses are tough! A practice round will power you up.'} 💪</div>
                    </div>
                    <div class="results-buttons">
                        <button class="btn btn-boss" onclick="Boss.start('${b.unit.id}')">⚔️ Try Again</button>
                        <button class="btn btn-primary" onclick="App.startUnit('${b.unit.id}')">📚 Practice Round</button>
                        <button class="btn btn-success" onclick="App.showMap()">🗺️ Map</button>
                    </div>
                </div>`;
        }
    }

    /** @param {boolean} won */
    function finish(won) {
        if (!battle) return;
        const b = battle;
        stopTimer();
        clearTimeout(b.advanceTimer);
        b.token++;
        Engine.setAnswerInterceptor(null);

        const result = Adaptive.recordBossResult(b.unit.id, { won, ms: b.activeMs, hearts: b.hearts });
        let unlockedNext = null;
        if (won) {
            // Beating a boss also opens the next unit in that world
            const units = App.getUnitsForGrade(b.grade);
            const next = units[units.findIndex(u => u.id === b.unit.id) + 1];
            if (next && Adaptive.unlockUnit(next.id)) unlockedNext = next;
        }

        renderResults(b, won, result, unlockedNext);
        App.showScreen('screen-results'); // also tears down the battle (see stop)

        if (won) {
            AudioManager.fanfare();
            const world = Story.world(b.grade);
            setTimeout(() => {
                Animations.celebrate();
                Animations.emojiRain([b.boss.emoji, world.item.emoji, '⭐', '🏆', '✨']);
            }, 250);
            const units = App.getUnitsForGrade(b.grade);
            const allBeaten = Adaptive.countBossWins(units.map(u => u.id)) === units.length;
            if (result.firstWin && allBeaten) {
                setTimeout(() => Story.showDialog({ speaker: world.guide, title: `🏆 ${world.title} — The End`, lines: world.finale, doneLabel: 'Hooray! 🎉' }), 1800);
            }
        } else {
            AudioManager.star();
        }
    }

    /** Tear down any battle in progress. Safe to call any time. */
    function stop() {
        if (battle) {
            stopTimer();
            clearTimeout(battle.advanceTimer);
            battle = null;
        }
        Engine.setAnswerInterceptor(null);
        const screen = $('screen-exercise');
        if (screen) {
            screen.querySelector('.boss-intro')?.remove();
            screen.classList.remove('boss-mode', 'boss-attack');
        }
    }

    return {
        BOSS_HP,
        MAX_HEARTS,
        formatMs,

        /** @param {string} unitId */
        start(unitId) {
            const unit = App.getAllUnits().find(u => u.id === unitId);
            const boss = Story.boss(unitId);
            if (!unit || !boss) return;
            stop();
            const grade = Story.gradeOf(unitId);
            battle = {
                unit, boss, grade,
                guide: Story.world(grade).guide,
                exercises: unit.getExercises(),
                deck: [], lastIndex: -1,
                hp: BOSS_HP, hearts: MAX_HEARTS,
                activeMs: 0, limitMs: TIME_CHOICE_MS, remainingMs: TIME_CHOICE_MS, lastTick: 0, lastWarnSecond: null,
                timerId: null, advanceTimer: null, token: 0,
                question: null, skillId: null, over: false, correct: 0, crits: 0
            };
            App.showScreen('screen-exercise');
            const screen = $('screen-exercise');
            screen.className = `screen active theme-bg-${unit.theme} boss-mode`;
            const fb = $('exercise-feedback');
            fb.className = 'exercise-feedback';
            fb.innerHTML = '';
            $('exercise-body').innerHTML = '';
            renderHud();
            updateTimerBar();
            say(boss, boss.intro);
            showIntro();
        },

        stop,

        flee() {
            if (!battle) { App.showMap(); return; }
            if (confirm(`Run away from ${battle.boss.name}? This battle won't count.`)) {
                stop();
                App.showMap();
            }
        },

        isActive() { return battle !== null; }
    };
})();
