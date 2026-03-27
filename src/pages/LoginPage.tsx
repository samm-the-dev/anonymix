import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export function LoginPage() {
  const { signInWithMagicLink } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signInWithMagicLink(email);
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      setEmailSent(true);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-6">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      <div className="flex w-full max-w-[428px] flex-col items-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Anonymix</h1>

        {emailSent ? (
          <div className="mt-6 w-full rounded-xl border border-border p-6 text-center">
            <p className="font-medium text-card-foreground">Check your email</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Magic link sent to <span className="font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-6 w-full">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-card-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mb-4 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
