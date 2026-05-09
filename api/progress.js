import { kv } from '@vercel/kv';

const PROGRESS_KEY = 'valerie_math_progress';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const data = await kv.get(PROGRESS_KEY);
            return res.status(200).json(data || null);
        } catch (e) {
            return res.status(500).json({ error: 'Failed to load progress' });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            await kv.set(PROGRESS_KEY, body);
            return res.status(200).json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'Failed to save progress' });
        }
    }

    return res.status(405).end();
}
