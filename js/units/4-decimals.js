/* ===== UNIT: DECIMALS (4th Grade) — Dance Theme 🪩 ===== */

const Decimals4 = {
    id: '4-decimals',
    title: 'Decimals',
    icon: '🪩',
    theme: 'dance',
    description: "Decimals take the spotlight! Learn tenths, hundredths, and compare decimals on the dance floor!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        return [
            // 1. Write a fraction as a decimal (e.g. 3/10 = 0.3, 7/100 = 0.07)
            {
                skillId: 'dec4-frac-to-dec',
                generate(diff, modality) {
                    const useTenths = diff <= 1 || Math.random() < 0.5;
                    const denom = useTenths ? 10 : 100;
                    const numer = useTenths ? R(1, 9) : R(1, 99);
                    const answer = numer / denom;
                    const answerStr = answer.toString();

                    const result = {
                        type: 'input',
                        questionText: `🎵 The DJ plays fraction ${numer}/${denom} on the dance floor!<br>Write it as a decimal.`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2.5rem;font-weight:800;color:var(--dance-pink);">
                                <span style="border-bottom:3px solid var(--dance-purple);">${numer}</span>
                                <span style="font-size:1.2rem;color:var(--dance-gold);"> ← numerator</span>
                            </div>
                            <div style="font-size:2.5rem;font-weight:800;color:var(--dance-cyan);">
                                ${denom}
                                <span style="font-size:1.2rem;color:var(--dance-gold);"> ← denominator</span>
                            </div>
                            <div style="margin-top:8px;font-size:1.5rem;">💃 = ?</div>
                        </div>`,
                        answer,
                        hint1: `A fraction with denominator ${denom} becomes a decimal with ${denom === 10 ? 'one' : 'two'} decimal place${denom === 100 ? 's' : ''}!`,
                        hint2: `${numer}/${denom} — move the decimal: ${numer} ÷ ${denom} = ?`,
                        hint3: `${numer}/${denom} = ${answerStr}`,
                        diagnose(userAnswer) {
                            if (userAnswer === numer) return 'wrote-numerator-only';
                            if (denom === 100 && userAnswer === numer / 10) return 'divided-by-10-not-100';
                            return null;
                        },
                        misconceptionHints: {
                            'wrote-numerator-only': `That's just the numerator! To make a decimal, divide ${numer} by ${denom}.`,
                            'divided-by-10-not-100': `Careful — the denominator is 100, not 10! ${numer}/100 means two decimal places.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weN = useTenths ? R(1, 9) : R(1, 99);
                        const weD = useTenths ? 10 : 100;
                        const weA = weN / weD;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Write ${weN}/${weD} as a decimal.</p><p>${weN} ÷ ${weD} = <strong>${weA}</strong></p><p>So ${weN}/${weD} = <strong>${weA}</strong> ✨</p></div>`;
                    } else if (modality === 'visual') {
                        const gridSize = denom === 10 ? 10 : 100;
                        const cellCount = Math.min(gridSize, 100);
                        const cols = denom === 10 ? 10 : 10;
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;">
                            <p>Each square is 1/${denom} of the whole:</p>
                            <div style="display:grid;grid-template-columns:repeat(${cols},16px);gap:1px;justify-content:center;">
                                ${Array.from({length: cellCount}, (_, i) => `<div style="width:16px;height:16px;border-radius:2px;background:${i < numer ? 'var(--dance-pink)' : 'rgba(255,255,255,0.1)'};border:1px solid rgba(255,255,255,0.15);"></div>`).join('')}
                            </div>
                            <p><strong>${numer} shaded out of ${denom} = ${answerStr}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Write a decimal as a fraction (e.g. 0.4 = 4/10)
            {
                skillId: 'dec4-dec-to-frac',
                generate(diff, modality) {
                    const useTenths = diff <= 1 || Math.random() < 0.5;
                    const denom = useTenths ? 10 : 100;
                    const numer = useTenths ? R(1, 9) : R(1, 99);
                    const decimal = numer / denom;
                    const answer = numer;

                    const result = {
                        type: 'input',
                        questionText: `🕺 The dance move is ${decimal}!<br>Write it as a fraction: ?/${denom}`,
                        subText: `What is the numerator?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2.8rem;font-weight:800;color:var(--dance-gold);">${decimal}</div>
                            <div style="font-size:1.5rem;margin-top:8px;">= <span style="color:var(--dance-cyan);font-weight:800;">?</span> / ${denom} 🎶</div>
                        </div>`,
                        answer,
                        hint1: `Count the decimal places — ${useTenths ? 'one place means tenths' : 'two places means hundredths'}!`,
                        hint2: `${decimal} means ${numer} ${useTenths ? 'tenths' : 'hundredths'}`,
                        hint3: `${decimal} = ${numer}/${denom}`,
                        diagnose(userAnswer) {
                            if (userAnswer === decimal) return 'wrote-decimal-not-numerator';
                            if (!useTenths && userAnswer === numer * 10) return 'confused-tenths-hundredths';
                            return null;
                        },
                        misconceptionHints: {
                            'wrote-decimal-not-numerator': `That's the decimal itself! We need just the numerator — how many ${useTenths ? 'tenths' : 'hundredths'} is ${decimal}?`,
                            'confused-tenths-hundredths': `Careful with place value! ${decimal} has two decimal places, so the denominator is 100, not 10.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weN = useTenths ? R(1, 9) : R(1, 99);
                        const weD = useTenths ? 10 : 100;
                        const weDec = weN / weD;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Write ${weDec} as a fraction.</p><p>${weDec} has ${weD === 10 ? 'one' : 'two'} decimal place${weD === 100 ? 's' : ''}, so the denominator is ${weD}.</p><p>${weDec} = <strong>${weN}/${weD}</strong> 🌟</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>💃 Think of place value:</p>
                            <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
                                <div style="padding:8px 14px;background:rgba(255,105,180,0.15);border:2px solid var(--dance-pink);border-radius:8px;">
                                    <div style="font-size:1.5rem;font-weight:800;color:var(--dance-pink);">${decimal}</div>
                                    <div style="font-size:0.7rem;color:var(--dance-pink);">decimal</div>
                                </div>
                                <div style="font-size:1.5rem;color:var(--dance-gold);">→</div>
                                <div style="padding:8px 14px;background:rgba(148,0,211,0.15);border:2px solid var(--dance-purple);border-radius:8px;">
                                    <div style="font-size:1.5rem;font-weight:800;color:var(--dance-gold);">${numer}/${denom}</div>
                                    <div style="font-size:0.7rem;color:var(--dance-gold);">fraction</div>
                                </div>
                            </div>
                            <p><strong>${useTenths ? 'One' : 'Two'} decimal place${useTenths ? '' : 's'} → denominator is ${denom}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Compare two decimals (< > =) — multiple choice
            {
                skillId: 'dec4-compare',
                generate(diff, modality) {
                    let a, b;
                    if (diff <= 1) {
                        a = R(1, 9) / 10;
                        b = R(1, 9) / 10;
                        while (a === b) b = R(1, 9) / 10;
                    } else {
                        a = R(1, 99) / 100;
                        b = R(1, 99) / 100;
                        while (a === b) b = R(1, 99) / 100;
                    }
                    const answer = a > b ? '>' : a < b ? '<' : '=';

                    // A common misconception: treating 0.30 vs 0.3 as different,
                    // or comparing digit counts rather than values.
                    const aStr = a.toString();
                    const bStr = b.toString();

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎤 Dance battle! Compare these decimals:`,
                        visual: `<div style="display:flex;gap:20px;align-items:center;justify-content:center;">
                            <div style="text-align:center;padding:16px 24px;background:rgba(255,105,180,0.15);border:2px solid var(--dance-pink);border-radius:12px;">
                                <div style="font-size:0.8rem;color:var(--dance-pink);font-weight:700;">💃 Dancer A</div>
                                <div style="font-size:2.2rem;font-weight:800;color:var(--dance-pink);">${aStr}</div>
                            </div>
                            <div style="font-size:2rem;font-weight:800;color:var(--dance-gold);">?</div>
                            <div style="text-align:center;padding:16px 24px;background:rgba(0,255,255,0.1);border:2px solid var(--dance-cyan);border-radius:12px;">
                                <div style="font-size:0.8rem;color:var(--dance-cyan);font-weight:700;">🕺 Dancer B</div>
                                <div style="font-size:2.2rem;font-weight:800;color:var(--dance-cyan);">${bStr}</div>
                            </div>
                        </div>`,
                        answer,
                        options: shuffle([
                            {label: `${aStr} > ${bStr}`, value: '>'},
                            {label: `${aStr} < ${bStr}`, value: '<'},
                            {label: `${aStr} = ${bStr}`, value: '='}
                        ]),
                        hint1: `Compare digit by digit from left to right!`,
                        hint2: `${aStr} is ${a > b ? 'greater' : 'less'} than ${bStr}`,
                        hint3: `${aStr} ${answer} ${bStr}`,
                        diagnose(userAnswer) {
                            if (userAnswer === '=' && a !== b) return 'treated-as-equal';
                            if (userAnswer !== answer && userAnswer !== '=') return 'reversed-comparison';
                            return null;
                        },
                        misconceptionHints: {
                            'treated-as-equal': `These decimals are NOT equal! Compare place by place: tenths first, then hundredths. ${aStr} and ${bStr} have different values.`,
                            'reversed-comparison': `Check your comparison direction! Remember: the open end of > or < points to the BIGGER number. ${aStr} ${answer} ${bStr} 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(1, 9) / 10;
                        let weB = R(1, 9) / 10;
                        while (weB === weA) weB = R(1, 9) / 10;
                        const weAns = weA > weB ? '>' : '<';
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Compare ${weA} and ${weB}.</p><p>Both are tenths. ${Math.round(weA * 10)} tenths vs ${Math.round(weB * 10)} tenths.</p><p>${Math.round(weA * 10)} ${weA > weB ? '>' : '<'} ${Math.round(weB * 10)}, so ${weA} <strong>${weAns}</strong> ${weB} ✨</p></div>`;
                    } else if (modality === 'visual') {
                        const aBar = Math.round(a * 100);
                        const bBar = Math.round(b * 100);
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;">
                            <p>🎵 Compare with bars (each cell = 0.01):</p>
                            <div style="margin:4px 0;">
                                <span style="font-size:0.8rem;color:var(--dance-pink);">💃 ${aStr}</span>
                                <div style="height:16px;width:${aBar}%;background:var(--dance-pink);border-radius:4px;max-width:200px;display:inline-block;vertical-align:middle;margin-left:6px;"></div>
                            </div>
                            <div style="margin:4px 0;">
                                <span style="font-size:0.8rem;color:var(--dance-cyan);">🕺 ${bStr}</span>
                                <div style="height:16px;width:${bBar}%;background:var(--dance-cyan);border-radius:4px;max-width:200px;display:inline-block;vertical-align:middle;margin-left:6px;"></div>
                            </div>
                            <p><strong>The longer bar is the bigger number!</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Order decimals from least to greatest
            {
                skillId: 'dec4-order',
                generate(diff, modality) {
                    const count = diff >= 2 ? 4 : 3;
                    let nums;
                    if (diff <= 1) {
                        nums = Array.from({length: count}, () => R(1, 9) / 10);
                    } else {
                        nums = Array.from({length: count}, () => R(1, 99) / 100);
                    }
                    // Ensure unique
                    const unique = [...new Set(nums)];
                    while (unique.length < count) {
                        unique.push((diff <= 1 ? R(1, 9) / 10 : R(1, 99) / 100));
                    }
                    nums = unique.slice(0, count);

                    const sorted = [...nums].sort((a, b) => a - b);
                    const answer = sorted.join(', ');

                    const shuffled = shuffle([...nums]);
                    const wrongOrders = [
                        [...sorted].reverse().join(', '),
                        shuffle([...nums]).join(', '),
                        shuffle([...nums]).join(', ')
                    ];

                    const options = shuffle([
                        {label: answer, value: answer},
                        ...wrongOrders.filter(w => w !== answer).slice(0, 3).map(w => ({label: w, value: w}))
                    ]);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ Line up these dancers from LEAST to GREATEST!`,
                        visual: `<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                            ${shuffled.map(n => `<div style="padding:12px 18px;background:rgba(148,0,211,0.15);border:2px solid var(--dance-purple);border-radius:12px;font-size:1.5rem;font-weight:800;color:var(--dance-gold);">💃 ${n}</div>`).join('')}
                        </div>`,
                        answer,
                        options,
                        hint1: `Compare the decimals from smallest to biggest!`,
                        hint2: `Start by finding the smallest: ${sorted[0]}`,
                        hint3: `Least to greatest: ${answer}`,
                        diagnose(userAnswer) {
                            const reversedAnswer = [...sorted].reverse().join(', ');
                            if (userAnswer === reversedAnswer) return 'reversed-order';
                            if (userAnswer !== answer) return 'place-value-confusion';
                            return null;
                        },
                        misconceptionHints: {
                            'reversed-order': `That's greatest to LEAST — the opposite! Least means smallest first. Start with ${sorted[0]} 🕺`,
                            'place-value-confusion': `Compare tenths digits first, then hundredths. A number with more decimal digits isn't automatically bigger! ${sorted[0]} is the smallest here. 🎵`
                        }
                    };

                    if (modality === 'worked-example') {
                        const exNums = diff <= 1
                            ? [R(1,9)/10, R(1,9)/10, R(1,9)/10]
                            : [R(1,99)/100, R(1,99)/100, R(1,99)/100];
                        const exSorted = [...exNums].sort((a, b) => a - b);
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Order ${exNums.join(', ')} from least to greatest.</p><p>Compare tenths first, then hundredths.</p><p>Least to greatest: <strong>${exSorted.join(', ')}</strong> 🪩</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;">
                            <p>🎵 Ordered on a number line:</p>
                            <div style="position:relative;height:30px;background:rgba(255,255,255,0.08);border-radius:8px;margin:8px 0;">
                                ${sorted.map((n, i) => {
                                    const pct = Math.round(n * 100);
                                    const colors = ['var(--dance-pink)', 'var(--dance-gold)', 'var(--dance-cyan)', 'var(--dance-purple)'];
                                    return `<div style="position:absolute;left:${pct}%;top:2px;transform:translateX(-50%);font-size:0.75rem;font-weight:800;color:${colors[i % colors.length]};">${n}<br>⬆</div>`;
                                }).join('')}
                            </div>
                            <p><strong>Smallest → Largest: ${sorted.join(' → ')}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Place decimals on a number line — multiple choice
            {
                skillId: 'dec4-numberline',
                generate(diff, modality) {
                    const tenths = R(1, 9);
                    const answer = tenths / 10;
                    const low = 0;
                    const high = 1;

                    const tickMarks = Array.from({length: 11}, (_, i) => i / 10);
                    const arrowPos = (tenths / 10) * 100;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎸 What decimal is the arrow pointing to on the number line?`,
                        visual: `<div style="position:relative;width:100%;max-width:350px;margin:20px auto;">
                            <div style="position:relative;height:4px;background:var(--dance-purple);border-radius:2px;margin:30px 10px 20px;">
                                ${tickMarks.map((t, i) => `<div style="position:absolute;left:${i * 10}%;top:-8px;width:2px;height:20px;background:var(--dance-cyan);transform:translateX(-1px);"></div>`).join('')}
                                <div style="position:absolute;left:0;top:18px;font-size:0.7rem;font-weight:700;transform:translateX(-50%);color:var(--dance-gold);">0</div>
                                <div style="position:absolute;left:50%;top:18px;font-size:0.7rem;font-weight:700;transform:translateX(-50%);color:var(--dance-gold);">0.5</div>
                                <div style="position:absolute;left:100%;top:18px;font-size:0.7rem;font-weight:700;transform:translateX(-50%);color:var(--dance-gold);">1</div>
                                <div style="position:absolute;left:${arrowPos}%;top:-28px;transform:translateX(-50%);font-size:1.3rem;">⬇️</div>
                            </div>
                        </div>`,
                        answer,
                        options: (() => {
                            const round1 = (x) => Math.round(x * 10) / 10;
                            const clamp = (x) => Math.min(1, Math.max(0, round1(x)));
                            const candidates = [answer, clamp(answer + 0.1), clamp(answer - 0.1), clamp(answer + 0.2), clamp(answer - 0.2)];
                            const unique = [];
                            for (const v of candidates) {
                                if (!unique.includes(v)) unique.push(v);
                                if (unique.length === 4) break;
                            }
                            return Engine.Utils.shuffle(unique).map(v => ({label: `${v}`, value: v}));
                        })(),
                        hint1: `Count the tick marks from 0. Each space is one tenth!`,
                        hint2: `The arrow is at the ${tenths}th tick mark out of 10`,
                        hint3: `The arrow points to ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === tenths) return 'wrote-tick-not-decimal';
                            const round1 = (x) => Math.round(x * 10) / 10;
                            const plus = Math.min(1, round1(answer + 0.1));
                            const minus = Math.max(0, round1(answer - 0.1));
                            if (userAnswer === plus || userAnswer === minus) return 'off-by-one-tenth';
                            return null;
                        },
                        misconceptionHints: {
                            'wrote-tick-not-decimal': `You wrote the tick number, not the decimal! The ${tenths}th tick represents 0.${tenths}, not just ${tenths}. Each space is 1/10 = 0.1 💃`,
                            'off-by-one-tenth': `So close! You're off by 0.1. Count again carefully from 0 — each tick mark is one tenth (0.1). The arrow is at tick #${tenths}. 🎵`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weT = R(1, 9);
                        const weA = weT / 10;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> An arrow points to tick #${weT} on a 0–1 number line with 10 spaces.</p><p>Each space = 0.1, so tick #${weT} = ${weT} × 0.1</p><p>= <strong>${weA}</strong> ✨</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:8px;text-align:center;">
                            <p>Each space = 0.1. Count from 0:</p>
                            <p>${Array.from({length: tenths}, (_, i) => `0.${i + 1}`).join(' → ')}</p>
                            <p><strong>Arrow is at ${answer}</strong> 🎵</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Add tenths (e.g. 0.3 + 0.4 = 0.7) — input
            {
                skillId: 'dec4-add-tenths',
                generate(diff, modality) {
                    let a, b;
                    if (diff <= 1) {
                        a = R(1, 4) / 10;
                        b = R(1, 4) / 10;
                    } else if (diff === 2) {
                        a = R(1, 7) / 10;
                        b = R(1, 7) / 10;
                    } else {
                        a = R(1, 9) / 10;
                        b = R(1, 9) / 10;
                    }
                    const answer = Math.round((a + b) * 10) / 10;

                    const result = {
                        type: 'input',
                        questionText: `🎶 Two dancers combine their moves!<br>${a} + ${b} = ?`,
                        visual: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;">
                            <div style="padding:12px 20px;background:rgba(255,105,180,0.15);border:2px solid var(--dance-pink);border-radius:12px;">
                                <div style="font-size:0.7rem;color:var(--dance-pink);">💃</div>
                                <div style="font-size:2rem;font-weight:800;color:var(--dance-pink);">${a}</div>
                            </div>
                            <div style="font-size:2rem;font-weight:800;color:var(--dance-gold);">+</div>
                            <div style="padding:12px 20px;background:rgba(0,255,255,0.1);border:2px solid var(--dance-cyan);border-radius:12px;">
                                <div style="font-size:0.7rem;color:var(--dance-cyan);">🕺</div>
                                <div style="font-size:2rem;font-weight:800;color:var(--dance-cyan);">${b}</div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Add the tenths digits: ${Math.round(a * 10)} tenths + ${Math.round(b * 10)} tenths = ? tenths`,
                        hint2: `${Math.round(a * 10)} + ${Math.round(b * 10)} = ${Math.round(a * 10) + Math.round(b * 10)} tenths`,
                        hint3: `${a} + ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === Math.round(a * 10) + Math.round(b * 10)) return 'forgot-decimal-point';
                            if (userAnswer === parseFloat((a + b).toFixed(2)) && userAnswer !== answer) return 'rounding-error';
                            return null;
                        },
                        misconceptionHints: {
                            'forgot-decimal-point': `You added the tenths digits but forgot the decimal point! ${Math.round(a * 10)} tenths + ${Math.round(b * 10)} tenths = ${answer}, not ${Math.round(a * 10) + Math.round(b * 10)}.`,
                            'rounding-error': `Almost! Remember to line up the decimal points and add tenths to tenths. ${a} + ${b} = ${answer} 🎵`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(1, 4) / 10, weB = R(1, 4) / 10;
                        const weAns = Math.round((weA + weB) * 10) / 10;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA} + ${weB} = ?</p><p>${Math.round(weA * 10)} tenths + ${Math.round(weB * 10)} tenths = ${Math.round(weA * 10) + Math.round(weB * 10)} tenths</p><p>= <strong>${weAns}</strong> 🪩</p></div>`;
                    } else if (modality === 'visual') {
                        const aCells = Math.round(a * 10);
                        const bCells = Math.round(b * 10);
                        const totalCells = Math.max(10, aCells + bCells);
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🎵 Each block = 0.1. Count the shaded blocks:</p>
                            <div style="display:flex;gap:2px;justify-content:center;margin:8px 0;">
                                ${Array.from({length: totalCells}, (_, i) => {
                                    let bg = 'rgba(255,255,255,0.1)';
                                    if (i < aCells) bg = 'var(--dance-pink)';
                                    else if (i < aCells + bCells) bg = 'var(--dance-cyan)';
                                    return `<div style="width:24px;height:24px;border-radius:4px;background:${bg};border:1px solid rgba(255,255,255,0.2);"></div>`;
                                }).join('')}
                            </div>
                            <p><span style="color:var(--dance-pink);">💃 ${aCells} blocks</span> + <span style="color:var(--dance-cyan);">🕺 ${bCells} blocks</span> = <strong>${aCells + bCells} blocks = ${answer}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Decimal dance-off — mixed
            {
                skillId: 'dec4-danceoff',
                generate(diff, modality) {
                    const type = pick(['frac-to-dec', 'compare', 'add']);

                    if (type === 'frac-to-dec') {
                        const denom = pick([10, 100]);
                        const numer = denom === 10 ? R(1, 9) : R(1, 99);
                        const answer = numer / denom;
                        const wrongA = denom === 10 ? numer / 100 : numer / 10;
                        // Clamp so wrongB stays within (0, 1) and doesn't equal answer or 1
                        const wrongB = numer < denom - 1 ? (numer + 1) / denom : (numer - 1) / denom;

                        const result = {
                            type: 'multiple-choice',
                            questionText: `🪩 Dance-off! What decimal equals ${numer}/${denom}?`,
                            visual: `<div style="font-size:3rem;text-align:center;">🎵💃🕺🎵</div>`,
                            answer,
                            options: Engine.Utils.shuffle([
                                {label: `${answer}`, value: answer},
                                {label: `${numer}`, value: numer},
                                {label: `${wrongA}`, value: wrongA},
                                {label: `${wrongB}`, value: wrongB}
                            ]),
                            hint1: `Divide ${numer} by ${denom}!`,
                            hint2: `${numer} ÷ ${denom} = ?`,
                            hint3: `${numer}/${denom} = ${answer}`,
                            diagnose(userAnswer) {
                                if (userAnswer === numer) return 'wrote-numerator-only';
                                if (userAnswer === wrongA) return 'wrong-denominator';
                                return null;
                            },
                            misconceptionHints: {
                                'wrote-numerator-only': `That's just the top number! A fraction becomes a decimal by dividing: ${numer} ÷ ${denom} = ${answer} 💃`,
                                'wrong-denominator': `Check the denominator carefully — it's ${denom}, not ${denom === 10 ? 100 : 10}! That changes how many decimal places you need. 🎵`
                            }
                        };

                        if (modality === 'worked-example') {
                            const weD = pick([10, 100]);
                            const weN = weD === 10 ? R(1, 9) : R(1, 99);
                            const weA = weN / weD;
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Write ${weN}/${weD} as a decimal.</p><p>${weN} ÷ ${weD} = <strong>${weA}</strong></p><p>Denominator ${weD} → ${weD === 10 ? 'one' : 'two'} decimal place${weD === 100 ? 's' : ''} ✨</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                                <p>🕺 Place value chart:</p>
                                <div style="display:flex;gap:4px;justify-content:center;">
                                    <div style="padding:8px;background:rgba(255,105,180,0.15);border:2px solid var(--dance-pink);border-radius:8px;min-width:50px;">
                                        <div style="font-size:1.2rem;font-weight:800;color:var(--dance-pink);">${denom === 10 ? numer : Math.floor(numer / 10)}</div>
                                        <div style="font-size:0.65rem;color:var(--dance-pink);">tenths</div>
                                    </div>
                                    ${denom === 100 ? `<div style="padding:8px;background:rgba(0,255,255,0.1);border:2px solid var(--dance-cyan);border-radius:8px;min-width:50px;"><div style="font-size:1.2rem;font-weight:800;color:var(--dance-cyan);">${numer % 10}</div><div style="font-size:0.65rem;color:var(--dance-cyan);">hundredths</div></div>` : ''}
                                </div>
                                <p><strong>${numer}/${denom} = ${answer}</strong> 🪩</p>
                            </div>`;
                        }

                        return result;

                    } else if (type === 'compare') {
                        const a = R(1, 9) / 10;
                        let b = R(1, 9) / 10;
                        while (a === b) b = R(1, 9) / 10;
                        const answer = a > b ? '>' : '<';

                        const result = {
                            type: 'multiple-choice',
                            questionText: `🪩 Dance-off! Which is correct?`,
                            visual: `<div style="font-size:2rem;font-weight:800;text-align:center;color:var(--dance-gold);">${a} ◯ ${b}</div>`,
                            answer,
                            options: shuffle([
                                {label: `${a} > ${b}`, value: '>'},
                                {label: `${a} < ${b}`, value: '<'}
                            ]),
                            hint1: `Which decimal is bigger?`,
                            hint2: `${a} is ${a > b ? 'greater' : 'less'} than ${b}`,
                            hint3: `${a} ${answer} ${b}`,
                            diagnose(userAnswer) {
                                if (userAnswer !== answer) return 'reversed-comparison';
                                return null;
                            },
                            misconceptionHints: {
                                'reversed-comparison': `Flip it! The open mouth of > or < always faces the bigger number. ${Math.max(a, b)} is bigger, so it gets the open side. 💃`
                            }
                        };

                        if (modality === 'worked-example') {
                            const weA = R(1, 9) / 10;
                            let weB = R(1, 9) / 10;
                            while (weB === weA) weB = R(1, 9) / 10;
                            const weAns = weA > weB ? '>' : '<';
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Compare ${weA} and ${weB}.</p><p>Tenths: ${Math.round(weA * 10)} vs ${Math.round(weB * 10)}</p><p>${Math.round(weA * 10)} ${weA > weB ? '>' : '<'} ${Math.round(weB * 10)}, so ${weA} <strong>${weAns}</strong> ${weB} 🕺</p></div>`;
                        } else if (modality === 'visual') {
                            const aBar = Math.round(a * 100);
                            const bBar = Math.round(b * 100);
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                                <p>🎵 Length shows size:</p>
                                <div style="margin:4px 0;display:flex;align-items:center;gap:8px;">
                                    <span style="font-size:0.8rem;color:var(--dance-pink);min-width:30px;">${a}</span>
                                    <div style="height:14px;width:${aBar * 2}px;background:var(--dance-pink);border-radius:4px;"></div>
                                </div>
                                <div style="margin:4px 0;display:flex;align-items:center;gap:8px;">
                                    <span style="font-size:0.8rem;color:var(--dance-cyan);min-width:30px;">${b}</span>
                                    <div style="height:14px;width:${bBar * 2}px;background:var(--dance-cyan);border-radius:4px;"></div>
                                </div>
                                <p><strong>${a} ${answer} ${b}</strong></p>
                            </div>`;
                        }

                        return result;

                    } else {
                        const a = R(1, 5) / 10;
                        const b = R(1, 4) / 10;
                        const answer = Math.round((a + b) * 10) / 10;
                        const wrongNoDecimal = Math.round(a * 10) + Math.round(b * 10);

                        const result = {
                            type: 'input',
                            questionText: `🪩 Dance-off! Add the decimals:<br>${a} + ${b} = ?`,
                            visual: `<div style="font-size:3rem;text-align:center;">✨🪩✨</div>`,
                            answer,
                            hint1: `Add the tenths: ${Math.round(a * 10)} + ${Math.round(b * 10)} = ? tenths`,
                            hint2: `${Math.round(a * 10)} + ${Math.round(b * 10)} = ${Math.round(a * 10) + Math.round(b * 10)} tenths = ?`,
                            hint3: `${a} + ${b} = ${answer}`,
                            diagnose(userAnswer) {
                                if (userAnswer === wrongNoDecimal) return 'forgot-decimal-point';
                                return null;
                            },
                            misconceptionHints: {
                                'forgot-decimal-point': `Don't forget the decimal point! ${Math.round(a * 10)} tenths + ${Math.round(b * 10)} tenths = ${wrongNoDecimal} tenths = ${answer}, not ${wrongNoDecimal}. 🎵`
                            }
                        };

                        if (modality === 'worked-example') {
                            const weA = R(1, 5) / 10;
                            const weB = R(1, 4) / 10;
                            const weAns = Math.round((weA + weB) * 10) / 10;
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA} + ${weB} = ?</p><p>Line up decimals: ${Math.round(weA * 10)} tenths + ${Math.round(weB * 10)} tenths = ${Math.round(weA * 10) + Math.round(weB * 10)} tenths</p><p>= <strong>${weAns}</strong> 🪩</p></div>`;
                        } else if (modality === 'visual') {
                            const aCells = Math.round(a * 10);
                            const bCells = Math.round(b * 10);
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                                <p>✨ Each block = 0.1:</p>
                                <div style="display:flex;gap:2px;justify-content:center;margin:8px 0;">
                                    ${Array.from({length: 10}, (_, i) => {
                                        let bg = 'rgba(255,255,255,0.1)';
                                        if (i < aCells) bg = 'var(--dance-pink)';
                                        else if (i < aCells + bCells) bg = 'var(--dance-cyan)';
                                        return `<div style="width:22px;height:22px;border-radius:4px;background:${bg};border:1px solid rgba(255,255,255,0.2);"></div>`;
                                    }).join('')}
                                </div>
                                <p><span style="color:var(--dance-pink);">${aCells} blocks</span> + <span style="color:var(--dance-cyan);">${bCells} blocks</span> = <strong>${aCells + bCells} tenths = ${answer}</strong></p>
                            </div>`;
                        }

                        return result;
                    }
                }
            }
        ];
    }
};
