/* ===== UNIT 6: PATTERNS & PROBLEM SOLVING — Geometry Dash Theme 🎮 ===== */

const Patterns = {
    id: 'patterns',
    title: 'Patterns & Problem Solving',
    icon: '🎮',
    theme: 'gd',
    description: "Spot the patterns and solve multi-step problems like a Geometry Dash pro! Find the rules that unlock each level!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Level Pattern Finder — number patterns
            {
                skillId: 'pat-number',
                generate(diff) {
                    // Ensure subtract sequences stay non-negative across 6 steps
                    const subStep = R(2, 5);
                    const subStart = R(subStep * 5 + 5, subStep * 5 + 50);
                    const rules = [
                        { start: R(1,5), step: R(2,5), op: '+' },
                        { start: subStart, step: subStep, op: '-' },
                        { start: R(2,4), step: R(2,3), op: '*' },
                    ];
                    const rule = pick(rules.slice(0, diff >= 2 ? 3 : 2));
                    let seq = [rule.start];
                    for (let i = 1; i < 6; i++) {
                        const prev = seq[i-1];
                        seq.push(rule.op === '+' ? prev + rule.step : rule.op === '-' ? prev - rule.step : prev * rule.step);
                    }
                    const hideIdx = R(2, 4);
                    const answer = seq[hideIdx];
                    return {
                        type: 'input',
                        questionText: `Find the pattern! What's the missing number?`,
                        visual: `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                            ${seq.map((n, i) => `<div class="gd-block ${i === hideIdx ? 'portal' : 'jump'}" style="width:50px;height:50px;font-size:${i === hideIdx ? '1.2rem' : '0.95rem'};">${i === hideIdx ? '?' : n}</div>`).join('')}
                        </div>`,
                        answer,
                        hint1: `Look at how the numbers change from one to the next`,
                        hint2: `The rule is: ${rule.op === '+' ? 'add' : rule.op === '-' ? 'subtract' : 'multiply by'} ${rule.step}`,
                        hint3: `The missing number is ${answer}`
                    };
                }
            },
            // 2. Even/Odd Jump Pads
            {
                skillId: 'pat-even-odd',
                generate(diff) {
                    const num = R(1, diff >= 2 ? 99 : 30);
                    const isEven = num % 2 === 0;
                    return {
                        type: 'multiple-choice',
                        questionText: `Is ${num} even or odd?<br>Jump to the right pad!`,
                        visual: `<div style="font-size:3rem;font-weight:800;color:var(--gd-yellow);animation:bounce 1s ease-in-out infinite;">${num}</div>`,
                        answer: isEven ? 'Even' : 'Odd',
                        options: [{label: '🟢 Even', value: 'Even'}, {label: '🔴 Odd', value: 'Odd'}],
                        hint1: `Even numbers end in 0, 2, 4, 6, or 8. Odd numbers end in 1, 3, 5, 7, or 9.`,
                        hint2: `${num} ends in ${num % 10}. Is that even or odd?`,
                        hint3: `${num} is ${isEven ? 'even' : 'odd'}!`
                    };
                }
            },
            // 3. Multi-Step Levels
            {
                skillId: 'pat-multi-step',
                generate(diff) {
                    const a = R(5, 20);
                    const b = R(3, 10);
                    const c = R(2, 8);
                    const scenarios = [
                        { text: `You collected ${a} coins in Level 1 and ${b} coins in Level 2. Then you spent ${c} coins on a power-up. How many coins do you have left?`, answer: a + b - c },
                        { text: `You had ${a} gems. You found ${b} more, then your friend gave you ${c} more. How many gems total?`, answer: a + b + c },
                        { text: `There were ${a + b} obstacles. You destroyed ${b} of them, then ${c} more appeared. How many are there now?`, answer: a + c },
                    ];
                    const s = pick(scenarios);
                    return {
                        type: 'input',
                        questionText: s.text,
                        visual: `<div style="font-size:2rem">🎮💎</div>`,
                        answer: s.answer,
                        hint1: `This has two steps! Do the first operation, then the second.`,
                        hint2: `Work through it step by step...`,
                        hint3: `The answer is ${s.answer}`
                    };
                }
            },
            // 4. Number Pattern Generator
            {
                skillId: 'pat-generate',
                generate(diff) {
                    const start = R(1, 10);
                    const add = R(2, diff >= 2 ? 8 : 5);
                    const seq = Array.from({length: 5}, (_, i) => start + add * i);
                    const answer = start + add * 5;
                    return {
                        type: 'input',
                        questionText: `What comes next in the pattern?`,
                        visual: `<div style="display:flex;gap:8px;align-items:center;justify-content:center;">
                            ${seq.map(n => `<div class="gd-block coin" style="width:50px;height:50px;">${n}</div>`).join('')}
                            <div class="gd-block portal" style="width:50px;height:50px;">?</div>
                        </div>`,
                        answer,
                        hint1: `What's the difference between each number?`,
                        hint2: `The pattern adds ${add} each time. ${seq[seq.length-1]} + ${add} = ?`,
                        hint3: `Next number is ${answer}`
                    };
                }
            },
            // 5. Shape Pattern Builder
            {
                skillId: 'pat-shape',
                generate(diff) {
                    const patterns = [
                        { seq: ['🔴','🔵','🔴','🔵','🔴','🔵'], next: '🔴', desc: 'red, blue' },
                        { seq: ['⬛','⬛','⬜','⬛','⬛','⬜'], next: '⬛', desc: 'black, black, white' },
                        { seq: ['🔺','🟢','🔺','🟢','🔺','🟢'], next: '🔺', desc: 'triangle, circle' },
                        { seq: ['⭐','⭐','❤️','⭐','⭐','❤️'], next: '⭐', desc: 'star, star, heart' },
                    ];
                    const p = pick(patterns);
                    const allChoices = ['🔴','🔵','⬛','⬜','🔺','🟢','⭐','❤️'];
                    const options = Engine.Utils.shuffle([p.next, ...allChoices.filter(x => x !== p.next).slice(0, 3)]);
                    return {
                        type: 'multiple-choice',
                        questionText: `What comes next in the shape pattern?`,
                        visual: `<div style="display:flex;gap:8px;font-size:2rem;align-items:center;">
                            ${p.seq.map(s => `<span>${s}</span>`).join('')}
                            <span style="font-size:2.5rem">❓</span>
                        </div>`,
                        answer: p.next,
                        options: options.map(o => ({label: o, value: o})),
                        hint1: `The pattern repeats: ${p.desc}...`,
                        hint2: `Look at the repeating group and figure out which comes next`,
                        hint3: `The next shape is ${p.next}`
                    };
                }
            },
            // 6. Input-Output Machine
            {
                skillId: 'pat-machine',
                generate(diff) {
                    const subVal = R(1, 5);
                    const rules = [
                        { op: '+', val: R(2, 8), label: 'adds' },
                        { op: '*', val: R(2, 5), label: 'multiplies by' },
                        { op: '-', val: subVal, label: 'subtracts' },
                    ];
                    const rule = pick(rules.slice(0, diff >= 2 ? 3 : 2));
                    const applyRule = (n) => rule.op === '+' ? n + rule.val : rule.op === '*' ? n * rule.val : n - rule.val;
                    // For subtract, ensure all inputs and test stay >= rule.val so outputs are non-negative
                    const minIn = rule.op === '-' ? rule.val + 1 : 1;
                    const inputs = [R(minIn, minIn + 4), R(minIn + 2, minIn + 7), R(minIn + 4, minIn + 9)];
                    // Ensure testInput is not already shown in the I/O table (otherwise the answer is given away)
                    let testInput;
                    let tries = 0;
                    do { testInput = R(minIn + 1, minIn + 11); tries++; } while (inputs.includes(testInput) && tries < 20);
                    const answer = applyRule(testInput);
                    return {
                        type: 'input',
                        questionText: `The machine follows a rule. What does it output for ${testInput}?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.5rem;margin-bottom:8px;">🤖 Mystery Machine</div>
                            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;font-weight:700;">
                                <span>IN</span><span></span><span>OUT</span>
                                ${inputs.map(i => `<span>${i}</span><span>→</span><span>${applyRule(i)}</span>`).join('')}
                                <span style="color:var(--gd-yellow)">${testInput}</span><span>→</span><span style="color:var(--gd-cyan)">?</span>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Look at how each input changes to its output. What's the rule?`,
                        hint2: `The machine ${rule.label} ${rule.val}`,
                        hint3: `${testInput} → ${answer}`
                    };
                }
            },
            // 7. Story Problem Strategy
            {
                skillId: 'pat-strategy',
                generate(diff) {
                    const a = R(5, 15);
                    const b = R(2, 8);
                    const c = R(3, 10);
                    const probs = [
                        { text: `Valerie beat ${a} levels on Monday. She beat ${b} times as many on Tuesday. How many total levels did she beat both days?`, answer: a + (a * b), steps: `${a} + (${a} × ${b}) = ${a} + ${a * b} = ${a + a * b}` },
                        { text: `There are ${a} rows of jump pads with ${b} pads in each row. ${c} pads break. How many pads are left?`, answer: a * b - c, steps: `(${a} × ${b}) − ${c} = ${a * b} − ${c} = ${a * b - c}` },
                    ];
                    const p = pick(probs);
                    return {
                        type: 'input',
                        questionText: p.text,
                        visual: `<div style="font-size:2rem">🎯🧠</div>`,
                        answer: p.answer,
                        hint1: `Break this into two steps!`,
                        hint2: `Step by step: ${p.steps}`,
                        hint3: `The answer is ${p.answer}`
                    };
                }
            }
        ];
    }
};
