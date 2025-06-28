"use client";

import { useState, useEffect } from "react";

const platforms = [
  {
    name: "Hashnode",
    description: "Developer-focused blogging platform",
    apiKey: "hashnode_api_key",
    handle: "@kingcompiler",
    setupUrl: "https://hashnode.dev/settings/api",
    color: "bg-blue-600",
  },
  {
    name: "Dev.to",
    description: "Community of software developers",
    apiKey: "devto_api_key",
    handle: "@kingcompiler",
    setupUrl: "https://dev.to/settings/account",
    color: "bg-gray-800",
  },
  {
    name: "LinkedIn",
    description: "Professional networking platform",
    apiKey: "linkedin_api_key",
    handle: "@kingcompiler",
    setupUrl: "https://www.linkedin.com/developers/",
    color: "bg-blue-700",
  },
  {
    name: "Substack",
    description: "Newsletter and publishing platform",
    apiKey: "substack_api_key",
    handle: "@kingcompiler",
    setupUrl: "https://kingcompiler.substack.com/settings",
    color: "bg-orange-600",
  },
];

export default function WriterDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    category: "Chess",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate SEO fields if empty
    if (name === "title" && !formData.seoTitle) {
      setFormData((prev) => ({
        ...prev,
        seoTitle: value,
      }));
    }
    if (name === "excerpt" && !formData.seoDescription) {
      setFormData((prev) => ({
        ...prev,
        seoDescription: value,
      }));
    }
  };

  const handlePlatformToggle = (platformName) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) {
      alert("Please fill in title and content");
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    setIsPublishing(true);
    setPublishStatus(null);

    try {
      const response = await fetch("/api/blog/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          platforms: selectedPlatforms,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPublishStatus({
          type: "success",
          message: "Article published successfully!",
          details: result,
        });
        // Reset form
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          tags: "",
          category: "Chess",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
        });
        setSelectedPlatforms([]);
      } else {
        setPublishStatus({
          type: "error",
          message: "Failed to publish article",
          details: result.error,
        });
      }
    } catch (error) {
      setPublishStatus({
        type: "error",
        message: "Network error occurred",
        details: error.message,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const wordCount = formData.content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
              Writer Dashboard
            </h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            Writer Dashboard
          </h1>

          {/* Platform Setup Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Platform Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${platform.color} mr-2`}
                    ></div>
                    <h3 className="font-semibold text-gray-900">
                      {platform.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {platform.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Handle: {platform.handle}
                  </p>
                  <a
                    href={platform.setupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Setup API Key →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Article Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your article title..."
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your article..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Write your article content here... (Supports HTML)"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Word count: {wordCount}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="chess, strategy, beginners"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Chess">Chess</option>
                  <option value="Coding">Coding</option>
                  <option value="Education">Education</option>
                  <option value="Tutorials">Tutorials</option>
                </select>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publishing Platforms
                </label>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <label key={platform.name} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.name)}
                        onChange={() => handlePlatformToggle(platform.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {platform.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  SEO Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="SEO-optimized title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Meta description for search engines..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      name="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <div className="border-t pt-6">
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isPublishing ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {publishStatus && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                publishStatus.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div
                className={`font-semibold ${
                  publishStatus.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {publishStatus.message}
              </div>
              {publishStatus.details && (
                <div
                  className={`mt-2 text-sm ${
                    publishStatus.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {typeof publishStatus.details === "object"
                    ? JSON.stringify(publishStatus.details, null, 2)
                    : publishStatus.details}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
