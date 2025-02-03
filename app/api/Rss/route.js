import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET(request) {
  const parser = new Parser();
  const feedUrl = 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Immigration,%20Refugees%20and%20Citizenship%20Canada';  // Replace with your actual RSS feed URL

  try {
    const feed = await parser.parseURL(feedUrl);
    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch RSS feed' }, { status: 500 });
  }
}