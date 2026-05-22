/* ===== EXERCISE ENGINE ===== */
/* Manages exercise flow: question generation, answer validation, feedback, scoring */
/// <reference path="./types.js" />

const Engine = (() => {
    /** @type {MathUnit|null} */
    let currentUnit = null;
    /** @type {ExerciseDefinition[]} */
    let currentExercises = [];
    let currentExIndex = 0;
    /** @type {ExerciseQuestion|null} */
    let currentQuestion = null;
    let score = { correct: 0 };
    let wrongAttempts = 0;
    let answered = false;
    let awaitingFeedback = false;
    /** @type {EngineNavigation} */
    let navigation = {
        showScreen() {},
        getAllUnits() { return []; },
        showMap() {},
        repeatLastPractice() {}
    };

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
                let d = correct + Utils.rand(-range, range);
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
        // Multiple choice where all options must be multiples of `roundTo`
        roundedMultipleChoice(correct, roundTo, numOptions = 4) {
            const distSet = new Set([correct]);
            const offsets = [-3, -2, -1, 1, 2, 3];
            Utils.shuffle(offsets).forEach(o => {
                const d = correct + o * roundTo;
                if (d >= 0) distSet.add(d);
            });
            return Utils.shuffle([...distSet].slice(0, numOptions));
        },
        // Format number with commas
        fmt(n) {
            return n.toLocaleString();
        }
    };

    /** @param {QuestionOption|AnswerValue} value */
    function isQuestionOption(value) {
        return value !== null && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value');
    }

    /** @param {QuestionOption|AnswerValue} option */
    function getOptionLabel(option) {
        return String(isQuestionOption(option) ? (option.label ?? option.value) : option);
    }

    /** @param {QuestionOption|AnswerValue} option */
    function getOptionValue(option) {
        return isQuestionOption(option) ? option.value : option;
    }

    // --- Rendering helpers ---
    /**
     * @param {ExerciseQuestion} question
     * @param {boolean} [isRetry]
     */
    function renderQuestion(question, isRetry = false) {
        const body = document.getElementById('exercise-body');
        body.innerHTML = '';
        body.className = 'exercise-body';
        currentQuestion = question;
        if (!isRetry) {
            wrongAttempts = 0;
        }
        answered = false;
        awaitingFeedback = false;

        // Worked example (shown in worked-example modality)
        if (question.workedExample) {
            const weDiv = document.createElement('div');
            weDiv.className = 'worked-example-box';
            weDiv.innerHTML = `
                <div class="worked-example-label">📝 Here's a similar problem, solved:</div>
                <div class="worked-example-content">${question.workedExample}</div>
            `;
            body.appendChild(weDiv);
        }

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

        // Answer area based on type
        if (question.type === 'multiple-choice') {
            renderMultipleChoice(body, question);
        } else if (question.type === 'input') {
            renderInput(body, question);
        } else if (question.type === 'grid-click') {
            renderGridClick(body, question);
        } else if (question.type === 'fraction-click') {
            renderFractionClick(body, question);
        } else if (question.type === 'true-false') {
            renderTrueFalse(body, question);
        }

        // Animate in
        body.classList.add('stagger-in');
    }

    /**
     * @param {HTMLElement} body
     * @param {ExerciseQuestion} question
     */
    function renderMultipleChoice(body, question) {
        const div = document.createElement('div');
        div.className = 'exercise-answers stagger-in';
        const options = question.options || Utils.multipleChoice(question.answer);
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-answer';
            btn.textContent = getOptionLabel(opt);
            const value = getOptionValue(opt);
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

    /**
     * @param {() => void} onClick
     * @param {string} [marginTop]
     */
    function createCheckButton(onClick, marginTop) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Check ✓';
        if (marginTop) btn.style.marginTop = marginTop;
        btn.addEventListener('click', onClick);
        return btn;
    }

    /**
     * @param {HTMLElement} body
     * @param {ExerciseQuestion} question
     */
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

        let submitting = false;
        const btn = createCheckButton(() => {
            if (submitting || answered) return;
            const val = parseFloat(input.value);
            if (isNaN(val)) return;
            submitting = true;
            btn.disabled = true;
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

    /**
     * @param {HTMLElement} body
     * @param {ExerciseQuestion} question
     */
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

    /**
     * @param {HTMLElement} body
     * @param {ExerciseQuestion} question
     */
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

        const checkBtn = createCheckButton(() => {
            checkAnswer(filledCount, { ...question, answer: question.targetCount });
        }, '16px');
        container.appendChild(checkBtn);
        body.appendChild(container);
    }

    /**
     * @param {HTMLElement} body
     * @param {ExerciseQuestion} question
     */
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

        const checkBtn = createCheckButton(() => {
            checkAnswer(selectedCount, { ...question, answer: question.targetNumerator });
        }, '16px');
        container.appendChild(checkBtn);
        body.appendChild(container);
    }

    // --- Answer checking ---
    /**
     * @param {AnswerValue} userAnswer
     * @param {ExerciseQuestion} question
     */
    function checkAnswer(userAnswer, question) {
        if (answered || awaitingFeedback) return;
        awaitingFeedback = true;

        const isCorrect = (question.checkAnswer)
            ? question.checkAnswer(userAnswer)
            : userAnswer === question.answer;

        if (isCorrect) {
            answered = true;
            handleCorrect(question);
        } else {
            handleWrong(question, userAnswer);
            if (wrongAttempts >= 3) answered = true;
        }
    }

    /** @param {ExerciseQuestion} question */
    function handleCorrect(question) {
        score.correct++;
        const skillId = question.skillId || `${currentUnit.id}_ex${currentExIndex}`;
        const unitId = currentExercises[currentExIndex]?._sourceUnitId || currentUnit.id;
        Adaptive.recordCorrect(skillId, unitId);

        AudioManager.correct();

        // Visual celebration
        const body = document.getElementById('exercise-body');
        const rect = body.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        if (currentUnit.theme === 'swim') {
            Animations.bubbleBurst(cx, cy);
        } else if (currentUnit.theme === 'gd') {
            Animations.gdBurst(cx, cy);
        } else if (currentUnit.theme === 'monster') {
            Animations.monsterBurst(cx, cy);
        } else if (currentUnit.theme === 'dance') {
            Animations.danceBurst(cx, cy);
        } else {
            Animations.paintSplatter(cx, cy);
        }

        // Show feedback (recovery message if student got it after wrong attempts)
        const isRecovery = wrongAttempts > 0;
        const encouragement = isRecovery ? Adaptive.getRecoveryMessage() : Adaptive.getEncouragement(true);
        showFeedback(true, encouragement);

        // Streak message
        const streakMsg = Adaptive.getStreakMessage();
        if (streakMsg) {
            setTimeout(() => {
                Animations.correctBurst(window.innerWidth / 2, window.innerHeight / 2);
            }, 300);
        }
    }

    /**
     * @param {ExerciseQuestion} question
     * @param {AnswerValue} userAnswer
     */
    function handleWrong(question, userAnswer) {
        wrongAttempts++;
        const skillId = question.skillId || `${currentUnit.id}_ex${currentExIndex}`;
        const unitId = currentExercises[currentExIndex]?._sourceUnitId || currentUnit.id;
        Adaptive.recordWrong(skillId, unitId, userAnswer, question);

        AudioManager.incorrect();

        // Misconception-aware hint selection
        let hintText = '';
        const topMisconception = Adaptive.getTopMisconception(skillId);

        if (wrongAttempts === 1 && question.hint1) {
            // Use targeted hint if available for this misconception
            if (topMisconception && question.misconceptionHints && question.misconceptionHints[topMisconception]) {
                hintText = question.misconceptionHints[topMisconception];
            } else {
                hintText = question.hint1;
            }
        } else if (wrongAttempts === 2 && question.hint2) {
            hintText = question.hint2;
        } else if (wrongAttempts >= 3) {
            hintText = question.hint3 || `You just discovered something new! The answer is ${question.answer} 🌟`;
        }

        // Add friendly prefixes to hints (not on answer reveal)
        if (hintText && wrongAttempts < 3) {
            const prefix = wrongAttempts === 1 ? "Here's a tip: " : "Think about it this way: ";
            hintText = prefix + hintText;
        }

        showFeedback(false, Adaptive.getEncouragement(false), hintText);
    }

    /**
     * @param {boolean} isCorrect
     * @param {string} message
     * @param {string} [hintText]
     */
    function showFeedback(isCorrect, message, hintText) {
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
                <span class="feedback-icon">${isCorrect ? '🎉' : (wrongAttempts >= 3 ? '💡' : '💪')}</span>
                <div>
                    <div class="feedback-text">${message}</div>
                    ${detailHTML}
                </div>
            </div>
            <button class="feedback-btn" onclick="Engine.nextAfterFeedback(${isCorrect})">${isCorrect ? 'Continue →' : (wrongAttempts >= 3 ? 'Let\'s Keep Going →' : (wrongAttempts === 1 ? 'Try Again! 💪' : 'One More Try! 🌟'))}</button>
        `;
    }

    function hideFeedback() {
        const fb = document.getElementById('exercise-feedback');
        fb.className = 'exercise-feedback';
    }

    /** @param {SessionMessage} msg */
    function showSessionBanner(msg) {
        const existing = document.getElementById('session-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'session-banner';
        banner.className = `session-banner session-banner-${msg.type}`;
        banner.innerHTML = `
            <span class="session-banner-icon">${msg.icon}</span>
            <span class="session-banner-text">${msg.text}</span>
            <button class="session-banner-close" onclick="this.parentElement.remove()">✕</button>
        `;

        const body = document.getElementById('exercise-body');
        body.parentElement.insertBefore(banner, body);

        // Show break overlay for fatigue
        if (msg.type === 'fatigued') {
            showBreakSuggestion();
        }

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            if (banner.parentElement) {
                banner.classList.add('session-banner-fade');
                setTimeout(() => banner.remove(), 500);
            }
        }, 6000);
    }

    function showBreakSuggestion() {
        const overlay = document.createElement('div');
        overlay.id = 'break-overlay';
        overlay.className = 'break-overlay';
        overlay.innerHTML = `
            <div class="break-overlay-content">
                <div class="break-overlay-icon">☕</div>
                <h3 class="break-overlay-title">Great work today, Valerie!</h3>
                <p class="break-overlay-text">You've been working hard! A short break helps your brain learn better.</p>
                <div class="break-overlay-buttons">
                    <button class="btn btn-primary" onclick="document.getElementById('break-overlay').remove()">Keep Going 💪</button>
                    <button class="btn btn-success" onclick="document.getElementById('break-overlay').remove(); Engine.goToMap();">Take a Break 🌟</button>
                </div>
            </div>
        `;
        document.getElementById('screen-exercise').appendChild(overlay);
    }

    function updateProgress() {
        const bar = document.getElementById('exercise-progress-bar');
        const text = document.getElementById('exercise-progress-text');
        const stars = document.getElementById('exercise-stars');
        const total = currentExercises.length;
        bar.style.width = `${(currentExIndex / total) * 100}%`;
        text.textContent = `Skill ${currentExIndex + 1} of ${total}`;
        stars.textContent = `⭐ ${score.correct}`;
    }

    return {
        Utils,

        /** @param {Partial<EngineNavigation>} handlers */
        configureNavigation(handlers) {
            navigation = { ...navigation, ...handlers };
        },

        goToMap() {
            navigation.showMap();
        },

        repeatPractice() {
            navigation.repeatLastPractice();
        },

        /**
         * Start a unit's exercises.
         *
         * @param {MathUnit} unit
         * @param {ExerciseDefinition[]} exercises
         */
        startUnit(unit, exercises) {
            currentUnit = unit;
            currentExercises = exercises;
            currentExIndex = 0;
            score = { correct: 0 };

            navigation.showScreen('screen-exercise');

            // Apply theme background
            const screen = document.getElementById('screen-exercise');
            screen.className = `screen active theme-bg-${unit.theme}`;

            updateProgress();
            this.loadExercise(0);
        },

        /**
         * Load a specific exercise.
         *
         * @param {number} index
         */
        loadExercise(index) {
            if (index >= currentExercises.length) {
                this.showResults();
                return;
            }
            currentExIndex = index;
            updateProgress();
            hideFeedback();

            const exercise = currentExercises[index];
            const skillId = exercise.skillId || `${currentUnit.id}_ex${index}`;
            let difficulty = Adaptive.getDifficulty(skillId);
            const sessionState = Adaptive.getSessionState();
            const modality = Adaptive.getModality(skillId);

            // Session adaptation: auto-lower difficulty when struggling
            if (sessionState === 'struggling' && difficulty > 1) {
                difficulty--;
            }

            const question = exercise.generate(difficulty, modality);
            question.skillId = skillId;

            // Show session notification if state changed
            const sessionMsg = Adaptive.getSessionMessage();
            if (sessionMsg) {
                showSessionBanner(sessionMsg);
            }

            renderQuestion(question);
        },

        /**
         * Continue after the feedback button is clicked.
         *
         * @param {boolean} wasCorrect
         */
        nextAfterFeedback(wasCorrect) {
            hideFeedback();
            if (wasCorrect || wrongAttempts >= 3) {
                currentExIndex++;
                if (currentExIndex >= currentExercises.length) {
                    this.showResults();
                } else {
                    this.loadExercise(currentExIndex);
                }
            } else {
                // Retry same question — preserve wrongAttempts so hint level escalates
                renderQuestion(currentQuestion, true);
            }
        },

        // Show results screen
        showResults() {
            const pct = currentExercises.length > 0 ? score.correct / currentExercises.length : 0;
            let starsEarned = 0;
            if (pct >= 0.9) starsEarned = 3;
            else if (pct >= 0.7) starsEarned = 2;
            else if (pct >= 0.4) starsEarned = 1;

            // Record in adaptive system (practice mode doesn't track unit-level completion)
            if (currentUnit.id !== 'practice') {
                const _unitState = Adaptive.getState().units[currentUnit.id] || { completed: [] };
                const _nextSlot = Math.min(_unitState.completed.length, currentUnit.exerciseCount - 1);
                Adaptive.completeExercise(currentUnit.id, _nextSlot, starsEarned);
                Adaptive.checkUnlocks(navigation.getAllUnits());
            }

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
                    ${currentUnit.id === 'practice'
                        ? `<button class="btn btn-primary" onclick="Engine.repeatPractice()">🔄 Practice Again</button>
                           <button class="btn btn-success" onclick="Engine.goToMap()">🗺️ Back to Map</button>`
                        : `<button class="btn btn-primary" onclick="Engine.startUnit(Engine.getCurrentUnit(), Engine.getCurrentUnit().getExercises())">🔄 Try Again</button>
                           <button class="btn btn-success" onclick="Engine.goToMap()">🗺️ Back to Map</button>`
                    }
                </div>
            `;

            navigation.showScreen('screen-results');
        },

        /** @returns {MathUnit|null} */
        getCurrentUnit() { return currentUnit; },

        /**
         * Start the practice zone with generated exercises.
         *
         * @param {ExerciseDefinition[]} questions
         */
        startPractice(questions) {
            currentUnit = {
                id: 'practice',
                title: 'Practice Zone',
                theme: 'swim',
                exerciseCount: questions.length,
                getExercises: () => questions
            };
            currentExercises = questions;
            currentExIndex = 0;
            score = { correct: 0 };
            navigation.showScreen('screen-exercise');
            updateProgress();
            this.loadExercise(0);
        }
    };
})();
