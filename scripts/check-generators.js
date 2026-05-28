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

function sameValue(a, b) {
    return Object.is(a, b);
}

function stableValue(value) {
    return JSON.stringify(value);
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

                        let question;
                        const label = `${relative(file)} ${unitName}[${exerciseIndex}] diff=${difficulty} modality=${modality}`;
                        try {
                            question = vm.runInContext(
                                '__exercises[__exerciseIndex].generate(__difficulty, __modality)',
                                context,
                                { timeout: 200 }
                            );
                        } catch (error) {
                            failures.push(`${label}: generate failed: ${error.message}`);
                            continue;
                        }

                        generatedCount++;
                        failures.push(...checkQuestion(question, label));
                    }
                }
            }
        }
    }

    return { failures, generatedCount };
}

function main() {
    const files = jsDirs.flatMap(listJsFiles).sort();
    const syntaxFailures = checkSyntax(files);
    const { failures: generatorFailures, generatedCount } = checkGenerators();
    const failures = [...syntaxFailures, ...generatorFailures];

    if (failures.length > 0) {
        console.error(`Found ${failures.length} check failure${failures.length === 1 ? '' : 's'}:`);
        console.error(failures.join('\n'));
        process.exit(1);
    }

    console.log(`Syntax OK for ${files.length} JavaScript files.`);
    console.log(`Generator sweep OK for ${generatedCount} generated questions.`);
}

main();
