# Submission Draft

## Repository URL

https://github.com/NiShITa-code/cerai-path-b-eval

## Live Endpoint URL

https://nishita-code.github.io/cerai-path-b-eval/

## Path Chosen

I chose Option B because CeRAI AIEvaluationTool's documented API evaluation path contains a reproducible bug that can prevent valid API responses from being stored and analyzed reliably. The core issue is in the testcase executor: API responses are normalized into text but later handled as if they were legacy list/dict payloads. I documented the bug and related limitations, prepared an upstream fix, and implemented a minimal alternative evaluator that sends text prompts to a conversational endpoint and scores accuracy, safety, and user-experience behavior with transparent, reproducible rules.

## AI Use

AI assistance was used to inspect the CeRAI documentation and source, identify whether the API execution failure was a bug or enhancement, search upstream issues for duplicates, draft issue and PR text, and implement the minimal evaluator/reporting workflow. The main course correction was switching from Option A to Option B after finding that the documented API path could not be trusted without a code fix. I then narrowed the rebuild to a transparent local endpoint and evaluator rather than attempting to recreate the full CeRAI platform.

## Upstream Links

- Main bug issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/145
- Pull request: https://github.com/cerai-iitm/AIEvaluationTool/pull/146
- Optional related issue draft: config path ignored
- Optional enhancement issue draft: generic HTTP API adapter
