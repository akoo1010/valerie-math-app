/* ===== UNIT 7: QUADRILATERALS — Arts & Crafts Theme 🎨 ===== */

const Geometry = {
    id: 'geometry',
    title: 'Quadrilaterals',
    icon: '🎨',
    theme: 'craft',
    description: "Explore shapes in your craft workshop! Sort, build, and hunt for quadrilaterals of all kinds!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        const shapes = [
            { name: 'Square', props: '4 equal sides, 4 right angles', svg: '<rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--craft-pink)" stroke-width="3" rx="2"/>' },
            { name: 'Rectangle', props: '2 pairs of equal sides, 4 right angles', svg: '<rect x="5" y="15" width="70" height="50" fill="none" stroke="var(--craft-lavender)" stroke-width="3" rx="2"/>' },
            { name: 'Rhombus', props: '4 equal sides, opposite angles equal', svg: '<polygon points="40,5 75,40 40,75 5,40" fill="none" stroke="var(--craft-mint)" stroke-width="3"/>' },
            { name: 'Trapezoid', props: 'Exactly 1 pair of parallel sides', svg: '<polygon points="20,60 60,60 70,20 10,20" fill="none" stroke="var(--craft-yellow)" stroke-width="3"/>' },
            { name: 'Parallelogram', props: '2 pairs of parallel sides, opposite sides equal', svg: '<polygon points="15,60 55,60 65,20 25,20" fill="none" stroke="var(--craft-coral)" stroke-width="3"/>' },
        ];

        return [
            // 1. Shape Sorter — identify the shape
            {
                skillId: 'geo-identify',
                generate(diff) {
                    const shape = pick(shapes);
                    // Always include the correct shape + 3 random distractors
                    const distractors = Engine.Utils.shuffle(shapes.filter(s => s.name !== shape.name).map(s => s.name)).slice(0, 3);
                    const options = [shape.name, ...distractors];
                    return {
                        type: 'multiple-choice',
                        questionText: `What type of quadrilateral is this?`,
                        visual: `<svg width="80" height="80" viewBox="0 0 80 80">${shape.svg}</svg>`,
                        answer: shape.name,
                        options: Engine.Utils.shuffle(options).map(o => ({label: o, value: o})),
                        hint1: `Count the sides and look at the angles`,
                        hint2: shape.props,
                        hint3: `This is a ${shape.name}!`
                    };
                }
            },
            // 2. Build-a-Shape — match properties
            {
                skillId: 'geo-properties',
                generate(diff) {
                    const shape = pick(shapes);
                    // Always include the correct shape + 3 random distractors
                    const distractors = Engine.Utils.shuffle(shapes.filter(s => s.name !== shape.name).map(s => s.name)).slice(0, 3);
                    return {
                        type: 'multiple-choice',
                        questionText: `Which shape has these properties?<br>"${shape.props}"`,
                        visual: `<div style="font-size:1.1rem;background:rgba(205,180,219,0.2);padding:12px 20px;border-radius:12px;border:1px solid rgba(205,180,219,0.3);">
                            📋 ${shape.props}
                        </div>`,
                        answer: shape.name,
                        options: Engine.Utils.shuffle([shape.name, ...distractors]).map(o => ({label: o, value: o})),
                        hint1: `Think about which shape matches ALL of these properties`,
                        hint2: `Does it have equal sides? Right angles? Parallel sides?`,
                        hint3: `The answer is ${shape.name}!`
                    };
                }
            },
            // 3. Shape Hunt — is it a quadrilateral?
            {
                skillId: 'geo-hunt',
                generate(diff) {
                    const quads = ['Square', 'Rectangle', 'Rhombus', 'Trapezoid', 'Parallelogram'];
                    const nonQuads = ['Triangle', 'Pentagon', 'Hexagon', 'Circle', 'Octagon'];
                    const isQuad = Math.random() < 0.5;
                    const shape = isQuad ? pick(quads) : pick(nonQuads);
                    const sides = { Triangle: 3, Pentagon: 5, Hexagon: 6, Circle: 0, Octagon: 8,
                                    Square: 4, Rectangle: 4, Rhombus: 4, Trapezoid: 4, Parallelogram: 4 };
                    const shapeEmoji = {
                        Square: '🟥', Rectangle: '▭', Rhombus: '🔷', Trapezoid: '🔶', Parallelogram: '▰',
                        Triangle: '🔺', Pentagon: '⬠', Hexagon: '⬡', Circle: '🔴', Octagon: '🛑'
                    };
                    return {
                        type: 'true-false',
                        questionText: `Is a ${shape} a quadrilateral?`,
                        visual: `<div style="font-size:3rem">${shapeEmoji[shape] || '❓'}</div>`,
                        answer: isQuad,
                        hint1: `A quadrilateral has exactly 4 sides!`,
                        hint2: `A ${shape} has ${sides[shape] ?? '?'} sides`,
                        hint3: `A ${shape} ${isQuad ? 'IS' : 'is NOT'} a quadrilateral!`
                    };
                }
            },
            // 4. Property Matcher
            {
                skillId: 'geo-match',
                generate(diff) {
                    const questions = [
                        { q: 'Which shape always has 4 right angles AND 4 equal sides?', a: 'Square' },
                        { q: 'Which shape has 4 right angles but sides can be different lengths?', a: 'Rectangle' },
                        { q: 'Which shape has 4 equal sides but angles are NOT always 90°?', a: 'Rhombus' },
                        { q: 'Which shape has exactly 1 pair of parallel sides?', a: 'Trapezoid' },
                    ];
                    const q = pick(questions);
                    return {
                        type: 'multiple-choice',
                        questionText: q.q,
                        answer: q.a,
                        options: Engine.Utils.shuffle(['Square', 'Rectangle', 'Rhombus', 'Trapezoid']).map(o => ({label: o, value: o})),
                        hint1: `Think about each shape's special properties`,
                        hint2: `Consider: equal sides? right angles? parallel sides?`,
                        hint3: `The answer is ${q.a}!`
                    };
                }
            },
            // 5. True or False Cards
            {
                skillId: 'geo-tf',
                generate(diff) {
                    const statements = [
                        { text: 'All squares are rectangles', answer: true, why: 'Squares have 4 right angles and 2 pairs of equal sides, so they ARE rectangles!' },
                        { text: 'All rectangles are squares', answer: false, why: 'Rectangles can have different length and width, so they are NOT always squares!' },
                        { text: 'A square is a rhombus', answer: true, why: 'A square has 4 equal sides, so it IS a rhombus!' },
                        { text: 'All trapezoids are parallelograms', answer: false, why: 'Trapezoids have only 1 pair of parallel sides, parallelograms need 2!' },
                        { text: 'All quadrilaterals have 4 sides', answer: true, why: 'Quad = 4! All quadrilaterals have exactly 4 sides.' },
                        { text: 'A triangle is a quadrilateral', answer: false, why: 'A triangle has 3 sides, not 4!' },
                    ];
                    const s = pick(statements);
                    return {
                        type: 'true-false',
                        questionText: `True or False?<br>"${s.text}"`,
                        visual: `<div style="font-size:2rem">🃏</div>`,
                        answer: s.answer,
                        hint1: `Think about the definition of each shape`,
                        hint2: s.why,
                        hint3: `${s.text} — ${s.answer ? 'TRUE!' : 'FALSE!'}`
                    };
                }
            },
            // 6. Count the Sides
            {
                skillId: 'geo-sides',
                generate(diff) {
                    const shape = pick(shapes);
                    return {
                        type: 'input',
                        questionText: `How many sides does a ${shape.name} have?`,
                        visual: `<svg width="100" height="100" viewBox="0 0 80 80">${shape.svg}</svg>`,
                        answer: 4,
                        hint1: `Count each straight edge!`,
                        hint2: `All quadrilaterals have the same number of sides...`,
                        hint3: `All quadrilaterals have 4 sides!`
                    };
                }
            },
            // 7. Craft Mosaic — identify shapes in pattern
            {
                skillId: 'geo-mosaic',
                generate(diff) {
                    const hidden = pick(['squares', 'rectangles', 'rhombuses', 'trapezoids']);
                    const shapeEmojis = { squares: '🟥', rectangles: '🟦', rhombuses: '🔷', trapezoids: '🔶' };
                    // Decoys must not be quadrilaterals, or counting "squares"/"rectangles" gets ambiguous
                    const decoys = ['🟡','🟣','🟠','⚪','🟤'];
                    const totalCells = 25;
                    const answer = R(3, 8);
                    // Build cells deterministically so the count matches the answer
                    const cells = [];
                    for (let i = 0; i < answer; i++) cells.push(shapeEmojis[hidden]);
                    for (let i = answer; i < totalCells; i++) cells.push(pick(decoys));
                    const shuffledCells = Engine.Utils.shuffle(cells);
                    return {
                        type: 'input',
                        questionText: `How many ${hidden} can you count in this craft pattern?`,
                        visual: `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;max-width:250px;">
                            ${shuffledCells.map(c => `<span style="font-size:1.3rem">${c}</span>`).join('')}
                        </div>`,
                        answer,
                        hint1: `Look carefully for all the ${shapeEmojis[hidden]} shapes`,
                        hint2: `Scan row by row and count only the ${shapeEmojis[hidden]} ones`,
                        hint3: `There are ${answer} ${hidden} in the pattern`
                    };
                }
            }
        ];
    }
};
