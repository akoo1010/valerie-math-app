/* ===== UNIT 5: FRACTIONS — Arts & Crafts Theme 🎨 ===== */

const Fractions = {
    id: 'fractions',
    title: 'Fractions',
    icon: '🎨',
    theme: 'craft',
    description: "Cut, fold, and color your way through fractions! Learn how parts make a whole with arts & crafts!",
    exerciseCount: 8,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Paper Folding
            {
                skillId: 'frac-fold',
                generate(diff) {
                    const denom = pick(diff >= 2 ? [2, 3, 4, 6, 8] : [2, 3, 4]);
                    const numer = R(1, denom - 1);
                    return {
                        type: 'fraction-click',
                        questionText: `Color ${numer}/${denom} of the paper strip!`,
                        subText: `Click ${numer} out of ${denom} parts`,
                        parts: denom,
                        targetNumerator: numer,
                        targetDenominator: denom,
                        answer: numer,
                        hint1: `The strip is divided into ${denom} equal parts. Click ${numer} of them!`,
                        hint2: `${numer}/${denom} means ${numer} out of ${denom} parts`,
                        hint3: `Color exactly ${numer} parts out of ${denom}`
                    };
                }
            },
            // 2. Name the Fraction
            {
                skillId: 'frac-name',
                generate(diff) {
                    const denom = pick(diff >= 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4]);
                    // Use proper fractions (numer < denom) so distractors don't collide with the answer
                    const numer = R(1, denom - 1);
                    const colors = ['#ff8fab', '#cdb4db', '#b8f2e6', '#fde68a', '#ff7f7f', '#a8e6cf'];
                    let barHTML = '<div class="fraction-bar" style="pointer-events:none">';
                    for (let i = 0; i < denom; i++) {
                        barHTML += `<div class="fraction-part ${i < numer ? 'selected' : ''}">${i < numer ? '▓' : ''}</div>`;
                    }
                    barHTML += '</div>';
                    const answer = `${numer}/${denom}`;
                    // Build unique options
                    const seen = new Set([answer]);
                    const optionStrings = [answer];
                    const candidates = [
                        `${denom}/${numer}`,
                        `${numer}/${denom + 1}`,
                        `${numer + 1}/${denom}`,
                        `${Math.max(1, numer - 1)}/${denom}`,
                        `${numer}/${Math.max(2, denom - 1)}`
                    ];
                    for (const c of candidates) {
                        if (!seen.has(c)) {
                            seen.add(c);
                            optionStrings.push(c);
                            if (optionStrings.length === 4) break;
                        }
                    }
                    const options = Engine.Utils.shuffle(optionStrings.map(s => ({label: s, value: s})));
                    return {
                        type: 'multiple-choice',
                        questionText: `What fraction of the ribbon is colored?`,
                        visual: barHTML,
                        answer,
                        options,
                        hint1: `Count the colored parts (numerator) and total parts (denominator)`,
                        hint2: `${numer} parts colored out of ${denom} total`,
                        hint3: `The fraction is ${numer}/${denom}`
                    };
                }
            },
            // 3. Equivalent Fractions
            {
                skillId: 'frac-equiv',
                generate(diff) {
                    // Mix of equivalent and non-equivalent pairs so the answer can be either true or false
                    const pairs = [
                        // equivalent
                        [1,2,2,4], [1,3,2,6], [2,4,1,2], [2,3,4,6], [1,4,2,8], [3,6,1,2],
                        // NOT equivalent
                        [1,2,1,3], [1,3,2,5], [2,3,1,2], [1,4,1,3], [2,5,1,2], [3,4,2,3]
                    ];
                    const [n1,d1,n2,d2] = pick(pairs);
                    return {
                        type: 'true-false',
                        questionText: `Are these fractions equivalent?<br>${n1}/${d1} = ${n2}/${d2}?`,
                        visual: `<div style="display:flex;gap:20px;align-items:center;">
                            <div style="text-align:center">
                                <div class="fraction-bar" style="width:200px;pointer-events:none">
                                    ${Array.from({length:d1}, (_, i) => `<div class="fraction-part ${i < n1 ? 'selected' : ''}"></div>`).join('')}
                                </div>
                                <div style="font-weight:700;margin-top:6px">${n1}/${d1}</div>
                            </div>
                            <div style="font-size:1.5rem">=?</div>
                            <div style="text-align:center">
                                <div class="fraction-bar" style="width:200px;pointer-events:none">
                                    ${Array.from({length:d2}, (_, i) => `<div class="fraction-part ${i < n2 ? 'selected' : ''}"></div>`).join('')}
                                </div>
                                <div style="font-weight:700;margin-top:6px">${n2}/${d2}</div>
                            </div>
                        </div>`,
                        answer: (n1 / d1) === (n2 / d2),
                        hint1: `Compare the colored amounts — do they cover the same amount?`,
                        hint2: `${n1}/${d1} = ${(n1/d1).toFixed(2)} and ${n2}/${d2} = ${(n2/d2).toFixed(2)}`,
                        hint3: `${n1}/${d1} ${(n1/d1) === (n2/d2) ? '=' : '≠'} ${n2}/${d2}`
                    };
                }
            },
            // 4. Comparing Fractions
            {
                skillId: 'frac-compare',
                generate(diff) {
                    const d = pick(diff >= 2 ? [3,4,5,6,8] : [2,3,4]);
                    const n1 = R(1, d - 1);
                    let n2 = R(1, d - 1);
                    while (n2 === n1) n2 = R(1, d - 1);
                    const bigger = n1 > n2 ? `${n1}/${d}` : `${n2}/${d}`;
                    return {
                        type: 'multiple-choice',
                        questionText: `Which fraction is bigger?`,
                        visual: `<div style="display:flex;gap:24px;align-items:center;flex-direction:column;">
                            <div>
                                <div class="fraction-bar" style="width:300px;pointer-events:none">
                                    ${Array.from({length:d}, (_, i) => `<div class="fraction-part ${i < n1 ? 'selected' : ''}"></div>`).join('')}
                                </div>
                                <div style="text-align:center;font-weight:700;margin-top:4px">${n1}/${d}</div>
                            </div>
                            <div>
                                <div class="fraction-bar" style="width:300px;pointer-events:none">
                                    ${Array.from({length:d}, (_, i) => `<div class="fraction-part ${i < n2 ? 'selected' : ''}" style="background:${i < n2 ? 'var(--craft-lavender)' : ''}"></div>`).join('')}
                                </div>
                                <div style="text-align:center;font-weight:700;margin-top:4px">${n2}/${d}</div>
                            </div>
                        </div>`,
                        answer: bigger,
                        options: [{label: `${n1}/${d}`, value: `${n1}/${d}`}, {label: `${n2}/${d}`, value: `${n2}/${d}`}],
                        hint1: `When fractions have the same denominator, the one with the bigger numerator is bigger!`,
                        hint2: `${n1} vs ${n2} — which is more parts?`,
                        hint3: `${bigger} is bigger!`
                    };
                }
            },
            // 5. Fraction of a Set
            {
                skillId: 'frac-set',
                generate(diff) {
                    const denom = pick([2, 3, 4, 5]);
                    const total = denom * R(2, 4);
                    const numer = R(1, denom - 1);
                    const answer = (numer / denom) * total;
                    const items = pick(['beads', 'buttons', 'stars', 'hearts']);
                    const emojis = { beads: '🔵', buttons: '🔘', stars: '⭐', hearts: '❤️' };
                    return {
                        type: 'input',
                        questionText: `Color ${numer}/${denom} of the ${total} ${items}.<br>How many should you color?`,
                        visual: `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: total}, () => `<span style="font-size:1.5rem">${emojis[items]}</span>`).join('')}
                        </div>`,
                        answer,
                        hint1: `First divide ${total} into ${denom} equal groups`,
                        hint2: `Each group has ${total / denom}. Take ${numer} of those groups.`,
                        hint3: `${numer}/${denom} of ${total} = ${answer}`
                    };
                }
            },
            // 6. Unit Fractions
            {
                skillId: 'frac-unit',
                generate(diff) {
                    const fracs = diff >= 2 ? [2,3,4,5,6,8] : [2,3,4,5];
                    const d1 = pick(fracs);
                    let d2 = pick(fracs);
                    while (d2 === d1) d2 = pick(fracs);
                    const bigger = d1 < d2 ? `1/${d1}` : `1/${d2}`;
                    return {
                        type: 'multiple-choice',
                        questionText: `Which unit fraction is bigger?<br>1/${d1} or 1/${d2}?`,
                        visual: `<div style="display:flex;gap:20px;flex-direction:column;align-items:center;">
                            <div>
                                <div class="fraction-bar" style="width:300px;pointer-events:none">
                                    ${Array.from({length:d1}, (_, i) => `<div class="fraction-part ${i === 0 ? 'selected' : ''}"></div>`).join('')}
                                </div>
                                <span style="font-weight:700">1/${d1}</span>
                            </div>
                            <div>
                                <div class="fraction-bar" style="width:300px;pointer-events:none">
                                    ${Array.from({length:d2}, (_, i) => `<div class="fraction-part ${i === 0 ? 'selected' : ''}" style="background:${i === 0 ? 'var(--craft-lavender)' : ''}"></div>`).join('')}
                                </div>
                                <span style="font-weight:700">1/${d2}</span>
                            </div>
                        </div>`,
                        answer: bigger,
                        options: [{label: `1/${d1}`, value: `1/${d1}`}, {label: `1/${d2}`, value: `1/${d2}`}],
                        hint1: `With unit fractions: the smaller the denominator, the BIGGER the piece!`,
                        hint2: `1/${Math.min(d1,d2)} is a bigger piece than 1/${Math.max(d1,d2)}`,
                        hint3: `${bigger} is bigger because fewer pieces means each piece is larger!`
                    };
                }
            },
            // 7. Whole Numbers as Fractions
            {
                skillId: 'frac-whole',
                generate(diff) {
                    const whole = R(1, 5);
                    const denom = pick([1, 2, 3, 4]);
                    const numer = whole * denom;
                    return {
                        type: 'input',
                        questionText: `Write ${whole} as a fraction with denominator ${denom}.<br>What is the numerator?`,
                        subText: `${whole} = ?/${denom}`,
                        visual: `<div style="font-size:2rem;font-weight:700;color:var(--craft-pink);">${whole} = <span style="color:var(--craft-yellow)">?</span>/${denom}</div>`,
                        answer: numer,
                        hint1: `How many ${denom}ths make ${whole} whole?`,
                        hint2: `${whole} × ${denom} = ?`,
                        hint3: `${whole} = ${numer}/${denom}`
                    };
                }
            },
            // 8. Fraction Word Problems
            {
                skillId: 'frac-word',
                generate(diff) {
                    const denom = pick([2, 3, 4, 5, 6]);
                    const numer = R(1, denom - 1);
                    const total = denom * R(2, 4);
                    const answer = (numer * total) / denom;
                    const scenarios = [
                        `You have ${total} colored pencils. You let your friend borrow ${numer}/${denom} of them. How many did you lend?`,
                        `There are ${total} stickers. You use ${numer}/${denom} of them. How many did you use?`,
                        `A ribbon is ${total} inches long. You cut off ${numer}/${denom} of it. How many inches did you cut?`,
                    ];
                    return {
                        type: 'input',
                        questionText: pick(scenarios),
                        visual: `<div style="font-size:2.5rem">✂️🎨</div>`,
                        answer,
                        hint1: `Find ${numer}/${denom} of ${total}: divide by ${denom}, then multiply by ${numer}`,
                        hint2: `${total} ÷ ${denom} = ${total / denom}. Then × ${numer} = ?`,
                        hint3: `${numer}/${denom} of ${total} = ${answer}`
                    };
                }
            }
        ];
    }
};
