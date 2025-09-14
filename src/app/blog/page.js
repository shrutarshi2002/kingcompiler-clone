"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FloatingDemoButton from "../../components/FloatingDemoButton";
import Image from "next/image";

const categories = ["All", "Chess", "Coding", "Education", "Tutorials"];

// Country data with flags and marketing content
const countries = [
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    description: "Chess & Coding Excellence",
    students: "500+",
    featured: "Chess Tournaments & Coding Bootcamps",
  },
  {
    code: "GB",
    name: "UK",
    flag: "🇬🇧",
    description: "Royal Chess Academy",
    students: "300+",
    featured: "Chess Championships & STEM Education",
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    description: "Dubai Chess Masters",
    students: "250+",
    featured: "International Chess & AI Programming",
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    description: "Dutch Chess Innovation",
    students: "200+",
    featured: "Chess Strategy & Tech Innovation",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    description: "Aussie Chess Champions",
    students: "180+",
    featured: "Chess Competitions & Coding Challenges",
  },
  {
    code: "KW",
    name: "Kuwait",
    flag: "🇰🇼",
    description: "Kuwait Chess Stars",
    students: "120+",
    featured: "Chess Mastery & Programming Skills",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    description: "Singapore Chess Hub",
    students: "350+",
    featured: "Chess Excellence & Tech Innovation",
  },
  {
    code: "OM",
    name: "Oman",
    flag: "🇴🇲",
    description: "Oman Chess Academy",
    students: "100+",
    featured: "Chess Training & Digital Skills",
  },
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    description: "Qatar Chess Champions",
    students: "150+",
    featured: "Chess Mastery & STEM Education",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    description: "Saudi Chess Vision",
    students: "400+",
    featured: "Chess Excellence & Future Skills",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    description: "Canadian Chess Masters",
    students: "280+",
    featured: "Chess Championships & Coding Excellence",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blog posts from API with cache busting
  const fetchBlogPosts = useCallback(async (forceRefresh = false) => {
    try {
      setError(""); // Clear any previous errors
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Add optimized cache control headers
      const response = await fetch("/api/blog?limit=20", {
        method: "GET",
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.posts) {
        setBlogPosts(data.posts);
        setFilteredPosts(data.posts);
        setLastUpdated(data.lastUpdated || new Date().toISOString());
      } else {
        const errorMessage = data.error || "Failed to fetch blog posts";
        console.error("Failed to fetch blog posts:", errorMessage);
        setError(errorMessage);
        setBlogPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      const errorMessage =
        error.message || "Network error occurred while fetching blog posts";
      console.error("Error fetching blog posts:", errorMessage);
      setError(errorMessage);
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

  // Set up automatic refresh every 10 minutes on blog page
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      fetchBlogPosts(true);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [isClient, fetchBlogPosts]);

  // Filter posts based on category, country, and search query
  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (selectedCountry !== "All") {
      const countryData = countries.find((c) => c.name === selectedCountry);
      if (countryData) {
        // Filter posts that are relevant to the selected country
        filtered = filtered.filter((post) => {
          // Check if post has country-specific content or tags
          const postTags = post.tags || [];
          const postTitle = post.title.toLowerCase();
          const postExcerpt = post.excerpt.toLowerCase();

          // Check for country-specific keywords or tags
          const countryKeywords = [
            countryData.name.toLowerCase(),
            countryData.code.toLowerCase(),
            countryData.description.toLowerCase().split(" ")[0], // First word of description
            ...countryData.featured.toLowerCase().split(" "),
          ];

          return (
            countryKeywords.some(
              (keyword) =>
                postTitle.includes(keyword) ||
                postExcerpt.includes(keyword) ||
                postTags.some((tag) => tag.toLowerCase().includes(keyword))
            ) ||
            post.country === countryData.code ||
            post.country === countryData.name
          );
        });
      }
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
  }, [selectedCategory, selectedCountry, searchQuery, blogPosts]);

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
      // Navigate to appropriate post page based on source
      if (post.source === "local") {
        window.location.href = `/blog/local/${post.slug}`;
      } else {
        // Default to Substack post page
        window.location.href = `/blog/substack/${post.slug}`;
      }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Blog Posts
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => fetchBlogPosts(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Retry
          </button>
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

          {/* Country Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              🌍 Our Global Community
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of students from around the world learning chess
              and coding. Click on any country to see content tailored for your
              region!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {/* All Countries Option */}
              <button
                onClick={() => setSelectedCountry("All")}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedCountry === "All"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="font-semibold text-sm text-gray-800">
                    All Countries
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Global Content
                  </div>
                </div>
              </button>

              {/* Individual Countries */}
              {countries.map((country) => (
                <Link
                  key={country.code}
                  href={`/blog/country/${country.code.toLowerCase()}`}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 block ${
                    selectedCountry === country.name
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{country.flag}</div>
                    <div className="font-semibold text-sm text-gray-800">
                      {country.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {country.students} students
                    </div>
                    <div className="text-xs text-blue-600 mt-1 font-medium">
                      {country.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Click to see states →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Selected Country Info */}
            {selectedCountry !== "All" && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {countries.find((c) => c.name === selectedCountry)?.flag}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {
                      countries.find((c) => c.name === selectedCountry)
                        ?.description
                    }
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {
                      countries.find((c) => c.name === selectedCountry)
                        ?.featured
                    }
                  </p>
                  <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {
                        countries.find((c) => c.name === selectedCountry)
                          ?.students
                      }{" "}
                      Active Students
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Live Classes Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Local Tournaments
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                key={`${post.source}-${post.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                itemScope
                itemType="https://schema.org/BlogPosting"
                onClick={() => handlePostClick(post)}
              >
                {/* Featured image */}
                <div className="relative h-48 bg-gray-200">
                  {post.image &&
                  post.image !== "/blog/substack-post.jpg" &&
                  post.image !== "/blog/local-post.jpg" ? (
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
                    <span
                      className={`${
                        post.source === "local"
                          ? "bg-green-600"
                          : "bg-orange-600"
                      } text-white px-2 py-1 rounded text-xs font-semibold`}
                    >
                      {post.source === "local" ? "Local" : "Substack"}
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
                    {post.source === "local" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open("/blog-admin", "_blank");
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                      >
                        Manage
                      </button>
                    ) : (
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
                    )}
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
