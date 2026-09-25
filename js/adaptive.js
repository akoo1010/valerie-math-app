/* ===== ADAPTIVE LEARNING SYSTEM ===== */
/* Tracks mastery, manages difficulty, and builds practice queues */
/// <reference path="./types.js" />

const Adaptive = (() => {
    const STORAGE_KEY = 'valerie_math_progress';
    const MASTERY_STREAK = 3; // correct in a row to master
    const DIFFICULTY_UP_THRESHOLD = 3; // correct in a row → harder
    const DIFFICULTY_DOWN_THRESHOLD = 2; // wrong in a row → easier

    /**
     * Per-visit session tracking. Built fresh every time — spreading a shared default
     * object would alias `recentResults`, leaking results across session resets.
     * @returns {SessionSnapshot}
     */
    function freshSession() {
        return {
            currentStreak: 0,
            questionsAnswered: 0,
            correctThisSession: 0,
            wrongThisSession: 0,
            startTime: null,
            recentResults: [],       // sliding window of last 20 booleans
            sessionState: 'normal',  // 'normal' | 'struggling' | 'cruising' | 'fatigued'
            lastSessionMessage: null
        };
    }

    /**
     * Per-day goal tracking. Unlike the session (per-visit, discarded on load),
     * this persists so "today" survives a reload and drives the day-dots.
     * @returns {DailyProgress}
     */
    function freshDaily() {
        return {
            date: null,          // 'YYYY-MM-DD' the counters below belong to
            answeredToday: 0,
            correctToday: 0,
            goal: 20,            // questions/day that count as "done for today"
            goalCelebrated: false, // so the finish-line band shows once per day
            recentDays: []       // dates practiced; the 7 most recent drive the dots
        };
    }

    /** @returns {SkillProgress} */
    function createDefaultSkill() {
        return {
            streak: 0,
            mastered: false,
            totalCorrect: 0,
            totalWrong: 0,
            difficulty: 1, // 1 = easy, 2 = medium, 3 = hard
            lastAttempt: null,
            wrongAnswers: [],   // [{ userAnswer, correctAnswer, timestamp }] capped at 20
            misconceptions: {}, // { 'label': count }
            consecutiveCorrect: 0, // resets when difficulty bumps up
            consecutiveWrong: 0    // resets when difficulty bumps down
        };
    }

    const DEFAULT_UNLOCKED = ['mult-intro', 'mult-1digit', 'add-sub', '4-place-value', '4-add-sub-estimation', '4-multiply-1digit'];

    /** @returns {ProgressState} */
    function createDefaultState() {
        return {
            units: {},
            skills: {},
            weaknessQueue: [],
            totalStars: 0,
            unlockedUnits: [...DEFAULT_UNLOCKED],
            updatedAt: 0, // ms timestamp of the last save; used to resolve device/offline conflicts
            daily: freshDaily(),
            session: freshSession()
        };
    }

    /** @type {ProgressState} */
    let state = createDefaultState();

    let _saveTimer = null;
    // False until load() settles. The splash stays interactive while the cloud
    // copy is fetched, so an answer given in that window would otherwise persist
    // the empty default state with a fresh updatedAt — which load() then picks as
    // "newest" and pushes to the server, wiping her real progress.
    let _loaded = false;

    function isPlainObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function clampInteger(value, min, max) {
        if (typeof value !== 'number' || !Number.isFinite(value)) return min;
        const n = Math.trunc(value);
        return Math.min(max, Math.max(min, n));
    }

    function toNonNegativeInteger(value, fallback = 0) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return fallback;
        return Math.trunc(value);
    }

    function toTimestampOrNull(value) {
        return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
    }

    function isAnswerValue(value) {
        return value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
    }

    function normalizeStringArray(value) {
        if (!Array.isArray(value)) return [];
        return [...new Set(value.filter(item => typeof item === 'string' && item.length > 0))];
    }

    function normalizeUnitProgress(value) {
        if (!isPlainObject(value)) {
            return { completed: [], stars: {} };
        }

        const completed = Array.isArray(value.completed)
            ? [...new Set(value.completed.map(n => toNonNegativeInteger(n, -1)).filter(n => n >= 0))]
            : [];

        const stars = {};
        if (isPlainObject(value.stars)) {
            Object.entries(value.stars).forEach(([exerciseIndex, starCount]) => {
                if (/^\d+$/.test(exerciseIndex)) {
                    stars[exerciseIndex] = clampInteger(starCount, 0, 3);
                }
            });
        }

        return {
            completed,
            stars
        };
    }

    function normalizeSkillProgress(value) {
        if (!isPlainObject(value)) return createDefaultSkill();

        const wrongAnswers = Array.isArray(value.wrongAnswers)
            ? value.wrongAnswers
                .filter(record => (
                    isPlainObject(record) &&
                    isAnswerValue(record.userAnswer) &&
                    isAnswerValue(record.correctAnswer) &&
                    typeof record.timestamp === 'number' &&
                    Number.isFinite(record.timestamp)
                ))
                .slice(-20)
                .map(record => ({
                    userAnswer: record.userAnswer,
                    correctAnswer: record.correctAnswer,
                    timestamp: record.timestamp
                }))
            : [];

        const misconceptions = {};
        if (isPlainObject(value.misconceptions)) {
            Object.entries(value.misconceptions).forEach(([label, count]) => {
                if (typeof label === 'string' && label.length > 0) {
                    misconceptions[label] = toNonNegativeInteger(count);
                }
            });
        }

        return {
            streak: toNonNegativeInteger(value.streak),
            mastered: value.mastered === true,
            totalCorrect: toNonNegativeInteger(value.totalCorrect),
            totalWrong: toNonNegativeInteger(value.totalWrong),
            difficulty: clampInteger(value.difficulty, 1, 3),
            lastAttempt: toTimestampOrNull(value.lastAttempt),
            wrongAnswers,
            misconceptions,
            consecutiveCorrect: toNonNegativeInteger(value.consecutiveCorrect),
            consecutiveWrong: toNonNegativeInteger(value.consecutiveWrong)
        };
    }

    function normalizeWeaknessQueue(value) {
        if (!Array.isArray(value)) return [];
        const seen = new Set();
        return value
            .filter(item => (
                isPlainObject(item) &&
                typeof item.skillId === 'string' &&
                item.skillId.length > 0 &&
                typeof item.unitId === 'string' &&
                item.unitId.length > 0
            ))
            .filter(item => {
                if (seen.has(item.skillId)) return false;
                seen.add(item.skillId);
                return true;
            })
            .map(item => ({
                skillId: item.skillId,
                unitId: item.unitId,
                addedAt: toNonNegativeInteger(item.addedAt, Date.now())
            }));
    }

    function normalizeDaily(value) {
        if (!isPlainObject(value)) return freshDaily();
        const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
        const recentDays = Array.isArray(value.recentDays)
            ? [...new Set(value.recentDays.filter(isDate))].slice(-30)
            : [];
        return {
            date: isDate(value.date) ? value.date : null,
            answeredToday: toNonNegativeInteger(value.answeredToday),
            correctToday: toNonNegativeInteger(value.correctToday),
            goal: (typeof value.goal === 'number' && Number.isFinite(value.goal) && value.goal > 0)
                ? clampInteger(value.goal, 5, 100) : 20,
            goalCelebrated: value.goalCelebrated === true,
            recentDays
        };
    }

    function normalizeSession(value) {
        if (!isPlainObject(value)) return freshSession();
        const sessionState = ['normal', 'struggling', 'cruising', 'fatigued'].includes(value.sessionState)
            ? value.sessionState
            : 'normal';

        return {
            currentStreak: toNonNegativeInteger(value.currentStreak),
            questionsAnswered: toNonNegativeInteger(value.questionsAnswered),
            correctThisSession: toNonNegativeInteger(value.correctThisSession),
            wrongThisSession: toNonNegativeInteger(value.wrongThisSession),
            startTime: toTimestampOrNull(value.startTime),
            recentResults: Array.isArray(value.recentResults) ? value.recentResults.filter(v => typeof v === 'boolean').slice(-20) : [],
            sessionState,
            lastSessionMessage: typeof value.lastSessionMessage === 'string' ? value.lastSessionMessage : null
        };
    }

    /**
     * Convert unknown persisted JSON into the exact progress shape the app uses.
     * @param {unknown} value
     * @returns {ProgressState|null}
     */
    function normalizeProgressState(value) {
        if (!isPlainObject(value)) return null;
        const hasProgressShape = ['units', 'skills', 'weaknessQueue', 'totalStars', 'unlockedUnits', 'session']
            .some(key => Object.prototype.hasOwnProperty.call(value, key));
        if (!hasProgressShape) return null;

        const normalized = createDefaultState();

        if (isPlainObject(value.units)) {
            Object.entries(value.units).forEach(([unitId, unitProgress]) => {
                if (typeof unitId === 'string' && unitId.length > 0) {
                    normalized.units[unitId] = normalizeUnitProgress(unitProgress);
                }
            });
        }

        if (isPlainObject(value.skills)) {
            Object.entries(value.skills).forEach(([skillId, skillProgress]) => {
                if (typeof skillId === 'string' && skillId.length > 0) {
                    normalized.skills[skillId] = normalizeSkillProgress(skillProgress);
                }
            });
        }

        normalized.weaknessQueue = normalizeWeaknessQueue(value.weaknessQueue);
        normalized.totalStars = toNonNegativeInteger(value.totalStars);
        normalized.unlockedUnits = [...new Set([...DEFAULT_UNLOCKED, ...normalizeStringArray(value.unlockedUnits)])];
        normalized.updatedAt = toNonNegativeInteger(value.updatedAt, 0);
        normalized.daily = normalizeDaily(value.daily);
        normalized.session = normalizeSession(value.session);

        return normalized;
    }

    function save() {
        if (!_loaded) return; // see _loaded: never persist the pre-load placeholder state
        state.updatedAt = Date.now(); // stamp before persisting so both copies carry the same recency
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* quota exceeded */ }

        // Debounce API sync: wait 1s after last save to batch rapid updates
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(() => {
            fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state)
            }).catch(() => { /* ignore network errors */ });
        }, 1000);
    }

    /** @returns {Promise<ProgressState|null>} */
    async function loadFromServer() {
        // Time-box the load so a hanging or captive network can't freeze boot.
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 3000) : null;
        try {
            const res = await fetch('/api/progress', controller ? { signal: controller.signal } : undefined);
            if (res.ok) {
                return normalizeProgressState(await res.json());
            }
        } catch (e) { /* network error or 3s timeout */ }
        finally {
            if (timer) clearTimeout(timer);
        }
        return null;
    }

    /** @returns {ProgressState|null} */
    function loadFromLocal() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return normalizeProgressState(JSON.parse(saved));
        } catch (e) { /* parse error */ }
        return null;
    }

    /**
     * Push the current in-memory state up to the API immediately, bypassing the
     * save debounce. Used on load when the local copy is newer than the server's
     * (e.g. an offline session whose debounced POSTs never reached KV) so the
     * server catches up instead of overwriting local progress on the next visit.
     */
    function syncUp() {
        try {
            fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state)
            }).catch(() => { /* ignore network errors */ });
        } catch (e) { /* ignore */ }
    }

    /**
     * Resolve progress from BOTH the API and localStorage, keeping whichever was
     * written most recently (by `updatedAt`). This prevents a stale server copy
     * from clobbering an offline session's progress — and vice versa. Resolves
     * once the winning copy is applied.
     *
     * @returns {Promise<void>}
     */
    async function load() {
        const serverState = await loadFromServer();
        const localState = loadFromLocal();

        const localNewer = !!localState &&
            (!serverState || (localState.updatedAt || 0) > (serverState.updatedAt || 0));
        const chosen = localNewer ? localState : (serverState || localState);

        if (chosen) {
            state = chosen;
            // Mirror the winning copy into localStorage.
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* quota */ }
            // Local was ahead of the server — bring the server up to date.
            if (localNewer) syncUp();
        }

        state.session = freshSession();
        rolloverDaily(); // start "today" fresh if the saved copy is from a previous day
        _loaded = true;
    }

    /**
     * @param {string} skillId
     * @returns {SkillProgress}
     */
    function getSkill(skillId) {
        if (!state.skills[skillId]) {
            state.skills[skillId] = createDefaultSkill();
        }
        return state.skills[skillId];
    }

    /**
     * Fade the scaffold: decrement the skill's largest misconception count (and
     * drop it at zero). Called on every correct answer so a recovered skill can
     * graduate back out of 'visual' / 'worked-example' modality instead of being
     * pinned there permanently by an increment-only counter.
     *
     * @param {SkillProgress} skill
     */
    function decayTopMisconception(skill) {
        const m = skill.misconceptions;
        let top = null, topCount = 0;
        for (const label in m) {
            if (m[label] > topCount) { top = label; topCount = m[label]; }
        }
        if (top) {
            if (m[top] <= 1) delete m[top];
            else m[top] -= 1;
        }
    }

    /**
     * @param {string} unitId
     * @returns {UnitProgress}
     */
    function getUnit(unitId) {
        if (!state.units[unitId]) {
            state.units[unitId] = {
                completed: [],
                stars: {}
            };
        }
        return state.units[unitId];
    }

    // --- Misconception Detection ---
    /**
     * @param {AnswerValue} userAnswer
     * @param {AnswerValue} correctAnswer
     * @param {string} skillId
     * @returns {string|null}
     */
    function detectGenericMisconception(userAnswer, correctAnswer, skillId) {
        if (typeof userAnswer !== 'number' || typeof correctAnswer !== 'number') return null;
        // Only label errors we can actually verify from (userAnswer, correctAnswer)
        // alone. The old 'added-instead-of-multiplied' / 'reversed-division'
        // branches fired on ANY undershoot / any nonzero wrong answer without
        // checking the operands, mislabelling most misses — units that can check
        // the operands return those labels from their own diagnose() instead.
        if (Math.abs(userAnswer - correctAnswer) === 1) return 'off-by-one';
        if (userAnswer === correctAnswer * 10 || userAnswer * 10 === correctAnswer) return 'place-value';
        return null;
    }

    // --- Session State Machine ---
    function updateSessionState() {
        const s = state.session;
        const total = s.questionsAnswered;
        const accuracy = total > 0 ? s.correctThisSession / total : 1;
        const recent = s.recentResults;

        if (total < 4) { s.sessionState = 'normal'; return; }

        if (accuracy < 0.5) { s.sessionState = 'struggling'; return; }
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

    // Local calendar date as 'YYYY-MM-DD'.
    function todayStr() {
        const d = new Date();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${m}-${day}`;
    }

    // Reset today's counters when the calendar day changes. Does not persist by
    // itself — the caller saves, or the next save picks it up.
    function rolloverDaily() {
        const daily = state.daily;
        const today = todayStr();
        if (daily.date !== today) {
            daily.date = today;
            daily.answeredToday = 0;
            daily.correctToday = 0;
            daily.goalCelebrated = false;
        }
    }

    function recordSessionResult(isCorrect) {
        const session = state.session;
        session.currentStreak = isCorrect ? session.currentStreak + 1 : 0;
        session.questionsAnswered++;
        if (isCorrect) {
            session.correctThisSession++;
        } else {
            session.wrongThisSession++;
        }
        if (!session.startTime) session.startTime = Date.now();
        session.recentResults.push(isCorrect);
        if (session.recentResults.length > 20) session.recentResults.shift();
        updateSessionState();
    }

    return {
        load,
        /** @returns {ProgressState} */
        getState() { return state; },

        /**
         * Record a correct answer for a skill.
         *
         * @param {string} skillId
         * @param {string} unitId
         * @param {boolean} [isFirstAttempt] false when she got it right on a retry
         */
        recordCorrect(skillId, unitId, isFirstAttempt = true) {
            const skill = getSkill(skillId);
            skill.streak++;
            skill.consecutiveCorrect++;
            skill.consecutiveWrong = 0;
            skill.totalCorrect++;
            skill.lastAttempt = Date.now();
            recordSessionResult(true);

            // Fade any logged misconception so scaffolding lifts as she recovers.
            // Only on a first-try correct: a retry-correct on the same question
            // would otherwise erase the misconception that question just logged,
            // so the visual scaffold (2+ misconceptions) could never engage.
            if (isFirstAttempt) decayTopMisconception(skill);

            // Check mastery
            if (skill.streak >= MASTERY_STREAK) {
                skill.mastered = true;
            }

            // Difficulty scaling up — only when threshold met, then reset the consecutive counter
            if (skill.consecutiveCorrect >= DIFFICULTY_UP_THRESHOLD && skill.difficulty < 3) {
                skill.difficulty++;
                skill.consecutiveCorrect = 0;
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

        /**
         * Record a wrong answer and update misconception tracking.
         *
         * @param {string} skillId
         * @param {string} unitId
         * @param {AnswerValue} userAnswer
         * @param {ExerciseQuestion} questionData
         */
        recordWrong(skillId, unitId, userAnswer, questionData, isFirstAttempt = true) {
            const skill = getSkill(skillId);

            // Only the FIRST wrong attempt on a question mutates adaptive state.
            // The engine allows up to 3 attempts per question and re-invokes this
            // on each; counting every retry would record one miss as several
            // distinct wrongs — demoting difficulty mid-question, inflating
            // totalWrong/misconception counts, and tripping the scaffold-modality
            // escalations off a single bad guess. Retries return the current
            // snapshot without changing anything.
            if (!isFirstAttempt) {
                return {
                    streak: skill.streak,
                    difficulty: skill.difficulty,
                    hintLevel: Math.min(skill.totalWrong, 3),
                    misconceptions: skill.misconceptions,
                    lastMisconception: null
                };
            }

            skill.streak = 0; // Reset streak
            skill.consecutiveCorrect = 0;
            skill.consecutiveWrong++;
            skill.totalWrong++;
            skill.mastered = false;
            skill.lastAttempt = Date.now();
            recordSessionResult(false);

            // Misconception detection. `label` is hoisted so it can be returned
            // to the engine, which uses the misconception diagnosed on THIS answer
            // to pick a targeted hint (rather than the skill's all-time favorite).
            let label = null;
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
                if (questionData.diagnose) {
                    label = questionData.diagnose(userAnswer, questionData.answer, questionData);
                } else {
                    label = detectGenericMisconception(userAnswer, questionData.answer, skillId);
                }
                if (label) {
                    skill.misconceptions[label] = (skill.misconceptions[label] || 0) + 1;
                }
            }

            // Difficulty scaling down — only on consecutive wrongs, reset counter on bump
            if (skill.consecutiveWrong >= DIFFICULTY_DOWN_THRESHOLD && skill.difficulty > 1) {
                skill.difficulty--;
                skill.consecutiveWrong = 0;
            }

            // Add to weakness queue (avoid duplicates).
            // Skip free-practice modes (e.g. multiplication tables) — they don't belong to a unit.
            const exists = state.weaknessQueue.some(q => q.skillId === skillId);
            if (!exists && !skillId.startsWith('mult-tables')) {
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
                misconceptions: skill.misconceptions,
                lastMisconception: label
            };
        },

        // Get current difficulty for a skill
        getDifficulty(skillId) {
            return getSkill(skillId).difficulty;
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

        /**
         * Unlock the next unit(s) based on progress.
         *
         * @param {MathUnit[]} allUnits
         */
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

        // Get unit progress. Clamped so stale saves (e.g. a unit that shrank)
        // can't report more than 100% or more stars than the unit allows.
        getUnitProgress(unitId, totalExercises) {
            const unit = getUnit(unitId);
            const completed = Math.min(unit.completed.length, totalExercises);
            const maxStars = totalExercises * 3;
            const stars = Object.values(unit.stars).reduce((a, b) => a + b, 0);
            return {
                completed,
                total: totalExercises,
                percent: Math.round((completed / totalExercises) * 100),
                stars: Math.min(stars, maxStars),
                maxStars
            };
        },

        /** @returns {WeaknessQueueItem[]} */
        getWeaknessQueue() {
            return [...state.weaknessQueue];
        },

        // Get total stars
        getTotalStars() {
            return state.totalStars;
        },

        // --- Daily goal API ---
        /**
         * Count one resolved question toward today's goal. Call once per question
         * (not per attempt). Returns today's progress and whether THIS question
         * tipped her across the goal.
         *
         * @param {boolean} wasCorrect
         */
        recordDailyQuestion(wasCorrect) {
            rolloverDaily();
            const daily = state.daily;
            const before = daily.answeredToday;
            daily.answeredToday++;
            if (wasCorrect) daily.correctToday++;
            if (!daily.recentDays.includes(daily.date)) {
                daily.recentDays.push(daily.date);
                if (daily.recentDays.length > 30) daily.recentDays = daily.recentDays.slice(-30);
            }
            save();
            return {
                answeredToday: daily.answeredToday,
                goal: daily.goal,
                justReached: before < daily.goal && daily.answeredToday >= daily.goal
            };
        },

        /** @returns {{date:string|null, answeredToday:number, correctToday:number, goal:number, goalCelebrated:boolean, reached:boolean}} */
        getDaily() {
            rolloverDaily();
            const d = state.daily;
            return {
                date: d.date,
                answeredToday: d.answeredToday,
                correctToday: d.correctToday,
                goal: d.goal,
                goalCelebrated: d.goalCelebrated,
                reached: d.answeredToday >= d.goal
            };
        },

        // Mark today's goal celebration as shown, so the finish-line band appears once.
        markGoalCelebrated() {
            state.daily.goalCelebrated = true;
            save();
        },

        /**
         * Booleans for the last `n` calendar days (oldest first), true if practiced.
         * @param {number} [n]
         * @returns {boolean[]}
         */
        getRecentDayDots(n = 7) {
            const practiced = new Set(state.daily.recentDays);
            const base = new Date();
            const out = [];
            for (let i = n - 1; i >= 0; i--) {
                const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                out.push(practiced.has(`${d.getFullYear()}-${m}-${day}`));
            }
            return out;
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

        // --- Misconception API ---
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

        /** @returns {SessionMessage|null} */
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

        // --- Backup API ---
        /**
         * Build a serializable snapshot of everything worth restoring:
         * unit completion, skill mastery, the wrong-answer / misconception
         * "study notes" that drive Practice Zone, and the unlock list.
         * The in-memory session is deliberately omitted — it's per-device.
         *
         * @returns {{ format: 'valerie-math-progress', version: number, exportedAt: string, progress: Omit<ProgressState, 'session'> }}
         */
        exportSnapshot() {
            const progress = {
                units: JSON.parse(JSON.stringify(state.units)),
                skills: JSON.parse(JSON.stringify(state.skills)),
                weaknessQueue: JSON.parse(JSON.stringify(state.weaknessQueue)),
                totalStars: state.totalStars,
                unlockedUnits: [...state.unlockedUnits]
            };
            return {
                format: 'valerie-math-progress',
                version: 1,
                exportedAt: new Date().toISOString(),
                progress
            };
        },

        /**
         * Restore a snapshot produced by exportSnapshot (or a bare ProgressState).
         * Writes localStorage immediately and POSTs to /api/progress so the
         * restore propagates to Vercel KV — no need to wait on the save debounce.
         *
         * @param {unknown} parsed Parsed JSON from the user-supplied backup file.
         * @returns {Promise<{ ok: true, synced: boolean } | { ok: false, error: string }>}
         */
        async importSnapshot(parsed) {
            const candidate = isPlainObject(parsed) && isPlainObject(parsed.progress)
                ? parsed.progress
                : parsed;
            const normalized = normalizeProgressState(candidate);
            if (!normalized) {
                return { ok: false, error: "That file doesn't look like a Valerie's Math backup." };
            }

            state = normalized;
            state.session = freshSession();
            state.updatedAt = Date.now(); // a restore is the newest write, so it wins on the next load

            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* quota */ }

            // Sync immediately so a reload (or a different browser) sees the restored state.
            let synced = true;
            try {
                const res = await fetch('/api/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state)
                });
                synced = res.ok;
            } catch (e) {
                synced = false;
            }

            return { ok: true, synced };
        },

        // --- Modality API ---
        /**
         * @param {string} skillId
         * @returns {ExerciseModality}
         */
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
