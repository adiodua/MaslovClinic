// Serverless-функция для Vercel: GET отдаёт текущие цены, PUT обновляет их,
// коммитя assets/prices.json прямо в репозиторий GitHub Pages (после чего
// GitHub Pages сам republish-ит сайт, как при любом другом коммите).
//
// Нужные переменные окружения (задаются в настройках проекта на Vercel):
//   ADMIN_PASSWORD   - общий пароль, который должна присылать админка
//   GITHUB_TOKEN     - персональный токен GitHub с правом
//                      Contents: Read and write на репозиторий сайта
//   GITHUB_REPO      - "владелец/репозиторий", например "yourname/MaslovClinic"
//   GITHUB_BRANCH    - ветка, из которой публикует GitHub Pages, например "main"
//
// Без базы данных: сам assets/prices.json в репозитории И ЕСТЬ база. Так
// вся система остаётся в формате «один файл, одна функция» вместо того,
// чтобы заводить отдельное хранилище.

const crypto = require("crypto");

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "assets/prices.json";
const ALLOWED_ORIGIN = "https://maslovclinic.com";

function unauthorized(res) {
  res.status(401).json({ error: "unauthorized" });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Сравнение без утечки через тайминг: обе строки хешируются с одним и тем же
// случайным ключом до фиксированной длины, поэтому даже разная длина пароля
// не даёт замерить, сколько символов совпало.
function safeCompare(a, b) {
  const key = crypto.randomBytes(32);
  const hashA = crypto.createHmac("sha256", key).update(String(a)).digest();
  const hashB = crypto.createHmac("sha256", key).update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
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
  // Разрешаем вызывать этот API только странице админки на maslovclinic.com.
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
  if (req.method === "OPTIONS") return res.status(204).end();

  const password = req.headers["x-admin-password"];
  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD || "")) {
    // Искусственная задержка на неверном пароле — усложняет перебор,
    // не требуя отдельного хранилища для rate-limit (функция без состояния).
    await delay(700 + Math.floor(Math.random() * 300));
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

      // Для коммита обновления нужен SHA текущего файла (это требование GitHub).
      const current = await githubRequest(getPath);
      const newContent = JSON.stringify(prices, null, 2) + "\n";

      await githubRequest(`/repos/${repo}/contents/${FILE_PATH}`, {
        method: "PUT",
        body: JSON.stringify({
          message: "Обновление цен через админку",
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
