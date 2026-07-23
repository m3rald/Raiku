import React, { useState, useEffect } from 'react';
import { 
  Shield, Play, ArrowRight, Lock, Unlock, Users, Trophy, 
  Copy, RefreshCw, FileSpreadsheet, UserMinus, Zap, 
  Clock, RotateCcw, LogOut, Check, HelpCircle 
} from 'lucide-react';
import { QuizQuestion, QuizState, Participant } from '../types';

interface AdminPanelProps {
  quizState: QuizState;
  questions: QuizQuestion[];
  participants: Record<string, Participant>;
  onUpdateState: (newState: Partial<QuizState>) => void;
  onRegenerateCode: () => void;
  onStartGame: () => void;
  onNextQuestion: () => void;
  onEndGame: () => void;
  onResetSession: () => void;
  onEjectParticipant: (nickname: string) => void;
  onClearLeaderboard: () => void;
  clockOffset?: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  quizState,
  questions,
  participants,
  onUpdateState,
  onRegenerateCode,
  onStartGame,
  onNextQuestion,
  onEndGame,
  onResetSession,
  onEjectParticipant,
  onClearLeaderboard,
  clockOffset = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);

  // Update a clock to keep the synchronized countdown accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const currentTime = Date.now() + clockOffset;

  const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${quizState.code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const participantList = (Object.entries(participants) as [string, Participant][]).sort(
    (a, b) => b[1].score - a[1].score
  );

  const totalParticipants = participantList.length;
  const avgScore = totalParticipants
    ? Math.round(
        participantList.reduce((acc, curr) => acc + curr[1].score, 0) /
          totalParticipants
      )
    : 0;

  // Compute remaining time for either lobby or question
  const isHardMode = quizState.difficulty === 'hard';
  const readingDuration = isHardMode ? 5000 : 0;
  const answeringDuration = 15000; // 15 seconds (+5 seconds added)
  const totalDuration = isHardMode ? 25000 : 20000;

  let remainingTime = 0;
  let nextQuestionCountdown = 0;
  let elapsedActive = 0;

  const isReadingTime = quizState.status === 'active' && quizState.questionStartTime
    ? isHardMode && (currentTime - quizState.questionStartTime) < readingDuration
    : false;

  const isTimeUp = quizState.status === 'active' && quizState.questionStartTime 
    ? (currentTime - quizState.questionStartTime) >= (readingDuration + answeringDuration) 
    : false;

  if (quizState.status === 'lobby' && quizState.questionStartTime) {
    const elapsed = currentTime - quizState.questionStartTime;
    remainingTime = Math.max(0, Math.ceil((10000 - elapsed) / 1000));
  } else if (quizState.status === 'active' && quizState.questionStartTime) {
    elapsedActive = currentTime - quizState.questionStartTime;
    if (isReadingTime) {
      remainingTime = Math.max(0, Math.ceil((readingDuration - elapsedActive) / 1000));
    } else if (elapsedActive < (readingDuration + answeringDuration)) {
      remainingTime = Math.max(0, Math.ceil(((readingDuration + answeringDuration) - elapsedActive) / 1000));
    } else {
      remainingTime = 0;
      nextQuestionCountdown = Math.max(0, Math.ceil((totalDuration - elapsedActive) / 1000));
    }
  }

  // Export Leaderboard to CSV (Plain and simple orderliness based on score rankings)
  const handleExportCSV = () => {
    if (participantList.length === 0) {
      alert('No participants to export!');
      return;
    }

    const csvContent = [
      ['Rank', 'Discord Username', 'Score'],
      ...participantList.map(([nick, p], idx) => [
        idx + 1,
        nick.startsWith('@') ? nick : `@${nick}`,
        p.score,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Raiku_Leaderboard_${quizState.code}_${quizState.category}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="admin-panel">
      {/* Top Banner Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#0A0E12] border border-[#C0FF38]/12 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#C0FF38]/10 border border-[#C0FF38]/20 rounded-xl text-[#C0FF38]">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              ADMIN CONTROL <span className="text-[#C0FF38] text-[9px] font-mono bg-[#C0FF38]/10 px-2 py-0.5 rounded-md border border-[#C0FF38]/20 font-black uppercase">CONSOLE</span>
            </h1>
            <p className="text-slate-400 text-[11px] mt-1 font-mono uppercase tracking-wider">
              SESSION: <span className="text-[#C0FF38] font-bold">{quizState.code}</span> // CATEGORY:{" "}
              <span className="font-bold text-white">{quizState.category}</span> // DIFFICULTY:{" "}
              <span className="font-bold text-[#C0FF38]">{quizState.difficulty || 'easy'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetSession}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Quiz</span>
          </button>
          <button
            onClick={onEndGame}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Section (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#0A0A0B] border border-white/10 rounded-2xl space-y-6">
            <h2 className="font-display text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap className="w-4 h-4 text-[#C0FF38]" /> Session Controls
            </h2>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono">
                Quiz Category
              </label>
              <select
                disabled={quizState.status !== 'waiting' && quizState.status !== 'completed'}
                value={quizState.category}
                onChange={(e) => onUpdateState({ category: e.target.value })}
                className="w-full bg-[#040608] border border-white/10 focus:border-[#C0FF38] text-slate-200 rounded-xl px-4 py-3 text-xs outline-none transition-all disabled:opacity-50 cursor-pointer font-medium"
              >
                <option value="raiku">Solana & Raiku (Official Docs)</option>
                <option value="football">Football / Sports Trivia</option>
                <option value="science">Science & Discovery</option>
                <option value="politics">Politics & Governance</option>
                <option value="current">Current Affairs</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono">
                Difficulty Mode
              </label>
              <select
                disabled={quizState.status !== 'waiting' && quizState.status !== 'completed'}
                value={quizState.difficulty || 'easy'}
                onChange={(e) => onUpdateState({ difficulty: e.target.value as any })}
                className="w-full bg-[#040608] border border-white/10 focus:border-[#C0FF38] text-slate-200 rounded-xl px-4 py-3 text-xs outline-none transition-all disabled:opacity-50 cursor-pointer font-medium"
              >
                <option value="easy">Easy Mode (First 4 Qs)</option>
                <option value="intermediate">Intermediate Mode (Middle 3 Qs)</option>
                <option value="hard">Hard Mode (Last 3 Qs)</option>
              </select>
            </div>

            {/* Invite Setup */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-mono">
                Invite Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#040608] border border-[#C0FF38]/12 rounded-xl px-5 py-3 font-mono text-lg tracking-[4px] font-bold text-center text-[#C0FF38]">
                  {quizState.code}
                </div>
                <button
                  onClick={onRegenerateCode}
                  title="Generate New Invite Code"
                  className="px-4 bg-[#040608] hover:bg-[#C0FF38]/10 hover:text-[#C0FF38] border border-white/10 hover:border-[#C0FF38]/30 rounded-xl text-slate-300 transition-all cursor-pointer flex items-center justify-center active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Copy Invite Link */}
            <button
              onClick={copyToClipboard}
              className="w-full py-3.5 text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Participant Link</span>
                </>
              )}
            </button>

            {/* Allow / Block Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#040608] border border-white/5 rounded-xl">
              <div>
                <p className="font-semibold text-xs text-slate-200">Allow joining</p>
                <p className="text-[10px] text-slate-500 font-mono">Enable/disable entry</p>
              </div>
              <button
                onClick={() =>
                  onUpdateState({ allowNewParticipants: !quizState.allowNewParticipants })
                }
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  quizState.allowNewParticipants
                    ? 'bg-[#C0FF38]/10 border-[#C0FF38]/30 text-[#C0FF38]'
                    : 'bg-[#040608] border-white/10 text-slate-500'
                }`}
              >
                {quizState.allowNewParticipants ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Game Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {quizState.status === 'waiting' && (
                <button
                  onClick={onStartGame}
                  className="w-full py-3.5 bg-[#C0FF38] hover:bg-[#d0ff5e] text-[#000204] font-black rounded-xl flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(192,255,56,0.25)] hover:shadow-[0_4px_25px_rgba(192,255,56,0.4)] transition-all cursor-pointer active:scale-[0.99] uppercase text-xs tracking-wider"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Game (Lobby Mode)</span>
                </button>
              )}

              {quizState.status === 'lobby' && (
                <div className="p-4 bg-[#C0FF38]/10 border border-[#C0FF38]/20 rounded-xl text-center space-y-1">
                  <p className="text-[10px] text-[#C0FF38] uppercase tracking-widest font-black font-mono">
                    Lobby Countdown Active
                  </p>
                  <p className="text-4xl font-display font-black text-white tabular-nums animate-pulse">
                    {remainingTime}s
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Game will start automatically when countdown reaches 0.
                  </p>
                </div>
              )}

              {(quizState.status === 'active' || quizState.status === 'completed') && (
                <div className="flex flex-col gap-3 w-full animate-fade-in">
                  {quizState.status === 'active' && (
                    <button
                      disabled={
                        quizState.currentQuestionIndex >= questions.length - 1
                      }
                      onClick={onNextQuestion}
                      className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                      title={remainingTime > 0 ? "Skip timer and proceed" : "Next Question"}
                    >
                      <span>{remainingTime > 0 ? "Skip & Next Question" : "Next Question"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {quizState.status === 'completed' && (
                    <button
                      onClick={onResetSession}
                      className="w-full py-3.5 bg-[#C0FF38] hover:bg-[#d0ff5e] text-[#000204] font-black rounded-xl flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(192,255,56,0.25)] hover:shadow-[0_4px_25px_rgba(192,255,56,0.4)] transition-all cursor-pointer active:scale-[0.99] uppercase text-xs tracking-wider"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Start Another Round</span>
                    </button>
                  )}
                </div>
              )}

              {totalParticipants === 0 && quizState.status === 'waiting' && (
                <div className="space-y-1 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 font-medium">
                    No contestants have connected yet.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    You can start the session now, or copy the invite link above to share with others first!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview (Right Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-[#0A0E12] border border-white/10 rounded-2xl flex flex-col h-full min-h-[420px]">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h2 className="font-display text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C0FF38]" /> Live Monitor Sync
              </h2>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  quizState.status === 'waiting'
                    ? 'bg-white/5 text-slate-400 border border-white/10'
                    : quizState.status === 'lobby'
                    ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                    : quizState.status === 'active'
                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#C0FF38]/10 text-[#C0FF38] border border-[#C0FF38]/20'
                }`}
              >
                {quizState.status}
              </span>
            </div>

            {/* Inner Sync Screen */}
            <div className="flex-1 mt-6 flex flex-col justify-center items-center bg-[#040608] border border-white/5 rounded-xl p-6 relative overflow-hidden">
              {quizState.status === 'waiting' && (
                <div className="text-center max-w-sm space-y-3">
                  <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">Waiting for Players</h3>
                  <p className="text-sm text-slate-400">
                    Participants who join using the invite link will appear in the leaderboard below.
                  </p>
                </div>
              )}

              {quizState.status === 'lobby' && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="text-[10px] uppercase tracking-widest text-[#C0FF38] font-bold font-mono">LOBBY COUNTDOWN</div>
                  <h3 className="font-display text-4xl font-black text-white">GET READY!</h3>
                  <div className="text-6xl font-display font-black text-[#C0FF38] tabular-nums drop-shadow-[0_0_15px_rgba(192,255,56,0.15)]">
                    {remainingTime}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Question 1 begins momentarily...</p>
                </div>
              )}

              {quizState.status === 'active' && questions[quizState.currentQuestionIndex] && (
                <div className="w-full space-y-6 animate-fade-in">
                  {/* Sync Header Info */}
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold font-mono text-[#000204] bg-[#C0FF38] px-3 py-1 rounded-md">
                      Question {quizState.currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-semibold font-mono text-slate-300 bg-[#040608] border border-white/10 px-3 py-1 rounded-lg flex items-center gap-1.5 uppercase">
                      <Clock className="w-3.5 h-3.5 text-[#C0FF38]" />
                      {isTimeUp ? (
                        <span>Next Q in {nextQuestionCountdown}s</span>
                      ) : isReadingTime ? (
                        <span>Reading Prep ({remainingTime}s)</span>
                      ) : (
                        <span>Answering ({remainingTime}s)</span>
                      )}
                    </span>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {questions[quizState.currentQuestionIndex].q}
                  </h3>

                  {/* Options List / Reading Mode Block */}
                  {isReadingTime ? (
                    <div className="p-8 bg-[#050505] border border-dashed border-[#C0FF38]/20 rounded-xl flex flex-col items-center justify-center text-center space-y-4 w-full min-h-[180px]">
                      <div className="w-10 h-10 rounded-full bg-[#C0FF38]/10 border border-[#C0FF38]/25 flex items-center justify-center text-[#C0FF38] animate-pulse">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[#C0FF38] text-[9px] font-black tracking-widest uppercase font-mono">Hard Mode active</p>
                        <p className="text-sm font-bold text-white font-display">READING COUNTDOWN</p>
                        <p className="text-xs text-slate-500">Contestants are reading the question. Options will appear soon.</p>
                      </div>
                      <div className="text-4xl font-display font-black text-[#C0FF38] tabular-nums tracking-tighter drop-shadow-[0_0_12px_rgba(192,255,56,0.2)]">
                        {remainingTime}s
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quizState.shuffleMap.map((originalIndex, displayIndex) => {
                        const letter = String.fromCharCode(65 + displayIndex);
                        const isCorrect = originalIndex === questions[quizState.currentQuestionIndex].correct;
                        const isTimeUpOption = elapsedActive >= (readingDuration + answeringDuration);

                        return (
                          <div
                            key={displayIndex}
                            className={`p-4 border rounded-xl flex items-center gap-3 transition-colors ${
                              isTimeUpOption && isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-900/10'
                                : 'bg-[#050505] border-white/5 text-slate-400'
                            }`}
                          >
                            <div className={`w-7 h-7 flex items-center justify-center font-mono font-bold text-xs rounded-lg border ${
                              isTimeUpOption && isCorrect 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                : 'bg-[#050505] border-white/10 text-slate-500'
                            }`}>
                              {letter}
                            </div>
                            <span className={`text-sm font-medium ${isTimeUpOption && isCorrect ? 'text-slate-100' : 'text-slate-400'}`}>
                              {questions[quizState.currentQuestionIndex].options[originalIndex]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {quizState.status === 'completed' && (
                <div className="text-center max-w-sm space-y-3 animate-fade-in">
                  <div className="w-16 h-16 mx-auto bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">Quiz Completed</h3>
                  <p className="text-sm text-slate-400">
                    All questions answered. View final standings in the leaderboard panel below.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-[#050505] border border-white/10 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">Joined</p>
                <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">{totalParticipants}</p>
              </div>
              <div className="p-4 bg-[#050505] border border-white/10 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">Progress</p>
                <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">
                  {quizState.status === 'waiting'
                    ? `0/${questions.length}`
                    : `${quizState.currentQuestionIndex + 1}/${questions.length}`}
                </p>
              </div>
              <div className="p-4 bg-[#050505] border border-white/10 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">Avg Score</p>
                <p className="font-display text-2xl font-bold text-white mt-1 tabular-nums">{avgScore} pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Leaderboard stand-alone block */}
        <div className="lg:col-span-12">
          <div className="p-6 bg-[#0A0E12] border border-white/10 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-display text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#C0FF38]" /> Active Event Leaderboard
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">Real-time ranking of joined contestants</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  disabled={participantList.length === 0}
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-[#C0FF38] hover:bg-[#d0ff5e] text-[#000204] rounded-lg border border-[#C0FF38]/20 disabled:opacity-40 transition-all cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Leaderboard (CSV)</span>
                </button>
                <button
                  disabled={participantList.length === 0}
                  onClick={onClearLeaderboard}
                  className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300 border border-white/10 rounded-lg transition-all cursor-pointer font-mono"
                >
                  Clear All
                </button>
              </div>
            </div>

            {participantList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-700" />
                <p className="text-sm">No contestants have joined yet.</p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Provide the invite code or share the invite link with participants to begin.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3 px-4 font-bold">Rank</th>
                      <th className="py-3 px-4 font-bold">Discord Username</th>
                      <th className="py-3 px-4 font-bold text-right">Score</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {participantList.map(([nick, p], idx) => {
                      const isTop3 = idx < 3;
                      const rankColors = [
                        'bg-[#C0FF38]/15 border-[#C0FF38]/30 text-[#C0FF38]',
                        'bg-slate-300/15 border-slate-300/30 text-slate-300',
                        'bg-amber-700/15 border-amber-700/30 text-amber-600'
                      ];

                      return (
                        <tr key={nick} className="hover:bg-white/[0.02] transition-all">
                          <td className="py-4 px-4 font-mono font-bold">
                            {isTop3 ? (
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border font-bold text-xs ${rankColors[idx]}`}>
                                {idx + 1}
                              </span>
                            ) : (
                              <span className="text-slate-600 pl-2.5">{idx + 1}</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-100 font-mono">{nick.startsWith('@') ? nick : `@${nick}`}</span>
                          </td>
                          <td className="py-4 px-4 text-right font-display font-extrabold text-emerald-400 text-base tabular-nums">
                            {p.score} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => onEjectParticipant(nick)}
                              title={`Eject ${nick}`}
                              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
