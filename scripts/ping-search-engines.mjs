import https from "https";

const INDEXNOW_KEY = "9f8e7d6c5b4a39281726354859607182";
const HOST = "yashsavaliya1113.github.io";
const BASE_URL = "https://yashsavaliya1113.github.io/portfolio";

const urls = [
  `${BASE_URL}/`,
  `${BASE_URL}/blog/`,
  `${BASE_URL}/ai-lab/`,
  `${BASE_URL}/resume/`,
  `${BASE_URL}/projects/white-label-assessment-platform/`,
  `${BASE_URL}/projects/incident-management-platform/`,
  `${BASE_URL}/projects/payment-gateway/`,
  `${BASE_URL}/blog/building-saas-dotnet/`,
];

async function submitIndexNow() {
  const payload = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  });

  return new Promise((resolve) => {
    const req = https.request(
      "https://api.indexnow.org/IndexNow",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      },
    );

    req.on("error", (err) => resolve({ error: err.message }));
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("Notifying search engines and AI crawlers via IndexNow protocol...");
  try {
    const res = await submitIndexNow();
    if (res.status === 200 || res.status === 202) {
      console.log(`✓ IndexNow API accepted ${urls.length} URLs (Status: ${res.status})`);
      console.log("  Notified search engines: Microsoft Bing, Copilot, Yandex, Seznam & AI crawlers.");
    } else {
      console.log(`- IndexNow response: Status ${res.status}`);
    }
  } catch (e) {
    console.error(`- IndexNow notification error: ${e.message}`);
  }
}

main().catch(console.error);
