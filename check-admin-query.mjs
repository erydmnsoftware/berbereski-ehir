import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAppts() {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id, start_time, created_at, status, price,
      customers (id, name, phone)
    `)
    .order('start_time', { ascending: false });
    
  console.log("Error:", error);
  console.log("Appointments:", JSON.stringify(appointments, null, 2));
}

checkAppts();
