import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CassetteTape, Download, EllipsisVertical, Moon, Share, Sun } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useTheme } from '@/hooks/useTheme';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

interface AppBarProps {
  showBack?: boolean;
}

export function AppBar({ showBack = false }: AppBarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const { installMode, installApp } = useInstallPrompt();

  const installButton = installMode === 'prompt' ? (
    <button
      onClick={installApp}
      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      aria-label="Install app"
    >
      <Download className="h-5 w-5" />
    </button>
  ) : installMode === 'ios' || installMode === 'android' ? (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Install app"
        >
          <Download className="h-5 w-5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-50 w-64 rounded-lg border border-border bg-card p-3 text-sm text-card-foreground shadow-lg"
        >
          <p className="font-medium">Install Anonymix</p>
          {installMode === 'ios' ? (
            <p className="mt-1 text-muted-foreground">
              Tap <Share className="inline h-4 w-4 align-text-bottom" /> in
              your browser toolbar, then choose{' '}
              <span className="font-medium text-foreground">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="mt-1 text-muted-foreground">
              Tap <EllipsisVertical className="inline h-4 w-4 align-text-bottom" /> in
              your browser toolbar, then choose{' '}
              <span className="font-medium text-foreground">Add to Home screen</span>.
            </p>
          )}
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : null;

  return (
    <>
      <header className="relative flex items-center border-b border-border px-4 py-3">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : installButton ? (
          installButton
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
