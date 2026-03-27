import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionCard } from '@/components/SessionCard';
import { useSessionList } from '@/hooks/useSessionList';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  defaultExpanded: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, count, defaultExpanded, children }: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-muted-foreground"
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            !expanded && '-rotate-90',
          )}
        />
        <span>{title}</span>
        <span className="font-normal text-muted-foreground">({count})</span>
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

export function SessionHomePage() {
  const navigate = useNavigate();
  const { sessions, loading, error } = useSessionList();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Failed to load sessions: {error}
      </div>
    );
  }

  if (!sessions) return null;

  const activeSessions = sessions.filter((s) => !s.ended);
  const completedSessions = sessions.filter((s) => s.ended);

  return (
    <div className="mx-auto max-w-[428px] lg:max-w-3xl">
      {/* Create Session FAB */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate('/create')}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Session
        </button>
      </div>

      <CollapsibleSection title="Active" count={activeSessions.length} defaultExpanded={true}>
        {activeSessions.length > 0 ? (
          <div className="lg:grid lg:grid-cols-2">
            {activeSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No active sessions
          </div>
        )}
      </CollapsibleSection>

      <div>
        <CollapsibleSection
          title="Completed"
          count={completedSessions.length}
          defaultExpanded={false}
        >
          {completedSessions.length > 0 ? (
            <div className="lg:grid lg:grid-cols-2">
              {completedSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No completed sessions
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
}
