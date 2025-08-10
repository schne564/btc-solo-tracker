# BTC Solo Mining Tracker - GitHub Pages + Cloudflare Worker (Free)

This project provides a static frontend (GitHub Pages) and a Cloudflare Worker that proxies CKPool's user stats JSON endpoint. It's fully free to host and does not require any paid plans.

What you get
- `index.html`, `styles.css`, `app.js` — static frontend (put these in your GitHub repo and enable Pages)
- `worker.js` — Cloudflare Worker script to deploy (provides `/user/<address>` JSON endpoint)
- Instructions below to deploy both parts for free.

Steps to deploy (quick)

1) Create a new GitHub repository and push the frontend files (`index.html`, `styles.css`, `app.js`).
   - Enable GitHub Pages from the repo settings (branch `main` / folder `/` or `/docs`).
   - After a few minutes your frontend will be live at `https://<your-username>.github.io/<repo>`.

2) Deploy the Cloudflare Worker
   - Create a free Cloudflare account (if you don't have one).
   - Go to the Workers dashboard -> Create a new Worker.
   - Replace the default script with the contents of `worker.js` and save.
   - Publish the Worker — you'll get a Workers subdomain like `https://<name>.<account>.workers.dev`.

3) Wire the frontend to the Worker
   - Open `app.js` and replace `WORKER_URL_PLACEHOLDER` with your Worker URL (e.g. `https://mytracker.username.workers.dev`).
   - Commit and push the change to GitHub; the site will update automatically.

4) Test
   - Open your GitHub Pages site, enter a BTC address, and click **Track**. The frontend will call the Worker, which proxies CKPool JSON and returns stats.
   - Auto-refresh is every 60s by default.

Notes & troubleshooting
-----------------------
- The Worker tries the JSON endpoint `https://solo.ckpool.org/ajax/stats/user_stats?address=...`. If that fails, it fetches the user page and returns an `html_fallback` JSON.
- If you see `html_fallback` in the frontend, CKPool did not return JSON; I can help adapt parsing rules or scrape specific values from the HTML if needed.
- Cloudflare Workers free tier allows ample requests for testing and small production usage.
- If you want, I can prepare a GitHub repo for you; you'll only need to press "Create repository" and publish.

If you'd like I can auto-create the repo and give you exact files to paste, or prepare a ZIP with everything (I did) — tell me which and I’ll proceed.
