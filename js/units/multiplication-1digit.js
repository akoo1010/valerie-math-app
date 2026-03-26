/* ===== UNIT 2: 1-DIGIT MULTIPLICATION — Geometry Dash Theme 🎮 ===== */

const Multiplication1Digit = {
    id: 'mult-1digit',
    title: '1-Digit Multiplication',
    icon: '🎮',
    theme: 'gd',
    description: "Master your times tables with Geometry Dash! Jump, dodge, and dash through multiplication challenges!",
    exerciseCount: 8,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Obstacle Multiplier
            {
                skillId: 'mult-1d-obstacles',
                generate(diff) {
                    const groups = R(2, diff >= 2 ? 6 : 4);
                    const per = R(2, diff >= 2 ? 9 : 6);
                    const answer = groups * per;
                    const blockTypes = ['spike', 'coin', 'portal', 'jump'];
                    const bt = pick(blockTypes);
                    const icons = { spike: '▲', coin: '●', portal: '◆', jump: '■' };
                    let visual = '';
                    for (let g = 0; g < groups; g++) {
                        visual += '<div style="display:flex;gap:4px;margin:4px;">';
                        for (let p = 0; p < per; p++) {
                            visual += `<div class="gd-block ${bt}">${icons[bt]}</div>`;
                        }
                        visual += '</div>';
                    }
                    return {
                        type: 'multiple-choice',
                        questionText: `${groups} groups of ${per} obstacles. How many obstacles total?`,
                        visual,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `Count: ${groups} groups × ${per} in each group`,
                        hint2: `${groups} × ${per} = ?`,
                        hint3: `${groups} × ${per} = ${answer}`
                    };
                }
            },
            // 2. Times Table Dash — speed challenge
            {
                skillId: 'mult-1d-times-table',
                generate(diff) {
                    const a = R(2, diff >= 3 ? 12 : diff >= 2 ? 9 : 6);
                    const b = R(2, diff >= 3 ? 12 : diff >= 2 ? 9 : 6);
                    const answer = a * b;
                    return {
                        type: 'multiple-choice',
                        questionText: `⚡ Quick! What is ${a} × ${b}?`,
                        subText: 'Dash past this obstacle!',
                        visual: `<div style="font-size:3rem; animation: glow 1s infinite; color: var(--gd-cyan);">${a} × ${b}</div>`,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `Think about your ${a} times table`,
                        hint2: `${a} × ${b} is the same as adding ${a}, ${b} times`,
                        hint3: `${a} × ${b} = ${answer}`
                    };
                }
            },
            // 3. Coin Collector
            {
                skillId: 'mult-1d-coins',
                generate(diff) {
                    const levels = R(3, diff >= 2 ? 9 : 6);
                    const coins = R(2, diff >= 2 ? 9 : 5);
                    const answer = levels * coins;
                    return {
                        type: 'input',
                        questionText: `Each level has ${coins} coins. You beat ${levels} levels!<br>How many coins did you collect?`,
                        visual: `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: Math.min(levels, 6)}, (_, i) =>
                                `<div style="text-align:center;padding:8px;background:rgba(255,230,0,0.1);border-radius:8px;border:1px solid rgba(255,230,0,0.3);">
                                    <div style="font-size:0.7rem;color:var(--text-muted);">Lvl ${i + 1}</div>
                                    <div>${Array(Math.min(coins, 5)).fill('🪙').join('')}</div>
                                </div>`
                            ).join('')}
                            ${levels > 6 ? '<div style="font-size:1.2rem;align-self:center">...</div>' : ''}
                        </div>`,
                        answer,
                        hint1: `Multiply the number of levels by coins per level`,
                        hint2: `${levels} × ${coins} = ?`,
                        hint3: `${levels} × ${coins} = ${answer}`
                    };
                }
            },
            // 4. Fact Family Blocks
            {
                skillId: 'mult-1d-fact-family',
                generate(diff) {
                    const a = R(2, diff >= 2 ? 9 : 6);
                    const b = R(2, diff >= 2 ? 9 : 6);
                    const product = a * b;
                    // Ask which one is NOT in the fact family
                    const family = [`${a} × ${b} = ${product}`, `${b} × ${a} = ${product}`, `${product} ÷ ${a} = ${b}`, `${product} ÷ ${b} = ${a}`];
                    const wrongC = R(2, 9);
                    const wrongD = product + R(1, 5);
                    const wrong = `${wrongC} × ${a} = ${wrongD}`;
                    const options = Engine.Utils.shuffle([...family.slice(0, 3), wrong]).map(o => ({label: o, value: o}));
                    return {
                        type: 'multiple-choice',
                        questionText: `Which one does NOT belong in the fact family for ${a}, ${b}, and ${product}?`,
                        visual: `<div style="font-size:1.5rem;font-weight:700;color:var(--gd-cyan);">Fact Family: ${a}, ${b}, ${product}</div>`,
                        answer: wrong,
                        options,
                        hint1: 'A fact family uses the same three numbers in multiplication and division',
                        hint2: `The family is: ${a}×${b}=${product}, ${b}×${a}=${product}, ${product}÷${a}=${b}, ${product}÷${b}=${a}`,
                        hint3: `${wrong} is NOT in the fact family!`
                    };
                }
            },
            // 5. Missing Factor
            {
                skillId: 'mult-1d-missing',
                generate(diff) {
                    const a = R(2, diff >= 2 ? 9 : 6);
                    const b = R(2, diff >= 2 ? 9 : 6);
                    const product = a * b;
                    const hideFirst = Math.random() < 0.5;
                    const answer = hideFirst ? a : b;
                    return {
                        type: 'input',
                        questionText: hideFirst
                            ? `? × ${b} = ${product}`
                            : `${a} × ? = ${product}`,
                        subText: 'Find the missing factor to complete the jump!',
                        visual: `<div style="font-size:2rem;">
                            <span style="color:var(--gd-pink)">${hideFirst ? '❓' : a}</span>
                            <span> × </span>
                            <span style="color:var(--gd-cyan)">${hideFirst ? b : '❓'}</span>
                            <span> = </span>
                            <span style="color:var(--gd-green)">${product}</span>
                        </div>`,
                        answer,
                        hint1: `Think: what number times ${hideFirst ? b : a} equals ${product}?`,
                        hint2: `${product} ÷ ${hideFirst ? b : a} = ?`,
                        hint3: `The missing factor is ${answer}`
                    };
                }
            },
            // 6. Speed Run
            {
                skillId: 'mult-1d-speed',
                generate(diff) {
                    const a = R(2, diff >= 3 ? 12 : 9);
                    const b = R(2, diff >= 3 ? 12 : 9);
                    const answer = a * b;
                    return {
                        type: 'multiple-choice',
                        questionText: `🏃 SPEED RUN! ${a} × ${b} = ?`,
                        visual: `<div style="display:flex;align-items:center;gap:12px;font-size:1.5rem;">
                            <div class="gd-block spike">▲</div>
                            <div style="color:var(--gd-yellow);font-weight:800;font-size:2rem;">${a} × ${b}</div>
                            <div class="gd-block spike">▲</div>
                        </div>`,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `${a} times ${b}...`,
                        hint2: `Try skip counting by ${a}: ${Array.from({length: Math.min(b, 5)}, (_, i) => a * (i + 1)).join(', ')}...`,
                        hint3: `${a} × ${b} = ${answer}`
                    };
                }
            },
            // 7. Boss Battle
            {
                skillId: 'mult-1d-boss',
                generate(diff) {
                    const a = R(3, diff >= 2 ? 12 : 9);
                    const b = R(3, diff >= 2 ? 12 : 9);
                    const answer = a * b;
                    return {
                        type: 'input',
                        questionText: `👾 BOSS BATTLE! Defeat the boss!<br>${a} × ${b} = ?`,
                        visual: `<div style="font-size:4rem; animation: bounce 0.5s ease-in-out infinite;">👾</div>`,
                        answer,
                        hint1: `Break it down: ${a} × ${b} = ${a} × ${Math.floor(b/2)} + ${a} × ${b - Math.floor(b/2)}`,
                        hint2: `${a} × ${Math.floor(b/2)} = ${a * Math.floor(b/2)}, plus ${a} × ${b - Math.floor(b/2)} = ${a * (b - Math.floor(b/2))}`,
                        hint3: `${a} × ${b} = ${answer}. Boss defeated!`
                    };
                }
            },
            // 8. Pattern Spotter
            {
                skillId: 'mult-1d-pattern',
                generate(diff) {
                    const base = R(2, 9);
                    const sequence = Array.from({length: 6}, (_, i) => base * (i + 1));
                    const hideIdx = R(2, 4);
                    const answer = sequence[hideIdx];
                    const display = sequence.map((n, i) => i === hideIdx ? '❓' : n);
                    return {
                        type: 'input',
                        questionText: `Find the pattern and fill in the missing number!`,
                        visual: `<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
                            ${display.map((n, i) => `<div class="gd-block ${n === '❓' ? 'portal' : 'jump'}" style="width:50px;height:50px;font-size:${n === '❓' ? '1.2rem' : '1rem'};">${n}</div>`).join('')}
                        </div>`,
                        answer,
                        hint1: `These numbers are multiples of something... look at the differences!`,
                        hint2: `The pattern goes up by ${base} each time: ${base}, ${base * 2}, ${base * 3}...`,
                        hint3: `The missing number is ${answer} (multiples of ${base})`
                    };
                }
            }
        ];
    }
};
