import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log("Deleting customers...");
  const { data, error } = await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error("Error deleting customers:", error);
  } else {
    console.log("Deleted customers.");
  }
}

clearData();
