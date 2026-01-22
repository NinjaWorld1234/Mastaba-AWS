import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection to:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase credentials missing from .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    try {
        // Try to fetch public table info or just a simple query
        // users table check
        const { data, error, count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Database query error:', error.message);
            // RLS might block this if anon, but connection is still "working" if we get a Supabase error
        } else {
            console.log('Database connection successful! Users count:', count);
        }

        // Auth check
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('Auth service error:', authError.message);
        } else {
            console.log('Auth service reachable.');
        }

    } catch (err) {
        console.error('Connection failed:', err);
    }
}

checkConnection();
