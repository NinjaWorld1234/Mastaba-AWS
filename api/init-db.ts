import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // 1. Enable UUID Extension
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        // 2. Create Users Table
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        name_en TEXT,
        role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
        avatar TEXT,
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        streak INTEGER DEFAULT 0,
        join_date DATE DEFAULT CURRENT_DATE,
        phone TEXT,
        location TEXT,
        bio TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        whatsapp TEXT,
        country TEXT,
        age INTEGER,
        gender TEXT,
        education_level TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_code TEXT,
        verification_expiry TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

        // 3. Create Courses Table
        await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        title_en TEXT,
        instructor TEXT,
        instructor_en TEXT,
        category TEXT,
        category_en TEXT,
        duration TEXT,
        duration_en TEXT,
        thumbnail TEXT,
        description TEXT,
        description_en TEXT,
        lessons_count INTEGER DEFAULT 0,
        students_count INTEGER DEFAULT 0,
        video_url TEXT,
        status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
        passing_score INTEGER DEFAULT 80,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

        // 4. Create Episodes Table
        await sql`
      CREATE TABLE IF NOT EXISTS episodes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        video_url TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        duration TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

        // 5. Create Enrollments Table
        await sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0,
        last_access TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      );
    `;

        // 6. Create Indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));`;
        await sql`CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);`;

        // 7. Seed Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        await sql`
      INSERT INTO users (id, email, password, name, role, email_verified)
      VALUES (
        'a0000000-0000-0000-0000-000000000001',
        'admin@example.com',
        ${adminPassword},
        'مدير النظام',
        'admin',
        TRUE
      ) ON CONFLICT (email) DO NOTHING;
    `;

        // 8. Seed Student User
        const studentPassword = await bcrypt.hash('123456', 10);
        await sql`
      INSERT INTO users (id, email, password, name, role, email_verified)
      VALUES (
        'a0000000-0000-0000-0000-000000000002',
        'ahmed@example.com',
        ${studentPassword},
        'أحمد محمد',
        'student',
        TRUE
      ) ON CONFLICT (email) DO NOTHING;
    `;

        return res.status(200).json({
            success: true,
            message: 'Database initialized successfully! Tables created and data seeded.'
        });

    } catch (error) {
        console.error('Init DB Error:', error);
        return res.status(500).json({
            error: 'Failed to initialize database',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
