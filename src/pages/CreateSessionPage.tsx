import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Moon, Plus, Sun, Trash2, Copy, Share2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { pickAndImportBlueprint, type SessionBlueprint } from '@/lib/sessionBlueprint';

interface TapeDraft {
  name: string;
  prompt: string;
}

type Step = 'create' | 'celebration';

export function CreateSessionPage() {
  const navigate = useNavigate();
  const { player } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  // Step state
  const [step, setStep] = useState<Step>('create');

  // Tape drafts
  const [tapes, setTapes] = useState<TapeDraft[]>([{ name: '', prompt: '' }]);
  const [activeTape, setActiveTape] = useState(0);

  // Session details
  const [sessionName, setSessionName] = useState('');
  const [sessionDesc, setSessionDesc] = useState('');
  const [submitDays, setSubmitDays] = useState(2);
  const [commentDays, setCommentDays] = useState(5);

  // Refs
  const tapeNameRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (shouldFocus && tapeNameRef.current) {
      tapeNameRef.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, activeTape]);

  // Keyboard navigation
  const navigateTape = useCallback(
    (dir: 1 | -1) => {
      setActiveTape((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= tapes.length) return prev;
        return next;
      });
    },
    [tapes.length],
  );

  useEffect(() => {
    if (step !== 'create') return;
    function handleKey(e: KeyboardEvent) {
      // Don't intercept when typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateTape(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateTape(-1);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [step, navigateTape]);

  const crateRef = useRef<HTMLDivElement>(null);

  // Celebration
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function updateTape(index: number, field: keyof TapeDraft, value: string) {
    setTapes((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  function addTape() {
    setTapes((prev) => [...prev, { name: '', prompt: '' }]);
    setActiveTape(tapes.length);
    setShouldFocus(true);
  }

  function removeTape(index: number) {
    if (tapes.length <= 1) return;
    setTapes((prev) => prev.filter((_, i) => i !== index));
    if (activeTape >= tapes.length - 1) setActiveTape(Math.max(0, tapes.length - 2));
  }

  // Import state
  const [pendingImport, setPendingImport] = useState<SessionBlueprint | null>(null);
  const [importOverwriteDetails, setImportOverwriteDetails] = useState(true);

  async function handlePickImport() {
    const bp = await pickAndImportBlueprint();
    if (!bp) return;
    setPendingImport(bp);
    setImportOverwriteDetails(true);
  }

  function applyImport(additive: boolean) {
    if (!pendingImport) return;
    if (additive) {
      // Append tapes, optionally overwrite session details
      const newTapes = pendingImport.tapes.filter((t) => t.name.trim());
      setTapes((prev) => {
        const existing = prev.filter((t) => t.name.trim());
        return existing.length > 0 ? [...existing, ...newTapes] : newTapes.length > 0 ? newTapes : [{ name: '', prompt: '' }];
      });
    } else {
      // Replace everything
      setTapes(pendingImport.tapes.length > 0 ? pendingImport.tapes : [{ name: '', prompt: '' }]);
      setActiveTape(0);
    }
    if (importOverwriteDetails || !additive) {
      setSessionName(pendingImport.name);
      setSessionDesc(pendingImport.description);
      setSubmitDays(pendingImport.submitDays);
      setCommentDays(pendingImport.commentDays);
    }
    setPendingImport(null);
    setShouldFocus(true);
  }

  const hasValidTape = tapes.some((t) => t.name.trim().length > 0);
  const hasSessionName = sessionName.trim().length > 0;

  async function handleCreate() {
    if (!player || !hasSessionName || !hasValidTape) return;
    setCreating(true);
    setError(null);

    try {
      const filledTapes = tapes.filter((t) => t.name.trim().length > 0);

      // Create session
      const { data: session, error: sessErr } = await supabase
        .from('sessions')
        .insert({
          name: sessionName.trim(),
          description: sessionDesc.trim(),
          admin_id: player.id,
        })
        .select()
        .single();

      if (sessErr) throw sessErr;

      // Add creator as member
      const { error: memErr } = await supabase
        .from('session_players')
        .insert({ session_id: session.id, player_id: player.id });

      if (memErr) throw memErr;

      // Create tapes — first one starts as 'submitting', rest queued
      for (let i = 0; i < filledTapes.length; i++) {
        const { error: tapeErr } = await supabase.from('tapes').insert({
          session_id: session.id,
          title: filledTapes[i].name.trim(),
          prompt: filledTapes[i].prompt.trim(),
          status: i === 0 ? 'submitting' : 'submitting',
          deadline: new Date(Date.now() + submitDays * 86400000).toISOString(),
        });
        if (tapeErr) throw tapeErr;
      }

      setCreatedSessionId(session.id);
      setStep('celebration');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  }

  const inviteLink = createdSessionId
    ? `${window.location.origin}/join/${createdSessionId}`
    : '';

  async function copyLink() {
    await navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({ title: `Join ${sessionName} on Anonymix`, url: inviteLink });
    } else {
      copyLink();
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-[428px] flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 relative flex items-center border-b border-border px-4 py-3">
        {step !== 'celebration' && (
          <button
            onClick={() => navigate('/')}
            className="w-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-semibold">
          {step === 'celebration' ? '' : 'New Session'}
        </h1>
        <button
          onClick={toggleTheme}
          className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </header>

      {/* Main flow */}
      {step !== 'celebration' && (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Top: scrollable tape area */}
          <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {/* Import */}
          <div className="px-4 pt-3">
            <button
              onClick={handlePickImport}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
          </div>

          {/* Tape crate */}
          <div className="px-4 pt-4">
            <div ref={crateRef} className="mx-auto w-full max-w-[375px]">
              {/* Spines above active card */}
              {Array.from({ length: Math.min(activeTape, 4) }, (_, i) => {
                const idx = activeTape - (Math.min(activeTape, 4) - i);
                const distance = activeTape - idx;
                const width = Math.max(60, 100 - distance * distance * 0.5);
                const label = tapes[idx].name || `Tape ${idx + 1}`;
                return (
                  <div
                    key={`spine-above-${idx}`}
                    onClick={() => setActiveTape(idx)}
                    className={cn(
                      'mx-auto mb-1 flex cursor-pointer items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-accent',
                      distance >= 4 ? 'h-5' : distance >= 3 ? 'h-7' : 'h-9',
                    )}
                    style={{ width: `${width}%`, opacity: 0.5 }}
                  >
                    {distance < 4 && (
                      <span className="truncate px-3 font-display text-[11px] font-medium text-muted-foreground">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}

              {activeTape > 0 && <div className="mb-2" />}

              {/* Active tape card */}
              <div className="flex h-[220px] flex-col animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-4 shadow-md duration-200">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tape {activeTape + 1}
                  </span>
                  {tapes.length > 1 && (
                    <button
                      onClick={() => removeTape(activeTape)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  ref={tapeNameRef}
                  type="text"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  placeholder="Tape name (e.g. Two-Face aka Harvey Dent)"
                  value={tapes[activeTape].name}
                  onChange={(e) => updateTape(activeTape, 'name', e.target.value)}
                  className="mb-2 w-full rounded-lg border border-input bg-background px-3 py-2 font-display text-sm font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  placeholder="Prompt (e.g. songs that start in one style then switch)"
                  value={tapes[activeTape].prompt}
                  onChange={(e) => updateTape(activeTape, 'prompt', e.target.value)}
                  className="min-h-0 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Spines below active card */}
              {activeTape < tapes.length - 1 && <div className="mt-2" />}
              {Array.from(
                { length: Math.min(tapes.length - activeTape - 1, 4) },
                (_, i) => {
                  const idx = activeTape + 1 + i;
                  const distance = idx - activeTape;
                  const width = Math.max(60, 100 - distance * distance * 0.5);
                  const label = tapes[idx].name || `Tape ${idx + 1}`;
                  return (
                    <div
                      key={`spine-below-${idx}`}
                      onClick={() => setActiveTape(idx)}
                      className={cn(
                        'mx-auto mt-1 flex cursor-pointer items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-accent',
                        distance >= 4 ? 'h-5' : distance >= 3 ? 'h-7' : 'h-9',
                      )}
                      style={{ width: `${width}%`, opacity: 0.5 }}
                    >
                      {distance < 4 && (
                        <span className="truncate px-3 font-display text-[11px] font-medium text-muted-foreground">
                          {label}
                        </span>
                      )}
                    </div>
                  );
                },
              )}

              {/* Add tape */}
              <button
                onClick={addTape}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                <Plus className="h-4 w-4" />
                Add another tape
              </button>
            </div>
          </div>

          </div>

          {/* Bottom: session details pinned to bottom */}
          <div className="shrink-0 border-t border-border px-4 pt-3 pb-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Session Name
              </label>
              <input
                type="text"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                placeholder="e.g. Comic Book Fuckery"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description <span className="font-normal text-muted-foreground">optional</span>
              </label>
              <input
                type="text"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                placeholder="e.g. Marvel/DC character themes"
                value={sessionDesc}
                onChange={(e) => setSessionDesc(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Timing */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Timing
              </label>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2">
                  <p className="text-xs text-center leading-tight uppercase tracking-wide text-muted-foreground">
                    Submit window
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitDays((d) => Math.max(1, d - 1))}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[3.5rem] text-center text-sm font-medium text-foreground">
                      {submitDays} day{submitDays !== 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubmitDays((d) => Math.min(14, d + 1))}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2">
                  <p className="text-xs text-center leading-tight uppercase tracking-wide text-muted-foreground">
                    Comment window
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCommentDays((d) => Math.max(1, d - 1))}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[3.5rem] text-center text-sm font-medium text-foreground">
                      {commentDays} day{commentDays !== 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCommentDays((d) => Math.min(14, d + 1))}
                      className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={!hasSessionName || !hasValidTape || creating}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              {creating ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </div>
      )}

      {/* Celebration */}
      {step === 'celebration' && (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <p className="mb-3 text-4xl">🎉</p>
          <h2 className="font-display text-xl font-bold text-foreground">Your session is live!</h2>
          <p className="mt-1 text-sm text-muted-foreground">{sessionName}</p>
          <p className="text-xs text-muted-foreground">
            {tapes.filter((t) => t.name.trim()).length} tape
            {tapes.filter((t) => t.name.trim()).length !== 1 ? 's' : ''} queued
          </p>

          {/* Invite link */}
          <div className="mt-6 w-full">
            <label className="mb-1.5 block text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Invite Link
            </label>
            <div className="flex items-center overflow-hidden rounded-xl border border-border">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="min-w-0 flex-1 bg-secondary px-3 py-2.5 text-sm text-muted-foreground outline-none"
              />
              <button
                onClick={copyLink}
                className="flex items-center gap-1 border-l border-border px-4 py-2.5 text-sm font-semibold text-primary hover:bg-accent"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={shareLink}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Share2 className="h-4 w-4" />
            Share with friends
          </button>

          <button
            onClick={() => navigate(`/session/${createdSessionId}`)}
            className="mt-2 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
          >
            Go to session
          </button>
        </div>
      )}

      {/* Import options modal */}
      {pendingImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-semibold text-foreground">
              Import blueprint
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{pendingImport.name}</span>
              {' — '}
              {pendingImport.tapes.length} tape{pendingImport.tapes.length !== 1 ? 's' : ''}
            </p>

            <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={importOverwriteDetails}
                onChange={(e) => setImportOverwriteDetails(e.target.checked)}
                className="rounded"
              />
              Overwrite session name, description & timing
            </label>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => applyImport(true)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Add tapes
              </button>
              <button
                onClick={() => applyImport(false)}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Replace all
              </button>
            </div>

            <button
              onClick={() => setPendingImport(null)}
              className="mt-2 w-full py-2 text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
