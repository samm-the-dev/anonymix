import { useParams } from 'react-router-dom';

export function SessionStubPage() {
  const { sessionId } = useParams();
  return (
    <div className="p-4">
      <p className="text-muted-foreground">
        Tape List for session <code className="text-foreground">{sessionId}</code> — stub
      </p>
    </div>
  );
}
