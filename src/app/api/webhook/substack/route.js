import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request) {
  try {
    const body = await request.json();

    // Log the webhook payload for debugging
    console.log("Substack webhook received:", JSON.stringify(body, null, 2));

    // Verify the webhook is from Substack (you can add more validation)
    const userAgent = request.headers.get("user-agent") || "";
    const isFromSubstack =
      userAgent.includes("Substack") ||
      body.source === "substack" ||
      body.type === "post.published";

    if (!isFromSubstack) {
      console.log("Webhook not from Substack, ignoring");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Trigger a cache refresh by making a request to the blog API
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const refreshResponse = await fetch(`${baseUrl}/api/blog/substack`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        console.log(
          "Blog cache refreshed successfully. Total posts:",
          data.totalPosts
        );
      }
    } catch (error) {
      console.error("Error refreshing blog cache:", error);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing Substack webhook:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Also handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Substack webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
