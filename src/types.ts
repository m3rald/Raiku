export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  correct: number;
}

export type QuizStatus = 'waiting' | 'lobby' | 'active' | 'completed';

export interface Participant {
  nickname: string;
  score: number;
  joinedAt: number;
  lastActive: number;
  isSimulated?: boolean;
}

export interface QuizState {
  code: string;
  category: string;
  difficulty: 'easy' | 'intermediate' | 'hard';
  status: QuizStatus;
  currentQuestionIndex: number;
  lobbyTimeLeft: number;
  questionStartTime: number | null;
  shuffleMap: number[];
  allowNewParticipants: boolean;
}

export type SyncMessage =
  | { type: 'SYNC_STATE'; state: QuizState; questions: QuizQuestion[]; participants: Record<string, Participant> }
  | { type: 'JOIN_REQUEST'; code: string; nickname: string; joinedAt: number }
  | { type: 'JOIN_APPROVED'; code: string; nickname: string; state: QuizState; questions: QuizQuestion[]; participants: Record<string, Participant> }
  | { type: 'SUBMIT_ANSWER'; code: string; nickname: string; score: number }
  | { type: 'EJECT_PARTICIPANT'; code: string; nickname: string }
  | { type: 'RESET'; code: string };
