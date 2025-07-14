// Cloudflare Worker for Cronicle
// This is a minimal worker that could serve some functionality
// Note: The full Cronicle server cannot run on Workers due to platform limitations

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle different routes
    if (url.pathname === '/') {
      return new Response('Cronicle Worker is running!', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        worker: 'cronicle-worker'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For API endpoints, you would need to reimplement the logic
    // that's compatible with the Workers runtime
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        error: 'API not implemented in worker version'
      }), {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
