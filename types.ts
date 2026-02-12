// PeerJS is loaded via CDN in index.html, but we need to declare it for TS if not installed via npm.
// In a real env, one would `npm install peerjs` and `import Peer from 'peerjs'`.
// We will use the global window.Peer for simplicity in this no-build-step simulation, 
// but declare the interface here for type safety.

export interface Peer {
    id: string;
    on(event: string, callback: (data: any) => void): void;
    connect(id: string): PeerConnection;
    destroy(): void;
}

export interface PeerConnection {
    on(event: string, callback: (data: any) => void): void;
    send(data: any): void;
    close(): void;
    peer: string;
}

declare global {
    interface Window {
        Peer: new (id?: string) => Peer;
    }
}

// Game Types

export enum Rank {
    UNRANKED = 'Unranked',
    BRONZE = 'Bronze',
    SILVER = 'Silver',
    GOLD = 'Gold',
    PLATINUM = 'Platinum',
    LEGENDARY = 'Legendary'
}

export interface PlayerProfile {
    id: string;
    username: string;
    rating: number;
    matchesPlayed: number;
    wins: number;
    bestScore: number;
    history: MatchResult[];
}

export interface MatchResult {
    date: string;
    mode: 'Solo' | 'Multiplayer';
    rankChange: number;
    score: number;
    placement: number;
}

export interface GameProblem {
    id: string;
    type: 'SQRT' | 'CBRT';
    value: number; // The number to find the root of
    answer: number; // The actual root
}

export interface PlayerState {
    id: string;
    username: string;
    rating: number;
    matchesPlayed: number;
    score: number;
    isReady: boolean;
    finished: boolean;
}

export type GameStatus = 'IDLE' | 'LOBBY' | 'COUNTDOWN' | 'PLAYING' | 'ENDED';

export interface GameState {
    status: GameStatus;
    roomId: string;
    hostId: string;
    players: PlayerState[];
    currentProblemIndex: number;
    problems: GameProblem[];
    timeRemaining: number;
}

// Networking Payload Types
export type NetworkMessage = 
    | { type: 'JOIN'; payload: { username: string; rating: number; matchesPlayed: number } }
    | { type: 'WELCOME'; payload: { gameState: GameState; yourId: string } }
    | { type: 'UPDATE_STATE'; payload: GameState }
    | { type: 'START_GAME'; payload: { problems: GameProblem[] } }
    | { type: 'SUBMIT_ANSWER'; payload: { playerId: string; scoreDelta: number } }
    | { type: 'PLAYER_FINISHED'; payload: { playerId: string } }
    | { type: 'RESET_LOBBY' };
