# Netlify Deployment Guide - Blog Fix

## Issues Fixed

1. **Incorrect Netlify Configuration**: Removed problematic redirects and fixed publish directory
2. **API Route Issues**: Fixed internal API calls to work in production
3. **Static Generation**: Removed `force-static` exports that caused issues
4. **Error Handling**: Improved error handling for RSS feed fetching

## Required Environment Variables

Set these in your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variable:

```
NEXT_PUBLIC_BASE_URL = https://your-site-name.netlify.app
```

Replace `your-site-name` with your actual Netlify site name.

## Deployment Steps

1. **Commit and push your changes** to your repository
2. **Set the environment variable** in Netlify dashboard
3. **Trigger a new deployment** in Netlify
4. **Check the deployment logs** for any errors

## Testing the Fix

1. **Check the API endpoints**:

   - Visit: `https://your-site-name.netlify.app/api/blog`
   - Should return JSON with blog posts

2. **Check the blog page**:

   - Visit: `https://your-site-name.netlify.app/blog/`
   - Should display blog posts from Substack

3. **Check browser console** for any errors

## Troubleshooting

### If blogs still don't appear:

1. **Check Netlify function logs**:

   - Go to Netlify dashboard → Functions
   - Look for any errors in the API routes

2. **Test RSS feed directly**:

   - Visit: `https://kingcompiler.substack.com/feed`
   - Should return XML content

3. **Check environment variables**:

   - Verify `NEXT_PUBLIC_BASE_URL` is set correctly
   - Should match your Netlify site URL

4. **Clear cache**:
   - Add `?v=1` to your blog URL to bypass cache
   - Example: `https://your-site-name.netlify.app/blog/?v=1`

### Common Issues:

1. **CORS errors**: The API routes should handle this automatically
2. **RSS feed not accessible**: Check if the Substack RSS feed is public
3. **Environment variables not set**: Make sure to set them in Netlify dashboard

## Manual Testing

You can test the API endpoints manually:

```bash
# Test main blog API
curl https://your-site-name.netlify.app/api/blog

# Test Substack API
curl https://your-site-name.netlify.app/api/blog/substack
```

Both should return JSON responses with blog posts.

## Support

If issues persist:

1. Check Netlify deployment logs
2. Verify environment variables are set
3. Test RSS feed accessibility
4. Check browser console for client-side errors
