/** Tape status states — matches the Supabase tape_status enum */
export type TapeStatus = 'submitting' | 'commenting' | 'playlist_ready' | 'results';

/** Player display info */
export interface Player {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
}

/** Tape with metadata */
export interface Tape {
  id: string;
  sessionId: string;
  title: string;
  prompt: string;
  status: TapeStatus;
  deadline?: number;
  completedAt?: number;
}

/** Session with joined data (from the listMySessions query) */
export interface SessionWithTape {
  id: string;
  name: string;
  description: string;
  adminId: string;
  ended: boolean;
  activeTape: Tape | null;
  userActionDone: boolean;
  players: Player[];
}
