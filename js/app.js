/* ===== APP CONTROLLER ===== */
/* Main app: routing, screen management, map rendering, practice zone */
/// <reference path="./types.js" />

const App = (() => {
    /** @type {MathUnit[]} */
    const UNITS_3RD = [
        MultiplicationIntro,
        Multiplication1Digit,
        AdditionSubtraction,
        Division,
        Fractions,
        Patterns,
        Geometry,
        Area,
        Perimeter,
        Time,
        Measurement,
        DataGraphs
    ];

    /** @type {MathUnit[]} */
    const UNITS_4TH = [
        PlaceValue4,
        AddSubEstimation4,
        Multiply1Digit4,
        Multiply2Digit4,
        Division4,
        FactorsMultiples4,
        EquivFractions4,
        AddSubFractions4,
        MultiplyFractions4,
        Decimals4,
        Angles4,
        AreaPerimeter4,
        Measurement4,
        PlaneFigures4
    ];

    /** @type {MathUnit[]} */
    const ALL_UNITS = [...UNITS_3RD, ...UNITS_4TH];

    let currentGrade = '3rd';
    /** @type {PracticeSelection|null} */
    let lastPractice = null;

    async function init() {
        Engine.configureNavigation({
            showScreen,
            getAllUnits: () => ALL_UNITS,
            showMap: () => App.showMap(),
            repeatLastPractice: () => App.repeatLastPractice()
        });

        // Bring the splash to life immediately — before any network wait — so a
        // slow or dead connection degrades gracefully instead of freezing on a
        // static screen.
        Animations.init();
        Animations.createSplashBubbles();

        // Initialize audio on first user interaction
        document.addEventListener('click', () => AudioManager.init(), { once: true });
        document.addEventListener('touchstart', () => AudioManager.init(), { once: true });

        await Adaptive.load();

        // Update total stars display
        updateStars();
    }

    function updateStars() {
        const el = document.getElementById('total-stars');
        if (el) el.textContent = `⭐ ${Adaptive.getTotalStars()}`;
    }

    function updateMuteIcon() {
        const btn = document.getElementById('btn-mute');
        if (btn) {
            const m = AudioManager.isMuted();
            btn.textContent = m ? '🔇' : '🔊';
            btn.setAttribute('aria-pressed', String(m));
        }
    }

    function updateDaily() {
        const el = document.getElementById('daily-badge');
        if (!el) return;
        const d = Adaptive.getDaily();
        const done = Math.min(d.answeredToday, d.goal);
        const dots = Adaptive.getRecentDayDots(7)
            .map(on => `<span class="daily-dot${on ? ' on' : ''}"></span>`).join('');
        el.innerHTML =
            `<span class="daily-goal${d.reached ? ' reached' : ''}">🎯 ${done}/${d.goal}${d.reached ? ' ✓' : ''}</span>` +
            `<span class="daily-dots" title="Days practiced">${dots}</span>`;
    }

    /**
     * @param {string} text
     * @param {'success'|'error'|'info'} kind
     */
    function showBackupStatus(text, kind) {
        const el = document.getElementById('backup-status');
        if (!el) return;
        el.textContent = text;
        el.className = `backup-status backup-status-${kind}`;
    }

    function showScreen(id) {
        AudioManager.whoosh();
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
        });
        const screen = document.getElementById(id);
        if (screen) {
            screen.classList.add('active');
        }
    }

    /**
     * @param {'3rd'|'4th'} grade
     * @returns {MathUnit[]}
     */
    function getUnitsForGrade(grade) {
        return grade === '4th' ? UNITS_4TH : UNITS_3RD;
    }

    function renderMap() {
        const grid = document.getElementById('map-grid');
        grid.innerHTML = '';

        const units = getUnitsForGrade(currentGrade);

        // Update map header
        const titleEl = document.getElementById('map-title');
        const welcomeEl = document.getElementById('map-welcome');
        if (currentGrade === '4th') {
            titleEl.textContent = '🐾 Monster & Dance World';
            welcomeEl.textContent = '4th Grade Math — Catch creatures & hit the dance floor!';
        } else {
            titleEl.textContent = '🗺️ Adventure Map';
            welcomeEl.textContent = 'Hi Valerie! Choose a world to explore!';
        }

        Adaptive.checkUnlocks(ALL_UNITS);

        units.forEach(unit => {
            const unlocked = Adaptive.isUnitUnlocked(unit.id);
            const progress = Adaptive.getUnitProgress(unit.id, unit.exerciseCount);

            const card = document.createElement('button');
            card.type = 'button';
            card.disabled = !unlocked; // locked units drop out of the tab order for free
            card.className = `unit-card theme-${unit.theme} ${unlocked ? '' : 'locked'}`;
            card.innerHTML = `
                <div class="unit-card-icon">${unit.icon}</div>
                <div class="unit-card-title">${unit.title}</div>
                <div class="unit-card-desc">${unit.description}</div>
                <div class="unit-card-progress">
                    <div class="unit-progress-bar">
                        <div class="unit-progress-fill" style="width: ${progress.percent}%"></div>
                    </div>
                    <span class="unit-progress-text">${progress.percent}%</span>
                </div>
                <div class="unit-card-stars">⭐ ${progress.stars} / ${progress.maxStars}</div>
                ${!unlocked ? '<div class="unit-card-lock">🔒</div>' : ''}
            `;

            if (unlocked) {
                card.addEventListener('click', () => {
                    AudioManager.click();
                    showUnitIntro(unit);
                });
            }

            grid.appendChild(card);
        });
    }

    /**
     * Resolve the weakness queue into runnable exercises. Stale entries whose
     * unit or skill no longer exists are skipped.
     *
     * @returns {ExerciseDefinition[]}
     */
    function collectWeaknessExercises() {
        /** @type {ExerciseDefinition[]} */
        const exercises = [];
        Adaptive.getWeaknessQueue().forEach(q => {
            const unit = ALL_UNITS.find(u => u.id === q.unitId);
            const ex = unit && unit.getExercises().find(e => e.skillId === q.skillId);
            if (ex) exercises.push({ ...ex, _sourceUnitId: q.unitId });
        });
        return exercises;
    }

    /** @param {MathUnit} unit */
    function showUnitIntro(unit) {
        const content = document.getElementById('unit-intro-content');
        const progress = Adaptive.getUnitProgress(unit.id, unit.exerciseCount);

        // Apply theme to screen
        const screen = document.getElementById('screen-unit-intro');
        screen.className = `screen active theme-bg-${unit.theme}`;

        const roundsToUnlock = Math.ceil(unit.exerciseCount * 0.5);
        content.innerHTML = `
            <div class="unit-intro-icon">${unit.icon}</div>
            <h2 class="unit-intro-title">${unit.title}</h2>
            <p class="unit-intro-desc">${unit.description}</p>
            <p class="unit-intro-rounds-label">Each round takes you through all ${unit.exerciseCount} skills. Complete ${roundsToUnlock} rounds to unlock the next unit!</p>
            <div class="unit-intro-exercises stagger-in">
                ${Array.from({length: unit.exerciseCount}, (_, i) => `
                    <div class="exercise-list-item ${progress.completed > i ? 'completed' : ''}">
                        <div class="exercise-list-num">${progress.completed > i ? '✓' : i + 1}</div>
                        <span class="exercise-list-name">Round ${i + 1}</span>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-start" onclick="App.startUnit('${unit.id}')">
                <span class="btn-icon">${progress.percent > 0 ? '🔄' : '🚀'}</span>
                ${progress.percent > 0 ? 'Continue' : 'Start'}
            </button>
        `;

        showScreen('screen-unit-intro');
    }

    // --- Grown-Ups view helpers ---

    // Friendly names for misconception labels emitted by unit diagnose() functions
    // and the generic detector. Anything unmapped falls back to a de-dashed form.
    const MISCONCEPTION_LABELS = {
        'off-by-one': 'off by one',
        'place-value': 'place-value slip',
        'place-value-confusion': 'place-value confusion',
        'added-instead-of-multiplied': 'added instead of multiplied',
        'added-instead': 'added instead of the right operation',
        'reversed-division': 'divided in the wrong order',
        'reversed-comparison': 'comparison sign reversed',
        'reversed-digits': 'digits reversed',
        'carry-error': 'carrying / regrouping slip',
        'forgot-decimal-point': 'forgot the decimal point',
        'rounding-error': 'rounding slip',
        'exact-not-estimate': 'gave the exact answer, not an estimate',
        'wrote-numerator-only': 'used the numerator only',
        'gave-total-not-quotient': 'gave the total instead of sharing it'
    };

    /** @type {Object.<string, MathUnit>|null} */
    let _skillIndex = null;

    // Map every declared skillId to its unit (for labels + context on the parent
    // view). Built once from the same generators the app runs; cheap and cached.
    function skillIndex() {
        if (_skillIndex) return _skillIndex;
        _skillIndex = {};
        ALL_UNITS.forEach(unit => {
            let exs;
            try { exs = unit.getExercises(); } catch (e) { return; }
            exs.forEach(ex => {
                if (ex && ex.skillId && !_skillIndex[ex.skillId]) _skillIndex[ex.skillId] = unit;
            });
        });
        return _skillIndex;
    }

    function friendlyMisconception(label) {
        return MISCONCEPTION_LABELS[label] || String(label).replace(/[-_]/g, ' ');
    }

    function humanizeSkill(skillId) {
        return String(skillId).replace(/[-_]/g, ' ');
    }

    /** @param {SkillProgress} skill */
    function topMisconceptionOf(skill) {
        const m = skill.misconceptions || {};
        let top = null, count = 0;
        for (const label in m) {
            if (m[label] > count) { top = label; count = m[label]; }
        }
        return top;
    }

    function escHtml(value) {
        return String(value).replace(/[&<>"]/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
        ));
    }

    // Render the parent report from data already in state. Read-only: reads
    // Adaptive.getState().skills directly (NOT getSkill, which materializes a
    // zero record on read) and filters to skills she has actually attempted.
    function renderGrownups() {
        const state = Adaptive.getState();
        const skills = state.skills || {};
        const idx = skillIndex();

        const entries = Object.keys(skills)
            .map(id => ({ id, skill: skills[id] }))
            .filter(e => (e.skill.totalCorrect + e.skill.totalWrong) > 0);

        const working = entries
            .filter(e => !e.skill.mastered && e.skill.totalWrong > 0)
            .sort((a, b) => b.skill.totalWrong - a.skill.totalWrong)
            .slice(0, 8);

        const mastered = entries.filter(e => e.skill.mastered);

        let html = '';

        if (entries.length === 0) {
            html += `<div class="gr-empty">No practice data yet. Once Valerie plays a few rounds, you'll see exactly which skills she's working on — including what she typed when she missed one.</div>`;
        }

        if (working.length) {
            html += `<section class="gr-section"><h3 class="gr-section-title">🎯 Working on now</h3>`;
            working.forEach(({ id, skill }) => {
                const unit = idx[id];
                const icon = unit ? unit.icon : (id.startsWith('mult-tables') ? '✖️' : '•');
                const unitTitle = unit ? unit.title : (id.startsWith('mult-tables') ? 'Times tables' : 'Practice');
                const top = topMisconceptionOf(skill);
                const wrongs = (skill.wrongAnswers || []).slice(-3).reverse();
                html += `
                    <div class="gr-skill">
                        <div class="gr-skill-head">
                            <span class="gr-skill-icon" aria-hidden="true">${icon}</span>
                            <span class="gr-skill-name">${escHtml(humanizeSkill(id))}</span>
                            <span class="gr-skill-stats"><span class="gr-ok">✓ ${skill.totalCorrect}</span><span class="gr-no">✗ ${skill.totalWrong}</span></span>
                        </div>
                        <div class="gr-skill-meta">${escHtml(unitTitle)}</div>
                        ${top ? `<div class="gr-misc">💡 Often: ${escHtml(friendlyMisconception(top))}</div>` : ''}
                        ${wrongs.length ? `<div class="gr-wrongs">${wrongs.map(w => `<span class="gr-wrong">wrote <b>${escHtml(w.userAnswer)}</b> · answer <b>${escHtml(w.correctAnswer)}</b></span>`).join('')}</div>` : ''}
                    </div>`;
            });
            html += `</section>`;
        }

        html += `<section class="gr-section"><h3 class="gr-section-title">🌟 Solid</h3>`;
        if (mastered.length) {
            const byUnit = {};
            mastered.forEach(({ id }) => {
                const u = idx[id];
                const key = u ? u.id : '_other';
                if (!byUnit[key]) byUnit[key] = { icon: u ? u.icon : '✔️', title: u ? u.title : 'Times tables', count: 0 };
                byUnit[key].count++;
            });
            html += `<p class="gr-solid-count">Valerie has mastered <b>${mastered.length}</b> skill${mastered.length === 1 ? '' : 's'} (3 correct in a row).</p>`;
            html += `<div class="gr-chips">${Object.values(byUnit).map(g => `<span class="gr-chip">${g.icon} ${escHtml(g.title)} <b>×${g.count}</b></span>`).join('')}</div>`;
        } else {
            html += `<p class="gr-solid-count">No skills mastered yet — three correct in a row on a skill earns it.</p>`;
        }
        html += `</section>`;

        const report = document.getElementById('grownups-report');
        if (report) report.innerHTML = html;
    }

    return {
        init,
        /** @returns {MathUnit[]} */
        getAllUnits() { return ALL_UNITS; },

        showScreen,

        showWorldSelect() {
            AudioManager.click();
            showScreen('screen-world-select');
        },

        showMap(grade) {
            if (grade) currentGrade = grade;
            renderMap();
            updateStars();
            updateDaily();
            updateMuteIcon();
            showScreen('screen-map');
        },

        toggleMute() {
            AudioManager.toggleMute();
            updateMuteIcon();
        },

        /** @param {string} unitId */
        startUnit(unitId) {
            const unit = ALL_UNITS.find(u => u.id === unitId);
            if (!unit) return;
            AudioManager.click();
            Engine.startUnit(unit, unit.getExercises());
        },

        confirmExit() {
            if (confirm('Leave this exercise? Your progress on this set will be lost.')) {
                App.showMap();
            }
        },

        showGrownups() {
            AudioManager.click();
            renderGrownups();
            showScreen('screen-grownups');
        },

        showPracticeZone() {
            AudioManager.click();
            const practiceExercises = collectWeaknessExercises();
            const body = document.getElementById('practice-body');

            const multTablesHTML = `
                <div class="practice-section">
                    <h3 class="practice-section-title">✖️ Multiplication Tables</h3>
                    <p class="practice-section-desc">Practice your times tables! Pick a number or try a mix.</p>
                    <div class="mult-tables-grid">
                        <button class="mult-table-btn mult-table-mixed" onclick="App.startMultiplicationPractice('mixed')">
                            🎲 Mixed (1–12)
                        </button>
                        ${Array.from({length: 12}, (_, i) => i + 1).map(n => `
                            <button class="mult-table-btn" onclick="App.startMultiplicationPractice(${n})">×${n}</button>
                        `).join('')}
                    </div>
                </div>
            `;

            const weaknessHTML = practiceExercises.length === 0
                ? `
                    <div class="practice-section">
                        <h3 class="practice-section-title">🌟 Tricky Skills</h3>
                        <div class="practice-empty">
                            <div class="practice-empty-icon">🌟</div>
                            <p>No tricky skills to practice right now!<br>Keep exploring the map to find more.</p>
                        </div>
                    </div>
                `
                : `
                    <div class="practice-section">
                        <h3 class="practice-section-title">🌟 Tricky Skills</h3>
                        <p class="practice-section-desc">${practiceExercises.length} skill${practiceExercises.length > 1 ? 's' : ''} to practice!</p>
                        <button class="btn btn-start" onclick="App.startPracticeExercises()">
                            <span class="btn-icon">💪</span> Start Practice
                        </button>
                    </div>
                `;

            body.innerHTML = multTablesHTML + weaknessHTML;
            showScreen('screen-practice');
        },

        /** @param {number|'mixed'} table */
        startMultiplicationPractice(table) {
            AudioManager.click();
            lastPractice = { kind: 'mult', table };
            const R = Engine.Utils.rand;
            const NUM_QUESTIONS = 12;
            const skillId = table === 'mixed' ? 'mult-tables-mixed' : `mult-tables-${table}`;

            // Build a fresh batch of facts, avoiding immediate repeats
            const seen = new Set();
            /** @type {ExerciseDefinition[]} */
            const exercises = [];
            for (let i = 0; i < NUM_QUESTIONS; i++) {
                exercises.push({
                    skillId,
                    _sourceUnitId: 'mult-tables',
                    generate() {
                        let a, b, key, tries = 0;
                        do {
                            a = table === 'mixed' ? R(1, 12) : table;
                            b = R(1, 12);
                            key = `${a}x${b}`;
                            tries++;
                        } while (seen.has(key) && tries < 20);
                        if (seen.size >= 100) seen.clear();
                        seen.add(key);

                        const answer = a * b;
                        return {
                            type: 'input',
                            questionText: `What is ${a} × ${b}?`,
                            subText: `${a} × ${b} = ?`,
                            answer,
                            hint1: `Think of ${a} groups of ${b}.`,
                            hint2: `Skip count by ${a}: ${Array.from({length: b}, (_, i) => a * (i + 1)).join(', ')}`,
                            hint3: `${a} × ${b} = ${answer}`
                        };
                    }
                });
            }

            Engine.startPractice(exercises);
        },

        startPracticeExercises() {
            lastPractice = { kind: 'weakness' };
            const practiceExercises = collectWeaknessExercises();
            if (practiceExercises.length > 0) {
                Engine.startPractice(Engine.Utils.shuffle(practiceExercises).slice(0, 7));
            }
        },

        repeatLastPractice() {
            if (lastPractice && lastPractice.kind === 'mult') {
                this.startMultiplicationPractice(lastPractice.table);
            } else {
                this.startPracticeExercises();
            }
        },

        // --- Progress Backup ---
        exportBackup() {
            AudioManager.click();
            try {
                const snapshot = Adaptive.exportSnapshot();
                const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const date = new Date().toISOString().slice(0, 10);
                a.href = url;
                a.download = `valerie-math-backup-${date}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showBackupStatus('✅ Backup saved to your downloads folder.', 'success');
            } catch (e) {
                showBackupStatus('❌ Could not create backup file.', 'error');
            }
        },

        importBackup() {
            AudioManager.click();
            const input = document.getElementById('backup-file-input');
            if (!input) return;
            input.value = ''; // allow re-selecting the same file
            input.click();
        },

        /** @param {Event} event */
        async handleBackupFile(event) {
            const input = /** @type {HTMLInputElement} */ (event.target);
            const file = input.files && input.files[0];
            if (!file) return;

            let parsed;
            try {
                parsed = JSON.parse(await file.text());
            } catch (e) {
                showBackupStatus('❌ That file isn\'t valid JSON.', 'error');
                return;
            }

            if (!confirm("Restore this backup? Valerie's current progress and study notes will be replaced.")) {
                showBackupStatus('Restore cancelled.', 'info');
                return;
            }

            showBackupStatus('⏳ Restoring…', 'info');
            const result = await Adaptive.importSnapshot(parsed);
            if (!result.ok) {
                showBackupStatus(`❌ ${result.error}`, 'error');
                return;
            }

            const note = result.synced
                ? '✅ Restored! Reloading…'
                : '✅ Restored locally (offline — open online to sync). Reloading…';
            showBackupStatus(note, 'success');
            setTimeout(() => window.location.reload(), 900);
        }
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', App.init);
