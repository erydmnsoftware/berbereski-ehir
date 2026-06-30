import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAppts() {
  const { data, error } = await supabase
    .from('appointments')
    .select('start_time, price, status')
    .eq('status', 'completed');
    
  console.log("All completed appointments:", data);
}

checkAppts();
