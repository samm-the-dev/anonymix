import { useState } from 'react';
import { Download, LogOut, Pencil } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const AVATARS = ['🎸', '🎧', '🎹', '🎤', '🥁', '🎺', '🎵', '🎶', '🎻', '🪗', '🎷', '🪘'];

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export function ProfilePage() {
  const { player, user, signOut, updatePlayer } = useAuthContext();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player?.name ?? '');
  const [avatar, setAvatar] = useState(player?.avatar ?? '🎸');
  const [color, setColor] = useState(player?.avatarColor ?? '#6366f1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!player) return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await updatePlayer(name.trim(), avatar, color);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName(player!.name);
    setAvatar(player!.avatar);
    setColor(player!.avatarColor);
    setEditing(false);
    setError(null);
  }

  return (
    <div className="px-4 pt-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: (editing ? color : player.avatarColor) + '22', borderColor: editing ? color : player.avatarColor, borderWidth: 2 }}
        >
          {editing ? avatar : player.avatar}
        </div>
        {!editing ? (
          <>
            <h2 className="mt-3 font-display text-xl font-bold text-foreground">{player.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:opacity-80"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit profile
            </button>
          </>
        ) : (
          <div className="mt-4 w-full max-w-sm">
            {/* Name */}
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Display name
            </label>
            <input
              type="text"
              autoFocus
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {/* Avatar picker */}
            <p className="mb-1.5 text-sm font-medium text-card-foreground">Avatar</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-colors ${
                    avatar === a ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Color picker */}
            <p className="mb-1.5 text-sm font-medium text-card-foreground">Color</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-foreground' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Install App */}
      {canInstall && (
        <button
          onClick={promptInstall}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-4 w-4" />
          Install Anonymix
        </button>
      )}

      {/* Sign Out */}
      <button
        onClick={signOut}
        className={`${canInstall ? 'mt-3' : 'mt-8'} flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent`}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
