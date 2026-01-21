import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(200).json({
        success: true,
        message: 'Minimal login endpoint reached',
        nodeVersion: process.version,
        env: process.env.NODE_ENV
    });
}
