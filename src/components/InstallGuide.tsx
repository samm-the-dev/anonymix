import { Smartphone } from 'lucide-react';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function InstallGuide() {
  if (isStandalone()) return null;

  return (
    <div className="flex items-start gap-3 border-t border-border px-4 py-3">
      <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 text-xs text-muted-foreground">
        {isIOS() ? (
          <p>Tap <span className="font-medium text-foreground">Share</span> then <span className="font-medium text-foreground">Add to Home Screen</span> for the best experience.</p>
        ) : (
          <p>Tap your browser menu and select <span className="font-medium text-foreground">Install app</span> or <span className="font-medium text-foreground">Add to Home Screen</span>.</p>
        )}
      </div>
    </div>
  );
}
