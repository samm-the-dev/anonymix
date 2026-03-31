import { useCallback, useEffect, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function getManualInstallPlatform(): 'ios' | 'android' | null {
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS|Chrome/.test(ua);
  if (isIos && isSafari) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return null;
}

export type InstallMode = 'prompt' | 'ios' | 'android' | null;

export function useInstallPrompt() {
  const [installMode, setInstallMode] = useState<InstallMode>(null);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const platform = getManualInstallPlatform();

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setInstallMode('prompt');
    };

    const onInstalled = () => {
      deferredPrompt.current = null;
      setInstallMode(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // If beforeinstallprompt hasn't fired after a short delay, fall back to
    // manual instructions for known mobile platforms. This covers iOS Safari
    // (which never fires the event) and Android Chrome when the event is
    // suppressed (e.g. user previously dismissed the mini-infobar).
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt.current && platform) {
        setInstallMode(platform);
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;
    await prompt.prompt();
    deferredPrompt.current = null;
    setInstallMode(null);
  }, []);

  return { installMode, installApp } as const;
}
