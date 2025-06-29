# Deployment Checklist for Netlify

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables**

- [ ] Set `NEXT_PUBLIC_BASE_URL` in Netlify dashboard
- [ ] Value should be: `https://your-site-name.netlify.app`

### 2. **Files Updated**

- [x] `netlify.toml` - Fixed configuration
- [x] `src/app/api/blog/route.js` - Fixed API calls
- [x] `src/app/api/blog/substack/route.js` - Removed force-static
- [x] `src/app/api/webhook/substack/route.js` - Fixed base URL
- [x] `src/app/blog/page.js` - Added better error handling

### 3. **Code Changes Summary**

- ✅ Removed problematic redirects from netlify.toml
- ✅ Fixed internal API calls to work in production
- ✅ Removed `force-static` exports from API routes
- ✅ Added better error handling and logging
- ✅ Improved RSS feed validation

## 🚀 Deployment Steps

### Step 1: Commit and Push

```bash
git add .
git commit -m "Fix blog issues for Netlify deployment"
git push origin main
```

### Step 2: Set Environment Variable

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add: `NEXT_PUBLIC_BASE_URL = https://your-site-name.netlify.app`

### Step 3: Trigger Deployment

- Netlify should auto-deploy when you push
- Or manually trigger from dashboard

## 🧪 Testing After Deployment

### Test 1: API Endpoints

- [ ] Visit: `https://your-site-name.netlify.app/api/blog`
- [ ] Should return JSON with blog posts
- [ ] Visit: `https://your-site-name.netlify.app/api/blog/substack`
- [ ] Should return Substack posts

### Test 2: Blog Page

- [ ] Visit: `https://your-site-name.netlify.app/blog/`
- [ ] Should display blog posts
- [ ] Check browser console for errors
- [ ] Test refresh button

### Test 3: RSS Feed

- [ ] Visit: `https://kingcompiler.substack.com/feed`
- [ ] Should return XML content

## 🔍 Troubleshooting

### If blogs don't appear:

1. **Check Netlify logs** in dashboard
2. **Verify environment variable** is set correctly
3. **Test RSS feed** accessibility
4. **Clear browser cache** or add `?v=1` to URL

### Common Issues:

- **404 errors**: Check if API routes are accessible
- **Empty responses**: Verify RSS feed is working
- **CORS errors**: Should be handled automatically
- **Environment variables**: Make sure they're set in Netlify

## 📞 Support

If issues persist:

1. Check Netlify function logs
2. Verify all environment variables
3. Test RSS feed directly
4. Check browser console for client-side errors

## 🎯 Expected Result

After deployment, your blog should:

- ✅ Load posts from Substack RSS feed
- ✅ Display posts on `/blog/` page
- ✅ Auto-refresh every 3 minutes
- ✅ Allow manual refresh
- ✅ Show proper error messages if issues occur
