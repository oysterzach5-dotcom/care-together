CREATE TABLE public.caregivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_seed text NOT NULL,
  area text NOT NULL,
  bio text NOT NULL,
  hourly_rate numeric NOT NULL,
  years_experience int NOT NULL,
  rating numeric NOT NULL DEFAULT 4.8,
  languages text[] NOT NULL DEFAULT '{}',
  tasks text[] NOT NULL DEFAULT '{}',
  patient_types text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT true,
  available_live_in boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.caregivers TO anon, authenticated;
GRANT ALL ON public.caregivers TO service_role;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view caregivers" ON public.caregivers FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  caregiver_id uuid NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  patient_type text NOT NULL,
  tasks text[] NOT NULL DEFAULT '{}',
  start_date date NOT NULL,
  hours_per_day int NOT NULL DEFAULT 4,
  days int NOT NULL DEFAULT 1,
  address text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own bookings select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own bookings insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own bookings update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own bookings delete" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.caregivers (name, photo_seed, area, bio, hourly_rate, years_experience, rating, languages, tasks, patient_types, available_live_in) VALUES
('Maria Fernando','women/44','Colombo','Warm, patient caregiver specialising in dementia support and daily routines.',1500,9,4.9,'{English,Sinhala}','{Personal care,Medication reminders,Companionship,Meal preparation}','{Dementia / Alzheimer''s,General elderly care}',true),
('Nimal Perera','men/32','Kandy','Former nursing assistant, strong with mobility and post-surgery recovery.',1800,12,4.8,'{Sinhala,English}','{Mobility assistance,Post-surgery care,Physiotherapy support,Personal care}','{Post-surgery recovery,Mobility impaired}',false),
('Ayesha Rahman','women/65','Colombo','Compassionate companion with palliative care training.',2000,7,5.0,'{English,Tamil}','{Palliative care,Companionship,Medication reminders}','{Palliative / end-of-life,Bedridden}',true),
('Kavindu Silva','men/41','Galle','Friendly and reliable, great with errands, transport and light housekeeping.',1200,4,4.6,'{Sinhala}','{Errands & transport,Light housekeeping,Companionship}','{General elderly care}',false),
('Priya Navaratnam','women/22','Jaffna','Experienced with diabetes management, diet planning and vitals monitoring.',1600,10,4.9,'{Tamil,English}','{Medication reminders,Vitals monitoring,Meal preparation}','{Diabetes,Heart conditions}',true),
('Dilani Jayasinghe','women/12','Negombo','Certified caregiver for bedridden patients, skilled in hygiene and wound care.',1900,11,4.7,'{Sinhala,English}','{Personal care,Wound care,Mobility assistance}','{Bedridden,Stroke recovery}',true),
('Ruwan Bandara','men/76','Kandy','Calm night-care specialist with stroke rehabilitation experience.',1700,8,4.8,'{Sinhala}','{Overnight care,Physiotherapy support,Personal care}','{Stroke recovery,Parkinson''s}',true),
('Fathima Nazeer','women/90','Galle','Gentle companion who loves conversation, reading and walks.',1100,3,4.5,'{Tamil,Sinhala,English}','{Companionship,Errands & transport,Meal preparation}','{General elderly care,Dementia / Alzheimer''s}',false),
('Suresh Kumar','men/52','Colombo','Registered nurse offering clinical home care and medication management.',2500,15,5.0,'{English,Tamil,Sinhala}','{Wound care,Vitals monitoring,Medication reminders,Post-surgery care}','{Heart conditions,Post-surgery recovery,Diabetes}',false),
('Chamari Wickrama','women/33','Negombo','Patient, cheerful carer with Parkinson''s and mobility support experience.',1400,6,4.7,'{Sinhala,English}','{Mobility assistance,Personal care,Light housekeeping}','{Parkinson''s,Mobility impaired}',true);