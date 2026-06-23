export default async function handler(req, res) {
    // 1. Cek Metode HTTP
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    // 2. Cek Origin (Mencegah request dari domain asing)
    const origin = req.headers.origin || '';
    if (origin && !origin.includes('vercel.app') && !origin.includes('localhost')) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { prompt } = req.body;

    // 3. Validasi panjang dan keberadaan prompt
    if (!prompt || typeof prompt !== 'string' || prompt.length > 2000) {
        return res.status(400).json({ error: 'Invalid prompt' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghubungi Gemini' });
    }
}
