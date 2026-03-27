/* ===== UNIT: AREA & PERIMETER (4th Grade) — Dance Theme 🪩 ===== */

const AreaPerimeter4 = {
    id: '4-area-perimeter',
    title: 'Area & Perimeter',
    icon: '🪩',
    theme: 'dance',
    description: "Design the dance floor! Calculate area and perimeter of rectangles and complex shapes!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Area of a rectangle
            {
                skillId: '4ap-rect-area',
                generate(diff, modality) {
                    const w = R(2, diff >= 2 ? 15 : 8);
                    const h = R(2, diff >= 2 ? 15 : 8);
                    const answer = w * h;

                    const result = {
                        type: 'input',
                        questionText: `🪩 The dance floor is ${w} meters wide and ${h} meters long.<br>What is the area?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:inline-block;width:${Math.min(w * 20, 200)}px;height:${Math.min(h * 20, 160)}px;background:rgba(236,72,153,0.15);border:3px solid var(--dance-pink);border-radius:8px;display:flex;align-items:center;justify-content:center;position:relative;">
                                <span style="font-weight:700;color:var(--dance-pink);">🪩</span>
                                <span style="position:absolute;bottom:-24px;font-size:0.9rem;font-weight:700;color:var(--dance-gold);">${w} m</span>
                                <span style="position:absolute;right:-40px;top:50%;transform:translateY(-50%);font-size:0.9rem;font-weight:700;color:var(--dance-cyan);">${h} m</span>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Area = length × width`,
                        hint2: `${w} × ${h} = ?`,
                        hint3: `Area = ${w} × ${h} = ${answer} square meters`,
                        diagnose(userAnswer) {
                            if (userAnswer === 2 * (w + h)) return 'calculated-perimeter';
                            if (userAnswer === w + h) return 'added-sides';
                            return null;
                        },
                        misconceptionHints: {
                            'calculated-perimeter': `✨ That's the perimeter! Area fills the whole floor — use multiplication: ${w} × ${h} = ${answer} sq m. Perimeter goes around the edge! 💃`,
                            'added-sides': `🎵 You added the sides, but area needs multiplication! Try ${w} × ${h} to cover the whole dance floor. 🕺`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Example:</strong> A 5m × 3m floor</p><p>Area = 5 × 3 = <strong>15 sq m</strong> 🪩</p><p>Think: tiles covering every inch of the dance floor!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(236,72,153,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-pink);">✨ Area fills the whole space!</p>
                            <p style="color:var(--dance-gold);">Area = ${w} × ${h} = ${answer} sq m 🪩</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Perimeter of a rectangle
            {
                skillId: '4ap-rect-perim',
                generate(diff, modality) {
                    const w = R(2, diff >= 2 ? 15 : 8);
                    const h = R(2, diff >= 2 ? 15 : 8);
                    const answer = 2 * (w + h);

                    const result = {
                        type: 'input',
                        questionText: `💃 The dance stage is ${w} feet wide and ${h} feet long.<br>What is the perimeter?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:inline-block;border:3px dashed var(--dance-cyan);border-radius:8px;padding:20px 30px;">
                                <div style="font-size:0.9rem;color:var(--dance-gold);font-weight:700;">${w} ft</div>
                                <div style="display:flex;justify-content:space-between;align-items:center;width:${Math.min(w * 15, 150)}px;height:${Math.min(h * 15, 100)}px;">
                                    <span style="font-size:0.9rem;color:var(--dance-pink);font-weight:700;">${h} ft</span>
                                    <span style="font-size:1.5rem;">💃</span>
                                </div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Perimeter = 2 × (length + width)`,
                        hint2: `2 × (${w} + ${h}) = 2 × ${w + h} = ?`,
                        hint3: `Perimeter = 2 × ${w + h} = ${answer} feet`,
                        diagnose(userAnswer) {
                            if (userAnswer === w * h) return 'calculated-area';
                            if (userAnswer === w + h) return 'forgot-to-double';
                            return null;
                        },
                        misconceptionHints: {
                            'calculated-area': `🪩 That's the area! Perimeter is the distance AROUND the stage — like a dancer tracing the edge: 2 × (${w} + ${h}) = ${answer} ft. 💃`,
                            'forgot-to-double': `🎵 Almost there! You added width + height but a rectangle has TWO of each side. Multiply by 2: 2 × (${w} + ${h}) = ${answer} ft. 🕺`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🕺 Example:</strong> 6ft × 4ft rectangle</p><p>Perimeter = 2 × (6 + 4) = 2 × 10 = <strong>20 ft</strong> ✨</p><p>Think: a dancer walking all the way around the stage!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(34,211,238,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-cyan);">💃 Perimeter = walking around the edge!</p>
                            <p style="color:var(--dance-gold);">Top + Bottom + Left + Right = ${w} + ${w} + ${h} + ${h} = ${answer} ft ✨</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Find missing side given area
            {
                skillId: '4ap-missing-side-area',
                generate(diff, modality) {
                    const w = R(2, diff >= 2 ? 12 : 8);
                    const h = R(2, diff >= 2 ? 12 : 8);
                    const area = w * h;
                    // Ask for one side given the other and area
                    const askForW = Math.random() < 0.5;
                    const known = askForW ? h : w;
                    const answer = askForW ? w : h;

                    const result = {
                        type: 'input',
                        questionText: `🎵 A dance floor has area = ${area} sq ft. One side is ${known} ft.<br>How long is the other side?`,
                        visual: `<div style="text-align:center;font-size:1.4rem;font-weight:700;">
                            <span style="color:var(--dance-pink);">Area = ${area} sq ft</span><br>
                            <span style="color:var(--dance-cyan);">${known} ft × ? = ${area}</span>
                        </div>`,
                        answer,
                        hint1: `If Area = length × width, then missing side = Area ÷ known side`,
                        hint2: `${area} ÷ ${known} = ?`,
                        hint3: `${area} ÷ ${known} = ${answer} ft`,
                        diagnose(userAnswer) {
                            if (userAnswer === area - known) return 'subtracted-instead-of-divided';
                            if (userAnswer === area + known) return 'added-instead-of-divided';
                            if (userAnswer === area * known) return 'multiplied-instead-of-divided';
                            if (userAnswer === 2 * (area + known)) return 'used-perimeter-formula';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-instead-of-divided': `🎵 Close, but area uses multiplication! To undo multiplication you divide: ${area} ÷ ${known} = ${answer} ft. 💃`,
                            'added-instead-of-divided': `✨ Remember: Area = side × side. To find the missing side, divide: ${area} ÷ ${known} = ${answer} ft. 🕺`,
                            'multiplied-instead-of-divided': `🪩 You already know the area — no more multiplying needed! Divide to find the missing side: ${area} ÷ ${known} = ${answer} ft. 🎵`,
                            'used-perimeter-formula': `💃 This problem is about area, not perimeter! Area = side × side, so missing side = ${area} ÷ ${known} = ${answer} ft. ✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🎵 Example:</strong> Area = 24 sq ft, one side = 6 ft</p><p>Missing side = 24 ÷ 6 = <strong>4 ft</strong> 🪩</p><p>Think: Area ÷ known side = missing side!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(236,72,153,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-pink);">🎵 Undo the multiplication with division!</p>
                            <p style="color:var(--dance-gold);">${area} ÷ ${known} = <strong>${answer} ft</strong> ✨</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Find missing side given perimeter
            {
                skillId: '4ap-missing-side-perim',
                generate(diff, modality) {
                    const w = R(3, diff >= 2 ? 15 : 10);
                    const h = R(3, diff >= 2 ? 15 : 10);
                    const perim = 2 * (w + h);
                    const known = Math.random() < 0.5 ? w : h;
                    const answer = known === w ? h : w;
                    const halfPerim = perim / 2;

                    const result = {
                        type: 'input',
                        questionText: `🕺 A stage has perimeter = ${perim} ft. One side is ${known} ft.<br>What is the other side length?`,
                        visual: `<div style="text-align:center;font-size:1.4rem;font-weight:700;">
                            <span style="color:var(--dance-gold);">Perimeter = ${perim} ft</span><br>
                            <span style="color:var(--dance-purple);">2 × (${known} + ?) = ${perim}</span>
                        </div>`,
                        answer,
                        hint1: `Perimeter = 2 × (l + w). So l + w = ${perim} ÷ 2 = ${halfPerim}`,
                        hint2: `${halfPerim} − ${known} = ?`,
                        hint3: `The other side is ${answer} ft`,
                        diagnose(userAnswer) {
                            if (userAnswer === perim - known) return 'subtracted-from-full-perim';
                            if (userAnswer === perim / known) return 'divided-by-known';
                            if (userAnswer === known * perim) return 'multiplied-known-perim';
                            if (userAnswer === halfPerim) return 'forgot-to-subtract-known';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-from-full-perim': `🕺 Don't forget to halve the perimeter first! Step 1: ${perim} ÷ 2 = ${halfPerim}. Step 2: ${halfPerim} − ${known} = ${answer} ft. ✨`,
                            'divided-by-known': `🎵 Perimeter uses addition inside, not multiplication! Step 1: ${perim} ÷ 2 = ${halfPerim}. Step 2: ${halfPerim} − ${known} = ${answer} ft. 💃`,
                            'multiplied-known-perim': `🪩 Too many steps mixed up! Start here: ${perim} ÷ 2 = ${halfPerim}, then ${halfPerim} − ${known} = ${answer} ft. 🕺`,
                            'forgot-to-subtract-known': `✨ Great first step dividing by 2! Now subtract the known side: ${halfPerim} − ${known} = ${answer} ft. You're almost there! 🎵`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🕺 Example:</strong> Perimeter = 20 ft, one side = 6 ft</p><p>Step 1: 20 ÷ 2 = 10 (half perimeter)</p><p>Step 2: 10 − 6 = <strong>4 ft</strong> ✨</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(34,211,238,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-cyan);">🕺 Two steps to find the missing side!</p>
                            <p style="color:var(--dance-gold);">Step 1: ${perim} ÷ 2 = ${halfPerim}</p>
                            <p style="color:var(--dance-pink);">Step 2: ${halfPerim} − ${known} = <strong>${answer} ft</strong> ✨</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Area of L-shaped figure (decompose)
            {
                skillId: '4ap-composite-area',
                generate(diff, modality) {
                    // Two rectangles making an L
                    const w1 = R(3, 8);
                    const h1 = R(3, 8);
                    const w2 = R(2, w1 - 1);
                    const h2 = R(2, 6);
                    const area1 = w1 * h1;
                    const area2 = w2 * h2;
                    const answer = area1 + area2;

                    const result = {
                        type: 'input',
                        questionText: `🪩 A dance floor is L-shaped! Find the total area.<br>Top part: ${w1} × ${h1}. Bottom part: ${w2} × ${h2}.`,
                        visual: `<div style="text-align:center;">
                            <div style="display:inline-block;text-align:left;">
                                <div style="width:${w1 * 20}px;height:${h1 * 15}px;background:rgba(236,72,153,0.2);border:2px solid var(--dance-pink);border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--dance-pink);">${w1}×${h1}</div>
                                <div style="width:${w2 * 20}px;height:${h2 * 15}px;background:rgba(34,211,238,0.2);border:2px solid var(--dance-cyan);border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--dance-cyan);">${w2}×${h2}</div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Split it into two rectangles and find each area!`,
                        hint2: `Area 1: ${w1} × ${h1} = ${area1}. Area 2: ${w2} × ${h2} = ${area2}.`,
                        hint3: `Total = ${area1} + ${area2} = ${answer} sq units`,
                        diagnose(userAnswer) {
                            if (userAnswer === area1 - area2 || userAnswer === area2 - area1) return 'subtracted-areas';
                            if (userAnswer === area1 || userAnswer === area2) return 'only-one-rectangle';
                            if (userAnswer === (w1 + w2) * (h1 + h2)) return 'multiplied-all-sides';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-areas': `🎵 L-shapes combine both parts — add the areas, don't subtract! ${area1} + ${area2} = ${answer} sq units. 🪩`,
                            'only-one-rectangle': `💃 Don't forget the other part of the L! Add both rectangles: ${area1} + ${area2} = ${answer} sq units. 🕺`,
                            'multiplied-all-sides': `✨ The L-shape isn't one big rectangle! Split it: top (${w1}×${h1}=${area1}) + bottom (${w2}×${h2}=${area2}) = ${answer} sq units. 🎵`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Strategy:</strong> Split into rectangles!</p><p>Rectangle A: 6×4 = 24</p><p>Rectangle B: 3×2 = 6</p><p>Total: 24 + 6 = <strong>30 sq units</strong> 🪩</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(236,72,153,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-pink);">✨ Decompose the L into two rectangles!</p>
                            <p style="color:var(--dance-gold);">🟥 Part 1: ${w1} × ${h1} = ${area1}</p>
                            <p style="color:var(--dance-cyan);">🟦 Part 2: ${w2} × ${h2} = ${area2}</p>
                            <p style="color:var(--dance-pink);font-weight:700;">Total = ${area1} + ${area2} = ${answer} sq units 🪩</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Perimeter of irregular shape
            {
                skillId: '4ap-irregular-perim',
                generate(diff, modality) {
                    // Shape with all sides given
                    const sides = diff >= 2
                        ? [R(3, 10), R(3, 10), R(3, 10), R(3, 10), R(2, 6), R(2, 6)]
                        : [R(3, 10), R(3, 10), R(3, 10), R(3, 10)];
                    const answer = sides.reduce((a, b) => a + b, 0);
                    const partialSum = sides.slice(0, -1).reduce((a, b) => a + b, 0);

                    const result = {
                        type: 'input',
                        questionText: `🎤 Find the perimeter! Add ALL the sides:<br>${sides.join(' + ')} = ?`,
                        visual: `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                            ${sides.map((s, i) => `<div style="padding:8px 14px;background:rgba(${i % 2 === 0 ? '236,72,153' : '34,211,238'},0.15);border:2px solid var(--dance-${i % 2 === 0 ? 'pink' : 'cyan'});border-radius:8px;font-weight:700;color:var(--dance-${i % 2 === 0 ? 'pink' : 'cyan'});">${s}</div>`).join('<span style="align-self:center;color:var(--dance-gold);">+</span>')}
                        </div>`,
                        answer,
                        hint1: `Add all sides together one by one`,
                        hint2: `${sides.slice(0, -1).join(' + ')} = ${partialSum}, then + ${sides[sides.length - 1]}`,
                        hint3: `Perimeter = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === sides[0] * sides[1]) return 'multiplied-two-sides';
                            if (userAnswer === sides.length * sides[0]) return 'used-wrong-formula';
                            if (userAnswer === partialSum) return 'missed-last-side';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-two-sides': `🎤 Perimeter means ADD all the sides — not multiply! Try: ${sides.join(' + ')} = ${answer}. 💃`,
                            'used-wrong-formula': `✨ This shape isn't a regular rectangle — add each side individually: ${sides.join(' + ')} = ${answer}. 🕺`,
                            'missed-last-side': `🎵 So close! You forgot the last side (${sides[sides.length - 1]}). Add it: ${partialSum} + ${sides[sides.length - 1]} = ${answer}. 🪩`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🎤 Example:</strong> Sides: 5, 4, 3, 6</p><p>Perimeter = 5 + 4 + 3 + 6 = <strong>18</strong> ✨</p><p>Think: a dancer tracing every edge of the stage! 💃</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(34,211,238,0.08);border-radius:8px;">
                            <p style="font-weight:700;color:var(--dance-cyan);">🎤 Add EVERY side — don't skip any! ✨</p>
                            <p style="color:var(--dance-gold);">${sides.join(' + ')} = <strong>${answer}</strong> 🕺</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Area & Perimeter Boss
            {
                skillId: '4ap-boss',
                generate(diff, modality) {
                    const type = pick(['area', 'perimeter', 'both']);
                    const w = R(3, 12);
                    const h = R(3, 12);

                    if (type === 'area') {
                        const answer = w * h;
                        const result = {
                            type: 'input',
                            questionText: `🪩 DANCE FLOOR BOSS! Area of ${w} × ${h} rectangle?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🪩💃🕺🪩</div>`,
                            answer,
                            hint1: `Area = length × width`,
                            hint2: `${w} × ${h} = ?`,
                            hint3: `Area = ${answer} sq units`,
                            diagnose(userAnswer) {
                                if (userAnswer === 2 * (w + h)) return 'calculated-perimeter';
                                if (userAnswer === w + h) return 'added-sides';
                                return null;
                            },
                            misconceptionHints: {
                                'calculated-perimeter': `🪩 BOSS TIP: That's the perimeter! For area, multiply: ${w} × ${h} = ${answer} sq units. 💃`,
                                'added-sides': `✨ BOSS TIP: Area uses multiplication to fill the whole floor! ${w} × ${h} = ${answer} sq units. 🕺`
                            }
                        };
                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🪩 BOSS MOVE:</strong> Area = length × width</p><p>${w} × ${h} = <strong>${answer} sq units</strong> 💃✨</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(236,72,153,0.1);border-radius:8px;">
                                <p style="font-weight:700;color:var(--dance-pink);">🪩 Boss Formula: Area = length × width</p>
                                <p style="color:var(--dance-gold);">${w} × ${h} = <strong>${answer} sq units</strong> 💃</p>
                            </div>`;
                        }
                        return result;

                    } else if (type === 'perimeter') {
                        const answer = 2 * (w + h);
                        const result = {
                            type: 'input',
                            questionText: `🪩 DANCE FLOOR BOSS! Perimeter of ${w} × ${h} rectangle?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨🪩✨</div>`,
                            answer,
                            hint1: `Perimeter = 2 × (l + w)`,
                            hint2: `2 × (${w} + ${h}) = ?`,
                            hint3: `Perimeter = ${answer}`,
                            diagnose(userAnswer) {
                                if (userAnswer === w * h) return 'calculated-area';
                                if (userAnswer === w + h) return 'forgot-to-double';
                                return null;
                            },
                            misconceptionHints: {
                                'calculated-area': `🕺 BOSS TIP: That's the area! Perimeter goes around the edge: 2 × (${w} + ${h}) = ${answer}. ✨`,
                                'forgot-to-double': `🎵 BOSS TIP: A rectangle has TWO of each side! Multiply by 2: 2 × (${w} + ${h}) = ${answer}. 🪩`
                            }
                        };
                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>✨ BOSS MOVE:</strong> Perimeter = 2 × (l + w)</p><p>2 × (${w} + ${h}) = 2 × ${w + h} = <strong>${answer}</strong> 🕺🪩</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(34,211,238,0.1);border-radius:8px;">
                                <p style="font-weight:700;color:var(--dance-cyan);">✨ Boss Formula: Perimeter = 2 × (l + w)</p>
                                <p style="color:var(--dance-gold);">2 × (${w} + ${h}) = <strong>${answer}</strong> 🕺</p>
                            </div>`;
                        }
                        return result;

                    } else {
                        // Give area, one side, find other
                        const area = w * h;
                        const answer = h;
                        const result = {
                            type: 'input',
                            questionText: `🪩 DANCE FLOOR BOSS! Area = ${area} sq ft, width = ${w} ft. Find the length!`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎵🪩🎵</div>`,
                            answer,
                            hint1: `Area ÷ width = length`,
                            hint2: `${area} ÷ ${w} = ?`,
                            hint3: `Length = ${answer} ft`,
                            diagnose(userAnswer) {
                                if (userAnswer === area - w) return 'subtracted-instead-of-divided';
                                if (userAnswer === 2 * (area + w)) return 'used-perimeter-formula';
                                if (userAnswer === area * w) return 'multiplied-again';
                                return null;
                            },
                            misconceptionHints: {
                                'subtracted-instead-of-divided': `🎵 BOSS TIP: To undo multiplication, divide! ${area} ÷ ${w} = ${answer} ft. 🪩`,
                                'used-perimeter-formula': `💃 BOSS TIP: This is an area problem, not perimeter! Missing side = ${area} ÷ ${w} = ${answer} ft. ✨`,
                                'multiplied-again': `🕺 BOSS TIP: You already have the area — divide to find the missing side: ${area} ÷ ${w} = ${answer} ft. 🎵`
                            }
                        };
                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🎵 BOSS MOVE:</strong> Missing side = Area ÷ known side</p><p>${area} ÷ ${w} = <strong>${answer} ft</strong> 🪩💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:16px;text-align:center;padding:10px;background:rgba(236,72,153,0.1);border-radius:8px;">
                                <p style="font-weight:700;color:var(--dance-pink);">🎵 Boss Move: Area ÷ known side = missing side</p>
                                <p style="color:var(--dance-gold);">${area} ÷ ${w} = <strong>${answer} ft</strong> 🕺✨</p>
                            </div>`;
                        }
                        return result;
                    }
                }
            }
        ];
    }
};
