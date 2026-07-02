import { NextResponse } from "next/server";

export async function GET() {
  const posts = [
    {
      id: "1",
      title: "How to Measure Yourself for a Bespoke Dress Fitting",
      date: "Wed, 24 Jun 2026 00:00:00 GMT",
      excerpt: "Drafting a custom paper pattern requires precision. Learn the 8 critical measurements you can take at home before your first studio fitting.",
    },
    {
      id: "2",
      title: "5 Elegant Ankara Styles for Bridal Group Parties",
      date: "Mon, 18 May 2026 00:00:00 GMT",
      excerpt: "Bridal chamas and cohorts are embracing vibrant African print designs. Discover our curated panel patterns and gold stitching layouts.",
    },
    {
      id: "3",
      title: "The Ultimate Guide to Selecting Premium Suiting Fabrics",
      date: "Fri, 10 Apr 2026 00:00:00 GMT",
      excerpt: "Sourcing premium wool blends vs blended cottons. Antonina Harrison breaks down yarn counts and weave options for custom suits.",
    },
  ];

  const siteUrl = "https://vfd-shop.vercel.app";

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Victory Fashion Design — Journal</title>
    <link>${siteUrl}/journal</link>
    <description>Expert advice on custom measurement, bridal fabrics, African modern designs, and fashion training in Ruiru, Kenya.</description>
    <language>en-ke</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>Thu, 02 Jul 2026 10:35:00 GMT</pubDate>
    <ttl>60</ttl>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${siteUrl}/journal</link>
      <guid>${siteUrl}/journal#${post.id}</guid>
      <pubDate>${post.date}</pubDate>
      <description>${post.excerpt}</description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
