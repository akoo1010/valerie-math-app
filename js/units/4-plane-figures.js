/* ===== UNIT: PLANE FIGURES (4th Grade) — Dance Theme ✨ ===== */

const PlaneFigures4 = {
    id: '4-plane-figures',
    title: 'Plane Figures',
    icon: '✨',
    theme: 'dance',
    description: "Shapes take the stage! Identify lines of symmetry, classify triangles and quadrilaterals!",
    exerciseCount: 7,

    getExercises() {
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;
        // "an equilateral triangle", "a square"
        const article = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';
        const Article = (word) => /^[aeiou]/i.test(word) ? 'An' : 'A';
        // Drawn triangles so each type looks like its name (a single △ glyph looked equilateral for all three)
        const triSvg = (points) => `<svg viewBox="0 0 100 90" width="90" height="81" style="vertical-align:middle;"><polygon points="${points}" fill="rgba(168,85,247,0.15)" stroke="var(--dance-purple)" stroke-width="4" stroke-linejoin="round"/></svg>`;
        const TRIANGLE_SVG = {
            equilateral: triSvg('50,5 96,85 4,85'),
            isosceles: triSvg('50,4 74,86 26,86'),
            scalene: triSvg('10,84 90,84 26,20')
        };
        // A rhombus with no right angles (the ◆ glyph is a square turned on its corner)
        const rhombusSvg = (w, h) => `<svg viewBox="0 0 70 100" width="${w}" height="${h}" style="vertical-align:middle;"><polygon points="35,4 66,50 35,96 4,50" fill="rgba(251,191,36,0.2)" stroke="var(--dance-gold)" stroke-width="4" stroke-linejoin="round"/></svg>`;

        return [
            // 1. Identify lines of symmetry
            {
                skillId: '4pf-symmetry',
                generate(diff, modality) {
                    const shapes = [
                        {name: 'square', lines: 4, emoji: '⬜'},
                        {name: 'rectangle', lines: 2, emoji: '▬'},
                        {name: 'equilateral triangle', lines: 3, emoji: TRIANGLE_SVG.equilateral},
                        {name: 'circle', lines: 'infinite', emoji: '⭕'},
                        {name: 'regular hexagon', lines: 6, emoji: '⬡'},
                        {name: 'isosceles triangle', lines: 1, emoji: TRIANGLE_SVG.isosceles},
                        {name: 'scalene triangle', lines: 0, emoji: TRIANGLE_SVG.scalene}
                    ];
                    const shape = pick(diff >= 2 ? shapes : shapes.slice(0, 4));
                    const answer = typeof shape.lines === 'number' ? shape.lines : 'infinite';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ How many lines of symmetry does ${article(shape.name)} <strong>${shape.name}</strong> have?`,
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
                        hint3: `${Article(shape.name)} ${shape.name} has ${shape.lines} line${shape.lines !== 1 ? 's' : ''} of symmetry`,
                        diagnose(userAnswer) {
                            // Too many lines: usually counting folds that don't make matching halves (like a rectangle's diagonals)
                            if (typeof shape.lines === 'number' && typeof userAnswer === 'number' && userAnswer > shape.lines) return 'overcounted-symmetry';
                            if (typeof shape.lines === 'number' && shape.lines > 0 && userAnswer === 0) return 'thinks-no-symmetry';
                            return null;
                        },
                        misconceptionHints: {
                            'overcounted-symmetry': `💃 Careful — not every fold works! A fold only counts if the two halves match EXACTLY.${shape.name === 'rectangle' ? ' Folding a rectangle corner-to-corner (along a diagonal) does NOT make matching halves!' : ''} Test each fold line again!`,
                            'thinks-no-symmetry': `✨ Look again! If you could fold this shape in half so both sides match perfectly, that fold line is a line of symmetry. Try picturing folding the ${shape.name}!`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Skip the example for the shape being asked about
                        const examples = [
                            {name: 'square', text: 'Square: 4 lines (vertical, horizontal, 2 diagonals)'},
                            {name: 'rectangle', text: 'Rectangle: 2 lines (vertical, horizontal)'},
                            {name: 'equilateral triangle', text: 'Equilateral triangle: 3 lines'}
                        ].filter(e => e.name !== shape.name);
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Lines of Symmetry Step-by-Step:</strong></p><p>Step 1: Imagine folding the shape in half.</p><p>Step 2: If both halves match exactly, that fold is a line of symmetry.</p><p>Step 3: Count every direction you can fold it!</p><hr style="margin:8px 0;">${examples.map(e => `<p>${e.text}</p>`).join('')}</div>`;
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
                            <div>${TRIANGLE_SVG[type.name]}</div>
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
                        hint2: `Compare the sides in pairs: is ${type.sides[0]} = ${type.sides[1]}? Is ${type.sides[1]} = ${type.sides[2]}? Is ${type.sides[0]} = ${type.sides[2]}? Count how many sides match.`,
                        hint3: `This is ${article(type.name)} ${type.name} triangle (${type.desc})`,
                        diagnose(userAnswer) {
                            if (type.name === 'isosceles' && userAnswer === 'equilateral') return 'confused-isosceles-equilateral';
                            if (type.name === 'scalene' && userAnswer === 'isosceles') return 'miscount-scalene-sides';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-isosceles-equilateral': `🕺 Close! Equilateral means ALL 3 sides are equal. Isosceles means exactly 2 sides are equal — the third side is different. Check those side lengths again!`,
                            'miscount-scalene-sides': `✨ Nice try! Look carefully at all three numbers. If even two of them matched, it would be isosceles — do any two match? If NONE of the sides are the same length, it's scalene. 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        // The examples use the same side lengths as the questions, so skip this question's one
                        const examples = [
                            {name: 'equilateral', text: 'Example: 5, 5, 5 → Equilateral ✨'},
                            {name: 'isosceles', text: 'Example: 5, 5, 3 → Isosceles 💃'},
                            {name: 'scalene', text: 'Example: 3, 4, 5 → Scalene 🕺'}
                        ].filter(e => e.name !== type.name);
                        // Just one of the other two: listing both leaves the answer as the only type without an example
                        examples.splice(Engine.Utils.rand(0, 1), 1);
                        result.workedExample = `<div style="text-align:center"><p><strong>💃 Classify Triangles by Sides:</strong></p><p>Step 1: List the three side lengths.</p><p>Step 2: Count how many sides are equal.</p><p>Step 3: All 3 equal → Equilateral | Exactly 2 equal → Isosceles | None equal → Scalene</p><hr style="margin:8px 0;">${examples.map(e => `<p>${e.text}</p>`).join('')}</div>`;
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
                        hint2: `Find the biggest angle of ${type.angles[0]}°, ${type.angles[1]}°, and ${type.angles[2]}°. Is it less than 90°, exactly 90°, or more than 90°?`,
                        hint3: `This is ${article(type.name)} ${type.name} triangle`,
                        diagnose(userAnswer) {
                            if (type.name === 'obtuse' && userAnswer === 'right') return 'confused-obtuse-right';
                            if (type.name === 'acute' && userAnswer === 'right') return 'thinks-any-angle-is-right';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-obtuse-right': `💃 A right triangle has an angle of exactly 90°. An obtuse triangle has an angle that is MORE than 90°. Is any angle here exactly 90° — or bigger? Look at each angle carefully!`,
                            'thinks-any-angle-is-right': `🪩 A right angle is exactly 90° — like the corner of a square. If all the angles are less than 90°, it's an acute triangle. Check: are any of these angles exactly 90°? ✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        // The examples use the same angles as the questions, so skip this question's one
                        const examples = [
                            {name: 'acute', text: 'Example: 60°, 60°, 60° → Acute ✨'},
                            {name: 'right', text: 'Example: 90°, 45°, 45° → Right 💃'},
                            {name: 'obtuse', text: 'Example: 120°, 30°, 30° → Obtuse 🕺'}
                        ].filter(e => e.name !== type.name);
                        // Just one of the other two: listing both leaves the answer as the only type without an example
                        examples.splice(Engine.Utils.rand(0, 1), 1);
                        result.workedExample = `<div style="text-align:center"><p><strong>🎵 Classify Triangles by Angles:</strong></p><p>Step 1: Look at the largest angle.</p><p>Step 2: Is it less than 90°? → Acute</p><p>Step 3: Is it exactly 90°? → Right</p><p>Step 4: Is it greater than 90°? → Obtuse</p><hr style="margin:8px 0;">${examples.map(e => `<p>${e.text}</p>`).join('')}</div>`;
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
                    // No picture of the shape — she'd name it on sight and skip the property clue
                    const quads = [
                        {name: 'square', properties: '4 equal sides and 4 right angles'},
                        {name: 'rectangle', properties: 'opposite sides equal and 4 right angles, but not all 4 sides equal'},
                        {name: 'rhombus', properties: '4 equal sides but no right angles'},
                        {name: 'parallelogram', properties: '2 pairs of parallel sides, with no right angles and not all sides equal'},
                        {name: 'trapezoid', properties: 'exactly 1 pair of parallel sides'}
                    ];
                    const quad = pick(diff >= 2 ? quads : quads.slice(0, 3));
                    const answer = quad.name;
                    // Build options ensuring the correct shape is always included
                    // A rhombus IS a parallelogram, so don't offer Parallelogram against the rhombus clue
                    const distractorPool = quads.filter(q => q.name !== quad.name && !(quad.name === 'rhombus' && q.name === 'parallelogram'));
                    const distractors = shuffle(distractorPool).slice(0, (diff >= 2 ? 4 : 3) - 1);
                    const optionShapes = shuffle([quad, ...distractors]);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🕺 What shape has these properties?<br><em>${quad.properties}</em>`,
                        visual: `<div style="font-size:3rem;text-align:center;">🕺✨🕺</div>`,
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
                        // Two of the OTHER shapes, at least one not offered as an option, so the guide neither
                        // states the answer nor leaves it as the only option without a rule
                        const others = [
                            {name: 'square', text: 'Square: 4 equal sides + 4 right angles ⬜'},
                            {name: 'rectangle', text: 'Rectangle: opposite sides equal + 4 right angles, but not all 4 sides equal ▬'},
                            {name: 'rhombus', text: `Rhombus: 4 equal sides but no right angles ${rhombusSvg(14, 20)}`},
                            {name: 'parallelogram', text: 'Parallelogram: opposite sides parallel ▰'},
                            {name: 'trapezoid', text: 'Trapezoid: exactly 1 pair parallel ⏢'}
                        ].filter(g => g.name !== quad.name);
                        const offStage = pick(others.filter(g => !optionShapes.some(o => o.name === g.name)));
                        const second = pick(others.filter(g => g !== offStage));
                        const guide = others.filter(g => g === offStage || g === second);
                        result.workedExample = `<div style="text-align:center"><p><strong>🕺 Quadrilateral Guide:</strong></p><p>Step 1: Count equal sides. Step 2: Check for right angles. Step 3: Check parallel sides.</p><hr style="margin:8px 0;">${guide.map(g => `<p>${g.text}</p>`).join('')}</div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🕺 Property Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Read the clue carefully: Are all sides equal? Are there right angles? Are sides parallel? Match those clues to one of the shape names! ✨</p></div>`;
                    }

                    return result;
                }
            },
            // 5. Parallel and perpendicular lines
            {
                skillId: '4pf-lines',
                generate(diff, modality) {
                    // Drawn lines: the ✕ glyph crosses at 90°, which is perpendicular, not "intersecting (not 90°)"
                    const lineSvg = (inner) => `<svg viewBox="0 0 120 100" width="120" height="100" stroke="var(--dance-gold)" stroke-width="5" stroke-linecap="round" fill="none">${inner}</svg>`;
                    const types = [
                        {name: 'parallel', desc: 'Lines that never cross and stay the same distance apart', label: 'Parallel (∥)',
                            drawing: lineSvg('<line x1="10" y1="30" x2="110" y2="30"/><line x1="10" y1="70" x2="110" y2="70"/>')},
                        {name: 'perpendicular', desc: 'Lines that cross at a 90° angle (right angle)', label: 'Perpendicular (⊥)',
                            drawing: lineSvg('<line x1="60" y1="6" x2="60" y2="94"/><line x1="10" y1="50" x2="110" y2="50"/><polyline points="60,38 72,38 72,50" stroke-width="2"/>')},
                        {name: 'intersecting', desc: 'Lines that cross but NOT at 90°', label: 'Intersecting (not at 90°)',
                            drawing: lineSvg('<line x1="10" y1="68" x2="110" y2="32"/><line x1="10" y1="32" x2="110" y2="68"/>')}
                    ];
                    const type = pick(diff >= 2 ? types : types.slice(0, 2));
                    const answer = type.name;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ What type of lines? <em>"${type.desc}"</em>`,
                        visual: `<div style="text-align:center;">${type.drawing}</div>`,
                        answer,
                        options: types.map(t => ({label: t.label, value: t.name})),
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
                            'confused-perpendicular-intersecting': `🪩 Good eye — perpendicular lines DO intersect! But they're the special kind that cross at EXACTLY 90° (a perfect square corner), so they get their own name. The "Intersecting (not at 90°)" choice is for lines crossing at any other angle. Does this one make a right angle? 🕺`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>✨ Types of Lines:</strong></p><p>Step 1: Do the lines cross? If NO → Parallel (∥)</p><p>Step 2: If YES, check the angle.</p><p>Step 3: Exactly 90°? → Perpendicular (⊥)</p><p>Step 4: Any other angle? → Intersecting (not at 90°)</p><hr style="margin:8px 0;"><p>💃 Think of a + sign → Perpendicular!</p><p>🕺 Think of railroad tracks → Parallel!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(34,211,238,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-cyan);">✨ Line Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">Look at the lines above. Do they meet? If they cross at a square corner (90°), it's perpendicular. If they cross at any other angle, they're intersecting. If they never meet, it's parallel! 💃</p></div>`;
                    }

                    return result;
                }
            },
            // 6. Draw / identify shapes with given properties
            {
                skillId: '4pf-properties',
                generate(diff, modality) {
                    const questions = [
                        // Hints set up the number (a real last step) instead of stating it
                        {q: 'How many sides does a hexagon have?', a: 6, hint: 'Hex (like the cells in a honeycomb 🐝) comes right after pent: a hexagon has 1 more side than a pentagon (5 sides). 5 + 1 = ?', prefix: 'hex'},
                        {q: 'How many sides does a pentagon have?', a: 5, hint: 'Pent (like the Pentagon building) comes right after quad: a pentagon has 1 more side than a square (4 sides). 4 + 1 = ?', prefix: 'pent'},
                        {q: 'How many sides does an octagon have?', a: 8, hint: 'Oct is like an octopus 🐙 — one side for each arm! That\'s 2 more than a hexagon (6 sides). 6 + 2 = ?', prefix: 'oct'},
                        {q: 'How many angles does a triangle have?', a: 3, hint: 'Tri is like a tricycle: a triangle has an angle at each corner, and as many corners as a tricycle has wheels. That\'s 1 fewer than a square (4 corners). 4 − 1 = ?', prefix: 'tri'},
                        {q: 'How many right angles does a rectangle have?', a: 4, hint: 'Every corner of a rectangle is a square corner (a right angle). How many corners does a rectangle have?'},
                        {q: 'How many pairs of parallel sides does a parallelogram have?', a: 2, hint: 'Each side of a parallelogram is parallel to the side across from it. Pair up its 4 sides with their opposites: 4 ÷ 2 = ? pairs.'}
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
                            'off-by-one': selected.prefix
                                ? `💃 So close! Remember the prefix is your clue — it's a number. ${selected.hint} ✨`
                                : `💃 So close! ${selected.hint} Count carefully and try once more! ✨`,
                            // Only fires for hexagon↔octagon, so naming HER number's shape rules it out without giving this one
                            'mixed-up-polygon-names': `🪩 Easy mix-up! Hexagon and octagon sound similar but are different${selected.a === 6 ? ' — an OCTagon is the one with 8 sides (like an octopus has 8 arms 🐙), and your shape is a HEXagon' : selected.a === 8 ? ' — a HEXagon is the one with 6 sides (like a honeycomb cell 🐝), and your shape is an OCTagon' : ''}. ${selected.hint} ✨`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Leave out the prefix this question is about
                        const prefixes = [
                            {prefix: 'tri', text: 'tri = 3 → Triangle (3 sides) 🔺'},
                            {prefix: 'quad', text: 'quad = 4 → Quadrilateral (4 sides) ⬜'},
                            {prefix: 'pent', text: 'pent = 5 → Pentagon (5 sides) ⭐'},
                            {prefix: 'hex', text: 'hex = 6 → Hexagon (6 sides) ⬡'},
                            {prefix: 'oct', text: 'oct = 8 → Octagon (8 sides) 🛑'}
                        ].filter(p => p.prefix !== selected.prefix);
                        result.workedExample = `<div style="text-align:center"><p><strong>🎵 Shape Properties:</strong></p><p>Step 1: Look at the prefix of the shape name.</p><p>Step 2: Match it to the number!</p><hr style="margin:8px 0;">${prefixes.map(p => `<p>${p.text}</p>`).join('')}</div>`;
                    } else if (modality === 'visual') {
                        // This question's prefix stays "?" — the full table would be an answer key
                        const table = [['tri', 3], ['quad', 4], ['pent', 5], ['hex', 6], ['oct', 8]]
                            .map(([p, n]) => `<strong>${p}</strong>=${p === selected.prefix ? '?' : n}`).join(' | ');
                        result.visual += selected.prefix
                            ? `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🎵 Prefix Power:</p><p style="margin:4px 0 0;font-size:0.9rem;">${table}</p><p style="margin:4px 0 0;font-size:0.9rem;">${selected.hint} 💃</p></div>`
                            : `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-gold);">🎵 Shape Check:</p><p style="margin:4px 0 0;font-size:0.9rem;">${selected.hint} 💃</p></div>`;
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
                            questionText: `✨ SHAPE BOSS! Lines of symmetry in ${article(s.name)} ${s.name}?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨💃✨</div>`,
                            answer: s.lines,
                            options: shuffle([{label: `${s.lines}`, value: s.lines}, {label: `${s.lines + 1}`, value: s.lines + 1}, {label: `${Math.max(0, s.lines - 1)}`, value: Math.max(0, s.lines - 1)}, {label: `${s.lines + 2}`, value: s.lines + 2}]),
                            hint1: `Fold the ${s.name} — how many ways?`,
                            hint2: `Picture folding the ${s.name} in half every way you can — up-and-down, side-to-side, slanted. Count only the folds where both halves match exactly.`,
                            hint3: `${s.lines}`,
                            diagnose(userAnswer) {
                                if (Number(userAnswer) === s.lines + 1 || Number(userAnswer) === s.lines + 2) return 'overcounted-symmetry';
                                if (Number(userAnswer) === Math.max(0, s.lines - 1)) return 'undercounted-symmetry';
                                return null;
                            },
                            misconceptionHints: {
                                'overcounted-symmetry': `💃 You counted a little too many! Remember, each line of symmetry must fold the shape into TWO perfectly matching halves.${s.name === 'rectangle' ? ' Folding a rectangle corner-to-corner (along a diagonal) does NOT make matching halves!' : ''} Test each direction again and count only the folds that match! ✨`,
                                'undercounted-symmetry': `🪩 You're close — just missed one or more! Don't forget to check ALL directions: horizontal, vertical, and diagonal lines. Count every fold that makes matching halves! 🕺`
                            }
                        };

                        if (modality === 'worked-example') {
                            // Example with a different shape than the one being asked about
                            const weS = pick(shapes.filter(x => x.name !== s.name));
                            result.workedExample = `<div style="text-align:center"><p><strong>✨ BOSS: Lines of Symmetry</strong></p><p>Step 1: Picture folding the ${s.name} in half.</p><p>Step 2: Count every direction that creates matching halves.</p><p>Step 3: Horizontal ➕ Vertical ➕ Diagonals = total lines!</p><hr style="margin:8px 0;"><p>Example: ${article(weS.name)} ${weS.name} has <strong>${weS.lines}</strong> lines of symmetry 💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(168,85,247,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-purple);">✨ Boss Tip:</p><p style="margin:4px 0 0;font-size:0.9rem;">Try all 4 directions: ↕ ↔ ↗ ↘ — which ones create matching halves for ${article(s.name)} ${s.name}? 💃</p></div>`;
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
                            hint2: `Compare ${t.sides.join(', ')}: how many sides are the same number? All 3 equal → equilateral, exactly 2 → isosceles, none → scalene.`,
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
                            const weT = pick(types.filter(x => x.name !== t.name));
                            result.workedExample = `<div style="text-align:center"><p><strong>🔺 BOSS: Triangle Sides</strong></p><p>Step 1: Compare the side numbers.</p><p>Step 2: Count equal sides.</p><p>All 3 equal → Equilateral | 2 equal → Isosceles | None equal → Scalene</p><hr style="margin:8px 0;"><p>Example: ${weT.sides.join(', ')} → <strong>${weT.name}</strong> 💃</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(236,72,153,0.1);border-radius:8px;text-align:center;"><p style="margin:0;font-weight:600;color:var(--dance-pink);">🔺 Boss Tip:</p><p style="margin:4px 0 0;font-size:0.9rem;">Sides: <strong>${t.sides.join(', ')}</strong> — circle the matching numbers! Count your matches to name the triangle. ✨</p></div>`;
                        }

                        return result;

                    } else {
                        // Exclusive clues (as in exercise 4) — otherwise a square also fits the rectangle and rhombus clues
                        const quads = [
                            {name: 'square', prop: '4 equal sides and 4 right angles', rule: '4 equal sides + right angles → Square ⬜'},
                            {name: 'rectangle', prop: 'opposite sides equal and 4 right angles, but not all 4 sides equal', rule: 'Opposite sides equal + right angles, not all equal → Rectangle ▬'},
                            {name: 'rhombus', prop: '4 equal sides but no right angles', rule: `4 equal sides + no right angles → Rhombus ${rhombusSvg(14, 20)}`}
                        ];
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
                            // Rule and example for ONE other shape, so this question's answer isn't spelled out
                            // and isn't the only option left without a rule
                            const weQ = pick(quads.filter(x => x.name !== q.name));
                            result.workedExample = `<div style="text-align:center"><p><strong>🕺 BOSS: Quadrilaterals</strong></p><p>Step 1: Check if all 4 sides are equal.</p><p>Step 2: Check for right angles.</p><p>${weQ.rule}</p><hr style="margin:8px 0;"><p>Example clue: "${weQ.prop}" → <strong>${weQ.name}</strong> 💃</p></div>`;
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
