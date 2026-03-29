import { useState } from 'react';
import { CassetteTape, Moon, Sun } from 'lucide-react';
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

      <div className="flex w-full max-w-sm flex-col items-center">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
          Anonymix
          <CassetteTape className="h-6 w-6 text-violet-400" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Make mixtapes with friends.</p>

        <p className="mt-8 mb-4 text-sm text-muted-foreground">
          Sign in with your email
        </p>

        {/* Magic link */}
        {emailSent ? (
          <div className="w-full rounded-xl border border-border p-6 text-center">
            <p className="font-medium text-card-foreground">Check your email</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Magic link sent to <span className="font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="w-full">
            <div className="flex items-center gap-2 rounded-xl border border-border p-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send link'}
              </button>
            </div>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
