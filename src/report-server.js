import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.REPORT_PORT || 9320);
const root = path.resolve("docs");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://localhost:${port}`).pathname;
    const requested = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.resolve(root, `.${requested}`);
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await fs.readFile(filePath);
    res.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] || "text/plain; charset=utf-8" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Report available at http://localhost:${port}`);
});
