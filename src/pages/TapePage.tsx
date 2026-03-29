import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ListenCommentPage } from './ListenCommentPage';
import { ResultsPage } from './ResultsPage';

export function TapePage() {
  const { sessionSlug, tapeIndex } = useParams<{ sessionSlug: string; tapeIndex: string }>();
  const [status, setStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tapeId, setTapeId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionSlug || !tapeIndex) return;

    async function resolve() {
      // Resolve slug → session
      const { data: session } = await supabase
        .from('sessions')
        .select('id')
        .eq('slug', sessionSlug!)
        .single();
      if (!session) return;
      setSessionId(session.id);

      // Resolve tape index (1-based) → tape ID
      const idx = parseInt(tapeIndex!, 10) - 1;
      const { data: tapes } = await supabase
        .from('tapes')
        .select('id, status')
        .eq('session_id', session.id)
        .order('created_at');

      const tape = tapes?.[idx];
      if (!tape) return;
      setTapeId(tape.id);
      setStatus(tape.status);
    }

    resolve();
  }, [sessionSlug, tapeIndex]);

  if (!status || !sessionId || !tapeId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (status === 'results') return <ResultsPage sessionId={sessionId} tapeId={tapeId} />;
  return <ListenCommentPage sessionId={sessionId} tapeId={tapeId} />;
}
