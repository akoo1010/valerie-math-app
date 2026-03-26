/* ===== EXERCISE ENGINE ===== */
/* Manages exercise flow: question generation, answer validation, feedback, scoring */

const Engine = (() => {
    let currentUnit = null;
    let currentExercises = [];
    let currentExIndex = 0;
    let currentQuestion = null;
    let score = { correct: 0, total: 0, stars: 0 };
    let wrongAttempts = 0;
    let hintShown = false;

    // --- Utility functions available to unit files ---
    const Utils = {
        rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        shuffle(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        },
        pick(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        // Generate wrong answers near the correct one
        distractors(correct, count = 3, range = 10) {
            const set = new Set([correct]);
            let attempts = 0;
            while (set.size < count + 1 && attempts < 100) {
                let d = correct + Engine.Utils.rand(-range, range);
                if (d < 0) d = Math.abs(d);
                if (d !== correct) set.add(d);
                attempts++;
            }
            set.delete(correct);
            return [...set].slice(0, count);
        },
        // Create multiple choice options
        multipleChoice(correct, numOptions = 4) {
            const range = Math.max(5, Math.ceil(correct * 0.4));
            const wrong = Utils.distractors(correct, numOptions - 1, range);
            const options = Utils.shuffle([correct, ...wrong]);
            return options;
        },
        // Format number with commas
        fmt(n) {
            return n.toLocaleString();
        }
    };

    // --- Rendering helpers ---
    function renderQuestion(question) {
        const body = document.getElementById('exercise-body');
        body.innerHTML = '';
        body.className = 'exercise-body';
        currentQuestion = question;
        wrongAttempts = 0;
        hintShown = false;

        // Question text
        if (question.questionText) {
            const qDiv = document.createElement('div');
            qDiv.className = 'exercise-question';
            qDiv.innerHTML = `
                <div class="exercise-question-text">${question.questionText}</div>
                ${question.subText ? `<div class="exercise-question-sub">${question.subText}</div>` : ''}
            `;
            body.appendChild(qDiv);
        }

        // Visual area
        if (question.visual) {
            const vDiv = document.createElement('div');
            vDiv.className = 'exercise-visual';
            if (question.visualClass) vDiv.classList.add(question.visualClass);
            vDiv.innerHTML = question.visual;
            body.appendChild(vDiv);

            // Run visual init if provided
            if (question.visualInit) {
                setTimeout(() => question.visualInit(vDiv), 50);
            }
        }

        // Hint area (hidden initially)
        const hintDiv = document.createElement('div');
        hintDiv.id = 'hint-area';
        hintDiv.style.width = '100%';
        body.appendChild(hintDiv);

        // Answer area based on type
        if (question.type === 'multiple-choice') {
            renderMultipleChoice(body, question);
        } else if (question.type === 'input') {
            renderInput(body, question);
        } else if (question.type === 'drag-drop') {
            renderDragDrop(body, question);
        } else if (question.type === 'grid-click') {
            renderGridClick(body, question);
        } else if (question.type === 'fraction-click') {
            renderFractionClick(body, question);
        } else if (question.type === 'true-false') {
            renderTrueFalse(body, question);
        } else if (question.type === 'custom') {
            // Custom rendering handled by the question itself
            if (question.render) {
                const customDiv = document.createElement('div');
                customDiv.className = 'exercise-answers';
                body.appendChild(customDiv);
                question.render(customDiv, (answer) => checkAnswer(answer, question));
            }
        }

        // Animate in
        body.classList.add('stagger-in');
    }

    function renderMultipleChoice(body, question) {
        const div = document.createElement('div');
        div.className = 'exercise-answers stagger-in';
        const options = question.options || Utils.multipleChoice(question.answer);
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-answer';
            btn.textContent = typeof opt === 'object' ? opt.label : opt;
            const value = typeof opt === 'object' ? opt.value : opt;
            btn.addEventListener('click', () => {
                AudioManager.click();
                checkAnswer(value, question);
                // Disable all after answering
                div.querySelectorAll('.btn-answer').forEach(b => b.classList.add('disabled'));
                btn.classList.add(value === question.answer ? 'correct' : 'incorrect');
            });
            div.appendChild(btn);
        });
        body.appendChild(div);
    }

    function renderInput(body, question) {
        const div = document.createElement('div');
        div.className = 'exercise-input-area';
        if (question.inputPrefix) {
            const prefix = document.createElement('span');
            prefix.style.fontSize = '1.3rem';
            prefix.style.fontWeight = '700';
            prefix.textContent = question.inputPrefix;
            div.appendChild(prefix);
        }
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'input-answer';
        input.id = 'answer-input';
        input.placeholder = '?';
        input.autocomplete = 'off';
        div.appendChild(input);

        if (question.inputSuffix) {
            const suffix = document.createElement('span');
            suffix.style.fontSize = '1.3rem';
            suffix.style.fontWeight = '700';
            suffix.textContent = question.inputSuffix;
            div.appendChild(suffix);
        }

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Check ✓';
        btn.addEventListener('click', () => {
            const val = parseFloat(input.value);
            if (isNaN(val)) return;
            AudioManager.click();
            checkAnswer(val, question);
            input.classList.add(val === question.answer ? 'correct' : 'incorrect');
        });
        div.appendChild(btn);

        // Allow Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btn.click();
        });

        body.appendChild(div);
        setTimeout(() => input.focus(), 100);
    }

    function renderTrueFalse(body, question) {
        const div = document.createElement('div');
        div.className = 'exercise-answers';
        ['True ✅', 'False ❌'].forEach((label, i) => {
            const val = i === 0;
            const btn = document.createElement('button');
            btn.className = 'btn-answer';
            btn.textContent = label;
            btn.style.minWidth = '140px';
            btn.style.fontSize = '1.2rem';
            btn.addEventListener('click', () => {
                AudioManager.click();
                checkAnswer(val, question);
                div.querySelectorAll('.btn-answer').forEach(b => b.classList.add('disabled'));
                btn.classList.add(val === question.answer ? 'correct' : 'incorrect');
            });
            div.appendChild(btn);
        });
        body.appendChild(div);
    }

    function renderDragDrop(body, question) {
        // question.dragItems, question.dropZones, question.checkDrop(zones)
        const container = document.createElement('div');
        container.className = 'exercise-answers';
        container.style.flexDirection = 'column';
        container.style.gap = '20px';

        // Drop zones
        const zonesDiv = document.createElement('div');
        zonesDiv.style.display = 'flex';
        zonesDiv.style.gap = '12px';
        zonesDiv.style.flexWrap = 'wrap';
        zonesDiv.style.justifyContent = 'center';

        question.dropZones.forEach((zone, i) => {
            const dz = document.createElement('div');
            dz.className = 'drop-zone';
            dz.dataset.zone = i;
            dz.innerHTML = `<span style="color: var(--text-muted); font-size: 0.8rem;">${zone.label || 'Drop here'}</span>`;
            dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag-over'); });
            dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
            dz.addEventListener('drop', (e) => {
                e.preventDefault();
                dz.classList.remove('drag-over');
                const data = e.dataTransfer.getData('text/plain');
                const item = container.querySelector(`[data-drag-id="${data}"]`);
                if (item) {
                    dz.innerHTML = '';
                    dz.appendChild(item.cloneNode(true));
                    dz.classList.add('filled');
                    dz.dataset.value = data;
                    item.style.opacity = '0.3';
                    AudioManager.pop();
                }
            });
            zonesDiv.appendChild(dz);
        });
        container.appendChild(zonesDiv);

        // Drag items
        const itemsDiv = document.createElement('div');
        itemsDiv.style.display = 'flex';
        itemsDiv.style.gap = '10px';
        itemsDiv.style.flexWrap = 'wrap';
        itemsDiv.style.justifyContent = 'center';

        Utils.shuffle(question.dragItems).forEach(item => {
            const di = document.createElement('div');
            di.className = 'drag-item';
            di.draggable = true;
            di.textContent = typeof item === 'object' ? item.label : item;
            di.dataset.dragId = typeof item === 'object' ? item.value : item;
            di.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', di.dataset.dragId);
                di.classList.add('dragging');
            });
            di.addEventListener('dragend', () => di.classList.remove('dragging'));
            itemsDiv.appendChild(di);
        });
        container.appendChild(itemsDiv);

        // Check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary';
        checkBtn.textContent = 'Check ✓';
        checkBtn.addEventListener('click', () => {
            const zones = zonesDiv.querySelectorAll('.drop-zone');
            const values = {};
            zones.forEach(z => { values[z.dataset.zone] = z.dataset.value; });
            const isCorrect = question.checkDrop(values);
            checkAnswer(isCorrect ? question.answer : null, question);
        });
        container.appendChild(checkBtn);

        body.appendChild(container);
    }

    function renderGridClick(body, question) {
        // question.gridRows, question.gridCols, question.targetCount
        const container = document.createElement('div');
        container.style.textAlign = 'center';

        const grid = document.createElement('div');
        grid.className = 'exercise-grid';
        grid.style.gridTemplateColumns = `repeat(${question.gridCols}, 40px)`;
        let filledCount = 0;

        for (let i = 0; i < question.gridRows * question.gridCols; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.addEventListener('click', () => {
                if (cell.classList.contains('filled')) {
                    cell.classList.remove('filled');
                    filledCount--;
                } else {
                    cell.classList.add('filled');
                    filledCount++;
                    AudioManager.pop();
                }
            });
            grid.appendChild(cell);
        }
        container.appendChild(grid);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary';
        checkBtn.style.marginTop = '16px';
        checkBtn.textContent = 'Check ✓';
        checkBtn.addEventListener('click', () => {
            checkAnswer(filledCount, { ...question, answer: question.targetCount });
        });
        container.appendChild(checkBtn);
        body.appendChild(container);
    }

    function renderFractionClick(body, question) {
        // question.parts, question.targetNumerator, question.targetDenominator
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.textAlign = 'center';

        const bar = document.createElement('div');
        bar.className = 'fraction-bar';
        let selectedCount = 0;

        for (let i = 0; i < question.parts; i++) {
            const part = document.createElement('div');
            part.className = 'fraction-part';
            part.addEventListener('click', () => {
                if (part.classList.contains('selected')) {
                    part.classList.remove('selected');
                    selectedCount--;
                } else {
                    part.classList.add('selected');
                    selectedCount++;
                    AudioManager.pop();
                }
            });
            bar.appendChild(part);
        }
        container.appendChild(bar);

        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary';
        checkBtn.style.marginTop = '16px';
        checkBtn.textContent = 'Check ✓';
        checkBtn.addEventListener('click', () => {
            checkAnswer(selectedCount, { ...question, answer: question.targetNumerator });
        });
        container.appendChild(checkBtn);
        body.appendChild(container);
    }

    // --- Answer checking ---
    function checkAnswer(userAnswer, question) {
        const isCorrect = (question.checkAnswer)
            ? question.checkAnswer(userAnswer)
            : userAnswer === question.answer;

        if (isCorrect) {
            handleCorrect(question);
        } else {
            handleWrong(question);
        }
    }

    function handleCorrect(question) {
        score.correct++;
        const skillId = question.skillId || `${currentUnit.id}_ex${currentExIndex}`;
        const result = Adaptive.recordCorrect(skillId, currentUnit.id);

        AudioManager.correct();

        // Visual celebration
        const body = document.getElementById('exercise-body');
        const rect = body.getBoundingClientRect();
        if (currentUnit.theme === 'swim') {
            Animations.bubbleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        } else if (currentUnit.theme === 'gd') {
            Animations.gdBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        } else {
            Animations.paintSplatter(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        // Show feedback
        showFeedback(true, Adaptive.getEncouragement(true), question);

        // Streak message
        const streakMsg = Adaptive.getStreakMessage();
        if (streakMsg) {
            setTimeout(() => {
                Animations.correctBurst(window.innerWidth / 2, window.innerHeight / 2);
            }, 300);
        }
    }

    function handleWrong(question) {
        wrongAttempts++;
        const skillId = question.skillId || `${currentUnit.id}_ex${currentExIndex}`;
        const result = Adaptive.recordWrong(skillId, currentUnit.id);

        AudioManager.incorrect();

        // Show hint based on attempt count
        let hintText = '';
        if (wrongAttempts === 1 && question.hint1) {
            hintText = question.hint1;
        } else if (wrongAttempts === 2 && question.hint2) {
            hintText = question.hint2;
        } else if (wrongAttempts >= 3) {
            hintText = question.hint3 || `The answer is ${question.answer}. Let's remember this for next time!`;
        }

        showFeedback(false, Adaptive.getEncouragement(false), question, hintText);
    }

    function showFeedback(isCorrect, message, question, hintText) {
        const fb = document.getElementById('exercise-feedback');
        fb.className = `exercise-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;

        let detailHTML = '';
        if (hintText) {
            detailHTML = `<div class="feedback-detail">💡 ${hintText}</div>`;
        }
        if (isCorrect) {
            const streakMsg = Adaptive.getStreakMessage();
            if (streakMsg) {
                detailHTML = `<div class="feedback-detail">${streakMsg}</div>`;
            }
        }

        fb.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">${isCorrect ? '🎉' : '💪'}</span>
                <div>
                    <div class="feedback-text">${message}</div>
                    ${detailHTML}
                </div>
            </div>
            <button class="feedback-btn" onclick="Engine.nextAfterFeedback(${isCorrect})">${isCorrect ? 'Continue →' : (wrongAttempts >= 3 ? 'Continue →' : 'Try Again')}</button>
        `;
    }

    function hideFeedback() {
        const fb = document.getElementById('exercise-feedback');
        fb.className = 'exercise-feedback';
    }

    function updateProgress() {
        const bar = document.getElementById('exercise-progress-bar');
        const text = document.getElementById('exercise-progress-text');
        const stars = document.getElementById('exercise-stars');
        const total = currentExercises.length;
        bar.style.width = `${(currentExIndex / total) * 100}%`;
        text.textContent = `${currentExIndex + 1}/${total}`;
        stars.textContent = `⭐ ${score.correct}`;
    }

    return {
        Utils,

        // Start a unit's exercises
        startUnit(unit, exercises) {
            currentUnit = unit;
            currentExercises = exercises;
            currentExIndex = 0;
            score = { correct: 0, total: exercises.length, stars: 0 };

            App.showScreen('screen-exercise');

            // Apply theme background
            const screen = document.getElementById('screen-exercise');
            screen.className = `screen active theme-bg-${unit.theme}`;

            updateProgress();
            this.loadExercise(0);
        },

        // Load a specific exercise
        loadExercise(index) {
            if (index >= currentExercises.length) {
                this.showResults();
                return;
            }
            currentExIndex = index;
            updateProgress();
            hideFeedback();

            const exercise = currentExercises[index];
            const difficulty = Adaptive.getDifficulty(exercise.skillId || `${currentUnit.id}_ex${index}`);
            const question = exercise.generate(difficulty);
            question.skillId = exercise.skillId || `${currentUnit.id}_ex${index}`;
            renderQuestion(question);
        },

        // After feedback button
        nextAfterFeedback(wasCorrect) {
            hideFeedback();
            if (wasCorrect || wrongAttempts >= 3) {
                score.total++;
                currentExIndex++;
                if (currentExIndex >= currentExercises.length) {
                    this.showResults();
                } else {
                    this.loadExercise(currentExIndex);
                }
            } else {
                // Try same question again (re-render it)
                const exercise = currentExercises[currentExIndex];
                const difficulty = Adaptive.getDifficulty(exercise.skillId || `${currentUnit.id}_ex${currentExIndex}`);
                const question = exercise.generate(difficulty);
                question.skillId = exercise.skillId || `${currentUnit.id}_ex${currentExIndex}`;
                renderQuestion(question);
            }
        },

        // Show results screen
        showResults() {
            const pct = currentExercises.length > 0 ? score.correct / currentExercises.length : 0;
            let starsEarned = 0;
            if (pct >= 0.9) starsEarned = 3;
            else if (pct >= 0.7) starsEarned = 2;
            else if (pct >= 0.4) starsEarned = 1;

            // Record in adaptive system
            Adaptive.completeExercise(currentUnit.id, 0, starsEarned);
            Adaptive.checkUnlocks(App.getAllUnits());

            // Celebration
            if (starsEarned >= 2) {
                AudioManager.fanfare();
                setTimeout(() => {
                    Animations.celebrate();
                    Animations.emojiRain();
                }, 300);
            } else {
                AudioManager.star();
            }

            // Render results
            const content = document.getElementById('results-content');
            const titles = {
                3: "🏆 INCREDIBLE, Valerie!",
                2: "🌟 Great Job, Valerie!",
                1: "👍 Good Effort, Valerie!",
                0: "💪 Keep Practicing, Valerie!"
            };

            content.innerHTML = `
                <div class="results-icon">${starsEarned >= 2 ? '🎉' : '🌟'}</div>
                <h2 class="results-title">${titles[starsEarned]}</h2>
                <p class="results-subtitle">${currentUnit.title}</p>
                <div class="results-stars">
                    ${[1,2,3].map(i => `<span class="result-star ${i <= starsEarned ? 'earned' : ''}" style="animation-delay: ${i * 0.2}s">⭐</span>`).join('')}
                </div>
                <div class="results-stats">
                    <div class="stat-box">
                        <div class="stat-value">${score.correct}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${currentExercises.length}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${Math.round(pct * 100)}%</div>
                        <div class="stat-label">Score</div>
                    </div>
                </div>
                <div class="results-buttons">
                    <button class="btn btn-primary" onclick="Engine.startUnit(Engine.getCurrentUnit(), Engine.getCurrentUnit().getExercises())">🔄 Try Again</button>
                    <button class="btn btn-success" onclick="App.showMap()">🗺️ Back to Map</button>
                </div>
            `;

            App.showScreen('screen-results');
        },

        getCurrentUnit() { return currentUnit; },
        getScore() { return score; },

        // For practice zone
        startPractice(questions) {
            currentUnit = { id: 'practice', title: 'Practice Zone', theme: 'swim' };
            currentExercises = questions;
            currentExIndex = 0;
            score = { correct: 0, total: questions.length, stars: 0 };
            App.showScreen('screen-exercise');
            updateProgress();
            this.loadExercise(0);
        }
    };
})();
