
-- Create table for custom applications
CREATE TABLE public.custom_apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'app-window',
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for custom app fields
CREATE TABLE public.custom_app_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.custom_apps(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'datetime', 'select', 'multiselect', 'checkbox', 'file', 'calculation', 'reference')),
  is_required BOOLEAN DEFAULT false,
  options JSONB, -- For select/multiselect options, calculation formulas, etc.
  validation_rules JSONB, -- Min/max values, regex patterns, etc.
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for custom app records (data entries)
CREATE TABLE public.custom_app_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.custom_apps(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users NOT NULL,
  updated_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for workflows
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.custom_apps(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('create', 'update', 'delete', 'field_change', 'scheduled')),
  trigger_conditions JSONB DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for workflow executions (audit trail)
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  record_id UUID REFERENCES public.custom_app_records(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message TEXT,
  execution_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for custom_apps
ALTER TABLE public.custom_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view apps in their organization"
  ON public.custom_apps FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and Managers can manage apps"
  ON public.custom_apps FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('Admin', 'Manager')
    )
  );

-- Add RLS policies for custom_app_fields
ALTER TABLE public.custom_app_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fields for accessible apps"
  ON public.custom_app_fields FOR SELECT
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and Managers can manage app fields"
  ON public.custom_app_fields FOR ALL
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('Admin', 'Manager')
      )
    )
  );

-- Add RLS policies for custom_app_records
ALTER TABLE public.custom_app_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view records for accessible apps"
  ON public.custom_app_records FOR SELECT
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage records for accessible apps"
  ON public.custom_app_records FOR ALL
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- Add RLS policies for workflows
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows for accessible apps"
  ON public.workflows FOR SELECT
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and Managers can manage workflows"
  ON public.workflows FOR ALL
  USING (
    app_id IN (
      SELECT id FROM public.custom_apps
      WHERE organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('Admin', 'Manager')
      )
    )
  );

-- Add RLS policies for workflow_executions
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflow executions for accessible apps"
  ON public.workflow_executions FOR SELECT
  USING (
    workflow_id IN (
      SELECT w.id FROM public.workflows w
      JOIN public.custom_apps ca ON w.app_id = ca.id
      WHERE ca.organization_id IN (
        SELECT organization_id FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX idx_custom_apps_organization_id ON public.custom_apps(organization_id);
CREATE INDEX idx_custom_app_fields_app_id ON public.custom_app_fields(app_id);
CREATE INDEX idx_custom_app_fields_position ON public.custom_app_fields(app_id, position);
CREATE INDEX idx_custom_app_records_app_id ON public.custom_app_records(app_id);
CREATE INDEX idx_workflows_app_id ON public.workflows(app_id);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
