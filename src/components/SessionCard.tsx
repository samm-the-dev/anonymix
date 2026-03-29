import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Link, MoreVertical, Trash2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
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
        upcoming: 'cursor-default border border-border bg-card text-muted-foreground',
        submitting:
          'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600/80 dark:hover:bg-green-600',
        playlist_ready:
          'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600/80 dark:hover:bg-amber-600',
        results:
          'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-600/80 dark:hover:bg-purple-600',
        skipped: 'cursor-default border border-border bg-card text-muted-foreground',
      },
    },
  },
);

function getActionLabel(status: TapeStatus, done: boolean): string {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'submitting':
      return done ? 'Change' : 'Submit';
    case 'playlist_ready':
      return 'Listen & Comment';
    case 'results':
      return 'Complete';
    case 'skipped':
      return 'Skipped';
  }
}

interface SessionCardProps {
  session: SessionWithTape;
  onDelete?: () => void;
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const navigate = useNavigate();
  const { activeTape, activeTapeIndex, userActionDone, players } = session;
  const status = activeTape?.status ?? 'results';
  const deadline = formatDeadline(
    status,
    activeTape?.deadline,
    activeTape?.completedAt,
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleExport() {
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button>
              <MoreVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
            >
              <DropdownMenu.Item
                onSelect={() => {
                  const link = `${window.location.origin}/join/${session.id}`;
                  if (navigator.share) {
                    navigator.share({ title: `Join ${session.name} on Anonymix`, url: link });
                  } else {
                    navigator.clipboard?.writeText(link);
                  }
                }}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
              >
                <Link className="h-4 w-4" />
                Invite
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={handleExport}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
              >
                <Download className="h-4 w-4" />
                Export
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => setConfirmDelete(true)}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-500 outline-none hover:bg-accent focus:bg-accent"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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
          onClick={() => navigate(`/${session.slug}`)}
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
            const base = `/${session.slug}`;
            if (status === 'submitting') {
              navigate(`${base}?action=submit`);
            } else if ((status === 'playlist_ready' || status === 'results') && activeTape) {
              navigate(`${base}/tape/${activeTapeIndex + 1}`);
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
      <AlertDialog.Root open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5">
            <AlertDialog.Title className="font-display text-base font-semibold text-foreground">
              Delete session?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{session.name}</span> and all its tapes,
              submissions, and comments will be permanently deleted.
            </AlertDialog.Description>
            <div className="mt-5 flex gap-2">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={async () => {
                    await supabase.from('sessions').delete().eq('id', session.id);
                    onDelete?.();
                  }}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
