# Weekly automation: blog drafts and SEO watch

Two GitHub Actions workflows run every Monday. Neither publishes anything by itself.

| Workflow | When (UTC) | What it does | How you hear about it |
| --- | --- | --- | --- |
| `weekly-blog.yml` | Mon 04:30 | OpenCode (OpenCode's own models, no Claude) writes one article from `automation/blog-topics.md`, the build and audit run, and a **draft pull request** is opened | GitHub email: new pull request. You review and merge to publish |
| `weekly-seo-watch.yml` | Mon 05:00 | Health check of the live site, Lighthouse, search rankings, AI-search citations; report posted on a rolling issue | GitHub email: new issue labelled `seo-alert` **only when something needs attention** |

Run either one on demand: GitHub, Actions tab, pick the workflow, Run workflow.

## One-time setup

1. **Allow Actions to open pull requests.** Repository, Settings, Actions, General, Workflow permissions: choose "Read and write permissions" and tick "Allow GitHub Actions to create and approve pull requests".
2. **Turn on email notifications.** GitHub, Settings, Notifications: make sure you are watching this repository (the owner is by default) and that email is on for issues and pull requests.
3. **Blog drafting uses OpenCode only, with an OpenCode key.** Settings, Secrets and variables, Actions, New repository secret: `OPENCODE_API_KEY`. Optional repository variables: `OPENCODE_MODEL` (default `opencode/deepseek-v4-pro`; run `opencode models` locally to see the list, including `-free` models) and `OPENCODE_PACKAGE` (default `@opencode/cli@2.2.7`, the version this was written against). The workflow refuses any model that is not an `opencode/...` model or that contains `claude` or `anthropic`.
4. **Search and AI tracking need keys (all optional).** Without them the weekly report still runs health checks and Lighthouse, and says what is not configured.

| Secret | Used for | Notes |
| --- | --- | --- |
| `BRAVE_API_KEY` | Where the site ranks for each query in `automation/seo-queries.json` | Brave Search API. Check current plans and terms |
| `GOOGLE_CSE_KEY` + `GOOGLE_CSE_CX` | Same, using Google Programmable Search | Create a search engine set to search the whole web. Availability for new users has been changing, so verify before relying on it |
| `PERPLEXITY_API_KEY` | Whether Perplexity cites or names the site for each question | ChatGPT Search and Google AI Overviews have no free programmatic interface, so check those by hand now and then |
| `NTFY_TOPIC` | Optional phone push for alerts through ntfy.sh | Choose a long random topic name and subscribe to it in the ntfy app. Anyone who knows the name can read it, so alerts contain no secrets |

## How the weekly blog works

- The first unchecked line in `automation/blog-topics.md` is the topic. Edit that list whenever you like.
- The prompt is `automation/prompts/weekly-blog.md`. It forbids invented facts, requires references and internal links, and tells the agent to run the quality gate.
- Safeguards before a pull request exists: only the new article and the topic list may change; `scripts/check-blog-post.mjs` enforces front matter, length, headings, code block, real internal links and no placeholders; then the whole site is built and `npm run audit` must pass.
- The pull request is a draft with a review checklist. **You are the editor**: check the facts, run the code if you can, and make it sound like you. Close the PR to discard it.
- Locally: `npm run blog:draft` runs the same prompt with your installed OpenCode, then the quality gate. `npm run blog:check` re-checks every post.

## How the SEO watch works

`scripts/seo-watch.mjs` (also `npm run seo:watch`) compares this week with last week. State is stored in a hidden comment on the rolling issue, so no extra files are committed.

You get an alert issue when:
- a live page breaks (not 200, wrong canonical, missing H1, invalid JSON-LD, noindex) or `robots.txt` blocks the site;
- a Lighthouse category on a tracked page drops below `lighthouseMinScore` (default 90);
- the site **newly appears** in the top `alertWhenFoundInTop` (default 20) results for a tracked query, improves by 3 or more places, or drops out;
- an AI search engine **newly cites the site or names Yash Savaliya**, or stops doing so.

Edit `automation/seo-queries.json` to change queries, AI questions, pages and thresholds.

## What this cannot do

- It cannot see what Google or ChatGPT show to an individual user (results vary by person, place and time), only what the configured APIs return.
- A brand-new site usually takes weeks to be indexed. Expect "not found" for a while; submit the sitemap in Search Console to speed it up.
- AI-written drafts are a starting point. Publishing unreviewed AI content under your name can hurt both credibility and search performance.
