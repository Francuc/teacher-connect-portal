-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create teachers table
create table public.teachers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  facebook_profile text,
  show_email boolean default false,
  show_phone boolean default false,
  show_facebook boolean default false,
  bio text not null,
  profile_picture_url text,
  teacher_city text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create teacher_subjects table
create table public.teacher_subjects (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teachers(user_id) on delete cascade not null,
  subject text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, subject)
);

-- Create teacher_school_levels table
create table public.teacher_school_levels (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teachers(user_id) on delete cascade not null,
  school_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, school_level)
);

-- Create teacher_locations table
create table public.teacher_locations (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teachers(user_id) on delete cascade not null,
  location_type text not null,
  price_per_hour decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, location_type)
);

-- Create teacher_regions table
create table public.teacher_regions (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teachers(user_id) on delete cascade not null,
  region text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, region)
);

-- Create teacher_cities table
create table public.teacher_cities (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teachers(user_id) on delete cascade not null,
  city text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, city)
);

-- Enable Row Level Security (RLS)
alter table public.teachers enable row level security;
alter table public.teacher_subjects enable row level security;
alter table public.teacher_school_levels enable row level security;
alter table public.teacher_locations enable row level security;
alter table public.teacher_regions enable row level security;
alter table public.teacher_cities enable row level security;

-- Create policies
create policy "Users can view all teacher profiles"
  on public.teachers for select
  to authenticated, anon
  using (true);

create policy "Users can insert their own teacher profile"
  on public.teachers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own teacher profile"
  on public.teachers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own teacher profile"
  on public.teachers for delete
  to authenticated
  using (auth.uid() = user_id);

-- Policies for teacher_subjects
create policy "Anyone can view teacher subjects"
  on public.teacher_subjects for select
  to authenticated, anon
  using (true);

create policy "Teachers can manage their subjects"
  on public.teacher_subjects for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Policies for teacher_school_levels
create policy "Anyone can view teacher school levels"
  on public.teacher_school_levels for select
  to authenticated, anon
  using (true);

create policy "Teachers can manage their school levels"
  on public.teacher_school_levels for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Policies for teacher_locations
create policy "Anyone can view teacher locations"
  on public.teacher_locations for select
  to authenticated, anon
  using (true);

create policy "Teachers can manage their locations"
  on public.teacher_locations for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Policies for teacher_regions
create policy "Anyone can view teacher regions"
  on public.teacher_regions for select
  to authenticated, anon
  using (true);

create policy "Teachers can manage their regions"
  on public.teacher_regions for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Policies for teacher_cities
create policy "Anyone can view teacher cities"
  on public.teacher_cities for select
  to authenticated, anon
  using (true);

create policy "Teachers can manage their cities"
  on public.teacher_cities for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Create storage bucket for profile pictures
insert into storage.buckets (id, name, public) 
values ('profile-pictures', 'profile-pictures', true);

-- Enable storage bucket RLS
create policy "Anyone can view profile pictures"
  on storage.objects for select
  to public
  using ( bucket_id = 'profile-pictures' );

create policy "Authenticated users can upload profile pictures"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'profile-pictures' );

create policy "Users can update their own profile pictures"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'profile-pictures' );

create policy "Users can delete their own profile pictures"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'profile-pictures' );