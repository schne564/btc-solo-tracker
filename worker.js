addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\//, ''); // e.g. user/<addr>
  const parts = path.split('/');
  if(parts[0] === 'user' && parts[1]){
    const addr = encodeURIComponent(parts[1]);
    const apiUrl = `https://solo.ckpool.org/ajax/stats/user_stats?address=${addr}`;
    try {
      const resp = await fetch(apiUrl, { cf: { cacheTtl: 60 } });
      if(resp.ok){
        const json = await resp.json();
        return new Response(JSON.stringify(json), {
          headers: { 'content-type': 'application/json' }
        });
      }
    } catch (e){
      
    }
    const pageUrl = `https://solo.ckpool.org/users/${addr}`;
    const pageResp = await fetch(pageUrl);
    const text = await pageResp.text();
    return new Response(JSON.stringify({ html_fallback: true, html: text.slice(0,1000) }), {
      headers: { 'content-type': 'application/json' }
    });
  }
  return new Response('Not found', { status: 404 });
}
