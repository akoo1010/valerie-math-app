/* ===== UNIT: PLANE FIGURES (4th Grade) — Dance Theme ✨ ===== */

const PlaneFigures4 = {
    id: '4-plane-figures',
    title: 'Plane Figures',
    icon: '✨',
    theme: 'dance',
    description: "Shapes take the stage! Identify lines of symmetry, classify triangles and quadrilaterals!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        return [
            // 1. Identify lines of symmetry
            {
                skillId: '4pf-symmetry',
                generate(diff, modality) {
                    const shapes = [
                        {name: 'square', lines: 4, emoji: '⬜'},
                        {name: 'rectangle', lines: 2, emoji: '▬'},
                        {name: 'equilateral triangle', lines: 3, emoji: '△'},
                        {name: 'circle', lines: 'infinite', emoji: '⭕'},
                        {name: 'regular hexagon', lines: 6, emoji: '⬡'},
                        {name: 'isosceles triangle', lines: 1, emoji: '△'},
                        {name: 'scalene triangle', lines: 0, emoji: '△'}
                    ];
                    const shape = pick(diff >= 2 ? shapes : shapes.slice(0, 4));
                    const answer = typeof shape.lines === 'number' ? shape.lines : 'infinite';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ How many lines of symmetry does a <strong>${shape.name}</strong> have?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:4rem;">${shape.emoji}</div>
                            <div style="font-weight:700;color:var(--dance-purple);margin-top:4px;">${shape.name}</div>
                        </div>`,
                        answer,
                        options: (() => {
                            // Build unique distractors near the answer, plus 0/1/'infinite' as common alternatives
                            const optMap = new Map();
                            const addOpt = (val, label) => { if (!optMap.has(val)) optMap.set(val, {label, value: val}); };
                            addOpt(answer, `${answer}`);
                            if (typeof shape.lines === 'number') {
                                for (const off of [1, 2, -1, -2, 3]) {
                                    const v = shape.lines + off;
                                    if (v >= 0) addOpt(v, `${v}`);
                                }
                            }
                            for (const v of [0, 1, 2, 'infinite']) addOpt(v, `${v}`);
                            return shuffle([...optMap.values()].slice(0, 4));
                        })(),
                        hint1: `A line of symmetry divides a shape into two matching halves`,
                        hint2: `Think about folding the ${shape.name} — how many ways can you fold it in half?`,
                        hint3: `A ${shape.name} has ${shape.lines} line${shape.lines !== 1 ? 's' : ''} of symmetry`,
                        diagnose(userAnswer) {
                            if (typeof shape.lines === 'number' && userAnswer === shape.lines + 2) return 'counted-diagonals-only';
                            if (typeof shape.lines === 'number' && shape.lines > 0 && userAnswer === 0) return 'thinks-no-symmetry';
                            return null;
                        },
                        misconceptionHints: {
                            'counted-diagonals-only': `💃 Great try! Remember: a line of symmetry can go in any direction — horizontal, vertical, OR diagonal. Count all the ways you can fold the shape perfectly in half!`,
                            'thinks-no-symmetry': `✨ Look again! If you could fold this shape in half so both sides match perfectly, that fold line is a line of symmetry. Try picturing folding the ${shape.name}!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Lines of Symmetry Step-by-Step:</strong></p><p>Step 1: Imagine folding the shape in half.</p><p>Step 2: If both halves match exactly, that fold is a line of symmetry.</p><p>Step 3: Count every direction you can fold it!</p><hr style="margin:8px 0;"><p>Square: 4 lines (vertical, horizontal, 2 diagonals)</p><p>Rectangle: 2 lines (vertical, horizontal)</p><p>Equilateral triangle: 3 lines</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(168,85,247,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-purple);">✨ Fold Test:</p><p style="margin:4px 0 0;font-size:0.9rem;">Imagine a dashed line through the center — do both sides mirror each other? That's a line of symmetry! 💃</p></div>`;
                    }

                    return result;
                }
            },
            // 2. Classify triangles by sides
            {
                skillId: '4pf-triangle-sides',
                generate(diff, modality) {
                    const types = [
                        {name: 'equilateral', desc: 'all 3 sides equal', sides: [5, 5, 5]},
                        {name: 'isosceles', desc: '2 sides equal', sides: [5, 5, 3]},
                        {name: 'scalene', desc: 'no sides equal', sides: [3, 4, 5]}
                    ];
                    const type = pick(types);
                    const answer = type.name;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `💃 A triangle has sides of ${type.sides[0]}, ${type.sides[1]}, and ${type.sides[2]} units.<br>What type of triangle is it?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:3rem;">△</div>
                            <div style="display:flex;gap:12px;justify-content:center;margin-top:8px;">
                                ${type.sides.map((s, i) => `<div style="padding:6px 12px;background:rgba(${i === 0 ? '236,72,153' : i === 1 ? '34,211,238' : '251,191,36'},0.15);border:2px solid var(--dance-${i === 0 ? 'pink' : i === 1 ? 'cyan' : 'gold'});border-radius:8px;font-weight:700;color:var(--dance-${i === 0 ? 'pink' : i === 1 ? 'cyan' : 'gold'});">${s}</div>`).join('')}
                            </div>
                        </div>`,
                        answer,
                        options: [
                            {label: 'Equilateral (all equal)', value: 'equilateral'},
                            {label: 'Isosceles (2 equal)', value: 'isosceles'},
                            {label: 'Scalene (none equal)', value: 'scalene'}
                        ],
                        hint1: `Count how many sides are the same length`,
                        hint2: `${type.sides[0]}, ${type.sides[1]}, ${type.sides[2]} — ${type.desc}`,
                        hint3: `This is an ${type.name} triangle (${type.desc})`,
                        diagnose(userAnswer) {
                            if (type.name === 'isosceles' && userAnswer === 'equilateral') return 'confused-isosceles-equilateral';
                            if (type.name === 'scalene' && userAnswer === 'isosceles') return 'miscount-scalene-sides';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-isosceles-equilateral': `🕺 Close! Equilateral means ALL 3 sides are equal. Isosceles means exactly 2 sides are equal — the third side is different. Check those side lengths again!`,
                            'miscount-scalene-sides': `✨ Nice try! Look carefully at all three numbers. If even two of them matched, it would be isosceles. But scalene means NONE of the sides are the same length. 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Classify Triangles by Sides:</strong></p><p>Step 1: List the three side lengths.</p><p>Step 2: Count how many sides are equal.</p><p>Step 3: All 3 equal → Equilateral | Exactly 2 equal → Isosceles | None equal → Scalene</p><hr style="margin:8px 0;"><p>Example: 5, 5, 5 → Equilateral ✨</p><p>Example: 5, 5, 3 → Isosceles 💃</p><p>Example: 3, 4, 5 → Scalene 🕺</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(236,72,153,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-pink);">🎵 Side Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Compare the three colored numbers above. Are any of them the same? Count the matches to find the triangle type! ✨</p></div>`;
                    }

                    return result;
                }
            },
            // 3. Classify triangles by angles
            {
                skillId: '4pf-triangle-angles',
                generate(diff, modality) {
                    const types = [
                        {name: 'acute', desc: 'all angles < 90°', angles: [60, 60, 60]},
                        {name: 'right', desc: 'one angle = 90°', angles: [90, 45, 45]},
                        {name: 'obtuse', desc: 'one angle > 90°', angles: [120, 30, 30]}
                    ];
                    const type = pick(types);
                    const answer = type.name;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎵 A triangle has angles of ${type.angles[0]}°, ${type.angles[1]}°, and ${type.angles[2]}°.<br>What type of triangle?`,
                        visual: `<div style="display:flex;gap:10px;justify-content:center;">
                            ${type.angles.map((a, i) => `<div style="padding:8px 14px;background:rgba(168,85,247,0.15);border:2px solid var(--dance-purple);border-radius:8px;font-weight:700;color:var(--dance-purple);">${a}°</div>`).join('')}
                        </div>`,
                        answer,
                        options: [
                            {label: 'Acute (all < 90°)', value: 'acute'},
                            {label: 'Right (has 90°)', value: 'right'},
                            {label: 'Obtuse (has > 90°)', value: 'obtuse'}
                        ],
                        hint1: `Look at each angle — is any one 90° or larger?`,
                        hint2: `${type.desc}`,
                        hint3: `This is ${type.name === 'acute' ? 'an' : 'a'} ${type.name} triangle`,
                        diagnose(userAnswer) {
                            if (type.name === 'obtuse' && userAnswer === 'right') return 'confused-obtuse-right';
                            if (type.name === 'acute' && userAnswer === 'right') return 'thinks-any-angle-is-right';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-obtuse-right': `💃 A right triangle has an angle of exactly 90°. An obtuse triangle has an angle that is MORE than 90° — like ${type.angles[0]}°. Look at each angle carefully!`,
                            'thinks-any-angle-is-right': `🪩 A right angle is exactly 90° — like the corner of a square. If all the angles are less than 90°, it's an acute triangle. Check: are any of these angles exactly 90°? ✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🎵 Classify Triangles by Angles:</strong></p><p>Step 1: Look at the largest angle.</p><p>Step 2: Is it less than 90°? → Acute</p><p>Step 3: Is it exactly 90°? → Right</p><p>Step 4: Is it greater than 90°? → Obtuse</p><hr style="margin:8px 0;"><p>Example: 60°, 60°, 60° → Acute ✨</p><p>Example: 90°, 45°, 45° → Right 💃</p><p>Example: 120°, 30°, 30° → Obtuse 🕺</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(168,85,247,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-purple);">🎵 Angle Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Find the BIGGEST angle above. Compare it to 90° (a square corner). Smaller → Acute | Equal → Right | Bigger → Obtuse! 💃</p></div>`;
                    }

                    return result;
                }
            },
            // 4. Classify quadrilaterals
            {
                skillId: '4pf-quadrilaterals',
                generate(diff, modality) {
                    const quads = [
                        {name: 'square', properties: '4 equal sides, 4 right angles', emoji: '⬜'},
                        {name: 'rectangle', properties: 'opposite sides equal, 4 right angles', emoji: '▬'},
                        {name: 'rhombus', properties: '4 equal sides, opposite angles equal', emoji: '◆'},
                        {name: 'parallelogram', properties: 'opposite sides parallel and equal', emoji: '▰'},
                        {name: 'trapezoid', properties: 'exactly 1 pair of parallel sides', emoji: '⏢'}
                    ];
                    const quad = pick(diff >= 2 ? quads : quads.slice(0, 3));
                    const answer = quad.name;
                    // Build options ensuring the correct shape is always included
                    const distractorPool = quads.filter(q => q.name !== quad.name);
                    const distractors = shuffle(distractorPool).slice(0, (diff >= 2 ? 4 : 3) - 1);
                    const optionShapes = shuffle([quad, ...distractors]);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🕺 What shape has these properties?<br><em>${quad.properties}</em>`,
                        visual: `<div style="text-align:center;font-size:4rem;">${quad.emoji}</div>`,
                        answer,
                        options: optionShapes.map(q => ({label: q.name.charAt(0).toUpperCase() + q.name.slice(1), value: q.name})),
                        hint1: `Think about the sides and angles described`,
                        hint2: `"${quad.properties}" — which shape matches?`,
                        hint3: `A ${quad.name}: ${quad.properties}`,
                        diagnose(userAnswer) {
                            if ((quad.name === 'square' || quad.name === 'rhombus') && userAnswer === (quad.name === 'square' ? 'rhombus' : 'square')) return 'confused-square-rhombus';
                            if ((quad.name === 'square' || quad.name === 'rectangle') && userAnswer === (quad.name === 'square' ? 'rectangle' : 'square')) return 'confused-square-rectangle';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-square-rhombus': `✨ Both a square and a rhombus have 4 equal sides — but the key difference is angles! A square has 4 right angles (90°). A rhombus has angles that can be any size. Check the angle clue! 💃`,
                            'confused-square-rectangle': `🕺 Both shapes have 4 right angles — great noticing! But a square has ALL 4 sides equal, while a rectangle only has OPPOSITE sides equal. Does the description say "4 equal sides"? ✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🕺 Quadrilateral Guide:</strong></p><p>Step 1: Count equal sides. Step 2: Check for right angles. Step 3: Check parallel sides.</p><hr style="margin:8px 0;"><p>Square: 4 equal sides + 4 right angles ⬜</p><p>Rectangle: opposite sides equal + 4 right angles ▬</p><p>Rhombus: 4 equal sides, angles vary ◆</p><p>Parallelogram: opposite sides parallel ▰</p><p>Trapezoid: exactly 1 pair parallel ⏢</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🕺 Property Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Read the clue carefully: Are all sides equal? Are there right angles? Are sides parallel? Match those clues to the shape! ✨</p></div>`;
                    }

                    return result;
                }
            },
            // 5. Parallel and perpendicular lines
            {
                skillId: '4pf-lines',
                generate(diff, modality) {
                    const types = [
                        {name: 'parallel', desc: 'Lines that never cross and stay the same distance apart', symbol: '∥'},
                        {name: 'perpendicular', desc: 'Lines that cross at a 90° angle (right angle)', symbol: '⊥'},
                        {name: 'intersecting', desc: 'Lines that cross but NOT at 90°', symbol: '✕'}
                    ];
                    const type = pick(diff >= 2 ? types : types.slice(0, 2));
                    const answer = type.name;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ What type of lines? <em>"${type.desc}"</em>`,
                        visual: `<div style="text-align:center;font-size:4rem;color:var(--dance-gold);">${type.symbol}</div>`,
                        answer,
                        options: types.map(t => ({label: `${t.name.charAt(0).toUpperCase() + t.name.slice(1)} (${t.symbol})`, value: t.name})),
                        hint1: `Do the lines cross? If yes, at what angle?`,
                        hint2: `${type.desc}`,
                        hint3: `These are ${type.name} lines`,
                        diagnose(userAnswer) {
                            if (type.name === 'parallel' && userAnswer === 'perpendicular') return 'confused-parallel-perpendicular';
                            if (type.name === 'perpendicular' && userAnswer === 'intersecting') return 'confused-perpendicular-intersecting';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-parallel-perpendicular': `💃 Parallel lines NEVER cross — they run side by side forever like train tracks! Perpendicular lines DO cross, but at a perfect 90° right angle. Do these lines cross at all? ✨`,
                            'confused-perpendicular-intersecting': `🪩 Both perpendicular and intersecting lines cross — but there's a key difference! Perpendicular lines cross at EXACTLY 90° (a perfect square corner). Intersecting lines cross at any other angle. Does it form a right angle? 🕺`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>✨ Types of Lines:</strong></p><p>Step 1: Do the lines cross? If NO → Parallel (∥)</p><p>Step 2: If YES, check the angle.</p><p>Step 3: Exactly 90°? → Perpendicular (⊥)</p><p>Step 4: Any other angle? → Intersecting (✕)</p><hr style="margin:8px 0;"><p>💃 Think of a + sign → Perpendicular!</p><p>🕺 Think of railroad tracks → Parallel!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(34,211,238,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-cyan);">✨ Line Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Look at the symbol above. Do the lines meet? If the corner looks like a square corner (90°), it's perpendicular. If they never meet, it's parallel! 💃</p></div>`;
                    }

                    return result;
                }
            },
            // 6. Draw / identify shapes with given properties
            {
                skillId: '4pf-properties',
                generate(diff, modality) {
                    const questions = [
                        {q: 'How many sides does a hexagon have?', a: 6, hint: 'Hex = 6 in Latin'},
                        {q: 'How many sides does a pentagon have?', a: 5, hint: 'Pent = 5 (like the Pentagon building)'},
                        {q: 'How many sides does an octagon have?', a: 8, hint: 'Oct = 8 (like an octopus!)'},
                        {q: 'How many angles does a triangle have?', a: 3, hint: 'Tri = 3 (tricycle has 3 wheels)'},
                        {q: 'How many right angles does a rectangle have?', a: 4, hint: 'All 4 corners are right angles'},
                        {q: 'How many pairs of parallel sides does a parallelogram have?', a: 2, hint: 'Both pairs of opposite sides are parallel'}
                    ];
                    const selected = pick(diff >= 2 ? questions : questions.slice(0, 4));

                    const result = {
                        type: 'input',
                        questionText: `🎵 Shape quiz! ${selected.q}`,
                        visual: `<div style="font-size:3rem;text-align:center;">✨🔷✨</div>`,
                        answer: selected.a,
                        hint1: `Think about the shape — count carefully!`,
                        hint2: selected.hint,
                        hint3: `The answer is ${selected.a}`,
                        diagnose(userAnswer) {
                            const num = Number(userAnswer);
                            if (num === selected.a - 1 || num === selected.a + 1) return 'off-by-one';
                            if (selected.a === 6 && num === 8) return 'mixed-up-polygon-names';
                            if (selected.a === 8 && num === 6) return 'mixed-up-polygon-names';
                            return null;
                        },
                        misconceptionHints: {
                            'off-by-one': `💃 So close! Remember the prefix is your clue: tri=3, quad=4, pent=5, hex=6, oct=8. ${selected.hint}. Try once more! ✨`,
                            'mixed-up-polygon-names': `🪩 Easy mix-up! Hexagon (hex=6) and Octagon (oct=8) sound similar but are different. Think of an octopus — it has 8 arms, just like an octagon has 8 sides! 🐙✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>🎵 Shape Properties:</strong></p><p>Step 1: Look at the prefix of the shape name.</p><p>Step 2: Match it to the number!</p><hr style="margin:8px 0;"><p>tri = 3 → Triangle (3 sides) 🔺</p><p>quad = 4 → Quadrilateral (4 sides) ⬜</p><p>pent = 5 → Pentagon (5 sides) ⭐</p><p>hex = 6 → Hexagon (6 sides) ⬡</p><p>oct = 8 → Octagon (8 sides) 🛑</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🎵 Prefix Power:</p><p style="margin:4px 0 0;font-size:0.9rem;"><strong>tri</strong>=3 | <strong>quad</strong>=4 | <strong>pent</strong>=5 | <strong>hex</strong>=6 | <strong>oct</strong>=8</p><p style="margin:4px 0 0;font-size:0.9rem;">Find the prefix in the shape name to get your answer! 💃</p></div>`;
                    }

                    return result;
                }
            },
            // 7. Plane Figures Boss
            {
                skillId: '4pf-boss',
                generate(diff, modality) {
                    const type = pick(['symmetry', 'triangle', 'quad']);

                    if (type === 'symmetry') {
                        const shapes = [{name: 'square', lines: 4}, {name: 'rectangle', lines: 2}, {name: 'equilateral triangle', lines: 3}];
                        const s = pick(shapes);

                        const result = {
                            type: 'multiple-choice',
                            questionText: `✨ SHAPE BOSS! Lines of symmetry in a ${s.name}?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨💃✨</div>`,
                            answer: s.lines,
                            options: shuffle([{label: `${s.lines}`, value: s.lines}, {label: `${s.lines + 1}`, value: s.lines + 1}, {label: `${Math.max(0, s.lines - 1)}`, value: Math.max(0, s.lines - 1)}, {label: `${s.lines + 2}`, value: s.lines + 2}]),
                            hint1: `Fold the ${s.name} — how many ways?`,
                            hint2: `A ${s.name} has ${s.lines} line(s) of symmetry`,
                            hint3: `${s.lines}`,
                            diagnose(userAnswer) {
                                if (Number(userAnswer) === s.lines + 1 || Number(userAnswer) === s.lines + 2) return 'overcounted-symmetry';
                                if (Number(userAnswer) === Math.max(0, s.lines - 1)) return 'undercounted-symmetry';
                                return null;
                            },
                            misconceptionHints: {
                                'overcounted-symmetry': `💃 You counted a little too many! Remember, each line of symmetry must fold the shape into TWO perfectly matching halves. A ${s.name} has exactly ${s.lines} — try counting each direction again! ✨`,
                                'undercounted-symmetry': `🪩 You're close — just missed one or more! Don't forget to check ALL directions: horizontal, vertical, and diagonal lines. A ${s.name} has ${s.lines} line(s) of symmetry. 🕺`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>✨ BOSS: Lines of Symmetry</strong></p><p>Step 1: Picture folding the ${s.name} in half.</p><p>Step 2: Count every direction that creates matching halves.</p><p>Step 3: Horizontal ➕ Vertical ➕ Diagonals = total lines!</p><hr style="margin:8px 0;"><p>A ${s.name} has <strong>${s.lines}</strong> line(s) of symmetry 💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(168,85,247,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-purple);">✨ Boss Tip:</p><p style="margin:4px 0 0;font-size:0.9rem;">Try all 4 directions: ↕ ↔ ↗ ↘ — which ones create matching halves for a ${s.name}? 💃</p></div>`;
                        }

                        return result;

                    } else if (type === 'triangle') {
                        const types = [{name: 'equilateral', sides: [6, 6, 6]}, {name: 'isosceles', sides: [7, 7, 4]}, {name: 'scalene', sides: [3, 5, 7]}];
                        const t = pick(types);

                        const result = {
                            type: 'multiple-choice',
                            questionText: `✨ SHAPE BOSS! Sides: ${t.sides.join(', ')} — what triangle?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🔺✨🔺</div>`,
                            answer: t.name,
                            options: [{label: 'Equilateral', value: 'equilateral'}, {label: 'Isosceles', value: 'isosceles'}, {label: 'Scalene', value: 'scalene'}],
                            hint1: `How many sides are equal?`,
                            hint2: `${t.name}: ${t.sides.join(', ')}`,
                            hint3: `${t.name}`,
                            diagnose(userAnswer) {
                                if (t.name === 'isosceles' && userAnswer === 'equilateral') return 'confused-iso-equil';
                                if (t.name === 'scalene' && userAnswer === 'isosceles') return 'confused-scalene-iso';
                                return null;
                            },
                            misconceptionHints: {
                                'confused-iso-equil': `🕺 Almost! Equilateral means ALL 3 sides match. Isosceles means only 2 sides are the same — look at ${t.sides.join(', ')} again. Are all three numbers equal? ✨`,
                                'confused-scalene-iso': `💃 Check all three sides carefully: ${t.sides.join(', ')}. Isosceles needs at least 2 matching numbers. Scalene means NO sides are equal. Are any two of these numbers the same? 🎵`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🔺 BOSS: Triangle Sides</strong></p><p>Step 1: Compare the side numbers.</p><p>Step 2: Count equal sides.</p><p>All 3 equal → Equilateral | 2 equal → Isosceles | None equal → Scalene</p><hr style="margin:8px 0;"><p>Example: ${t.sides.join(', ')} → <strong>${t.name}</strong> 💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(236,72,153,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-pink);">🔺 Boss Tip:</p><p style="margin:4px 0 0;font-size:0.9rem;">Sides: <strong>${t.sides.join(', ')}</strong> — circle the matching numbers! Count your matches to name the triangle. ✨</p></div>`;
                        }

                        return result;

                    } else {
                        const quads = [{name: 'square', prop: '4 equal sides + 4 right angles'}, {name: 'rectangle', prop: 'opposite sides equal + 4 right angles'}, {name: 'rhombus', prop: '4 equal sides, angles vary'}];
                        const q = pick(quads);

                        const result = {
                            type: 'multiple-choice',
                            questionText: `✨ SHAPE BOSS! "${q.prop}" — what shape?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🕺✨🕺</div>`,
                            answer: q.name,
                            options: quads.map(x => ({label: x.name.charAt(0).toUpperCase() + x.name.slice(1), value: x.name})),
                            hint1: `Think: sides and angles`,
                            hint2: `${q.prop}`,
                            hint3: `${q.name}`,
                            diagnose(userAnswer) {
                                if ((q.name === 'square' || q.name === 'rhombus') && userAnswer === (q.name === 'square' ? 'rhombus' : 'square')) return 'square-vs-rhombus';
                                if ((q.name === 'square' || q.name === 'rectangle') && userAnswer === (q.name === 'square' ? 'rectangle' : 'square')) return 'square-vs-rectangle';
                                return null;
                            },
                            misconceptionHints: {
                                'square-vs-rhombus': `🪩 Both have 4 equal sides — nice catch! But the difference is angles. A square has 4 right angles (perfect corners). A rhombus has angles that tilt. Does the clue mention right angles? 💃`,
                                'square-vs-rectangle': `✨ Both have 4 right angles — good thinking! The key: a square has ALL 4 sides equal. A rectangle only needs OPPOSITE sides equal. Read the clue again carefully! 🕺`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🕺 BOSS: Quadrilaterals</strong></p><p>Step 1: Check if all 4 sides are equal.</p><p>Step 2: Check for right angles.</p><p>4 equal sides + right angles → Square ⬜</p><p>Opposite sides equal + right angles → Rectangle ▬</p><p>4 equal sides + no right angles → Rhombus ◆</p><hr style="margin:8px 0;"><p>Clue: "${q.prop}" → <strong>${q.name}</strong> 💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🕺 Boss Tip:</p><p style="margin:4px 0 0;font-size:0.9rem;">Two questions: (1) Are all 4 sides equal? (2) Are there right angles? Your answers point to the shape! ✨</p></div>`;
                        }

                        return result;
                    }
                }
            }
        ];
    }
};
