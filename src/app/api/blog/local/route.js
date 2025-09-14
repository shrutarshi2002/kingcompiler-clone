import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Path to the JSON file that will store our blog posts
const BLOG_DATA_PATH = path.join(process.cwd(), "data", "local-blogs.json");

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(BLOG_DATA_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read blog posts from JSON file
async function readBlogPosts() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(BLOG_DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write blog posts to JSON file
async function writeBlogPosts(posts) {
  await ensureDataDirectory();
  await fs.writeFile(BLOG_DATA_PATH, JSON.stringify(posts, null, 2));
}

// GET - Retrieve all local blog posts or a single post by slug
export async function GET(request) {
  try {
    // Check if we're requesting a specific post by slug
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const posts = await readBlogPosts();

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

    // Return all posts
    return NextResponse.json(
      {
        success: true,
        posts: posts,
        total: posts.length,
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60", // Cache for 2 minutes, serve stale for 1 minute
        },
      }
    );
  } catch (error) {
    console.error("Error reading local blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        posts: [],
      },
      { status: 500 }
    );
  }
}

// POST - Create a new local blog post
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and content are required",
        },
        { status: 400 }
      );
    }

    const posts = await readBlogPosts();

    // Create new post
    const newPost = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 200) + "...",
      author: body.author || "King Master Team",
      date: new Date().toISOString().split("T")[0],
      category: body.category || "Chess",
      tags: body.tags || [],
      readTime: `${Math.ceil(body.content.split(" ").length / 200)} min read`,
      image: body.image || "/blog/local-post.jpg",
      slug: body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
      source: "local",
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to posts array
    posts.unshift(newPost); // Add to beginning of array

    // Save to file
    await writeBlogPosts(posts);

    return NextResponse.json({
      success: true,
      post: newPost,
      message: "Blog post created successfully",
    });
  } catch (error) {
    console.error("Error creating local blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update an existing local blog post
export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Post ID is required",
        },
        { status: 400 }
      );
    }

    const posts = await readBlogPosts();
    const postIndex = posts.findIndex((post) => post.id === body.id);

    if (postIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    // Update the post
    posts[postIndex] = {
      ...posts[postIndex],
      title: body.title || posts[postIndex].title,
      content: body.content || posts[postIndex].content,
      excerpt: body.excerpt || posts[postIndex].excerpt,
      category: body.category || posts[postIndex].category,
      tags: body.tags || posts[postIndex].tags,
      image: body.image || posts[postIndex].image,
      updatedAt: new Date().toISOString(),
    };

    // Update slug if title changed
    if (body.title) {
      posts[postIndex].slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    await writeBlogPosts(posts);

    return NextResponse.json({
      success: true,
      post: posts[postIndex],
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error("Error updating local blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a local blog post
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Post ID is required",
        },
        { status: 400 }
      );
    }

    const posts = await readBlogPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);

    if (filteredPosts.length === posts.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found",
        },
        { status: 404 }
      );
    }

    await writeBlogPosts(filteredPosts);

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting local blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
