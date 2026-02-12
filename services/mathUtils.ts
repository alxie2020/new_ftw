import { GameProblem } from '../types';
import { MAX_DIGITS } from '../constants';

export const generateProblem = (): GameProblem => {
    const isSqrt = Math.random() > 0.4; // 60% chance of SQRT
    // Generate a random number between 1 and 10^MAX_DIGITS
    const maxVal = Math.pow(10, MAX_DIGITS);
    const value = Math.floor(Math.random() * maxVal) + 2;

    if (isSqrt) {
        return {
            id: crypto.randomUUID(),
            type: 'SQRT',
            value,
            answer: Math.sqrt(value)
        };
    } else {
        return {
            id: crypto.randomUUID(),
            type: 'CBRT',
            value,
            answer: Math.cbrt(value)
        };
    }
};

export const generateProblemSet = (count: number): GameProblem[] => {
    return Array.from({ length: count }, () => generateProblem());
};

/**
 * Scoring Formula:
 * (1 - |correct - answer|/correct) * 1000 + (TimeBonus)
 * We scale it to make it look like a "Score" ~1000 per perfect answer
 */
export const calculateScore = (
    actual: number,
    guess: number,
    timeTaken: number,
    totalTime: number
): number => {
    const accuracy = Math.max(0, 1 - Math.abs(actual - guess) / actual);
    const accuracyScore = accuracy * 1000;

    // Time bonus: up to 200 points for instant answer, decreasing linearly
    const timeBonus = Math.max(0, (totalTime - timeTaken) / totalTime) * 200;

    return Math.floor(accuracyScore + timeBonus);
};