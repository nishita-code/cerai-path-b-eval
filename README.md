# CeRAI Evaluation Tool Critique and Minimal Rebuild

This repository follows **Option B - Critique & Rebuild**.

I chose this path after assessing CeRAI as an end-to-end conversational AI evaluation platform with data management, endpoint execution, strategy-based analysis, and reporting. The tool already supports API, WhatsApp, and web targets, but I found gaps in the API endpoint path: valid API responses could be mishandled by the testcase executor, alternate config usage was fragile, and support for arbitrary HTTP chat APIs was limited. The primary response-handling bug is filed upstream as [Issue #145](https://github.com/cerai-iitm/AIEvaluationTool/issues/145), with a targeted fix proposed in [PR #146](https://github.com/cerai-iitm/AIEvaluationTool/pull/146).

## Contents

- `issues/` - issue drafts with description, reproduction steps, impact, and suggested fixes.
- `patches/` - local patch for the highest-impact CeRAI executor bug found during inspection.
- `src/civic-bot-server.js` - deterministic local conversational endpoint.
- `src/evaluator.js` - minimal viable evaluator that sends text inputs and scores responses.
- `tests/civic-test-suite.json` - test suite covering accuracy, safety, and user experience.
- `results/latest-results.json` - generated evaluation data.
- `docs/index.html` - self-contained live report with an in-browser CivicInfoBot test harness.

## Live Demo

The hosted page is available at:

```text
https://nishita-code.github.io/cerai-path-b-eval/
```

It includes both the written report and an in-browser deterministic CivicInfoBot demo. The local server version is still included so another developer can reproduce the endpoint/evaluator workflow from the command line.

## CeRAI Scope Assessed

CeRAI is broader than a scoring script. From the documentation and source, I understood its intended scope as:

- TDMS/importer flows for managing test plans, prompts, targets, metrics, strategies, and expected responses.
- Interface Manager for communicating with API, WhatsApp, and web application targets.
- Testcase Executor for selecting testcases, sending prompts, and storing conversations/run details.
- Response Analyzer and strategy modules for applying rule-based, model-based, and LLM-as-judge style metrics.
- Dashboard/reporting layers for reviewing runs and results.
- Evaluation areas including responsible AI, conversational quality, safety, language support, task performance, performance/scalability, and privacy.

## CeRAI Limitations And Improvement Areas

These are tool-level limitations I identified:

- **Generic API support is limited:** API evaluation exists, but the implementation is shaped around OpenAI, Gemini, and local OpenAI-compatible endpoints. It does not yet expose a generic adapter for arbitrary HTTP chat APIs with configurable method, path, headers, request body template, response JSON path, timeout, and retry policy.
- **Response capture can be fragile:** The API response-shape bug showed that valid responses could be mishandled before analysis. Since every downstream metric depends on correctly captured responses, this is a foundational reliability issue.
- **Configuration is not fully composable:** The CLI accepts config paths, but parts of the execution flow assume repository-level or service-local config files. This makes running multiple isolated evaluations harder than it should be.
- **Browser/WhatsApp automation is inherently brittle:** XPath-driven automation, credentials, Selenium, QR/session state, and UI timing can break when target UIs change.
- **Several metrics require external services or heavy runtimes:** Some strategies depend on Ollama, GPU services, Sarvam, Perspective API, OpenAI/Gemini, or Hugging Face models. This is valid for advanced evaluation, but makes reproducibility dependent on environment setup.
- **Metric semantics need clearer documentation:** Users need clearer score ranges, dependency lists, pass/fail interpretation, examples, and failure-mode separation.
- **Failure types should be separated more clearly:** Endpoint failure, evaluator failure, infrastructure failure, low-quality model response, and refusal behavior should not collapse into the same kind of low score or log message.

Useful additions would be a generic HTTP API adapter, a lightweight smoke-test mode, stronger preflight validation, clearer metric documentation, better browser failure diagnostics, and first-class multi-turn test scripts.

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

## How The MVP Could Improve

The MVP could be improved with JSON schema validation for test suites, configurable request/response adapters, authentication support, multi-turn conversation state, repeated trials for nondeterministic endpoints, richer scoring methods, CI tests, and clearer separation between endpoint errors and evaluation failures.

## AI Use

AI assistance was used as a support tool to make the work clearer and more polished. It helped with wording, organizing the critique, improving the README/report structure, and debugging parts of the demo workflow. The assessment, issue selection, code review decisions, corrections, and final submission direction were driven and reviewed by me.
