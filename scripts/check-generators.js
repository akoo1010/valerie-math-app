#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const jsDirs = ['js', 'api', 'scripts'].map(dir => path.join(rootDir, dir));
const unitDir = path.join(rootDir, 'js', 'units');
const difficulties = [1, 2, 3];
const modalities = ['practice', 'visual', 'worked-example'];
// Generators are random, so sample each (exercise, difficulty, modality) several
// times to reach the rarer scenario branches.
const SAMPLES_PER_COMBO = 8;
const hintFields = ['hint1', 'hint2', 'hint3'];
const invalidHintPattern = /\b(?:undefined|NaN|Infinity)\b|\[object Object\]|\$\{/;

function relative(filePath) {
    return path.relative(rootDir, filePath);
}

function listJsFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return listJsFiles(entryPath);
        return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
    });
}

function checkSyntax(files) {
    const failures = [];
    for (const file of files) {
        const result = spawnSync(process.execPath, ['--check', file], {
            cwd: rootDir,
            encoding: 'utf8'
        });

        if (result.status !== 0) {
            const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
            failures.push(`${relative(file)} failed syntax check${output ? `\n${output}` : ''}`);
        }
    }
    return failures;
}

function createEngineUtils() {
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
        multipleChoice(correct, numOptions = 4) {
            const range = Math.max(5, Math.ceil(correct * 0.4));
            return Utils.shuffle([correct, ...Utils.distractors(correct, numOptions - 1, range)]);
        },
        roundedMultipleChoice(correct, roundTo, numOptions = 4) {
            const distSet = new Set([correct]);
            const offsets = [-3, -2, -1, 1, 2, 3];
            Utils.shuffle(offsets).forEach(offset => {
                const d = correct + offset * roundTo;
                if (d >= 0) distSet.add(d);
            });
            return Utils.shuffle([...distSet].slice(0, numOptions));
        },
        fmt(n) {
            return n.toLocaleString();
        }
    };

    return Utils;
}

function getTopLevelUnitNames(code) {
    return [...code.matchAll(/^const\s+([A-Z][A-Za-z0-9_]*)\s*=/gm)].map(match => match[1]);
}

function getOptionValue(option) {
    return option && typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'value')
        ? option.value
        : option;
}

function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(value, key);
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sameValue(a, b) {
    return Object.is(a, b);
}

function stableValue(value) {
    return JSON.stringify(value);
}

function describeValue(value) {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
}

function addUnique(values, value) {
    if (!values.some(existing => sameValue(existing, value))) {
        values.push(value);
    }
}

function wrongAnswerSamples(question) {
    const samples = [];

    if (Array.isArray(question.options)) {
        question.options.forEach(option => {
            const value = getOptionValue(option);
            if (!sameValue(value, question.answer)) {
                addUnique(samples, value);
            }
        });
    }

    const answer = question.answer;
    if (typeof answer === 'number' && Number.isFinite(answer)) {
        [answer + 1, answer - 1, answer * 10, answer / 10, 0].forEach(value => addUnique(samples, value));
    } else if (typeof answer === 'boolean') {
        addUnique(samples, !answer);
    } else if (typeof answer === 'string') {
        const alternates = {
            Yes: 'No',
            No: 'Yes',
            '>': '<',
            '<': '>',
            '=': '>',
            Prime: 'Composite',
            Composite: 'Prime',
            Even: 'Odd',
            Odd: 'Even'
        };
        addUnique(samples, alternates[answer] || 'wrong');
        addUnique(samples, '');
    } else {
        [0, false, 'wrong'].forEach(value => addUnique(samples, value));
    }

    return samples.slice(0, 8);
}

function checkHintText(value, context, label) {
    const failures = [];
    if (typeof value !== 'string') {
        failures.push(`${context}: ${label} must be a string, got ${typeof value}`);
        return failures;
    }

    if (value.trim().length === 0) {
        failures.push(`${context}: ${label} is empty`);
    }

    const invalidMatch = value.match(invalidHintPattern);
    if (invalidMatch) {
        failures.push(`${context}: ${label} contains ${JSON.stringify(invalidMatch[0])}: ${JSON.stringify(value)}`);
    }

    return failures;
}

