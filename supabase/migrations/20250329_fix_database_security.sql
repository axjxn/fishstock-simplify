
-- Enable Row Level Security on stock_purchases table
ALTER TABLE IF EXISTS public.stock_purchases ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view stock purchases
CREATE POLICY IF NOT EXISTS "Enable all users to view stock purchases" 
ON public.stock_purchases
FOR SELECT 
USING (true);

-- Create policy to allow staff to insert stock purchases
CREATE POLICY IF NOT EXISTS "Staff can insert stock purchases" 
ON public.stock_purchases
FOR INSERT 
WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- Create policy to allow staff to update stock purchases
CREATE POLICY IF NOT EXISTS "Staff can update stock purchases" 
ON public.stock_purchases
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

-- Create policy to allow staff to delete stock purchases
CREATE POLICY IF NOT EXISTS "Staff can delete stock purchases" 
ON public.stock_purchases
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- Enable Row Level Security on stock_left table
ALTER TABLE IF EXISTS public.stock_left ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view stock left
CREATE POLICY IF NOT EXISTS "Enable all users to view stock left" 
ON public.stock_left
FOR SELECT 
USING (true);

-- Create policy to allow staff to insert stock left
CREATE POLICY IF NOT EXISTS "Staff can insert stock left" 
ON public.stock_left
FOR INSERT 
WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- Create policy to allow staff to update stock left
CREATE POLICY IF NOT EXISTS "Staff can update stock left" 
ON public.stock_left
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

-- Create policy to allow staff to delete stock left
CREATE POLICY IF NOT EXISTS "Staff can delete stock left" 
ON public.stock_left
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_purchases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_left;
ALTER TABLE public.stock_purchases REPLICA IDENTITY FULL;
ALTER TABLE public.stock_left REPLICA IDENTITY FULL;
