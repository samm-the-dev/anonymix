import { cn } from '@/lib/utils';
import type { Player } from '@/lib/types';

interface AvatarRowProps {
  players: Player[];
  className?: string;
}

export function AvatarRow({ players, className }: AvatarRowProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {players.map((player, i) => (
        <div
          key={player.id}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card text-xs font-semibold text-white',
            i > 0 && '-ml-2',
          )}
          style={{ backgroundColor: player.avatarColor }}
          title={player.name}
        >
          {player.avatar}
        </div>
      ))}
    </div>
  );
}
