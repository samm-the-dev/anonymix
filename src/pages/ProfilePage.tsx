import { LogOut } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export function ProfilePage() {
  const { player, user, signOut } = useAuthContext();

  if (!player) return null;

  return (
    <div className="mx-auto max-w-[428px] px-4 pt-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: player.avatarColor + '22', borderColor: player.avatarColor, borderWidth: 2 }}
        >
          {player.avatar}
        </div>
        <h2 className="mt-3 font-display text-xl font-bold text-foreground">{player.name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
