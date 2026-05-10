## Summary

Fixes API response handling in the testcase executor so valid normalized API responses are not treated as legacy list/dict payloads.

## Problem

The Interface Manager API path returns normalized response text. The testcase executor then checks and stores `agent_response` as if it were still a legacy list/dict response object, which can cause successful API calls to be marked failed or stored incorrectly.

## Changes

- Make `is_error_response()` handle `None`, string responses, and legacy list/dict responses safely.
- Store normalized API response text directly in `conv.agent_response`.
- Use the generated `run_name` consistently in single-testcase execution.
- Respect the supplied `--config` path instead of always using root `config.json`.

## Testing

- Exercised a local OpenAI-compatible API endpoint during the Option B evaluation workflow.
- Confirmed the executor-side patch aligns with the response shape returned by `src/app/interface_manager/routers/common.py` for API targets.

## Notes

This PR is intentionally scoped to executor reliability for API-style evaluation. Broader generic HTTP API adapter support should be tracked separately as an enhancement.
