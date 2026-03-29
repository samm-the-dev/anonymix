import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Link, MoreVertical, Trash2 } from 'lucide-react';
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
        playlist_ready:
          'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600/80 dark:hover:bg-amber-600',
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
    case 'playlist_ready':
      return 'Listen & Comment';
    case 'results':
      return 'Complete';
  }
}

interface SessionCardProps {
  session: SessionWithTape;
  onDelete?: () => void;
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const navigate = useNavigate();
  const { activeTape, userActionDone, players } = session;
  const status = activeTape?.status ?? 'results';
  const deadline = formatDeadline(
    status,
    activeTape?.deadline,
    activeTape?.completedAt,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
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
    <div className="flex flex-col rounded-xl border border-border bg-card p-3 shadow-sm">
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
                onClick={() => {
                  setMenuOpen(false);
                  const link = `${window.location.origin}/join/${session.id}`;
                  if (navigator.share) {
                    navigator.share({ title: `Join ${session.name} on Anonymix`, url: link });
                  } else {
                    navigator.clipboard?.writeText(link);
                  }
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <Link className="h-4 w-4" />
                Invite
              </button>
              <button
                onClick={handleExport}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-accent"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-2 text-sm text-muted-foreground">{session.description}</p>

      {/* Avatar Row */}
      <AvatarRow players={players} className="mb-2" />

      {/* Tape Title + Prompt (active sessions only) */}
      {activeTape && !session.ended && (
        <>
          <p className="text-sm font-medium text-card-foreground">{activeTape.title}</p>
          <p className="text-sm text-muted-foreground">{activeTape.prompt}</p>
        </>
      )}

    
      {/* Footer Border */}
      <div className="mt-auto pt-3">
        <div className="border-t border-border" />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-1.5 pt-3">
        {/* View Button */}
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
        >
          View
        </button>

        {/* Status + Deadline */}
        <div className="flex items-center gap-1">
          <StatusBadge status={status} />
          {deadline && (
            <span className="whitespace-nowrap text-[11px] text-muted-foreground">{deadline}</span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            const base = `/session/${session.id}`;
            if (status === 'submitting') {
              navigate(`${base}?action=submit`);
            } else if (status === 'playlist_ready' && activeTape) {
              navigate(`${base}/tape/${activeTape.id}/comment`);
            } else if (status === 'results' && activeTape) {
              navigate(`${base}/tape/${activeTape.id}/comments`);
            } else {
              navigate(base);
            }
          }}
          className={cn(
            actionButtonVariants({ status }),
          )}
        >
          {getActionLabel(status, userActionDone)}
        </button>
      </div>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold text-foreground">
              Delete session?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{session.name}</span> and all its tapes,
              submissions, and comments will be permanently deleted.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await supabase.from('sessions').delete().eq('id', session.id);
                  setConfirmDelete(false);
                  onDelete?.();
                }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
