import fs from 'fs';
import path from 'path';

const content = `SECRET_KEY=ec7cd7f207f278ade85419930d88f6d0c1247baf95dddf7f0141fb550b5f8c47

# Supabase Configuration
VITE_SUPABASE_URL=https://upegpousepvjexgxackt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZWdwb3VzZXB2amV4Z3hhY2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM3MzIsImV4cCI6MjA4NDYwOTczMn0.hUfDB1CA4Yj0RKlfn-EoQXVrAK6ekIU-NknYjn3TqoU
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZWdwb3VzZXB2amV4Z3hhY2t0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzczMiwiZXhwIjoyMDg0NjA5NzMyfQ.J2i1HCA_hUxRRP5Ar5tbfTR4vN6m6rZM6iNRmrHHg1o

# Postgres (Supabase)
POSTGRES_URL=postgres://postgres.upegpousepvjexgxackt:qfP2SQY0XNVsJj72@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_PRISMA_URL=postgres://postgres.upegpousepvjexgxackt:qfP2SQY0XNVsJj72@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://postgres.upegpousepvjexgxackt:qfP2SQY0XNVsJj72@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
POSTGRES_USER=postgres
POSTGRES_HOST=db.upegpousepvjexgxackt.supabase.co
POSTGRES_PASSWORD=qfP2SQY0XNVsJj72
POSTGRES_DATABASE=postgres
`;

fs.writeFileSync('.env', content, 'utf8');
console.log('.env file rewritten with UTF-8 encoding');
