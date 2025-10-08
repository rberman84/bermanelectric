-- Add admin SELECT policy for service_requests
CREATE POLICY "Admins can view all service requests"
ON public.service_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add admin UPDATE policy for service_requests
CREATE POLICY "Admins can update all service requests"
ON public.service_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));