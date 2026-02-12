import { Rank } from './types';

export const TOTAL_ROUNDS = 5;
export const ROUND_TIME = 20; // seconds
export const MAX_DIGITS = 6; // Limit to 1-6 digit numbers for reasonable estimation

export const RANK_THRESHOLDS = {
    [Rank.BRONZE]: 0,
    [Rank.SILVER]: 800,
    [Rank.GOLD]: 1200,
    [Rank.PLATINUM]: 1600,
    [Rank.LEGENDARY]: 2000,
};

export const getRank = (rating: number, matchesPlayed: number): Rank => {
    if (matchesPlayed < 5) return Rank.UNRANKED;
    if (rating >= 2000) return Rank.LEGENDARY;
    if (rating >= 1600) return Rank.PLATINUM;
    if (rating >= 1200) return Rank.GOLD;
    if (rating >= 800) return Rank.SILVER;
    return Rank.BRONZE;
};

export const RANK_COLORS = {
    [Rank.UNRANKED]: 'text-gray-400',
    [Rank.BRONZE]: 'text-orange-700',
    [Rank.SILVER]: 'text-gray-300',
    [Rank.GOLD]: 'text-yellow-400',
    [Rank.PLATINUM]: 'text-cyan-400',
    [Rank.LEGENDARY]: 'text-purple-500',
};

export const RANK_BG = {
    [Rank.UNRANKED]: 'bg-gray-400/20',
    [Rank.BRONZE]: 'bg-orange-700/20',
    [Rank.SILVER]: 'bg-gray-300/20',
    [Rank.GOLD]: 'bg-yellow-400/20',
    [Rank.PLATINUM]: 'bg-cyan-400/20',
    [Rank.LEGENDARY]: 'bg-purple-500/20',
};