import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET(request) {
  try {
    // Check if we're requesting a specific post by slug
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Use proper RSS parser
    const parser = new Parser();
    const feed = await parser.parseURL(
      "https://kingcompiler.substack.com/feed"
    );

    // Map RSS items to your expected structure
    const posts = feed.items.map((item, idx) => {
      // Extract images from content
      const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const images = [];
      let imageMatch;
      while (
        (imageMatch = imageRegex.exec(
          item["content:encoded"] || item.content
        )) !== null
      ) {
        const imageUrl = imageMatch[1];
        if (imageUrl && !imageUrl.includes("data:image")) {
          images.push(imageUrl);
        }
      }

      // Generate slug from title or guid
      const slug = item.title
        ? item.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
        : item.guid?.split("/").pop() || `post-${idx}`;

      return {
        id: item.guid || idx,
        slug: slug,
        title: item.title || "",
        excerpt: item.contentSnippet || item.summary || "",
        content: item["content:encoded"] || item.content || "",
        author: item.creator || item.author || "Kingcompiler Team",
        date: item.isoDate || item.pubDate || new Date().toISOString(),
        category: item.categories?.[0] || "Blog",
        tags: [
          ...(item.categories || []),
          "KingCompilerChessAcademy",
          "OnlineChessClassesForKids",
          "BestChessCoaching",
          "LearnChessWithAI",
          "ChessTrainingForBeginners",
          "GlobalChessAcademy",
        ],
        readTime: "3 min read", // You can estimate or parse this if needed
        image: item.enclosure?.url || images[0] || "/blog/substack-post.jpg",
        images: images,
        enclosure: item.enclosure?.url || "",
        externalLinks: {
          substack: item.link,
          hashnode: `https://hashnode.dev/@kingcompiler/${slug}`,
          devto: `https://dev.to/kingcompiler/${slug}`,
          linkedin: `https://linkedin.com/posts/kingcompiler-${slug}`,
        },
        source: "substack",
        originalLink: item.link,
      };
    });

    if (slug) {
      // Return specific post by slug
      const post = posts.find((p) => p.slug === slug);
      if (post) {
        return NextResponse.json(
          {
            success: true,
            post: post,
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=120, stale-while-revalidate=60", // Cache for 2 minutes, serve stale for 1 minute
            },
          }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Post not found",
          },
          {
            status: 404,
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          }
        );
      }
    }

    // Return response with cache control headers to ensure fresh content
    return NextResponse.json(
      {
        success: true,
        posts: posts,
        lastUpdated: new Date().toISOString(),
        totalPosts: posts.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60", // Cache for 2 minutes, serve stale for 1 minute
          "Last-Modified": new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("Error fetching Substack posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        posts: [], // Return empty array instead of undefined
        lastUpdated: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
