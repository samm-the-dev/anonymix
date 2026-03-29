import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';
import { AppBar } from './AppBar';

export function Layout() {
  const { player } = useAuthContext();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/profile';

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppBar showBack={!isHome} />

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
