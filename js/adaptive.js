/* ===== ADAPTIVE LEARNING SYSTEM ===== */
/* Tracks mastery, manages difficulty, and builds practice queues */

const Adaptive = (() => {
    const STORAGE_KEY = 'valerie_math_progress';
    const MASTERY_STREAK = 3; // correct in a row to master
    const DIFFICULTY_UP_THRESHOLD = 3; // correct in a row → harder
    const DIFFICULTY_DOWN_THRESHOLD = 2; // wrong in a row → easier

    // Default session state (reset on every page load)
    const DEFAULT_SESSION = {
        currentStreak: 0,
        questionsAnswered: 0,
        correctThisSession: 0,
        wrongThisSession: 0,
        startTime: null,
        recentResults: [],       // sliding window of last 20 booleans
        sessionState: 'normal',  // 'normal' | 'struggling' | 'cruising' | 'fatigued'
        lastSessionMessage: null
    };

    // State loaded from localStorage
    let state = {
        // Per-unit progress: { unitId: { completed: [exerciseIndex], stars: {exerciseIndex: n}, currentExercise: 0 } }
        units: {},
        // Per-skill mastery: { skillId: { streak: 0, mastered: false, totalCorrect: 0, totalWrong: 0, difficulty: 1 } }
        skills: {},
        // Weakness queue: [ { skillId, unitId, question } ]
        weaknessQueue: [],
        // Total stars earned
        totalStars: 0,
        // Units unlocked (first 3 of each grade always unlocked)
        unlockedUnits: ['mult-intro', 'mult-1digit', 'add-sub', '4-place-value', '4-add-sub-estimation', '4-multiply-1digit'],
        // Current session
        session: { ...DEFAULT_SESSION }
    };

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* quota exceeded etc */ }
    }

    const DEFAULT_UNLOCKED = ['mult-intro', 'mult-1digit', 'add-sub', '4-place-value', '4-add-sub-estimation', '4-multiply-1digit'];

    function load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                // Ensure default unlocked units are always present
                DEFAULT_UNLOCKED.forEach(id => {
                    if (!state.unlockedUnits.includes(id)) {
                        state.unlockedUnits.push(id);
                    }
                });
            }
        } catch (e) { /* parse error */ }
        // Always reset session on load (new session each page visit)
        state.session = { ...DEFAULT_SESSION };
    }

    function getSkill(skillId) {
        if (!state.skills[skillId]) {
            state.skills[skillId] = {
                streak: 0,
                mastered: false,
                totalCorrect: 0,
                totalWrong: 0,
                difficulty: 1, // 1 = easy, 2 = medium, 3 = hard
                lastAttempt: null,
                wrongAnswers: [],   // [{ userAnswer, correctAnswer, timestamp }] capped at 20
                misconceptions: {}  // { 'label': count }
            };
        }
        // Migrate existing skills missing new fields
        const skill = state.skills[skillId];
        if (!skill.wrongAnswers) skill.wrongAnswers = [];
        if (!skill.misconceptions) skill.misconceptions = {};
        return skill;
    }

    function getUnit(unitId) {
        if (!state.units[unitId]) {
            state.units[unitId] = {
                completed: [],
                stars: {},
                currentExercise: 0,
                bestScore: 0
            };
        }
        return state.units[unitId];
    }

    // --- Misconception Detection ---
    function detectGenericMisconception(userAnswer, correctAnswer, skillId) {
        if (typeof userAnswer !== 'number' || typeof correctAnswer !== 'number') return null;
        if (Math.abs(userAnswer - correctAnswer) === 1) return 'off-by-one';
        if (skillId.startsWith('mult') && userAnswer < correctAnswer && userAnswer > 0) {
            return 'added-instead-of-multiplied';
        }
        if (userAnswer === correctAnswer * 10 || userAnswer * 10 === correctAnswer) return 'place-value';
        if (skillId.startsWith('div') && correctAnswer !== 0 && userAnswer !== 0) {
            return 'reversed-division';
        }
        return null;
    }

    // --- Session State Machine ---
    function updateSessionState() {
        const s = state.session;
        const total = s.questionsAnswered;
        const accuracy = total > 0 ? s.correctThisSession / total : 1;
        const recent = s.recentResults;

        if (total < 4) { s.sessionState = 'normal'; return; }

        if (accuracy < 0.5 && total >= 4) { s.sessionState = 'struggling'; return; }
        if (accuracy >= 0.9 && total >= 5) { s.sessionState = 'cruising'; return; }

        if (recent.length >= 10) {
            const firstHalf = recent.slice(0, 5);
            const lastFive = recent.slice(-5);
            const firstAcc = firstHalf.filter(Boolean).length / firstHalf.length;
            const lastAcc = lastFive.filter(Boolean).length / lastFive.length;
            if (firstAcc - lastAcc >= 0.3) { s.sessionState = 'fatigued'; return; }
        }

        s.sessionState = 'normal';
    }

    return {
        load,
        save,
        getState() { return state; },

        // Reset all progress
        reset() {
            localStorage.removeItem(STORAGE_KEY);
            state = {
                units: {}, skills: {}, weaknessQueue: [],
                totalStars: 0,
                unlockedUnits: ['mult-intro', 'mult-1digit', 'add-sub', '4-place-value', '4-add-sub-estimation', '4-multiply-1digit'],
                session: { ...DEFAULT_SESSION }
            };
        },

        // Record a correct answer
        recordCorrect(skillId, unitId) {
            const skill = getSkill(skillId);
            skill.streak++;
            skill.totalCorrect++;
            skill.lastAttempt = Date.now();
            state.session.currentStreak++;
            state.session.questionsAnswered++;
            state.session.correctThisSession++;
            if (!state.session.startTime) state.session.startTime = Date.now();
            state.session.recentResults.push(true);
            if (state.session.recentResults.length > 20) state.session.recentResults.shift();
            updateSessionState();

            // Check mastery
            if (skill.streak >= MASTERY_STREAK) {
                skill.mastered = true;
            }

            // Difficulty scaling up
            if (skill.streak >= DIFFICULTY_UP_THRESHOLD && skill.difficulty < 3) {
                skill.difficulty++;
            }

            // Remove from weakness queue if mastered
            if (skill.mastered) {
                state.weaknessQueue = state.weaknessQueue.filter(q => q.skillId !== skillId);
            }

            save();
            return {
                streak: skill.streak,
                mastered: skill.mastered,
                difficulty: skill.difficulty
            };
        },

        // Record a wrong answer
        recordWrong(skillId, unitId, userAnswer, questionData) {
            const skill = getSkill(skillId);
            skill.streak = 0; // Reset streak
            skill.totalWrong++;
            skill.mastered = false;
            skill.lastAttempt = Date.now();
            state.session.currentStreak = 0;
            state.session.questionsAnswered++;
            state.session.wrongThisSession++;
            if (!state.session.startTime) state.session.startTime = Date.now();
            state.session.recentResults.push(false);
            if (state.session.recentResults.length > 20) state.session.recentResults.shift();
            updateSessionState();

            // Misconception detection
            if (userAnswer !== undefined && questionData) {
                skill.wrongAnswers.push({
                    userAnswer,
                    correctAnswer: questionData.answer,
                    timestamp: Date.now()
                });
                if (skill.wrongAnswers.length > 20) {
                    skill.wrongAnswers = skill.wrongAnswers.slice(-20);
                }

                // Use exercise-specific diagnose if provided, else generic
                let label = null;
                if (questionData.diagnose) {
                    label = questionData.diagnose(userAnswer, questionData.answer, questionData);
                } else {
                    label = detectGenericMisconception(userAnswer, questionData.answer, skillId);
                }
                if (label) {
                    skill.misconceptions[label] = (skill.misconceptions[label] || 0) + 1;
                }
            }

            // Difficulty scaling down
            if (skill.totalWrong > 0 && skill.totalWrong % DIFFICULTY_DOWN_THRESHOLD === 0 && skill.difficulty > 1) {
                skill.difficulty--;
            }

            // Add to weakness queue (avoid duplicates)
            const exists = state.weaknessQueue.some(q => q.skillId === skillId);
            if (!exists) {
                state.weaknessQueue.push({
                    skillId,
                    unitId,
                    addedAt: Date.now()
                });
            }

            save();
            return {
                streak: 0,
                difficulty: skill.difficulty,
                hintLevel: Math.min(skill.totalWrong, 3),
                misconceptions: skill.misconceptions
            };
        },

        // Get current difficulty for a skill
        getDifficulty(skillId) {
            return getSkill(skillId).difficulty;
        },

        // Check if a skill is mastered
        isMastered(skillId) {
            return getSkill(skillId).mastered;
        },

        // Get hint level based on consecutive wrongs
        getHintLevel(skillId) {
            const skill = getSkill(skillId);
            if (skill.streak > 0) return 0; // No hint if they got the last one right
            return Math.min(3 - skill.streak, 3); // more wrongs = more hints (capped at 3)
        },

        // Record exercise completion and stars
        completeExercise(unitId, exerciseIndex, starsEarned) {
            const unit = getUnit(unitId);
            if (!unit.completed.includes(exerciseIndex)) {
                unit.completed.push(exerciseIndex);
            }
            const prevStars = unit.stars[exerciseIndex] || 0;
            unit.stars[exerciseIndex] = Math.max(prevStars, starsEarned);

            // Recalculate total stars
            state.totalStars = 0;
            for (const uid in state.units) {
                for (const eidx in state.units[uid].stars) {
                    state.totalStars += state.units[uid].stars[eidx];
                }
            }

            save();
        },

        // Check if a unit is unlocked
        isUnitUnlocked(unitId) {
            return state.unlockedUnits.includes(unitId);
        },

        // Unlock the next unit(s) based on progress
        checkUnlocks(allUnits) {
            // Unlock next unit when previous has >= 50% exercises completed
            for (let i = 0; i < allUnits.length; i++) {
                const uid = allUnits[i].id;
                if (state.unlockedUnits.includes(uid)) {
                    const unit = getUnit(uid);
                    const total = allUnits[i].exerciseCount || 7;
                    if (unit.completed.length >= Math.ceil(total * 0.5)) {
                        // Unlock next unit
                        if (i + 1 < allUnits.length && !state.unlockedUnits.includes(allUnits[i + 1].id)) {
                            state.unlockedUnits.push(allUnits[i + 1].id);
                            save();
                        }
                    }
                }
            }
        },

        // Get unit progress
        getUnitProgress(unitId, totalExercises) {
            const unit = getUnit(unitId);
            return {
                completed: unit.completed.length,
                total: totalExercises,
                percent: Math.round((unit.completed.length / totalExercises) * 100),
                stars: Object.values(unit.stars).reduce((a, b) => a + b, 0),
                maxStars: totalExercises * 3
            };
        },

        // Get weakness queue for practice zone
        getWeaknessQueue() {
            return [...state.weaknessQueue];
        },

        // Get total stars
        getTotalStars() {
            return state.totalStars;
        },

        // Get encouragement message based on performance
        getEncouragement(isCorrect) {
            const correct = [
                "Amazing job, Valerie! 🌟",
                "You're a math superstar! ⭐",
                "Nailed it! Keep going! 🎉",
                "Wow, you're so smart! 🧠✨",
                "Perfect, Valerie! 💪",
                "You're on fire! 🔥",
                "Incredible work! 🏆",
                "That's the way to do it! 🎯",
                "You make math look easy! 😎",
                "Brilliant, Valerie! 💎"
            ];
            const incorrect = [
                "Your brain just grew a little! 🧠",
                "Every mistake teaches something new! 🌱",
                "That's how scientists learn — by testing ideas! 🔬",
                "Ooh, interesting! Let's think about this! 🤔",
                "You're training your brain right now! 💪",
                "Great effort! Learning takes practice! 🌟",
                "Not yet — but you're getting closer! 📈",
                "Mistakes are proof you're trying! ✨"
            ];
            const arr = isCorrect ? correct : incorrect;
            return arr[Math.floor(Math.random() * arr.length)];
        },

        // Get recovery message (correct after wrong attempts)
        getRecoveryMessage() {
            const recovery = [
                "You figured it out! That's real learning! 🌟",
                "See? You CAN do it! Persistence pays off! 💪",
                "You didn't give up — and THAT is what matters! 🏆",
                "Your brain just made a new connection! 🧠✨",
                "From tricky to triumph! Amazing! 🎉"
            ];
            return recovery[Math.floor(Math.random() * recovery.length)];
        },

        // Get streak messages
        getStreakMessage() {
            const s = state.session.currentStreak;
            if (s >= 10) return "🔥 UNSTOPPABLE! 10 in a row!";
            if (s >= 7) return "🌟 AMAZING STREAK! 7 in a row!";
            if (s >= 5) return "⚡ On a roll! 5 in a row!";
            if (s >= 3) return "✨ Nice streak! 3 in a row!";
            return null;
        },

        // Get session stats
        getSessionStats() {
            return { ...state.session };
        },

        // --- Misconception API ---
        getMisconceptions(skillId) {
            return { ...getSkill(skillId).misconceptions };
        },

        getTopMisconception(skillId) {
            const m = getSkill(skillId).misconceptions;
            let top = null, topCount = 0;
            for (const label in m) {
                if (m[label] > topCount) { top = label; topCount = m[label]; }
            }
            return top;
        },

        // --- Session State API ---
        getSessionState() {
            return state.session.sessionState || 'normal';
        },

        getSessionMessage() {
            const ss = state.session.sessionState;
            const last = state.session.lastSessionMessage;
            if (ss === last) return null;
            state.session.lastSessionMessage = ss;
            switch (ss) {
                case 'struggling':
                    return { type: 'struggling', text: "Let's slow down a bit! You've got this!", icon: '🐢' };
                case 'cruising':
                    return { type: 'cruising', text: "You're doing amazing! Want to try harder ones?", icon: '⭐' };
                case 'fatigued':
                    return { type: 'fatigued', text: "Great work today! Maybe take a short break?", icon: '☕' };
                default:
                    return null;
            }
        },

        // --- Modality API ---
        getModality(skillId) {
            const skill = getSkill(skillId);
            const sessionState = state.session.sessionState;

            // Struggling session: always worked-example
            if (sessionState === 'struggling') return 'worked-example';

            // Misconceptions detected: use visual scaffolding
            const misconceptionCount = Object.values(skill.misconceptions || {}).reduce((a, b) => a + b, 0);
            if (misconceptionCount >= 2) return 'visual';

            // Skill has more wrongs than rights: worked-example
            if (skill.totalWrong > skill.totalCorrect && skill.totalWrong >= 3) return 'worked-example';

            return 'practice';
        }
    };
})();
