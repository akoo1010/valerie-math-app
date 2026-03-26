/* ===== UNIT 8: AREA — Swimming Theme 🏊 ===== */

const Area = {
    id: 'area',
    title: 'Area',
    icon: '🏊',
    theme: 'swim',
    description: "Tile swimming pools and measure surfaces! Learn how to calculate the space inside shapes!",
    exerciseCount: 8,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Tile the Pool — count unit squares
            {
                skillId: 'area-count',
                generate(diff) {
                    const rows = R(2, diff >= 2 ? 6 : 4);
                    const cols = R(2, diff >= 2 ? 6 : 4);
                    const answer = rows * cols;
                    return {
                        type: 'input',
                        questionText: `Count the tiles to find the area of this pool!`,
                        subText: `Area = ? square units`,
                        visual: `<div class="exercise-grid" style="grid-template-columns: repeat(${cols}, 40px);">
                            ${Array.from({length: answer}, (_, i) =>
                                `<div class="grid-cell filled" style="animation-delay:${i * 0.02}s; cursor:default;">🏊</div>`
                            ).join('')}
                        </div>`,
                        answer,
                        hint1: `Count all the tiles, or multiply rows × columns!`,
                        hint2: `${rows} rows × ${cols} columns = ?`,
                        hint3: `Area = ${rows} × ${cols} = ${answer} square units`
                    };
                }
            },
            // 2. Pool Designer — L × W
            {
                skillId: 'area-lw',
                generate(diff) {
                    const l = R(3, diff >= 2 ? 12 : 8);
                    const w = R(2, diff >= 2 ? 10 : 6);
                    const answer = l * w;
                    return {
                        type: 'input',
                        questionText: `The pool is ${l} meters long and ${w} meters wide.<br>What is the area?`,
                        inputSuffix: 'sq m',
                        visual: `<div style="border: 3px solid var(--ocean-glow); padding: 20px 40px; border-radius: 8px; position: relative; background: rgba(69,183,209,0.1);">
                            <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--ocean-dark);padding:0 8px;font-weight:700;">${l} m</div>
                            <div style="position:absolute;right:-30px;top:50%;transform:translateY(-50%) rotate(90deg);font-weight:700;">${w} m</div>
                            <div style="font-size:2rem;text-align:center;">🏊</div>
                        </div>`,
                        answer,
                        hint1: `Area of a rectangle = length × width`,
                        hint2: `${l} × ${w} = ?`,
                        hint3: `Area = ${l} × ${w} = ${answer} square meters`
                    };
                }
            },
            // 3. Compound Pool — L-shape
            {
                skillId: 'area-compound',
                generate(diff) {
                    const w1 = R(3, 6);
                    const h1 = R(3, 6);
                    const w2 = R(2, 4);
                    const h2 = R(2, 4);
                    const area1 = w1 * h1;
                    const area2 = w2 * h2;
                    const answer = area1 + area2;
                    return {
                        type: 'input',
                        questionText: `This L-shaped pool is made of 2 rectangles.<br>Rectangle 1: ${w1} × ${h1} m&nbsp;&nbsp;|&nbsp;&nbsp;Rectangle 2: ${w2} × ${h2} m<br>What is the total area?`,
                        inputSuffix: 'sq m',
                        visual: `<div style="display:flex;gap:2px;">
                            <div style="width:${w1 * 18}px;height:${h1 * 18}px;background:rgba(69,183,209,0.3);border:2px solid var(--ocean-glow);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;">${w1}×${h1}</div>
                            <div style="width:${w2 * 18}px;height:${h2 * 18}px;background:rgba(69,183,209,0.2);border:2px solid var(--ocean-light);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;align-self:flex-end;">${w2}×${h2}</div>
                        </div>`,
                        answer,
                        hint1: `Find the area of each rectangle, then add them together!`,
                        hint2: `Rectangle 1: ${w1} × ${h1} = ${area1}. Rectangle 2: ${w2} × ${h2} = ${area2}`,
                        hint3: `${area1} + ${area2} = ${answer} square meters`
                    };
                }
            },
            // 4. Mystery Pool — given area, find dimensions
            {
                skillId: 'area-mystery',
                generate(diff) {
                    const l = R(3, 8);
                    const w = R(2, 6);
                    const area = l * w;
                    return {
                        type: 'input',
                        questionText: `A pool has an area of ${area} square meters. It is ${l} meters long.<br>How wide is it?`,
                        inputSuffix: 'meters',
                        answer: w,
                        hint1: `Area = length × width, so width = area ÷ length`,
                        hint2: `${area} ÷ ${l} = ?`,
                        hint3: `Width = ${area} ÷ ${l} = ${w} meters`
                    };
                }
            },
            // 5. Compare Pools
            {
                skillId: 'area-compare',
                generate(diff) {
                    const l1 = R(3, 7), w1 = R(2, 5);
                    let l2 = R(3, 7), w2 = R(2, 5);
                    while (l1 * w1 === l2 * w2) { l2 = R(3, 7); w2 = R(2, 5); }
                    const a1 = l1 * w1, a2 = l2 * w2;
                    const bigger = a1 > a2 ? 'Pool A' : 'Pool B';
                    return {
                        type: 'multiple-choice',
                        questionText: `Which pool has a bigger area?`,
                        visual: `<div style="display:flex;gap:20px;align-items:flex-end;">
                            <div style="text-align:center">
                                <div style="font-weight:700;margin-bottom:4px">Pool A</div>
                                <div style="width:${l1*15}px;height:${w1*15}px;background:rgba(69,183,209,0.3);border:2px solid var(--ocean-glow);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;">${l1}×${w1}</div>
                            </div>
                            <div style="text-align:center">
                                <div style="font-weight:700;margin-bottom:4px">Pool B</div>
                                <div style="width:${l2*15}px;height:${w2*15}px;background:rgba(45,125,210,0.3);border:2px solid var(--ocean-light);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;">${l2}×${w2}</div>
                            </div>
                        </div>`,
                        answer: bigger,
                        options: [{label: `Pool A (${l1}×${w1})`, value: 'Pool A'}, {label: `Pool B (${l2}×${w2})`, value: 'Pool B'}],
                        hint1: `Calculate the area of each pool!`,
                        hint2: `Pool A: ${l1}×${w1}=${a1}. Pool B: ${l2}×${w2}=${a2}`,
                        hint3: `${bigger} is bigger! (${Math.max(a1,a2)} vs ${Math.min(a1,a2)} sq units)`
                    };
                }
            },
            // 6. Grid Coloring — click to fill area
            {
                skillId: 'area-grid',
                generate(diff) {
                    const target = R(6, diff >= 2 ? 20 : 12);
                    return {
                        type: 'grid-click',
                        questionText: `Click tiles to fill exactly ${target} square units!`,
                        subText: 'Click tiles to color them, click again to uncolor',
                        gridRows: 5,
                        gridCols: 6,
                        targetCount: target,
                        answer: target,
                        hint1: `Count as you click! You need exactly ${target} tiles`,
                        hint2: `You need ${target} colored tiles`,
                        hint3: `Color exactly ${target} tiles`
                    };
                }
            },
            // 7. Area Word Problems
            {
                skillId: 'area-word',
                generate(diff) {
                    const l = R(4, diff >= 2 ? 12 : 8);
                    const w = R(3, diff >= 2 ? 10 : 6);
                    const answer = l * w;
                    const scenarios = [
                        `The swimming pool is ${l} meters long and ${w} meters wide. What is its area in square meters?`,
                        `Valerie's swim towel is ${l} inches long and ${w} inches wide. What is the area?`,
                        `The pool deck is a rectangle: ${l} feet by ${w} feet. What is the area?`,
                    ];
                    return {
                        type: 'input',
                        questionText: pick(scenarios),
                        visual: `<div style="font-size:2.5rem">🏊🏖️</div>`,
                        answer,
                        hint1: `Area = length × width`,
                        hint2: `${l} × ${w} = ?`,
                        hint3: `Area = ${answer} square units`
                    };
                }
            },
            // 8. Tiling Patterns
            {
                skillId: 'area-tiling',
                generate(diff) {
                    const rows = R(3, 5);
                    const cols = R(3, 5);
                    const total = rows * cols;
                    const filled = R(Math.floor(total / 2), total - 1);
                    const answer = filled;
                    return {
                        type: 'input',
                        questionText: `How many tiles are colored in this pool pattern?`,
                        visual: `<div class="exercise-grid" style="grid-template-columns: repeat(${cols}, 40px);">
                            ${Array.from({length: total}, (_, i) => {
                                const isFilled = i < filled;
                                return `<div class="grid-cell ${isFilled ? 'filled' : ''}" style="cursor:default;"></div>`;
                            }).join('')}
                        </div>`,
                        answer,
                        hint1: `Count all the colored (blue) tiles`,
                        hint2: `Count row by row...`,
                        hint3: `There are ${answer} colored tiles`
                    };
                }
            }
        ];
    }
};
