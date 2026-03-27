import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';

export function LoginPage() {
  const { signInWithMagicLink, signInWithProvider } = useAuthContext();
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

        <p className="mt-6 mb-4 text-sm text-muted-foreground">
          Choose how to sign in
        </p>

        {/* Google */}
        <button
          onClick={async () => {
            setError(null);
            const { error: err } = await signInWithProvider('google');
            if (err) setError(err);
          }}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        {/* Spotify */}
        <button
          onClick={async () => {
            setError(null);
            const { error: err } = await signInWithProvider('spotify');
            if (err) setError(err);
          }}
          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <svg className="h-5 w-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Sign in with Spotify
        </button>

        {/* Divider */}
        <div className="my-4 flex w-full items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

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

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Your platform determines where playlists are created.
        </p>
      </div>
    </div>
  );
}
