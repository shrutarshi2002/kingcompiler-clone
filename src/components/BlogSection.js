"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const categories = ["All", "Chess", "Coding", "Education", "Tutorials"];

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blog posts from combined API with cache busting
  const fetchBlogPosts = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch("/api/blog", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const data = await response.json();

      if (data.success && data.posts) {
        setBlogPosts(data.posts);
        setFilteredPosts(data.posts);
        setLastUpdated(data.lastUpdated || new Date().toISOString());
      } else {
        console.error("Failed to fetch blog posts:", data.error);
        setBlogPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (isClient) {
      fetchBlogPosts();
    }
  }, [isClient, fetchBlogPosts]);

  // Set up automatic refresh every 5 minutes
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      console.log("Auto-refreshing blog posts...");
      fetchBlogPosts(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isClient, fetchBlogPosts]);

  // Set up intersection observer to refresh when component becomes visible
  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            console.log("Blog section visible, checking for updates...");
            fetchBlogPosts(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const blogSection = document.querySelector("[data-blog-section]");
    if (blogSection) {
      observer.observe(blogSection);
    }

    return () => {
      if (blogSection) {
        observer.unobserve(blogSection);
      }
    };
  }, [isClient, isLoading, fetchBlogPosts]);

  // Filter posts based on category
  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, blogPosts]);

  // SEO optimization - Add structured data only on client
  useEffect(() => {
    if (!isClient) return;

    // Add JSON-LD structured data for blog posts
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Kingcompiler Blog",
      description:
        "Chess and coding tutorials, strategies, and educational content from Substack",
      url: "https://kingcompiler.com/blog",
      publisher: {
        "@type": "Organization",
        name: "Kingcompiler",
        logo: {
          "@type": "ImageObject",
          url: "https://kingcompiler.com/logo.png",
        },
      },
      blogPost: filteredPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        author: {
          "@type": "Person",
          name: post.author || "Kingcompiler Team",
        },
        datePublished: post.date,
        dateModified: post.date,
        url: `https://kingcompiler.com/blog/substack/${post.slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://kingcompiler.com/blog/substack/${post.slug}`,
        },
      })),
    };

    // Add structured data to head
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        `script[type="application/ld+json"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [filteredPosts, isClient]);

  const handlePostClick = (post) => {
    if (post.slug) {
      // Navigate to local Substack post page
      window.location.href = `/blog/substack/${post.slug}`;
    }
  };

  const handleManualRefresh = () => {
    fetchBlogPosts(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-lg text-gray-600">
              Chess strategies, coding tutorials, and educational insights from
              Substack
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" data-blog-section>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Latest from Our Blog
            </h2>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
              title="Refresh blog posts"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Chess strategies, coding tutorials, and educational insights from
            our Substack
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-4">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog posts grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No articles found
            </h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(0, 6).map((post) => (
              <article
                key={`substack-${post.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                itemScope
                itemType="https://schema.org/BlogPosting"
                onClick={() => handlePostClick(post)}
              >
                {/* Featured image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
                  {post.image && post.image !== "/blog/substack-post.jpg" ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      post.image && post.image !== "/blog/substack-post.jpg"
                        ? "hidden"
                        : "flex"
                    }`}
                  >
                    <div className="text-white text-center">
                      <div className="text-3xl mb-2">📚</div>
                      <div className="text-sm font-semibold">
                        Kingcompiler Blog
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Substack
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {isClient
                        ? new Date(post.date).toLocaleDateString()
                        : post.date}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2
                    className="text-xl font-bold mb-3 line-clamp-2"
                    style={{ color: "var(--foreground)" }}
                    itemProp="headline"
                  >
                    {post.title}
                  </h2>

                  <p
                    className="text-gray-600 mb-4 line-clamp-3"
                    itemProp="description"
                  >
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.length > 0 ? (
                      post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-sm">
                        #blog
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostClick(post);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                    >
                      Read more
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (post.originalLink) {
                          window.open(post.originalLink, "_blank");
                        } else if (post.externalLinks?.substack) {
                          window.open(post.externalLinks.substack, "_blank");
                        } else {
                          window.open(
                            "https://kingcompiler.substack.com",
                            "_blank"
                          );
                        }
                      }}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                    >
                      Read in Substack
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Want to Read More?
          </h3>
          <p className="text-lg mb-6 text-gray-600">
            Explore our complete collection of chess and coding articles on
            Substack
          </p>
          <a
            href="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
}
