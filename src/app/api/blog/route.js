import { NextResponse } from "next/server";

// Regular blog posts data (in production, this would come from a database)
const regularBlogPosts = [
  {
    id: 1,
    title: "10 Essential Chess Openings Every Beginner Should Know",
    excerpt:
      "Master these fundamental openings to build a strong foundation in chess strategy and improve your game significantly.",
    author: "King Master Team",
    date: "2024-01-15",
    category: "Chess",
    tags: ["beginners", "openings", "strategy"],
    readTime: "5 min read",
    image: "/blog/chess-openings.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/chess-openings-guide",
      devto: "https://dev.to/kingcompiler/chess-openings",
      linkedin: "https://linkedin.com/posts/kingcompiler-chess-openings",
    },
    source: "regular",
  },
  {
    id: 2,
    title: "How to Teach Coding to Kids: A Complete Guide",
    excerpt:
      "Discover effective methods and tools to introduce programming concepts to children in a fun and engaging way.",
    author: "King Master Team",
    date: "2024-01-12",
    category: "Coding",
    tags: ["education", "kids", "programming"],
    readTime: "8 min read",
    image: "/blog/coding-kids.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/coding-for-kids",
      devto: "https://dev.to/kingcompiler/coding-kids-guide",
      linkedin: "https://linkedin.com/posts/kingcompiler-coding-kids",
    },
    source: "regular",
  },
  {
    id: 3,
    title: "Advanced Chess Tactics: The Art of the Fork",
    excerpt:
      "Learn how to master one of chess's most powerful tactical weapons and use it to gain material advantage.",
    author: "King Master Team",
    date: "2024-01-10",
    category: "Chess",
    tags: ["tactics", "advanced", "fork"],
    readTime: "6 min read",
    image: "/blog/chess-tactics.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/chess-fork-guide",
      devto: "https://dev.to/kingcompiler/chess-tactics",
      linkedin: "https://linkedin.com/posts/kingcompiler-chess-fork",
    },
    source: "regular",
  },
  {
    id: 4,
    title: "Building Your First Python Game: A Step-by-Step Tutorial",
    excerpt:
      "Create a simple but engaging game using Python and learn fundamental programming concepts along the way.",
    author: "King Master Team",
    date: "2024-01-08",
    category: "Coding",
    tags: ["python", "games", "tutorial"],
    readTime: "12 min read",
    image: "/blog/python-game.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/python-game-guide",
      devto: "https://dev.to/kingcompiler/python-game",
      linkedin: "https://linkedin.com/posts/kingcompiler-python-game",
    },
    source: "regular",
  },
  {
    id: 5,
    title: "The Psychology of Chess: How to Think Like a Grandmaster",
    excerpt:
      "Explore the mental aspects of chess and develop the thinking patterns that separate masters from amateurs.",
    author: "King Master Team",
    date: "2024-01-05",
    category: "Chess",
    tags: ["psychology", "strategy", "mindset"],
    readTime: "7 min read",
    image: "/blog/chess-psychology.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/chess-psychology",
      devto: "https://dev.to/kingcompiler/chess-mindset",
      linkedin: "https://linkedin.com/posts/kingcompiler-chess-psychology",
    },
    source: "regular",
  },
  {
    id: 6,
    title: "JavaScript for Kids: Making Learning Fun with Interactive Projects",
    excerpt:
      "Transform JavaScript learning into an exciting adventure with these kid-friendly projects and activities.",
    author: "King Master Team",
    date: "2024-01-03",
    category: "Coding",
    tags: ["javascript", "kids", "projects"],
    readTime: "10 min read",
    image: "/blog/javascript-kids.jpg",
    externalLinks: {
      hashnode: "https://hashnode.dev/@kingcompiler/javascript-kids-guide",
      devto: "https://dev.to/kingcompiler/javascript-kids",
      linkedin: "https://linkedin.com/posts/kingcompiler-javascript-kids",
    },
    source: "regular",
  },
];

export async function GET() {
  try {
    // Fetch both Substack posts and local posts
    let substackPosts = [];
    let localPosts = [];

    // Fetch Substack posts
    try {
      // Use relative URL for internal API calls in production
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
      const substackApiUrl = `${baseUrl}/api/blog/substack`;

      const substackResponse = await fetch(substackApiUrl, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        next: { revalidate: 0 }, // Disable Next.js caching
      });
      if (substackResponse.ok) {
        const substackData = await substackResponse.json();
        if (substackData.success && substackData.posts) {
          substackPosts = substackData.posts;
        }
      }
    } catch (error) {
      console.error("Error fetching Substack posts:", error);
    }

    // Fetch local posts
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
      const localApiUrl = `${baseUrl}/api/blog/local`;

      const localResponse = await fetch(localApiUrl, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        next: { revalidate: 0 }, // Disable Next.js caching
      });
      if (localResponse.ok) {
        const localData = await localResponse.json();
        if (localData.success && localData.posts) {
          localPosts = localData.posts;
        }
      }
    } catch (error) {
      console.error("Error fetching local posts:", error);
    }

    // Combine and sort posts by date (newest first)
    const allPosts = [...substackPosts, ...localPosts].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });

    // Return combined posts with cache control headers
    return NextResponse.json(
      {
        success: true,
        posts: allPosts,
        total: allPosts.length,
        substack: substackPosts.length,
        local: localPosts.length,
        lastUpdated: new Date().toISOString(),
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
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        posts: [], // Return empty array if error
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
