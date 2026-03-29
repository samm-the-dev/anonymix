import * as Popover from '@radix-ui/react-popover';
import { Smile } from 'lucide-react';

const EMOJIS = [
  '🔥', '❤️', '😂', '👏', '🙌', '💯',
  '😍', '🤯', '😭', '🥹', '💀', '👀',
  '✨', '🎵', '🎶', '🎸', '🎤', '🎧',
  '👑', '💜', '🫶', '🤌', '😤', '🫠',
  '💿', '🪩', '⚡', '🌊', '🍄', '🦋',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="shrink-0 self-end px-2 pb-2 text-muted-foreground hover:text-foreground"
        >
          <Smile className="h-4 w-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={4}
          className="z-50 grid grid-cols-6 gap-0.5 rounded-lg border border-border bg-background p-2 shadow-lg"
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-accent"
            >
              {emoji}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
