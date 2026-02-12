import React, { useState, useEffect } from 'react';
import { GameState, PlayerProfile, PlayerState, NetworkMessage, Rank, PeerConnection, Peer } from './types';
import { getProfile, createProfile, updateProfileAfterGame } from './services/storageService';
import { generateProblemSet, calculateScore } from './services/mathUtils';
import { Card, Button, Input, Badge } from './components/UI';
import { getRank, RANK_COLORS, RANK_BG, TOTAL_ROUNDS, ROUND_TIME } from './constants';
import { Trophy, Clock, Users, Zap, LogOut, ArrowRight, Play, Copy, Check } from 'lucide-react';

// --- COMPONENTS ---

const Landing = ({ onJoin }: { onJoin: (p: PlayerProfile) => void }) => {
  const [name, setName] = useState('');
  
  const handleStart = () => {
    if (!name.trim()) return;
    const p = createProfile(name);
    onJoin(p);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
      <div className="max-w-md w-full backdrop-blur-sm">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 drop-shadow-lg">FTW</h1>
          <p className="text-gray-300 text-xl font-light tracking-widest">ROOT RACER</p>
        </div>
        <Card className="border-t-4 border-t-blue-500">
          <h2 className="text-xl font-bold mb-6 text-white">Initialize Agent</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Codename</label>
              <Input 
                placeholder="Enter username..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={12}
                className="bg-black/50"
              />
            </div>
            <Button className="w-full py-3 text-lg" onClick={handleStart} disabled={!name.trim()}>
              Enter System
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const MainMenu = ({ profile, onPlaySolo, onPlayMulti, onLogout }: any) => {
  const rank = getRank(profile.rating, profile.matchesPlayed);

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4 pb-10">
      <header className="flex justify-between items-center mb-12">
         <div>
            <h1 className="text-3xl font-black italic tracking-tighter">FTW <span className="text-blue-500 text-base not-italic font-normal tracking-normal">/ Root Racer</span></h1>
         </div>
         <Button variant="ghost" onClick={onLogout} className="text-xs">
           <LogOut size={14} className="mr-2" /> DISCONNECT
         </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-purple-500/30">
                    {profile.username[0].toUpperCase()}
                 </div>
                 <h2 className="text-2xl font-bold">{profile.username}</h2>
                 <Badge text={rank} colorClass={RANK_COLORS[rank]} bgClass={RANK_BG[rank]} />
                 
                 <div className="grid grid-cols-3 gap-2 w-full mt-8 text-center">
                    <div className="bg-black/20 p-2 rounded">
                       <p className="text-xs text-gray-400 uppercase">Rating</p>
                       <p className="font-mono font-bold">{profile.rating}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                       <p className="text-xs text-gray-400 uppercase">Matches</p>
                       <p className="font-mono font-bold">{profile.matchesPlayed}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                       <p className="text-xs text-gray-400 uppercase">Wins</p>
                       <p className="font-mono font-bold text-green-400">{profile.wins}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Match History</h3>
              <div className="space-y-3">
                 {profile.history.length === 0 && <p className="text-gray-600 text-sm">No data available.</p>}
                 {profile.history.slice(0, 4).map((match: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                       <div>
                          <p className={`font-bold ${match.mode === 'Solo' ? 'text-purple-400' : 'text-blue-400'}`}>{match.mode}</p>
                          <p className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-mono">{match.score} pts</p>
                          <p className={`text-xs ${match.rankChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {match.rankChange > 0 ? '+' : ''}{match.rankChange} RP
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Actions Section */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Multiplayer Card */}
           <div 
             onClick={onPlayMulti}
             className="group relative h-64 bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col justify-end overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
                 <Users size={120} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">Multiplayer</h3>
                 <p className="text-gray-400 text-sm mb-4">Ranked lobby. Challenge other players in real-time.</p>
                 <span className="inline-flex items-center text-blue-400 font-bold text-sm uppercase tracking-wider">
                    Enter Lobby <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </span>
              </div>
           </div>

           {/* Solo Card */}
           <div 
             onClick={onPlaySolo}
             className="group relative h-64 bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-2xl p-8 cursor-pointer hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex flex-col justify-end overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
                 <Zap size={120} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">Practice</h3>
                 <p className="text-gray-400 text-sm mb-4">Unranked. Train your estimation speed.</p>
                 <span className="inline-flex items-center text-purple-400 font-bold text-sm uppercase tracking-wider">
                    Start Session <Play size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const RoomChoice = ({ onCreate, onJoin, onBack }: any) => {
   const [roomId, setRoomId] = useState('');
   return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center py-12 hover:border-blue-500 transition-colors cursor-pointer group" onClick={onCreate}>
               <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
                  <Trophy size={40} />
               </div>
               <h3 className="text-2xl font-bold mb-2">Host Match</h3>
               <p className="text-gray-400 px-8">Create a new private lobby and invite friends with a code.</p>
            </Card>

            <Card className="text-center py-12 flex flex-col items-center">
               <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400">
                  <Users size={40} />
               </div>
               <h3 className="text-2xl font-bold mb-6">Join Match</h3>
               <div className="w-full max-w-xs space-y-3">
                  <Input 
                     placeholder="Room ID" 
                     className="text-center" 
                     value={roomId}
                     onChange={(e) => setRoomId(e.target.value)}
                  />
                  <Button className="w-full" disabled={!roomId} onClick={() => onJoin(roomId)}>Connect</Button>
               </div>
            </Card>
            
            <div className="md:col-span-2 text-center">
               <Button variant="ghost" onClick={onBack}>Cancel</Button>
            </div>
         </div>
      </div>
   );
};

const GameScreen = ({ mode, gameState, playerId, onAnswer, onExit, isHost, onStartGame }: any) => {
  const [inputVal, setInputVal] = useState('');
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundScore, setRoundScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  const currentProblem = gameState.problems[gameState.currentProblemIndex];
  const myState = gameState.players.find((p: PlayerState) => p.id === playerId);
  
  useEffect(() => {
    if (gameState.status !== 'PLAYING') return;
    setTimeLeft(gameState.timeRemaining);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.status, gameState.currentProblemIndex, gameState.timeRemaining]);

  useEffect(() => {
    setInputVal('');
    setRoundScore(null);
  }, [gameState.currentProblemIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal || roundScore !== null) return;
    const guess = parseFloat(inputVal);
    if (isNaN(guess)) return;
    const score = calculateScore(currentProblem.answer, guess, ROUND_TIME - timeLeft, ROUND_TIME);
    setRoundScore(score);
    onAnswer(score);
  };

  const copyRoomId = () => {
     navigator.clipboard.writeText(gameState.roomId);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  if (gameState.status === 'LOBBY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Lobby</h2>
            <Badge text={mode} colorClass="text-blue-400" bgClass="bg-blue-400/20" />
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg mb-6 flex justify-between items-center border border-white/5">
             <div>
               <p className="text-xs text-gray-400 uppercase font-bold mb-1">Room Code</p>
               <div className="flex items-center gap-2">
                 <p className="font-mono text-xl text-yellow-400">{gameState.roomId}</p>
                 <button onClick={copyRoomId} className="text-gray-400 hover:text-white transition-colors">
                    {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                 </button>
               </div>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
                <p className="text-green-400 font-bold flex items-center justify-end">
                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                   Waiting
                </p>
             </div>
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Players ({gameState.players.length})</p>
            {gameState.players.map((p: PlayerState) => (
              <div key={p.id} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs text-white">
                     {p.username[0]}
                   </div>
                   <span className="text-gray-200 font-medium">{p.username} {p.id === gameState.hostId && <span className="text-xs text-yellow-500 ml-2">(Host)</span>}</span>
                </div>
                {p.id === playerId && <Badge text="YOU" colorClass="text-xs text-white" bgClass="bg-white/10" />}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button variant="secondary" onClick={onExit} className="flex-1">Leave</Button>
            {isHost ? (
              <Button onClick={onStartGame} className="flex-1">Start Match</Button>
            ) : (
              <Button disabled className="flex-1 opacity-50 cursor-not-allowed">Waiting for Host...</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (gameState.status === 'ENDED') {
    const sorted = [...gameState.players].sort((a: PlayerState, b: PlayerState) => b.score - a.score);
    const myRank = sorted.findIndex((p: PlayerState) => p.id === playerId) + 1;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <Trophy size={64} className="mx-auto text-yellow-400 mb-6 drop-shadow-lg shadow-yellow-500" />
          <h2 className="text-4xl font-black mb-2 italic">FINISH!</h2>
          <p className="text-gray-400 mb-8 text-lg">You placed <span className={`font-bold ${myRank === 1 ? 'text-yellow-400' : 'text-white'}`}>#{myRank}</span></p>

          <div className="space-y-3 mb-8">
             {sorted.map((p: PlayerState, i: number) => (
               <div key={p.id} className={`flex justify-between items-center p-4 rounded-lg border ${p.id === playerId ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-transparent'}`}>
                 <div className="flex items-center gap-4">
                   <span className={`font-mono text-xl font-black w-8 ${i===0 ? 'text-yellow-400': 'text-gray-500'}`}>#{i+1}</span>
                   <span className="font-bold">{p.username}</span>
                 </div>
                 <span className="font-mono font-bold text-xl">{p.score}</span>
               </div>
             ))}
          </div>
          <Button onClick={onExit} className="w-full">Return to Menu</Button>
        </Card>
      </div>
    );
  }

  if (!currentProblem) return <div className="min-h-screen flex items-center justify-center text-white">Connecting...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
      {/* Dynamic Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between max-w-6xl mx-auto w-full z-20">
        <div className="flex items-center gap-6">
           <div className="px-4 py-2 bg-white/5 rounded-full backdrop-blur border border-white/10 text-sm font-bold text-gray-300">
              ROUND {gameState.currentProblemIndex + 1} <span className="text-gray-600 mx-2">/</span> {TOTAL_ROUNDS}
           </div>
           {mode === 'Multiplayer' && (
             <div className="flex -space-x-3">
               {gameState.players.map((p: PlayerState) => {
                 const rank = getRank(p.rating || 0, p.matchesPlayed || 0);
                 return (
                   <div key={p.id} className="group relative">
                     <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#0f172a] flex items-center justify-center text-sm font-bold text-gray-300 shadow-lg cursor-help transition-transform hover:scale-110 hover:z-10">
                       {p.username[0]}
                     </div>
                     {/* Tooltip */}
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-50 w-max">
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in duration-200">
                           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 text-center">{p.username}</div>
                           <div className="flex items-center justify-between gap-4 text-sm">
                              <div className="flex flex-col items-center">
                                 <span className="text-xs text-gray-500">Score</span>
                                 <span className="font-mono font-bold text-white">{p.score}</span>
                              </div>
                              <div className="w-px h-6 bg-white/10"></div>
                              <div className="flex flex-col items-center">
                                 <span className="text-xs text-gray-500">Rank</span>
                                 <span className={`font-bold ${RANK_COLORS[rank]}`}>{rank}</span>
                              </div>
                           </div>
                        </div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-slate-900/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-md ${timeLeft < 6 ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-white'}`}>
           <Clock size={20} className={timeLeft < 6 ? 'animate-bounce' : ''} />
           <span className="font-mono text-2xl font-bold w-12 text-center">{timeLeft}</span>
        </div>
      </div>

      <div className="w-full max-w-3xl text-center z-10">
        <div className="mb-16 transform transition-all">
          <p className="text-blue-400 font-bold uppercase tracking-[0.3em] mb-6 text-sm">
             ESTIMATE THE {currentProblem.type === 'SQRT' ? 'SQUARE ROOT' : 'CUBE ROOT'}
          </p>
          <div className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-white drop-shadow-2xl">
             {currentProblem.type === 'SQRT' ? '√' : '∛'}{currentProblem.value}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
          <Input 
             autoFocus 
             type="number" 
             step="0.001" 
             placeholder="?" 
             value={inputVal}
             onChange={(e) => setInputVal(e.target.value)}
             className="text-center text-4xl font-mono tracking-widest py-6 bg-white/5 border-white/20 focus:border-blue-500 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 rounded-2xl shadow-2xl transition-all"
             disabled={roundScore !== null}
          />
          
          {roundScore !== null && (
             <div className="absolute -bottom-24 left-0 right-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className={`inline-block px-8 py-3 rounded-full border ${roundScore > 800 ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'}`}>
                 <span className="text-sm font-bold uppercase mr-3">Points Acquired</span>
                 <span className="text-2xl font-black font-mono">+{roundScore}</span>
               </div>
             </div>
          )}
        </form>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center">
         <div className="inline-block px-6 py-3 bg-black/40 rounded-xl border border-white/10 backdrop-blur">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mr-4">Total Score</span>
            <span className="text-white font-mono text-3xl font-bold">{myState?.score || 0}</span>
         </div>
      </div>
    </div>
  );
};


export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [view, setView] = useState<'LANDING' | 'MENU' | 'ROOM_CHOICE' | 'GAME'>('LANDING');
  const [mode, setMode] = useState<'Solo' | 'Multiplayer'>('Solo');
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connections, setConnections] = useState<PeerConnection[]>([]);
  const [hostConn, setHostConn] = useState<PeerConnection | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setProfile(p);
      setView('MENU');
    }
  }, []);

  const initPeer = () => {
    // @ts-ignore
    const newPeer = new (window.Peer || Peer)(); 
    newPeer.on('open', (id: string) => {
      console.log('My ID:', id);
    });
    newPeer.on('connection', (conn: PeerConnection) => {
      conn.on('open', () => {
         setConnections(prev => [...prev, conn]);
         conn.on('data', (data: NetworkMessage) => handleHostMessage(data, conn));
      });
    });
    setPeer(newPeer);
    return newPeer;
  };

  const startSolo = () => {
    if (!profile) return;
    setMode('Solo');
    const problems = generateProblemSet(TOTAL_ROUNDS);
    setGameState({
      status: 'PLAYING',
      roomId: 'LOCAL',
      hostId: 'LOCAL',
      players: [{
        id: profile.id,
        username: profile.username,
        rating: profile.rating,
        matchesPlayed: profile.matchesPlayed,
        score: 0,
        isReady: true,
        finished: false
      }],
      currentProblemIndex: 0,
      problems,
      timeRemaining: ROUND_TIME
    });
    setView('GAME');
  };

  const createRoom = () => {
    if (!profile) return;
    setMode('Multiplayer');
    setIsHost(true);
    const p = initPeer();
    
    p.on('open', (id: string) => {
       setGameState({
         status: 'LOBBY',
         roomId: id,
         hostId: id,
         players: [{
           id: profile.id,
           username: profile.username,
           rating: profile.rating,
           matchesPlayed: profile.matchesPlayed,
           score: 0,
           isReady: true,
           finished: false
         }],
         currentProblemIndex: 0,
         problems: [],
         timeRemaining: ROUND_TIME
       });
       setView('GAME');
    });
  };

  const handleHostMessage = (msg: NetworkMessage, conn: PeerConnection) => {
    setGameState(prev => {
        if (!prev) return null;
        if (msg.type === 'JOIN') {
            const newPlayer = {
                id: conn.peer,
                username: msg.payload.username,
                rating: msg.payload.rating || 1000,
                matchesPlayed: msg.payload.matchesPlayed || 0,
                score: 0,
                isReady: false,
                finished: false
            };
            if (prev.players.find(p => p.id === newPlayer.id)) return prev;
            const newState = { ...prev, players: [...prev.players, newPlayer] };
            conn.send({ type: 'WELCOME', payload: { gameState: newState, yourId: conn.peer } });
            broadcast(newState, 'UPDATE_STATE', connections, conn); 
            return newState;
        }
        if (msg.type === 'SUBMIT_ANSWER') {
             const updatedPlayers = prev.players.map(p => {
                 if (p.id === msg.payload.playerId) {
                     return { ...p, score: p.score + msg.payload.scoreDelta };
                 }
                 return p;
             });
             const newState = { ...prev, players: updatedPlayers };
             broadcast(newState, 'UPDATE_STATE', connections);
             return newState;
        }
        return prev;
    });
  };

  const broadcast = (state: GameState, type: string, conns: PeerConnection[], exclude?: PeerConnection) => {
      conns.forEach(c => {
          if (c !== exclude) c.send({ type, payload: state });
      });
  };

  const hostStartGame = () => {
     if (!gameState) return;
     const problems = generateProblemSet(TOTAL_ROUNDS);
     const newState = { ...gameState, status: 'PLAYING' as const, problems, currentProblemIndex: 0, timeRemaining: ROUND_TIME };
     setGameState(newState);
     broadcast(newState, 'UPDATE_STATE', connections);
     startGameLoop();
  };

  const startGameLoop = () => {
      let round = 0;
      let timer = ROUND_TIME;
      const interval = setInterval(() => {
          timer--;
          if (timer <= 0) {
              round++;
              if (round >= TOTAL_ROUNDS) {
                  clearInterval(interval);
                  setGameState(prev => {
                      if (!prev) return null;
                      const endState = { ...prev, status: 'ENDED' as const, currentProblemIndex: 0 };
                      broadcast(endState, 'UPDATE_STATE', connections);
                      return endState;
                  });
              } else {
                  timer = ROUND_TIME;
                  setGameState(prev => {
                      if (!prev) return null;
                      const nextState = { ...prev, currentProblemIndex: round, timeRemaining: ROUND_TIME };
                      broadcast(nextState, 'UPDATE_STATE', connections);
                      return nextState;
                  });
              }
          }
      }, 1000);
  };

  const joinRoom = (roomId: string) => {
     if (!profile) return;
     setMode('Multiplayer');
     setIsHost(false);
     const p = initPeer();
     p.on('open', () => {
        const conn = p.connect(roomId);
        conn.on('open', () => {
            setHostConn(conn);
            conn.send({ 
                type: 'JOIN', 
                payload: { 
                    username: profile.username, 
                    rating: profile.rating,
                    matchesPlayed: profile.matchesPlayed 
                } 
            });
        });
        conn.on('data', (data: NetworkMessage) => {
            if (data.type === 'WELCOME') {
                setGameState(data.payload.gameState);
                setView('GAME');
            }
            if (data.type === 'UPDATE_STATE') {
                setGameState(data.payload as GameState);
            }
        });
     });
  };

  const handleAnswer = (score: number) => {
     if (!gameState || !profile) return;
     const updatedPlayers = gameState.players.map(p => p.id === profile.id ? { ...p, score: p.score + score } : p);
     
     if (mode === 'Multiplayer') {
         if (isHost) {
             const newState = { ...gameState, players: updatedPlayers };
             setGameState(newState);
             broadcast(newState, 'UPDATE_STATE', connections); 
         } else {
             setGameState({ ...gameState, players: updatedPlayers }); // optimistic update
             hostConn?.send({ type: 'SUBMIT_ANSWER', payload: { playerId: profile.id, scoreDelta: score } });
         }
     } else {
        setGameState({ ...gameState, players: updatedPlayers });
     }
  };

  useEffect(() => {
      if (mode === 'Solo' && gameState?.status === 'PLAYING') {
          const interval = setInterval(() => {
               setGameState(prev => {
                   if (!prev) return null;
                   if (prev.timeRemaining <= 0) {
                       const nextIdx = prev.currentProblemIndex + 1;
                       if (nextIdx >= TOTAL_ROUNDS) {
                           clearInterval(interval);
                           return { ...prev, status: 'ENDED', timeRemaining: 0 };
                       }
                       return { ...prev, currentProblemIndex: nextIdx, timeRemaining: ROUND_TIME };
                   }
                   return { ...prev, timeRemaining: prev.timeRemaining - 1 };
               });
          }, 1000);
          return () => clearInterval(interval);
      }
  }, [mode, gameState?.status]);

  const handleExit = () => {
     if (gameState?.status === 'ENDED' && profile) {
         const sorted = [...gameState.players].sort((a,b) => b.score - a.score);
         const rank = sorted.findIndex(p => p.id === profile.id) + 1;
         updateProfileAfterGame(gameState.players.find(p => p.id === profile.id)?.score || 0, rank, gameState.players.length, mode);
         setProfile(getProfile()); 
     }
     peer?.destroy();
     setPeer(null);
     setConnections([]);
     setHostConn(null);
     setGameState(null);
     setView('MENU');
  };

  return (
    <div className="text-gray-100 min-h-screen">
       {view === 'LANDING' && <Landing onJoin={(p) => { setProfile(p); setView('MENU'); }} />}
       {view === 'MENU' && profile && (
          <MainMenu 
             profile={profile} 
             onPlaySolo={startSolo} 
             onPlayMulti={() => setView('ROOM_CHOICE')}
             onLogout={() => { localStorage.removeItem('ftw_user_profile'); setProfile(null); setView('LANDING'); }}
          />
       )}
       {view === 'ROOM_CHOICE' && (
          <RoomChoice 
             onCreate={createRoom} 
             onJoin={joinRoom} 
             onBack={() => setView('MENU')} 
          />
       )}
       {view === 'GAME' && gameState && profile && (
          <GameScreen 
            mode={mode} 
            gameState={gameState} 
            playerId={profile.id}
            onAnswer={handleAnswer}
            onExit={handleExit}
            isHost={isHost}
            onStartGame={hostStartGame}
          />
       )}
    </div>
  );
}