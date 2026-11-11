export interface FaqItem {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
}

/** Visible Q&A on the homepage. The same text feeds the FAQPage JSON-LD, so both always match. */
export const faqs: FaqItem[] = [
  {
    question: "Who is Yash Savaliya?",
    answer:
      "Yash Savaliya is a Full Stack .NET Developer and Data Analyst based in Ahmedabad, Gujarat, India. He holds a B.Tech in Information Technology from RK University and works at iTechOps, where he joined as a Software Development Intern in July 2024 and became a full-time developer in November 2024.",
    links: [{ label: "About Yash", href: "/#about" }],
  },
  {
    question: "What technologies does Yash work with?",
    answer:
      "On the engineering side: C#, ASP.NET Core, Entity Framework Core, Angular, SQL Server, Azure SQL, PostgreSQL, Redis, RabbitMQ and Microsoft Azure. On the analytics side: SQL, Python with Pandas, Excel and Power BI. He is also learning AI integration with Azure OpenAI and Semantic Kernel.",
    links: [{ label: "Skills", href: "/#skills" }],
  },
  {
    question: "What projects has Yash built?",
    answer:
      "Data analytics projects include an analysis of 5,478 Ahmedabad RERA real estate registrations and a SaaS reliability and incident analytics study built on a clearly disclosed synthetic dataset. Software projects include a white-label incident management platform, a FinTech payment gateway and a multi-tenant assessment platform.",
    links: [{ label: "Featured projects", href: "/#projects" }],
  },
  {
    question: "What is Yash's professional experience?",
    answer:
      "Since 2024 at iTechOps he has built and maintained production SaaS platforms for monitoring, assessment and payments. His work includes an alert-processing engine handling 14,000+ alerts a month, a reduction in average incident downtime from over 30 minutes to under 5 minutes, and database query optimisation that improved performance by about 30%.",
    links: [{ label: "Experience", href: "/#experience" }],
  },
  {
    question: "Where can I find Yash's work?",
    answer:
      "Case studies for each project are on this site, and the source code for the SaaS incident analytics project is in the public GitHub repository for this portfolio. Much of his professional work is in private employer repositories, so it is documented here as case studies instead.",
    links: [
      { label: "GitHub profile", href: "https://github.com/yashsavaliya1113" },
      { label: "Technical articles", href: "/blog/" },
    ],
  },
  {
    question: "How can I contact Yash?",
    answer:
      "By email at tpyashsavaliya13092002@gmail.com, or through the contact section of this site and his LinkedIn profile.",
    links: [{ label: "Contact", href: "/#contact" }],
  },
];
