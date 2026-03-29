import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { EmojiPicker } from '@/components/EmojiPicker';

function CommentField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertEmoji(emoji: string) {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      onChange(value.slice(0, start) + emoji + value.slice(end));
      requestAnimationFrame(() => {
        const pos = start + emoji.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      });
    } else {
      onChange(value + emoji);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex rounded-lg border border-border bg-card focus-within:border-border/80">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
          rows={2}
          className="w-full resize-none rounded-lg bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <EmojiPicker onSelect={insertEmoji} />
      </div>
    </div>
  );
}

interface SubmissionRow {
  id: string;
  song_name: string;
  artist_name: string;
  player_id: string;
  cover_art_url: string | null;
}

export function ListenCommentPage({ sessionId, tapeId }: { sessionId: string; tapeId: string }) {
  const navigate = useNavigate();
  const { player } = useAuthContext();

  const [tapeTitle, setTapeTitle] = useState('');
  const [tapePrompt, setTapePrompt] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  const [infoTab, setInfoTab] = useState<'how' | 'import'>('how');

  // Comment state: submissionId -> text, plus '_tape' for tape-level
  const [comments, setComments] = useState<Record<string, string>>({});

  // Existing comments (already submitted by this user)
  const [existingComments, setExistingComments] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    if (!sessionId || !tapeId || !player) return;

    const [tapeRes, subsRes, commentsRes] = await Promise.all([
      supabase.from('tapes').select('title, prompt').eq('id', tapeId).single(),
      supabase
        .from('submissions')
        .select('id, song_name, artist_name, player_id, cover_art_url')
        .eq('tape_id', tapeId),
      supabase
        .from('comments')
        .select('id, submission_id, text')
        .eq('tape_id', tapeId)
        .eq('player_id', player.id),
    ]);

    if (tapeRes.data) {
      setTapeTitle(tapeRes.data.title);
      setTapePrompt(tapeRes.data.prompt);
    }

    // Exclude current user's own submission
    const otherSubs = (subsRes.data ?? []).filter((s) => s.player_id !== player.id);
    setSubmissions(otherSubs);

    // Map existing comments
    const existing: Record<string, string> = {};
    for (const c of commentsRes.data ?? []) {
      const key = c.submission_id ?? '_tape';
      existing[key] = c.text;
    }
    setExistingComments(existing);
    setComments(existing);

    setLoading(false);
  }, [sessionId, tapeId, player]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function switchTab(tab: 'how' | 'import') {
    setInfoTab(tab);
  }

  function copyPlaylistAndOpen() {
    const text = submissions
      .map((s) => (s.artist_name ? `${s.artist_name} - ${s.song_name}` : s.song_name))
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open('https://www.tunemymusic.com/', '_blank');
    switchTab('how');
  }

  function updateComment(key: string, text: string) {
    setComments((prev) => ({ ...prev, [key]: text }));
  }

  async function handleSubmit() {
    if (!tapeId || !player) return;
    setSubmitting(true);

    // Collect non-empty comments that are new or changed
    const inserts: { tape_id: string; player_id: string; submission_id: string | null; text: string }[] = [];

    for (const [key, text] of Object.entries(comments)) {
      const trimmed = text.trim();
      if (!trimmed) continue;
      // Skip if unchanged from existing
      if (existingComments[key] === trimmed) continue;

      inserts.push({
        tape_id: tapeId,
        player_id: player.id,
        submission_id: key === '_tape' ? null : key,
        text: trimmed,
      });
    }

    if (inserts.length > 0) {
      // Delete existing comments by this user on this tape first, then re-insert
      await supabase
        .from('comments')
        .delete()
        .eq('tape_id', tapeId)
        .eq('player_id', player.id);

      // Re-insert all non-empty comments (both changed and unchanged)
      const allInserts: typeof inserts = [];
      for (const [key, text] of Object.entries(comments)) {
        const trimmed = text.trim();
        if (!trimmed) continue;
        allInserts.push({
          tape_id: tapeId,
          player_id: player.id,
          submission_id: key === '_tape' ? null : key,
          text: trimmed,
        });
      }

      await supabase.from('comments').insert(allInserts);
    }

    setShowToast(true);
    setTimeout(() => {
      navigate(-1);
    }, 1200);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const commentedCount = Object.values(comments).filter((t) => t.trim().length > 0).length;

  const hasSongs = submissions.length > 0;

  return (
    <div className="flex flex-1 flex-col">
        {/* Info card with tabs — only show when there are songs */}
        {hasSongs && (
        <div className="border-b border-border">
          <div className="flex border-b border-border">
            <button
              onClick={() => switchTab('how')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors ${infoTab === 'how' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
            >
              Commenting
            </button>
            <button
              onClick={() => switchTab('import')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors ${infoTab === 'import' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
            >
              Import playlist
            </button>
          </div>
          <div className="px-4 py-3">
            {infoTab === 'how' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Comment on a song that surprised you, a pick that nailed the theme, or just what you vibed with.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  If you're low on time or energy, feel free to just leave an emoji or nothing at all. No worries.
                </p>
              </>
            ) : (
              <>
                <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Click the button below to copy the songs and open TuneMyMusic</li>
                  <li>Scroll down and select the "Free text" option, then paste</li>
                  <li>Choose your destination service, log in, and transfer</li>
                </ol>
                <button
                  onClick={copyPlaylistAndOpen}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy Songs & Open Transfer'}
                  {copied ? '' : <ExternalLink className="h-4 w-4" />}
                </button>
              </>
            )}
          </div>
        </div>
        )}

        {/* Tape info */}
        <div className="px-4 py-3">
          <h2 className="font-display text-lg font-semibold leading-snug text-foreground">{tapeTitle}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{tapePrompt}</p>
        </div>

        {/* Song list with comment fields */}
        <div className="flex-1 border-t border-border px-4">
          {submissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No one submitted this round</p>
          ) : (
            submissions.map((s) => (
              <div key={s.id} className="border-b border-border/50 py-3 last:border-0">
                <div className="flex items-center gap-3">
                  {s.cover_art_url ? (
                    <img src={s.cover_art_url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.song_name}</p>
                    {s.artist_name && <p className="text-xs text-muted-foreground">{s.artist_name}</p>}
                  </div>
                </div>
                <CommentField value={comments[s.id] ?? ''} onChange={(v) => updateComment(s.id, v)} />
              </div>
            ))
          )}

          {/* The Tape overall comment */}
          {submissions.length > 0 && (
            <div className="py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">The Tape</p>
              <CommentField value={comments['_tape'] ?? ''} onChange={(v) => updateComment('_tape', v)} />
            </div>
          )}
        </div>

        {/* Submit button */}
        {hasSongs && (
        <div className="border-t border-border p-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {submitting ? 'Sharing...' : `Share comments${commentedCount > 0 ? ` (${commentedCount})` : ''}`}
          </button>
        </div>
        )}

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-background shadow-lg">
          <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Comments shared!</span>
        </div>
      )}
    </div>
  );
}
