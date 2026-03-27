/** A portable session definition — no IDs, no server state */
export interface SessionBlueprint {
  version: 1;
  name: string;
  description: string;
  submitDays: number;
  commentDays: number;
  tapes: { name: string; prompt: string }[];
}

export function exportBlueprint(blueprint: SessionBlueprint): string {
  return JSON.stringify(blueprint, null, 2);
}

export function importBlueprint(json: string): SessionBlueprint | null {
  try {
    const data = JSON.parse(json);
    if (data.version !== 1 || !data.name || !Array.isArray(data.tapes)) return null;
    return {
      version: 1,
      name: data.name,
      description: data.description ?? '',
      submitDays: data.submitDays ?? 2,
      commentDays: data.commentDays ?? 5,
      tapes: data.tapes
        .filter((t: { name?: string }) => t.name)
        .map((t: { name: string; prompt?: string }) => ({
          name: t.name,
          prompt: t.prompt ?? '',
        })),
    };
  } catch {
    return null;
  }
}

export function downloadBlueprint(blueprint: SessionBlueprint) {
  const blob = new Blob([exportBlueprint(blueprint)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${blueprint.name.toLowerCase().replace(/\s+/g, '-')}.anonymix.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function pickAndImportBlueprint(): Promise<SessionBlueprint | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.anonymix.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const text = await file.text();
      resolve(importBlueprint(text));
    };
    input.click();
  });
}
