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
                generate(diff, modality) {
                    const rows = R(2, diff >= 2 ? 5 : 3);
                    const cols = R(2, diff >= 2 ? 5 : 3);
                    const answer = rows * cols;
                    let visual = Array.from({length: rows}, () =>
                        `<div class="swimmer-group">${Array.from({length: cols}, () => '<span class="swimmer-item">🏊</span>').join('')}</div>`
                    ).join('');

                    const result = {
                        type: 'multiple-choice',
                        questionText: `There are ${rows} swim lanes with ${cols} swimmers in each lane.<br>How many swimmers in total?`,
                        visual,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `Count the groups: ${rows} groups of ${cols}`,
                        hint2: `Try adding: ${Array(rows).fill(cols).join(' + ')} = ?`,
                        hint3: `${rows} × ${cols} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === rows + cols) return 'added-instead-of-multiplied';
                            if (userAnswer === rows || userAnswer === cols) return 'counted-one-group';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead-of-multiplied': `Careful! We're multiplying, not adding. ${rows} groups of ${cols} means ${rows} × ${cols}, not ${rows} + ${cols}.`,
                            'counted-one-group': `That's only one group! Count ALL ${rows} groups of ${cols} together.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weR = R(2, 3), weC = R(2, 3);
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weR} lanes × ${weC} swimmers = ?</p><p>${Array(weR).fill(weC).join(' + ')} = ${weR * weC}</p><p>So ${weR} × ${weC} = <strong>${weR * weC}</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold"><p>Count row by row:</p>${Array.from({length: rows}, (_, i) => `<div>Lane ${i + 1}: ${cols} swimmers</div>`).join('')}<div><strong>Total: ${rows} × ${cols} = ${answer}</strong></div></div>`;
                    }

                    return result;
                }
            },
            // 2. Repeated Addition Laps
            {
                skillId: 'mult-intro-repeated-add',
                generate(diff, modality) {
                    const groups = R(2, diff >= 2 ? 6 : 4);
                    const perGroup = R(2, diff >= 2 ? 7 : 5);
                    const answer = groups * perGroup;
                    const addExpr = Array(groups).fill(perGroup).join(' + ');
                    const result = {
                        type: 'input',
                        questionText: `Convert to multiplication:`,
                        subText: `${addExpr} = ? × ${perGroup}`,
                        answer: groups,
                        hint1: `How many times is ${perGroup} being added?`,
                        hint2: `Count the ${perGroup}s: there are ${groups} of them`,
                        hint3: `${addExpr} = ${groups} × ${perGroup}`,
                        diagnose(userAnswer) {
                            if (userAnswer === groups * perGroup) return 'gave-product-not-factor';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-product-not-factor': `You found the total, but we need the number of groups! Count how many times ${perGroup} appears.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weG = R(2, 3), weP = R(2, 4);
                        const weExpr = Array(weG).fill(weP).join(' + ');
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weExpr} = ? × ${weP}</p><p>Count the ${weP}s: there are <strong>${weG}</strong> of them.</p><p>So ${weExpr} = <strong>${weG}</strong> × ${weP}</p></div>`;
                    }

                    return result;
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
                generate(diff, modality) {
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
                    const result = {
                        type: 'input',
                        questionText: s.text(a, b),
                        visual: `<div style="font-size:3rem">${s.emoji}</div>`,
                        answer,
                        hint1: `This is a multiplication problem! What two numbers do we multiply?`,
                        hint2: `Multiply: ${a} × ${b} = ?`,
                        hint3: `${a} × ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'added-instead-of-multiplied';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead-of-multiplied': `This is multiplication, not addition! We need ${a} groups of ${b}, so multiply: ${a} × ${b}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(2, 4), weB = R(2, 4);
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 🏊 ${weA} teams with ${weB} swimmers each.</p><p>"Each" means multiply: ${weA} × ${weB} = <strong>${weA * weB}</strong></p></div>`;
                    }

                    return result;
                }
            }
        ];
    }
};
