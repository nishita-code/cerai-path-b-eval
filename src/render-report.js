import fs from "node:fs/promises";
import path from "node:path";

const resultsPath = process.env.RESULTS_PATH || "results/latest-results.json";
const outputPath = process.env.REPORT_PATH || "docs/index.html";
const report = JSON.parse(await fs.readFile(resultsPath, "utf8"));

const issueLinks = [
  ["Issue #145: API response-shape bug", "https://github.com/cerai-iitm/AIEvaluationTool/issues/145"],
  ["Issue #147: config argument ignored", "https://github.com/cerai-iitm/AIEvaluationTool/issues/147"],
  ["Issue #148: generic API adapter support", "https://github.com/cerai-iitm/AIEvaluationTool/issues/148"],
  ["PR #146: executor fix", "https://github.com/cerai-iitm/AIEvaluationTool/pull/146"],
];

const rows = report.results.map(item => `
  <tr>
    <td>${item.id}</td>
    <td>${item.metric}</td>
    <td>${item.score.toFixed(3)}</td>
    <td>${item.passed ? "Pass" : "Fail"}</td>
    <td>${escapeHtml(item.reason)}</td>
  </tr>`).join("");

const metricCards = Object.entries(report.summary.by_metric).map(([metric, value]) => `
  <section class="metric">
    <h3>${metric}</h3>
    <p><strong>${Math.round(value.pass_rate * 100)}%</strong> pass rate</p>
    <p>${value.count} cases, average score ${value.average_score.toFixed(3)}</p>
  </section>`).join("");

const machineBlock = {
  path: "Option B - Critique and Rebuild",
  endpoint: "CivicInfoBot local conversational endpoint",
  tool_critiqued: "CeRAI AIEvaluationTool v2.0",
  issues: issueLinks.map(([title, href]) => ({ title, href })),
  summary: report.summary
};

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CeRAI AI Evaluation Tool Critique and Rebuild</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #17202a;
      --muted: #5d6b78;
      --line: #d8dee6;
      --paper: #ffffff;
      --band: #f4f7f9;
      --accent: #0b6b5d;
      --warn: #a45108;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background: var(--paper);
      line-height: 1.5;
    }
    header {
      padding: 48px max(24px, calc((100vw - 1100px) / 2)) 28px;
      border-bottom: 1px solid var(--line);
      background: var(--band);
    }
    main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 28px 24px 56px;
    }
    h1 { margin: 0 0 12px; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.05; }
    h2 { margin-top: 38px; font-size: 1.45rem; }
    h3 { margin: 0 0 8px; }
    p { max-width: 82ch; }
    .lede { font-size: 1.1rem; color: var(--muted); }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin: 24px 0;
    }
    .stat, .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      background: #fff;
    }
    .stat strong { display: block; font-size: 2rem; color: var(--accent); }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 0.95rem;
    }
    th, td {
      border-bottom: 1px solid var(--line);
      text-align: left;
      padding: 10px 8px;
      vertical-align: top;
    }
    th { background: var(--band); }
    code, pre {
      background: #eef2f4;
      border-radius: 6px;
    }
    code { padding: 2px 4px; }
    pre { padding: 14px; overflow: auto; }
    .callout {
      border-left: 4px solid var(--warn);
      padding: 12px 16px;
      background: #fff7ed;
      max-width: 82ch;
    }
  </style>
  <script type="application/json" id="evaluation-summary">${escapeHtml(JSON.stringify(machineBlock, null, 2))}</script>
</head>
<body>
  <header>
    <h1>CeRAI Evaluation Tool Critique and Minimal Rebuild</h1>
    <p class="lede">Option B submission using a local civic-information conversational endpoint, issue-quality critique, and a reproducible evaluator that sends text inputs and scores responses.</p>
  </header>
  <main>
    <section class="summary">
      <div class="stat"><strong>${Math.round(report.summary.pass_rate * 100)}%</strong> overall pass rate</div>
      <div class="stat"><strong>${report.summary.average_score.toFixed(3)}</strong> average score</div>
      <div class="stat"><strong>${report.summary.total_cases}</strong> test cases</div>
      <div class="stat"><strong>${report.summary.average_latency_ms} ms</strong> average latency</div>
    </section>

    <h2>Path Chosen</h2>
    <p>I chose Option B because the CeRAI tool's documented API path is not only difficult to configure, but also contains execution defects that prevent valid API responses from being stored reliably. That undermines the core evaluation loop for API-based conversational endpoints, so a critique plus a minimal alternative is the more honest submission.</p>

    <h2>What Was Broken or Insufficient</h2>
    <p>The most severe defect is in the testcase executor response handling. The interface manager returns normalized text for API responses, but the executor continues to treat the value as a legacy list/dict payload. A valid response can therefore be interpreted as an error or fail while being stored. The repository also ignores the user-supplied config filename in the executor, and the API connector is limited to OpenAI, Gemini, or local OpenAI-compatible endpoints rather than arbitrary conversational HTTP APIs.</p>
    <p>The primary bug is filed upstream as <a href="https://github.com/cerai-iitm/AIEvaluationTool/issues/145">Issue #145</a>, with a targeted fix proposed in <a href="https://github.com/cerai-iitm/AIEvaluationTool/pull/146">PR #146</a>. Related findings were also filed as <a href="https://github.com/cerai-iitm/AIEvaluationTool/issues/147">Issue #147</a> for the ignored config argument and <a href="https://github.com/cerai-iitm/AIEvaluationTool/issues/148">Issue #148</a> for generic API adapter support.</p>

    <h2>Alternative Design</h2>
    <p>The replacement evaluator is deliberately small: it reads a JSON test suite, sends each text prompt to a conversational endpoint, records latency and raw responses, then scores each answer using transparent metric-specific rules. This is less ambitious than CeRAI, but its behavior is reproducible, inspectable, and does not require database setup, Selenium, WhatsApp login, or external model keys.</p>

    <h2>Endpoint Evaluated</h2>
    <p>The endpoint is <code>CivicInfoBot</code>, a deterministic local conversational service for city transit and civic-service questions. It was chosen because a constrained domain makes accuracy, safety, and user-experience expectations explicit enough to evaluate without a hidden judge model.</p>

    <h2>Test Suite</h2>
    <p>${escapeHtml(report.suite.rationale)}</p>

    <div class="metrics">${metricCards}</div>

    <h2>Results</h2>
    <table>
      <thead><tr><th>ID</th><th>Metric</th><th>Score</th><th>Status</th><th>Interpretation</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <h2>Conclusions</h2>
    <p>The minimal evaluator successfully exercises the endpoint and produces understandable results. The civic bot performs well on the deliberately scoped questions, especially safety redirects and factual route answers. These results should not be generalized to open-domain assistants because the endpoint is deterministic, the suite is small, and the scoring rules are transparent heuristics rather than human or model-judge review.</p>

    <h2>Machine-Readable Summary</h2>
    <pre>${escapeHtml(JSON.stringify(machineBlock, null, 2))}</pre>

    <div class="callout">Limitations: this alternative does not support multi-turn state, browser automation, WhatsApp, statistical confidence intervals, or semantic grading. It is intentionally a minimal viable evaluator, not a full replacement for a mature evaluation platform.</div>
  </main>
</body>
</html>`;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, html);
console.log(`Rendered ${outputPath}`);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
