/* ===== FACT FLUENCY CORE ===== */
/* The 300 single-digit facts — addition (0+0 … 9+9), subtraction within 20
   (the inverse of each addition fact, e.g. 15 − 7 = 8) and multiplication
   (0×0 … 9×9) — with a strategy tip for each, per-fact mastery tracking, and
   the builders that decide which facts she practices next.
   No DOM in here, so scripts/check-generators.js can verify every fact and tip. */
/// <reference path="./types.js" />

const Facts = (() => {
    const OPS = ['+', '-', 'x'];
    const SYMBOL = { '+': '+', '-': '−', 'x': '×' };
    const OP_NAME = { '+': 'Addition', '-': 'Subtraction', 'x': 'Multiplication', mix: 'Mixed' };

    const FAST_MS = 3000;                  // a correct answer this fast counts toward mastery (⚡)
    const ROUND_SIZE = 25;
    const DAILY_GOAL_MS = 10 * 60 * 1000;  // 10 minutes a day
    const FOCUS = [6, 7, 8];               // her weakest numbers: facts with these come first
    const REVIEW_AFTER_DAYS = 3;           // mastered facts come back for a check after this many days
    const MAX_COUNTED_MS = 30000;          // one fact never adds more than this to today's time

    // Slots in a fact's stat array (kept as an array so 300 facts stay small in the cloud save)
    const FAST_HITS = 0, FAST_DAYS = 1, LAST_FAST_DAY = 2, LAST_SEEN_DAY = 3, ATTEMPTS = 4, CORRECT = 5, LAST_MS = 6;
    const STAT_LENGTH = 7;

    // Mastery levels
    const NEW = 0, LEARNING = 1, ALMOST = 2, MASTERED = 3;
    const LEVEL_NAME = ['new', 'learning', 'almost', 'mastered'];

    const keyOf = (op, a, b) => `${op}:${a}:${b}`;

    // --- Strategy tips (shown only after a miss) -------------------------

    function addTip(a, b) {
        const sum = a + b;
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        if (small === 0) return `Adding 0 doesn't change a number: ${a} + ${b} = ${sum}.`;
        if (a === b) return `Double ${a}: ${a} + ${a} = ${sum}.`;
        if (big - small === 1) return `Near double: ${small} + ${small} = ${small * 2}, and one more makes ${sum}.`;
        if (sum === 10) return `${a} and ${b} are ten buddies — together they make 10.`;
        if (big === 9) return `9 is one less than 10: ${small} + 10 = ${small + 10}, then take away 1 → ${sum}.`;
        if (sum > 10) {
            const toTen = 10 - big;
            return `Make 10: ${big} + ${toTen} = 10, then ${small - toTen} more → ${sum}.`;
        }
        const steps = Array.from({ length: small }, (_, i) => big + i + 1).join(', ');
        return `Start at ${big} and count on ${small}: ${steps} → ${sum}.`;
    }

    // m − b = a
    function subTip(m, b, a) {
        if (b === 0) return `Taking away 0 leaves the same number: ${m} − 0 = ${m}.`;
        if (a === 0) return `A number take away itself leaves nothing: ${m} − ${b} = 0.`;
        if (a === b) return `Double fact: ${b} + ${b} = ${m}, so ${m} − ${b} = ${a}.`;
        if (m > 10) {
            const toTen = m - 10;
            return `Back to 10: ${m} − ${toTen} = 10, then take away ${b - toTen} more → ${a}. Check: ${a} + ${b} = ${m}.`;
        }
        if (b <= 2) {
            const steps = Array.from({ length: b }, (_, i) => m - i - 1).join(', ');
            return `Count back ${b} from ${m}: ${steps} → ${a}.`;
        }
        return `Think addition: ${b} + ? = ${m}. Since ${b} + ${a} = ${m}, ${m} − ${b} = ${a}.`;
    }

    // Use the factor with the easiest strategy; the other factor is the group size.
    const MUL_STRATEGY_ORDER = [2, 5, 9, 4, 3, 6, 8, 7];
    function mulTip(a, b) {
        const p = a * b;
        if (a === 0 || b === 0) return `Anything times 0 is 0: ${a} × ${b} = 0.`;
        if (a === 1 || b === 1) return `Anything times 1 stays the same: ${a} × ${b} = ${p}.`;
        const m = MUL_STRATEGY_ORDER.find(x => x === a || x === b);
        const n = m === a ? b : a;
        switch (m) {
            case 2: return `Times 2 is a double: ${n} + ${n} = ${p}.`;
            case 5: return `Times 5 is half of times 10: ${n} × 10 = ${n * 10}, and half of that is ${p}.`;
            case 9: return `Times 9 is times 10 take away one group: ${n} × 10 = ${n * 10}, then ${n * 10} − ${n} = ${p}.`;
            case 4: return `Double, then double again: ${n} + ${n} = ${n * 2}, then ${n * 2} + ${n * 2} = ${p}.`;
            case 3: return `Double, plus one more group: ${n} + ${n} = ${n * 2}, then ${n * 2} + ${n} = ${p}.`;
            case 6: return `Times 5, plus one more group: ${n} × 5 = ${n * 5}, then ${n * 5} + ${n} = ${p}.`;
            case 8: return `Times 4, then double: ${n} × 4 = ${n * 4}, then ${n * 4} + ${n * 4} = ${p}.`;
            default: return `Times 5 plus times 2: ${n} × 5 = ${n * 5} and ${n} × 2 = ${n * 2}, so ${n * 5} + ${n * 2} = ${p}.`;
        }
    }

    // --- The facts ---------------------------------------------------------

    /** @returns {Fact} */
    function makeFact(op, a, b) {
        const left = op === '-' ? a + b : a;           // subtraction family: (a + b) − b = a
        const right = b;
        const answer = op === '+' ? a + b : op === '-' ? a : a * b;
        return {
            key: keyOf(op, a, b), op, a, b, left, right, answer,
            text: `${left} ${SYMBOL[op]} ${right}`,
            tip: op === '+' ? addTip(a, b) : op === '-' ? subTip(a + b, b, a) : mulTip(a, b)
        };
    }

    /** @type {Record<string, Fact[]>} */
    const ALL = {};
    /** @type {Record<string, Fact>} */
    const BY_KEY = {};
    OPS.forEach(op => {
        ALL[op] = [];
        for (let a = 0; a <= 9; a++) {
            for (let b = 0; b <= 9; b++) {
                const fact = makeFact(op, a, b);
                ALL[op].push(fact);
                BY_KEY[fact.key] = fact;
            }
        }
    });

    const isFocus = (/** @type {Fact} */ f) => FOCUS.includes(f.a) || FOCUS.includes(f.b);

    // --- Mastery -------------------------------------------------------

    /** Calendar day as a whole number (local date), for "different days" and review spacing. */
    function dayNumber(date = new Date()) {
        return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    }

    /** @param {number[]|undefined} s */
    function levelOf(s) {
        if (!s || s[ATTEMPTS] === 0) return NEW;
        if (s[FAST_HITS] >= 3 && s[FAST_DAYS] >= 2) return MASTERED;
        if (s[FAST_HITS] >= 1) return ALMOST;
        return LEARNING;
    }

    /**
     * Pure update of a fact's stats after one answer.
     * Mastered = 3 fast correct answers on at least 2 different days. A fact she
     * answers fast the very first time counts double, so facts she already knows
     * clear in a day or two instead of being drilled.
     *
     * @param {number[]|undefined} s
     * @param {boolean} correct
     * @param {number} ms response time
     * @param {number} day dayNumber()
     */
    function applyAnswer(s, correct, ms, day) {
        const out = s ? [...s] : new Array(STAT_LENGTH).fill(0);
        const firstEver = out[ATTEMPTS] === 0;
        out[ATTEMPTS] += 1;
        out[LAST_SEEN_DAY] = day;
        out[LAST_MS] = Math.max(0, Math.min(Math.round(ms), 600000));
        if (correct) {
            out[CORRECT] += 1;
            if (ms <= FAST_MS) {
                out[FAST_HITS] = Math.min(99, out[FAST_HITS] + (firstEver ? 2 : 1));
                if (out[LAST_FAST_DAY] !== day) {
                    out[FAST_DAYS] = Math.min(99, out[FAST_DAYS] + 1);
                    out[LAST_FAST_DAY] = day;
                }
            } else if (out[FAST_HITS] > 0) {
                out[FAST_HITS] -= 1; // right but slow: not automatic yet
            }
        } else {
            out[FAST_HITS] = 0;
            out[FAST_DAYS] = 0;
            out[LAST_FAST_DAY] = 0;
        }
        return out;
    }

    // --- Choosing facts ----------------------------------------------------

    function shuffle(arr, random) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /** Same fact twice in a row, or 7 × 8 right after 8 × 7, is too easy a repeat. */
    function tooClose(x, y) {
        return !!x && !!y && (x.key === y.key || (x.op === y.op && x.a === y.b && x.b === y.a));
    }

    /** Reorder so no fact sits right next to itself or its twin, swapping with any position that keeps all neighbors apart. */
    function spreadOut(list) {
        const out = [...list];
        const bad = i => i > 0 && i < out.length && tooClose(out[i - 1], out[i]);
        for (let i = 1; i < out.length; i++) {
            if (!bad(i)) continue;
            for (let j = 0; j < out.length; j++) {
                if (j === i) continue;
                [out[i], out[j]] = [out[j], out[i]];
                if (![i, i + 1, j, j + 1].some(bad)) break;
                [out[i], out[j]] = [out[j], out[i]]; // undo and keep looking
            }
        }
        return out;
    }

    /**
     * Pick the facts for one round.
     *   ~40% facts she's learning (6s, 7s and 8s first)
     *   ~20% almost-mastered facts (ones not seen today first, so they can master on a new day)
     *   ~10% mastered facts due for a check
     *   the rest new facts (6s, 7s, 8s first) — fewer while the learning pile is big
     *
     * @param {{op: '+'|'-'|'x'|'mix', stats: Object<string, number[]>, today: number, size?: number, family?: number|null, random?: () => number}} opts
     * @returns {Fact[]}
     */
    function buildRound({ op, stats, today, size = ROUND_SIZE, family = null, random = Math.random }) {
        if (op === 'mix') {
            const per = Math.ceil(size / OPS.length);
            const parts = OPS.map(o => buildRound({ op: o, stats, today, size: per, family, random }));
            return spreadOut(shuffle(parts.flat(), random).slice(0, size));
        }
        let pool = ALL[op];
        if (family !== null && family !== undefined) pool = pool.filter(f => f.a === family || f.b === family);
        const lv = (/** @type {Fact} */ f) => levelOf(stats[f.key]);
        const lastSeen = (/** @type {Fact} */ f) => (stats[f.key] ? stats[f.key][LAST_SEEN_DAY] : 0);
        const focusFirst = (x, y) => Number(isFocus(y)) - Number(isFocus(x));

        const learning = shuffle(pool.filter(f => lv(f) === LEARNING), random).sort(focusFirst);
        const almost = shuffle(pool.filter(f => lv(f) === ALMOST), random)
            .sort((x, y) => (Number(lastSeen(x) === today) - Number(lastSeen(y) === today)) || focusFirst(x, y));
        const due = pool.filter(f => lv(f) === MASTERED && today - lastSeen(f) >= REVIEW_AFTER_DAYS)
            .sort((x, y) => lastSeen(x) - lastSeen(y));
        const fresh = shuffle(pool.filter(f => lv(f) === NEW), random).sort(focusFirst);
        const mastered = shuffle(pool.filter(f => lv(f) === MASTERED), random).sort((x, y) => lastSeen(x) - lastSeen(y));

        const picks = [];
        const take = (list, n) => {
            for (const f of list) {
                if (n <= 0 || picks.length >= size) break;
                if (!picks.includes(f)) { picks.push(f); n--; }
            }
        };
        const backlog = learning.length + almost.length;
        take(learning, Math.round(size * 0.4));
        take(almost, Math.round(size * 0.2));
        take(due, Math.round(size * 0.1));
        take(fresh, backlog >= 15 ? 4 : size);
        // Top up from whatever is left, weakest first
        [learning, almost, fresh, due, mastered].forEach(list => take(list, size - picks.length));
        // Small pools (one-number practice, or everything mastered): repeat to fill the round
        const base = [...picks];
        for (let i = 0; picks.length < size && base.length > 0; i++) picks.push(base[i % base.length]);
        return spreadOut(shuffle(picks, random));
    }

    /**
     * One fact for the 60-second sprint: mostly facts she's fast at (to rack up
     * points), mixed with facts she's still working on.
     */
    function pickSprintFact({ op, stats, lastKey = null, random = Math.random }) {
        const ops = op === 'mix' ? OPS : [op];
        const pool = ops.flatMap(o => ALL[o]).filter(f => f.key !== lastKey);
        const strong = pool.filter(f => levelOf(stats[f.key]) >= ALMOST);
        const weak = pool.filter(f => levelOf(stats[f.key]) < ALMOST && (isFocus(f) || levelOf(stats[f.key]) === LEARNING));
        let list = pool;
        if (strong.length && (!weak.length || random() < 0.6)) list = strong;
        else if (weak.length) list = weak;
        return list[Math.floor(random() * list.length)];
    }

    /** Facts for the fact boss: her weakest first (most misses, then slowest), 6s/7s/8s next. */
    function bossDeck({ stats, size = 30, random = Math.random }) {
        const all = OPS.flatMap(o => ALL[o]);
        const misses = f => (stats[f.key] ? stats[f.key][ATTEMPTS] - stats[f.key][CORRECT] : 0);
        const weak = shuffle(all.filter(f => levelOf(stats[f.key]) === LEARNING), random)
            .sort((x, y) => misses(y) - misses(x) || stats[y.key][LAST_MS] - stats[x.key][LAST_MS]);
        const almost = shuffle(all.filter(f => levelOf(stats[f.key]) === ALMOST), random);
        const fresh = shuffle(all.filter(f => levelOf(stats[f.key]) === NEW && isFocus(f)), random);
        const rest = shuffle(all.filter(f => !weak.includes(f) && !almost.includes(f) && !fresh.includes(f)), random);
        return spreadOut(shuffle([...weak, ...almost, ...fresh, ...rest].slice(0, size), random));
    }

    // --- Progress (reads/writes Adaptive's saved state) -------------------

    function state() { return Adaptive.getFactsState(); }

    return {
        OPS, SYMBOL, OP_NAME, FAST_MS, ROUND_SIZE, DAILY_GOAL_MS, FOCUS, MAX_COUNTED_MS,
        NEW, LEARNING, ALMOST, MASTERED, LEVEL_NAME,
        STAT_LENGTH,

        // Pure helpers (also used by the checks)
        allFacts(op) { return op ? [...ALL[op]] : OPS.flatMap(o => ALL[o]); },
        byKey(key) { return BY_KEY[key] || null; },
        isFocus,
        dayNumber,
        levelOf,
        applyAnswer,
        buildRound,
        pickSprintFact,
        bossDeck,

        /** Current mastery level of a fact. */
        level(fact) { return levelOf(state().stats[fact.key]); },

        stats() { return state().stats; },

        /**
         * Record one answer (first try only — not the retype after a miss).
         * @returns {{before: number, after: number}} mastery level before/after
         */
        recordAnswer(fact, correct, ms) {
            const facts = state();
            const before = levelOf(facts.stats[fact.key]);
            facts.stats[fact.key] = applyAnswer(facts.stats[fact.key], correct, ms, dayNumber());
            Adaptive.commitFacts();
            return { before, after: levelOf(facts.stats[fact.key]) };
        },

        /**
         * Add practice time toward today's 10 minutes.
         * @returns {{reachedNow: boolean}} true the moment today's goal is reached
         */
        addTime(ms) {
            const facts = state();
            const before = facts.daily.ms;
            facts.daily.ms += Math.max(0, Math.min(Math.round(ms), MAX_COUNTED_MS));
            const reachedNow = before < DAILY_GOAL_MS && facts.daily.ms >= DAILY_GOAL_MS;
            if (reachedNow && !facts.goalDays.includes(facts.daily.date)) {
                facts.goalDays.push(facts.daily.date);
                if (facts.goalDays.length > 60) facts.goalDays = facts.goalDays.slice(-60);
            }
            Adaptive.commitFacts();
            return { reachedNow };
        },

        msToday() { return state().daily.ms; },
        minutesToday() { return Math.floor(state().daily.ms / 60000); },
        goalReachedToday() { return state().daily.ms >= DAILY_GOAL_MS; },

        /** Days in a row (ending today, or yesterday if today isn't done yet) with the 10 minutes done. */
        streak() {
            const done = new Set(state().goalDays);
            const d = new Date();
            const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
            if (!done.has(iso(d))) d.setDate(d.getDate() - 1);
            let n = 0;
            while (done.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
            return n;
        },

        noteRound(op) {
            const facts = state();
            facts.daily.rounds[op] = (facts.daily.rounds[op] || 0) + 1;
            Adaptive.commitFacts();
        },

        /** @param {'+'|'-'|'x'} op */
        counts(op) {
            const stats = state().stats;
            const c = { [NEW]: 0, [LEARNING]: 0, [ALMOST]: 0, [MASTERED]: 0 };
            ALL[op].forEach(f => { c[levelOf(stats[f.key])]++; });
            return { new: c[NEW], learning: c[LEARNING], almost: c[ALMOST], mastered: c[MASTERED], total: ALL[op].length };
        },

        /**
         * Which operation the next round should practice: rotate through the
         * operations (weakest first) with a mixed round every fourth time.
         * @returns {'+'|'-'|'x'|'mix'}
         */
        recommendOp() {
            const stats = state().stats;
            const weakness = op => ALL[op].reduce((sum, f) => {
                const lv = levelOf(stats[f.key]);
                return sum + (lv === LEARNING ? 2 : lv === ALMOST ? 1 : lv === NEW && isFocus(f) ? 0.5 : 0);
            }, 0);
            const order = ['x', '+', '-'].sort((p, q) => weakness(q) - weakness(p));
            const rounds = state().daily.rounds;
            const done = OPS.reduce((n, op) => n + (rounds[op] || 0), 0) + (rounds.mix || 0);
            return [...order, 'mix'][done % 4];
        },

        /** Facts she misses most right now (for the grown-ups page). */
        trickiest(n = 8) {
            const stats = state().stats;
            return OPS.flatMap(o => ALL[o])
                .filter(f => levelOf(stats[f.key]) === LEARNING)
                .sort((x, y) => (stats[y.key][ATTEMPTS] - stats[y.key][CORRECT]) - (stats[x.key][ATTEMPTS] - stats[x.key][CORRECT])
                    || stats[y.key][LAST_MS] - stats[x.key][LAST_MS])
                .slice(0, n);
        },

        sprintBest(op) { return state().sprintBest[op] || 0; },

        /** @returns {boolean} true for a new personal best */
        recordSprint(op, score) {
            const facts = state();
            const isBest = score > (facts.sprintBest[op] || 0);
            if (isBest) facts.sprintBest[op] = score;
            Adaptive.commitFacts();
            return isBest;
        },

        bossRecord() { return { ...state().boss }; },

        /** @returns {{firstWin: boolean, newRecord: boolean, previousBestMs: number|null}} */
        recordBoss(won, ms) {
            const boss = state().boss;
            boss.attempts++;
            const previousBestMs = boss.bestMs;
            let firstWin = false, newRecord = false;
            if (won) {
                firstWin = boss.wins === 0;
                boss.wins++;
                if (boss.bestMs === null || ms < boss.bestMs) {
                    newRecord = boss.bestMs !== null;
                    boss.bestMs = Math.round(ms);
                }
            }
            Adaptive.commitFacts();
            return { firstWin, newRecord, previousBestMs };
        },

        markCelebrated() {
            state().daily.celebrated = true;
            Adaptive.commitFacts();
        },
        celebratedToday() { return state().daily.celebrated; }
    };
})();
