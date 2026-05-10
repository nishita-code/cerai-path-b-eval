# Submission Draft

## Repository URL

https://github.com/NiShITa-code/cerai-path-b-eval

## Live Endpoint URL

https://nishita-code.github.io/cerai-path-b-eval/

## Path Chosen

I chose Option B because CeRAI AIEvaluationTool's documented API evaluation path contains a reproducible bug that can prevent valid API responses from being stored and analyzed reliably. The core issue is in the testcase executor: API responses are normalized into text but later handled as if they were legacy list/dict payloads. I documented the bug and related limitations, prepared an upstream fix, and implemented a minimal alternative evaluator that sends text prompts to a conversational endpoint and scores accuracy, safety, and user-experience behavior with transparent, reproducible rules.

## AI Use

AI assistance was used to create the CivicInfoBot demo endpoint, design the evaluation test suite, debug the evaluator, and generate the self-contained report. I chose a local deterministic bot so the alternative evaluator could be demonstrated reproducibly without external API keys, authentication, or rate limits.

## Upstream Links

- Main bug issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/145
- Config-path bug issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/147
- Generic API adapter enhancement issue: https://github.com/cerai-iitm/AIEvaluationTool/issues/148
- Pull request: https://github.com/cerai-iitm/AIEvaluationTool/pull/146
