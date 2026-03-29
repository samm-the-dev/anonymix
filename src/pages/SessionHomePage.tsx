import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { SessionCard } from '@/components/SessionCard';
import { useSessionList } from '@/hooks/useSessionList';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  defaultExpanded: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, count, defaultExpanded, children }: CollapsibleSectionProps) {
  return (
    <Collapsible.Root defaultOpen={defaultExpanded} asChild>
      <section>
        <Collapsible.Trigger className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-muted-foreground [&[data-state=closed]>svg]:-rotate-90">
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          <span>{title}</span>
          <span className="font-normal text-muted-foreground">({count})</span>
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {children}
        </Collapsible.Content>
      </section>
    </Collapsible.Root>
  );
}

export function SessionHomePage() {
  const navigate = useNavigate();
  const { sessions, loading, error, refetch } = useSessionList();

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
    <div>
      <CollapsibleSection title="Active" count={activeSessions.length} defaultExpanded={true}>
        {activeSessions.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 px-4">
            {activeSessions.map((session) => (
              <SessionCard key={session.id} session={session} onDelete={refetch} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No active sessions
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Completed"
        count={completedSessions.length}
        defaultExpanded={false}
      >
        {completedSessions.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 px-4">
            {completedSessions.map((session) => (
              <SessionCard key={session.id} session={session} onDelete={refetch} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No completed sessions
          </div>
        )}
      </CollapsibleSection>

      {/* New Session */}
      <div className="px-4 py-4">
        <button
          onClick={() => navigate('/create')}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Session
        </button>
      </div>
    </div>
  );
}
