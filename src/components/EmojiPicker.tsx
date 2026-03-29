import { useState, useRef, useCallback, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Smile } from 'lucide-react';

const COLS = 6;

const EMOJIS = [
  // hearts
  '❤️', '💖', '🩷', '🧡', '💛', '💚',
  '💙', '💜', '🖤', '🤍', '🤎', '🫶',
  // faces
  '😂', '😍', '🤯', '😭', '🥹', '💀',
  '😤', '🫠', '🥴', '😮‍💨', '👻', '💅',
  // gestures + reactions
  '🔥', '💯', '👏', '🙌', '🤌', '👀',
  // music + vibes
  '🎵', '🎶', '🎸', '🎤', '💿', '🪩',
  '✨', '⚡', '🌊', '👑', '🦋', '🍄',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener('scroll', handleScroll, { capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const grid = gridRef.current;
    if (!grid) return;
    const buttons = Array.from(grid.querySelectorAll('button'));
    const idx = buttons.indexOf(e.target as HTMLButtonElement);
    if (idx === -1) return;

    let next = -1;
    switch (e.key) {
      case 'ArrowRight': next = idx + 1; break;
      case 'ArrowLeft': next = idx - 1; break;
      case 'ArrowDown': next = idx + COLS; break;
      case 'ArrowUp': next = idx - COLS; break;
      case 'Escape': setOpen(false); return;
      default: return;
    }

    e.preventDefault();
    const wrapped = ((next % buttons.length) + buttons.length) % buttons.length;
    buttons[wrapped].focus();
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
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
          onFocusOutside={(e) => e.preventDefault()}
          className="z-50 grid grid-cols-6 gap-0.5 rounded-lg border border-border bg-background p-2 shadow-lg"
          ref={gridRef}
          onKeyDown={handleKeyDown}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-accent focus:bg-accent focus:outline-none"
            >
              {emoji}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
