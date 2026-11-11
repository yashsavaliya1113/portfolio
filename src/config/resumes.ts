const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";

export interface ResumeOption {
  id: string;
  label: string;
  description: string;
  href: string;
  /** File name the browser saves the PDF as. */
  filename: string;
}

/**
 * The resume variants offered on the site. To update one, replace the PDF in /public
 * (keep the file name) and redeploy. /resume.pdf is kept as an alias of the .NET resume so old links still work.
 */
export const resumes: ResumeOption[] = [
  {
    id: "dotnet-developer",
    label: ".NET Developer resume",
    description: "C#, ASP.NET Core, Angular, Azure, SaaS platforms",
    href: `${basePath}/resume-dotnet-developer.pdf`,
    filename: "Yash-Savaliya-Resume-DotNet-Developer.pdf",
  },
  {
    id: "data-analyst",
    label: "Data Analyst resume",
    description: "SQL, Python, Excel, Power BI, analytics projects",
    href: `${basePath}/resume-data-analyst.pdf`,
    filename: "Yash-Savaliya-Resume-Data-Analyst.pdf",
  },
];
