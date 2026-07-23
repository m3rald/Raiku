import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, LogOut, Award, CheckCircle2, XCircle, 
  Sparkles, Flame, User, AlertCircle 
} from 'lucide-react';
import { QuizQuestion, QuizState } from '../types';

interface ParticipantViewProps {
  quizState: QuizState;
  questions: QuizQuestion[];
  nickname: string;
  onLeaveQuiz: () => void;
  onSubmitScore: (score: number) => void;
  clockOffset?: number;
  score?: number;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({
  quizState,
  questions,
  nickname,
  onLeaveQuiz,
  onSubmitScore,
  clockOffset = 0,
  score = 0,
}) => {
  const [tick, setTick] = useState(0);
  const [selectedDisplayIndex, setSelectedDisplayIndex] = useState<number | null>(null);
  const [submittedScore, setSubmittedScore] = useState<number>(score);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [pendingPoints, setPendingPoints] = useState<number | null>(null);
  const [scoreAppliedQuestionIndex, setScoreAppliedQuestionIndex] = useState<number>(-1);
  
  // Track previous question index to reset option selection state
  const prevQuestionIndexRef = useRef<number>(-1);

  // High resolution tick loop for smooth timer circle animation
  useEffect(() => {
    const animationFrame = setInterval(() => {
      setTick((t) => t + 1);
    }, 50);
    return () => clearInterval(animationFrame);
  }, []);

  const currentTime = Date.now() + clockOffset;

  // Sync with prop score when updated by parent/admin (e.g., on reset)
  useEffect(() => {
    setSubmittedScore(score);
  }, [score]);

  // Reset applied question index when session is reset
  useEffect(() => {
    if (quizState.status === 'waiting' || quizState.status === 'lobby') {
      setScoreAppliedQuestionIndex(-1);
    }
  }, [quizState.status]);

  // Detect when the question changes
  useEffect(() => {
    if (quizState.currentQuestionIndex !== prevQuestionIndexRef.current) {
      setSelectedDisplayIndex(null);
      setPointsAwarded(null);
      setAnsweredIndex(null);
      setPendingPoints(null);
      prevQuestionIndexRef.current = quizState.currentQuestionIndex;
    }
  }, [quizState.currentQuestionIndex]);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  // Calculate timer values
  const isHardMode = quizState.difficulty === 'hard';
  const readingDuration = isHardMode ? 5000 : 0;
  const answeringDuration = 15000; // 15 seconds (+5 seconds added)
  const totalDuration = isHardMode ? 25000 : 20000;

  let remainingTime = 0;
  let progress = 0;
  let nextQuestionCountdown = 0;
  let elapsed = 0;

  if (quizState.questionStartTime) {
    elapsed = currentTime - quizState.questionStartTime;
    if (quizState.status === 'lobby') {
      remainingTime = Math.max(0, Math.ceil((10000 - elapsed) / 1000));
      progress = Math.max(0, Math.min(1, (10000 - elapsed) / 10000));
    } else if (isHardMode && elapsed < readingDuration) {
      remainingTime = Math.max(0, Math.ceil((readingDuration - elapsed) / 1000));
      progress = Math.max(0, Math.min(1, (readingDuration - elapsed) / readingDuration));
    } else if (elapsed < (readingDuration + answeringDuration)) {
      const answeringElapsed = elapsed - readingDuration;
      remainingTime = Math.max(0, Math.ceil((answeringDuration - answeringElapsed) / 1000));
      progress = Math.max(0, Math.min(1, (answeringDuration - answeringElapsed) / answeringDuration));
    } else {
      remainingTime = 0;
      progress = 0;
      nextQuestionCountdown = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
    }
  }

  const isReadingTime = quizState.status === 'active' && isHardMode && elapsed < readingDuration;
  const isTimeUp = quizState.status === 'active' && quizState.questionStartTime ? elapsed >= (readingDuration + answeringDuration) : false;

  // Apply the pending points once the answering countdown finishes
  useEffect(() => {
    if (isTimeUp && quizState.currentQuestionIndex !== -1 && quizState.currentQuestionIndex !== scoreAppliedQuestionIndex) {
      if (pendingPoints !== null) {
        const newTotalScore = submittedScore + pendingPoints;
        setSubmittedScore(newTotalScore);
        setPointsAwarded(pendingPoints);
        onSubmitScore(newTotalScore);
      } else {
        setPointsAwarded(0);
        onSubmitScore(submittedScore);
      }
      setScoreAppliedQuestionIndex(quizState.currentQuestionIndex);
    }
  }, [isTimeUp, quizState.currentQuestionIndex, scoreAppliedQuestionIndex, pendingPoints, submittedScore, onSubmitScore]);

  // SVG parameters for countdown circle
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const strokeDashoffset = circumference * (1 - progress);

  // Handle option selection
  const handleSelectOption = (displayIndex: number, originalIndex: number) => {
    // If already answered, or time is up, or options aren't reflected yet, do nothing
    if (!quizState.questionStartTime) return;
    const clickTime = Date.now();
    const currentElapsed = clickTime - quizState.questionStartTime;

    // In hard mode, clicking options during reading time is not allowed
    if (isHardMode && currentElapsed < readingDuration) return;
    if (selectedDisplayIndex !== null || currentElapsed >= (readingDuration + answeringDuration)) return;

    setSelectedDisplayIndex(displayIndex);
    setAnsweredIndex(originalIndex);

    const isCorrect = originalIndex === currentQuestion.correct;
    
    let gainedPoints = 0;
    if (isCorrect) {
      // 100 max points, decreases down to 10 points at 10 seconds of answering
      const answeringElapsed = currentElapsed - readingDuration;
      gainedPoints = Math.max(10, Math.round(100 - (answeringElapsed / answeringDuration) * 90));
    }

    setPendingPoints(gainedPoints);
  };

  const handleConfirmLeave = () => {
    onLeaveQuiz();
  };

  // Render Waiting Screen (before lobby starts)
  if (quizState.status === 'waiting') {
    return (
      <div className="max-w-md mx-auto px-6 py-12 flex flex-col justify-center items-center text-center min-h-[70vh] animate-fade-in space-y-8">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#C0FF38]/10 border border-[#C0FF38]/20 animate-pulse" />
          <div className="w-20 h-20 bg-[#C0FF38] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(192,255,56,0.25)]">
            <Sparkles className="w-10 h-10 text-[#000204]" />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-[#000204] bg-[#C0FF38] px-3.5 py-1.5 rounded-lg font-mono uppercase">
            CONNECTED TO LOBBY
          </span>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">Successfully Joined!</h2>
          <p className="text-slate-300 text-sm italic font-medium px-4 leading-relaxed">
            "Welcome, Partakers! Prepare your minds and get ready to engage. Please hold tight while the administrator initiates the event."
          </p>
        </div>

        {/* Info Card */}
        <div className="w-full p-4 bg-[#0A0E12] border border-white/10 rounded-xl flex items-center gap-3 shadow-md">
          <User className="w-5 h-5 text-[#C0FF38]" />
          <div className="text-left text-xs">
            <p className="text-slate-200 font-semibold">Playing as {nickname.startsWith('@') ? nickname : `@${nickname}`}</p>
            <p className="text-slate-500 font-mono text-[10px]">Invite Code: <span className="text-[#C0FF38] font-bold font-mono">{quizState.code}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
          <div className="w-2 h-2 bg-[#C0FF38] rounded-full animate-ping" />
          <span>Awaiting host to start...</span>
        </div>
      </div>
    );
  }

  // Render Lobby Screen
  if (quizState.status === 'lobby') {
    return (
      <div className="max-w-md mx-auto px-6 py-12 flex flex-col justify-center items-center text-center min-h-[80vh] animate-fade-in">
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#C0FF38]/10 border border-[#C0FF38]/20 animate-ping" />
          <div className="w-24 h-24 bg-[#C0FF38] rounded-3xl flex items-center justify-center shadow-[0_0_25px_rgba(192,255,56,0.25)]">
            <Flame className="w-12 h-12 text-[#000204] animate-pulse" />
          </div>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-[#000204] bg-[#C0FF38] px-3.5 py-1.5 rounded-lg mb-3 font-mono uppercase">
          Incoming Event
        </span>
        <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">GET READY!</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-xs">
          The quiz is beginning. Keep your eyes on the options below and select as fast as possible.
        </p>

        <div className="mt-8 text-7xl font-display font-black text-[#C0FF38] tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(192,255,56,0.2)]">
          {remainingTime}
        </div>
        <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-widest">Seconds remaining</p>

        {/* Info Card */}
        <div className="mt-12 w-full p-4 bg-[#0A0E12] border border-white/10 rounded-xl flex items-center gap-3">
          <User className="w-5 h-5 text-[#C0FF38]" />
          <div className="text-left text-xs">
            <p className="text-slate-300 font-semibold">Playing as {nickname.startsWith('@') ? nickname : `@${nickname}`}</p>
            <p className="text-slate-500 font-mono text-[10px]">Wait for Question 1 to load automatically...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Quiz Finished / Leaderboard Screen
  if (quizState.status === 'completed') {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-[#C0FF38]/10 border border-[#C0FF38]/30 rounded-full flex items-center justify-center text-[#C0FF38] shadow-[0_0_20px_rgba(192,255,56,0.15)]">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">Quiz Finished!</h2>
          <p className="text-xs text-slate-400">Great effort! Here is your final performance record.</p>
        </div>

        <div className="p-8 bg-[#0A0E12] border border-[#C0FF38]/15 rounded-2xl space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono">Your Total Score</p>
          <p className="text-6xl font-display font-black text-[#C0FF38] tracking-tight tabular-nums drop-shadow-[0_0_15px_rgba(192,255,56,0.2)]">
            {submittedScore}
          </p>
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#C0FF38] bg-[#C0FF38]/10 border border-[#C0FF38]/20 px-3.5 py-1.5 rounded-full font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Checked &amp; Synchronized
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={onLeaveQuiz}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl font-bold transition-all cursor-pointer text-xs uppercase tracking-wider"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Header / Stats */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#C0FF38] rounded-full animate-ping" />
            <p className="text-xs font-bold text-slate-300">
              Contestant: <span className="text-white font-mono">{nickname.startsWith('@') ? nickname : `@${nickname}`}</span>
            </p>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            CATEGORY: <span className="text-slate-300 uppercase">{quizState.category}</span> // DIFFICULTY: <span className="text-[#C0FF38] uppercase font-bold">{quizState.difficulty || 'easy'}</span>
          </p>
        </div>

        <button
          onClick={handleConfirmLeave}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </div>

      {/* Animated Timer Section */}
      {currentQuestion && !isTimeUp && (
        <div className="flex justify-center py-4">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#040608"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#C0FF38"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-100 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-black text-white tabular-nums">
                {remainingTime}
              </span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest -mt-1 font-mono">
                seconds
              </span>
            </div>
          </div>
        </div>
      )}

      {isTimeUp && (
        <div className="p-4 bg-[#C0FF38]/10 border border-[#C0FF38]/20 rounded-xl text-center space-y-1">
          <div className="text-[#C0FF38] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4 animate-bounce" />
            <span>Question Ended!</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Next question starting automatically in <span className="font-mono font-bold text-[#C0FF38] text-xs">{nextQuestionCountdown}s</span>
          </p>
        </div>
      )}

      {/* Active Question Box */}
      {currentQuestion ? (
        <div className="space-y-6">
          <div className="p-6 md:p-8 bg-[#0A0E12] border border-white/10 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-[10px] text-[#C0FF38] font-bold tracking-widest font-mono uppercase">
              <span>Question {quizState.currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-slate-500 font-mono">Category: {quizState.category}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white leading-snug font-display">
              {currentQuestion.q}
            </h1>
          </div>

          {/* Options Grid / Reading countdown */}
          {isReadingTime ? (
            <div className="p-8 bg-[#0A0E12] border border-dashed border-[#C0FF38]/25 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[220px] animate-fade-in shadow-lg">
              <div className="w-14 h-14 rounded-full bg-[#C0FF38]/10 border border-[#C0FF38]/30 flex items-center justify-center text-[#C0FF38] animate-bounce">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[#C0FF38] text-[10px] font-bold tracking-widest uppercase font-mono">Hard Mode Active</p>
                <p className="text-sm font-semibold text-white font-display">READING COUNTDOWN</p>
                <p className="text-xs text-slate-400">Options are hidden for 5 seconds to let you read the question carefully.</p>
              </div>
              <div className="text-5xl font-display font-black text-[#C0FF38] tabular-nums tracking-tighter drop-shadow-[0_0_12px_rgba(192,255,56,0.2)]">
                {remainingTime}s
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {quizState.shuffleMap.map((originalIndex, displayIndex) => {
                const optionLetter = String.fromCharCode(65 + displayIndex);
                const optionText = currentQuestion.options[originalIndex];

                const isSelected = selectedDisplayIndex === displayIndex;
                const isCorrectOption = originalIndex === currentQuestion.correct;

                // Compute color classes based on states
                let optionClass = 'bg-[#040608] border-white/10 hover:border-white/20 text-slate-300';
                let badgeClass = 'bg-[#0A0E12] border-white/10 text-slate-500';

                if (selectedDisplayIndex !== null) {
                  // User has answered, but we are still waiting for time to run out
                  if (isSelected) {
                    optionClass = 'bg-[#C0FF38]/10 border-[#C0FF38]/40 text-[#C0FF38]';
                    badgeClass = 'bg-[#C0FF38]/20 border-[#C0FF38]/30 text-[#C0FF38] font-bold';
                  } else {
                    optionClass = 'bg-[#040608]/40 border-white/5 text-slate-600 cursor-not-allowed opacity-40';
                    badgeClass = 'bg-[#040608] border-white/5 text-slate-700';
                  }
                }

                // Time is up -> reveal correct/incorrect options
                if (isTimeUp) {
                  if (isCorrectOption) {
                    optionClass = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
                    badgeClass = 'bg-emerald-950 border-emerald-500/40 text-emerald-400 font-bold';
                  } else if (isSelected) {
                    optionClass = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                    badgeClass = 'bg-rose-950 border-rose-500/40 text-rose-400 font-bold';
                  } else {
                    optionClass = 'bg-[#040608]/20 border-white/5 text-slate-600 opacity-20';
                    badgeClass = 'bg-[#040608] border-white/5 text-slate-800';
                  }
                }

                return (
                  <button
                    key={displayIndex}
                    disabled={selectedDisplayIndex !== null || isTimeUp}
                    onClick={() => handleSelectOption(displayIndex, originalIndex)}
                    className={`p-4.5 rounded-xl border text-left flex items-center gap-4 transition-all duration-200 w-full active:scale-[0.99] cursor-pointer ${optionClass}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs rounded-lg border flex-shrink-0 transition-colors ${badgeClass}`}>
                      {optionLetter}
                    </div>
                    <div className="flex-1 font-medium text-sm">{optionText}</div>
                    
                    {/* Icon indicators */}
                    {isTimeUp && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {isTimeUp && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Points Status Summary */}
          <div className="p-4 bg-[#0A0E12] border border-white/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C0FF38]" />
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                SCORE: <span className="text-[#C0FF38] font-extrabold text-xs tabular-nums">{submittedScore} pts</span>
              </p>
            </div>

            {selectedDisplayIndex !== null && (
              <div className="text-right">
                {isTimeUp ? (
                  pointsAwarded && pointsAwarded > 0 ? (
                    <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse font-mono uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{pointsAwarded} pts awarded</span>
                    </p>
                  ) : (
                    <p className="text-[10px] font-bold text-rose-400 font-mono uppercase tracking-wider">Incorrect option</p>
                  )
                ) : (
                  <p className="text-[10px] text-[#C0FF38] font-semibold animate-pulse font-mono uppercase tracking-wider">Answer locked. Checking speed...</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          No question currently loaded.
        </div>
      )}
    </div>
  );
};
