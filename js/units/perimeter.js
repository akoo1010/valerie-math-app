/* ===== UNIT 9: PERIMETER — Geometry Dash Theme 🎮 ===== */

const Perimeter = {
    id: 'perimeter',
    title: 'Perimeter',
    icon: '🎮',
    theme: 'gd',
    description: "Build fences around Geometry Dash levels! Calculate the distance around shapes to beat each challenge!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Fence the Level
            {
                skillId: 'perim-calc',
                generate(diff) {
                    const l = R(3, diff >= 2 ? 12 : 8);
                    const w = R(2, diff >= 2 ? 10 : 6);
                    const answer = 2 * (l + w);
                    return {
                        type: 'input',
                        questionText: `The GD level platform is ${l} units long and ${w} units wide.<br>What is the perimeter?`,
                        inputSuffix: 'units',
                        visual: `<div style="border: 3px solid var(--gd-cyan); padding: 24px 40px; border-radius: 4px; position: relative; background: rgba(0,240,255,0.05);">
                            <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-cyan);">${l}</div>
                            <div style="position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-cyan);">${l}</div>
                            <div style="position:absolute;left:-12px;top:50%;transform:translateY(-50%) rotate(-90deg);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-pink);">${w}</div>
                            <div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%) rotate(90deg);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-pink);">${w}</div>
                            <div style="text-align:center;font-size:1.5rem;">🎮</div>
                        </div>`,
                        answer,
                        hint1: `Perimeter = add up all the sides!`,
                        hint2: `${l} + ${w} + ${l} + ${w} = ?`,
                        hint3: `Perimeter = 2 × (${l} + ${w}) = ${answer} units`
                    };
                }
            },
            // 2. Same Perimeter, Different Shape
            {
                skillId: 'perim-same',
                generate(diff) {
                    const perim = R(12, 24) * 2; // even perimeter
                    const l1 = R(perim / 4, perim / 2 - 1);
                    const w1 = perim / 2 - l1;
                    // Find another pair
                    let l2 = l1 + R(1, 3);
                    let w2 = perim / 2 - l2;
                    if (w2 <= 0) { l2 = l1 - 1; w2 = perim / 2 - l2; }
                    const correctPair = `${l2} × ${w2}`;
                    const wrongPairs = [
                        `${l2 + 1} × ${w2}`,
                        `${l2} × ${w2 + 1}`,
                        `${l2 - 1} × ${w2 - 1}`
                    ].filter(p => p !== correctPair);
                    return {
                        type: 'multiple-choice',
                        questionText: `A platform is ${l1} × ${w1} with perimeter ${perim}.<br>Which other rectangle also has perimeter ${perim}?`,
                        answer: correctPair,
                        options: Engine.Utils.shuffle([correctPair, ...wrongPairs.slice(0, 3)]).map(o => ({label: o, value: o})),
                        hint1: `Perimeter = 2 × (length + width) = ${perim}`,
                        hint2: `So length + width must equal ${perim / 2}`,
                        hint3: `${l2} + ${w2} = ${perim / 2}, so ${correctPair} works!`
                    };
                }
            },
            // 3. Missing Side
            {
                skillId: 'perim-missing',
                generate(diff) {
                    const l = R(4, 12);
                    const w = R(3, 8);
                    const perim = 2 * (l + w);
                    const hideWidth = Math.random() < 0.5;
                    const answer = hideWidth ? w : l;
                    return {
                        type: 'input',
                        questionText: hideWidth
                            ? `A platform has perimeter ${perim} and length ${l}.<br>What is the width?`
                            : `A platform has perimeter ${perim} and width ${w}.<br>What is the length?`,
                        inputSuffix: 'units',
                        visual: `<div style="border: 3px solid var(--gd-pink); padding: 20px 35px; border-radius: 4px; position: relative;">
                            <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-cyan);"> ${hideWidth ? l : '?'}</div>
                            <div style="position:absolute;right:-18px;top:50%;transform:translateY(-50%) rotate(90deg);background:var(--gd-dark);padding:0 8px;font-weight:700;color:var(--gd-yellow);">${hideWidth ? '?' : w}</div>
                            <div style="font-weight:700;font-size:0.85rem;color:var(--text-muted);">P = ${perim}</div>
                        </div>`,
                        answer,
                        hint1: `Perimeter = 2 × (length + width)`,
                        hint2: `${perim} = 2 × (${hideWidth ? l : '?'} + ${hideWidth ? '?' : w}). Solve for ?`,
                        hint3: `${perim} ÷ 2 = ${perim/2}. ${perim/2} - ${hideWidth ? l : w} = ${answer}`
                    };
                }
            },
            // 4. Perimeter vs Area
            {
                skillId: 'perim-vs-area',
                generate(diff) {
                    const l = R(3, 8);
                    const w = R(2, 6);
                    const perim = 2 * (l + w);
                    const area = l * w;
                    const askPerim = Math.random() < 0.5;
                    return {
                        type: 'multiple-choice',
                        questionText: `A rectangle is ${l} × ${w}.<br>What is its ${askPerim ? 'PERIMETER' : 'AREA'}?`,
                        subText: askPerim ? '(distance around)' : '(space inside)',
                        answer: askPerim ? perim : area,
                        options: Engine.Utils.shuffle([perim, area, perim + R(1,5), area + R(1,5)]),
                        hint1: askPerim ? 'Perimeter = add all sides' : 'Area = length × width',
                        hint2: askPerim ? `${l}+${w}+${l}+${w} = ?` : `${l} × ${w} = ?`,
                        hint3: `${askPerim ? 'Perimeter' : 'Area'} = ${askPerim ? perim : area}`
                    };
                }
            },
            // 5. Add All Sides — irregular shape
            {
                skillId: 'perim-sides',
                generate(diff) {
                    const sides = diff >= 2 ? [R(2,8), R(2,8), R(2,8), R(2,8), R(2,6)] : [R(2,8), R(2,8), R(2,8), R(2,8)];
                    const answer = sides.reduce((a, b) => a + b, 0);
                    return {
                        type: 'input',
                        questionText: `Add all the sides to find the perimeter!`,
                        visual: `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                            ${sides.map((s, i) => `<div class="gd-block jump" style="width:auto;padding:4px 10px;">Side ${i+1}: ${s}</div>`).join('')}
                        </div>`,
                        answer,
                        hint1: `Perimeter = sum of all sides`,
                        hint2: `${sides.join(' + ')} = ?`,
                        hint3: `Perimeter = ${answer} units`
                    };
                }
            },
            // 6. Design a GD Platform — target perimeter
            {
                skillId: 'perim-design',
                generate(diff) {
                    const l = R(4, 10);
                    const w = R(2, 8);
                    const perim = 2 * (l + w);
                    // Given perimeter, what's one possible length?
                    return {
                        type: 'input',
                        questionText: `Design a rectangle with perimeter ${perim}.<br>If the width is ${w}, what is the length?`,
                        inputSuffix: 'units',
                        answer: l,
                        visual: `<div style="text-align:center;font-size:1.2rem;font-weight:700;color:var(--gd-green);">
                            Target perimeter: ${perim} units<br>
                            <span style="color:var(--gd-pink)">Width = ${w}</span>, <span style="color:var(--gd-cyan)">Length = ?</span>
                        </div>`,
                        hint1: `Perimeter = 2 × (L + W), so L + W = ${perim / 2}`,
                        hint2: `${perim / 2} − ${w} = ?`,
                        hint3: `Length = ${l} units`
                    };
                }
            },
            // 7. Perimeter Word Problems
            {
                skillId: 'perim-word',
                generate(diff) {
                    const l = R(5, 15);
                    const w = R(3, 10);
                    const perim = 2 * (l + w);
                    const scenarios = [
                        `A GD level border is ${l} units long and ${w} units tall. How many units of fence are needed around it?`,
                        `Valerie is building a frame around her pixel art. It's ${l} cm × ${w} cm. What length of trim does she need?`,
                        `The GD practice zone is a rectangle: ${l} meters by ${w} meters. What's the perimeter?`,
                    ];
                    return {
                        type: 'input',
                        questionText: pick(scenarios),
                        inputSuffix: 'units',
                        answer: perim,
                        hint1: `Perimeter = 2 × (length + width)`,
                        hint2: `2 × (${l} + ${w}) = 2 × ${l + w} = ?`,
                        hint3: `Perimeter = ${perim} units`
                    };
                }
            }
        ];
    }
};
