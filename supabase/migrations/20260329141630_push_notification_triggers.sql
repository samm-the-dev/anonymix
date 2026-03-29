-- Enable pg_net for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: send push notifications on tape status changes
CREATE OR REPLACE FUNCTION notify_tape_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_title text;
  v_body text;
  v_session_id uuid;
  v_actor_id uuid;
  v_slug text;
  v_url text;
  v_supabase_url text;
  v_push_secret text;  -- read from Postgres vault
BEGIN
  -- Only fire on specific status transitions
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- Determine notification content
  CASE NEW.status
    WHEN 'submitting' THEN
      v_title := 'New tape!';
      v_body := NEW.title;
    WHEN 'playlist_ready' THEN
      v_title := 'Playlist ready!';
      v_body := NEW.title;
    WHEN 'results' THEN
      v_title := 'Results are in!';
      v_body := NEW.title;
    ELSE
      RETURN NEW; -- No notification for other statuses
  END CASE;

  -- Get session info
  SELECT id, slug INTO v_session_id, v_slug
  FROM public.sessions
  WHERE id = NEW.session_id;

  -- Try to get the actor (may be null for cron-triggered changes)
  BEGIN
    v_actor_id := public.current_player_id();
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  v_url := '/' || v_slug;

  -- Get Supabase URL from config (set via vault or hardcode project URL)
  v_supabase_url := current_setting('app.settings.supabase_url', true);
  IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
    -- Fallback: Anonymix Supabase project URL
    v_supabase_url := 'https://mryuusvhdadbjpupzpol.supabase.co';
  END IF;

  -- Read shared secret from Postgres vault (stored via vault.create_secret)
  SELECT decrypted_secret INTO v_push_secret
  FROM vault.decrypted_secrets
  WHERE name = 'send_push_secret'
  LIMIT 1;

  -- Skip if secret not configured (avoids unauthenticated requests)
  IF v_push_secret IS NULL THEN
    RETURN NEW;
  END IF;

  -- Call send-push Edge Function via pg_net
  PERFORM extensions.http_post(
    url := v_supabase_url || '/functions/v1/send-push',
    body := jsonb_build_object(
      'session_id', v_session_id,
      'title', v_title,
      'body', v_body,
      'url', v_url,
      'exclude_player_id', v_actor_id
    )::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(v_push_secret, '')
    )::jsonb
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_tape_status
  AFTER UPDATE ON public.tapes
  FOR EACH ROW
  EXECUTE FUNCTION notify_tape_status_change();
