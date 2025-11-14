-- Create actions table
CREATE TABLE IF NOT EXISTS public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  decision_id UUID REFERENCES public.decisions(id) ON DELETE SET NULL,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  assigned_to UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'verified', 'overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  verified_date TIMESTAMP WITH TIME ZONE,
  evidence_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  uploaded_by UUID NOT NULL,
  access_roles TEXT[] DEFAULT ARRAY['top_management', 'project_owner', 'project_manager', 'project_officer', 'system_admin'],
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for actions
CREATE POLICY "Users can view actions"
  ON public.actions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create actions"
  ON public.actions FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR 
              has_role(auth.uid(), 'project_manager'::app_role) OR 
              has_role(auth.uid(), 'project_owner'::app_role) OR 
              has_role(auth.uid(), 'system_admin'::app_role));

CREATE POLICY "Assigned users can update actions"
  ON public.actions FOR UPDATE
  USING (auth.uid() = assigned_to OR 
         auth.uid() = owner_id OR 
         has_role(auth.uid(), 'project_manager'::app_role) OR 
         has_role(auth.uid(), 'system_admin'::app_role));

CREATE POLICY "Owners can delete actions"
  ON public.actions FOR DELETE
  USING (auth.uid() = owner_id OR 
         has_role(auth.uid(), 'system_admin'::app_role));

-- RLS Policies for documents
CREATE POLICY "Users can view documents based on roles"
  ON public.documents FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Uploaders can update documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = uploaded_by OR 
         has_role(auth.uid(), 'project_manager'::app_role) OR 
         has_role(auth.uid(), 'project_owner'::app_role) OR 
         has_role(auth.uid(), 'system_admin'::app_role));

CREATE POLICY "Uploaders can delete documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = uploaded_by OR 
         has_role(auth.uid(), 'system_admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_actions_project_id ON public.actions(project_id);
CREATE INDEX idx_actions_assigned_to ON public.actions(assigned_to);
CREATE INDEX idx_actions_status ON public.actions(status);
CREATE INDEX idx_actions_due_date ON public.actions(due_date);
CREATE INDEX idx_documents_project_id ON public.documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);