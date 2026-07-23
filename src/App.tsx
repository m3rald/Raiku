import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, ShieldAlert, Award, Zap } from 'lucide-react';

const Dragon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <path d="M12 12v10" />
  </svg>
);
import { QuizState, QuizQuestion, Participant, SyncMessage } from './types';
import { QUESTION_BANK, getQuestionsForQuiz } from './questions';
import { AdminPanel } from './components/AdminPanel';
import { ParticipantView } from './components/ParticipantView';
import { JoinModal } from './components/JoinModal';

// Local storage keys
const STORAGE_ADMIN_STATE_KEY = 'raiku_v2_admin_state';
const STORAGE_ADMIN_PARTICIPANTS_KEY = 'raiku_v2_admin_participants';
const STORAGE_ADMIN_ROLE_KEY = 'raiku_v2_role';
const STORAGE_PART_NICK_KEY = 'raiku_v2_part_nick';
const STORAGE_PART_CODE_KEY = 'raiku_v2_part_code';

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE) || (typeof window !== 'undefined' ? window.location.origin : '');

export default function App() {
  const [role, setRole] = useState<'welcome' | 'admin' | 'participant'>('welcome');
  const [isAdminPreview, setIsAdminPreview] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Admin and active quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    code: '',
    category: 'raiku',
    difficulty: 'easy',
    status: 'waiting',
    currentQuestionIndex: -1,
    lobbyTimeLeft: 10,
    questionStartTime: null,
    shuffleMap: [],
    allowNewParticipants: true,
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant>>({});

  // Participant local state
  const [nickname, setNickname] = useState('');
  const [clockOffset, setClockOffset] = useState<number>(() => {
    const saved = localStorage.getItem('raiku_clock_offset');
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateClockOffset = (offset: number) => {
    setClockOffset(offset);
    localStorage.setItem('raiku_clock_offset', offset.toString());
  };

  // Refs to capture latest states safely
  const roleRef = useRef(role);
  const quizStateRef = useRef(quizState);
  const nicknameRef = useRef(nickname);
  const participantsRef = useRef(participants);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    quizStateRef.current = quizState;
  }, [quizState]);

  useEffect(() => {
    nicknameRef.current = nickname;
  }, [nickname]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  // Load initial settings and check query params
  useEffect(() => {
    // Determine theme or check system preferences
    const savedTheme = localStorage.getItem('raiku_v2_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const params = new URLSearchParams(window.location.search);
    let inviteCode = params.get('invite')?.trim().toUpperCase();
    if (!inviteCode && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      inviteCode = hashParams.get('invite')?.trim().toUpperCase();
    }

    if (inviteCode) {
      const savedRole = localStorage.getItem(STORAGE_ADMIN_ROLE_KEY);
      const savedCode = localStorage.getItem(STORAGE_PART_CODE_KEY);
      const savedNick = localStorage.getItem(STORAGE_PART_NICK_KEY);

      if (savedRole === 'admin') {
        const savedState = localStorage.getItem(STORAGE_ADMIN_STATE_KEY);
        const savedParticipants = localStorage.getItem(STORAGE_ADMIN_PARTICIPANTS_KEY);

        if (savedState) {
          const parsedState = JSON.parse(savedState) as QuizState;
          if (parsedState.code === inviteCode) {
            setQuizState(parsedState);
            setQuestions(getQuestionsForQuiz(parsedState.category, parsedState.difficulty || 'easy'));
            if (savedParticipants) {
              setParticipants(JSON.parse(savedParticipants));
            }
            setRole('admin');
            return;
          }
        }
      }

      if (savedRole === 'participant' && savedCode === inviteCode && savedNick) {
        setNickname(savedNick);
        setRole('participant');
        setQuizState((prev) => ({
          ...prev,
          code: inviteCode,
        }));
      } else {
        // Clear old storage and go to welcome screen with this invite code
        localStorage.removeItem(STORAGE_ADMIN_ROLE_KEY);
        localStorage.removeItem(STORAGE_PART_NICK_KEY);
        localStorage.removeItem(STORAGE_PART_CODE_KEY);
        setRole('welcome');
        setQuizState((prev) => ({
          code: inviteCode,
          category: 'raiku',
          difficulty: 'easy',
          status: 'waiting',
          currentQuestionIndex: -1,
          lobbyTimeLeft: 10,
          questionStartTime: null,
          shuffleMap: [],
          allowNewParticipants: true,
        }));
      }
    } else {
      // Check saved role and restore states
      const savedRole = localStorage.getItem(STORAGE_ADMIN_ROLE_KEY);
      if (savedRole === 'admin') {
        const savedState = localStorage.getItem(STORAGE_ADMIN_STATE_KEY);
        const savedParticipants = localStorage.getItem(STORAGE_ADMIN_PARTICIPANTS_KEY);

        if (savedState) {
          const parsedState = JSON.parse(savedState) as QuizState;
          setQuizState(parsedState);
          setQuestions(getQuestionsForQuiz(parsedState.category, parsedState.difficulty || 'easy'));
          if (savedParticipants) {
            setParticipants(JSON.parse(savedParticipants));
          }
          setRole('admin');
        }
      } else if (savedRole === 'participant') {
        const savedNick = localStorage.getItem(STORAGE_PART_NICK_KEY);
        const savedCode = localStorage.getItem(STORAGE_PART_CODE_KEY);
        if (savedNick && savedCode) {
          setNickname(savedNick);
          setRole('participant');
          // Participant starts by requesting a state sync
          setQuizState((prev) => ({
            ...prev,
            code: savedCode,
          }));
        }
      }
    }
  }, []);

  // Keep the browser URL query parameter in sync with the active quiz code
  useEffect(() => {
    if (quizState.code) {
      const params = new URLSearchParams(window.location.search);
      const currentInvite = params.get('invite');
      if (currentInvite !== quizState.code) {
        params.set('invite', quizState.code);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('invite')) {
        params.delete('invite');
        const searchStr = params.toString();
        const newUrl = `${window.location.pathname}${searchStr ? '?' + searchStr : ''}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [quizState.code]);

  // Helper to push immediate admin updates
  const pushAdminUpdate = async (nextState: QuizState, nextParticipants: Record<string, Participant>) => {
    try {
      const cleanCode = encodeURIComponent(nextState.code.trim().toUpperCase());
      await fetch(`${API_BASE}/api/room/${cleanCode}/admin-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: nextState,
          participants: nextParticipants,
        }),
      });
    } catch (err) {
      console.error("Immediate admin state push failed:", err);
    }
  };

  // Participant Periodic Polling & Heartbeat Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (role === 'participant' && quizState.code) {
      const poll = async () => {
        try {
          const cleanCode = encodeURIComponent(quizState.code.trim().toUpperCase());
          const res = await fetch(`${API_BASE}/api/room/${cleanCode}`);
          if (!res.ok) {
            return;
          }

          const data = await res.json();
          
          // Calculate and sync server time offset for perfect countdown sync
          if (data.serverTime) {
            updateClockOffset(data.serverTime - Date.now());
          }

          setQuizState(data.state);
          setQuestions(getQuestionsForQuiz(data.state.category, data.state.difficulty || 'easy'));
          setParticipants(data.participants || {});

          // Heartbeat / Re-sync if participant is missing on server
          if (nickname && data.participants && !data.participants[nickname]) {
            fetch(`${API_BASE}/api/room/${cleanCode}/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nickname }),
            }).catch(console.error);
          }
        } catch (err) {
          console.error("Error polling room state:", err);
        }
      };

      poll();
      interval = setInterval(poll, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [role, quizState.code, nickname]);

  // Admin Periodic Polling / Push Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (role === 'admin' && quizState.code) {
      const syncAdmin = async () => {
        try {
          const cleanCode = encodeURIComponent(quizState.code.trim().toUpperCase());
          const res = await fetch(`${API_BASE}/api/room/${cleanCode}`);

          if (res.ok) {
            const data = await res.json();
            if (data.serverTime) {
              updateClockOffset(data.serverTime - Date.now());
            }
            if (data.participants) {
              // Deep compare list keys or score changes to prevent unnecessary triggers
              const currentKeys = Object.keys(participantsRef.current);
              const incomingKeys = Object.keys(data.participants);
              const scoreChanged = incomingKeys.some(
                k => !participantsRef.current[k] || participantsRef.current[k].score !== data.participants[k].score
              );

              if (currentKeys.length !== incomingKeys.length || scoreChanged) {
                setParticipants(data.participants);
                localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify(data.participants));
              }
            }
          }
        } catch (err) {
          console.error("Admin periodic sync failed:", err);
        }
      };

      syncAdmin();
      interval = setInterval(syncAdmin, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [role, quizState.code]);

  // Handle Game Loops & Automatic Countdown Triggers (Admin & Participant)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Adjust local Date.now() with synced clockOffset to match the server clock perfectly
    const getAdjustedNow = () => Date.now() + clockOffset;

    if (quizState.status === 'lobby' && quizState.questionStartTime) {
      // Lobby countdown loop (10 seconds)
      timer = setInterval(() => {
        const elapsed = getAdjustedNow() - (quizState.questionStartTime || 0);
        const remaining = Math.max(0, Math.ceil((10000 - elapsed) / 1000));

        if (remaining <= 0) {
          clearInterval(timer);
          if (role === 'admin') {
            // Automatically advance to Question 1
            const initialCategoryQuestions = getQuestionsForQuiz(quizState.category, quizState.difficulty || 'easy');
            const initialMap = initialCategoryQuestions[0]?.options
              .map((_, i) => i)
              .sort(() => Math.random() - 0.5) || [];

            const nextState: QuizState = {
              ...quizStateRef.current,
              status: 'active',
              currentQuestionIndex: 0,
              questionStartTime: getAdjustedNow(),
              shuffleMap: initialMap,
            };

            setQuizState(nextState);
            localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
            pushAdminUpdate(nextState, participantsRef.current);
          }
        }
      }, 100);
    } else if (quizState.status === 'active' && quizState.questionStartTime) {
      // Active question timer loop:
      // - 5 seconds reading prep (for hard mode only)
      // - 15 seconds active answering window
      // - 5 seconds correct answer display/reveal window
      // - Total duration: 20s (normal) or 25s (hard)
      timer = setInterval(() => {
        const elapsed = getAdjustedNow() - (quizState.questionStartTime || 0);

        if (role === 'admin') {
          const isHardMode = quizState.difficulty === 'hard';
          const readingDuration = isHardMode ? 5000 : 0;
          const answeringDuration = 15000;
          const revealDuration = 5000;
          const totalDuration = readingDuration + answeringDuration + revealDuration;

          if (elapsed >= totalDuration) {
            clearInterval(timer);
            const nextIndex = quizState.currentQuestionIndex + 1;
            const categoryQuestions = getQuestionsForQuiz(quizState.category, quizState.difficulty || 'easy');

            let nextState: QuizState;
            if (nextIndex >= categoryQuestions.length) {
              nextState = {
                ...quizStateRef.current,
                status: 'completed',
              };
            } else {
              const nextQ = categoryQuestions[nextIndex];
              const initialMap = nextQ.options.map((_, i) => i).sort(() => Math.random() - 0.5);

              nextState = {
                ...quizStateRef.current,
                currentQuestionIndex: nextIndex,
                questionStartTime: getAdjustedNow(),
                shuffleMap: initialMap,
              };
            }

            setQuizState(nextState);
            localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
            pushAdminUpdate(nextState, participantsRef.current);
          }
        }
      }, 100);
    }

    return () => clearInterval(timer);
  }, [quizState.status, quizState.questionStartTime, quizState.category, quizState.difficulty, quizState.currentQuestionIndex, role, clockOffset]);

  // (Bot Auto-Answer Simulation removed as per user guidelines)

  // Force eject participant handler
  const handleForceEject = () => {
    localStorage.removeItem(STORAGE_ADMIN_ROLE_KEY);
    localStorage.removeItem(STORAGE_PART_NICK_KEY);
    localStorage.removeItem(STORAGE_PART_CODE_KEY);
    setRole('welcome');
    setNickname('');
    setQuizState({
      code: '',
      category: 'raiku',
      difficulty: 'easy',
      status: 'waiting',
      currentQuestionIndex: -1,
      lobbyTimeLeft: 10,
      questionStartTime: null,
      shuffleMap: [],
      allowNewParticipants: true,
    });
    setParticipants({});
    setQuestions([]);
    alert('You have been removed from the quiz session or the room has been ended by the host.');
  };

  // Participant leaves manually
  const handleLeaveQuiz = () => {
    localStorage.removeItem(STORAGE_ADMIN_ROLE_KEY);
    localStorage.removeItem(STORAGE_PART_NICK_KEY);
    localStorage.removeItem(STORAGE_PART_CODE_KEY);
    setRole('welcome');
    setNickname('');
    setQuizState({
      code: '',
      category: 'raiku',
      difficulty: 'easy',
      status: 'waiting',
      currentQuestionIndex: -1,
      lobbyTimeLeft: 10,
      questionStartTime: null,
      shuffleMap: [],
      allowNewParticipants: true,
    });
    setParticipants({});
    setQuestions([]);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('raiku_v2_theme', nextTheme);
  };

  // Entering as Participant (Registers dynamically on the server)
  const handleJoinAsParticipant = async (code: string, nick: string) => {
    const cleanCode = code.trim().toUpperCase();
    const cleanNick = nick.trim();

    if (!cleanCode || !cleanNick || cleanNick === '@') {
      alert("Please provide both the invite code and your Discord username.");
      return;
    }

    try {
      const encodedCode = encodeURIComponent(cleanCode);
      const res = await fetch(`${API_BASE}/api/room/${encodedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: cleanNick }),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to join the room.';
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch (_) {}
        alert(errorMsg);
        return;
      }

      const data = await res.json();
      if (data.serverTime) {
        updateClockOffset(data.serverTime - Date.now());
      }
      setNickname(cleanNick);
      setQuizState(data.state);
      setQuestions(getQuestionsForQuiz(data.state.category, data.state.difficulty || 'easy'));
      setParticipants(data.participants || {});
      setRole('participant');

      // Save to local storage
      localStorage.setItem(STORAGE_ADMIN_ROLE_KEY, 'participant');
      localStorage.setItem(STORAGE_PART_NICK_KEY, cleanNick);
      localStorage.setItem(STORAGE_PART_CODE_KEY, cleanCode);
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Network connection issue. Please verify the invite code and try again.");
    }
  };

  // Entering as Admin
  const handleEnterAdminMode = async () => {
    const savedState = localStorage.getItem(STORAGE_ADMIN_STATE_KEY);
    const savedParticipants = localStorage.getItem(STORAGE_ADMIN_PARTICIPANTS_KEY);

    let nextState: QuizState;
    let nextParticipants: Record<string, Participant> = {};

    if (savedState) {
      nextState = JSON.parse(savedState) as QuizState;
      if (savedParticipants) {
        nextParticipants = JSON.parse(savedParticipants);
      }
    } else {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      const defaultCategory = 'raiku';
      nextState = {
        code,
        category: defaultCategory,
        difficulty: 'easy',
        status: 'waiting',
        currentQuestionIndex: -1,
        lobbyTimeLeft: 10,
        questionStartTime: null,
        shuffleMap: [],
        allowNewParticipants: true,
      };
    }

    // Instantly register or update this room with the backend server
    try {
      const res = await fetch(`/api/room/${nextState.code}/admin-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: nextState,
          participants: nextParticipants,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        nextState = data.state;
        nextParticipants = data.participants;
        if (data.serverTime) {
          updateClockOffset(data.serverTime - Date.now());
        }
      }
    } catch (err) {
      console.error("Failed to push initial admin state:", err);
    }

    setQuizState(nextState);
    setQuestions(getQuestionsForQuiz(nextState.category, nextState.difficulty || 'easy'));
    setParticipants(nextParticipants);
    setRole('admin');

    localStorage.setItem(STORAGE_ADMIN_ROLE_KEY, 'admin');
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
    localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify(nextParticipants));
  };

  // Admin: Update general state properties
  const handleAdminUpdateState = (newState: Partial<QuizState>) => {
    setQuizState((prev) => {
      let updated = { ...prev, ...newState };
      let updatedParticipants = { ...participants };

      if (newState.category || newState.difficulty) {
        setQuestions(getQuestionsForQuiz(updated.category, updated.difficulty || 'easy'));
        if (prev.status === 'completed') {
          updated = {
            ...updated,
            status: 'waiting',
            currentQuestionIndex: -1,
            questionStartTime: null,
            shuffleMap: [],
          };
        }
      }

      setParticipants(updatedParticipants);
      localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify(updatedParticipants));
      
      // Post change to server immediately for instant player updates
      pushAdminUpdate(updated, updatedParticipants);

      return updated;
    });
  };

  // Admin: Regenerate Code
  const handleRegenerateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newCode = '';
    for (let i = 0; i < 6; i++) {
      newCode += chars[Math.floor(Math.random() * chars.length)];
    }

    const nextState: QuizState = {
      ...quizState,
      code: newCode,
      status: 'waiting',
      currentQuestionIndex: -1,
      questionStartTime: null,
      shuffleMap: [],
    };

    setQuizState(nextState);
    setParticipants({});
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
    localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify({}));

    pushAdminUpdate(nextState, {});
  };

  // Admin: Start Game (Triggers 10s Lobby countdown)
  const handleStartGame = () => {
    const nextState: QuizState = {
      ...quizState,
      status: 'lobby',
      currentQuestionIndex: -1,
      questionStartTime: Date.now() + clockOffset,
    };
    setQuizState(nextState);
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
    pushAdminUpdate(nextState, participants);
  };

  // Admin: Force Next Question
  const handleNextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    const categoryQuestions = getQuestionsForQuiz(quizState.category, quizState.difficulty || 'easy');

    let nextState: QuizState;

    if (nextIndex >= categoryQuestions.length) {
      nextState = {
        ...quizState,
        status: 'completed',
      };
    } else {
      const nextQ = categoryQuestions[nextIndex];
      const initialMap = nextQ.options.map((_, i) => i).sort(() => Math.random() - 0.5);

      nextState = {
        ...quizState,
        currentQuestionIndex: nextIndex,
        questionStartTime: Date.now() + clockOffset,
        shuffleMap: initialMap,
      };
    }

    setQuizState(nextState);
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(nextState));
    pushAdminUpdate(nextState, participants);
  };

  // Admin: End Game early, log out, but preserve the invite link/code session in localStorage
  const handleEndGame = () => {
    const resetState: QuizState = {
      ...quizState,
      status: 'waiting',
      currentQuestionIndex: -1,
      questionStartTime: null,
      shuffleMap: [],
    };

    setQuizState(resetState);
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(resetState));
    localStorage.removeItem(STORAGE_ADMIN_ROLE_KEY); // Log out the Admin
    setRole('welcome');

    pushAdminUpdate(resetState, participants);
  };

  // Admin: Reset entire session back to waiting/setup configuration (keeping admin logged in)
  const handleResetSession = () => {
    const resetState: QuizState = {
      ...quizState,
      status: 'waiting',
      currentQuestionIndex: -1,
      questionStartTime: null,
      shuffleMap: [],
    };

    setQuizState(resetState);
    localStorage.setItem(STORAGE_ADMIN_STATE_KEY, JSON.stringify(resetState));

    pushAdminUpdate(resetState, participants);
  };

  // Admin: Eject specific player
  const handleEjectParticipant = async (nick: string) => {
    try {
      const cleanCode = encodeURIComponent(quizState.code.trim().toUpperCase());
      await fetch(`${API_BASE}/api/room/${cleanCode}/eject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nick }),
      });
    } catch (err) {
      console.error("Failed to eject participant from server:", err);
    }

    setParticipants((prev) => {
      const updated = { ...prev };
      delete updated[nick];
      localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Admin: Clear Leaderboard
  const handleClearLeaderboard = async () => {
    try {
      const cleanCode = encodeURIComponent(quizState.code.trim().toUpperCase());
      await fetch(`${API_BASE}/api/room/${cleanCode}/clear-leaderboard`, {
        method: 'POST',
      });
    } catch (err) {
      console.error("Failed to clear leaderboard on server:", err);
    }

    setParticipants({});
    localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify({}));
  };

  // (handleAddMockParticipants removed as per user guidelines)

  // Participant / Admin: Submit score answer
  const handleParticipantSubmitScore = async (newScore: number, targetNickname?: string) => {
    const nick = targetNickname || nickname;
    if (!nick) return;

    try {
      const cleanCode = encodeURIComponent(quizState.code.trim().toUpperCase());
      const res = await fetch(`${API_BASE}/api/room/${cleanCode}/submit-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nick,
          score: newScore,
        }),
      });
      if (res.ok) {
        setParticipants((prev) => {
          const existing = prev[nick] || { nickname: nick, score: 0, joinedAt: Date.now(), lastActive: Date.now() };
          const updated = {
            ...prev,
            [nick]: {
              ...existing,
              score: Math.max(existing.score || 0, newScore),
              lastActive: Date.now(),
            },
          };
          if (role === 'admin') {
            localStorage.setItem(STORAGE_ADMIN_PARTICIPANTS_KEY, JSON.stringify(updated));
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to submit score answer to server:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000204] text-[#FDFDFF] font-sans selection:bg-[#C0FF38]/20 selection:text-white">
      {/* Navigation Header: Branding & Global Stats */}
      <nav className="h-20 border-b border-white/5 bg-[#000204]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-9 h-9 bg-[#C0FF38]/10 border border-[#C0FF38]/20 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(192,255,56,0.15)] flex-shrink-0">
              <Dragon className="w-5 h-5 text-[#C0FF38] animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-black tracking-wider text-[#FDFDFF] uppercase font-display">
                Raiku <span className="text-[#C0FF38]">Quiz</span> Event
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-[#C0FF38]/10 border border-[#C0FF38]/20 rounded-full flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-[#C0FF38] rounded-full animate-ping"></div>
              <span className="text-[10px] font-mono font-black text-[#C0FF38] uppercase tracking-wider flex-shrink-0">LIVE SYNC ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {role !== 'welcome' && (
                <button
                  onClick={() => {
                    if (role === 'admin') {
                      setIsAdminPreview((prev) => !prev);
                    } else {
                      handleLeaveQuiz();
                    }
                  }}
                  className="px-3 py-2 sm:px-3.5 bg-[#C0FF38]/10 hover:bg-[#C0FF38]/25 text-[#C0FF38] hover:text-white border border-[#C0FF38]/30 text-[10px] font-black font-mono uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_2px_8px_rgba(192,255,56,0.1)] active:scale-[0.98]"
                  title={role === 'admin' ? "Switch between Host/Admin View and Contestant View in this tab" : "Leave this quiz"}
                >
                  <Zap className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {role === 'admin' ? (
                      <>
                        <span className="hidden sm:inline">{isAdminPreview ? 'Admin Panel' : 'Contestant View'}</span>
                        <span className="inline sm:hidden">{isAdminPreview ? 'Admin' : 'Contestant'}</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Leave Quiz</span>
                        <span className="inline sm:hidden">Leave</span>
                      </>
                    )}
                  </span>
                </button>
              )}
              <button
                onClick={handleToggleTheme}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex-shrink-0"
                title="Toggle Theme Mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {role === 'welcome' && (
          <JoinModal
            initialCode={quizState.code}
            onJoinAsParticipant={handleJoinAsParticipant}
            onEnterAdminMode={handleEnterAdminMode}
          />
        )}

        {role === 'admin' && (
          isAdminPreview ? (
            <ParticipantView
              quizState={quizState}
              questions={questions}
              nickname="Admin (Host)"
              onLeaveQuiz={() => setIsAdminPreview(false)}
              onSubmitScore={(s) => handleParticipantSubmitScore(s, "Admin (Host)")}
              clockOffset={clockOffset}
              score={participants["Admin (Host)"]?.score || 0}
            />
          ) : (
            <AdminPanel
              quizState={quizState}
              questions={questions}
              participants={participants}
              onUpdateState={handleAdminUpdateState}
              onRegenerateCode={handleRegenerateCode}
              onStartGame={handleStartGame}
              onNextQuestion={handleNextQuestion}
              onEndGame={handleEndGame}
              onResetSession={handleResetSession}
              onEjectParticipant={handleEjectParticipant}
              onClearLeaderboard={handleClearLeaderboard}
              clockOffset={clockOffset}
            />
          )
        )}

        {role === 'participant' && (
          <ParticipantView
            quizState={quizState}
            questions={questions}
            nickname={nickname}
            onLeaveQuiz={handleLeaveQuiz}
            onSubmitScore={handleParticipantSubmitScore}
            clockOffset={clockOffset}
            score={participants[nickname]?.score || 0}
          />
        )}
      </main>

      {/* Footer: Clean branding */}
      <footer className="bg-[#000204] border-t border-white/5 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
            &copy; 2026 Raiku. All rights reserved.
          </div>
          <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            RAIKU QUIZ EVENT
          </div>
        </div>
      </footer>
    </div>
  );
}
