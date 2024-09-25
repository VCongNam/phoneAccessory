import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvsjmtyunxlaoneqvklm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2ptdHl1bnhsYW9uZXF2a2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzM1ODksImV4cCI6MjA0MjI0OTU4OX0.RUC-aASY0Jkeyo5CtIB0lLyHiu1jlXafQchilyObQs8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
