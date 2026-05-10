# Submission Draft

## Repository URL

https://github.com/NiShITa-code/cerai-path-b-eval

## Live Endpoint URL

https://nishita-code.github.io/cerai-path-b-eval/

## Path Chosen

I chose Option B after assessing CeRAI as an end-to-end conversational AI evaluation platform with data management, endpoint execution, strategy-based analysis, and reporting. The tool already supports API, WhatsApp, and web targets, but I found that the API endpoint path was not yet robust enough for generic reproducible endpoint evaluation: valid API responses could be mishandled by the testcase executor, alternate config usage was fragile, and support for arbitrary HTTP chat APIs was limited. I documented these findings through upstream issues, opened a targeted PR for the response-handling bug, and implemented a minimal alternative evaluator to demonstrate the core API evaluation loop: send text inputs to a conversational endpoint, assess responses across accuracy/safety/UX rules, and produce machine-readable results plus a self-contained report.

## AI Use

AI assistance was used as a support tool to make the work clearer and more polished. It helped with wording, organizing the critique, improving the README/report structure, and debugging parts of the demo workflow. The assessment, issue selection, code review decisions, corrections, and final submission direction were driven and reviewed by me.

## Upstream Links

- Main bug issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/145
- Config-path bug issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/147
- Generic API adapter enhancement issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/148
- Pull request: https://github.com/cerai-iitm/AIEvaluationTool/pull/146
