import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CassetteTape, Home, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useAuthContext } from '@/contexts/AuthContext';

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { player } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/' || location.pathname === '/profile';

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="relative flex items-center border-b border-border px-4 py-3">
        {isHome ? (
          <div className="w-8" />
        ) : (
          <button onClick={() => navigate(-1)} className="w-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-display text-lg font-semibold">
          Anonymix
          <CassetteTape className="h-5 w-5" />
        </h1>
        <button
          onClick={toggleTheme}
          className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </header>

      <main className="flex flex-1 flex-col pb-16">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 flex items-center justify-around border-t border-border bg-background py-2">
        <NavLink
          to="/"
          className={cn(
            'flex flex-col items-center gap-0.5 px-4 py-1 text-xs',
            location.pathname === '/' ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <Home className="h-5 w-5" />
          <span>Sessions</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={cn(
            'flex flex-col items-center gap-0.5 px-4 py-1 text-xs',
            location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {player ? (
            <>
              <span className="text-base leading-5">{player.avatar}</span>
              <span>{player.name}</span>
            </>
          ) : (
            <>
              <span className="h-5 w-5" />
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
