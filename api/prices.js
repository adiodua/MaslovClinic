// Vercel serverless function: GET returns current prices, PUT updates them
// by committing assets/prices.json straight to the GitHub Pages repo (so
// GitHub Pages republishes the site automatically, same as any other commit).
//
// Required environment variables (set in the Vercel project settings):
//   ADMIN_PASSWORD   - shared password the admin page must send
//   GITHUB_TOKEN     - a GitHub personal access token with "repo" scope
//                      (Contents: Read and write) on the site repo
//   GITHUB_REPO      - "owner/repo", e.g. "yourname/MaslovClinic"
//   GITHUB_BRANCH    - branch GitHub Pages deploys from, e.g. "main"
//
// No database: the repo's assets/prices.json IS the database. This keeps
// the whole system to "one file, one function" instead of adding a new
// storage service.

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "assets/prices.json";

function unauthorized(res) {
  res.status(401).json({ error: "unauthorized" });
}

async function githubRequest(path, opts = {}) {
  const res = await fetch(GITHUB_API + path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

module.exports = async function handler(req, res) {
  // Allow the admin page (hosted on maslovclinic.com) to call this API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
  if (req.method === "OPTIONS") return res.status(204).end();

  const password = req.headers["x-admin-password"];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return unauthorized(res);
  }

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const getPath = `/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`;

  try {
    if (req.method === "GET") {
      const file = await githubRequest(getPath);
      const content = Buffer.from(file.content, "base64").toString("utf-8");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(200).send(content);
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const prices = body && body.prices;
      if (!prices || typeof prices !== "object") {
        return res.status(400).json({ error: "expected { prices: { ... } }" });
      }
      for (const [key, val] of Object.entries(prices)) {
        if (typeof val !== "number" || !Number.isFinite(val) || val < 0) {
          return res.status(400).json({ error: `invalid value for ${key}` });
        }
      }

      // Need the current file SHA to commit an update (GitHub requires it).
      const current = await githubRequest(getPath);
      const newContent = JSON.stringify(prices, null, 2) + "\n";

      await githubRequest(`/repos/${repo}/contents/${FILE_PATH}`, {
        method: "PUT",
        body: JSON.stringify({
          message: "Update prices via admin panel",
          content: Buffer.from(newContent, "utf-8").toString("base64"),
          sha: current.sha,
          branch,
        }),
      });

      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT, OPTIONS");
    return res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: String(err.message || err) });
  }
};
