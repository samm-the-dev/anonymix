import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/Spinner';
import { ListenCommentPage } from './ListenCommentPage';
import { ResultsPage } from './ResultsPage';

export function TapePage() {
  const { sessionSlug, tapeIndex } = useParams<{ sessionSlug: string; tapeIndex: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tapeId, setTapeId] = useState<string | null>(null);
  const [tapeTitle, setTapeTitle] = useState('');
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    if (!sessionSlug || !tapeIndex) return;

    async function resolve() {
      const { data: session } = await supabase
        .from('sessions')
        .select('id, ended')
        .eq('slug', sessionSlug!)
        .maybeSingle();
      if (!session) return;
      setSessionId(session.id);
      setSessionEnded(session.ended);

      const idx = parseInt(tapeIndex!, 10) - 1;
      const { data: tapes } = await supabase
        .from('tapes')
        .select('id, status, title')
        .eq('session_id', session.id)
        .order('created_at');

      const tape = tapes?.[idx];
      if (!tape) return;
      setTapeId(tape.id);
      setStatus(tape.status);
      setTapeTitle(tape.title);
    }

    resolve();
  }, [sessionSlug, tapeIndex]);

  if (!status || !sessionId || !tapeId) {
    return (
      <Spinner />
    );
  }

  // Redirect submitting/upcoming to session view
  if (status === 'submitting' || status === 'upcoming') {
    navigate(`/${sessionSlug}`, { replace: true });
    return null;
  }

  // Skipped tape — simple display
  if (status === 'skipped') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h2 className="font-display text-lg font-semibold text-foreground">{tapeTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">No submissions this round</p>
      </div>
    );
  }

  if (status === 'results') return <ResultsPage sessionId={sessionId} tapeId={tapeId} />;
  return <ListenCommentPage sessionId={sessionId} tapeId={tapeId} ended={sessionEnded} />;
}
