"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import Image from "next/image";

export default function LocalBlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog/local?slug=${params.slug}`);
        const data = await response.json();

        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setError(data.error || "Blog post not found");
          // Redirect to main blog page if post not found
          window.location.href = "/blog";
        }
      } catch (error) {
        setError("Network error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-red-600 mb-4">
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
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The requested blog post could not be found."}
          </p>
          <a
            href="/blog"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  // Function to render HTML content safely
  const renderContent = (content) => {
    return { __html: content };
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

          <div className="flex items-center space-x-4 text-gray-500 mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <span>
              {new Date(post.date || post.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && post.image !== "/blog/local-post.jpg" && (
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={renderContent(post.content)}
            className="text-gray-800 leading-relaxed"
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>
                Published on{" "}
                {new Date(post.date || post.createdAt).toLocaleDateString()}
              </p>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <p>
                  Last updated on{" "}
                  {new Date(post.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <a
              href="/blog"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Blog
            </a>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
}
