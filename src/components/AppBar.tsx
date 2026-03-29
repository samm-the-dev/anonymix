import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CassetteTape, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AppBarProps {
  showBack?: boolean;
}

export function AppBar({ showBack = false }: AppBarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
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
        <CassetteTape className="h-5 w-5" />
      </h1>
      <button
        onClick={toggleTheme}
        className="ml-auto rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
    </header>
  );
}
