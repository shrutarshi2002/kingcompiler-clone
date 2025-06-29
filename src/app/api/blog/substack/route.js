import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch RSS feed from your Substack with cache-busting
    const rssUrl = "https://kingcompiler.substack.com/feed";
    const response = await fetch(rssUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "User-Agent": "KingCompiler-Blog-Fetcher/1.0",
      },
      next: { revalidate: 0 }, // Disable Next.js caching for this route
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      console.error("RSS feed returned empty content");
      throw new Error("RSS feed returned empty content");
    }

    // Parse XML to extract posts
    const posts = parseRSSFeed(xmlText);

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
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
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

      // Remove Substack subscription prompts and related content
      cleanContent = cleanContent
        // Remove subscription prompts
        .replace(
          /<p[^>]*>Thanks for reading Kingcompiler's Substack! Subscribe for free to receive new posts and support my work\.<\/p>/gi,
          ""
        )
        .replace(
          /<p[^>]*>Subscribe for free to receive new posts and support my work\.<\/p>/gi,
          ""
        )
        .replace(
          /<p[^>]*>Thanks for reading.*?Substack!.*?Subscribe.*?<\/p>/gi,
          ""
        )
        .replace(/<p[^>]*>Type your email.*?<\/p>/gi, "")
        .replace(/<p[^>]*>subscribe.*?<\/p>/gi, "")

        // Remove subscription forms and related HTML
        .replace(/<div[^>]*class="[^"]*subscribe[^"]*"[^>]*>.*?<\/div>/gis, "")
        .replace(
          /<form[^>]*class="[^"]*subscribe[^"]*"[^>]*>.*?<\/form>/gis,
          ""
        )
        .replace(/<input[^>]*placeholder="[^"]*email[^"]*"[^>]*>/gi, "")
        .replace(/<button[^>]*>subscribe[^>]*<\/button>/gi, "")

        // Remove common Substack footer content
        .replace(/<div[^>]*class="[^"]*footer[^"]*"[^>]*>.*?<\/div>/gis, "")
        .replace(
          /<div[^>]*class="[^"]*subscription[^"]*"[^>]*>.*?<\/div>/gis,
          ""
        )

        // Remove any remaining subscription-related text
        .replace(/Thanks for reading.*?Substack!.*?Subscribe.*?/gi, "")
        .replace(/Subscribe for free.*?/gi, "")
        .replace(/Type your email.*?/gi, "")

        // Clean up any empty paragraphs or divs that might be left
        .replace(/<p[^>]*>\s*<\/p>/gi, "")
        .replace(/<div[^>]*>\s*<\/div>/gi, "")

        // Clean up multiple line breaks
        .replace(/\n\s*\n\s*\n/g, "\n\n")
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
        category: categories[0] || "Chess",
        tags: categories,
        readTime: `${Math.ceil(
          cleanDescription.split(" ").length / 200
        )} min read`,
        image: featuredImage || "/blog/substack-post.jpg",
        images: images,
        enclosure: enclosure,
        externalLinks: {
          substack: link,
          hashnode: `https://hashnode.dev/@kingcompiler/${slug}`,
          devto: `https://dev.to/kingcompiler/${slug}`,
          linkedin: `https://linkedin.com/posts/kingcompiler-${slug}`,
        },
        source: "substack",
        originalLink: link,
      });
    }
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
  }

  return posts;
}
