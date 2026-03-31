import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';
import { EmojiPicker } from '@/components/EmojiPicker';
import { ExternalLink } from 'lucide-react';
import { ListeningSection } from '@/components/ListeningSection';
import { buildSongSearchUrl, PLATFORM_LABELS, type MusicPlatform } from '@/hooks/musicPlatforms';
import { seededShuffle } from '@/lib/seededShuffle';

function CommentField({ value, onChange, isDraft }: { value: string; onChange: (v: string) => void; isDraft?: boolean }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  useEffect(() => { autoResize(); }, [value]);

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
        autoResize();
      });
    } else {
      onChange(value + emoji);
    }
  }

  return (
    <div className="mt-3">
      <div className={`flex rounded-lg border bg-card focus-within:border-border/80 ${isDraft ? 'border-amber-500/40' : 'border-border'}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            autoResize();
          }}
          placeholder=""
          rows={1}
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
  deezer_id: string | null;
  cover_art_url: string | null;
}

export function ListenCommentPage({ sessionId, tapeId, ended = false }: { sessionId: string; tapeId: string; ended?: boolean }) {
  const navigate = useNavigate();
  const { player } = useAuthContext();

  const [tapeTitle, setTapeTitle] = useState('');
  const [tapePrompt, setTapePrompt] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [musicService, setMusicService] = useState<MusicPlatform | null>(null);

  const [infoTab, setInfoTab] = useState<'commenting' | 'listening'>('listening');

  // Comment state: submissionId -> text, plus '_tape' for tape-level
  const [comments, setComments] = useState<Record<string, string>>({});
  const draftKey = `anonymix-draft-comments-${tapeId}`;

  // Existing comments (already submitted by this user)
  const [existingComments, setExistingComments] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    if (!sessionId || !tapeId || !player) return;

    const [tapeRes, subsRes, commentsRes] = await Promise.all([
      supabase.from('tapes').select('title, prompt').eq('id', tapeId).single(),
      supabase
        .from('submissions')
        .select('id, song_name, artist_name, player_id, deezer_id, cover_art_url')
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
      document.title = `${tapeRes.data.title} | Anonymix`;
    }

    setSubmissions(seededShuffle(subsRes.data ?? [], tapeId));

    // Map existing comments
    const existing: Record<string, string> = {};
    for (const c of commentsRes.data ?? []) {
      const key = c.submission_id ?? '_tape';
      existing[key] = c.text;
    }
    setExistingComments(existing);

    // Load drafts from localStorage, overlay on top of submitted comments
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const drafts = JSON.parse(saved) as Record<string, string>;
        setComments({ ...existing, ...drafts });
      } else {
        setComments(existing);
      }
    } catch {
      setComments(existing);
    }

    setLoading(false);
  }, [sessionId, tapeId, player, draftKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced draft save to localStorage
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      // Only save keys that differ from submitted comments
      const drafts: Record<string, string> = {};
      for (const [key, text] of Object.entries(comments)) {
        if (text !== (existingComments[key] ?? '')) {
          drafts[key] = text;
        }
      }
      if (Object.keys(drafts).length > 0) {
        localStorage.setItem(draftKey, JSON.stringify(drafts));
      } else {
        localStorage.removeItem(draftKey);
      }
    }, 500);
    return () => clearTimeout(saveTimerRef.current);
  }, [comments, existingComments, draftKey]);

  function switchTab(tab: 'commenting' | 'listening') {
    setInfoTab(tab);
  }

  function updateComment(key: string, text: string) {
    setComments((prev) => ({ ...prev, [key]: text }));
  }

  async function handleSubmit() {
    if (!tapeId || !player) return;
    setSubmitting(true);

    try {
      // Always delete existing comments first, then re-insert non-empty ones
      const { error: delError } = await supabase
        .from('comments')
        .delete()
        .eq('tape_id', tapeId)
        .eq('player_id', player.id);
      if (delError) throw delError;

      const inserts: { tape_id: string; player_id: string; submission_id: string | null; text: string }[] = [];
      for (const [key, text] of Object.entries(comments)) {
        const trimmed = text.trim();
        if (!trimmed) continue;
        inserts.push({
          tape_id: tapeId,
          player_id: player.id,
          submission_id: key === '_tape' ? null : key,
          text: trimmed,
        });
      }

      if (inserts.length > 0) {
        const { error } = await supabase.from('comments').insert(inserts);
        if (error) throw error;
      }

      // Clear drafts after successful submit — store trimmed non-empty values
      localStorage.removeItem(draftKey);
      const saved: Record<string, string> = {};
      for (const [key, text] of Object.entries(comments)) {
        const trimmed = text.trim();
        if (trimmed) saved[key] = trimmed;
      }
      setExistingComments(saved);

      toast.success('Comments shared!');
      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch {
      setSubmitting(false);
      toast.error('Failed to save comments');
    }
  }

  if (loading) {
    return (
      <Spinner />
    );
  }

  const commentedCount = Object.values(comments).filter((t) => t.trim().length > 0).length;

  const hasSongs = submissions.length > 0;

  return (
    <div className="flex flex-1 flex-col">
        {/* Info card with tabs — only show when there are songs */}
        {hasSongs && (
        <div className="border-b border-border">
          <div className="flex border-b border-border mb-3">
            <button
              onClick={() => switchTab('listening')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors ${infoTab === 'listening' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
            >
              Listening
            </button>
            <button
              onClick={() => switchTab('commenting')}
              className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors ${infoTab === 'commenting' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
            >
              Commenting
            </button>
          </div>
          {infoTab === 'commenting' ? (
            <div className="px-4 pb-3">
              <p className="text-sm text-muted-foreground">
                Comment on a song that surprised you, a pick that nailed the theme, or just what you vibed with.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                If you're low on time or energy, feel free to just leave an emoji or nothing at all. No worries.
              </p>
            </div>
          ) : (
            <ListeningSection songs={submissions} playlistTitle={tapeTitle} playlistDescription={tapePrompt} onServiceChange={setMusicService} />
          )}
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.song_name}</p>
                    {s.artist_name && <p className="text-xs text-muted-foreground">{s.artist_name}</p>}
                  </div>
                  {s.player_id === player?.id && (
                    <span className="shrink-0 text-xs leading-none font-semibold uppercase tracking-wide text-muted-foreground">
                      Your pick
                    </span>
                  )}
                  {musicService && (
                    <a href={buildSongSearchUrl(s.song_name, s.artist_name, musicService)} target="_blank" rel="noopener noreferrer" aria-label={`Search on ${PLATFORM_LABELS[musicService]}`} className="-mt-px shrink-0 text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <CommentField value={comments[s.id] ?? ''} onChange={(v) => updateComment(s.id, v)} isDraft={(comments[s.id] ?? '') !== (existingComments[s.id] ?? '')} />
              </div>
            ))
          )}

          {/* The Tape overall comment */}
          {submissions.length > 0 && (
            <div className="py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">The Tape</p>
              <CommentField value={comments['_tape'] ?? ''} onChange={(v) => updateComment('_tape', v)} isDraft={(comments['_tape'] ?? '') !== (existingComments['_tape'] ?? '')} />
            </div>
          )}
        </div>

        {/* Submit button */}
        {hasSongs && !ended && (
        <div className="border-t border-border p-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {submitting ? 'Sharing...' : `Share comments (${commentedCount}/${submissions.length + 1})`}
          </button>
        </div>
        )}

    </div>
  );
}
