# API target support is limited to provider-specific chat clients

## Problem
The documentation says the tool supports API endpoints, but the API interface manager auto-detects only OpenAI, Gemini, or local OpenAI-compatible endpoints. There is no documented generic HTTP adapter for common conversational APIs that accept `{message: "..."}` or custom request/response mappings.

## Steps to Reproduce
1. Create a simple conversational endpoint with `POST /chat` accepting `{ "message": "hello" }`.
2. Configure a CeRAI target with `application_type` set to `API` and `application_url` pointing to that endpoint.
3. Run the Interface Manager and testcase executor.
4. Observe that the system expects provider-specific clients or an OpenAI-compatible `/v1/chat/completions` shape.

## Impact on Evaluation Quality
The advertised API coverage is narrower than it appears. Many production chatbots expose custom HTTP APIs, so the tool cannot evaluate them without wrapper services or code changes. This reduces practical endpoint coverage and can bias users toward only provider-native LLM tests.

## Suggested Fix
Add a generic API target adapter with configurable method, URL path, headers, request body template, and response JSON path. Validate the adapter with a minimal echo/chat endpoint in CI.
