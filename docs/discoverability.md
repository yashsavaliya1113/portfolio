# Getting found: people searches, ChatGPT, Google and Bing

Why a ".NET developer in Ahmedabad" question in ChatGPT lists other people and not you, and what actually changes that.

## Why you are not listed (yet)

ChatGPT's search answers are built from pages it can find on the web (reportedly drawing heavily on Bing). In the conversation you pasted, every person it named came from one of these places:

- a **personal site on its own domain** (for example `joshihimanshu.in`, `shrikantsatpute.in`)
- a **LinkedIn profile** that says ".NET" and "Ahmedabad" in the headline or about section
- a **developer community profile** (C# Corner) or a **resume/job-board listing** (PostJobFree, RemoteHub)

Your portfolio is new, lives under a `github.io/portfolio` path, the host root (`yashsavaliya1113.github.io`) returns a 404, your GitHub profile has no bio, location or website, and you have few mentions elsewhere. A search engine that has not indexed you, or has found nothing else that mentions you, cannot give an AI anything to cite. Nobody can force ChatGPT to list a person. What you can do is make yourself easy to find in the places it reads, then wait: indexing and trust take weeks, sometimes months.

## Checklist, highest impact first

1. **Fix the root 404 (2 minutes).** Create the public repo `yashsavaliya1113.github.io` with the redirect files from `D:\trash\pp\yashsavaliya1113.github.io`, then Settings, Pages, deploy from `main` / root. Search consoles want to verify the whole host, and crawlers often check the root first.
2. **Tell the search engines you exist.**
   - Bing Webmaster Tools (bing.com/webmasters): add `https://yashsavaliya1113.github.io/`, verify (the root repo lets you add the verification file or meta tag), then submit `https://yashsavaliya1113.github.io/portfolio/sitemap.xml`. ChatGPT search reportedly draws on Bing, so this matters most.
   - Google Search Console: add the URL-prefix property `https://yashsavaliya1113.github.io/portfolio/`, submit the same sitemap, and use URL Inspection, Request indexing on the home page.
3. **Complete your GitHub profile (5 minutes).** Name, bio, location "Ahmedabad, Gujarat, India", website `https://yashsavaliya1113.github.io/portfolio/`, pin the portfolio repo. Create a repo named exactly `yashsavaliya1113` with a README (text below): GitHub shows it on your profile.
4. **LinkedIn (10 minutes).** Put the role and city in the headline. Search and AI both read it. Text below.
5. **C# Corner and other communities.** Create a profile, add the same headline and a link to the portfolio, and cross-post your articles with a canonical link back to your site, so the original stays yours.
6. **Resume or job-board listings, only if you are job hunting.** ChatGPT cited PostJobFree and RemoteHub profiles. Use the same headline and keywords.
7. **Consider your own domain.** Every person ChatGPT named with a personal site used one. A domain costs a few hundred rupees a year and GitHub Pages supports it for free. If you buy one, tell me and I will update the canonical URLs, sitemap and `llms.txt`.
8. **Keep publishing.** The weekly blog and SEO jobs help. Real articles with code are what other sites link to.

## Copy-ready text (all of it matches what is already on your site; edit anything that is not true for you)

### LinkedIn headline (220 characters max)
Full Stack .NET Developer | C#, ASP.NET Core, Angular, Azure, SQL Server | Data Analyst (SQL, Python, Power BI) | Ahmedabad

### LinkedIn About
I'm a Full Stack .NET Developer and Data Analyst based in Ahmedabad, India. For 2+ years I have built and maintained production SaaS platforms across monitoring, assessment and payment domains with C#, ASP.NET Core, Angular, SQL Server and Azure at iTechOps.

I also analyze data with SQL, Python (Pandas), Excel and Power BI. Recent projects: an analysis of 5,478 Ahmedabad RERA real estate registrations, and an operational analytics study of SaaS incidents built on a clearly disclosed synthetic dataset.

I write practical articles on ASP.NET Core, SQL performance, Python automation and Azure.

Portfolio and articles: https://yashsavaliya1113.github.io/portfolio/
GitHub: https://github.com/yashsavaliya1113

[Add only if true: Open to .NET Developer and Data Analyst roles in Ahmedabad / remote. Notice period: ...]

### Skills to list on LinkedIn (use the exact words people search)
C#, .NET Core, ASP.NET Core, ASP.NET Web API, Entity Framework Core, SQL Server, Azure, Angular, Microservices, REST APIs, Python, Pandas, Power BI, Data Analysis, Excel

### GitHub bio (160 characters max)
Full Stack .NET Developer & Data Analyst in Ahmedabad. C#, ASP.NET Core, Azure, SQL, Python.

### GitHub profile README (repo `yashsavaliya1113/yashsavaliya1113`, file `README.md`)

```markdown
# Hi, I'm Yash Savaliya

Full Stack .NET Developer and Data Analyst in Ahmedabad, India.

- Build SaaS platforms with C#, ASP.NET Core, Angular, SQL Server and Azure
- Analyze data with SQL, Python (Pandas), Excel and Power BI
- Write about ASP.NET Core, SQL, Python and Azure

**Portfolio and articles:** https://yashsavaliya1113.github.io/portfolio/
**LinkedIn:** https://www.linkedin.com/in/yash-savaliya-70989a1b4/
**Email:** tpyashsavaliya13092002@gmail.com
```

### One-paragraph bio for C# Corner and directories
Yash Savaliya is a Full Stack .NET Developer and Data Analyst in Ahmedabad, India with 2+ years of experience building SaaS platforms with C#, ASP.NET Core, Angular, SQL Server and Azure, and analyzing data with SQL, Python and Excel. Portfolio: https://yashsavaliya1113.github.io/portfolio/

## How to check progress honestly

- **Is the site indexed?** Search Console (URL Inspection) and Bing Webmaster Tools (URL Inspection) tell you for certain. A `site:` search is unreliable.
- **Does an AI cite you?** Ask ChatGPT, Perplexity and Gemini the questions listed in the weekly SEO watch report. Ask the exact question a recruiter would: ".NET Core developer in Ahmedabad, 1 to 3 years, Web API, SQL Server". Expect nothing for the first weeks.
- **Weekly SEO watch** records your Bing and DuckDuckGo positions every Monday so you can see the first appearance.
