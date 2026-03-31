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

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true);
}

export type InstallMode = 'prompt' | 'ios' | 'android' | null;

export function useInstallPrompt() {
  const [installMode, setInstallMode] = useState<InstallMode>(null);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;

    const platform = getManualInstallPlatform();

    // On mobile, show the button immediately with manual instructions.
    // beforeinstallprompt will upgrade it to a native prompt if it fires.
    if (platform) {
      setInstallMode(platform);
    }

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
    return () => {
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
