import { describe, it, expect } from 'vitest';
import { generateXspf, generateCsv } from './playlistExport';

const tracks = [
  { song_name: 'Bohemian Rhapsody', artist_name: 'Queen' },
  { song_name: 'Hey Jude', artist_name: 'The Beatles' },
];

describe('generateXspf', () => {
  it('generates valid XSPF with playlist title and tracks', () => {
    const result = generateXspf(tracks, { title: 'My Tape' });
    expect(result).toContain('<?xml version="1.0"');
    expect(result).toContain('<title>My Tape</title>');
    expect(result).toContain('<title>Bohemian Rhapsody</title>');
    expect(result).toContain('<creator>Queen</creator>');
    expect(result).toContain('<title>Hey Jude</title>');
    expect(result).toContain('<creator>The Beatles</creator>');
  });

  it('includes annotation when description provided', () => {
    const result = generateXspf(tracks, { title: 'Tape', description: 'Songs about love' });
    expect(result).toContain('<annotation>Songs about love</annotation>');
  });

  it('omits annotation when no description', () => {
    const result = generateXspf(tracks, { title: 'Tape' });
    expect(result).not.toContain('<annotation>');
  });

  it('escapes XML special characters', () => {
    const result = generateXspf(
      [{ song_name: 'Rock & Roll', artist_name: 'Led <Zeppelin>' }],
      { title: 'R&B "Hits"' },
    );
    expect(result).toContain('Rock &amp; Roll');
    expect(result).toContain('Led &lt;Zeppelin&gt;');
    expect(result).toContain('R&amp;B &quot;Hits&quot;');
  });

  it('handles track with empty artist', () => {
    const result = generateXspf(
      [{ song_name: 'Unknown', artist_name: '' }],
    );
    expect(result).toContain('<title>Unknown</title>');
    expect(result).not.toContain('<creator>');
  });
});

describe('generateCsv', () => {
  it('generates CSV with header and rows', () => {
    const result = generateCsv(tracks);
    const lines = result.split('\n');
    expect(lines[0]).toBe('Title,Artist');
    expect(lines[1]).toBe('Bohemian Rhapsody,Queen');
    expect(lines[2]).toBe('Hey Jude,The Beatles');
  });

  it('quotes fields containing commas', () => {
    const result = generateCsv(
      [{ song_name: 'Hello, Goodbye', artist_name: 'Earth, Wind & Fire' }],
    );
    const lines = result.split('\n');
    expect(lines[1]).toBe('"Hello, Goodbye","Earth, Wind & Fire"');
  });

  it('escapes double quotes in fields', () => {
    const result = generateCsv(
      [{ song_name: 'Say "Hello"', artist_name: 'Artist' }],
    );
    expect(result).toContain('"Say ""Hello"""');
  });
});
