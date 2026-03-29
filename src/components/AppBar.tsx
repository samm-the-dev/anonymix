import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CassetteTape, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface AppBarProps {
  showBack?: boolean;
}

export function AppBar({ showBack = false }: AppBarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  return (
    <>
      <header className="relative flex items-center border-b border-border px-4 py-3">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-5 w-5" />
        )}
        <h1 className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-display text-lg font-semibold">
          Anonymix
          <CassetteTape className="h-5 w-5 text-violet-400" />
        </h1>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </header>
      {!online && (
        <div className="bg-amber-500/10 px-4 py-1.5 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
          You're offline
        </div>
      )}
    </>
  );
}
