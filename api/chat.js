// Vercel Serverless Function: Streaming Chat Proxy
// - Hides API key and base URL behind server
// - Accepts { model, messages, temperature }
// - Streams upstream SSE back to client

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { model, messages, temperature } = req.body || {};
        if (!model || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Missing model or messages' });
            return;
        }

        const BASE_URL = process.env.AI_BASE_URL || 'https://fast.typegpt.net/v1/chat/completions';
        const API_KEY = process.env.AI_API_KEY || 'sk-WipHVOFIPImYxlZFc7oxeDhQSZWe9nMJDck7QyeOsEs1Q6IC';

        // Build standard OpenAI-style payload
        const payload = {
            model,
            messages,
            temperature: typeof temperature === 'number' ? temperature : 0.7,
            stream: true,
        };

        const upstream = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (!upstream.ok || !upstream.body) {
            const text = await upstream.text().catch(() => '');
            res
                .status(upstream.status || 502)
                .json({ error: 'Upstream error', detail: text || upstream.statusText });
            return;
        }

        // Stream back to client
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        });

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                // Pass through as-is; most providers already prefix lines with `data:`
                res.write(decoder.decode(value));
            }
            // Ensure done sentinel for clients that expect it
            res.write('\n\n');
        } catch (err) {
            // Best-effort finalization
        } finally {
            res.end();
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', detail: String(err && err.message || err) });
    }
};