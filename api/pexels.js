const ALLOWED = ['https://ai-gift-prediction.vercel.app', 'http://localhost', 'http://127.0.0.1'];
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const origin = req.headers.origin || req.headers.referer || '';
  if (origin && !ALLOWED.some(o => origin.startsWith(o))) return res.status(403).json({ error: 'Forbidden' });
  const { query } = req.query;
  if (!query || typeof query !== 'string' || query.length > 200) return res.status(400).json({ error: 'Invalid query' });
  const KEY = process.env.PEXELS_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'Config error' });
  try {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, { headers: { Authorization: KEY } });
    if (!r.ok) return res.status(502).json({ error: 'Upstream error' });
    return res.status(200).json(await r.json());
  } catch { return res.status(500).json({ error: 'Server error' }); }
}
