/**
 * Supabase database types.
 *
 * Regenerate with: npx supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts
 * For now, manually defined to match our schema.
 */

export type TapeStatus = 'upcoming' | 'submitting' | 'playlist_ready' | 'results' | 'skipped';

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          avatar_color: string;
          auth_id: string | null;
          listening_tab: string;
          music_service: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar: string;
          avatar_color: string;
          auth_id?: string | null;
          listening_tab?: string;
          music_service?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string;
          avatar_color?: string;
          auth_id?: string | null;
          listening_tab?: string;
          music_service?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          name: string;
          description: string;
          admin_id: string;
          slug: string;
          ended: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          admin_id: string;
          slug: string;
          ended?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          slug?: string;
          admin_id?: string;
          ended?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sessions_admin_id_fkey';
            columns: ['admin_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      session_players: {
        Row: {
          session_id: string;
          player_id: string;
        };
        Insert: {
          session_id: string;
          player_id: string;
        };
        Update: {
          session_id?: string;
          player_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'session_players_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'session_players_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      tapes: {
        Row: {
          id: string;
          session_id: string;
          title: string;
          prompt: string;
          status: TapeStatus;
          deadline: string | null;
          completed_at: string | null;
          submit_window_hours: number;
          comment_window_hours: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          title: string;
          prompt: string;
          status?: TapeStatus;
          deadline?: string | null;
          completed_at?: string | null;
          submit_window_hours?: number;
          comment_window_hours?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          title?: string;
          prompt?: string;
          status?: TapeStatus;
          deadline?: string | null;
          completed_at?: string | null;
          submit_window_hours?: number;
          comment_window_hours?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'tapes_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          player_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_subscriptions_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      submissions: {
        Row: {
          id: string;
          tape_id: string;
          player_id: string;
          song_name: string;
          artist_name: string;
          deezer_id: string | null;
          release_id: string | null;
          cover_art_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tape_id: string;
          player_id: string;
          song_name: string;
          artist_name?: string;
          deezer_id?: string | null;
          release_id?: string | null;
          cover_art_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tape_id?: string;
          player_id?: string;
          song_name?: string;
          artist_name?: string;
          deezer_id?: string | null;
          release_id?: string | null;
          cover_art_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'submissions_tape_id_fkey';
            columns: ['tape_id'];
            isOneToOne: false;
            referencedRelation: 'tapes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'submissions_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          tape_id: string;
          player_id: string;
          submission_id: string | null;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tape_id: string;
          player_id: string;
          submission_id?: string | null;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tape_id?: string;
          player_id?: string;
          submission_id?: string | null;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_tape_id_fkey';
            columns: ['tape_id'];
            isOneToOne: false;
            referencedRelation: 'tapes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_player_id_fkey';
            columns: ['player_id'];
            isOneToOne: false;
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_submission_id_fkey';
            columns: ['submission_id'];
            isOneToOne: false;
            referencedRelation: 'submissions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tape_status: TapeStatus;
    };
  };
}
