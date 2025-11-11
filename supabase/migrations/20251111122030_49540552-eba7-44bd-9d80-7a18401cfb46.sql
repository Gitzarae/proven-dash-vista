-- Create enum for user roles (CRITICAL: Separate table for security)
CREATE TYPE public.app_role AS ENUM ('top_management', 'project_owner', 'project_manager', 'project_officer', 'system_admin');

-- Create user_roles table (security-first approach)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- FR1: Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  priority TEXT NOT NULL DEFAULT 'medium',
  owner_id UUID NOT NULL,
  manager_id UUID,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  spent_budget DECIMAL(15,2) DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  spi DECIMAL(3,2),
  cpi DECIMAL(3,2),
  location TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- FR1: Milestones table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- FR1: Risks table
CREATE TABLE public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  probability TEXT NOT NULL DEFAULT 'medium',
  mitigation_plan TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  identified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

-- FR2: Meetings table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_url TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  organizer_id UUID NOT NULL,
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- FR2: Meeting attendees
CREATE TABLE public.meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  attendance_status TEXT DEFAULT 'invited',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);

ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

-- FR2: Agenda items
CREATE TABLE public.agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  presenter_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;

-- FR4: Decisions table
CREATE TABLE public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  decision_date DATE,
  impact TEXT,
  rationale TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

-- FR5: Issues table
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID,
  reported_by UUID NOT NULL,
  due_date DATE,
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_breach BOOLEAN DEFAULT false,
  escalated_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- FR7: Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- FR7: Audit logs table (immutable)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies: User Roles (read-only for users)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'system_admin'));

-- RLS Policies: Projects
CREATE POLICY "All authenticated users can view projects"
  ON public.projects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Project owners and managers can update"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = owner_id OR 
    auth.uid() = manager_id OR
    public.has_role(auth.uid(), 'system_admin') OR
    public.has_role(auth.uid(), 'top_management')
  );

CREATE POLICY "Authorized users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'project_owner') OR
    public.has_role(auth.uid(), 'project_manager') OR
    public.has_role(auth.uid(), 'system_admin')
  );

CREATE POLICY "Authorized users can delete projects"
  ON public.projects FOR DELETE
  USING (
    public.has_role(auth.uid(), 'project_owner') OR
    public.has_role(auth.uid(), 'system_admin')
  );

-- RLS Policies: Milestones
CREATE POLICY "Users can view milestones"
  ON public.milestones FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Project team can manage milestones"
  ON public.milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = milestones.project_id
      AND (owner_id = auth.uid() OR manager_id = auth.uid())
    ) OR
    public.has_role(auth.uid(), 'system_admin')
  );

-- RLS Policies: Risks
CREATE POLICY "Users can view risks"
  ON public.risks FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Project team can manage risks"
  ON public.risks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = risks.project_id
      AND (owner_id = auth.uid() OR manager_id = auth.uid())
    ) OR
    public.has_role(auth.uid(), 'system_admin')
  );

-- RLS Policies: Meetings
CREATE POLICY "Users can view meetings"
  ON public.meetings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Organizers and admins can manage meetings"
  ON public.meetings FOR ALL
  USING (
    auth.uid() = organizer_id OR
    public.has_role(auth.uid(), 'system_admin')
  );

-- RLS Policies: Decisions
CREATE POLICY "Users can view decisions"
  ON public.decisions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and creators can manage decisions"
  ON public.decisions FOR ALL
  USING (
    auth.uid() = owner_id OR
    auth.uid() = created_by OR
    public.has_role(auth.uid(), 'system_admin') OR
    public.has_role(auth.uid(), 'top_management')
  );

-- RLS Policies: Issues
CREATE POLICY "Users can view issues"
  ON public.issues FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create issues"
  ON public.issues FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Assigned users can update issues"
  ON public.issues FOR UPDATE
  USING (
    auth.uid() = assigned_to OR
    auth.uid() = reported_by OR
    public.has_role(auth.uid(), 'project_manager') OR
    public.has_role(auth.uid(), 'system_admin')
  );

-- RLS Policies: Notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies: Audit Logs (read-only for admins)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'system_admin'));

-- RLS Policies: Meeting attendees, Agenda items (inherit from meetings)
CREATE POLICY "Users can view meeting attendees"
  ON public.meeting_attendees FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view agenda items"
  ON public.agenda_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON public.decisions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();