function checkHints(question, context) {
    const failures = [];

    for (const field of hintFields) {
        if (!hasOwn(question, field)) {
            failures.push(`${context}: missing ${field}`);
            continue;
        }
        failures.push(...checkHintText(question[field], context, field));
    }

    if (hasOwn(question, 'misconceptionHints')) {
        if (!isPlainObject(question.misconceptionHints)) {
            failures.push(`${context}: misconceptionHints must be an object`);
        } else {
            Object.entries(question.misconceptionHints).forEach(([label, hint]) => {
                if (label.trim().length === 0) {
                    failures.push(`${context}: misconceptionHints has an empty label`);
                }
                failures.push(...checkHintText(hint, context, `misconceptionHints.${JSON.stringify(label)}`));
            });
        }
    }

    if (hasOwn(question, 'diagnose')) {
        if (typeof question.diagnose !== 'function') {
            failures.push(`${context}: diagnose must be a function`);
            return failures;
        }

        const seenLabels = new Set();
        for (const sample of wrongAnswerSamples(question)) {
            let label;
            try {
                label = question.diagnose(sample, question.answer, question);
            } catch (error) {
                failures.push(`${context}: diagnose threw for sample ${describeValue(sample)}: ${error.message}`);
                continue;
            }

            if (label == null) continue;
            if (typeof label !== 'string') {
                failures.push(`${context}: diagnose returned ${typeof label} for sample ${describeValue(sample)}; expected string or null`);
                continue;
            }
            if (label.trim().length === 0) {
                failures.push(`${context}: diagnose returned an empty label for sample ${describeValue(sample)}`);
                continue;
            }
            if (seenLabels.has(label)) continue;
            seenLabels.add(label);

            if (!isPlainObject(question.misconceptionHints) || !hasOwn(question.misconceptionHints, label)) {
                failures.push(`${context}: diagnose returned ${JSON.stringify(label)} but misconceptionHints has no matching targeted hint`);
                continue;
            }

            failures.push(...checkHintText(
                question.misconceptionHints[label],
                context,
                `misconceptionHints.${JSON.stringify(label)}`
            ));
        }
    }

    return failures;
}

// --- Answer verification -------------------------------------------------
// These checks re-derive what they can from the generated question itself,
// independently of the generator's own arithmetic.

