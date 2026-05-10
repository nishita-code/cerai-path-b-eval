# Testcase executor ignores the supplied config path

## Problem
The testcase executor accepts `--config`, but it resolves `config_path` to the repository root `config.json` instead of the user-supplied argument. This makes documented CLI usage misleading and prevents reproducible runs with separate config files.

## Steps to Reproduce
1. Create `configs/example-a.json` and `configs/example-b.json` with different database files or targets.
2. Run `python src/app/testcase_executor/main.py --config configs/example-a.json --get-targets`.
3. Run `python src/app/testcase_executor/main.py --config configs/example-b.json --get-targets`.
4. Observe that the executor still reads the root `config.json`.

## Impact on Evaluation Quality
Evaluations can silently run against the wrong target, database, or interface manager. This is especially risky when comparing conversational endpoints because a run may be attributed to one system while actually using another.

## Suggested Fix
Resolve the config path from `args.config`, preferably relative to the current working directory unless an absolute path is supplied. Log the resolved path at startup.
