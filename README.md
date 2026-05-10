# CeRAI Evaluation Tool Critique and Minimal Rebuild

This repository follows **Option B - Critique & Rebuild**.

I chose this path because the CeRAI AIEvaluationTool v2.0 API flow contains defects that make documented API endpoint evaluation unreliable without local code changes. The strongest finding is that valid API responses are normalized to text but later treated as legacy list/dict payloads in the testcase executor, so runs can fail or store no usable response. This is filed upstream as [Issue #145](https://github.com/cerai-iitm/AIEvaluationTool/issues/145), with a targeted fix proposed in [PR #146](https://github.com/cerai-iitm/AIEvaluationTool/pull/146).

## Contents

- `issues/` - issue drafts with description, reproduction steps, impact, and suggested fixes.
- `patches/` - local patch for the highest-impact CeRAI executor bug found during inspection.
- `src/civic-bot-server.js` - deterministic local conversational endpoint.
- `src/evaluator.js` - minimal viable evaluator that sends text inputs and scores responses.
- `tests/civic-test-suite.json` - test suite covering accuracy, safety, and user experience.
- `results/latest-results.json` - generated evaluation data.
- `docs/index.html` - self-contained live report.

## Run Locally

Use Node.js 20.19 or newer.

```powershell
npm install
npm run bot
```

In a second terminal:

```powershell
npm run all
npm run report:serve
```

Open:

```text
http://localhost:9320
```

The evaluator sends requests to `http://localhost:9100/chat` by default. Override it with:

```powershell
$env:CHAT_ENDPOINT="http://localhost:9100/chat"
npm run eval
```

## Upstream Issue and PR

- Filed bug: [API mode mishandles valid response text in testcase executor](https://github.com/cerai-iitm/AIEvaluationTool/issues/145)
- Filed bug: [Testcase executor ignores the supplied config path](https://github.com/cerai-iitm/AIEvaluationTool/issues/147)
- Filed enhancement: [API target support is limited to provider-specific chat clients](https://github.com/cerai-iitm/AIEvaluationTool/issues/148)
- Pull request: [Fix API response handling in testcase executor](https://github.com/cerai-iitm/AIEvaluationTool/pull/146)

## Local CeRAI Fix

The patch in `patches/cerai-api-executor-response-fix.diff` fixes the highest-impact API execution bug found during inspection. It makes the executor handle normalized string responses safely, stores API response text directly, respects the supplied `--config` path, and uses the generated run name consistently in single-testcase execution.

## What the Alternative Does

The alternative evaluator:

1. Reads a JSON test suite.
2. Sends each prompt to a conversational endpoint.
3. Records the raw response and latency.
4. Scores responses using transparent rules per metric.
5. Writes machine-readable JSON and a self-contained HTML report.

## What It Does Not Do

It does not handle multi-turn conversations, browser automation, WhatsApp, model-judge grading, semantic embeddings, authentication flows, or confidence intervals. It is intentionally a minimal viable replacement for the broken API-path use case, not a full CeRAI replacement.

## AI Use

AI assistance was used to inspect the CeRAI documentation and source, identify reproducible defects in the API execution path, design the issue structure, and implement the minimal evaluator/reporting workflow. The main course correction was switching from Option A to Option B after discovering that the API execution path could not reliably persist valid responses without patching the tool.
