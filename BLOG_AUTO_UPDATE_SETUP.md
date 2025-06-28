# Blog Auto-Update Setup Guide

This guide explains how to set up automatic updates for your blog when new posts are published on Substack.

## 🚀 Features Implemented

### 1. **Cache-Busting API Endpoints**

- All API endpoints now disable caching to ensure fresh content
- Added cache control headers to prevent stale data
- Real-time fetching from Substack RSS feed

### 2. **Automatic Refresh on Frontend**

- **BlogSection component**: Auto-refreshes every 5 minutes
- **Blog page**: Auto-refreshes every 3 minutes
- **Intersection Observer**: Refreshes when component becomes visible
- **Manual refresh button**: Users can manually refresh content

### 3. **Webhook Endpoint**

- Created `/api/webhook/substack` endpoint
- Can be triggered by Substack when new posts are published
- Automatically refreshes blog cache

### 4. **Cron Job Script**

- Created `scripts/refresh-blog.js` for automated updates
- Can be run manually or scheduled as a cron job

## 📋 Setup Instructions

### Option 1: Automatic Frontend Refresh (Recommended)

The frontend components now automatically refresh content:

1. **BlogSection** (Homepage): Refreshes every 5 minutes
2. **Blog Page**: Refreshes every 3 minutes
3. **Manual Refresh**: Users can click the refresh button

This is the easiest option and works out of the box!

### Option 2: Cron Job Setup

For more reliable updates, set up a cron job:

#### On Linux/Mac:

1. **Make the script executable:**

   ```bash
   chmod +x scripts/refresh-blog.js
   ```

2. **Set up environment variables:**

   ```bash
   export BASE_URL="https://your-domain.com"
   export WEBHOOK_URL="https://your-domain.com/api/webhook/substack"
   ```

3. **Add to crontab (refresh every 5 minutes):**

   ```bash
   crontab -e
   ```

   Add this line:

   ```
   */5 * * * * cd /path/to/your/project && node scripts/refresh-blog.js >> /var/log/blog-refresh.log 2>&1
   ```

#### On Windows:

1. **Create a batch file** (`refresh-blog.bat`):

   ```batch
   @echo off
   cd /d "C:\path\to\your\project"
   set BASE_URL=https://your-domain.com
   set WEBHOOK_URL=https://your-domain.com/api/webhook/substack
   node scripts/refresh-blog.js
   ```

2. **Use Task Scheduler:**
   - Open Task Scheduler
   - Create Basic Task
   - Set trigger to every 5 minutes
   - Action: Start a program
   - Program: `C:\path\to\your\project\refresh-blog.bat`

### Option 3: Webhook Integration (Advanced)

If Substack supports webhooks, you can configure them to call your webhook endpoint:

1. **Webhook URL:** `https://your-domain.com/api/webhook/substack`
2. **Method:** POST
3. **Content-Type:** application/json

The webhook will automatically refresh your blog cache when triggered.

## 🔧 Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
BASE_URL=https://your-domain.com
WEBHOOK_URL=https://your-domain.com/api/webhook/substack
```

### API Endpoints

- **Main Blog API:** `/api/blog` - Returns all Substack posts
- **Substack API:** `/api/blog/substack` - Returns only Substack posts
- **Webhook:** `/api/webhook/substack` - Handles webhook notifications

## 📊 Monitoring

### Check if Auto-Refresh is Working

1. **Open browser console** on your blog page
2. **Look for these messages:**

   ```
   Auto-refreshing blog posts...
   Blog section visible, checking for updates...
   ```

3. **Check the "Last updated" timestamp** on the blog page

### Manual Testing

1. **Test the refresh script:**

   ```bash
   node scripts/refresh-blog.js
   ```

2. **Test the webhook:**
   ```bash
   curl -X POST https://your-domain.com/api/webhook/substack \
     -H "Content-Type: application/json" \
     -H "User-Agent: Substack/1.0" \
     -d '{"type":"post.published"}'
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Posts not updating:**

   - Check if your development server is running
   - Verify the Substack RSS feed is accessible
   - Check browser console for errors

2. **Cron job not working:**

   - Verify the script path is correct
   - Check file permissions
   - Review cron logs: `tail -f /var/log/blog-refresh.log`

3. **Webhook not responding:**
   - Ensure your domain is accessible
   - Check server logs for webhook requests
   - Verify webhook endpoint is working

### Debug Mode

Enable debug logging by adding this to your `.env.local`:

```env
DEBUG=true
```

## 📈 Performance Considerations

- **Frontend refresh intervals** are optimized for user experience
- **API endpoints** use cache-busting headers to ensure fresh content
- **Cron job** runs every 5 minutes to balance freshness and server load
- **Webhook** provides instant updates when available

## 🔄 Update Frequency

- **Frontend Auto-Refresh:** Every 3-5 minutes
- **Cron Job:** Every 5 minutes (configurable)
- **Webhook:** Instant (when triggered by Substack)
- **Manual Refresh:** On-demand via refresh button

## ✅ Verification

To verify everything is working:

1. **Publish a new post on Substack**
2. **Wait 3-5 minutes** for automatic refresh
3. **Check your website** - the new post should appear
4. **Verify the "Last updated" timestamp** has changed

Your blog will now automatically stay up-to-date with new Substack posts! 🎉
