/* ===== UNIT 4: DIVISION — Swimming Theme 🏊 ===== */

const Division = {
    id: 'division',
    title: 'Division',
    icon: '🏊',
    theme: 'swim',
    description: "Dive into division! Split swimmers into teams, share goggles fairly, and discover how division and multiplication are related!",
    exerciseCount: 8,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Divide Into Teams
            {
                skillId: 'div-teams',
                generate(diff, modality) {
                    const teams = R(2, diff >= 2 ? 6 : 4);
                    const perTeam = R(2, diff >= 2 ? 6 : 4);
                    const total = teams * perTeam;
                    const result = {
                        type: 'input',
                        questionText: `${total} swimmers need to split into ${teams} equal relay teams.<br>How many swimmers per team?`,
                        visual: `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: Math.min(total, 20)}, () => '<span style="font-size:1.3rem">🏊</span>').join('')}
                        </div>`,
                        answer: perTeam,
                        hint1: `Divide the total swimmers by the number of teams`,
                        hint2: `${total} ÷ ${teams} = ?`,
                        hint3: `${total} ÷ ${teams} = ${perTeam}`,
                        diagnose(userAnswer) {
                            if (userAnswer === teams) return 'reversed-division';
                            if (userAnswer === total) return 'gave-total-not-quotient';
                            return null;
                        },
                        misconceptionHints: {
                            'reversed-division': `You found the number of teams, not swimmers per team! Divide ${total} by ${teams}.`,
                            'gave-total-not-quotient': `That's the total! We need to split ${total} into ${teams} groups.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weT = R(2, 3), wePT = R(2, 3), weTotal = weT * wePT;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weTotal} swimmers ÷ ${weT} teams = ?</p><p>Split them evenly: ${Array(weT).fill(wePT).join(' + ')} = ${weTotal}</p><p>Each team gets <strong>${wePT}</strong> swimmers</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold"><p>Deal swimmers to teams one by one:</p>${Array.from({length: teams}, (_, i) => `<div>Team ${i + 1}: ${Array(perTeam).fill('🏊').join('')}</div>`).join('')}<div><strong>${total} ÷ ${teams} = ?</strong></div></div>`;
                    }

                    return result;
                }
            },
            // 2. Fair Share Goggles
            {
                skillId: 'div-share',
                generate(diff) {
                    const friends = R(2, diff >= 2 ? 6 : 4);
                    const each = R(2, diff >= 2 ? 8 : 5);
                    const total = friends * each;
                    return {
                        type: 'input',
                        questionText: `Share ${total} pairs of goggles equally among ${friends} friends.<br>How many does each friend get?`,
                        visual: `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: Math.min(total, 18)}, () => '<span style="font-size:1.2rem">🥽</span>').join('')}
                        </div>`,
                        answer: each,
                        hint1: `Division means sharing equally!`,
                        hint2: `${total} goggles ÷ ${friends} friends = ?`,
                        hint3: `Each friend gets ${each} goggles`
                    };
                }
            },
            // 3. Division as Unknown Factor
            {
                skillId: 'div-unknown',
                generate(diff) {
                    const a = R(2, diff >= 2 ? 9 : 6);
                    const b = R(2, diff >= 2 ? 9 : 6);
                    const product = a * b;
                    return {
                        type: 'input',
                        questionText: `? × ${b} = ${product}<br>How many laps per set?`,
                        visual: `<div style="font-size:1.8rem;font-weight:700;color:var(--ocean-glow);">
                            ❓ × ${b} = ${product}
                        </div>`,
                        answer: a,
                        hint1: `Think: ${product} ÷ ${b} = ?`,
                        hint2: `What number times ${b} gives you ${product}?`,
                        hint3: `${a} × ${b} = ${product}, so the answer is ${a}`
                    };
                }
            },
            // 4. Remainder Splash
            {
                skillId: 'div-remainder',
                generate(diff) {
                    const divisor = R(2, 6);
                    const quotient = R(2, diff >= 2 ? 8 : 5);
                    const remainder = R(1, divisor - 1);
                    const total = divisor * quotient + remainder;
                    return {
                        type: 'input',
                        questionText: `${total} swimmers divided into groups of ${divisor}.<br>How many are left over?`,
                        subText: '(the remainder)',
                        visual: `<div style="text-align:center">
                            <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;max-width:480px;margin:0 auto;">
                                ${Array(divisor * quotient + remainder).fill('<span class="swimmer-item">🏊</span>').join('')}
                            </div>
                            <div style="margin-top:8px;color:var(--text-muted);font-size:0.85rem;">Try grouping them into ${divisor}s in your head!</div>
                        </div>`,
                        answer: remainder,
                        hint1: `How many full groups of ${divisor} can you make, and who's left?`,
                        hint2: `${total} ÷ ${divisor} = ${quotient} remainder ?`,
                        hint3: `${total} ÷ ${divisor} = ${quotient} R ${remainder}`
                    };
                }
            },
            // 5. Division Facts Swim
            {
                skillId: 'div-facts',
                generate(diff, modality) {
                    const a = R(2, diff >= 2 ? 12 : 9);
                    const b = R(2, diff >= 2 ? 12 : 9);
                    const product = a * b;
                    const result = {
                        type: 'multiple-choice',
                        questionText: `${product} ÷ ${a} = ?`,
                        visual: `<div style="font-size:2rem;color:var(--ocean-glow);font-weight:800;">${product} ÷ ${a}</div>`,
                        answer: b,
                        options: Engine.Utils.multipleChoice(b),
                        hint1: `What times ${a} equals ${product}?`,
                        hint2: `Think of your ${a} times table...`,
                        hint3: `${product} ÷ ${a} = ${b}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a) return 'reversed-division';
                            if (userAnswer === product) return 'gave-total-not-quotient';
                            return null;
                        },
                        misconceptionHints: {
                            'reversed-division': `That's the divisor! We need ${product} ÷ ${a}, not the other way around.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(2, 5), weB = R(2, 5), weP = weA * weB;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weP} ÷ ${weA} = ?</p><p>Think: ? × ${weA} = ${weP}</p><p><strong>${weB}</strong> × ${weA} = ${weP} ✓</p></div>`;
                    }

                    return result;
                }
            },
            // 6. Word Problem Dive
            {
                skillId: 'div-word',
                generate(diff) {
                    const scenarios = [
                        { text: (t, g) => `${t} swim caps shared equally among ${g} swimmers. How many each?`, emoji: '🧢' },
                        { text: (t, g) => `${t} towels laid out for ${g} lanes. How many towels per lane?`, emoji: '🏖️' },
                        { text: (t, g) => `Coach has ${t} water bottles for ${g} swimmers. How many each?`, emoji: '🍶' },
                    ];
                    const s = pick(scenarios);
                    const groups = R(2, diff >= 2 ? 8 : 5);
                    const each = R(2, diff >= 2 ? 8 : 5);
                    const total = groups * each;
                    return {
                        type: 'input',
                        questionText: s.text(total, groups),
                        visual: `<div style="font-size:3rem">${s.emoji}</div>`,
                        answer: each,
                        hint1: `Divide the total by the number of groups`,
                        hint2: `${total} ÷ ${groups} = ?`,
                        hint3: `${total} ÷ ${groups} = ${each}`
                    };
                }
            },
            // 7. Fact Family Pools
            {
                skillId: 'div-fact-family',
                generate(diff) {
                    const a = R(2, 9);
                    const b = R(2, 9);
                    const p = a * b;
                    // Which equation is in the fact family?
                    const correct = `${p} ÷ ${b} = ${a}`;
                    // The other true division in the fact family — must NOT be offered as a distractor
                    const otherTrue = `${p} ÷ ${a} = ${b}`;
                    const wrongSet = new Set([
                        `${p} ÷ ${a + 1} = ${b}`,
                        `${p + 1} ÷ ${a} = ${b}`
                    ]);
                    // Build a third distractor that is NOT a true division of p and isn't already used
                    let tries = 0;
                    while (wrongSet.size < 3 && tries < 30) {
                        const wd = R(2, 9);
                        const wq = R(2, 9);
                        const candidate = `${p} ÷ ${wd} = ${wq}`;
                        if (wd * wq !== p && candidate !== correct && candidate !== otherTrue && !wrongSet.has(candidate)) {
                            wrongSet.add(candidate);
                        }
                        tries++;
                    }
                    const wrongs = [...wrongSet];
                    return {
                        type: 'multiple-choice',
                        questionText: `If ${a} × ${b} = ${p}, which division fact is correct?`,
                        answer: correct,
                        options: Engine.Utils.shuffle([correct, ...wrongs.slice(0, 3)]).map(o => ({label: o, value: o})),
                        hint1: `A fact family uses the same three numbers`,
                        hint2: `The numbers are ${a}, ${b}, and ${p}`,
                        hint3: `${p} ÷ ${b} = ${a} ✓`
                    };
                }
            },
            // 8. Division Derby
            {
                skillId: 'div-derby',
                generate(diff) {
                    const a = R(3, diff >= 2 ? 12 : 9);
                    const b = R(2, diff >= 2 ? 12 : 9);
                    const product = a * b;
                    return {
                        type: 'input',
                        questionText: `🏁 Division Derby! Solve fast!<br>${product} ÷ ${b} = ?`,
                        visual: `<div style="font-size:2.5rem;animation:swim 1s ease-in-out infinite;">🏊💨</div>`,
                        answer: a,
                        hint1: `What times ${b} equals ${product}?`,
                        hint2: `Skip count by ${b}: ${Array.from({length: Math.min(a - 1, 4)}, (_, i) => b * (i+1)).join(', ')}...`,
                        hint3: `${product} ÷ ${b} = ${a}`
                    };
                }
            }
        ];
    }
};
