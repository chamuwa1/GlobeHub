import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch live market indices and stock data.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing market data.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'crypto';
  const symbol = searchParams.get('symbol'); 

  try {
    if (type === 'crypto') {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch crypto data');
      const data = await res.json();
      return NextResponse.json({ type: 'crypto', data });
    } 
    else if (type === 'stock') {
      const apiKey = process.env.ALPHAVANTAGE_API_KEY;
      if (!apiKey || apiKey.includes('your_alphavantage_key')) {
        return NextResponse.json({ error: 'AlphaVantage API key is missing. Update .env.local' }, { status: 500 });
      }
      
      let url = '';
      if (symbol) {
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
      } else {
        url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.Information && data.Information.includes('rate limit')) {
          throw new Error('Alpha Vantage API Rate Limit Exceeded (Free tier limit is 25/day)');
      }
      return NextResponse.json({ type: 'stock', data });
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
