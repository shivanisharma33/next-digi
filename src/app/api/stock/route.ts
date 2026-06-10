import { NextResponse } from 'next/server';

/**
 * Server-side proxy for the Massive stock API.
 *
 * The API key lives only on the server (MASSIVE_API_KEY, NOT prefixed with
 * NEXT_PUBLIC_) so it is never shipped to the browser. The route is a
 * constrained proxy: only the specific endpoints the investor page needs are
 * allowed, and only for the DGXX ticker, to prevent it being used as an open
 * relay for the key.
 */

const SYMBOL = 'DGXX';
const API_BASE = 'https://api.massive.com';

// Reject anything that isn't a plain YYYY-MM-DD date (prevents path injection).
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function buildUpstreamUrl(type: string, date: string | null, apiKey: string): string | null {
  switch (type) {
    case 'snapshot':
      return `${API_BASE}/v2/snapshot/locale/us/markets/stocks/tickers/${SYMBOL}?apiKey=${apiKey}`;
    case 'quote':
      return `${API_BASE}/v3/quotes/${SYMBOL}?limit=1&order=desc&apiKey=${apiKey}`;
    case 'trade':
      return `${API_BASE}/v3/trades/${SYMBOL}?limit=1&order=desc&apiKey=${apiKey}`;
    case 'open-close':
      if (!date || !DATE_RE.test(date)) return null;
      return `${API_BASE}/v1/open-close/${SYMBOL}/${date}?adjusted=true&apiKey=${apiKey}`;
    default:
      return null;
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.MASSIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Stock API not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? '';
  const date = searchParams.get('date');

  const upstreamUrl = buildUpstreamUrl(type, date, apiKey);
  if (!upstreamUrl) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const upstream = await fetch(upstreamUrl, { cache: 'no-store' });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}
