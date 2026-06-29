import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: customers } = await supabase.from('customers').select('*');
  const { data: appointments } = await supabase.from('appointments').select('*');
  
  console.log("Customers:");
  console.log(JSON.stringify(customers, null, 2));
  
  console.log("\nAppointments:");
  console.log(JSON.stringify(appointments, null, 2));
}

checkData();
