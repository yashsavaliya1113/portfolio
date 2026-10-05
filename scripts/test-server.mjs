import http from "http";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");
const PORT = 3333;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  // Strip /portfolio prefix if present
  if (reqPath.startsWith("/portfolio")) {
    reqPath = reqPath.slice("/portfolio".length);
  }
  if (!reqPath || reqPath === "/") {
    reqPath = "/index.html";
  }

  let filePath = path.join(outDir, reqPath);

  // If path doesn't have an extension, check if it's a directory with index.html or file.html
  if (!path.extname(filePath)) {
    if (fs.existsSync(path.join(filePath, "index.html"))) {
      filePath = path.join(filePath, "index.html");
    } else if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(outDir, "404.html");
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    const acceptEncoding = req.headers["accept-encoding"] || "";

    const headers = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    const isCompressible = [".html", ".js", ".css", ".json", ".xml", ".txt", ".svg"].includes(ext);

    if (isCompressible && acceptEncoding.includes("gzip")) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      const raw = fs.createReadStream(filePath);
      const gzip = zlib.createGzip({ level: 9 });
      raw.pipe(gzip).pipe(res);
    } else {
      headers["Content-Length"] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Test server with GZIP & Caching running at http://127.0.0.1:${PORT}/portfolio/`);
});
