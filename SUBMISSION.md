# Submission Draft

## Repository URL

TODO: add public GitHub repository URL after push.

## Live Endpoint URL

TODO: add GitHub Pages / deployment URL after publishing `docs/index.html`.

## Path Chosen

I chose Option B because CeRAI AIEvaluationTool's documented API evaluation path contains a reproducible bug that can prevent valid API responses from being stored and analyzed reliably. The core issue is in the testcase executor: API responses are normalized into text but later handled as if they were legacy list/dict payloads. I documented the bug and related limitations, prepared an upstream fix, and implemented a minimal alternative evaluator that sends text prompts to a conversational endpoint and scores accuracy, safety, and user-experience behavior with transparent, reproducible rules.

## AI Use

AI assistance was used to inspect the CeRAI documentation and source, identify whether the API execution failure was a bug or enhancement, search upstream issues for duplicates, draft issue and PR text, and implement the minimal evaluator/reporting workflow. The main course correction was switching from Option A to Option B after finding that the documented API path could not be trusted without a code fix. I then narrowed the rebuild to a transparent local endpoint and evaluator rather than attempting to recreate the full CeRAI platform.

## Upstream Links

- TODO: main bug issue URL
- TODO: PR URL
- Optional related issue: config path ignored
- Optional enhancement issue: generic HTTP API adapter
