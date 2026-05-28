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

        await Adaptive.load();
        Animations.init();
        Animations.createSplashBubbles();

        // Initialize audio on first user interaction
        document.addEventListener('click', () => AudioManager.init(), { once: true });
        document.addEventListener('touchstart', () => AudioManager.init(), { once: true });

        // Update total stars display
        updateStars();
    }

    function updateStars() {
        const el = document.getElementById('total-stars');
        if (el) el.textContent = `⭐ ${Adaptive.getTotalStars()}`;
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

            const card = document.createElement('div');
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
            showScreen('screen-map');
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

        showPracticeZone() {
            AudioManager.click();
            // Only show weakness items that map to a real unit
            const queue = Adaptive.getWeaknessQueue().filter(q => ALL_UNITS.some(u => u.id === q.unitId));
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

            let weaknessHTML = '';
            if (queue.length === 0) {
                weaknessHTML = `
                    <div class="practice-section">
                        <h3 class="practice-section-title">🌟 Tricky Skills</h3>
                        <div class="practice-empty">
                            <div class="practice-empty-icon">🌟</div>
                            <p>No tricky skills to practice right now!<br>Keep exploring the map to find more.</p>
                        </div>
                    </div>
                `;
            } else {
                /** @type {ExerciseDefinition[]} */
                const practiceExercises = [];
                queue.forEach(q => {
                    const unit = ALL_UNITS.find(u => u.id === q.unitId);
                    if (unit) {
                        const exercises = unit.getExercises();
                        const ex = exercises.find(e => e.skillId === q.skillId);
                        if (ex) practiceExercises.push(ex);
                    }
                });

                if (practiceExercises.length > 0) {
                    weaknessHTML = `
                        <div class="practice-section">
                            <h3 class="practice-section-title">🌟 Tricky Skills</h3>
                            <p class="practice-section-desc">${practiceExercises.length} skill${practiceExercises.length > 1 ? 's' : ''} to practice!</p>
                            <button class="btn btn-start" onclick="App.startPracticeExercises()">
                                <span class="btn-icon">💪</span> Start Practice
                            </button>
                        </div>
                    `;
                }
            }

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
            const queue = Adaptive.getWeaknessQueue();
            /** @type {ExerciseDefinition[]} */
            const practiceExercises = [];
            queue.forEach(q => {
                const unit = ALL_UNITS.find(u => u.id === q.unitId);
                if (unit) {
                    const exercises = unit.getExercises();
                    const ex = exercises.find(e => e.skillId === q.skillId);
                    if (ex) practiceExercises.push({ ...ex, _sourceUnitId: q.unitId });
                }
            });
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
