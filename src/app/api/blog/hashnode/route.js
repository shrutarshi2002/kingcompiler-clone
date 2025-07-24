import { NextResponse } from "next/server";

// In-memory cache for Hashnode posts
let cachedPosts = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  const now = Date.now();
  // Serve from cache if not expired
  if (cachedPosts && now - cacheTimestamp < CACHE_DURATION_MS) {
    return NextResponse.json(
      {
        success: true,
        posts: cachedPosts,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
        totalPosts: cachedPosts.length,
        cached: true,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Last-Modified": new Date(cacheTimestamp).toISOString(),
        },
      }
    );
  }

  try {
    // Fetch RSS feed from Hashnode
    const rssUrl = "https://hashnode.com/@kingcompiler/rss.xml";
    const response = await fetch(rssUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "User-Agent": "KingCompiler-Blog-Fetcher/1.0",
      },
      next: { revalidate: 0 },
    });

    if (response.status === 429) {
      // Rate limited: serve cached data if available
      if (cachedPosts) {
        return NextResponse.json(
          {
            success: true,
            posts: cachedPosts,
            lastUpdated: new Date(cacheTimestamp).toISOString(),
            totalPosts: cachedPosts.length,
            cached: true,
            warning: "Rate limited by Hashnode. Serving cached posts.",
          },
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
              "Last-Modified": new Date(cacheTimestamp).toISOString(),
            },
          }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limited by Hashnode and no cached posts available.",
            posts: [],
            lastUpdated: new Date().toISOString(),
          },
          {
            status: 429,
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          }
        );
      }
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch Hashnode RSS feed: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch Hashnode RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      console.error("Hashnode RSS feed returned empty content");
      throw new Error("Hashnode RSS feed returned empty content");
    }

    // Parse XML to extract posts
    const posts = parseRSSFeed(xmlText);
    // Update cache
    cachedPosts = posts;
    cacheTimestamp = Date.now();

    // Return response with cache control headers to ensure fresh content
    return NextResponse.json(
      {
        success: true,
        posts: posts,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
        totalPosts: posts.length,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Last-Modified": new Date(cacheTimestamp).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("Error fetching Hashnode posts:", error);
    // Serve cached data if available
    if (cachedPosts) {
      return NextResponse.json(
        {
          success: true,
          posts: cachedPosts,
          lastUpdated: new Date(cacheTimestamp).toISOString(),
          totalPosts: cachedPosts.length,
          cached: true,
          warning: "Error fetching new posts. Serving cached posts.",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Last-Modified": new Date(cacheTimestamp).toISOString(),
          },
        }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        posts: [],
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

function parseRSSFeed(xmlText) {
  const posts = [];

  try {
    // Simple XML parsing for RSS feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(.*?)<\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const descriptionRegex = /<description>(.*?)<\/description>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    const categoryRegex = /<category>(.*?)<\/category>/g;
    const contentRegex = /<content:encoded>(.*?)<\/content:encoded>/;
    const enclosureRegex = /<enclosure[^>]+url=["']([^"']+)["'][^>]*>/;

    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      const title = titleRegex.exec(itemContent)?.[1] || "";
      const link = linkRegex.exec(itemContent)?.[1] || "";
      const description = descriptionRegex.exec(itemContent)?.[1] || "";
      const pubDate = pubDateRegex.exec(itemContent)?.[1] || "";
      const content = contentRegex.exec(itemContent)?.[1] || description;
      const enclosure = enclosureRegex.exec(itemContent)?.[1] || "";

      // Extract categories
      const categories = [];
      let categoryMatch;
      const categoryRegexLocal = /<category>(.*?)<\/category>/g;
      while ((categoryMatch = categoryRegexLocal.exec(itemContent)) !== null) {
        categories.push(categoryMatch[1]);
      }

      // Clean up title (remove CDATA tags)
      const cleanTitle = title
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Clean up description (remove HTML tags and CDATA)
      const cleanDescription = description
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Clean up content (remove CDATA tags but keep some HTML for rich content)
      let cleanContent = content
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      // Extract images from content
      const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      const images = [];
      let imageMatch;
      while ((imageMatch = imageRegex.exec(cleanContent)) !== null) {
        const imageUrl = imageMatch[1];
        if (imageUrl && !imageUrl.includes("data:image")) {
          images.push(imageUrl);
        }
      }

      // Get featured image: first try enclosure, then first image from content, then default
      let featuredImage = null;
      if (enclosure && !enclosure.includes("data:image")) {
        featuredImage = enclosure;
      } else if (images.length > 0) {
        featuredImage = images[0];
      }

      // Extract post ID from link
      const postId = link.split("/").pop() || Date.now().toString();

      // Generate a slug for the post
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      posts.push({
        id: postId,
        slug: slug,
        title: cleanTitle,
        excerpt:
          cleanDescription.substring(0, 200) +
          (cleanDescription.length > 200 ? "..." : ""),
        content: cleanContent,
        author: "Kingcompiler Team",
        date: new Date(pubDate).toISOString().split("T")[0],
        category: "Coding",
        tags: categories,
        readTime: `${Math.ceil(
          cleanDescription.split(" ").length / 200
        )} min read`,
        image: featuredImage || "/blog/hashnode-post.jpg",
        images: images,
        enclosure: enclosure,
        externalLinks: {
          hashnode: link,
        },
        source: "hashnode",
        originalLink: link,
      });
    }
  } catch (error) {
    console.error("Error parsing Hashnode RSS feed:", error);
  }

  return posts;
}
