import { PlayerProfile, Rank } from '../types';

const PROFILE_KEY = 'ftw_user_profile';

export const getProfile = (): PlayerProfile | null => {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const createProfile = (username: string): PlayerProfile => {
    const profile: PlayerProfile = {
        id: crypto.randomUUID(),
        username,
        rating: 1000,
        matchesPlayed: 0,
        wins: 0,
        bestScore: 0,
        history: []
    };
    saveProfile(profile);
    return profile;
};

export const saveProfile = (profile: PlayerProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const updateProfileAfterGame = (
    score: number,
    placement: number,
    totalPlayers: number,
    mode: 'Solo' | 'Multiplayer'
) => {
    const profile = getProfile();
    if (!profile) return;

    let ratingChange = 0;
    
    if (mode === 'Multiplayer') {
        // Simple Rating Change logic
        // 1st place gains, last place loses.
        const middle = (totalPlayers + 1) / 2;
        const performance = middle - placement; // Positive for top half, negative for bottom
        ratingChange = Math.floor(performance * 25); 
    } else {
        // Solo practice gives small rating boost for consistency
        ratingChange = score > 2000 ? 5 : 1;
    }

    profile.rating = Math.max(0, profile.rating + ratingChange);
    profile.matchesPlayed += 1;
    if (placement === 1) profile.wins += 1;
    profile.bestScore = Math.max(profile.bestScore, score);
    
    profile.history.unshift({
        date: new Date().toISOString(),
        mode,
        rankChange: ratingChange,
        score,
        placement
    });

    // Keep history limited
    if (profile.history.length > 50) profile.history.pop();

    saveProfile(profile);
};