#!/usr/bin/env bash
# Run Supabase advisors, filtering out dismissed warnings.
# Dismissed warnings are listed in supabase/advisor-ignore (one cache_key per line).

IGNORE_FILE="supabase/advisor-ignore"
RAW=$(npx supabase db advisors --linked -o json 2>/dev/null)

if [ ! -f "$IGNORE_FILE" ]; then
  echo "$RAW"
  exit 0
fi

# Filter out ignored warnings by cache_key
echo "$RAW" | node -e "
const fs = require('fs');
const ignore = fs.readFileSync('$IGNORE_FILE', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const items = JSON.parse(input);
    const kept = items.filter(i => !ignore.includes(i.cache_key));
    if (kept.length === 0) {
      console.log('No advisor issues.');
    } else {
      kept.forEach(i => console.log('[' + i.level + '] ' + i.title + ': ' + i.detail));
      process.exit(1);
    }
  } catch {
    process.stdout.write(input);
  }
});
"
