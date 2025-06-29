"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingDemoButton from "../../components/FloatingDemoButton";
import Image from "next/image";

const categories = ["All", "Chess", "Coding", "Education", "Tutorials"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blog posts from API with cache busting
  const fetchBlogPosts = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      console.log("Fetching blog posts from API...");
      const response = await fetch("/api/blog", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (data.success && data.posts) {
        console.log(`Successfully fetched ${data.posts.length} blog posts`);
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

  // Set up automatic refresh every 3 minutes on blog page
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      console.log("Auto-refreshing blog posts...");
      fetchBlogPosts(true);
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [isClient, fetchBlogPosts]);

  // Filter posts based on category and search query
  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchQuery, blogPosts]);

  // SEO optimization - Add structured data only on client
  useEffect(() => {
    if (!isClient) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "King Master Blog",
      description:
        "Chess and coding tutorials, strategies, and educational content from Substack",
      url: "https://kingmaster.com/blog",
      publisher: {
        "@type": "Organization",
        name: "King Master",
        logo: {
          "@type": "ImageObject",
          url: "https://kingmaster.com/logo.png",
        },
      },
      blogPost: filteredPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        author: {
          "@type": "Person",
          name: post.author,
        },
        datePublished: post.date,
        dateModified: post.date,
        publisher: {
          "@type": "Organization",
          name: "King Master",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://kingmaster.com/blog/substack/${post.slug}`,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* SEO-optimized header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              King Master Blog
            </h1>
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
          <p className="text-xl mb-8 text-gray-600">
            Expert insights on chess strategy, coding tutorials, and educational
            content from our Substack
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-4">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {/* Blog posts grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={`substack-${post.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                itemScope
                itemType="https://schema.org/BlogPosting"
                onClick={() => handlePostClick(post)}
              >
                {/* Featured image */}
                <div className="relative h-48 bg-gray-200">
                  {post.image && post.image !== "/blog/substack-post.jpg" ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      width={600}
                      height={300}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">📚</span>
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
                    className="text-xl font-bold mb-3 line-clamp-2 text-gray-900"
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
                      post.tags.map((tag) => (
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
                      Read More
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
                      className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                    >
                      Substack
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
            Want to Write for Us?
          </h3>
          <p className="text-lg mb-6 text-gray-600">
            Share your chess strategies and coding knowledge with our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                window.open("https://wa.me/919038162791", "_blank")
              }
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              💬 WhatsApp Us
            </button>
            <button
              onClick={() => window.open("tel:+919038162791", "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              📞 Call Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
