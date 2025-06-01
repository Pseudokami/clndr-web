// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fboornlerulciwhclhmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib29ybmxlcnVsY2l3aGNsaG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDU0MTQsImV4cCI6MjA2NDIyMTQxNH0.Bs0LHkpSwctbfOUNbjD35lm-CgwcaB1bEEyRiTWcOV0';

export const supabase = createClient(supabaseUrl, supabaseKey);