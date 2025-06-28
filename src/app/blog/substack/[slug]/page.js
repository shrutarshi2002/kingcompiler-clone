"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import Image from "next/image";

export default function SubstackPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/blog/substack");
        const data = await response.json();

        if (data.success && data.posts) {
          const foundPost = data.posts.find((p) => p.slug === params.slug);
          setPost(foundPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      fetchPost();
    }
  }, [params.slug, isClient]);

  // SEO optimization - Add structured data only on client
  useEffect(() => {
    if (!isClient || !post) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      author: {
        "@type": "Person",
        name: post.author,
      },
      datePublished: post.date,
      dateModified: post.date,
      publisher: {
        "@type": "Organization",
        name: "Kingcompiler",
        logo: {
          "@type": "ImageObject",
          url: "https://kingcompiler.com/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://kingcompiler.com/blog/substack/${post.slug}`,
      },
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
  }, [post, isClient]);

  const handlePlatformClick = (platform) => {
    const platformKey = platform.toLowerCase().replace(".", "");
    const url = post.externalLinks[platformKey];
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            ← Back to Blog
          </Link>
        </nav>

        {/* Article header */}
        <header className="mb-8">
          <div className="mb-4 flex gap-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Substack
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-6">
            <span>{post.author}</span>
            <span className="mx-2">•</span>
            <span>
              {isClient ? new Date(post.date).toLocaleDateString() : post.date}
            </span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured image */}
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden mb-8">
          {post.image && post.image !== "/blog/substack-post.jpg" ? (
            <Image
              src={post.image}
              alt={post.title.replace(/'/g, "&apos;")}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
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
              <div className="text-4xl mb-4">📚</div>
              <div className="text-lg font-semibold">Kingcompiler Blog</div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-medium">
              #blog
            </span>
          )}
        </div>

        {/* Platform links */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Read on Other Platforms
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handlePlatformClick("Substack")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Original on Substack
            </button>
            <button
              onClick={() => handlePlatformClick("Hashnode")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Hashnode
            </button>
            <button
              onClick={() => handlePlatformClick("Dev.to")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Dev.to
            </button>
            <button
              onClick={() => handlePlatformClick("LinkedIn")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              LinkedIn
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Want to Learn More?</h3>
          <p className="text-lg mb-6 opacity-90">
            Get personalized chess coaching and coding lessons from our expert
            team
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
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              📞 Call Now
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
