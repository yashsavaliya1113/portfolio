# Weekly automation: blog drafts and SEO watch

Two GitHub Actions workflows run every Monday. Neither publishes anything by itself, and neither sends alerts.

| Workflow | When (UTC) | What it does | Where you see it |
| --- | --- | --- | --- |
| `weekly-blog.yml` | Mon 04:30 | OpenCode (its own models, no Claude) writes one article from `automation/blog-topics.md`; the build and audit run; a **draft pull request** is opened | The Pull requests tab. You review and merge to publish |
| `weekly-seo-watch.yml` | Mon 05:00 | Live health check, Lighthouse, and Playwright search tracking on Bing and DuckDuckGo | The run's **Summary** page in the Actions tab, plus a downloadable report artifact. No issues, no alerts |

Run either one on demand: GitHub, Actions tab, pick the workflow, Run workflow.

## One-time setup

1. **Allow Actions to open pull requests.** Repository, Settings, Actions, General, Workflow permissions: choose "Read and write permissions" and tick "Allow GitHub Actions to create and approve pull requests".
2. **Add one secret for blog drafting:** `OPENCODE_API_KEY` (Settings, Secrets and variables, Actions). The SEO watch needs **no secrets**.
3. Optional repository variables: `OPENCODE_MODEL` (default `opencode/deepseek-v4-pro`; run `opencode models` to see the list, including `-free` models) and `OPENCODE_PACKAGE` (default `@opencode/cli@2.2.7`). The blog workflow refuses any model that is not an `opencode/...` model or that contains `claude` or `anthropic`.
4. **If you want zero emails from GitHub:** GitHub, Settings, Notifications, Actions: turn off email for failed workflow runs. By default GitHub emails you only when a workflow run fails, not when it succeeds.

## How the weekly blog works

- The first unchecked line in `automation/blog-topics.md` is the topic. Edit that list whenever you like.
- The prompt is `automation/prompts/weekly-blog.md`. It forbids invented facts, requires references and internal links, and tells the agent to run the quality gate.
- Safeguards before a pull request exists: only the new article and the topic list may change; `scripts/check-blog-post.mjs` enforces front matter, length, headings, a code block, real internal links and no placeholders; then the whole site is built and `npm run audit` must pass.
- The pull request is a draft with a review checklist. **You are the editor**: check the facts, run the code if you can, and make it sound like you. Close the PR to discard it.
- Locally: `npm run blog:draft` runs the same prompt with your installed OpenCode, then the quality gate. `npm run blog:check` re-checks every post.

## How the SEO watch works

`scripts/seo-watch.mjs` (also `npm run seo:watch`) produces a report with four parts:

1. **Site health:** every sitemap URL returns 200 with a title, one canonical equal to the URL, one H1, valid JSON-LD and no `noindex`; `robots.txt` does not block the site.
2. **Lighthouse:** mobile scores for the pages in `automation/seo-queries.json`.
3. **Search tracking with Playwright:** a real headless browser searches Bing and DuckDuckGo for each query in `automation/seo-queries.json` and records where the site appears (`-` means not found).
4. **AI search:** a list of questions to ask ChatGPT, Perplexity, Gemini and Copilot by hand. This part cannot be automated without paid APIs.

A "Changes since last week" section compares with the previous run (the report and `state.json` are kept as an artifact for 90 days). It is informational only.

Run it locally: `npm run seo:watch`. If you have Chrome installed and no Playwright browser, use `PW_CHANNEL=chrome npm run seo:watch`; otherwise run `npx playwright install chromium` once.

## What this cannot do

- **Google is not tracked.** Google blocks automated browsers, and automating its results page is against its terms. Bing and DuckDuckGo are used as a rough signal; they are not the same as Google rankings. Check Google by hand, or use Google Search Console (free) for real impression and ranking data once the site is verified.
- **Search engines can block or change.** If a results page shows a bot check or its layout changes, the report shows `blocked` for that query instead of pretending the site was not found. Running from GitHub's data-centre addresses makes this more likely than from your home connection.
- **Scraping search results is a grey area.** This is a small weekly volume (20 searches) with delays between requests. If either engine objects, drop that engine from `scripts/seo-watch.mjs`.
- A brand-new site can take weeks to be indexed, so "not found" is expected at first. Submit the sitemap in Search Console and Bing Webmaster Tools to speed it up.
- AI-written blog drafts are a starting point. Publishing unreviewed AI content under your name can hurt both credibility and search performance.
