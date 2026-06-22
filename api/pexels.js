export default async function handler(req, res) {
    const { query } = req.query;
    // Mengambil kunci rahasia dari Environment Variables Vercel
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