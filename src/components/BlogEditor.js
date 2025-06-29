"use client";

import { useState, useEffect } from "react";

export default function BlogEditor({ post = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Chess",
    tags: "",
    image: "",
    author: "King Master Team",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with post data if editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        category: post.category || "Chess",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
        image: post.image || "",
        author: post.author || "King Master Team",
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate excerpt if empty
    if (name === "content" && !formData.excerpt) {
      const excerpt =
        value.substring(0, 200) + (value.length > 200 ? "..." : "");
      setFormData((prev) => ({
        ...prev,
        excerpt,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const url = post ? "/api/blog/local" : "/api/blog/local";
      const method = post ? "PUT" : "POST";

      if (post) {
        postData.id = post.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          post
            ? "Blog post updated successfully!"
            : "Blog post created successfully!"
        );
        if (onSave) {
          onSave(result.post);
        }
        // Reset form if creating new post
        if (!post) {
          setFormData({
            title: "",
            content: "",
            excerpt: "",
            category: "Chess",
            tags: "",
            image: "",
            author: "King Master Team",
          });
        }
      } else {
        setError(result.error || "Failed to save blog post");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = formData.content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const categories = [
    "Chess",
    "Coding",
    "Education",
    "Tutorials",
    "Strategy",
    "Technology",
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter blog post title..."
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Author name"
          />
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="chess, strategy, beginners"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Featured Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the blog post..."
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Write your blog post content here... You can use basic HTML tags like <strong>, <em>, <h2>, <p>, etc."
          />
          <div className="mt-2 text-sm text-gray-500">
            Word count: {wordCount} | Estimated read time:{" "}
            {Math.ceil(wordCount / 200)} min
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Saving..." : post ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>

      {/* Content Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Content Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use <code>&lt;h2&gt;</code> for section headings
          </li>
          <li>
            • Use <code>&lt;strong&gt;</code> for bold text
          </li>
          <li>
            • Use <code>&lt;em&gt;</code> for italic text
          </li>
          <li>
            • Use <code>&lt;p&gt;</code> for paragraphs
          </li>
          <li>
            • Use <code>&lt;ul&gt;</code> and <code>&lt;li&gt;</code> for lists
          </li>
          <li>• Include relevant images and examples</li>
        </ul>
      </div>
    </div>
  );
}
