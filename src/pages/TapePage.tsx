import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ListenCommentPage } from './ListenCommentPage';
import { ResultsPage } from './ResultsPage';

export function TapePage() {
  const { tapeId } = useParams<{ sessionId: string; tapeId: string }>();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!tapeId) return;
    supabase
      .from('tapes')
      .select('status')
      .eq('id', tapeId)
      .single()
      .then(({ data }) => {
        if (data) setStatus(data.status);
      });
  }, [tapeId]);

  if (!status) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (status === 'results') return <ResultsPage />;
  return <ListenCommentPage />;
}
