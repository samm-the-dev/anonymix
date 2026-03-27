import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, MoreVertical } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { AvatarRow } from './AvatarRow';
import { formatDeadline } from '@/lib/formatDeadline';
import { downloadBlueprint } from '@/lib/sessionBlueprint';
import { supabase } from '@/lib/supabase';
import type { SessionWithTape, TapeStatus } from '@/lib/types';

const actionButtonVariants = cva(
  'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold',
  {
    variants: {
      status: {
        submitting:
          'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600/80 dark:hover:bg-green-600',
        commenting:
          'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600/80 dark:hover:bg-amber-600',
        commenting_done: 'cursor-default border border-border bg-card text-muted-foreground',
        playlist_ready:
          'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600/80 dark:hover:bg-blue-600',
        results:
          'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600/80 dark:hover:bg-purple-600',
      },
    },
  },
);

function getActionLabel(status: TapeStatus, done: boolean): string {
  switch (status) {
    case 'submitting':
      return done ? 'Change' : 'Submit';
    case 'commenting':
      return done ? 'Commented' : 'Comment';
    case 'playlist_ready':
      return 'Listen';
    case 'results':
      return 'Results';
  }
}

function getButtonVariant(status: TapeStatus, done: boolean) {
  if (status === 'commenting' && done) return 'commenting_done' as const;
  return status;
}

interface SessionCardProps {
  session: SessionWithTape;
}

export function SessionCard({ session }: SessionCardProps) {
  const navigate = useNavigate();
  const { activeTape, userActionDone, players } = session;
  const status = activeTape?.status ?? 'results';
  const deadline = formatDeadline(
    status,
    activeTape?.deadline,
    activeTape?.completedAt,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  async function handleExport() {
    setMenuOpen(false);
    const { data: tapes } = await supabase
      .from('tapes')
      .select('title, prompt')
      .eq('session_id', session.id)
      .order('created_at');

    downloadBlueprint({
      version: 1,
      name: session.name,
      description: session.description,
      submitDays: 2,
      commentDays: 5,
      tapes: (tapes ?? []).map((t) => ({ name: t.title, prompt: t.prompt })),
    });
  }

  return (
    <div className="mx-4 mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Card Header */}
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-card-foreground">
          {session.name}
        </h3>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
              <button
                onClick={handleExport}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-muted-foreground">{session.description}</p>

      {/* Avatar Row */}
      <AvatarRow players={players} className="mb-3" />

      {/* Tape Title + Prompt (active sessions only) */}
      {activeTape && !session.ended && (
        <>
          <p className="text-sm font-medium text-card-foreground">{activeTape.title}</p>
          <p className="text-sm text-muted-foreground">{activeTape.prompt}</p>
        </>
      )}

      {/* Action Row */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        {/* View Button */}
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
        >
          View
        </button>

        {/* Status + Deadline */}
        <div className="flex min-w-0 items-center gap-1.5">
          <StatusBadge status={status} />
          {deadline && (
            <span className="truncate text-[11px] text-muted-foreground">{deadline}</span>
          )}
        </div>

        {/* Action Button */}
        <button
          className={cn(
            actionButtonVariants({ status: getButtonVariant(status, userActionDone) }),
          )}
        >
          {getActionLabel(status, userActionDone)}
        </button>
      </div>
    </div>
  );
}
