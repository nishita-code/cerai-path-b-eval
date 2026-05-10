# API mode stores valid responses incorrectly or fails execution

## Problem
The testcase executor normalizes an API response into a string, then passes that string into `is_error_response()` and later stores it as if it were the old list/dict response shape. A valid API response can therefore be marked as failed or trigger an exception while storing `conv.agent_response`.

## Steps to Reproduce
1. Configure a target with `application_type` set to `API`.
2. Start Interface Manager and point it at a local OpenAI-compatible `/v1/chat/completions` endpoint.
3. Run `python src/app/testcase_executor/main.py --config config.json --testplan-id 1 --execute`.
4. Observe that the API endpoint returns valid text, but the executor handles `agent_response` as both a string and a list/dict.

## Impact on Evaluation Quality
This breaks the central API evaluation loop: prompts may be sent successfully, but the collected response is not reliably persisted. Downstream analysis and reporting then operate on missing or failed run details, which makes API endpoint evaluation untrustworthy.

## Suggested Fix
Normalize responses once into a string and keep the executor storage path string-based for API responses. Update `is_error_response()` to accept strings, list/dict legacy responses, and `None` safely. Store `conv.agent_response = agent_response` after normalization.
