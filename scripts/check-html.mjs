import fs from "fs";

const html = fs.readFileSync("out/index.html", "utf8");
console.log("Contains spinner:", html.includes("animate-spin"));
console.log("Contains main-content:", html.includes('id="main-content"'));
console.log("Contains h1:", html.includes("<h1"));
console.log("Contains avatar.webp:", html.includes("avatar.webp"));
console.log("Contains geo.region:", html.includes("geo.region"));
console.log("Contains ProfilePage:", html.includes("ProfilePage"));
console.log("Contains sitemap in robots:", fs.readFileSync("out/robots.txt", "utf8").includes("sitemap.xml"));
console.log("llms.txt size:", fs.statSync("out/llms.txt").size);
console.log("llms-full.txt size:", fs.statSync("out/llms-full.txt").size);
