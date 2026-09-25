/* ===== UNIT 3: ADDITION, SUBTRACTION & ESTIMATION — Arts & Crafts Theme 🎨 ===== */

const AdditionSubtraction = {
    id: 'add-sub',
    title: 'Addition & Subtraction',
    icon: '🎨',
    theme: 'craft',
    description: "Add and subtract with your arts & crafts supplies! Count beads, estimate paint, and solve craft shop problems!",
    exerciseCount: 8,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Bead Counter — place value addition
            {
                skillId: 'add-sub-beads',
                generate(diff, modality) {
                    const a = diff >= 2 ? R(100, 500) : R(10, 99);
                    const b = diff >= 2 ? R(100, 500) : R(10, 99);
                    const answer = a + b;
                    const onesSum = (a % 10) + (b % 10);
                    const onesCarry = onesSum >= 10 ? 1 : 0;
                    const tensSum = Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + onesCarry;
                    const tensCarry = tensSum >= 10 ? 1 : 0;
                    const colors = ['#ff8fab', '#cdb4db', '#b8f2e6', '#fde68a', '#ff7f7f'];
                    const result = {
                        type: 'input',
                        questionText: `You have ${a} beads and get ${b} more.<br>How many beads do you have now?`,
                        visual: `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: Math.min(10, Math.floor(a/10))}, (_, i) =>
                                `<span class="craft-bead" style="background:${colors[i % colors.length]}"></span>`
                            ).join('')}
                            <span style="font-size:1.5rem;font-weight:800;color:var(--craft-pink)">+</span>
                            ${Array.from({length: Math.min(10, Math.floor(b/10))}, (_, i) =>
                                `<span class="craft-bead" style="background:${colors[(i+2) % colors.length]}"></span>`
                            ).join('')}
                        </div>`,
                        answer,
                        hint1: `Add the ones first, then the tens, then the hundreds`,
                        hint2: `${a} + ${b}: start with ${a} and count up ${b}`,
                        hint3: `${a} + ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === Math.abs(a - b)) return 'subtracted-instead-of-added';
                            if (Math.abs(userAnswer - answer) === 1) return 'off-by-one';
                            // A dropped carry makes the answer exactly 10 (or 100) too small.
                            if ((onesCarry && userAnswer === answer - 10) || (tensCarry && userAnswer === answer - 100)) return 'carry-error';
                            if ([10, 100].includes(Math.abs(userAnswer - answer))) return 'place-value';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-instead-of-added': `Careful! "Get more" means we add, not subtract. Try ${a} + ${b}.`,
                            'place-value': `Watch your place values! Line up ones, tens, and hundreds carefully.`,
                            'carry-error': `So close! Did you remember to carry the 1 to the next column?`,
                            'off-by-one': `So close! Re-add the ones column carefully.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(10, 30), weB = R(10, 30);
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA} + ${weB} = ?</p><p>Ones: ${weA % 10} + ${weB % 10} = ${(weA % 10) + (weB % 10)}${(weA % 10) + (weB % 10) >= 10 ? ' (carry the 1!)' : ''}</p><p>Tens: ${Math.floor(weA/10)} + ${Math.floor(weB/10)}${(weA % 10) + (weB % 10) >= 10 ? ' + 1' : ''} = ${Math.floor((weA + weB)/10)}</p><p>Answer: <strong>${weA + weB}</strong></p></div>`;
                    } else if (modality === 'visual') {
                        // Column sums include the carried 1, and the total is left for her to build.
                        result.visual += `<div class="visual-scaffold"><p>Break it down by place value:</p>`
                            + `<div>Ones: ${a % 10} + ${b % 10} = ${onesSum}${onesCarry ? ' (carry the 1!)' : ''}</div>`
                            + `<div>Tens: ${Math.floor(a / 10) % 10} + ${Math.floor(b / 10) % 10}${onesCarry ? ' + 1 carried' : ''} = ${tensSum}${tensCarry ? ' (carry the 1!)' : ''}</div>`
                            + (answer >= 100 ? `<div>Hundreds: ${Math.floor(a / 100)} + ${Math.floor(b / 100)}${tensCarry ? ' + 1 carried' : ''} = ${Math.floor(a / 100) + Math.floor(b / 100) + tensCarry}</div>` : '')
                            + `<div><strong>${a} + ${b} = ?</strong></div></div>`;
                    }

                    return result;
                }
            },
            // 2. Rounding Paint Buckets
            {
                skillId: 'add-sub-rounding',
                generate(diff) {
                    const roundTo = diff >= 2 ? 100 : 10;
                    const num = R(11, diff >= 2 ? 950 : 95);
                    const answer = Math.round(num / roundTo) * roundTo;
                    const options = Engine.Utils.roundedMultipleChoice(answer, roundTo);
                    return {
                        type: 'multiple-choice',
                        questionText: `Round ${num} to the nearest ${roundTo}`,
                        subText: '🎨 Pick the right paint bucket!',
                        visual: `<div style="position:relative;width:100%;padding:20px 0;">
                            <div style="font-size:1.5rem;text-align:center;margin-bottom:12px;">
                                <span style="font-weight:800;color:var(--craft-coral)">${num}</span> rounds to...
                            </div>
                        </div>`,
                        answer,
                        options,
                        hint1: `Look at the ${roundTo === 10 ? 'ones' : 'tens'} digit. Is it 5 or more? Round up! Less than 5? Round down!`,
                        hint2: `${num}: the ${roundTo === 10 ? 'ones' : 'tens'} digit is ${roundTo === 10 ? num % 10 : Math.floor((num % 100) / 10)}`,
                        hint3: `${num} rounds to ${answer}`
                    };
                }
            },
            // 3. Craft Store Word Problems
            {
                skillId: 'add-sub-word',
                generate(diff, modality) {
                    const isAdd = Math.random() < 0.5;
                    const items = pick(['sequins', 'buttons', 'stickers', 'beads', 'pom-poms', 'pipe cleaners']);
                    const a = diff >= 2 ? R(200, 900) : R(20, 99);
                    const b = diff >= 2 ? R(100, a - 1) : R(10, a - 1);
                    const answer = isAdd ? a + b : a - b;
                    const result = {
                        type: 'input',
                        questionText: isAdd
                            ? `You have ${a} ${items} and buy ${b} more. How many do you have now?`
                            : `You have ${a} ${items} and use ${b} for your project. How many are left?`,
                        visual: `<div style="font-size:2.5rem">${isAdd ? '🛒 ➕ 🎨' : '🎨 ➖ ✂️'}</div>`,
                        answer,
                        hint1: isAdd ? `This is an addition problem! Add the two amounts.` : `This is a subtraction problem! Take away from the total.`,
                        hint2: `${a} ${isAdd ? '+' : '−'} ${b} = ?`,
                        hint3: `${a} ${isAdd ? '+' : '−'} ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            const wrongOp = isAdd ? a - b : a + b;
                            if (userAnswer === wrongOp) return 'wrong-operation';
                            return null;
                        },
                        misconceptionHints: {
                            'wrong-operation': isAdd
                                ? `"Buy more" means we add, not subtract! Try ${a} + ${b}.`
                                : `"Use" means we subtract, not add! Try ${a} − ${b}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weOp = isAdd ? '+' : '−';
                        const weA = R(10, 30), weB = R(5, 15);
                        const weAnswer = isAdd ? weA + weB : weA - weB;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${isAdd ? 'You have' : 'You start with'} ${weA} and ${isAdd ? 'get' : 'use'} ${weB}.</p><p>${weA} ${weOp} ${weB} = <strong>${weAnswer}</strong></p></div>`;
                    }

                    return result;
                }
            },
            // 4. Regrouping Workshop
            {
                skillId: 'add-sub-regroup',
                generate(diff) {
                    const isAdd = Math.random() < 0.5;
                    // The prompt promises regrouping, so only keep pairs that need a
                    // carry (add) or a borrow (subtract) in the ones or tens column.
                    const digit = (n, place) => Math.floor(n / place) % 10;
                    const needsRegroup = (x, y) => isAdd
                        ? digit(x, 1) + digit(y, 1) >= 10 || digit(x, 10) + digit(y, 10) >= 10
                        : digit(Math.max(x, y), 1) < digit(Math.min(x, y), 1) || digit(Math.max(x, y), 10) < digit(Math.min(x, y), 10);
                    let a, b;
                    do {
                        a = R(100, 500);
                        b = R(100, 400);
                    } while (b === a || !needsRegroup(a, b)); // b === a would be a trivial "a − a = 0"
                    const answer = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);
                    const big = Math.max(a, b);
                    const small = Math.min(a, b);
                    return {
                        type: 'input',
                        questionText: isAdd
                            ? `Add with regrouping!<br>${a} + ${b} = ?`
                            : `Subtract with regrouping!<br>${big} − ${small} = ?`,
                        visual: `<div style="font-family: var(--font-display); font-size: 1.8rem; text-align: right; line-height: 1.6;">
                            <div>${isAdd ? a : big}</div>
                            <div style="border-bottom: 2px solid rgba(255,255,255,0.4); padding-bottom: 4px;">${isAdd ? '+' : '−'} ${isAdd ? b : small}</div>
                        </div>`,
                        answer,
                        hint1: `Line up the numbers by place value. Start with the ones column.`,
                        hint2: isAdd
                            ? `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}${(a % 10) + (b % 10) >= 10 ? ' (carry the 1!)' : ''}`
                            : `If the top digit is smaller, borrow from the next column!`,
                        hint3: `${isAdd ? a : big} ${isAdd ? '+' : '−'} ${isAdd ? b : small} = ${answer}`
                    };
                }
            },
            // 5. Estimation Station
            {
                skillId: 'add-sub-estimate',
                generate(diff) {
                    const a = R(50, 400);
                    const b = R(50, 400);
                    const exact = a + b;
                    // Round each to nearest 10 for estimate
                    const estA = Math.round(a / 10) * 10;
                    const estB = Math.round(b / 10) * 10;
                    const answer = estA + estB;
                    return {
                        type: 'multiple-choice',
                        questionText: `Estimate! Round each number to the nearest 10, then add.<br>${a} + ${b} ≈ ?`,
                        subText: '🎨 About how many craft supplies?',
                        answer,
                        options: Engine.Utils.roundedMultipleChoice(answer, 10),
                        hint1: `First, round ${a} to the nearest 10: ${estA}`,
                        hint2: `Then round ${b} to nearest 10: ${estB}. Now add them!`,
                        hint3: `${estA} + ${estB} = ${answer}`
                    };
                }
            },
            // 6. Number Line Jumps
            {
                skillId: 'add-sub-numline',
                generate(diff) {
                    const start = R(10, 50);
                    const jump = R(5, 30);
                    const isAdd = Math.random() < 0.5;
                    const answer = isAdd ? start + jump : start - Math.min(jump, start - 1);
                    const actualJump = isAdd ? jump : Math.min(jump, start - 1);
                    return {
                        type: 'input',
                        questionText: isAdd
                            ? `Start at ${start} on the number line. Jump forward ${actualJump} spaces. Where do you land?`
                            : `Start at ${start} on the number line. Jump backward ${actualJump} spaces. Where do you land?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;">${isAdd ? '👉' : '👈'}</div>
                            <div style="font-size:1.2rem;font-weight:700;color:var(--craft-lavender);">
                                ${start} ${isAdd ? '→' : '←'} ${isAdd ? '+' : '−'}${actualJump} = ?
                            </div>
                        </div>`,
                        answer,
                        hint1: `${isAdd ? 'Count forward' : 'Count backward'} ${actualJump} from ${start}`,
                        hint2: `${start} ${isAdd ? '+' : '−'} ${actualJump} = ?`,
                        hint3: `${start} ${isAdd ? '+' : '−'} ${actualJump} = ${answer}`
                    };
                }
            },
            // 7. 3-Digit Challenge
            {
                skillId: 'add-sub-3digit',
                generate(diff) {
                    const isAdd = Math.random() < 0.5;
                    // For subtraction, ensure the bigger number is on top
                    let a = R(200, 700);
                    let b = R(100, 300);
                    if (!isAdd && b > a) [a, b] = [b, a];
                    const answer = isAdd ? a + b : a - b;
                    return {
                        type: 'input',
                        questionText: `Solve this 3-digit problem!`,
                        subText: `${a} ${isAdd ? '+' : '−'} ${b} = ?`,
                        visual: `<div style="font-family:var(--font-display); font-size:2.5rem; color:var(--craft-pink);">
                            ${a} ${isAdd ? '+' : '−'} ${b}
                        </div>`,
                        answer,
                        hint1: `Work column by column: ones, tens, hundreds`,
                        hint2: isAdd
                            ? `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}${(a % 10) + (b % 10) >= 10 ? ' (carry the 1!)' : ''}`
                            : ((a % 10) >= (b % 10)
                                ? `Ones: ${a % 10} − ${b % 10} = ${(a % 10) - (b % 10)}`
                                : `Ones: ${a % 10} is smaller than ${b % 10} → borrow from the tens column!`),
                        hint3: `${a} ${isAdd ? '+' : '−'} ${b} = ${answer}`
                    };
                }
            },
            // 8. Add or Subtract?
            {
                skillId: 'add-sub-choose',
                generate(diff) {
                    const scenarios = [
                        { text: (a, b) => `You have ${a} glitter pieces. Your friend gives you ${b} more. How many do you have?`, op: '+' },
                        { text: (a, b) => `You started with ${a} stickers. You gave away ${b}. How many are left?`, op: '−' },
                        { text: (a, b) => `There are ${a} markers in the box. ${b} more are added. How many now?`, op: '+' },
                        { text: (a, b) => `You had ${a} ribbons and used ${b} for a project. How many remain?`, op: '−' },
                    ];
                    const s = pick(scenarios);
                    const a = R(50, 200);
                    const b = R(20, a - 10);
                    const answer = s.op === '+' ? a + b : a - b;
                    return {
                        type: 'input',
                        questionText: s.text(a, b),
                        visual: `<div style="font-size:2.5rem">${s.op === '+' ? '✨' : '✂️'}</div>`,
                        answer,
                        hint1: `Read carefully — should you add or subtract?`,
                        hint2: `This is ${s.op === '+' ? 'addition' : 'subtraction'}: ${a} ${s.op} ${b}`,
                        hint3: `${a} ${s.op} ${b} = ${answer}`
                    };
                }
            }
        ];
    }
};
