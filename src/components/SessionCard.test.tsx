import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionCard } from './SessionCard';
import type { SessionWithTape } from '@/lib/types';

const NOW = new Date('2026-03-26T12:00:00Z').getTime();
const DAY = 86400000;

const basePlayers = [
  { id: 'p1', name: 'Sam', avatar: '🎸', avatarColor: '#6366f1' },
  { id: 'p2', name: 'Alex', avatar: '🎧', avatarColor: '#f59e0b' },
];

function makeSession(overrides: Partial<SessionWithTape> = {}): SessionWithTape {
  return {
    id: 's1',
    name: 'Test Session',
    description: 'A test session',
    adminId: 'p1',
    ended: false,
    activeTape: {
      id: 't1',
      sessionId: 's1',
      title: 'Test Tape',
      prompt: 'test prompt',
      status: 'submitting',
      deadline: NOW + 3 * DAY,
    },
    userActionDone: false,
    players: basePlayers,
    ...overrides,
  };
}

function renderCard(session: SessionWithTape) {
  return render(
    <MemoryRouter>
      <SessionCard session={session} />
    </MemoryRouter>,
  );
}

describe('SessionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders session name and description', () => {
    renderCard(makeSession());
    expect(screen.getByText('Test Session')).toBeInTheDocument();
    expect(screen.getByText('A test session')).toBeInTheDocument();
  });

  it('renders tape title and prompt for active sessions', () => {
    renderCard(makeSession());
    expect(screen.getByText('Test Tape')).toBeInTheDocument();
    expect(screen.getByText('test prompt')).toBeInTheDocument();
  });

  it('hides tape info for ended sessions', () => {
    renderCard(makeSession({ ended: true }));
    expect(screen.queryByText('Test Tape')).not.toBeInTheDocument();
  });

  it('shows "Submit" button when user has not submitted', () => {
    renderCard(makeSession({ userActionDone: false }));
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('shows "Change" button when user has submitted', () => {
    renderCard(makeSession({ userActionDone: true }));
    expect(screen.getByText('Change')).toBeInTheDocument();
  });

  it('shows "Listen & Comment" for playlist_ready', () => {
    renderCard(
      makeSession({
        activeTape: {
          id: 't1',
          sessionId: 's1',
          title: 'T',
          prompt: 'p',
          status: 'playlist_ready',
        },
      }),
    );
    expect(screen.getByText('Listen & Comment')).toBeInTheDocument();
  });

  it('shows "Complete" for results status', () => {
    renderCard(
      makeSession({
        activeTape: {
          id: 't1',
          sessionId: 's1',
          title: 'T',
          prompt: 'p',
          status: 'results',
          completedAt: NOW - 6 * DAY,
        },
      }),
    );
    expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
  });

  it('renders all player avatars', () => {
    renderCard(makeSession());
    expect(screen.getByTitle('Sam')).toBeInTheDocument();
    expect(screen.getByTitle('Alex')).toBeInTheDocument();
  });
});