/** Plain text of an HTML snippet, with block elements kept as separators. */
function toPlainText(html) {
    return String(html ?? '')
        .replace(/<sup>(\d+)<\/sup>\s*⁄?\s*<sub>(\d+)<\/sub>/g, '$1/$2')
        .replace(/<br\s*\/?>/gi, ' | ')
        .replace(/<\/?(?:div|p|li|tr|td|th|table)\b[^>]*>/gi, ' | ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ').replace(/&times;/g, '×').replace(/&divide;/g, '÷').replace(/&minus;/g, '−')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

const NUM = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?`;
const parseNumber = s => Number(s.replace(/,/g, ''));
const OPS = { '+': (a, b) => a + b, '-': (a, b) => a - b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };

/** Evaluate "a op b op c" with × ÷ before + −. */
function evaluateChain(tokens) {
    const nums = [parseNumber(tokens[0])];
    const ops = [];
    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const n = parseNumber(tokens[i + 1]);
        if (op === '×' || op === '÷') nums.push(OPS[op](nums.pop(), n));
        else { ops.push(op); nums.push(n); }
    }
    return ops.reduce((acc, op, i) => OPS[op](acc, nums[i + 1]), nums[0]);
}

/**
 * Find every arithmetic statement like "12 × 4 = 48" or "3/8 + 2/8 = 5/8" in a
 * string and return the ones that are false. Remainder statements
 * ("23 ÷ 4 = 5 R 3") and deliberately false examples ("... is NOT in the
 * fact family") are understood.
 */
function findFalseStatements(text) {
    const problems = [];
    const chain = new RegExp(String.raw`(?<![\d/.,])((?:${NUM})(?:\s*[+\-−×÷]\s*(?:${NUM}))+)\s*=\s*(${NUM})(?![\d/]|\s*[+\-−×÷]\s*\d)`, 'g');
    let m;
    while ((m = chain.exec(text))) {
        const tokens = m[1].match(new RegExp(String.raw`${NUM}|[+\-−×÷]`, 'g'));
        const value = evaluateChain(tokens);
        const stated = parseNumber(m[2]);
        if (!Number.isFinite(value) || Math.abs(value - stated) < 1e-9) continue;
        const tail = text.slice(m.index + m[0].length, m.index + m[0].length + 16);
        if (/^\s*(?:is NOT|is not|isn't|✗|❌)/.test(tail)) continue;
        if (tokens.length === 3 && tokens[1] === '÷' && /^\s*(?:R\b|r\b|remainder)/.test(tail)
            && Math.floor(parseNumber(tokens[0]) / parseNumber(tokens[2])) === stated) continue;
        problems.push(`"${m[0]}" (really ${+value.toFixed(6)})`);
    }
    const frac = /(?<![\d/]\s*[+\-−×]\s*)(?<![\d/])(\d+)\/(\d+)\s*([+\-−])\s*(\d+)\/(\d+)\s*=\s*(\d+)\/(\d+)(?![\d/])/g;
    while ((m = frac.exec(text))) {
        const [, a, b, op, c, d, e, f] = m;
        const value = OPS[op](a / b, c / d);
        if (Math.abs(value - e / f) > 1e-9) problems.push(`"${m[0]}"`);
    }
    const wholeTimesFrac = /(?<![\d/.])(\d+)\s*×\s*(\d+)\/(\d+)\s*=\s*(\d+)\/(\d+)(?![\d/])/g;
    while ((m = wholeTimesFrac.exec(text))) {
        if (Math.abs((m[1] * m[2]) / m[3] - m[4] / m[5]) > 1e-9) problems.push(`"${m[0]}"`);
    }
    return problems;
}

/** Numeric value of an option label like "12", "0.5", "3/4" or "2 1/3"; null otherwise. */
function labelNumber(label) {
    const s = String(label).replace(/,/g, '').trim();
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    if (/^\d+(?:\.\d+)?$/.test(s)) return +s;
    return null;
}

const hasFloatNoise = n => typeof n === 'number' && Number.isFinite(n) && n !== Number(n.toFixed(6));

function checkAnswerIntegrity(question, context) {
    const failures = [];
    const { type, answer } = question;

    if (type === 'input' && typeof question.checkAnswer !== 'function') {
        // The input box submits parseFloat(value) and compares with ===
        if (typeof answer !== 'number' || !Number.isFinite(answer)) {
            failures.push(`${context}: input answer ${JSON.stringify(answer)} can never be typed (must be a finite number)`);
        } else if (hasFloatNoise(answer)) {
            failures.push(`${context}: input answer ${answer} has floating-point noise, so the typed answer won't match`);
        } else if (answer < 0) {
            failures.push(`${context}: input answer ${answer} is negative`);
        }
    }
    if (typeof question.checkAnswer === 'function' && !question.checkAnswer(answer)) {
        failures.push(`${context}: checkAnswer rejects the question's own answer ${JSON.stringify(answer)}`);
    }
    if (type === 'true-false' && typeof answer !== 'boolean') {
        failures.push(`${context}: true-false answer must be a boolean, got ${JSON.stringify(answer)}`);
    }
    if (type === 'grid-click' && !(question.targetCount >= 0 && question.targetCount <= question.gridRows * question.gridCols)) {
        failures.push(`${context}: grid target ${question.targetCount} doesn't fit a ${question.gridRows}×${question.gridCols} grid`);
    }
    if (type === 'fraction-click' && !(question.targetNumerator >= 0 && question.targetNumerator <= question.parts)) {
        failures.push(`${context}: fraction target ${question.targetNumerator} doesn't fit ${question.parts} parts`);
    }

    if (type === 'multiple-choice' && Array.isArray(question.options)) {
        const labels = question.options.map(o => (o && typeof o === 'object' && hasOwn(o, 'value')) ? String(o.label ?? o.value) : String(o));
        const values = question.options.map(getOptionValue);
        if (new Set(labels).size !== labels.length) {
            failures.push(`${context}: two options look identical: ${JSON.stringify(labels)}`);
        }
        values.forEach(v => {
            if (hasFloatNoise(v)) failures.push(`${context}: option ${v} has floating-point noise`);
        });
        const answerIndex = values.findIndex(v => sameValue(v, answer));
        const answerValue = answerIndex >= 0 ? labelNumber(labels[answerIndex]) : null;
        if (answerValue !== null) {
            labels.forEach((label, i) => {
                const v = labelNumber(label);
                if (i !== answerIndex && v !== null && Math.abs(v - answerValue) < 1e-9) {
                    failures.push(`${context}: option "${label}" equals the answer "${labels[answerIndex]}", so two choices are right`);
                }
            });
        }
        if (typeof question.checkAnswer === 'function') {
            values.forEach((v, i) => {
                if (i !== answerIndex && question.checkAnswer(v)) {
                    failures.push(`${context}: checkAnswer also accepts option "${labels[i]}"`);
                }
            });
        }
    }

    const textFields = { questionText: question.questionText, subText: question.subText, visual: question.visual, workedExample: question.workedExample };
    hintFields.forEach(f => { textFields[f] = question[f]; });
    if (isPlainObject(question.misconceptionHints)) {
        Object.entries(question.misconceptionHints).forEach(([k, v]) => { textFields[`misconceptionHints.${k}`] = v; });
    }
    Object.entries(textFields).forEach(([field, value]) => {
        if (!value) return;
        findFalseStatements(toPlainText(value)).forEach(p => {
            failures.push(`${context}: ${field} states something false: ${p}`);
        });
    });

    return failures;
}

