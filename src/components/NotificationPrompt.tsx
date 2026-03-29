import { Bell, X } from 'lucide-react';

interface NotificationPromptProps {
  onAllow: () => void;
  onDismiss: () => void;
}

export function NotificationPrompt({ onAllow, onDismiss }: NotificationPromptProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-4 py-4 shadow-lg">
      <div className="mx-auto flex max-w-sm items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Get notified when the tape is ready?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">We'll let you know when it's time to listen and comment.</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onAllow}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Allow
            </button>
            <button
              onClick={onDismiss}
              className="rounded-lg px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={onDismiss} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
