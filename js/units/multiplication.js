/* ===== UNIT 1: INTRO TO MULTIPLICATION — Swimming Theme 🏊 ===== */

const MultiplicationIntro = {
    id: 'mult-intro',
    title: 'Intro to Multiplication',
    icon: '🏊',
    theme: 'swim',
    description: "Let's learn multiplication with swimming! See how groups of swimmers make multiplication easy.",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Swim Team Groups — visual arrays
            {
                skillId: 'mult-intro-groups',
                generate(diff) {
                    const rows = R(2, diff >= 2 ? 5 : 3);
                    const cols = R(2, diff >= 2 ? 5 : 3);
                    const answer = rows * cols;
                    const visual = Array.from({length: rows}, () =>
                        `<div class="swimmer-group">${Array.from({length: cols}, () => '<span class="swimmer-item">🏊</span>').join('')}</div>`
                    ).join('');
                    return {
                        type: 'multiple-choice',
                        questionText: `There are ${rows} swim lanes with ${cols} swimmers in each lane.<br>How many swimmers in total?`,
                        visual,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `Count the groups: ${rows} groups of ${cols}`,
                        hint2: `Try adding: ${Array(rows).fill(cols).join(' + ')} = ?`,
                        hint3: `${rows} × ${cols} = ${answer}`
                    };
                }
            },
            // 2. Repeated Addition Laps
            {
                skillId: 'mult-intro-repeated-add',
                generate(diff) {
                    const groups = R(2, diff >= 2 ? 6 : 4);
                    const perGroup = R(2, diff >= 2 ? 7 : 5);
                    const answer = groups * perGroup;
                    const addExpr = Array(groups).fill(perGroup).join(' + ');
                    return {
                        type: 'input',
                        questionText: `Convert to multiplication:`,
                        subText: `${addExpr} = ? × ${perGroup}`,
                        answer: groups,
                        hint1: `How many times is ${perGroup} being added?`,
                        hint2: `Count the ${perGroup}s: there are ${groups} of them`,
                        hint3: `${addExpr} = ${groups} × ${perGroup}`
                    };
                }
            },
            // 3. Multiply by 0 and 1
            {
                skillId: 'mult-intro-zero-one',
                generate(diff) {
                    const useZero = Math.random() < 0.5;
                    const other = R(1, 10);
                    const a = useZero ? 0 : 1;
                    const b = other;
                    const answer = a * b;
                    return {
                        type: 'multiple-choice',
                        questionText: useZero
                            ? `There are ${b} pools but ${a} swimmers showed up.<br>How many swimmers are swimming?`
                            : `There is ${a} swim team with ${b} swimmers.<br>How many swimmers total?`,
                        visual: useZero
                            ? '<div style="font-size:2.5rem; opacity: 0.5;">🏊 × 0 = 🤷</div>'
                            : `<div class="swimmer-group">${Array.from({length: b}, () => '<span class="swimmer-item">🏊</span>').join('')}</div>`,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: useZero ? 'Any number times 0 is always 0!' : 'Any number times 1 stays the same!',
                        hint2: `${a} × ${b} = ?`,
                        hint3: `${a} × ${b} = ${answer}`
                    };
                }
            },
            // 4. Array Builder
            {
                skillId: 'mult-intro-array',
                generate(diff) {
                    const rows = R(2, diff >= 2 ? 5 : 4);
                    const cols = R(2, diff >= 2 ? 5 : 4);
                    const answer = rows * cols;
                    let gridHTML = `<div class="array-grid" style="grid-template-columns: repeat(${cols}, 1fr)">`;
                    for (let i = 0; i < rows * cols; i++) {
                        gridHTML += `<div class="array-item" style="animation-delay:${i * 0.03}s">🏊</div>`;
                    }
                    gridHTML += '</div>';
                    return {
                        type: 'input',
                        questionText: `This array shows ${rows} rows and ${cols} columns.<br>Write the multiplication equation answer:`,
                        subText: `${rows} × ${cols} = ?`,
                        visual: gridHTML,
                        answer,
                        hint1: `Count the rows and multiply by the columns`,
                        hint2: `${rows} rows × ${cols} columns = ?`,
                        hint3: `${rows} × ${cols} = ${answer}`
                    };
                }
            },
            // 5. Skip Counting Bubbles
            {
                skillId: 'mult-intro-skip',
                generate(diff) {
                    const skipBy = pick([2, 5, 10]);
                    const steps = R(3, diff >= 2 ? 7 : 5);
                    const sequence = Array.from({length: steps}, (_, i) => skipBy * (i + 1));
                    const hideIndex = R(1, steps - 1);
                    const answer = sequence[hideIndex];
                    const display = sequence.map((n, i) => i === hideIndex ? '❓' : n).join(', ');
                    return {
                        type: 'input',
                        questionText: `Skip count by ${skipBy}s! Find the missing number:`,
                        visual: `<div style="font-size: 1.4rem; font-weight: 700; letter-spacing: 2px;">${display}</div>`,
                        answer,
                        hint1: `We're counting by ${skipBy}s: ${skipBy}, ${skipBy * 2}, ${skipBy * 3}...`,
                        hint2: `The number before is ${sequence[hideIndex - 1]} and after is ${sequence[hideIndex + 1] || '...'}.`,
                        hint3: `The missing number is ${answer}`
                    };
                }
            },
            // 6. Commutative Splash
            {
                skillId: 'mult-intro-commutative',
                generate(diff) {
                    const a = R(2, diff >= 2 ? 8 : 5);
                    const b = R(2, diff >= 2 ? 8 : 5);
                    const answer = true;
                    const wrong = a !== b; // always true since both >= 2
                    return {
                        type: 'true-false',
                        questionText: `True or False?<br>${a} × ${b} = ${b} × ${a}`,
                        visual: `<div style="display:flex; gap: 24px; align-items:center;">
                            <div style="text-align:center">
                                <div style="font-size:1.2rem; font-weight:700; margin-bottom:8px">${a} × ${b}</div>
                                <div class="swimmer-group">${Array.from({length: a}, () => '<span class="swimmer-item">🏊</span>').join('')}</div>
                            </div>
                            <div style="font-size:2rem">=</div>
                            <div style="text-align:center">
                                <div style="font-size:1.2rem; font-weight:700; margin-bottom:8px">${b} × ${a}</div>
                                <div class="swimmer-group">${Array.from({length: b}, () => '<span class="swimmer-item">🏊</span>').join('')}</div>
                            </div>
                        </div>`,
                        answer: true,
                        hint1: `The order of multiplication doesn't change the answer!`,
                        hint2: `${a} × ${b} = ${a * b} and ${b} × ${a} = ${b * a}`,
                        hint3: `Both equal ${a * b}! This is the commutative property.`
                    };
                }
            },
            // 7. Word Problem Relay
            {
                skillId: 'mult-intro-word',
                generate(diff) {
                    const scenarios = [
                        { text: (a, b) => `At the swim meet, there are ${a} heats. Each heat has ${b} swimmers. How many swimmers compete in total?`, emoji: '🏊' },
                        { text: (a, b) => `The pool has ${a} lanes. Each lane has ${b} floating kickboards. How many kickboards are there?`, emoji: '🏄' },
                        { text: (a, b) => `${a} friends each swam ${b} laps. How many laps were swum in total?`, emoji: '🌊' },
                        { text: (a, b) => `There are ${a} swimming teams. Each team has ${b} members. How many swimmers total?`, emoji: '🤽' },
                    ];
                    const s = pick(scenarios);
                    const a = R(2, diff >= 2 ? 9 : 5);
                    const b = R(2, diff >= 2 ? 9 : 5);
                    const answer = a * b;
                    return {
                        type: 'input',
                        questionText: s.text(a, b),
                        visual: `<div style="font-size:3rem">${s.emoji}</div>`,
                        answer,
                        hint1: `This is a multiplication problem! What two numbers do we multiply?`,
                        hint2: `Multiply: ${a} × ${b} = ?`,
                        hint3: `${a} × ${b} = ${answer}`
                    };
                }
            }
        ];
    }
};
