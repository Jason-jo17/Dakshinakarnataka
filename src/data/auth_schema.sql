-- Auth and Work Assignment Schema

-- Users Table (for handling generated credentials)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In a real app, store bcrypt hash. For demo simplicity, might be plain text if strictly local.
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'district_admin', 'institution', 'company', 'coe', 'training_center', 'guest')),
    entity_id VARCHAR(255), -- Links to the specific institution/company ID
    entity_name VARCHAR(255), -- Denormalized name for easier display
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Work Assignments Table
CREATE TABLE IF NOT EXISTS public.work_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.users(id),
    assigned_by UUID REFERENCES public.users(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Draft)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (auth.role() = 'super_admin');
