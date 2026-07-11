const ALLOWED = ['https://ai-gift-prediction.vercel.app', 'http://localhost', 'http://127.0.0.1'];
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const origin = req.headers.origin || req.headers.referer || '';
  if (origin && !ALLOWED.some(o => origin.startsWith(o))) return res.status(403).json({ error: 'Forbidden' });
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.length > 2500) return res.status(400).json({ error: 'Invalid prompt' });
  const keywords = ['kado', 'rekomendasi', 'hobi', 'budget', 'usia'];
  if (!keywords.some(k => prompt.toLowerCase().includes(k))) return res.status(400).json({ error: 'Invalid request' });
  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'Config error' });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!r.ok) return res.status(502).json({ error: 'Upstream error' });
    return res.status(200).json(await r.json());
  } catch { return res.status(500).json({ error: 'Server error' }); }
}