function checkQuestion(question, context) {
    const failures = [];

    if (!question || typeof question !== 'object') {
        return [`${context}: generator returned ${question}`];
    }

    if (!question.type) {
        failures.push(`${context}: missing question type`);
    }

    if (!Object.prototype.hasOwnProperty.call(question, 'answer')) {
        failures.push(`${context}: missing answer`);
    }

    failures.push(...checkHints(question, context));

    if (question.type === 'multiple-choice') {
        if (!Array.isArray(question.options)) {
            failures.push(`${context}: multiple-choice question missing options`);
            return failures;
        }

        const values = question.options.map(getOptionValue);
        if (!values.some(value => sameValue(value, question.answer))) {
            failures.push(`${context}: options missing answer ${JSON.stringify(question.answer)} in ${JSON.stringify(values)}`);
        }

        const keys = values.map(stableValue);
        if (new Set(keys).size !== keys.length) {
            failures.push(`${context}: duplicate option values ${JSON.stringify(values)}`);
        }
    }

    failures.push(...checkAnswerIntegrity(question, context));

    return failures;
}

function checkGenerators() {
    const failures = [];
    let generatedCount = 0;
    const unitFiles = fs.readdirSync(unitDir)
        .filter(file => file.endsWith('.js'))
        .map(file => path.join(unitDir, file))
        .sort();

    for (const file of unitFiles) {
        const code = fs.readFileSync(file, 'utf8');
        const unitNames = getTopLevelUnitNames(code);
        if (unitNames.length === 0) {
            failures.push(`${relative(file)}: no top-level unit definitions found`);
            continue;
        }

        const exposeUnits = `\n;globalThis.__unitMap = {${unitNames.map(name => (
            `${JSON.stringify(name)}: (typeof ${name} !== "undefined" ? ${name} : undefined)`
        )).join(',')}};`;
        const context = vm.createContext({
            Engine: { Utils: createEngineUtils() },
            console
        });

        try {
            vm.runInContext(code + exposeUnits, context, {
                filename: relative(file),
                timeout: 1000
            });
        } catch (error) {
            failures.push(`${relative(file)}: failed to load: ${error.message}`);
            continue;
        }

        for (const unitName of unitNames) {
            const unit = context.__unitMap[unitName];
            if (!unit || typeof unit.getExercises !== 'function') {
                continue;
            }

            context.__unitName = unitName;
            let exerciseCount;
            try {
                exerciseCount = vm.runInContext(
                    'globalThis.__exercises = __unitMap[__unitName].getExercises(); __exercises.length',
                    context,
                    { timeout: 1000 }
                );
            } catch (error) {
                failures.push(`${relative(file)} ${unitName}: getExercises failed: ${error.message}`);
                continue;
            }

            if (typeof unit.exerciseCount === 'number' && unit.exerciseCount !== exerciseCount) {
                failures.push(`${relative(file)} ${unitName}: exerciseCount is ${unit.exerciseCount}, but getExercises returned ${exerciseCount}`);
            }

            for (let exerciseIndex = 0; exerciseIndex < exerciseCount; exerciseIndex++) {
                for (const difficulty of difficulties) {
                    for (const modality of modalities) {
                        context.__exerciseIndex = exerciseIndex;
                        context.__difficulty = difficulty;
                        context.__modality = modality;

                        const label = `${relative(file)} ${unitName}[${exerciseIndex}] diff=${difficulty} modality=${modality}`;
                        for (let sample = 0; sample < SAMPLES_PER_COMBO; sample++) {
                            let question;
                            try {
                                question = vm.runInContext(
                                    '__exercises[__exerciseIndex].generate(__difficulty, __modality)',
                                    context,
                                    { timeout: 200 }
                                );
                            } catch (error) {
                                failures.push(`${label}: generate failed: ${error.message}`);
                                break;
                            }

                            generatedCount++;
                            failures.push(...checkQuestion(question, label));
                        }
                    }
                }
            }
        }
    }

    return { failures, generatedCount };
}

