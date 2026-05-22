/*
 * Shared JSDoc contracts for the vanilla JavaScript app.
 * This file is intentionally documentation-only; it is not loaded by index.html.
 */

/**
 * @typedef {number|string|boolean|null} AnswerValue
 */

/**
 * @typedef {'multiple-choice'|'input'|'grid-click'|'fraction-click'|'true-false'} QuestionType
 */

/**
 * @typedef {'practice'|'visual'|'worked-example'} ExerciseModality
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} label
 * @property {AnswerValue} value
 */

/**
 * A generated question consumed by Engine.renderQuestion.
 *
 * @typedef {Object} ExerciseQuestion
 * @property {QuestionType} type
 * @property {string} [questionText]
 * @property {string} [subText]
 * @property {string} [visual]
 * @property {string} [visualClass]
 * @property {(element: HTMLElement) => void} [visualInit]
 * @property {AnswerValue} answer
 * @property {(QuestionOption|AnswerValue)[]} [options]
 * @property {string} [inputPrefix]
 * @property {string} [inputSuffix]
 * @property {string} [hint1]
 * @property {string} [hint2]
 * @property {string} [hint3]
 * @property {string} [workedExample]
 * @property {(userAnswer: AnswerValue) => boolean} [checkAnswer]
 * @property {(userAnswer: AnswerValue, correctAnswer: AnswerValue, question: ExerciseQuestion) => string|null} [diagnose]
 * @property {Object.<string, string>} [misconceptionHints]
 * @property {string} [skillId]
 * @property {number} [gridRows]
 * @property {number} [gridCols]
 * @property {number} [targetCount]
 * @property {number} [parts]
 * @property {number} [targetNumerator]
 * @property {number} [targetDenominator]
 */

/**
 * @typedef {Object} ExerciseDefinition
 * @property {string} skillId
 * @property {string} [_sourceUnitId]
 * @property {(difficulty: number, modality: ExerciseModality) => ExerciseQuestion} generate
 */

/**
 * @typedef {'swim'|'gd'|'craft'|'monster'|'dance'} MathUnitTheme
 */

/**
 * @typedef {Object} MathUnit
 * @property {string} id
 * @property {string} title
 * @property {string} [icon]
 * @property {MathUnitTheme} theme
 * @property {string} [description]
 * @property {number} exerciseCount
 * @property {() => ExerciseDefinition[]} getExercises
 */

/**
 * Navigation callbacks supplied by App so Engine can avoid direct App coupling.
 *
 * @typedef {Object} EngineNavigation
 * @property {(id: string) => void} showScreen
 * @property {() => MathUnit[]} getAllUnits
 * @property {() => void} showMap
 * @property {() => void} repeatLastPractice
 */

/**
 * @typedef {{ kind: 'weakness' } | { kind: 'mult', table: number|'mixed' }} PracticeSelection
 */

/**
 * @typedef {'normal'|'struggling'|'cruising'|'fatigued'} SessionState
 */

/**
 * @typedef {Object} SessionSnapshot
 * @property {number} currentStreak
 * @property {number} questionsAnswered
 * @property {number} correctThisSession
 * @property {number} wrongThisSession
 * @property {number|null} startTime
 * @property {boolean[]} recentResults
 * @property {SessionState} sessionState
 * @property {SessionState|null} lastSessionMessage
 */

/**
 * @typedef {Object} WrongAnswerRecord
 * @property {AnswerValue} userAnswer
 * @property {AnswerValue} correctAnswer
 * @property {number} timestamp
 */

/**
 * @typedef {Object} SkillProgress
 * @property {number} streak
 * @property {boolean} mastered
 * @property {number} totalCorrect
 * @property {number} totalWrong
 * @property {1|2|3} difficulty
 * @property {number|null} lastAttempt
 * @property {WrongAnswerRecord[]} wrongAnswers
 * @property {Object.<string, number>} misconceptions
 * @property {number} consecutiveCorrect
 * @property {number} consecutiveWrong
 */

/**
 * @typedef {Object} UnitProgress
 * @property {number[]} completed
 * @property {Object.<string, number>} stars
 */

/**
 * @typedef {Object} WeaknessQueueItem
 * @property {string} skillId
 * @property {string} unitId
 * @property {number} addedAt
 */

/**
 * Stored locally and synced as the /api/progress payload.
 *
 * @typedef {Object} ProgressState
 * @property {Object.<string, UnitProgress>} units
 * @property {Object.<string, SkillProgress>} skills
 * @property {WeaknessQueueItem[]} weaknessQueue
 * @property {number} totalStars
 * @property {string[]} unlockedUnits
 * @property {SessionSnapshot} session
 */

/**
 * @typedef {Object} SessionMessage
 * @property {SessionState} type
 * @property {string} text
 * @property {string} icon
 */
