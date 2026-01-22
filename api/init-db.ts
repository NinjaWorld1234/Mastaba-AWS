import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for the admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Initializing Supabase DB and Auth users...');

        const usersToCreate = [
            {
                email: 'admin@example.com',
                password: 'admin123',
                data: { name: 'مدير النظام', name_en: 'System Admin' },
                role: 'admin'
            },
            {
                email: 'ahmed@example.com',
                password: '123456',
                data: { name: 'أحمد محمد', name_en: 'Ahmed Mohamed' },
                role: 'student'
            }
        ];

        const results = [];

        for (const user of usersToCreate) {
            // 1. Create in Supabase Auth
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: user.data
            });

            if (authError) {
                if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
                    results.push(`${user.email}: Already exists in Auth.`);
                } else {
                    results.push(`${user.email}: Auth error - ${authError.message}`);
                    continue;
                }
            } else {
                results.push(`${user.email}: Created successfully in Auth.`);
            }

            // 2. Create/Sync in Public Profile
            const userId = authData?.user?.id;
            if (userId) {
                const { error: profileError } = await supabaseAdmin
                    .from('users')
                    .upsert({
                        id: userId,
                        email: user.email,
                        name: user.data.name,
                        name_en: user.data.name_en,
                        role: user.role,
                        email_verified: true,
                        status: 'active',
                        join_date: new Date().toISOString().split('T')[0]
                    });

                if (profileError) {
                    results.push(`${user.email}: Profile sync error - ${profileError.message}`);
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Database and Auth initialization complete.',
            results: results
        });

    } catch (error: any) {
        console.error('Initialization error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
