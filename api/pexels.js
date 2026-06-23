export default async function handler(req, res) {
    // 1. Cek Metode HTTP
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    // 2. Cek Origin
    const origin = req.headers.origin || '';
    if (origin && !origin.includes('vercel.app') && !origin.includes('localhost')) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { query } = req.query;

    // 3. Validasi query pencarian
    if (!query || typeof query !== 'string' || query.length > 200) {
        return res.status(400).json({ error: 'Invalid query' });
    }

    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghubungi Pexels' });
    }
}
