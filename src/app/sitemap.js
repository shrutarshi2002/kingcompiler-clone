export const dynamic = "force-static";

export default function sitemap() {
  const baseUrl = "https://kingmaster.com";

  // Import courses data
  const { courses } = require("../data/courseData");

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Course pages
  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Blog posts (this would be fetched from your database in production)
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Chess Openings Every Beginner Should Know",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "How to Teach Coding to Kids: A Complete Guide",
      date: "2024-01-12",
    },
    {
      id: 3,
      title: "Advanced Chess Tactics: The Art of the Fork",
      date: "2024-01-10",
    },
    {
      id: 4,
      title: "Building Your First Python Game: A Step-by-Step Tutorial",
      date: "2024-01-08",
    },
    {
      id: 5,
      title: "The Psychology of Chess: How to Think Like a Grandmaster",
      date: "2024-01-05",
    },
    {
      id: 6,
      title:
        "JavaScript for Kids: Making Learning Fun with Interactive Projects",
      date: "2024-01-03",
    },
  ];

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Category pages for better SEO
  const categories = ["chess", "coding", "education", "tutorials"];
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Tag pages for better SEO
  const tags = [
    "beginners",
    "openings",
    "strategy",
    "education",
    "kids",
    "programming",
    "tactics",
    "advanced",
    "fork",
    "python",
    "games",
    "tutorial",
    "psychology",
    "mindset",
    "javascript",
    "projects",
  ];
  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...courseUrls,
    ...blogUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}
