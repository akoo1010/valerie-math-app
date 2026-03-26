/* ===== ADAPTIVE LEARNING SYSTEM ===== */
/* Tracks mastery, manages difficulty, and builds practice queues */

const Adaptive = (() => {
    const STORAGE_KEY = 'valerie_math_progress';
    const MASTERY_STREAK = 3; // correct in a row to master
    const DIFFICULTY_UP_THRESHOLD = 3; // correct in a row → harder
    const DIFFICULTY_DOWN_THRESHOLD = 2; // wrong in a row → easier

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
        // Units unlocked (first 3 always unlocked)
        unlockedUnits: ['mult-intro', 'mult-1digit', 'add-sub'],
        // Current session
        session: {
            currentStreak: 0,
            questionsAnswered: 0,
            correctThisSession: 0
        }
    };

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* quota exceeded etc */ }
    }

    function load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
        } catch (e) { /* parse error */ }
    }

    function getSkill(skillId) {
        if (!state.skills[skillId]) {
            state.skills[skillId] = {
                streak: 0,
                mastered: false,
                totalCorrect: 0,
                totalWrong: 0,
                difficulty: 1, // 1 = easy, 2 = medium, 3 = hard
                lastAttempt: null
            };
        }
        return state.skills[skillId];
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
                unlockedUnits: ['mult-intro', 'mult-1digit', 'add-sub'],
                session: { currentStreak: 0, questionsAnswered: 0, correctThisSession: 0 }
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
        recordWrong(skillId, unitId, questionData) {
            const skill = getSkill(skillId);
            skill.streak = 0; // Reset streak
            skill.totalWrong++;
            skill.mastered = false;
            skill.lastAttempt = Date.now();
            state.session.currentStreak = 0;
            state.session.questionsAnswered++;

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
                hintLevel: Math.min(skill.totalWrong, 3) // 1, 2, or 3 level hint
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
                "Almost there, Valerie! Try again! 💪",
                "Don't give up! You've got this! 🌟",
                "Good try! Let's figure it out together! 🤔",
                "That's okay! Mistakes help us learn! 📚",
                "So close! Let's try one more time! 🎯",
                "You're learning! That's what matters! 💫",
                "Keep going, Valerie! You can do it! 🚀",
                "Not quite — let's look at this together! 👀"
            ];
            const arr = isCorrect ? correct : incorrect;
            return arr[Math.floor(Math.random() * arr.length)];
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
        }
    };
})();
