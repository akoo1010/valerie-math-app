/* ===== APP CONTROLLER ===== */
/* Main app: routing, screen management, map rendering, practice zone */

const App = (() => {
    // 3rd grade units
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

    // 4th grade units
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

    const ALL_UNITS = [...UNITS_3RD, ...UNITS_4TH];

    let currentGrade = '3rd';

    async function init() {
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

    function showUnitIntro(unit) {
        const content = document.getElementById('unit-intro-content');
        const progress = Adaptive.getUnitProgress(unit.id, unit.exerciseCount);

        // Apply theme to screen
        const screen = document.getElementById('screen-unit-intro');
        screen.className = `screen active theme-bg-${unit.theme}`;

        content.innerHTML = `
            <div class="unit-intro-icon">${unit.icon}</div>
            <h2 class="unit-intro-title">${unit.title}</h2>
            <p class="unit-intro-desc">${unit.description}</p>
            <div class="unit-intro-exercises stagger-in">
                ${unit.getExercises().map((ex, i) => `
                    <div class="exercise-list-item ${progress.completed > i ? 'completed' : ''}">
                        <div class="exercise-list-num">${progress.completed > i ? '✓' : i + 1}</div>
                        <span class="exercise-list-name">Exercise ${i + 1}</span>
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
            const queue = Adaptive.getWeaknessQueue();
            const body = document.getElementById('practice-body');

            if (queue.length === 0) {
                body.innerHTML = `
                    <div class="practice-empty">
                        <div class="practice-empty-icon">🌟</div>
                        <h3>No skills to practice!</h3>
                        <p>Great job, Valerie! You've been getting everything right.<br>Keep exploring the map to learn more!</p>
                        <button class="btn btn-primary" style="margin-top:20px" onclick="App.showMap()">🗺️ Back to Map</button>
                    </div>
                `;
            } else {
                // Build practice exercises from weakness queue
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
                    body.innerHTML = `
                        <p style="margin-bottom:16px;">${practiceExercises.length} skill${practiceExercises.length > 1 ? 's' : ''} to practice!</p>
                        <button class="btn btn-start" onclick="App.startPracticeExercises()">
                            <span class="btn-icon">💪</span> Start Practice
                        </button>
                    `;
                } else {
                    body.innerHTML = `<div class="practice-empty"><div class="practice-empty-icon">🌟</div><p>All caught up!</p></div>`;
                }
            }

            showScreen('screen-practice');
        },

        startPracticeExercises() {
            const queue = Adaptive.getWeaknessQueue();
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
        }
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', App.init);
