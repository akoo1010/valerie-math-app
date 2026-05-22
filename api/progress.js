import { kv } from '@vercel/kv';
/// <reference path="../js/types.js" />

const PROGRESS_KEY = 'valerie_math_progress';
const DEFAULT_UNLOCKED = ['mult-intro', 'mult-1digit', 'add-sub', '4-place-value', '4-add-sub-estimation', '4-multiply-1digit'];
const SESSION_STATES = ['normal', 'struggling', 'cruising', 'fatigued'];

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
    if (!isPlainObject(value)) {
        return {
            streak: 0,
            mastered: false,
            totalCorrect: 0,
            totalWrong: 0,
            difficulty: 1,
            lastAttempt: null,
            wrongAnswers: [],
            misconceptions: {},
            consecutiveCorrect: 0,
            consecutiveWrong: 0
        };
    }

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

function normalizeSession(value) {
    const defaultSession = {
        currentStreak: 0,
        questionsAnswered: 0,
        correctThisSession: 0,
        wrongThisSession: 0,
        startTime: null,
        recentResults: [],
        sessionState: 'normal',
        lastSessionMessage: null
    };
    if (!isPlainObject(value)) return defaultSession;

    return {
        currentStreak: toNonNegativeInteger(value.currentStreak),
        questionsAnswered: toNonNegativeInteger(value.questionsAnswered),
        correctThisSession: toNonNegativeInteger(value.correctThisSession),
        wrongThisSession: toNonNegativeInteger(value.wrongThisSession),
        startTime: toTimestampOrNull(value.startTime),
        recentResults: Array.isArray(value.recentResults) ? value.recentResults.filter(v => typeof v === 'boolean').slice(-20) : [],
        sessionState: SESSION_STATES.includes(value.sessionState) ? value.sessionState : 'normal',
        lastSessionMessage: typeof value.lastSessionMessage === 'string' ? value.lastSessionMessage : null
    };
}

/**
 * Normalize untrusted API input into the stored progress payload.
 *
 * @param {unknown} value
 * @returns {ProgressState|null}
 */
function normalizeProgressPayload(value) {
    if (!isPlainObject(value)) return null;
    const hasProgressShape = ['units', 'skills', 'weaknessQueue', 'totalStars', 'unlockedUnits', 'session']
        .some(key => Object.prototype.hasOwnProperty.call(value, key));
    if (!hasProgressShape) return null;

    const units = {};
    if (isPlainObject(value.units)) {
        Object.entries(value.units).forEach(([unitId, unitProgress]) => {
            if (typeof unitId === 'string' && unitId.length > 0) {
                units[unitId] = normalizeUnitProgress(unitProgress);
            }
        });
    }

    const skills = {};
    if (isPlainObject(value.skills)) {
        Object.entries(value.skills).forEach(([skillId, skillProgress]) => {
            if (typeof skillId === 'string' && skillId.length > 0) {
                skills[skillId] = normalizeSkillProgress(skillProgress);
            }
        });
    }

    const unlockedUnits = Array.isArray(value.unlockedUnits)
        ? value.unlockedUnits.filter(unitId => typeof unitId === 'string' && unitId.length > 0)
        : [];

    return {
        units,
        skills,
        weaknessQueue: normalizeWeaknessQueue(value.weaknessQueue),
        totalStars: toNonNegativeInteger(value.totalStars),
        unlockedUnits: [...new Set([...DEFAULT_UNLOCKED, ...unlockedUnits])],
        session: normalizeSession(value.session)
    };
}

/**
 * GET returns the stored ProgressState or null.
 * POST stores a ProgressState-compatible payload.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const data = await kv.get(PROGRESS_KEY);
            return res.status(200).json(normalizeProgressPayload(data) ?? null);
        } catch (e) {
            return res.status(500).json({ error: 'Failed to load progress' });
        }
    }

    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid progress payload' });
            }
        }

        try {
            const progress = normalizeProgressPayload(body);
            if (!progress) {
                return res.status(400).json({ error: 'Invalid progress payload' });
            }

            await kv.set(PROGRESS_KEY, progress);
            return res.status(200).json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'Failed to save progress' });
        }
    }

    return res.status(405).end();
}
