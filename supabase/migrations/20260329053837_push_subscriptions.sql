CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, endpoint)
);

-- RLS: players can manage their own subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players manage own push subscriptions"
  ON public.push_subscriptions
  FOR ALL
  USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid()));
