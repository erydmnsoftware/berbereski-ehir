import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: allAppts, error } = await supabase
    .from('appointments')
    .select(`id, start_time, status, price, customer_id, service_id, services (name)`)
    .order('start_time', { ascending: false });

  if (error) console.error("Error:", error);
  console.log("Appts:", JSON.stringify(allAppts, null, 2));
}

checkData();
