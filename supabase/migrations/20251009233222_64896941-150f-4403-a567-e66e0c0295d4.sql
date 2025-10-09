-- Fix profiles table: Ensure only authenticated users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Fix service_requests table: Ensure only authenticated users can view their own requests
DROP POLICY IF EXISTS "Users can view their own service requests" ON public.service_requests;
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix service_requests table: Ensure only authenticated admins can view all requests
DROP POLICY IF EXISTS "Admins can view all service requests" ON public.service_requests;
CREATE POLICY "Admins can view all service requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles table: Ensure only authenticated users can view their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);