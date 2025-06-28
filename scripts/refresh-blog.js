#!/usr/bin/env node

/**
 * Script to refresh blog content from Substack
 * This can be run as a cron job to automatically update your blog
 * 
 * Usage:
 * - Run manually: node scripts/refresh-blog.js
 * - Set up cron job: */5 * * * * node /path/to/your/project/scripts/refresh-blog.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WEBHOOK_URL = process.env.WEBHOOK_URL || `${BASE_URL}/api/webhook/substack`;

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'KingCompiler-Blog-Refresher/1.0',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers
      },
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function refreshBlog() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting blog refresh...`);

  try {
    // Refresh Substack posts
    console.log('Fetching Substack posts...');
    const substackResponse = await makeRequest(`${BASE_URL}/api/blog/substack`);
    
    if (substackResponse.status === 200 && substackResponse.data.success) {
      console.log(`Substack posts refreshed successfully. Total posts: ${substackResponse.data.totalPosts}`);
    } else {
      console.log(`Failed to refresh Substack posts:`, substackResponse.data);
    }

    // Refresh main blog API
    console.log('Fetching main blog API...');
    const blogResponse = await makeRequest(`${BASE_URL}/api/blog`);
    
    if (blogResponse.status === 200 && blogResponse.data.success) {
      console.log(`Main blog API refreshed successfully. Total posts: ${blogResponse.data.total}`);
    } else {
      console.log(`Failed to refresh main blog API:`, blogResponse.data);
    }

    // Trigger webhook to simulate new post
    console.log('Triggering webhook...');
    try {
      const webhookResponse = await makeRequest(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Substack/1.0'
        }
      });
      
      if (webhookResponse.status === 200) {
        console.log('Webhook triggered successfully');
      } else {
        console.log(`Webhook failed:`, webhookResponse.data);
      }
    } catch (webhookError) {
      console.log('Webhook error (this is normal if not configured):', webhookError.message);
    }

    console.log(`[${new Date().toISOString()}] Blog refresh completed successfully!`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Blog refresh failed:`, error.message);
    process.exit(1);
  }
}

// Run the refresh function
if (require.main === module) {
  refreshBlog().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { refreshBlog, makeRequest }; 