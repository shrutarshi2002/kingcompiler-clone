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
  // Country-specific blog posts
  {
    id: 7,
    title: "USA Chess Championships: Training for National Competitions",
    excerpt:
      "Learn the strategies and techniques used by top American chess players in national tournaments and championships.",
    author: "King Master Team",
    date: "2024-01-20",
    category: "Chess",
    tags: ["usa", "championships", "tournaments", "national"],
    readTime: "8 min read",
    image: "/blog/usa-chess.jpg",
    country: "USA",
    source: "regular",
  },
  {
    id: 8,
    title: "UK Chess Education: Royal Academy Methods",
    excerpt:
      "Discover the traditional British approach to chess education and how it's adapted for modern online learning.",
    author: "King Master Team",
    date: "2024-01-18",
    category: "Education",
    tags: ["uk", "royal", "education", "traditional"],
    readTime: "6 min read",
    image: "/blog/uk-chess.jpg",
    country: "UK",
    source: "regular",
  },
  {
    id: 9,
    title: "UAE Chess Innovation: Dubai's Tech-Forward Approach",
    excerpt:
      "Explore how Dubai is revolutionizing chess education with cutting-edge technology and AI integration.",
    author: "King Master Team",
    date: "2024-01-16",
    category: "Coding",
    tags: ["uae", "dubai", "innovation", "ai", "technology"],
    readTime: "7 min read",
    image: "/blog/uae-chess.jpg",
    country: "UAE",
    source: "regular",
  },
  {
    id: 10,
    title: "Singapore Chess Hub: Excellence in STEM Education",
    excerpt:
      "Learn how Singapore's world-class education system incorporates chess into their STEM curriculum.",
    author: "King Master Team",
    date: "2024-01-14",
    category: "Education",
    tags: ["singapore", "stem", "excellence", "curriculum"],
    readTime: "9 min read",
    image: "/blog/singapore-chess.jpg",
    country: "Singapore",
    source: "regular",
  },
  {
    id: 11,
    title: "Canadian Chess Masters: Winter Training Strategies",
    excerpt:
      "Discover unique training methods used by Canadian chess players during long winter months.",
    author: "King Master Team",
    date: "2024-01-12",
    category: "Chess",
    tags: ["canada", "winter", "training", "strategies"],
    readTime: "5 min read",
    image: "/blog/canada-chess.jpg",
    country: "Canada",
    source: "regular",
  },
  {
    id: 12,
    title: "Saudi Arabia Chess Vision: Future Skills Development",
    excerpt:
      "Explore Saudi Arabia's Vision 2030 and how chess education fits into their future skills development program.",
    author: "King Master Team",
    date: "2024-01-10",
    category: "Education",
    tags: ["saudi", "vision2030", "future", "skills"],
    readTime: "8 min read",
    image: "/blog/saudi-chess.jpg",
    country: "Saudi Arabia",
    source: "regular",
  },
];

export async function GET(request) {
  try {
    // Check if we're requesting a limited number of posts for homepage
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    // Start with regular posts immediately for faster initial load
    let allPosts = [...regularBlogPosts];
    let substackPosts = [];
    let localPosts = [];

    // Use Promise.allSettled for parallel API calls instead of sequential
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

    const [substackResult, localResult] = await Promise.allSettled([
      // Fetch Substack posts with optimized caching
      fetch(`${baseUrl}/api/blog/substack`, {
        method: "GET",
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }).then((res) => (res.ok ? res.json() : { success: false, posts: [] })),

      // Fetch local posts with optimized caching
      fetch(`${baseUrl}/api/blog/local`, {
        method: "GET",
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }).then((res) => (res.ok ? res.json() : { success: false, posts: [] })),
    ]);

    // Process Substack posts
    if (substackResult.status === "fulfilled" && substackResult.value.success) {
      substackPosts = substackResult.value.posts || [];
    } else {
      console.warn("Substack posts fetch failed:", substackResult.reason);
    }

    // Process local posts
    if (localResult.status === "fulfilled" && localResult.value.success) {
      localPosts = localResult.value.posts || [];
    } else {
      console.warn("Local posts fetch failed:", localResult.reason);
    }

    // Combine all posts and sort by date (newest first)
    allPosts = [...allPosts, ...localPosts, ...substackPosts].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        allPosts = allPosts.slice(0, limitNum);
      }
    }

    // Return combined posts with optimized cache control headers
    return NextResponse.json(
      {
        success: true,
        posts: allPosts,
        total: allPosts.length,
        substack: substackPosts.length,
        local: localPosts.length,
        regular: regularBlogPosts.length,
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60", // Cache for 5 minutes, serve stale for 1 minute
          "Last-Modified": new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);

    // Return regular posts as fallback even on error
    const fallbackPosts = limit
      ? regularBlogPosts.slice(0, parseInt(limit) || 6)
      : regularBlogPosts;

    return NextResponse.json(
      {
        success: true, // Still return success with fallback data
        posts: fallbackPosts,
        total: fallbackPosts.length,
        substack: 0,
        local: 0,
        regular: fallbackPosts.length,
        lastUpdated: new Date().toISOString(),
        fallback: true, // Indicate this is fallback data
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30", // Shorter cache for fallback
        },
      }
    );
  }
}
