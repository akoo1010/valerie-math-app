/* ===== UNIT: 4TH GRADE PLACE VALUE — Monster Theme 🔢 ===== */

const PlaceValue4 = {
    id: '4-place-value',
    title: 'Place Value',
    icon: '🔢',
    theme: 'monster',
    description: "Discover place value with your monster crew! Read, write, and compare multi-digit numbers!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Read/write numbers in expanded form
            {
                skillId: '4pv-expanded',
                generate(diff, modality) {
                    const thousands = R(1, diff >= 3 ? 9 : diff >= 2 ? 5 : 3);
                    const hundreds = R(0, 9);
                    const tens = R(0, 9);
                    const ones = R(1, 9);
                    const num = thousands * 1000 + hundreds * 100 + tens * 10 + ones;

                    const parts = [];
                    if (thousands) parts.push(`${thousands},000`);
                    if (hundreds) parts.push(`${hundreds}00`);
                    if (tens) parts.push(`${tens}0`);
                    if (ones) parts.push(`${ones}`);
                    const expanded = parts.join(' + ');

                    const result = {
                        type: 'input',
                        questionText: `Write this number in standard form:<br><strong>${expanded}</strong>`,
                        visual: `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                            ${parts.map(p => `<div style="background:var(--monster-red);color:#fff;padding:8px 14px;border-radius:10px;font-weight:700;font-size:1.2rem;">🐲 ${p}</div>`).join('<span style="font-size:1.5rem;align-self:center;">+</span>')}
                        </div>`,
                        answer: num,
                        hint1: `Add up all the place values together`,
                        hint2: `${parts.join(' + ')} = ?`,
                        hint3: `The answer is ${num.toLocaleString()}`,
                        diagnose(userAnswer) {
                            if (userAnswer === thousands + hundreds + tens + ones) return 'added-digits';
                            return null;
                        },
                        misconceptionHints: {
                            'added-digits': `Don't add the digits! Each digit has a place value. ${thousands} in the thousands place means ${thousands},000, not just ${thousands}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 2,000 + 300 + 40 + 5 = ?</p><p>2 thousands + 3 hundreds + 4 tens + 5 ones</p><p>= <strong>2,345</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🐲 Think of each monster carrying its place value:</p>
                            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                                <div>🐲 Thousands: ${thousands}</div>
                                <div>🦖 Hundreds: ${hundreds}</div>
                                <div>⚡ Tens: ${tens}</div>
                                <div>🔥 Ones: ${ones}</div>
                            </div>
                            <p>Stack them: <strong>${num.toLocaleString()}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. What digit is in the ___ place?
            {
                skillId: '4pv-digit-place',
                generate(diff, modality) {
                    const num = diff >= 3
                        ? R(10000, 99999)
                        : diff >= 2 ? R(1000, 9999) : R(100, 999);
                    const numStr = String(num);
                    const places = diff >= 3
                        ? ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands']
                        : diff >= 2 ? ['ones', 'tens', 'hundreds', 'thousands']
                        : ['ones', 'tens', 'hundreds'];
                    const place = pick(places);
                    const placeIndex = { 'ones': numStr.length - 1, 'tens': numStr.length - 2, 'hundreds': numStr.length - 3, 'thousands': numStr.length - 4, 'ten-thousands': numStr.length - 5 };
                    const answer = parseInt(numStr[placeIndex[place]]);
                    const monsterEmojis = ['🐲', '🦖', '⚡', '🔥', '🐾'];

                    const result = {
                        type: 'multiple-choice',
                        questionText: `In the number <strong>${num.toLocaleString()}</strong>, what digit is in the <strong>${place}</strong> place?`,
                        visual: `<div style="display:flex;gap:4px;justify-content:center;">
                            ${numStr.split('').map((d, i) => `<div style="width:44px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${i === placeIndex[place] ? 'var(--monster-purple)' : 'rgba(255,255,255,0.1)'};border-radius:8px;font-weight:700;font-size:1.4rem;color:#fff;">${monsterEmojis[i % monsterEmojis.length]}<span>${d}</span></div>`).join('')}
                        </div>`,
                        answer,
                        options: Engine.Utils.shuffle([answer, ...[0,1,2,3,4,5,6,7,8,9].filter(d => d !== answer && Math.abs(d - answer) <= 4)].slice(0, 4)),
                        hint1: `The ${place} place is ${place === 'ones' ? 'the last digit' : place === 'tens' ? 'the second-to-last digit' : place === 'hundreds' ? 'the third digit from the right' : 'the fourth digit from the right'}`,
                        hint2: `Look at ${num.toLocaleString()} — count from the right`,
                        hint3: `The digit in the ${place} place is ${answer}`,
                        diagnose(userAnswer) {
                            const digits = numStr.split('').map(Number);
                            if (digits.includes(userAnswer) && userAnswer !== answer) return 'wrong-place';
                            return null;
                        },
                        misconceptionHints: {
                            'wrong-place': `That digit is in a different place! Remember: count from the right. Ones, tens, hundreds, thousands...`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> In 5,372 what is in the hundreds place?</p><p>5 , 3 , 7 , 2</p><p>Th H T O</p><p>The hundreds digit is <strong>3</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🐲 Count from the RIGHT to find each place:</p>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                ${['ones','tens','hundreds','thousands','ten-thousands'].slice(0, numStr.length).reverse().map((pl, i) => {
                                    const digit = numStr[i];
                                    const highlighted = pl === place;
                                    return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                                        <div style="background:${highlighted ? 'var(--monster-purple)' : 'rgba(255,255,255,0.1)'};color:#fff;padding:6px 12px;border-radius:8px;font-weight:700;font-size:1.3rem;">${digit}</div>
                                        <div style="font-size:0.7rem;color:${highlighted ? 'var(--monster-yellow)' : 'var(--text-muted)'};">${highlighted ? '⚡' : ''} ${pl}</div>
                                    </div>`;
                                }).join('')}
                            </div>
                            <p style="margin-top:8px;">The <strong>${place}</strong> digit is <span style="color:var(--monster-yellow);font-weight:700;">${answer}</span> 🔥</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Compare two numbers using < > =
            {
                skillId: '4pv-compare',
                generate(diff, modality) {
                    const mag = diff >= 3 ? 100000 : diff >= 2 ? 10000 : 1000;
                    let a = R(Math.floor(mag / 10), mag);
                    let b = R(Math.floor(mag / 10), mag);
                    // Occasionally make them equal
                    if (Math.random() < 0.15) b = a;
                    const correct = a > b ? '>' : a < b ? '<' : '=';
                    const reversed = a > b ? '<' : a < b ? '>' : '=';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `Compare the numbers! Which symbol goes in the box?<br><strong>${a.toLocaleString()}</strong> ☐ <strong>${b.toLocaleString()}</strong>`,
                        visual: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;">
                            <span style="color:var(--monster-red);">🐲 ${a.toLocaleString()}</span>
                            <span style="font-size:2.5rem;color:var(--monster-yellow);">?</span>
                            <span style="color:var(--monster-blue);">🦖 ${b.toLocaleString()}</span>
                        </div>`,
                        answer: correct,
                        options: [{label: '<', value: '<'}, {label: '>', value: '>'}, {label: '=', value: '='}],
                        hint1: `Compare starting from the largest place value`,
                        hint2: `${a.toLocaleString()} is ${a > b ? 'greater than' : a < b ? 'less than' : 'equal to'} ${b.toLocaleString()}`,
                        hint3: `${a.toLocaleString()} ${correct} ${b.toLocaleString()}`,
                        diagnose(userAnswer) {
                            if (userAnswer === reversed && correct !== '=') return 'reversed-comparison';
                            return null;
                        },
                        misconceptionHints: {
                            'reversed-comparison': `You picked the opposite direction! Remember: the open end of < or > always faces the BIGGER number. Think of it as a hungry monster mouth — it eats the larger number! 🐲`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Compare 4,502 and 3,891</p><p>Compare thousands first: 4 vs 3</p><p>4 > 3, so 4,502 <strong>&gt;</strong> 3,891</p><p>The alligator mouth eats the bigger number!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🐲 Step 1: Line up the digits by place value</p>
                            <p>🦖 Step 2: Compare from the LEFT (biggest place first)</p>
                            <p>⚡ Step 3: The first digit that's different tells you the answer!</p>
                            <p style="font-size:1.3rem;margin-top:8px;">🐲 ${a.toLocaleString()} ${correct === '>' ? '🔥 WINS!' : correct === '<' ? '💤 loses...' : '🤝 TIE!'}</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Round to nearest 10, 100, or 1000
            {
                skillId: '4pv-round',
                generate(diff, modality) {
                    const roundTo = diff >= 3 ? pick([10, 100, 1000]) : diff >= 2 ? pick([10, 100]) : 10;
                    const num = diff >= 3 ? R(101, 9999) : diff >= 2 ? R(101, 999) : R(11, 99);
                    const answer = Math.round(num / roundTo) * roundTo;
                    const roundLabel = roundTo === 10 ? 'nearest 10' : roundTo === 100 ? 'nearest 100' : 'nearest 1,000';

                    const result = {
                        type: 'input',
                        questionText: `Round <strong>${num.toLocaleString()}</strong> to the <strong>${roundLabel}</strong>.`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;font-weight:700;color:var(--monster-purple);">🐾 ${num.toLocaleString()} 🐾</div>
                            <div style="margin-top:8px;font-size:1rem;color:var(--text-muted);">Round to the ${roundLabel}</div>
                        </div>`,
                        answer,
                        hint1: `Look at the digit to the right of the ${roundTo === 10 ? 'tens' : roundTo === 100 ? 'hundreds' : 'thousands'} place`,
                        hint2: `If that digit is 5 or more, round up. If less than 5, round down.`,
                        hint3: `${num.toLocaleString()} rounded to the ${roundLabel} is ${answer.toLocaleString()}`,
                        diagnose(userAnswer) {
                            // Common: round the wrong direction
                            const altAnswer = answer === Math.ceil(num / roundTo) * roundTo
                                ? Math.floor(num / roundTo) * roundTo
                                : Math.ceil(num / roundTo) * roundTo;
                            if (userAnswer === altAnswer) return 'rounded-wrong-direction';
                            return null;
                        },
                        misconceptionHints: {
                            'rounded-wrong-direction': `Check the rounding rule! 5 or more rounds UP, 4 or less rounds DOWN.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Round 467 to the nearest 100</p><p>Look at the tens digit: <strong>6</strong></p><p>6 >= 5, so round UP</p><p>467 rounds to <strong>500</strong></p></div>`;
                    } else if (modality === 'visual') {
                        const lower = Math.floor(num / roundTo) * roundTo;
                        const upper = lower + roundTo;
                        const midpoint = lower + roundTo / 2;
                        const goesUp = num >= midpoint;
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🐾 Is <strong>${num.toLocaleString()}</strong> closer to ${lower.toLocaleString()} or ${upper.toLocaleString()}?</p>
                            <div style="display:flex;align-items:center;gap:6px;justify-content:center;flex-wrap:wrap;">
                                <span style="font-weight:700;color:var(--monster-blue);">${lower.toLocaleString()} 🦖</span>
                                <span style="color:var(--text-muted);">── midpoint: ${midpoint.toLocaleString()} ──</span>
                                <span style="font-weight:700;color:var(--monster-red);">🔥 ${upper.toLocaleString()}</span>
                            </div>
                            <p style="margin-top:6px;">${num.toLocaleString()} is ${goesUp ? 'at or past' : 'before'} the midpoint → round <strong>${goesUp ? 'UP' : 'DOWN'}</strong> to <span style="color:var(--monster-yellow);font-weight:700;">${answer.toLocaleString()}</span> ⚡</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Order numbers least to greatest
            {
                skillId: '4pv-order',
                generate(diff, modality) {
                    const count = diff >= 3 ? 5 : 4;
                    const mag = diff >= 3 ? 10000 : diff >= 2 ? 1000 : 100;
                    const nums = [];
                    while (nums.length < count) {
                        const n = R(Math.floor(mag / 10), mag);
                        if (!nums.includes(n)) nums.push(n);
                    }
                    const sorted = [...nums].sort((a, b) => a - b);
                    const correct = sorted.map(n => n.toLocaleString()).join(', ');

                    // Generate wrong orderings
                    const descending = [...sorted].reverse().map(n => n.toLocaleString()).join(', ');
                    const almostRight = [...sorted];
                    const swapIdx = R(0, almostRight.length - 2);
                    [almostRight[swapIdx], almostRight[swapIdx + 1]] = [almostRight[swapIdx + 1], almostRight[swapIdx]];
                    const almostStr = almostRight.map(n => n.toLocaleString()).join(', ');
                    // Fourth distractor: swap the smallest and largest to guarantee a unique fourth ordering
                    const endSwap = [...sorted];
                    [endSwap[0], endSwap[endSwap.length - 1]] = [endSwap[endSwap.length - 1], endSwap[0]];
                    const endSwapStr = endSwap.map(n => n.toLocaleString()).join(', ');

                    const options = Engine.Utils.shuffle([
                        { label: correct, value: correct },
                        { label: descending, value: descending },
                        { label: almostStr, value: almostStr },
                        { label: endSwapStr, value: endSwapStr }
                    ]);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `Order these numbers from <strong>least to greatest</strong>:`,
                        visual: `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                            ${Engine.Utils.shuffle(nums).map(n => `<div style="background:var(--monster-blue);color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;font-size:1.1rem;">🗡️ ${n.toLocaleString()}</div>`).join('')}
                        </div>`,
                        answer: correct,
                        options,
                        hint1: `Find the smallest number first, then the next smallest...`,
                        hint2: `Compare the thousands digits first, then hundreds, then tens...`,
                        hint3: `The correct order is: ${correct}`,
                        diagnose(userAnswer) {
                            if (userAnswer === descending) return 'ordered-greatest-to-least';
                            if (userAnswer === almostStr) return 'adjacent-swap';
                            return null;
                        },
                        misconceptionHints: {
                            'ordered-greatest-to-least': `You put them in GREATEST to least — but the question asks for LEAST to greatest! Start with the smallest number first. 🗡️`,
                            'adjacent-swap': `Almost! Two numbers next to each other are swapped. Double-check each pair of neighbors.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Order: 482, 219, 905, 347</p><p>Step 1: Find the smallest → 219</p><p>Step 2: Next smallest → 347</p><p>Step 3: Next → 482</p><p>Step 4: Largest → 905</p><p>Answer: <strong>219, 347, 482, 905</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🗡️ Monster lineup — smallest to biggest!</p>
                            <div style="display:flex;gap:6px;justify-content:center;align-items:flex-end;flex-wrap:wrap;">
                                ${sorted.map((n, i) => `<div style="display:flex;flex-direction:column;align-items:center;">
                                    <span style="font-size:${0.8 + i * 0.3}rem;">🐲</span>
                                    <span style="font-weight:700;color:var(--monster-blue);">${n.toLocaleString()}</span>
                                </div>`).join('→ ')}
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Write the number from word form
            {
                skillId: '4pv-word-form',
                generate(diff, modality) {
                    const thousands = R(1, diff >= 3 ? 9 : diff >= 2 ? 5 : 3);
                    const hundreds = R(0, 9);
                    const tens = R(0, 9);
                    const ones = R(0, 9);
                    const num = thousands * 1000 + hundreds * 100 + tens * 10 + ones;

                    const onesWords = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
                    const teensWords = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
                    const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

                    let wordForm = '';
                    wordForm += onesWords[thousands] + ' thousand';
                    if (hundreds > 0) wordForm += ' ' + onesWords[hundreds] + ' hundred';
                    if (tens === 1) {
                        wordForm += ' ' + teensWords[ones];
                    } else {
                        if (tens > 1) wordForm += ' ' + tensWords[tens];
                        if (ones > 0 && tens !== 1) {
                            if (tens > 1) wordForm += '-' + onesWords[ones];
                            else wordForm += ' ' + onesWords[ones];
                        }
                    }

                    const digitSum = thousands + hundreds + tens + ones;

                    const result = {
                        type: 'input',
                        questionText: `Write this number using digits:<br><em>"${wordForm.trim()}"</em>`,
                        visual: `<div style="font-size:1.5rem;text-align:center;color:var(--monster-yellow);font-weight:700;">🐲 "${wordForm.trim()}" 🐲</div>`,
                        answer: num,
                        hint1: `Break it into parts: thousands, hundreds, tens, ones`,
                        hint2: `${thousands} thousand = ${thousands * 1000}${hundreds > 0 ? ', ' + hundreds + ' hundred = ' + hundreds * 100 : ''}`,
                        hint3: `The number is ${num.toLocaleString()}`,
                        diagnose(userAnswer) {
                            if (userAnswer === digitSum) return 'added-digits-not-place-values';
                            if (userAnswer === thousands * 1000 + hundreds * 100) return 'forgot-tens-and-ones';
                            if (userAnswer === num * 10 || userAnswer === num / 10) return 'off-by-place';
                            return null;
                        },
                        misconceptionHints: {
                            'added-digits-not-place-values': `It looks like you added the individual digits together instead of using their place values! "${onesWords[thousands]} thousand" means ${thousands},000, not just ${thousands}. 🐲`,
                            'forgot-tens-and-ones': `You got the thousands and hundreds right, but forgot the tens and ones! Make sure to include every part of the word form.`,
                            'off-by-place': `You're off by a factor of 10 — double-check how many digits your number should have!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> "two thousand five hundred thirty-one"</p><p>2 thousand = 2,000</p><p>5 hundred = 500</p><p>thirty-one = 31</p><p>Total: <strong>2,531</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <p>🐲 Break the words into monster place-value cards:</p>
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:var(--monster-red);color:#fff;padding:8px 12px;border-radius:10px;">🐲 ${onesWords[thousands]} thousand = ${(thousands * 1000).toLocaleString()}</div>
                                ${hundreds > 0 ? `<div style="background:var(--monster-purple);color:#fff;padding:8px 12px;border-radius:10px;">🦖 ${onesWords[hundreds]} hundred = ${hundreds * 100}</div>` : ''}
                                ${tens === 1 ? `<div style="background:var(--monster-blue);color:#fff;padding:8px 12px;border-radius:10px;">⚡ ${teensWords[ones]} = ${10 + ones}</div>` : ''}
                                ${tens > 1 ? `<div style="background:var(--monster-blue);color:#fff;padding:8px 12px;border-radius:10px;">⚡ ${tensWords[tens]} = ${tens * 10}</div>` : ''}
                                ${tens !== 1 && ones > 0 ? `<div style="background:var(--monster-yellow);color:#000;padding:8px 12px;border-radius:10px;">🔥 ${onesWords[ones]} = ${ones}</div>` : ''}
                            </div>
                            <p style="margin-top:8px;">Add them all: <strong>${num.toLocaleString()}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Place value monster battle — mixed challenge
            {
                skillId: '4pv-boss',
                generate(diff, modality) {
                    const challenges = [
                        () => {
                            // What is N times 10/100/1000?
                            const multiplier = pick([10, 100, 1000]);
                            const base = R(1, diff >= 2 ? 99 : 9);
                            const answer = base * multiplier;
                            const zeroCount = String(multiplier).length - 1;
                            const wrongAnswer = base * (multiplier / 10); // common: one fewer zero

                            const result = {
                                type: 'input',
                                questionText: `🐲 MONSTER BATTLE! What is ${base} x ${multiplier.toLocaleString()}?`,
                                visual: `<div style="font-size:3rem;animation:bounce 0.6s ease-in-out infinite;">🐲⚔️</div>`,
                                answer,
                                hint1: `Multiplying by ${multiplier.toLocaleString()} moves digits to the left`,
                                hint2: `${base} x ${multiplier.toLocaleString()} — just add ${zeroCount} zero${zeroCount > 1 ? 's' : ''}`,
                                hint3: `${base} x ${multiplier.toLocaleString()} = ${answer.toLocaleString()}`,
                                diagnose(userAnswer) {
                                    if (userAnswer === wrongAnswer && multiplier > 10) return 'missing-zero';
                                    if (userAnswer === base + multiplier) return 'added-instead-of-multiplied';
                                    return null;
                                },
                                misconceptionHints: {
                                    'missing-zero': `You're close but missing a zero! When you multiply by ${multiplier.toLocaleString()}, you add ${zeroCount} zero${zeroCount > 1 ? 's' : ''} to the end.`,
                                    'added-instead-of-multiplied': `It looks like you added ${base} + ${multiplier.toLocaleString()} instead of multiplying! Multiplying by ${multiplier.toLocaleString()} means adding ${zeroCount} zero${zeroCount > 1 ? 's' : ''} after ${base}.`
                                }
                            };

                            if (modality === 'worked-example') {
                                result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 7 x 100 = ?</p><p>Multiplying by 100 means adding 2 zeros</p><p>7 → 7<strong>00</strong></p><p>Answer: <strong>700</strong></p></div>`;
                            } else if (modality === 'visual') {
                                result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                                    <p>🐲 Each zero in ${multiplier.toLocaleString()} is a monster power-up!</p>
                                    <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
                                        <span style="font-size:1.4rem;font-weight:700;">${base}</span>
                                        ${Array.from({length: zeroCount}, (_, i) => `<span style="font-size:1.4rem;">→ <span style="color:var(--monster-red);font-weight:700;">0</span> ⚡</span>`).join('')}
                                    </div>
                                    <p style="margin-top:4px;">= <strong>${answer.toLocaleString()}</strong></p>
                                </div>`;
                            }

                            return result;
                        },
                        () => {
                            // What number is 10/100/1000 more/less?
                            const moreOrLess = pick(['more', 'less']);
                            const amount = pick([10, 100, 1000]);
                            // Ensure num >= amount when subtracting so the answer stays non-negative
                            const minNum = moreOrLess === 'less' ? Math.max(200, amount + 100) : 200;
                            const num = R(minNum, diff >= 2 ? 9000 : 2000);
                            const answer = moreOrLess === 'more' ? num + amount : num - amount;
                            const oppositeAnswer = moreOrLess === 'more' ? num - amount : num + amount;

                            const result = {
                                type: 'input',
                                questionText: `🦖 BOSS ATTACK! What is ${amount.toLocaleString()} ${moreOrLess} than ${num.toLocaleString()}?`,
                                visual: `<div style="font-size:3rem;animation:bounce 0.5s ease-in-out infinite;">🦖💎</div>`,
                                answer,
                                hint1: `${amount.toLocaleString()} ${moreOrLess} means ${moreOrLess === 'more' ? 'add' : 'subtract'} ${amount.toLocaleString()}`,
                                hint2: `${num.toLocaleString()} ${moreOrLess === 'more' ? '+' : '−'} ${amount.toLocaleString()} = ?`,
                                hint3: `${num.toLocaleString()} ${moreOrLess === 'more' ? '+' : '−'} ${amount.toLocaleString()} = ${answer.toLocaleString()}`,
                                diagnose(userAnswer) {
                                    if (userAnswer === oppositeAnswer) return 'wrong-operation';
                                    if (userAnswer === num) return 'forgot-to-calculate';
                                    return null;
                                },
                                misconceptionHints: {
                                    'wrong-operation': `You did the opposite! "${moreOrLess}" means ${moreOrLess === 'more' ? 'ADD' : 'SUBTRACT'}. Try again!`,
                                    'forgot-to-calculate': `That's the original number! You need to ${moreOrLess === 'more' ? 'add' : 'subtract'} ${amount.toLocaleString()} ${moreOrLess === 'more' ? 'to' : 'from'} it.`
                                }
                            };

                            if (modality === 'worked-example') {
                                result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 100 more than 3,456 = ?</p><p>"More" means add: 3,456 + 100</p><p>Only the hundreds digit changes: 4 → 5</p><p>Answer: <strong>3,556</strong></p></div>`;
                            } else if (modality === 'visual') {
                                result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                                    <p>🦖 ${moreOrLess === 'more' ? 'Power UP! Add' : 'Monster attacks! Subtract'} ${amount.toLocaleString()}</p>
                                    <div style="font-size:1.3rem;font-weight:700;">
                                        ${num.toLocaleString()} ${moreOrLess === 'more' ? '+ 💎' : '− 💥'} ${amount.toLocaleString()} = <span style="color:var(--monster-yellow);">?</span>
                                    </div>
                                </div>`;
                            }

                            return result;
                        }
                    ];
                    return pick(challenges)();
                }
            }
        ];
    }
};
