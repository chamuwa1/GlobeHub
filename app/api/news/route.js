import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch top global or localized news.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing news articles.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const language = searchParams.get('language') || 'en';
  const country = searchParams.get('country');
  
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey || apiKey === 'your_news_key_here_do_not_share_in_chat') {
    return NextResponse.json({ error: 'NewsData API key is missing. Please update your .env.local file.' }, { status: 500 });
  }

  try {
    let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=${encodeURIComponent(language)}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (country) url += `&country=${encodeURIComponent(country)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.results?.message || 'Failed to fetch news data');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
