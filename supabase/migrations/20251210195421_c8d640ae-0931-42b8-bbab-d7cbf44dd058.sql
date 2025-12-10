-- Create function to increment light points
CREATE OR REPLACE FUNCTION public.increment_light_points(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.light_points 
  SET points = points + 1, updated_at = now()
  WHERE user_id = user_uuid;
END;
$$;