import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

const AVATARS = ['🎸', '🎧', '🎹', '🎤', '🥁', '🎺', '🎵', '🎶', '🎻', '🪗', '🎷', '🪘'];

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export function ProfileSetupPage() {
  const { user, createPlayer } = useAuthContext();
  const [name, setName] = useState(user?.user_metadata?.full_name ?? '');
  const [avatar, setAvatar] = useState('🎸');
  const [color, setColor] = useState('#6366f1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await createPlayer(name.trim(), avatar, color);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="mb-1 text-center font-display text-xl font-bold text-foreground">
          Set up your profile
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Pick a name and avatar for your sessions
        </p>

        {/* Preview */}
        <div className="mb-6 flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ backgroundColor: color + '22', borderColor: color, borderWidth: 2 }}
          >
            {avatar}
          </div>
        </div>

        {/* Name */}
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-card-foreground">
          Display name
        </label>
        <input
          id="name"
          type="text"
          required
          autoFocus
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Avatar picker */}
        <p className="mb-1.5 text-sm font-medium text-card-foreground">Avatar</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-colors ${
                avatar === a ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Color picker */}
        <p className="mb-1.5 text-sm font-medium text-card-foreground">Color</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition-transform ${
                color === c ? 'scale-110 border-foreground' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
