"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogEditor from "../../components/BlogEditor";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all local blog posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blog/local");
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setError("Failed to fetch blog posts");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post save (create or update)
  const handlePostSave = (savedPost) => {
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) => (post.id === savedPost.id ? savedPost : post))
      );
      setSuccess("Blog post updated successfully!");
    } else {
      // Add new post
      setPosts([savedPost, ...posts]);
      setSuccess("Blog post created successfully!");
    }
    setShowEditor(false);
    setEditingPost(null);
  };

  // Handle edit post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/local?id=${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setPosts(posts.filter((post) => post.id !== postId));
        setSuccess("Blog post deleted successfully!");
      } else {
        setError("Failed to delete blog post");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  // Handle create new post
  const handleCreatePost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  // Handle cancel editor
  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <div className="py-8">
          <BlogEditor
            post={editingPost}
            onSave={handlePostSave}
            onCancel={handleCancelEditor}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blog Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your local blog posts</p>
            </div>
            <button
              onClick={handleCreatePost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Post
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first blog post to get started
              </p>
              <button
                onClick={handleCreatePost}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            /* Posts List */
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
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
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {posts.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Blog Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Posts:</span>
                  <span className="ml-2 font-semibold">{posts.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Categories:</span>
                  <span className="ml-2 font-semibold">
                    {new Set(posts.map((post) => post.category)).size}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Latest Post:</span>
                  <span className="ml-2 font-semibold">
                    {posts[0]?.date || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Words:</span>
                  <span className="ml-2 font-semibold">
                    {posts
                      .reduce(
                        (total, post) =>
                          total +
                          (post.content
                            ?.split(/\s+/)
                            .filter((word) => word.length > 0).length || 0),
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
