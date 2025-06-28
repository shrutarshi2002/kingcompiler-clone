import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request) {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      category,
      platforms,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = await request.json();

    // Validate required fields
    if (!title || !content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results = {};

    // Publish to selected platforms
    for (const platform of platforms) {
      try {
        switch (platform.toLowerCase()) {
          case "hashnode":
            results.hashnode = await publishToHashnode({
              title,
              content,
              excerpt,
              tags,
              category,
            });
            break;
          case "dev.to":
            results.devto = await publishToDevTo({
              title,
              content,
              excerpt,
              tags,
              category,
            });
            break;
          case "linkedin":
            results.linkedin = await publishToLinkedIn({
              title,
              content,
              excerpt,
              tags,
              category,
            });
            break;
          case "substack":
            results.substack = await publishToSubstack({
              title,
              content,
              excerpt,
              tags,
              category,
            });
            break;
          default:
            results[platform] = { error: `Platform ${platform} not supported` };
        }
      } catch (error) {
        results[platform] = { error: error.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Article published successfully",
      results,
    });
  } catch (error) {
    console.error("Publishing error:", error);
    return NextResponse.json(
      { error: "Failed to publish article" },
      { status: 500 }
    );
  }
}

async function publishToHashnode(data) {
  // Hashnode API integration
  const apiKey = process.env.HASHNODE_API_KEY;
  if (!apiKey) {
    return { error: "Hashnode API key not configured" };
  }

  const mutation = `
    mutation CreatePublicationStory($input: CreateStoryInput!) {
      createPublicationStory(input: $input) {
        code
        success
        message
        post {
          _id
          title
          slug
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      title: data.title,
      contentMarkdown: data.content,
      tags: data.tags.map((tag) => ({ name: tag })),
      publicationId: process.env.HASHNODE_PUBLICATION_ID,
    },
  };

  try {
    const response = await fetch("https://api.hashnode.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function publishToDevTo(data) {
  // Dev.to API integration
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    return { error: "Dev.to API key not configured" };
  }

  try {
    const response = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        article: {
          title: data.title,
          body_markdown: data.content,
          description: data.excerpt,
          tags: data.tags,
          published: true,
        },
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function publishToLinkedIn(data) {
  // LinkedIn API integration
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!accessToken) {
    return { error: "LinkedIn access token not configured" };
  }

  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: `${data.title}\n\n${data.excerpt}\n\nRead more: [Your blog URL]`,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function publishToSubstack(data) {
  // Substack integration (manual posting instructions)
  return {
    message: "Manual posting required",
    instructions: [
      "1. Go to https://kingcompiler.substack.com/publish",
      "2. Create a new post with the following details:",
      `   - Title: ${data.title}`,
      `   - Content: ${data.content.substring(0, 100)}...`,
      `   - Tags: ${data.tags.join(", ")}`,
      "3. Publish the post",
      "4. The post will automatically appear on your blog page via RSS feed",
    ],
  };
}
