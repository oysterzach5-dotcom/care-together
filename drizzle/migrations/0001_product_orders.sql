CREATE TABLE public.product_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product text NOT NULL DEFAULT 'Smart Medicine Box',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  payment_method text NOT NULL DEFAULT 'Cash on delivery',
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_orders TO authenticated;
GRANT ALL ON public.product_orders TO service_role;
ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own orders select" ON public.product_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own orders insert" ON public.product_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own orders update" ON public.product_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);