// --- Fact Dash: every single-digit fact, its tip, mastery rules, round builder ---
function checkFacts() {
    const failures = [];
    const file = path.join(rootDir, 'js', 'facts.js');
    const context = vm.createContext({ console, Math, Date });
    try {
        vm.runInContext(fs.readFileSync(file, 'utf8') + '\n;globalThis.__Facts = Facts;', context, { filename: 'js/facts.js', timeout: 1000 });
    } catch (error) {
        return { failures: [`js/facts.js: failed to load: ${error.message}`], factCount: 0 };
    }
    const F = context.__Facts;
    const all = F.allFacts();
    const fail = (fact, msg) => failures.push(`js/facts.js ${fact ? fact.key : ''}: ${msg}`);

    if (all.length !== 300) fail(null, `expected 300 facts, found ${all.length}`);
    if (new Set(all.map(f => f.key)).size !== all.length) fail(null, 'duplicate fact keys');

    for (const f of all) {
        const symbol = F.SYMBOL[f.op];
        const expected = f.op === '+' ? f.a + f.b : f.op === '-' ? f.a : f.a * f.b;
        if (f.answer !== expected) fail(f, `answer ${f.answer}, expected ${expected}`);
        if (f.op === '-') {
            if (f.left - f.right !== f.answer) fail(f, `${f.left} − ${f.right} is not ${f.answer}`);
            if (f.left > 18 || f.right > 9 || f.answer > 9) fail(f, 'subtraction must stay within 20 with single-digit parts');
        }
        if (f.op === '+' && f.left + f.right !== f.answer) fail(f, 'addition answer mismatch');
        if (f.op === 'x' && f.left * f.right !== f.answer) fail(f, 'multiplication answer mismatch');
        if (f.text !== `${f.left} ${symbol} ${f.right}`) fail(f, `text "${f.text}" doesn't match the fact`);
        if (typeof f.tip !== 'string' || f.tip.length < 10) fail(f, 'missing strategy tip');
        findFalseStatements(f.tip).forEach(p => fail(f, `tip states something false: ${p}`));
        if (!new RegExp(`(?<![\\d.])${f.answer}(?!\\d|\\.\\d)`).test(f.tip)) fail(f, `tip never reaches the answer ${f.answer}: "${f.tip}"`);
        if (invalidHintPattern.test(f.tip)) fail(f, `tip has an unresolved value: "${f.tip}"`);
    }

    // Mastery: fast first sight → almost; fast again on another day → mastered; a miss resets
    const day = 20000;
    const fact = F.byKey('x:7:8');
    let s = F.applyAnswer(undefined, true, 1500, day);
    if (F.levelOf(s) !== F.ALMOST) fail(fact, 'a fast first answer should fast-track to "almost"');
    s = F.applyAnswer(s, true, 1500, day);
    if (F.levelOf(s) === F.MASTERED) fail(fact, 'mastery must need a second day');
    s = F.applyAnswer(s, true, 1500, day + 1);
    if (F.levelOf(s) !== F.MASTERED) fail(fact, 'three fast answers on two days should master');
    s = F.applyAnswer(s, false, 1500, day + 2);
    if (F.levelOf(s) !== F.LEARNING) fail(fact, 'a miss should send a fact back to learning');
    let slow = F.applyAnswer(undefined, true, F.FAST_MS + 500, day);
    slow = F.applyAnswer(slow, true, F.FAST_MS + 500, day + 1);
    if (F.levelOf(slow) !== F.LEARNING) fail(fact, 'slow answers must not count toward mastery');

    // Round builder
    const today = day + 10;
    const noAdjacentRepeats = (round, label) => {
        for (let i = 1; i < round.length; i++) {
            if (round[i].key === round[i - 1].key) fail(null, `${label}: ${round[i].key} twice in a row`);
        }
    };
    for (const op of ['+', '-', 'x', 'mix']) {
        for (let trial = 0; trial < 20; trial++) {
            const round = F.buildRound({ op, stats: {}, today });
            if (round.length !== F.ROUND_SIZE) fail(null, `${op} round has ${round.length} facts, expected ${F.ROUND_SIZE}`);
            if (round.some(f => !f || !F.byKey(f.key))) fail(null, `${op} round contains an unknown fact`);
            noAdjacentRepeats(round, `${op} round`);
            if (op !== 'mix' && round.some(f => f.op !== op)) fail(null, `${op} round mixes in other operations`);
            if (op !== 'mix' && round.filter(F.isFocus).length < F.ROUND_SIZE) fail(null, `a fresh ${op} round should be all 6s, 7s and 8s`);
            if (op === 'mix' && new Set(round.map(f => f.op)).size !== 3) fail(null, 'a mixed round should include all three operations');
        }
    }
    // Facts she's learning come first
    const learningStats = {};
    F.allFacts('x').slice(0, 30).forEach(f => { learningStats[f.key] = F.applyAnswer(undefined, false, 4000, today - 1); });
    const learningRound = F.buildRound({ op: 'x', stats: learningStats, today });
    if (learningRound.filter(f => F.levelOf(learningStats[f.key]) === F.LEARNING).length < 10) {
        fail(null, 'rounds should be at least 40% facts she is learning');
    }
    // One-number practice only uses that number
    for (const op of ['+', '-', 'x']) {
        const round = F.buildRound({ op, stats: {}, today, family: 7 });
        if (round.length !== F.ROUND_SIZE || round.some(f => f.a !== 7 && f.b !== 7)) fail(null, `${op} practice-7 round includes facts without 7`);
        noAdjacentRepeats(round, `${op} practice-7 round`);
    }
    // Sprint and boss picks are valid facts
    for (let i = 0; i < 50; i++) {
        const f = F.pickSprintFact({ op: ['+', '-', 'x', 'mix'][i % 4], stats: learningStats });
        if (!f || !F.byKey(f.key)) fail(null, 'sprint picked an unknown fact');
    }
    const deck = F.bossDeck({ stats: learningStats });
    if (deck.length !== 30 || deck.some(f => !F.byKey(f.key))) fail(null, 'fact boss deck should be 30 valid facts');

    return { failures, factCount: all.length };
}

function main() {
    const files = jsDirs.flatMap(listJsFiles).sort();
    const syntaxFailures = checkSyntax(files);
    const { failures: generatorFailures, generatedCount } = checkGenerators();
    const { failures: factFailures, factCount } = checkFacts();
    generatorFailures.push(...factFailures);
    // Repeated samples hit the same bug many times; report each message once.
    const failures = [...new Set([...syntaxFailures, ...generatorFailures])];

    if (failures.length > 0) {
        console.error(`Found ${failures.length} check failure${failures.length === 1 ? '' : 's'}:`);
        console.error(failures.join('\n'));
        process.exit(1);
    }

    console.log(`Syntax OK for ${files.length} JavaScript files.`);
    console.log(`Generator sweep OK for ${generatedCount} generated questions.`);
    console.log(`Fact Dash OK: ${factCount} facts and tips verified, mastery rules and round builder checked.`);
}

main();
