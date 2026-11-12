# Weekly automation: blog drafts and SEO watch

Three GitHub Actions workflows run every Monday. None publishes anything by itself, and none sends alerts.

| Workflow | When (UTC) | What it does | Where you see it |
| --- | --- | --- | --- |
| `weekly-blog.yml` | Mon 04:30 | OpenCode (its own models, no Claude) writes one article from `automation/blog-topics.md`; the build and audit run; a **draft pull request** is opened | The Pull requests tab. You review and merge to publish |
| `weekly-seo-watch.yml` | Mon 05:00 | Live health check, Lighthouse, and Playwright search tracking on Bing and DuckDuckGo | The run's **Summary** page in the Actions tab, plus a downloadable report artifact. No issues, no alerts |
| `weekly-seo-fix.yml` | Mon 05:30 | Builds the site and runs the quality gate. If anything fails, OpenCode fixes the source and a **draft pull request** is opened | The Pull requests tab (only when there is something to fix). The report is also on the run's Summary page |

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

## How the weekly SEO and GEO fixer works

`scripts/seo-fix-loop.mjs` (also `npm run seo:fix`) is the whole loop. `scripts/quality-gate.mjs` (also `npm run quality`) is the detector:

| Check | What must be true |
| --- | --- |
| Repo audit (`scripts/audit-all.mjs`) | Titles, descriptions, canonicals, Open Graph, JSON-LD, sitemap, robots, every internal link and anchor, and the **GEO facts**: `llms.txt` lists every article and project, the home page states name, role and location as text, every FAQ answer in the structured data is also visible, the Person schema is complete, every article shows its author and dates |
| Lighthouse | Accessibility, best practices and SEO are 100 on a sample of pages, mobile and desktop. Performance is reported but never "fixed", because it varies by 10 points between identical runs |
| axe-core | No WCAG 2.2 AA violations, light and dark themes, every page |
| W3C Nu validator | No HTML errors or warnings |

The loop:
1. Build and run the gate. **No issues: stop.** No model is called and nothing is opened.
2. Otherwise run OpenCode (up to 2 attempts) with the issue list and `automation/prompts/seo-fix.md`. Any change outside `src/`, `content/blog/`, `public/llms.txt` and `public/robots.txt` is thrown away, so the agent cannot edit workflows, scripts, the gate or dependencies.
3. Rebuild and re-run the whole gate. The changes are kept **only if the build passes, the issue count drops and no new issue appears**. Otherwise everything is reverted and the run summary says why.
4. If kept, a draft PR is opened with a before/after report. You review and merge.

Run it by hand: `npm run build && npm run quality` shows the issues without changing anything. Set `QUALITY_FAST=1` to skip Lighthouse. `workflow_dispatch` accepts a `ref` input so you can point the fixer at any branch.

Limits you should know:
- **"GEO 100%" is not a number anyone can measure.** AI search engines publish no score. The GEO checks above are concrete, testable proxies (consistent facts, structured data that matches visible text, crawlable text, a complete `llms.txt`). Passing them does not guarantee that ChatGPT, Perplexity or Google will cite you.
- **Some things cannot be fixed in the repo.** GitHub Pages cannot send security headers, and a new site needs weeks to be indexed. The gate does not check those, so a clean run does not mean Google ranks you.
- **The agent is a free model by default** (`opencode/deepseek-v4.1-flash-free`). It may fail to fix hard issues; then you get a run summary and no PR. Set the `OPENCODE_MODEL` variable to use a stronger `opencode/...` model.
- Fixes are suggestions. Read the diff before merging, especially anything touching content.

## What this cannot do

- **Google is not tracked.** Google blocks automated browsers, and automating its results page is against its terms. Bing and DuckDuckGo are used as a rough signal; they are not the same as Google rankings. Check Google by hand, or use Google Search Console (free) for real impression and ranking data once the site is verified.
- **Search engines can block or change.** If a results page shows a bot check or its layout changes, the report shows `blocked` for that query instead of pretending the site was not found. Running from GitHub's data-centre addresses makes this more likely than from your home connection.
- **Scraping search results is a grey area.** This is a small weekly volume (20 searches) with delays between requests. If either engine objects, drop that engine from `scripts/seo-watch.mjs`.
- A brand-new site can take weeks to be indexed, so "not found" is expected at first. Submit the sitemap in Search Console and Bing Webmaster Tools to speed it up.
- AI-written blog drafts are a starting point. Publishing unreviewed AI content under your name can hurt both credibility and search performance.
