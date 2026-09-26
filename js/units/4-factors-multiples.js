/* ===== UNIT: FACTORS & MULTIPLES (4th Grade) — Dance Theme 🎤 ===== */

const FactorsMultiples4 = {
    id: '4-factors-multiples',
    title: 'Factors & Multiples',
    icon: '🎤',
    theme: 'dance',
    description: "Find the rhythm in numbers! Discover factors, multiples, and prime vs composite on the dance floor!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        function getFactors(n) {
            const factors = [];
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) factors.push(i);
            }
            return factors;
        }

        // 1st, 2nd, 3rd, 4th ... 11th, 12th, 13th
        function ordinal(k) {
            const suffix = (k % 100 >= 11 && k % 100 <= 13) ? 'th' : ({1: 'st', 2: 'nd', 3: 'rd'}[k % 10] || 'th');
            return `${k}${suffix}`;
        }

        // Prime test WITHOUT the verdict — the same text for primes and composites so it can't be a tell.
        // Only divisors smaller than n (2 ÷ 2 DOES work, so don't list it for n = 2)
        function trialDivisors(n) {
            return [2, 3, 5, 7].filter(p => p < n);
        }
        function primeTestText(n) {
            const divs = trialDivisors(n);
            return divs.length
                ? `Try dividing ${n} by ${divs.join(', ')}. Does ${divs.length === 1 ? 'it' : 'any of them'} divide evenly (no remainder)?`
                : `Which numbers divide ${n} evenly? Count them.`;
        }
        // 1 and n always divide n; the middle boxes are the divisions left for her to try
        function primeTestBoxes(n) {
            const box = (text, color, bg) => `<div style="padding:5px 12px;background:${bg};border:2px solid ${color};border-radius:8px;font-weight:700;color:${color};">${text}</div>`;
            return [
                box(1, 'var(--dance-purple)', 'rgba(168,85,247,0.15)'),
                ...trialDivisors(n).map(d => box(`${n} ÷ ${d} = ?`, 'var(--dance-gold)', 'rgba(234,179,8,0.2)')),
                box(n, 'var(--dance-purple)', 'rgba(168,85,247,0.15)')
            ].join('');
        }

        return [
            // 1. List all factor pairs
            {
                skillId: '4fm-factor-pairs',
                generate(diff, modality) {
                    const n = diff >= 2 ? pick([24, 30, 36, 48, 60]) : pick([12, 16, 18, 20, 24]);
                    const factors = getFactors(n);
                    const pairCount = Math.floor(factors.length / 2) + (Math.sqrt(n) % 1 === 0 ? 1 : 0);
                    const answer = factors.length;
                    // The small half of each factor pair — she finds the partners and does the counting
                    const small = factors.filter(f => f * f <= n);
                    const root = Math.sqrt(n);
                    const isSquare = Number.isInteger(root);

                    const result = {
                        type: 'input',
                        questionText: `🎤 How many factors does ${n} have?<br>Count ALL the numbers that divide evenly into ${n}.`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;font-weight:800;color:var(--dance-gold);">🎵 ${n} 🎵</div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted);">A factor divides evenly (no remainder)</div>
                        </div>`,
                        answer,
                        hint1: `Start checking: 1 × ? = ${n}, 2 × ? = ${n}, 3 × ? = ${n}...`,
                        hint2: `Factor pairs of ${n}: ${small.map(f => `${f} × ?`).join(', ')}. Find each partner, then count EVERY number${isSquare ? ` (${root} × ${root} counts once!)` : ''}.`,
                        hint3: `${n} has ${answer} factors: ${factors.join(', ')}`,
                        diagnose(userAnswer) {
                            if (userAnswer === pairCount) return 'counted-pairs-not-factors';
                            return null;
                        },
                        misconceptionHints: {
                            'counted-pairs-not-factors': `You counted factor PAIRS, not individual factors! Each pair gives you TWO factors (${small[1]} × ${n / small[1]} gives ${small[1]} AND ${n / small[1]}) — count every number in every pair${isSquare ? `, but ${root} × ${root} is just one number` : ''}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // The 12 example has 6 factors — switch if that's this question's answer too (12, 18, 20)
                        result.workedExample = answer === 6
                            ? `<div style="text-align:center"><p><strong>Example:</strong> Factors of 16</p><p>1×16, 2×8, 4×4</p><p>Factors: 1, 2, 4, 8, 16 = <strong>5 factors</strong> (4 × 4 counts once!)</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> Factors of 12</p><p>1×12, 2×6, 3×4</p><p>Factors: 1, 2, 3, 4, 6, 12 = <strong>6 factors</strong></p></div>`;
                    }

                    return result;
                }
            },
            // 2. Is this a factor?
            {
                skillId: '4fm-is-factor',
                generate(diff, modality) {
                    const pickN = () => diff >= 2 ? R(20, 60) : R(10, 30);
                    const isFactor = Math.random() < 0.5;
                    let n = pickN();
                    // For "Yes" questions, avoid primes — their only factors are 1 and n (trivial)
                    if (isFactor) while (getFactors(n).length <= 2) n = pickN();
                    let testNum;
                    if (isFactor) {
                        const factors = getFactors(n);
                        testNum = pick(factors.filter(f => f !== 1 && f !== n));
                    } else {
                        testNum = R(2, n - 1);
                        while (n % testNum === 0) testNum = R(2, n - 1);
                    }
                    const answer = n % testNum === 0 ? 'Yes' : 'No';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎶 Is ${testNum} a factor of ${n}?`,
                        visual: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;">
                            <span style="color:var(--dance-pink);">🎵 ${testNum}</span>
                            <span style="color:var(--dance-gold);">→</span>
                            <span style="color:var(--dance-cyan);">🎵 ${n}</span>
                        </div>`,
                        answer,
                        options: [{label: 'Yes — it divides evenly!', value: 'Yes'}, {label: 'No — there\'s a remainder!', value: 'No'}],
                        hint1: `Does ${n} ÷ ${testNum} have a remainder?`,
                        // Give the quotient to try, but leave the multiply-and-compare (the remainder check) to her
                        hint2: `Try ${testNum} × ${Math.floor(n / testNum)} = ? Does it land exactly on ${n}, or is some left over?`,
                        hint3: `${n} ÷ ${testNum} = ${n % testNum === 0 ? n / testNum + ' (no remainder!)' : Math.floor(n / testNum) + ' R ' + (n % testNum)}, so ${answer}!`,
                        diagnose(userAnswer) {
                            if (answer === 'Yes' && userAnswer === 'No') return 'confused-factor-multiple';
                            if (answer === 'No' && userAnswer === 'Yes') return 'confused-factor-multiple';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-factor-multiple': `Remember: a FACTOR divides evenly into the number, with nothing left over. Work out ${n} ÷ ${testNum} — is there a remainder?`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = (testNum === 4 && n === 20)
                            ? `<div style="text-align:center"><p><strong>Example:</strong> Is 3 a factor of 18?</p><p>18 ÷ 3 = 6 (no remainder)</p><p>Yes! 3 IS a factor of 18.</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> Is 4 a factor of 20?</p><p>20 ÷ 4 = 5 (no remainder)</p><p>Yes! 4 IS a factor of 20.</p></div>`;
                    }

                    if (modality === 'visual') {
                        // Only the FIRST group is coloured (testNum < n, so it's always a full group) — marking every
                        // group would show the leftover dots; making the rest of the groups is her step
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🕺 Dance Division Check 🕺</div>
                            <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: n}, (_, i) => `<div style="width:18px;height:18px;border-radius:50%;background:${i < testNum ? 'var(--dance-pink)' : 'var(--dance-cyan)'};opacity:0.8;"></div>`).join('')}
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">${n} dots. Here's the first group of ${testNum}. Keep making groups of ${testNum} — are any dots left over?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. List multiples
            {
                skillId: '4fm-multiples',
                generate(diff, modality) {
                    const n = R(2, diff >= 2 ? 12 : 8);
                    const position = R(diff >= 2 ? 5 : 3, diff >= 2 ? 10 : 7);
                    const answer = n * position;
                    const factors = getFactors(n);

                    const result = {
                        type: 'input',
                        questionText: `🕺 What is the ${ordinal(position)} multiple of ${n}?`,
                        // Show the first few multiples, then a "?" box — never the answer itself
                        visual: `<div style="text-align:center;">
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: Math.min(position - 1, 4)}, (_, i) => `<div style="padding:6px 12px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${n * (i + 1)}</div>`).join('')}
                                ${position - 1 > 4 ? '<span style="font-size:1.3rem;color:var(--dance-gold);">...</span>' : ''}<div style="padding:6px 12px;background:rgba(34,211,238,0.2);border:2px solid var(--dance-cyan);border-radius:8px;font-weight:800;color:var(--dance-cyan);">?</div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `The ${ordinal(position)} multiple means ${n} × ${position}`,
                        hint2: `${n} × ${position} = ?`,
                        hint3: `The ${ordinal(position)} multiple of ${n} is ${answer}`,
                        diagnose(userAnswer) {
                            // n itself is the 1st multiple of n, so it isn't a "factor, not a multiple" slip
                            if (factors.includes(userAnswer) && userAnswer !== n) return 'gave-factor-not-multiple';
                            if (userAnswer === n + position) return 'added-instead-of-multiplied';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-factor-not-multiple': `That's a FACTOR of ${n}, not a multiple! A multiple is ${n} × something. The ${ordinal(position)} multiple = ${n} × ${position}.`,
                            'added-instead-of-multiplied': `It looks like you added ${n} + ${position} = ${n + position}. The ${ordinal(position)} MULTIPLE means ${n} × ${position} = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the answer would be the example's 24 (e.g. the 6th multiple of 4)
                        result.workedExample = answer === 24
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 4th multiple of 7</p><p>7, 14, 21, <strong>28</strong></p><p>Or simply: 7 × 4 = <strong>28</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 4th multiple of 6</p><p>6, 12, 18, <strong>24</strong></p><p>Or simply: 6 × 4 = <strong>24</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        // Every step up to the one before hers — the last +n step stays a gold "?"
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">💃 Skip-Counting Dance Steps 💃</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: position - 1}, (_, i) => `<div style="padding:6px 12px;background:rgba(236,72,153,0.15);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${n * (i + 1)}</div>`).join('')}<div style="padding:6px 12px;background:var(--dance-gold);border:2px solid var(--dance-gold);border-radius:8px;font-weight:700;color:#fff;">?</div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">Each step is +${n}. What's step #${position}?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Is this a multiple?
            {
                skillId: '4fm-is-multiple',
                generate(diff, modality) {
                    const base = R(2, diff >= 2 ? 12 : 8);
                    const isMultiple = Math.random() < 0.5;
                    let testNum;
                    if (isMultiple) {
                        testNum = base * R(2, 12);
                    } else {
                        testNum = base * R(2, 12) + R(1, base - 1);
                    }
                    const answer = testNum % base === 0 ? 'Yes' : 'No';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎵 Is ${testNum} a multiple of ${base}?`,
                        visual: `<div style="font-size:2rem;font-weight:800;text-align:center;color:var(--dance-purple);">
                            💃 ${testNum} ÷ ${base} = ?
                        </div>`,
                        answer,
                        options: [{label: 'Yes — divides evenly!', value: 'Yes'}, {label: 'No — has a remainder!', value: 'No'}],
                        hint1: `Divide ${testNum} by ${base}. Is there a remainder?`,
                        // Give the quotient to try, but leave the multiply-and-compare (the remainder check) to her
                        hint2: `Try ${base} × ${Math.floor(testNum / base)} = ? Does it land exactly on ${testNum}, or is some left over?`,
                        hint3: `${testNum} ÷ ${base} = ${testNum % base === 0 ? testNum / base : Math.floor(testNum / base) + ' R ' + (testNum % base)}, so ${answer}!`,
                        diagnose(userAnswer) {
                            if (answer === 'No' && userAnswer === 'Yes') return 'ignored-remainder';
                            if (answer === 'Yes' && userAnswer === 'No') return 'skip-count-error';
                            return null;
                        },
                        misconceptionHints: {
                            'ignored-remainder': `Look again — a multiple of ${base} divides by ${base} with NO remainder. Work out ${testNum} ÷ ${base} carefully: is anything left over?`,
                            // Start the count but stop short of testNum — landing on it (or not) is her step
                            'skip-count-error': `Try skip-counting by ${base}: ${Array.from({length: Math.min(Math.floor(testNum / base) - 1, 5)}, (_, i) => base * (i + 1)).join(', ')}... keep going! Do you land exactly on ${testNum}?`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = (base === 7 && (testNum === 21 || testNum === 22))
                            ? `<div style="text-align:center"><p><strong>Example:</strong> Is 24 a multiple of 6?</p><p>24 ÷ 6 = 4 (no remainder)</p><p>Yes! 24 = 6 × 4, so 24 IS a multiple of 6.</p><p><strong>Non-example:</strong> Is 25 a multiple of 6? 25 ÷ 6 = 4 R 1. No!</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> Is 21 a multiple of 7?</p><p>21 ÷ 7 = 3 (no remainder)</p><p>Yes! 21 = 7 × 3, so 21 IS a multiple of 7.</p><p><strong>Non-example:</strong> Is 22 a multiple of 7? 22 ÷ 7 = 3 R 1. No!</p></div>`;
                    } else if (modality === 'visual') {
                        // Stop one beat BEFORE the last multiple at or below testNum (the same list length for Yes and No),
                        // so testNum never shows up — counting on and checking whether she lands on it is her step
                        const steps = Math.floor(testNum / base) - 1;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🕺 Skip-Count Dance Floor 🕺</div>
                            <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                ${Array.from({length: steps}, (_, i) => `<div style="padding:5px 10px;background:rgba(236,72,153,0.12);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${base * (i + 1)}</div>`).join('')}<div style="padding:5px 10px;background:var(--dance-gold);border:2px solid var(--dance-gold);border-radius:8px;font-weight:700;color:#fff;">?</div>
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">Keep counting by +${base} — do you land exactly on ${testNum}?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Prime or composite?
            {
                skillId: '4fm-prime-composite',
                generate(diff, modality) {
                    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
                    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27, 28];
                    const isPrime = Math.random() < 0.5;
                    const n = isPrime ? pick(diff >= 2 ? primes : primes.slice(0, 6)) : pick(diff >= 2 ? composites : composites.slice(0, 8));
                    const answer = isPrime ? 'Prime' : 'Composite';
                    const nFactors = getFactors(n);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ Is ${n} prime or composite?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:3rem;font-weight:800;color:var(--dance-gold);">✨ ${n} ✨</div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">Prime = only 1 and itself. Composite = more factors.</div>
                        </div>`,
                        answer,
                        options: [
                            {label: `Prime (only 2 factors)`, value: 'Prime'},
                            {label: `Composite (more than 2 factors)`, value: 'Composite'}
                        ],
                        hint1: `Can any number besides 1 and ${n} divide into ${n} evenly?`,
                        hint2: `${primeTestText(n)} Exactly 2 factors means prime; more than 2 means composite.`,
                        hint3: `${n} is ${answer} (factors: ${nFactors.join(', ')})`,
                        diagnose(userAnswer) {
                            if (n === 2 && userAnswer === 'Composite') return 'two-is-prime';
                            if (isPrime && userAnswer === 'Composite') return 'missed-prime';
                            if (!isPrime && userAnswer === 'Prime') return 'missed-composite';
                            return null;
                        },
                        misconceptionHints: {
                            'two-is-prime': `Being even doesn't make a number composite! Which numbers divide 2 evenly? Count them — exactly 2 factors means prime, more than 2 means composite.`,
                            'missed-prime': `Composite means there's a factor besides 1 and ${n}. Which one did you find? Check it! ${primeTestText(n)}`,
                            'missed-composite': `A prime has ONLY 2 factors: 1 and itself. Did you check for others? ${primeTestText(n)}`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Example numbers must differ from the one being asked
                        const exPrime = n === 7 ? 11 : 7;
                        const exComposite = n === 12 ? 10 : 12;
                        result.workedExample = `<div style="text-align:center"><p><strong>Prime:</strong> ${exPrime} → factors are just ${getFactors(exPrime).join(', ')} ✓</p><p><strong>Composite:</strong> ${exComposite} → factors: ${getFactors(exComposite).join(', ')} ✗</p><p>Note: 1 is NEITHER prime nor composite!</p></div>`;
                    } else if (modality === 'visual') {
                        // Show the test (1, the divisions to try, n) — not the full factor list or a verdict
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">💃 Factor Dance Test 💃</div>
                            <div style="font-size:2.2rem;font-weight:800;color:var(--dance-gold);margin-bottom:10px;">✨ ${n} ✨</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                ${primeTestBoxes(n)}
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">1 and ${n} always divide ${n}. ${trialDivisors(n).length ? 'Do any of the middle ones divide evenly too?' : 'Is there any other factor?'} Exactly 2 factors means PRIME. More than 2 means COMPOSITE. 🎵</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Common factors
            {
                skillId: '4fm-common-factors',
                generate(diff, modality) {
                    const pool = diff >= 2 ? [12, 16, 18, 20, 24, 30] : [6, 8, 10, 12];
                    const a = pick(pool);
                    let b = pick(pool);
                    while (b === a) b = pick(pool);
                    const aFactors = getFactors(a);
                    const bFactors = getFactors(b);
                    const common = aFactors.filter(f => bFactors.includes(f));
                    const gcf = Math.max(...common);
                    const answer = gcf;

                    // Compute LCM for diagnose
                    const lcm = (a * b) / gcf;

                    const result = {
                        type: 'input',
                        questionText: `🎤 What is the greatest common factor (GCF) of ${a} and ${b}?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:flex;gap:20px;justify-content:center;">
                                <div style="padding:10px 16px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:10px;">
                                    <div style="font-weight:700;color:var(--dance-pink);">Factors of ${a}:</div>
                                    <div style="color:var(--text-secondary);">${aFactors.join(', ')}</div>
                                </div>
                                <div style="padding:10px 16px;background:rgba(34,211,238,0.1);border:2px solid var(--dance-cyan);border-radius:10px;">
                                    <div style="font-weight:700;color:var(--dance-cyan);">Factors of ${b}:</div>
                                    <div style="color:var(--text-secondary);">${bFactors.join(', ')}</div>
                                </div>
                            </div>
                        </div>`,
                        answer,
                        // No sorted common-factor list before hint3 — its last number IS the GCF
                        hint1: `Which numbers are in BOTH factor lists?`,
                        hint2: `Start at the BIGGEST factor of ${Math.min(a, b)} and work down: does it divide ${Math.max(a, b)} evenly too? The first one that does is the GCF!`,
                        hint3: `GCF(${a}, ${b}) = ${gcf}`,
                        diagnose(userAnswer) {
                            if (userAnswer === lcm) return 'gave-lcm';
                            if (common.includes(userAnswer) && userAnswer !== gcf) return 'gave-common-not-greatest';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-lcm': `You found the LCM (Least Common Multiple), not the GCF! The GCF is the GREATEST factor they SHARE — which numbers are in both factor lists? Pick the biggest.`,
                            'gave-common-not-greatest': `That is a common factor, but not the GREATEST one. Is there a bigger number in BOTH lists?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the GCF would be the example's 6 (e.g. 12 and 18)
                        result.workedExample = gcf === 6
                            ? `<div style="text-align:center"><p><strong>Example:</strong> GCF of 8 and 12</p><p>Factors of 8: 1, 2, 4, 8</p><p>Factors of 12: 1, 2, 3, 4, 6, 12</p><p>Common: 1, 2, 4 → GCF = <strong>4</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> GCF of 12 and 18</p><p>Factors of 12: 1, 2, 3, 4, 6, 12</p><p>Factors of 18: 1, 2, 3, 6, 9, 18</p><p>Common: 1, 2, 3, 6 → GCF = <strong>6</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        // Both full factor lists, with one "?" slot per shared factor in the middle — sorting the
                        // numbers into the middle (and picking the greatest) is her step
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎤 Venn Diagram Dance 🎤</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0;">
                                <div style="padding:10px 20px 10px 16px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:20px 0 0 20px;min-width:80px;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-pink);">Factors of ${a}</div>
                                    <div style="font-size:0.85rem;">${aFactors.join(', ')}</div>
                                </div>
                                <div style="padding:10px 14px;background:rgba(168,85,247,0.15);border:2px solid var(--dance-purple);min-width:70px;z-index:1;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-purple);">Both</div>
                                    <div style="font-size:0.85rem;font-weight:700;">${common.map(() => '?').join(' ')}</div>
                                </div>
                                <div style="padding:10px 16px 10px 20px;background:rgba(34,211,238,0.1);border:2px solid var(--dance-cyan);border-radius:0 20px 20px 0;min-width:80px;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-cyan);">Factors of ${b}</div>
                                    <div style="font-size:0.85rem;">${bFactors.join(', ')}</div>
                                </div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">Find the numbers in BOTH lists (one for each ?), then pick the GREATEST!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Dance-Off Boss
            {
                skillId: '4fm-boss',
                generate(diff, modality) {
                    const type = pick(['factors', 'prime', 'multiples']);

                    if (type === 'factors') {
                        const n = pick(diff >= 2 ? [24, 30, 36, 48] : [18, 24, 30, 36]);
                        const factors = getFactors(n);
                        const pairCount = Math.floor(factors.length / 2) + (Math.sqrt(n) % 1 === 0 ? 1 : 0);
                        // The small half of each factor pair — she finds the partners and does the counting
                        const small = factors.filter(f => f * f <= n);
                        const root = Math.sqrt(n);
                        const isSquare = Number.isInteger(root);

                        const result = {
                            type: 'input',
                            questionText: `🎤 DANCE-OFF FINALE! How many factors does ${n} have?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎤💃🕺</div>`,
                            answer: factors.length,
                            hint1: `List factor pairs: 1×${n}, 2×?, 3×?...`,
                            hint2: `Factor pairs of ${n}: ${small.map(f => `${f} × ?`).join(', ')}. Find each partner, then count EVERY number${isSquare ? ` (${root} × ${root} counts once!)` : ''}.`,
                            hint3: `${n} has ${factors.length} factors`,
                            diagnose(userAnswer) {
                                if (userAnswer === pairCount) return 'counted-pairs-not-factors';
                                if (userAnswer === factors.length - 1) return 'missed-a-factor';
                                return null;
                            },
                            misconceptionHints: {
                                'counted-pairs-not-factors': `You counted factor PAIRS, not individual factors! Each of your ${pairCount} pairs has TWO numbers — count every one${isSquare ? ` (but ${root} × ${root} is just one number)` : ''}.`,
                                // Don't say how many she's missing (diagnose only fires on one-short, so that would be the answer)
                                'missed-a-factor': `Some factors are hiding! Did you check every number from 1 up to ${Math.floor(root)}? Each one that divides ${n} evenly gives a PAIR — count both numbers${isSquare ? ` (${root} × ${root} counts once)` : ''}, and don't forget 1 and ${n}!`
                            }
                        };

                        if (modality === 'worked-example') {
                            // Solve a DIFFERENT number (with a different factor count) so the example doesn't give the answer away
                            const exN = pick([12, 16, 18, 20, 24, 30, 36, 48].filter(x => getFactors(x).length !== factors.length));
                            const exFactors = getFactors(exN);
                            result.workedExample = `<div style="text-align:center"><p><strong>Strategy:</strong> Check pairs from 1 up to √${exN} ≈ ${Math.sqrt(exN).toFixed(1)}</p><p>Each pair gives TWO factors (unless it's a perfect square).</p><p>Example — factors of ${exN}: ${exFactors.join(', ')} = <strong>${exFactors.length} factors</strong></p></div>`;
                        } else if (modality === 'visual') {
                            // One dancer from each pair; finding the partners and counting everyone is her step
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎤 Factor Pair Dance 🎤</div>
                                <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                    ${small.map(f => `<div style="padding:5px 12px;background:rgba(236,72,153,0.12);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${f} × ?</div>`).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">Find each dancer's partner, then count EVERY number — not just the pairs${isSquare ? ` (${root} × ${root} counts once)` : ''}! 💃</div>
                            </div>`;
                        }

                        return result;

                    } else if (type === 'prime') {
                        const pool = diff >= 2 ? [2, 3, 5, 7, 11, 13, 4, 6, 8, 9, 10, 15, 17, 19, 21, 25] : [2, 3, 5, 7, 11, 13, 4, 6, 8, 9, 10, 15];
                        const n = pick(pool);
                        const nFactors = getFactors(n);
                        const isPrime = nFactors.length === 2;
                        const answer = isPrime ? 'Prime' : 'Composite';

                        const result = {
                            type: 'multiple-choice',
                            questionText: `🎤 DANCE-OFF FINALE! Is ${n} prime or composite?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨🎤✨</div>`,
                            answer,
                            options: [{label: 'Prime (only 2 factors)', value: 'Prime'}, {label: 'Composite (more than 2 factors)', value: 'Composite'}],
                            hint1: `Check for factors besides 1 and ${n}`,
                            hint2: `${primeTestText(n)} Exactly 2 factors means prime; more than 2 means composite.`,
                            hint3: `${n} is ${answer} — it has ${nFactors.length} factor${nFactors.length !== 1 ? 's' : ''}`,
                            diagnose(userAnswer) {
                                if (n === 2 && userAnswer === 'Composite') return 'two-is-prime';
                                if (isPrime && userAnswer === 'Composite') return 'missed-prime';
                                if (!isPrime && userAnswer === 'Prime') return 'missed-composite';
                                return null;
                            },
                            misconceptionHints: {
                                'two-is-prime': `Don't let the "even" fool you — being even doesn't make a number composite! Which numbers divide 2 evenly? Count them: exactly 2 factors means prime, more means composite. 🎵`,
                                'missed-prime': `Composite needs an extra factor besides 1 and ${n}. Which one did you find? ${primeTestText(n)} ✨`,
                                'missed-composite': `Prime means ONLY 1 and itself. Look for another factor! ${primeTestText(n)} 🕺`
                            }
                        };

                        if (modality === 'worked-example') {
                            // Solve a DIFFERENT number so the example doesn't give the answer away
                            const exN = pick(pool.filter(x => x !== n));
                            const exFactors = getFactors(exN);
                            result.workedExample = `<div style="text-align:center"><p><strong>Rule:</strong> Exactly 2 factors → Prime. More than 2 → Composite.</p><p>Example — factors of ${exN}: ${exFactors.join(', ')}</p><p>${exN} is <strong>${exFactors.length === 2 ? 'Prime' : 'Composite'}</strong>!</p><p style="font-size:0.85rem;color:var(--text-muted);">Remember: 1 is NEITHER prime nor composite.</p></div>`;
                        } else if (modality === 'visual') {
                            // Show the test (1, the divisions to try, n) — not the full factor list or a verdict
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">✨ Prime or Composite Spotlight ✨</div>
                                <div style="font-size:2.5rem;font-weight:800;color:var(--dance-gold);margin-bottom:10px;">🎤 ${n} 🎤</div>
                                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                    ${primeTestBoxes(n)}
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">1 and ${n} always divide ${n}. ${trialDivisors(n).length ? 'Do any of the middle ones divide evenly too?' : 'Is there any other factor?'} Only 2 factors means PRIME. More means COMPOSITE. 🎵</div>
                            </div>`;
                        }

                        return result;

                    } else {
                        const base = R(diff >= 2 ? 4 : 3, diff >= 2 ? 12 : 9);
                        const pos = R(diff >= 2 ? 7 : 5, diff >= 2 ? 15 : 12);
                        const answer = base * pos;

                        const result = {
                            type: 'input',
                            questionText: `🎤 DANCE-OFF FINALE! What is the ${pos}th multiple of ${base}?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🪩🎵🪩</div>`,
                            answer,
                            hint1: `The ${pos}th multiple means ${base} × ${pos}`,
                            hint2: `${base} × ${pos} = ?`,
                            hint3: `${base} × ${pos} = ${answer}`,
                            diagnose(userAnswer) {
                                if (userAnswer === base + pos) return 'added-instead-of-multiplied';
                                if (userAnswer === base * (pos - 1)) return 'off-by-one';
                                if (userAnswer === base * (pos + 1)) return 'off-by-one';
                                return null;
                            },
                            misconceptionHints: {
                                'added-instead-of-multiplied': `You added ${base} + ${pos} = ${base + pos}, but multiples use MULTIPLICATION! The ${pos}th multiple = ${base} × ${pos} = ? 🕺`,
                                // Fires for BOTH base × (pos − 1) and base × (pos + 1), so no direction and no "one beat" count
                                'off-by-one': `Almost! Your count slipped onto a different beat. The 1st multiple of ${base} is ${base} itself, so the ${pos}th multiple is ${base} × ${pos} = ? 🎵`
                            }
                        };

                        if (modality === 'worked-example') {
                            // Solve a DIFFERENT problem (different base, different result) so the example doesn't give the answer away
                            let exBase, exPos;
                            do {
                                exBase = R(3, 9);
                                exPos = R(5, 9);
                            } while (exBase === base || exBase * exPos === answer);
                            const exAnswer = exBase * exPos;
                            result.workedExample = `<div style="text-align:center"><p><strong>Shortcut:</strong> The Nth multiple of a number = number × N</p><p>Example: the ${ordinal(exPos)} multiple of ${exBase} = ${exBase} × ${exPos} = <strong>${exAnswer}</strong></p><p>Skip-count check: ${Array.from({length: Math.min(exPos, 5)}, (_, i) => exBase * (i + 1)).join(', ')}${exPos > 5 ? `, ... ${exAnswer}` : ''}</p></div>`;
                        } else if (modality === 'visual') {
                            // Count up to (at most) the beat before hers — beat #pos itself stays a gold "?"
                            const displayCount = Math.min(pos - 1, 7);
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🪩 Skip-Count to the Beat 🪩</div>
                                <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-bottom:6px;">
                                    ${Array.from({length: displayCount}, (_, i) => `<div style="padding:5px 10px;background:rgba(236,72,153,0.12);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${base * (i + 1)}</div>`).join('')}
                                    ${pos - 1 > displayCount ? `<div style="padding:5px 10px;color:var(--text-muted);font-weight:700;">...</div>` : ''}<div style="padding:5px 10px;background:var(--dance-gold);border:2px solid var(--dance-gold);border-radius:8px;font-weight:700;color:#fff;">?</div>
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">Each beat = +${base}. Beat #${pos} = ?</div>
                            </div>`;
                        }

                        return result;
                    }
                }
            }
        ];
    }
};
